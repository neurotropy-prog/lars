'use client'

interface Props {
  content: string
  createdAt: string
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

export default function ExpressSessionOffer({ content, createdAt }: Props) {
  return (
    <div
      className="mapa-fade-up"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '1.5px solid #CD796C',
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
        Invitación personal
      </p>

      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-3)',
      }}>
        Javier quiere hablar contigo
      </p>

      {content && (
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          whiteSpace: 'pre-line',
          marginBottom: 'var(--space-4)',
        }}>
          {content}
        </p>
      )}

      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-tertiary)',
        margin: 0,
        lineHeight: 1.5,
      }}>
        10 minutos · Sin compromiso · Recibido {relativeTime(createdAt)}
      </p>
    </div>
  )
}
