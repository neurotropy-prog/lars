'use client'

/**
 * GatewayController — Orquesta toda la experiencia del Gateway L.A.R.S.©
 *
 * Fases:
 *   landing  → Hero + BelowTheFold (visible siempre debajo)
 *   bloque1  → P2 → Analizando → Primera Verdad → P3 → P4 → Micro-espejo 1
 *   bloque2  → P5 → P6 → Micro-espejo 2 → P7 (sliders) → P8
 *   bloque3  → Calculando → Bisagra → Email
 *
 * P1 se responde en el hero (GatewayController la recibe via onP1Select).
 * Al completar email, redirige a /mapa/[hash] con la evaluación completa.
 */

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import HeroSection from '@/components/landing/HeroSection'
import BelowTheFold from '@/components/landing/BelowTheFold'
import GatewayBloque1 from '@/components/gateway/GatewayBloque1'
import GatewayBloque2 from '@/components/gateway/GatewayBloque2'
import GatewayBloque3 from '@/components/gateway/GatewayBloque3'
import OfflineBanner from '@/components/ui/OfflineBanner'
import type { Bloque1Answers } from '@/components/gateway/GatewayBloque1'
import type { Bloque2Answers } from '@/lib/gateway-bloque2-data'

type Phase = 'landing' | 'bloque1' | 'bloque2' | 'bloque3'

const STORAGE_KEY = 'lars_gateway_state'
const EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 horas

interface SavedState {
  phase: Phase
  p1: string | null
  bloque1Answers: Bloque1Answers | null
  bloque2Answers: Bloque2Answers | null
  inviteHash: string | null
  savedAt: number
}

/** Lee estado guardado de localStorage. Devuelve null si no existe o expiró. */
function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved: SavedState = JSON.parse(raw)
    if (Date.now() - saved.savedAt > EXPIRATION_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return saved
  } catch {
    return null
  }
}

/** Persiste el estado actual en localStorage. */
function saveState(state: Omit<SavedState, 'savedAt'>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
  } catch {
    // localStorage lleno o no disponible — no bloquea el flujo
  }
}

/** Limpia el estado guardado (al completar el gateway). */
function clearSavedState() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* no-op */ }
}

