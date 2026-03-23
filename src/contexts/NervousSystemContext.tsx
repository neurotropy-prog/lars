'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type NervousSystemState =
  | 'fragmented'
  | 'awakening'
  | 'flowing'
  | 'frozen'
  | 'resolved'

interface NervousSystemContextValue {
  state: NervousSystemState
  score: number | null
  setState: (state: NervousSystemState) => void
  setScore: (score: number) => void
}

const NervousSystemContext = createContext<NervousSystemContextValue | null>(null)

export function NervousSystemProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<NervousSystemState>('fragmented')
  const [score, setScoreRaw] = useState<number | null>(null)

  const setState = useCallback((s: NervousSystemState) => setStateRaw(s), [])
  const setScore = useCallback((s: number) => setScoreRaw(s), [])

  return (
    <NervousSystemContext.Provider value={{ state, score, setState, setScore }}>
      {children}
    </NervousSystemContext.Provider>
  )
}

export function useNervousSystem(): NervousSystemContextValue {
  const ctx = useContext(NervousSystemContext)
  if (!ctx) {
    throw new Error('useNervousSystem must be used within NervousSystemProvider')
  }
  return ctx
}
