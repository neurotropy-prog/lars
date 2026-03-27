'use client'

/**
 * Footer — Footer profesional oscuro con grid de columnas.
 * Background: --color-bg-dark (#1E130F).
 * Grid 3 columnas desktop, stack móvil.
 * Links placeholder (#) para dar presencia institucional.
 */

import { useCopy } from '@/lib/copy'

const columns = [
  {
    heading: 'INSTITUTO',
    links: [
      { label: 'Sobre nosotros', href: '#' },
      { label: 'Equipo', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
  {
    heading: 'RECURSOS',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Libro "Burnout: El Renacimiento"', href: '#' },
      { label: 'Podcast', href: '#' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Aviso legal', href: '/legal' },
      { label: 'Condiciones de uso', href: '#' },
    ],
  },
]

export default function Footer() {
  const { getCopy } = useCopy()

  return (
    <footer
      style={{
        background: 'var(--color-bg-dark)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-8)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Logo del Instituto */}
        <img
          src="/img/logo-instituto-epigenetico.png"
          alt="Instituto Epigenético"
          style={{
            height: '22px',
            width: 'auto',
            marginBottom: 'var(--space-10)',
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
          }}
        />

        {/* Grid de columnas */}
        <div className="footer-grid">
          {columns.map((col) => (
            <div key={col.heading}>
              {/* Heading de columna */}
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-overline)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-inverse-muted)',
                  marginBottom: 'var(--space-4)',
                  lineHeight: 'var(--lh-caption)',
                }}
              >
                {col.heading}
              </p>

              {/* Links */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 'var(--space-2)' }}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 2.2,
                        color: 'rgba(255, 251, 239, 0.85)',
                        textDecoration: 'none',
                        transition: 'opacity var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.85'
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separador */}
        <div
          style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            marginTop: 'var(--space-10)',
            marginBottom: 'var(--space-6)',
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            color: 'rgba(255, 251, 239, 0.5)',
            textAlign: 'center',
          }}
        >
          {getCopy('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}
