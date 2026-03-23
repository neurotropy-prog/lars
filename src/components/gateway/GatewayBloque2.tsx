'use client'

/**
 * GatewayBloque2 — P5 → P6 → Micro-espejo 2 → P7 (sliders) → P8
 *
 * A-04: Cross-fade entre pasos (mismo patrón que GatewayBloque1).
 * A-07: Sliders con color dinámico en SlidersStep.
 * A-08: Micro-espejo 2 intensificado (fondo más oscuro, texto más grande, delay mayor).
 *
 * P6 — la más importante — tiene diseño visual reforzado (padding mayor, fuente más grande).
 *
 * Progreso: 60% → 70% → 75% (pausa) → 82% → 90%
 * Al completar P8, llama a onComplete con todas las respuestas del bloque.
 */

import { useState, useCallback, useEffect } from 'react'
import ZoneWrapper, { getZoneBg } from './ZoneWrapper'
import SingleSelectStep from './SingleSelectStep'
import SlidersStep from './SlidersStep'
import MicroEspejo from '@/components/ui/MicroEspejo'
import ProgressBar from '@/components/ui/ProgressBar'
import { useNervousSystem } from '@/contexts/NervousSystemContext'
import {
  P5_OPTIONS,
  P6_OPTIONS,
  P7_SLIDERS,
  P8_OPTIONS,
  getMicroEspejo2,
  type Bloque2Answers,
} from '@/lib/gateway-bloque2-data'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Step = 'p5' | 'p6' | 'micro-espejo-2' | 'p7' | 'p8'
type Zone = 'exploracion' | 'reflexion'

// Sprint 3: non-linear progress — micro-mirror 2 PAUSES at same % as P6
const PROGRESS: Record<Step, number> = {
  p5: 60,
  p6: 72,
  'micro-espejo-2': 72,   // PAUSE — bar stays at 72% during micro-mirror 2
  p7: 85,
  p8: 90,
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface GatewayBloque2Props {
  p1: string
  /** Respuestas de Bloque 1 — usadas para personalización de tono */
  p4: string
  onComplete: (answers: Bloque2Answers) => void
  onClose?: () => void
}

// ─── ESTILOS COMPARTIDOS ──────────────────────────────────────────────────────

const continueButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--space-4) var(--space-6)',
  borderRadius: 'var(--radius-lg)',
  border: 'var(--border-subtle)',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-inter)',
  fontSize: 'var(--text-body-sm)',
  cursor: 'pointer',
  transition: 'color var(--transition-fast), border-color var(--transition-fast)',
  minHeight: '44px',
  marginTop: 'var(--space-2)',
}

const overlineStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 'var(--text-body-sm)',
  lineHeight: 'var(--lh-body-sm)',
  color: 'var(--color-text-tertiary)',
  letterSpacing: 'var(--ls-overline)',
  textTransform: 'uppercase',
  marginBottom: 'var(--space-4)',
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function GatewayBloque2({
  p4,
  onComplete,
  onClose,
}: GatewayBloque2Props) {
  // ── Estado de pasos con cross-fade (A-04) ──
  const [step, setStep] = useState<Step>('p5')
  const [stepKey, setStepKey] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const { setState: setNervousState } = useNervousSystem()

  // Nervous system: flowing from P7 onward
  useEffect(() => {
    if (step === 'p7' || step === 'p8') {
      setNervousState('flowing')
    }
  }, [step, setNervousState])

  // ── Zona y respuestas ──
  const [zone, setZone] = useState<Zone>('exploracion')
  const [p5, setP5] = useState('')
  const [p6, setP6] = useState('')
  const [sliders, setSliders] = useState<Record<string, number | undefined>>({})
  const [p8, setP8] = useState('')

  // ── changeStep: cross-fade A-04 ──
  const changeStep = useCallback((newStep: Step) => {
    setIsExiting(true)
    setTimeout(() => {
      setStep(newStep)
      setStepKey((k) => k + 1)
      setIsExiting(false)
    }, 200)
  }, [])

  // ── Handlers ──
  const handleP5Select = useCallback(
    (id: string) => {
      setP5(id)
      changeStep('p6')
    },
    [changeStep]
  )

  const handleP6Select = useCallback(
    (id: string) => {
      setP6(id)
      setZone('reflexion')
      changeStep('micro-espejo-2')
    },
    [changeStep]
  )

  const handleMicroEspejo2Continue = useCallback(() => {
    setZone('exploracion')
    changeStep('p7')
  }, [changeStep])

  const handleP7Continue = useCallback(
    (values: Record<string, number>) => {
      setSliders(values)
      changeStep('p8')
    },
    [changeStep]
  )

  const handleP8Select = useCallback(
    (id: string) => {
      setP8(id)
      onComplete({ p5, p6, sliders, p8: id })
    },
    [onComplete, p5, p6, sliders]
  )

  // ── Contenido calculado ──
  const microEspejo2Content = getMicroEspejo2(p6 || 'A')

  const progress = PROGRESS[step]
  const progressLabel = `Tu diagnóstico: ${progress}% completo`

  // ── Ajuste de tono según P4 (personalización invisible) ──
  // Fuerte (P4=D): contexto más directo
  // Cuidador (P4=C): tono más suave
  // El copy base de P5/P6 no cambia — solo el contexto sutil
  const p5Context =
    p4 === 'D'
      ? 'El 41% de personas con tu perfil no recuerdan cuándo fue la última vez.'
      : p4 === 'C'
      ? 'No hay prisa. Tómate tu tiempo para responder.'
      : p4 === 'E'
      ? 'Basado en tu combinación anterior, esta dimensión es clave.'
      : 'El 41% de personas que hacen este diagnóstico no recuerdan cuándo fue.'

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div
      className="gateway-overlay"
      role="main"
      aria-label="Diagnóstico — Gateway L.A.R.S. Bloque 2"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: getZoneBg(zone),
        transition: 'background-color 600ms var(--ease-zone)',
      }}
    >
      {/* ── Barra de progreso sticky ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: getZoneBg(zone),
          transition: 'background-color 600ms var(--ease-zone)',
          padding: 'var(--space-4) var(--container-padding-mobile)',
          paddingBottom: 'var(--space-3)',
          borderBottom: 'var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          {onClose && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 'var(--space-3)',
              }}
            >
              <button
                onClick={onClose}
                aria-label="Volver a la landing"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  fontSize: 'var(--text-body-sm)',
                  fontFamily: 'var(--font-inter)',
                  transition: 'color var(--transition-fast)',
                }}
              >
                ← Volver
              </button>
            </div>
          )}
          <ProgressBar value={progress} label={progressLabel} />
        </div>
      </div>

      {/* ── ZoneWrapper ── */}
      <ZoneWrapper zone={zone}>
        {/* Cross-fade container (A-04) */}
        <div
          key={stepKey}
          className={isExiting ? 'step-exit' : 'step-enter'}
        >
          {/* P5 — Alegría de vivir */}
          {step === 'p5' && (
            <SingleSelectStep
              question="¿Cuándo fue la última vez que disfrutaste algo de verdad — sin culpa, sin prisa, sin pensar en lo siguiente?"
              collectiveData={p5Context}
              options={P5_OPTIONS}
              onSelect={handleP5Select}
            />
          )}

          {/* P6 — Frase identitaria (diseño reforzado) */}
          {step === 'p6' && (
            <div>
              {/* Overline que marca importancia */}
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-accent)',
                  letterSpacing: 'var(--ls-overline)',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-4)',
                }}
              >
                La pregunta clave
              </p>
              <SingleSelectStep
                question="¿Cuál de estas frases sientes más verdadera ahora mismo?"
                collectiveData="Cada una de estas frases la ha elegido más de 1.000 personas antes que tú."
                options={P6_OPTIONS}
                reinforced
                onSelect={handleP6Select}
              />
            </div>
          )}

          {/* Micro-espejo 2 — A-08: versión intensificada, stagger con delay largo */}
          {step === 'micro-espejo-2' && (
            <div>
              <p className="mirror-stagger-label" style={overlineStyle}>Tu patrón — 75% completado</p>
              <MicroEspejo
                observation={microEspejo2Content.text}
                collectiveData={microEspejo2Content.collectiveData}
                intensified
              />
              {/* Delay del botón: 3000ms (más largo que M1 para que la persona procese P6) */}
              <button
                className="mirror-stagger-button-intensified"
                onClick={handleMicroEspejo2Continue}
                style={continueButtonStyle}
              >
                Continuar el diagnóstico →
              </button>
            </div>
          )}

          {/* P7 — Sliders A-07 */}
          {step === 'p7' && (
            <SlidersStep
              question="En una escala del 1 al 10, ¿cómo calificarías cada una de estas áreas?"
              sliders={P7_SLIDERS}
              onContinue={handleP7Continue}
            />
          )}

          {/* P8 — Duración */}
          {step === 'p8' && (
            <SingleSelectStep
              question="¿Cuánto tiempo llevas sintiéndote así?"
              context="La duración importa: determina cómo responde tu cuerpo a la intervención."
              options={P8_OPTIONS}
              onSelect={handleP8Select}
            />
          )}
        </div>
      </ZoneWrapper>
    </div>
  )
}
