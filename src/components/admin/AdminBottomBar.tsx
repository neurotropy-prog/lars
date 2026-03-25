'use client'

/**
 * AdminBottomBar — Mobile bottom navigation for admin (< 768px).
 *
 * 5 items: Hub, Leads, Automations, Analytics, Agenda.
 * Fixed bottom with safe-area padding for iPhone.
 */

import Link from 'next/link'
import {
  IconHome,
  IconUsers,
  IconZap,
  IconBarChart3,
  IconCalendar,
} from './AdminIcons'

// ── Design tokens ──

const BAR_BG = '#1E130F'
const ACTIVE_COLOR = '#B45A32'
const INACTIVE_COLOR = 'rgba(249, 241, 222, 0.5)'
const BADGE_RED = '#E74C3C'
const BADGE_GREEN = '#3D9A5F'

// ── Nav items ──

const ITEMS = [
  { href: '/admin', label: 'Hub', icon: IconHome },
  { href: '/admin/leads', label: 'Leads', icon: IconUsers, badge: 'leads' as const },
  { href: '/admin/automations', label: 'Auto', icon: IconZap },
  { href: '/admin/analytics', label: 'Analytics', icon: IconBarChart3 },
  { href: '/admin/agenda', label: 'Agenda', icon: IconCalendar, badge: 'agenda' as const },
]

// ── Component ──

interface AdminBottomBarProps {
  activePath: string
  badges: { leads: number; agenda: boolean }
}

export default function AdminBottomBar({ activePath, badges }: AdminBottomBarProps) {
  const isActive = (href: string) => {
    if (href === '/admin') return activePath === '/admin'
    return activePath.startsWith(href)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: BAR_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 200,
        borderTop: '1px solid rgba(249, 241, 222, 0.08)',
      }}
    >
      {ITEMS.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon
        const hasBadge =
          (item.badge === 'leads' && badges.leads > 0) ||
          (item.badge === 'agenda' && badges.agenda)
        const badgeColor = item.badge === 'leads' ? BADGE_RED : BADGE_GREEN

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: active ? ACTIVE_COLOR : INACTIVE_COLOR,
              textDecoration: 'none',
              minWidth: 44,
              minHeight: 44,
              position: 'relative',
            }}
          >
            <span style={{ position: 'relative', display: 'flex' }}>
              <Icon size={22} />
              {hasBadge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -4,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: badgeColor,
                    border: `2px solid ${BAR_BG}`,
                    boxSizing: 'content-box',
                  }}
                />
              )}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                fontWeight: active ? 500 : 400,
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
