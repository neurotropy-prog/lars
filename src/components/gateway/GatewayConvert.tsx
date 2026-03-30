'use client'

/**
 * GatewayConvert — Flujo rápido de 90 segundos
 *
 * Para visitantes con alta intención (UTM o elección manual).
 * Solo P2 → P7 (sliders) → Bisagra comprimida → Email.
 * Salta P3-P6, micro-espejos y primera verdad.
 *
 * Reutiliza componentes existentes: SingleSelectStep, SlidersStep,
 * CompressedBisagra, EmailCapture.
 */

import { useState, useCallback } from 'react'
import ZoneWrapper from './ZoneWrapper'
import SingleSelectStep from './SingleSelectStep'
import SlidersStep from './SlidersStep'
import CompressedBisagra from './CompressedBisagra'
import EmailCapture from './EmailCapture'
import ProgressBar from '@/components/ui/ProgressBar'
import { computeConvertScores } from '@/lib/scoring'
import { P2_OPTIONS } from '@/lib/gateway-bloque1-data'
import { P7_SLIDERS } from '@/lib/gateway-bloque2-data'

type Step = 'p2' | 'p7' | 'bisagra' | 'email'

const PROGRESS: Record<Step, number> = {
  p2: 25,
  p7: 50,
  bisagra: 75,
  email: 90,
}

interface GatewayConvertProps {
  p1: string
  onComplete: (email: string, p2: string, sliders: Record<string, number>) => void
  onClose?: () => void
}

export default function GatewayConvert({
  p1,
  onComplete,
  onClose,
}: GatewayConvertProps) {
  const [step, setStep] = useState<Step>('p2')
  const [stepKey, setStepKey] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const [p2, setP2] = useState('')
  const [sliders, setSliders] = useState<Record<string, number>>({})

  const changeStep = useCallback((newStep: Step) => {
    setIsExiting(true)
    setTimeout(() => {
      setStep(newStep)
      setStepKey((k) => k + 1)
      setIsExiting(false)
    }, 200)
  }, [])

  const handleP2Select = useCallback((id: string) => {
    setP2(id)
    changeStep('p7')
  }, [changeStep])

  const handleP7Continue = useCallback((values: Record<string, number>) => {
    setSliders(values)
    changeStep('bisagra')
  }, [changeStep])

  const handleBisagraContinue = useCallback(() => {
    changeStep('email')
  }, [changeStep])

  const handleEmailComplete = useCallback((email: string) => {
    onComplete(email, p2, sliders)
  }, [onComplete, p2, sliders])

  // Pre-calcular scores para bisagra y email capture
  const scores = (step === 'bisagra' || step === 'email')
    ? computeConvertScores(p1, p2, sliders)
    : null

  const progress = PROGRESS[step]
  const progressLabel = `Evaluación rápida: ${progress}%`

  return (
    <div
      className="gateway-overlay"
      role="main"
      aria-label="Evaluación rápida — L.A.R.S."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: step === 'bisagra' || step === 'email'
          ? 'var(--bg-reveal-solid)'
          : 'var(--color-bg-primary)',
        transition: 'background-color 600ms var(--ease-zone)',
      }}
    >
      {/* ── Barra de progreso sticky ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: step === 'bisagra' || step === 'email'
            ? 'var(--bg-reveal-solid)'
            : 'var(--color-bg-primary)',
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
                  fontFamily: 'var(--font-host-grotesk)',
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

      {/* ── Contenido ── */}
      <ZoneWrapper zone={step === 'bisagra' || step === 'email' ? 'reflexion' : 'exploracion'}>
        <div
          key={stepKey}
          className={isExiting ? 'step-exit' : 'step-enter'}
        >
          {step === 'p2' && (
            <SingleSelectStep
              question="¿Cómo son tus noches últimamente?"
              context="Tu sueño es el indicador más fiable de cómo está tu sistema nervioso."
              options={P2_OPTIONS}
              onSelect={handleP2Select}
            />
          )}

          {step === 'p7' && (
            <SlidersStep
              question="En una escala del 1 al 10, ¿cómo calificarías cada una de estas áreas?"
              sliders={P7_SLIDERS}
              onContinue={handleP7Continue}
            />
          )}

          {step === 'bisagra' && scores && (
            <CompressedBisagra
              scores={scores}
              onContinue={handleBisagraContinue}
            />
          )}

          {step === 'email' && scores && (
            <EmailCapture
              scores={scores}
              onComplete={handleEmailComplete}
            />
          )}
        </div>
      </ZoneWrapper>
    </div>
  )
}
