'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', label: 'Hub' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/disponibilidad', label: 'Disponibilidad' },
  { href: '/admin/fast-forward', label: 'Fast-Forward' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        display: 'flex',
        gap: 'var(--space-1)',
        padding: 'var(--space-3) var(--space-6)',
        paddingTop: 'calc(var(--header-height, 56px) + var(--space-3))',
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: 'var(--border-subtle)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#4ADE80' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive ? 'rgba(74, 222, 128, 0.08)' : 'transparent',
              whiteSpace: 'nowrap',
              transition: 'color var(--transition-fast), background-color var(--transition-fast)',
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
