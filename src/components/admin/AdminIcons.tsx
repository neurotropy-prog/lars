/**
 * AdminIcons — SVG icon components for admin sidebar/bottom bar.
 * Stroke-based, 24x24 viewBox, rendered at 20x20 by default.
 * No external icon library.
 */

import { CSSProperties } from 'react'

interface IconProps {
  size?: number
  style?: CSSProperties
}

const defaults: IconProps = { size: 20 }

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function IconHome({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <polyline points="9 21 9 14 15 14 15 21" />
    </svg>
  )
}

export function IconUsers({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

export function IconZap({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

export function IconBarChart3({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  )
}

export function IconCalendar({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function IconSettings({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
    </svg>
  )
}

export function IconChevronLeft({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function IconChevronRight({ size = defaults.size!, style }: IconProps) {
  return (
    <svg {...svgProps(size)} style={style}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
