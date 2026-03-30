'use client'

/**
 * TypeWriter — Escribe texto carácter a carácter con cursor parpadeante.
 * Cursor: barra "|" en color acento, 530ms blink. Desaparece al completar + 800ms.
 * Reutilizable en: AnalyzingScreen (A-05), CalculandoScreen (A-09).
 *
 * El cursor usa la clase .typing-cursor definida en globals.css.
 */

import { useEffect, useRef, useState } from 'react'

interface TypeWriterProps {
  /** Texto a escribir carácter a carácter */
  text: string
  /** Ms por carácter (default 40) */
  speed?: number
  /** Ms de espera antes de empezar a escribir (default 0) */
  delay?: number
  /** Callback cuando termina de escribir + pausa del cursor */
  onComplete?: () => void
  /** Clase CSS extra para el contenedor */
  className?: string
  style?: React.CSSProperties
}

export default function TypeWriter({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  className,
  style,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Reset
    setDisplayed('')
    setDone(false)
    // Clear any previous timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    let index = 0

    function typeNext() {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1))
        index++
        const t = setTimeout(typeNext, speed)
        timeoutsRef.current.push(t)
      } else {
        // Typing completo — cursor sigue parpadeando 800ms, luego llama onComplete
        const t = setTimeout(() => {
          setDone(true)
          onComplete?.()
        }, 800)
        timeoutsRef.current.push(t)
      }
    }

    const startT = setTimeout(typeNext, delay)
    timeoutsRef.current.push(startT)

    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [text, speed, delay, onComplete])

  return (
    <span className={className} style={style}>
      {displayed}
      {/* Cursor: visible mientras escribe, desaparece al completar */}
      {!done && <span className="typing-cursor" aria-hidden="true" />}
    </span>
  )
}
