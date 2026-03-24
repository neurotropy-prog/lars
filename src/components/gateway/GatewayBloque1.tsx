'use client'

/**
 * GatewayBloque1 — P2 → Analizando → Primera Verdad → P3 → P4 → Micro-espejo 1
 *
 * A-04: Cross-fade entre pasos con changeStep (exit 200ms → enter 300ms).
 *       NUNCA corte seco entre preguntas.
 *
 * Al completar Micro-espejo 1, llama a onComplete con las respuestas
 * para que GatewayController pase al Bloque 2.
 */

import { useState, useCallback, useRef } from 'react'
import ZoneWrapper, { getZoneBg } from './ZoneWrapper'
import AnalyzingScreen from './AnalyzingScreen'
import SingleSelectStep from './SingleSelectStep'
import MultiSelectStep from './MultiSelectStep'
import MicroEspejo from '@/components/ui/MicroEspejo'
import ProgressBar from '@/components/ui/ProgressBar'
import {
  P2_OPTIONS,
  P3_OPTIONS,
  P4_OPTIONS,
  getPrimeraVerdad,
  getMicroEspejo1,
} from '@/lib/gateway-bloque1-data'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Step = 'p2' | 'analyzing' | 'primera-verdad' | 'p3' | 'p4' | 'micro-espejo-1'
type Zone = 'exploracion' | 'reflexion'

export interface Bloque1Answers {
  p2: string
  p3Selections: string[]
  p4: string
}

// Progreso no lineal — pausa en revelaciones (barra no avanza)
// Sprint 3: new values — mirrors PAUSE at same % as preceding question
const PROGRESS: Record<Step, number> = {
  p2: 22,
  analyzing: 22,
  'primera-verdad': 22,    // PAUSE — bar stays at 22% during first truth
  p3: 38,
  p4: 48,
  'micro-espejo-1': 48,   // PAUSE — bar stays at 48% during micro-mirror 1
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface GatewayBloque1Props {
  p1: string
  onComplete: (answers: Bloque1Answers) => void
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

export default function GatewayBloque1({
  p1,
  onComplete,
  onClose,
}: GatewayBloque1Props) {
  // ── Estado de pasos con cross-fade (A-04) ──
  const overlayRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>('p2')
  const [stepKey, setStepKey] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  // ── Zona y respuestas ──
  const [zone, setZone] = useState<Zone>('exploracion')
  const [p2, setP2] = useState('')
  const [p3Selections, setP3Selections] = useState<string[]>([])
  const [p4, setP4] = useState('')

  // ── changeStep: fade-out 200ms → nuevo paso con step-enter ──
  // A-04: exit 300ms + breath 100ms = 400ms before new step mounts
  const changeStep = useCallback((newStep: Step) => {
    setIsExiting(true)
    setTimeout(() => {
      setStep(newStep)
      setStepKey((k) => k + 1)
      setIsExiting(false)
      setTimeout(() => overlayRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }, 400)
  }, [])

  // ── Handlers ──
  const handleP2Select = useCallback(
    (id: string) => {
      setP2(id)
      setZone('reflexion')
      changeStep('analyzing')
    },
    [changeStep]
  )

  const handleAnalyzingComplete = useCallback(() => {
    changeStep('primera-verdad')
  }, [changeStep])

  const handlePrimeraVerdadContinue = useCallback(() => {
    setZone('exploracion')
    changeStep('p3')
  }, [changeStep])

  const handleP3Continue = useCallback(
    (selections: string[]) => {
      setP3Selections(selections)
      changeStep('p4')
    },
    [changeStep]
  )

  const handleP4Select = useCallback(
    (id: string) => {
      setP4(id)
      setZone('reflexion')
      changeStep('micro-espejo-1')
    },
    [changeStep]
  )

  const handleMicroEspejo1Continue = useCallback(() => {
    onComplete({ p2, p3Selections, p4 })
  }, [onComplete, p2, p3Selections, p4])

  // ── Contenido calculado ──
  const primeraVerdad = getPrimeraVerdad(p1 || 'A', p2 || 'B')
  const microEspejo1Content = getMicroEspejo1(p3Selections, p4 || 'A')

  const progress = PROGRESS[step]
  const progressLabel = `Tu regulación: ${progress}% completo`

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={overlayRef}
      className="gateway-overlay"
      role="main"
      aria-label="Evaluación — Gateway L.A.R.S."
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
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

      {/* ── ZoneWrapper — fondo que cambia y respira ── */}
      <ZoneWrapper zone={zone}>
        {/*
          Cross-fade container (A-04):
          key={stepKey} → React remonta el elemento en cada cambio de paso
          className → step-exit mientras sale (200ms), step-enter cuando entra (350ms)
        */}
        <div
          key={stepKey}
          className={isExiting ? 'step-exit' : 'step-enter'}
        >
          {/* P2 */}
          {step === 'p2' && (
            <SingleSelectStep
              question="¿Cómo son tus noches últimamente?"
              context="Tu sueño es el indicador más fiable de cómo está tu sistema nervioso."
              options={P2_OPTIONS}
              onSelect={handleP2Select}
            />
          )}

          {/* Analizando... */}
          {step === 'analyzing' && (
            <AnalyzingScreen onComplete={handleAnalyzingComplete} />
          )}

          {/* Primera Verdad — stagger: label → observation → data → button */}
          {step === 'primera-verdad' && (
            <div>
              <p className="mirror-stagger-label" style={overlineStyle}>Lo que revelan tus respuestas</p>
              <MicroEspejo
                observation={primeraVerdad.text}
                collectiveData={primeraVerdad.collectiveData}
              />
              <button
                className="mirror-stagger-button"
                onClick={handlePrimeraVerdadContinue}
                style={continueButtonStyle}
              >
                Seguir con mi evaluación →
              </button>
            </div>
          )}

          {/* P3 — Claridad cognitiva (selección múltiple) */}
          {step === 'p3' && (
            <MultiSelectStep
              question="¿Reconoces alguna de estas señales en tu día a día?"
              context="Tu cerebro consume el 20% de tu energía total. Cuando el sistema nervioso está en alerta, desvía esos recursos a la supervivencia."
              collectiveData="El 68% de ejecutivos con tu perfil reportan 3 o más de estos síntomas."
              options={P3_OPTIONS}
              onContinue={handleP3Continue}
            />
          )}

          {/* P4 — Equilibrio emocional */}
          {step === 'p4' && (
            <SingleSelectStep
              question="¿Cuál de estas frases podrías haber dicho tú esta semana?"
              context="La reactividad emocional no es un defecto de carácter. Es la respuesta de un cerebro que ha agotado los recursos para regular."
              collectiveData="Esta es la pregunta que más tarda en responderse. Tómate tu tiempo."
              options={P4_OPTIONS}
              onSelect={handleP4Select}
            />
          )}

          {/* Micro-espejo 1 — stagger: label → observation → data → button */}
          {step === 'micro-espejo-1' && (
            <div>
              <p className="mirror-stagger-label" style={overlineStyle}>Tu patrón — 50% completado</p>
              <MicroEspejo
                observation={microEspejo1Content.text}
                collectiveData={microEspejo1Content.collectiveData}
              />
              <button
                className="mirror-stagger-button"
                onClick={handleMicroEspejo1Continue}
                style={continueButtonStyle}
              >
                Continuar la evaluación →
              </button>
            </div>
          )}
        </div>
      </ZoneWrapper>
    </div>
  )
}
