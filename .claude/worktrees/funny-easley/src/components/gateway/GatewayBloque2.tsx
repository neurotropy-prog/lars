'use client'

/**
 * GatewayBloque2 — Orquestador del segundo bloque del gateway.
 *
 * Flujo: P5 → P6 → Micro-espejo 2 → P7 (sliders) → P8 → done
 *
 * Recibe:
 *   - p1: respuesta del hero (llega desde GatewayController)
 *   - p4: respuesta de P4 — determina personalización de tono en P5/P6
 *
 * Gestiona:
 *   - Máquina de estados (step)
 *   - Zona activa (exploración / reflexión)
 *   - Progreso no lineal (congela en micro-espejo 2)
 *   - Tono adaptado invisiblemente según perfil detectado en P4
 */

import { useState, useCallback } from 'react'
import ZoneWrapper from './ZoneWrapper'
import SingleSelectStep from './SingleSelectStep'
import SliderStep from './SliderStep'
import type { SliderValues } from './SliderStep'
import MicroEspejo from '@/components/ui/MicroEspejo'
import ProgressBar from '@/components/ui/ProgressBar'
import {
  P5_OPTIONS,
  P6_OPTIONS,
  P7_SLIDERS,
  P8_OPTIONS,
  getToneContext,
  getMicroEspejo2,
} from '@/lib/gateway-bloque2-data'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Step =
  | 'p5'
  | 'p6'
  | 'micro-espejo-2'
  | 'p7'
  | 'p8'
  | 'done'

type Zone = 'exploracion' | 'reflexion'

