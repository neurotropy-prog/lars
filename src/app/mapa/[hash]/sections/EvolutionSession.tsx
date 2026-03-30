'use client'

/**
 * EvolutionSession.tsx — Sección Día 10: Sesión con Javier
 *
 * Integra el BookingWidget para reserva inline de sesiones
 * y BookingConfirmed para mostrar el estado post-reserva.
 */

import { useState } from 'react'
import { useCopy } from '@/lib/copy'
import Badge from '@/components/ui/Badge'
import BookingWidget from '@/components/booking/BookingWidget'
import BookingConfirmed from '@/components/booking/BookingConfirmed'

interface Props {
  isNew: boolean
  booked: boolean
  mapHash: string
  bookingDetails?: {
    slotStart: string
    meetUrl: string | null
  } | null
}

export default function EvolutionSession({ isNew, booked: initialBooked, mapHash, bookingDetails }: Props) {
  const { getCopy } = useCopy()
  const [booked, setBooked] = useState(initialBooked)
  const [currentBooking, setCurrentBooking] = useState(bookingDetails ?? null)

  function handleBooked(booking: { slotStart: string; meetUrl: string | null }) {
    setCurrentBooking(booking)
    setBooked(true)
  }

  function handleCancelled() {
    setCurrentBooking(null)
    setBooked(false)
  }

  return (
    <div
      className="mapa-fade-up"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Badge */}
      {isNew && !booked && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <Badge status="disponible">{getCopy('mapa.focus.new.session.tag')}</Badge>
        </div>
      )}

      {/* Título */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-h4)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--lh-h4)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {getCopy('mapa.session.title')}
      </p>

      {/* Descripción */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          marginBottom: booked ? 0 : 'var(--space-2)',
        }}
      >
        {getCopy('mapa.session.description')}
      </p>

      {booked && currentBooking ? (
        <BookingConfirmed
          slotStart={currentBooking.slotStart}
          meetUrl={currentBooking.meetUrl}
          mapHash={mapHash}
          onCancelled={handleCancelled}
        />
      ) : (
        <BookingWidget
          mapHash={mapHash}
          onBooked={handleBooked}
        />
      )}
    </div>
  )
}
