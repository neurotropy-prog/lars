'use client'

/**
 * AdminSidebar — Collapsible dark sidebar for desktop admin.
 *
 * - Collapsed: 64px (icons only). Expanded: 220px (icon + label).
 * - Hover on collapsed → temporary expand via CSS :hover.
 * - Toggle persisted in localStorage('admin_sidebar_collapsed').
 * - Badges: red dot on Leads (hot), green dot on Agenda (session today).
 */

import Link from 'next/link'
import { useCallback } from 'react'
import {
  IconHome,
  IconUsers,
  IconZap,
  IconBarChart3,
  IconCalendar,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
} from './AdminIcons'

// ── Design tokens ──

const SIDEBAR_BG = '#1E130F'
const SIDEBAR_TEXT = '#F9F1DE'
const SIDEBAR_TEXT_MUTED = 'rgba(249, 241, 222, 0.5)'
const ACTIVE_BG = 'rgba(180, 90, 50, 0.15)'
const ACTIVE_TEXT = '#B45A32'
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
  badge?: 'leads' | 'agenda'
}

const MAIN_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Hub', icon: IconHome },
  { href: '/admin/leads', label: 'Leads', icon: IconUsers, badge: 'leads' },
  { href: '/admin/automations', label: 'Automations', icon: IconZap },
  { href: '/admin/analytics', label: 'Analytics', icon: IconBarChart3 },
  { href: '/admin/agenda', label: 'Agenda', icon: IconCalendar, badge: 'agenda' },
]

const BOTTOM_ITEMS: NavItem[] = [
  { href: '/admin/tools', label: 'Tools', icon: IconSettings },
]

// ── Component ──

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  activePath: string
  badges: { leads: number; agenda: boolean }
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  activePath,
  badges,
}: AdminSidebarProps) {
  const isActive = useCallback(
    (href: string) => {
      if (href === '/admin') return activePath === '/admin'
      return activePath.startsWith(href)
    },
    [activePath]
  )

  return (
    <nav
      className="admin-sidebar"
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
      {/* Hover expand style for collapsed state */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar:hover {
            width: ${WIDTH_EXPANDED}px !important;
          }
        }
        .admin-sidebar-item:hover {
          background-color: ${HOVER_BG};
        }
      `}</style>

      {/* Logo area */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
          borderBottom: '1px solid rgba(249, 241, 222, 0.08)',
          flexShrink: 0,
          transition: `padding ${TRANSITION}`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-lora)',
            fontWeight: 700,
            fontSize: collapsed ? '18px' : '16px',
            color: ACTIVE_TEXT,
            transition: `font-size ${TRANSITION}`,
          }}
        >
          {collapsed ? 'IE' : 'Instituto Epigenético'}
        </span>
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
          />
        ))}
      </div>

      {/* Bottom section: Tools + Toggle */}
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

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="admin-sidebar-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            width: '100%',
            height: 44,
            padding: collapsed ? '0' : '0 20px',
            background: 'none',
            border: 'none',
            color: SIDEBAR_TEXT_MUTED,
            cursor: 'pointer',
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            transition: `padding ${TRANSITION}, color 150ms ease`,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ flexShrink: 0, display: 'flex', width: 20, justifyContent: 'center' }}>
            {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
          </span>
          <span>Colapsar</span>
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
}

function SidebarItem({ item, active, collapsed, badge }: SidebarItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className="admin-sidebar-item"
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
        fontFamily: 'var(--font-inter)',
        fontSize: '14px',
        fontWeight: active ? 500 : 400,
        transition: `padding ${TRANSITION}, background-color 150ms ease, color 150ms ease`,
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex', width: 20, justifyContent: 'center', position: 'relative' }}>
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
            }}
          />
        )}
      </span>
      <span>{item.label}</span>
    </Link>
  )
}