export default function GatewayController() {
  /* Restaurar estado guardado (si existe y no expiró) */
  const [restored] = useState(() => loadSavedState())
  const searchParams = useSearchParams()

  const [phase, setPhase] = useState<Phase>(restored?.phase ?? 'landing')
  const [p1, setP1] = useState<string | null>(restored?.p1 ?? null)
  const [bloque1Answers, setBloque1Answers] = useState<Bloque1Answers | null>(restored?.bloque1Answers ?? null)
  const [bloque2Answers, setBloque2Answers] = useState<Bloque2Answers | null>(restored?.bloque2Answers ?? null)
  const [duplicateHash, setDuplicateHash] = useState<string | null>(null)
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null)
  const [landingExiting, setLandingExiting] = useState(false)

  // ── AMPLIFY: detectar ?ref= en la URL ───────────────────────────────────
  const [inviteHash] = useState<string | null>(() => {
    // Prioridad: URL param > estado guardado
    const refParam = searchParams.get('ref')
    if (refParam && /^[a-z0-9]{12}$/.test(refParam)) return refParam
    return restored?.inviteHash ?? null
  })

  /* Persistir estado en localStorage cada vez que cambia */
  useEffect(() => {
    if (phase === 'landing') return // no guardar estado en landing
    saveState({ phase, p1, bloque1Answers, bloque2Answers, inviteHash })
  }, [phase, p1, bloque1Answers, bloque2Answers, inviteHash])

  /* P1 seleccionada en el hero → fade out landing, then mount gateway */
  const handleP1Select = useCallback((id: string) => {
    setP1(id)
    // 600ms delay already happens in P1Cards (selection feedback).
    // Now fade out landing content, then mount gateway.
    setLandingExiting(true)
    setTimeout(() => {
      setPhase('bloque1')
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }, 400) // 400ms = landing fade-out duration
  }, [])

  /* Bloque1 completo → pasa a bloque2 */
  const handleBloque1Complete = useCallback((answers: Bloque1Answers) => {
    setBloque1Answers(answers)
    setPhase('bloque2')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }, [])

  /* Bloque2 completo → pasa a bloque3 */
  const handleBloque2Complete = useCallback((answers: Bloque2Answers) => {
    setBloque2Answers(answers)
    setPhase('bloque3')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }, [])

  /* Email enviado → redirigir al mapa */
  const handleBloque3Complete = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          p1,
          bloque1: bloque1Answers,
          bloque2: bloque2Answers,
          ...(inviteHash ? { ref: inviteHash } : {}),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        clearSavedState()
        if (data.existing) {
          setDuplicateHash(data.hash)
          setDuplicateEmail(email)
        } else {
          window.location.href = `/mapa/${data.hash}`
        }
      } else {
        clearSavedState()
        window.location.href = '/mapa/preview'
      }
    } catch {
      clearSavedState()
      window.location.href = '/mapa/preview'
    }
  }, [p1, bloque1Answers, bloque2Answers, inviteHash])

  /* Duplicado: actualizar con nuevas respuestas */
  const handleDuplicateUpdate = useCallback(async () => {
    if (!duplicateEmail) return
    try {
      const body = { email: duplicateEmail, p1, bloque1: bloque1Answers, bloque2: bloque2Answers, update: true }

      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const { hash } = await res.json()
        clearSavedState()
        window.location.href = `/mapa/${hash}`
      }
    } catch {
      window.location.href = '/mapa/preview'
    }
  }, [duplicateEmail, p1, bloque1Answers, bloque2Answers])

  /* Duplicado: ver mapa existente */
  const handleDuplicateViewExisting = useCallback(() => {
    if (duplicateHash) {
      clearSavedState()
      window.location.href = `/mapa/${duplicateHash}`
    }
  }, [duplicateHash])

  /* Cerrar cualquier bloque → volver a landing */
  const handleClose = useCallback(() => {
    clearSavedState()
    setPhase('landing')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }, [])

  return (
    <>
      {/* Banner de conexión perdida — no bloqueante */}
      <OfflineBanner />

      {/* Landing — siempre montada debajo de los overlays */}
      <div
        style={{
          opacity: landingExiting ? 0 : 1,
          transition: 'opacity 400ms ease',
          pointerEvents: landingExiting ? 'none' : 'auto',
        }}
      >
        <HeroSection onP1Select={handleP1Select} />

        <BelowTheFold />
      </div>

      {/* ── Flujo evaluación completa ── */}
      {phase === 'bloque1' && p1 && (
        <GatewayBloque1
          p1={p1}
          onComplete={handleBloque1Complete}
          onClose={handleClose}
        />
      )}

      {phase === 'bloque2' && p1 && bloque1Answers && (
        <GatewayBloque2
          p1={p1}
          p4={bloque1Answers.p4}
          onComplete={handleBloque2Complete}
          onClose={handleClose}
        />
      )}

      {phase === 'bloque3' && p1 && bloque1Answers && bloque2Answers && (
        <GatewayBloque3
          p1={p1}
          bloque1={bloque1Answers}
          bloque2={bloque2Answers}
          onComplete={handleBloque3Complete}
          onClose={handleClose}
        />
      )}

      {/* ── Diálogo email duplicado ── */}
      {duplicateHash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(38,66,51,0.80)',
            padding: 'var(--space-6)',
          }}
        >
          <div
            className="step-enter"
            style={{
              maxWidth: '420px',
              width: '100%',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-xl)',
              border: 'var(--border-subtle)',
              padding: 'var(--space-8) var(--space-6)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-h3)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Ya tienes un mapa con este email
            </p>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              ¿Qué quieres hacer?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button
                onClick={handleDuplicateUpdate}
                style={{
                  width: '100%',
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: 'var(--color-accent)',
                  color: 'var(--color-text-inverse)',
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Actualizar con estas respuestas
              </button>
              <button
                onClick={handleDuplicateViewExisting}
                style={{
                  width: '100%',
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-pill)',
                  border: 'var(--border-subtle)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Ver mi mapa existente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
