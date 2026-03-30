'use client'

/**
 * GatewayBloque1 — Orquestador del primer bloque del gateway.
 *
 * Flujo: P2 → Analizando → Primera Verdad → P3 → P4 → Micro-espejo 1
 *
 * Gestiona:
 * - Máquina de estados (step)
 * - Zona activa (exploración / reflexión)
 * - Progreso no lineal (congela en revelaciones)
 * - Transiciones visuales entre zonas
 *
 * Fase 1: diseño visual con datos ficticios (P1=A pasado por prop).
 * Fase 2 (siguiente sesión): conectar localStorage, UTM, recorridos adaptativos.
 */

import { useState, useCallback } from 'react'
import ZoneWrapper from './ZoneWrapper'
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

type Step =
  | 'p2'
  | 'analyzing'
  | 'primera-verdad'
  | 'p3'
  | 'p4'
  | 'micro-espejo-1'
  | 'done'

type Zone = 'exploracion' | 'reflexion'

// Progreso no lineal — congela en revelaciones
const PROGRESS: Record<Step, number> = {
  p2: 20,
  analyzing: 20,
  'primera-verdad': 20,
  p3: 35,
  p4: 45,
  'micro-espejo-1': 50,
  done: 50,
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface GatewayBloque1Props {
  /** Respuesta de P1 — viene del hero (HeroSection → P1Cards) */
  p1: string
  /** Callback para volver a la landing (botón × para demos) */
  onClose?: () => void
  /** Callback al completar el bloque — sube p4 al padre para Bloque 2 */
  onComplete?: (p4: string) => void
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function GatewayBloque1({ p1, onClose, onComplete }: GatewayBloque1Props) {
  const [step, setStep] = useState<Step>('p2')
  const [zone, setZone] = useState<Zone>('exploracion')
  const [p2, setP2] = useState<string>('')
  const [p3Selections, setP3Selections] = useState<string[]>([])
  const [p4, setP4] = useState<string>('')

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  const handleP2Select = useCallback((id: string) => {
    setP2(id)
    setZone('reflexion')   // fondo empieza a oscurecer
    setStep('analyzing')   // "Analizando..."
  }, [])

  const handleAnalyzingComplete = useCallback(() => {
    setStep('primera-verdad')
  }, [])

  const handlePrimeraVerdadContinue = useCallback(() => {
    setZone('exploracion')
    setStep('p3')
  }, [])

  const handleP3Continue = useCallback((selections: string[]) => {
    setP3Selections(selections)
    setStep('p4')
  }, [])

  const handleP4Select = useCallback((id: string) => {
    setP4(id)
    setZone('reflexion')
    setStep('micro-espejo-1')
  }, [])

  const handleMicroEspejo1Continue = useCallback(() => {
    if (onComplete) {
      onComplete(p4)
    } else {
      setStep('done')
    }
  }, [onComplete, p4])

  // ─── CONTENIDO CALCULADO ──────────────────────────────────────────────────

  // Para Primera Verdad: usa p2 real si existe, o 'B' como demo fallback
  const primeraVerdad = getPrimeraVerdad(p1 || 'A', p2 || 'B')

  // Para Micro-espejo 1: usa selecciones reales del usuario
  const microEspejo1Content = getMicroEspejo1(p3Selections, p4 || 'A')

  const progress = PROGRESS[step]
  const progressLabel = `Tu diagnóstico: ${progress}% completo`

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div
      className="gateway-overlay"
      role="main"
      aria-label="Diagnóstico — Gateway L.A.R.S."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* ── Barra de progreso — sticky en el top ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor:
            zone === 'reflexion'
              ? 'var(--color-bg-secondary)'
              : 'var(--color-bg-primary)',
          transition: 'background-color 600ms ease',
          padding: 'var(--space-4) var(--container-padding-mobile)',
          paddingBottom: 'var(--space-3)',
          // Borde inferior muy sutil para separar del contenido
          borderBottom: 'var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          {/* Botón cerrar — demo */}
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

      {/* ── ZoneWrapper — el fondo que cambia y respira ── */}
      <ZoneWrapper zone={zone}>
        {/* P2 */}
        {step === 'p2' && (
          <SingleSelectStep
            key="p2"
            question="¿Cómo son tus noches últimamente?"
            context="Tu sueño es el indicador más fiable de cómo está tu sistema nervioso."
            options={P2_OPTIONS}
            onSelect={handleP2Select}
          />
        )}

        {/* Analizando... */}
        {step === 'analyzing' && (
          <AnalyzingScreen
            key="analyzing"
            onComplete={handleAnalyzingComplete}
          />
        )}

        {/* Primera Verdad */}
        {step === 'primera-verdad' && (
          <div key="primera-verdad" className="step-enter">
            {/* Intro sutil */}
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Lo que revelan tus respuestas
            </p>

            <MicroEspejo
              observation={primeraVerdad.text}
              collectiveData={primeraVerdad.collectiveData}
            />

            {/* CTA sutil para continuar */}
            <button
              onClick={handlePrimeraVerdadContinue}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-subtle)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                cursor: 'pointer',
                transition:
                  'color var(--transition-fast), border-color var(--transition-fast)',
                minHeight: '44px',
                marginTop: 'var(--space-2)',
              }}
            >
              Seguir con mi diagnóstico →
            </button>
          </div>
        )}

        {/* P3 — Claridad cognitiva (selección múltiple) */}
        {step === 'p3' && (
          <MultiSelectStep
            key="p3"
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
            key="p4"
            question="¿Cuál de estas frases podrías haber dicho tú esta semana?"
            context="La reactividad emocional no es un defecto de carácter. Es la respuesta de un cerebro que ha agotado los recursos para regular."
            collectiveData="Esta es la pregunta que más tarda en responderse. Tómate tu tiempo."
            options={P4_OPTIONS}
            onSelect={handleP4Select}
          />
        )}

        {/* Micro-espejo 1 */}
        {step === 'micro-espejo-1' && (
          <div key="micro-espejo-1" className="step-enter">
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Tu patrón — 50% completado
            </p>

            <MicroEspejo
              observation={microEspejo1Content.text}
              collectiveData={microEspejo1Content.collectiveData}
            />

            <button
              onClick={handleMicroEspejo1Continue}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-subtle)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                cursor: 'pointer',
                transition:
                  'color var(--transition-fast), border-color var(--transition-fast)',
                minHeight: '44px',
                marginTop: 'var(--space-2)',
              }}
            >
              Continuar el diagnóstico →
            </button>
          </div>
        )}

        {/* Done — placeholder hasta Fase 3 (P5, P6, Micro-espejo 2) */}
        {step === 'done' && (
          <div key="done" className="step-enter">
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Bloque 1 completado
            </p>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'var(--text-h3)',
                lineHeight: 'var(--lh-h3)',
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              P5, P6 y Micro-espejo 2 — Fase 3
            </p>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  border: 'var(--border-subtle)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                ← Volver a la landing
              </button>
            )}
          </div>
        )}
      </ZoneWrapper>
    </div>
  )
}
