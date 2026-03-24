'use client'

/**
 * ClientShell — Client boundary wrapping children.
 * Keeps page.tsx as a Server Component.
 */

import type { ReactNode } from 'react'

export default function ClientShell({ children }: { children: ReactNode }) {
  return <>{children}</>
}
