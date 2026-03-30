'use client'

/**
 * Footer — Minimalista: copyright izquierda + links legales derecha en línea horizontal.
 * Background: --color-bg-dark (#264233).
 * Mobile: stack vertical centrado. Copyright arriba, links debajo.
 */

import { useCopy } from '@/lib/copy'

const legalLinks = [
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Aviso legal', href: '/legal' },
  { label: 'Condiciones de uso', href: '#' },
]

export default function Footer() {
  const { getCopy } = useCopy()

  return (
    <footer
      style={{
        background: 'var(--color-bg-dark)',
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-4)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
        }}
      >
        {/* Copyright — izquierda */}
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
          }}
        >
          {getCopy('footer.copyright')}
        </p>

        {/* Links legales — derecha, horizontal */}
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                lineHeight: 'var(--lh-caption)',
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