// Progreso no lineal — micro-espejo 2 congela (es revelación, no avance)
const PROGRESS: Record<Step, number> = {
  p5:              60,
  p6:              70,
  'micro-espejo-2': 75,
  p7:              82,
  p8:              90,
  done:            90,
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface GatewayBloque2Props {
  /** Respuesta de P1 — viene del hero */
  p1: string
  /** Respuesta de P4 — para personalización de tono en P5/P6 */
  p4: string
  /** Botón volver — demos */
  onClose?: () => void
  /** Callback al completar P8 */
  onComplete?: () => void
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function GatewayBloque2({
  p4,
  onClose,
  onComplete,
}: GatewayBloque2Props) {
  const [step, setStep]       = useState<Step>('p5')
  const [zone, setZone]       = useState<Zone>('exploracion')
  const [p6, setP6]           = useState<string>('')
  const [sliderValues, setSliderValues] = useState<SliderValues>({})

  // ─── CONTEXTO DE TONO — invisible, varía según perfil P4 ─────────────────

  const toneCtx = getToneContext(p4)

  // Construye el texto de contexto de P5 según perfil
  const p5Context = (() => {
    const base = 'Tu capacidad de disfrutar es un indicador directo del estado de tu sistema nervioso.'
    if (!toneCtx) return base
    if (p4 === 'D') return `Dato: tu capacidad de disfrutar es un indicador directo del estado de tu sistema nervioso.`
    if (p4 === 'C') return `No hay prisa. ${base}`
    if (p4 === 'E') return `Basado en tu combinación de respuestas, ${base.toLowerCase()}`
    return base // Productivo (A) — directo, sin añadidos
  })()

  // Construye el texto de contexto de P6 según perfil
  const p6Context = (() => {
    const base = 'Cada perfil tiene una frase que lo define. Esta pregunta es la más precisa del diagnóstico.'
    if (!toneCtx) return base
    if (p4 === 'D') return `Dato: cada perfil tiene una frase que lo define. Esta pregunta es la más precisa del diagnóstico.`
    if (p4 === 'C') return `No hay prisa. ${base}`
    if (p4 === 'E') return `Basado en tu combinación de respuestas, cada perfil tiene una frase que lo define. Esta es la pregunta más precisa del diagnóstico.`
    return base
  })()

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  const handleP5Select = useCallback(() => {
    setStep('p6')
  }, [])

  const handleP6Select = useCallback((id: string) => {
    setP6(id)
    setZone('reflexion')
    setStep('micro-espejo-2')
  }, [])

  const handleMicroEspejo2Continue = useCallback(() => {
    setZone('exploracion')
    setStep('p7')
  }, [])

  const handleP7Continue = useCallback((values: SliderValues) => {
    setSliderValues(values)
    setStep('p8')
  }, [])

  const handleP8Select = useCallback(() => {
    setStep('done')
  }, [])

  const handleDoneContinue = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  // ─── CONTENIDO CALCULADO ──────────────────────────────────────────────────

  const microEspejo2Content = getMicroEspejo2(p6 || 'A')
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

      {/* ── ZoneWrapper — el fondo que cambia y respira ── */}
      <ZoneWrapper zone={zone}>

        {/* P5 — Alegría de vivir */}
        {step === 'p5' && (
          <SingleSelectStep
            key="p5"
            question="¿Cuándo fue la última vez que disfrutaste algo de verdad — sin culpa, sin prisa, sin pensar en lo siguiente?"
            context={p5Context}
            collectiveData="El 41% de personas que hacen este diagnóstico no recuerdan cuándo fue."
            options={P5_OPTIONS}
            onSelect={handleP5Select}
          />
        )}

        {/* P6 — Frase identitaria */}
        {step === 'p6' && (
          <div key="p6" className="step-enter" style={{ width: '100%' }}>
            {/* Overline — señala que esta pregunta es diferente */}
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-accent)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-3)',
              }}
            >
              La pregunta más importante
            </p>

            {/* Pregunta en Cormorant — peso visual diferente */}
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'var(--text-h2)',
                lineHeight: 'var(--lh-h2)',
                letterSpacing: 'var(--ls-h2)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              ¿Cuál de estas frases sientes más verdadera ahora mismo?
            </p>

            {/* Dato colectivo — antes de las opciones, porque ancla la decisión */}
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Cada una de estas frases la ha elegido más de 1.000 personas antes que tú.
            </p>

            {/* Contexto de tono — sutil, solo si aplica */}
            {p6Context && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body-sm)',
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                {p6Context}
              </p>
            )}

            {/* Cards de selección — igual que SingleSelectStep pero sin wrapper extra */}
            <div
              role="radiogroup"
              aria-label="Frase identitaria"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              {P6_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  role="radio"
                  aria-checked={false}
                  onClick={() => handleP6Select(option.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--color-bg-elevated)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4) var(--space-5)',
                    cursor: 'pointer',
                    transition:
                      'background var(--transition-fast), border-color var(--transition-fast)',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'var(--color-accent-subtle)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'var(--color-bg-elevated)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'transparent'
                  }}
                >
                  {/* Título — Cormorant italic para reforzar el peso emocional */}
                  <p
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'var(--text-h3)',
                      lineHeight: 'var(--lh-h3)',
                      fontWeight: 500,
                      fontStyle: 'italic',
                      color: 'var(--color-text-primary)',
                      marginBottom: option.subtitle ? 'var(--space-1)' : 0,
                    }}
                  >
                    {option.title}
                  </p>
                  {option.subtitle && (
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--lh-body-sm)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {option.subtitle}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Micro-espejo 2 */}
        {step === 'micro-espejo-2' && (
          <div key="micro-espejo-2" className="step-enter">
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
              Tu patrón — 75% completado
            </p>

            <MicroEspejo
              observation={microEspejo2Content.text}
              collectiveData={microEspejo2Content.collectiveData}
            />

            {/* Checkpoint 2 — CLARITY */}
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-accent)',
                fontStyle: 'italic',
                marginBottom: 'var(--space-5)',
                paddingLeft: 'var(--space-4)',
                borderLeft: '2px solid var(--color-accent-muted)',
              }}
            >
              "Ahora entiendo lo que me pasa. No soy yo — es mi sistema nervioso."
            </p>

            <button
              onClick={handleMicroEspejo2Continue}
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

        {/* P7 — Sliders */}
        {step === 'p7' && (
          <SliderStep
            key="p7"
            question="En una escala del 1 al 10, ¿cómo calificarías cada una de estas áreas en tu vida ahora mismo?"
            sliders={P7_SLIDERS}
            onContinue={handleP7Continue}
          />
        )}

        {/* P8 — Duración */}
        {step === 'p8' && (
          <SingleSelectStep
            key="p8"
            question="¿Cuánto tiempo llevas sintiéndote así?"
            context="La duración importa: determina cómo responde tu cuerpo a la intervención."
            options={P8_OPTIONS}
            onSelect={handleP8Select}
          />
        )}

        {/* Done — placeholder hasta Fase 4 (Bisagra + revelación) */}
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
              Bloque 2 completado
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
              Bisagra + revelación — Fase 4
            </p>
            <button
              onClick={handleDoneContinue}
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
          </div>
        )}

      </ZoneWrapper>
    </div>
  )
}
