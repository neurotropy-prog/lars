'use client'

/**
 * ClientShell — Client boundary wrapping NervousSystemProvider + Canvas + children.
 * Keeps page.tsx as a Server Component.
 */

import type { ReactNode } from 'react'
import { NervousSystemProvider } from '@/contexts/NervousSystemContext'
import NervousSystemCanvas from '@/components/NervousSystemCanvas'

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <NervousSystemProvider>
      {children}
      <NervousSystemCanvas />
    </NervousSystemProvider>
  )
}
