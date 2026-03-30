'use client'

/**
 * AdminSidebar — Collapsible dark sidebar for desktop admin.
 *
 * Two states, toggled ONLY by clicking the chevron button:
 * - Collapsed: 64px wide, icons only, centered.
 * - Expanded: 220px wide, icons + labels.
 *
 * No auto-expand on hover. Manual toggle only, persisted in localStorage.
 * Badges: red dot on Leads (hot), green dot on Agenda (session today).
 */

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  IconHome,
  IconUsers,
  IconZap,
  IconBarChart3,
  IconCalendar,
  IconFileText,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconLogOut,
} from './AdminIcons'

// ── Design tokens ──

const SIDEBAR_BG = '#264233'
const SIDEBAR_TEXT = '#EAF2EE'
const SIDEBAR_TEXT_MUTED = 'rgba(249, 241, 222, 0.5)'
const ACTIVE_BG = 'rgba(180, 90, 50, 0.15)'
const ACTIVE_TEXT = '#CD796C'
const HOVER_BG = 'rgba(249, 241, 222, 0.06)'
const BADGE_RED = '#E74C3C'
const BADGE_GREEN = '#3D9A5F'
const TRANSITION = '200ms cubic-bezier(0.16, 1, 0.3, 1)'
const WIDTH_COLLAPSED = 64
const WIDTH_EXPANDED = 220

// ── Nav items ──

interface NavItem {
  href: string
  label: string
  icon: typeof IconHome
  badge?: 'leads' | 'agenda' | 'copy'
}

const MAIN_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Hub', icon: IconHome },
  { href: '/admin/leads', label: 'Leads', icon: IconUsers, badge: 'leads' },
  { href: '/admin/automations', label: 'Automations', icon: IconZap },
  { href: '/admin/analytics', label: 'Analytics', icon: IconBarChart3 },
  { href: '/admin/agenda', label: 'Agenda', icon: IconCalendar, badge: 'agenda' },
  { href: '/admin/copy', label: 'Copy', icon: IconFileText, badge: 'copy' },
]

const BOTTOM_ITEMS: NavItem[] = [
  { href: '/admin/tools', label: 'Tools', icon: IconSettings },
]

// ── Component ──

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  activePath: string
  badges: { leads: number; agenda: boolean; copy: number }
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  activePath,
  badges,
}: AdminSidebarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isActive = useCallback(
    (href: string) => {
      if (href === '/admin') return activePath === '/admin'
      return activePath.startsWith(href)
    },
    [activePath]
  )

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }, [router])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED,
        backgroundColor: SIDEBAR_BG,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        transition: `width ${TRANSITION}`,
        overflow: 'hidden',
      }}
    >
      {/* Item hover style + badge pulse */}
      <style>{`
        .admin-sidebar-item:hover {
          background-color: ${HOVER_BG};
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Logo + toggle button */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          borderBottom: '1px solid rgba(249, 241, 222, 0.08)',
          flexShrink: 0,
        }}
      >
        {/* Isotipo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : '8px',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(249, 241, 222, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Image
              src="/isotipo-ie-white.svg"
              alt="Instituto Epigenético"
              width={24}
              height={16}
              style={{ display: 'block' }}
            />
          </div>
        </div>

        {/* Toggle chevron */}
        <button
          onClick={onToggle}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid rgba(249, 241, 222, 0.12)',
            background: 'rgba(249, 241, 222, 0.04)',
            color: SIDEBAR_TEXT_MUTED,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: `background 150ms ease, border-color 150ms ease`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(249, 241, 222, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(249, 241, 222, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(249, 241, 222, 0.04)'
            e.currentTarget.style.borderColor = 'rgba(249, 241, 222, 0.12)'
          }}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </button>
      </div>

      {/* Main nav items */}
      <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {MAIN_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
            badge={
              item.badge === 'leads' && badges.leads > 0
                ? 'red'
                : item.badge === 'agenda' && badges.agenda
                  ? 'green'
                  : undefined
            }
            badgeCount={item.badge === 'copy' ? badges.copy : undefined}
          />
        ))}
      </div>

      {/* Bottom section: Tools + Logout */}
      <div
        style={{
          borderTop: '1px solid rgba(249, 241, 222, 0.08)',
          padding: '12px 0',
          flexShrink: 0,
        }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            height: 44,
            padding: collapsed ? '0' : '0 20px',
            margin: '2px 8px',
            borderRadius: 10,
            backgroundColor: isLoggingOut ? 'rgba(249, 241, 222, 0.03)' : 'transparent',
            color: SIDEBAR_TEXT_MUTED,
            border: 'none',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '14px',
            fontWeight: 400,
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            transition: 'background-color 150ms ease, color 150ms ease',
            position: 'relative',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: isLoggingOut ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = HOVER_BG
              e.currentTarget.style.color = SIDEBAR_TEXT
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = SIDEBAR_TEXT_MUTED
          }}
        >
          <span
            style={{
              flexShrink: 0,
              display: 'flex',
              width: 20,
              justifyContent: 'center',
            }}
          >
            <IconLogOut size={20} />
          </span>
          {!collapsed && <span>{isLoggingOut ? 'Cerrando...' : 'Logout'}</span>}
        </button>
      </div>
    </nav>
  )
}

// ── Sidebar item ──

interface SidebarItemProps {
  item: NavItem
  active: boolean
  collapsed: boolean
  badge?: 'red' | 'green'
  badgeCount?: number
}

function SidebarItem({ item, active, collapsed, badge, badgeCount }: SidebarItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className="admin-sidebar-item"
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
        height: 44,
        padding: collapsed ? '0' : '0 20px',
        margin: '2px 8px',
        borderRadius: 10,
        backgroundColor: active ? ACTIVE_BG : 'transparent',
        color: active ? ACTIVE_TEXT : SIDEBAR_TEXT,
        textDecoration: 'none',
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '14px',
        fontWeight: active ? 500 : 400,
        transition: `padding ${TRANSITION}, background-color 150ms ease, color 150ms ease`,
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          display: 'flex',
          width: 20,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Icon size={20} />
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: badge === 'red' ? BADGE_RED : BADGE_GREEN,
              border: `2px solid ${SIDEBAR_BG}`,
              boxSizing: 'content-box',
              animation: 'badgePulse 2s ease-in-out infinite',
            }}
          />
        )}
        {badgeCount != null && badgeCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -8,
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '9px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: ACTIVE_TEXT,
              borderRadius: '9999px',
              padding: '1px 5px',
              lineHeight: 1.4,
              border: `2px solid ${SIDEBAR_BG}`,
              boxSizing: 'content-box',
            }}
          />
        )}
      </span>
      {!collapsed && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {item.label}
          {badgeCount != null && badgeCount > 0 && (
            <span style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '10px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: ACTIVE_TEXT,
              borderRadius: '9999px',
              padding: '0px 6px',
              lineHeight: 1.6,
            }}>
              {badgeCount}
            </span>
          )}
        </span>
      )}
    </Link>
  )
}
