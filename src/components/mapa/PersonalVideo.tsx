'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  videoUrl: string
  createdAt: string
  autoPlay?: boolean
  id?: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`
}

export default function PersonalVideo({ videoUrl, createdAt, autoPlay, id }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasThumb, setHasThumb] = useState(false)

  // On iOS, preload="metadata" often doesn't generate a poster frame.
  // We use the #t=0.5 trick to force loading a frame as poster.
  const posterSrc = `${videoUrl}#t=0.5`

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [autoPlay])

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <div
      id={id}
      className="mapa-fade-up"
      style={{
        background: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: '#CD796C',
        marginBottom: 'var(--space-2)',
      }}>
        Mensaje personal
      </p>

      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-4)',
      }}>
        Dr. Javier A. Martín Ramos
      </p>

      {/* Video with custom play overlay for reliable thumbnail on mobile */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={posterSrc}
          controls={isPlaying}
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onLoadedData={() => setHasThumb(true)}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-md)',
            display: 'block',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            background: '#212426',
          }}
        />

        {/* Play button overlay — hidden once playing */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            aria-label="Reproducir video"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(30, 19, 16, 0.35)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'transform 200ms ease',
            }}>
              {/* Play triangle */}
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                <path d="M2 2L22 14L2 26V2Z" fill="#212426" stroke="#212426" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        )}
      </div>

      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-tertiary)',
        marginTop: 'var(--space-3)',
        marginBottom: 0,
      }}>
        Recibido {relativeTime(createdAt)}
      </p>
    </div>
  )
}
