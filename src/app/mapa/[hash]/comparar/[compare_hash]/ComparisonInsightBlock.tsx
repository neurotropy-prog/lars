'use client'

/**
 * ComparisonInsightBlock — Bloque de insight comparativo + CTA.
 *
 * Aparece al final de la secuencia animada con el insight generado
 * por generateComparisonInsight() y un CTA hacia el programa.
 */

import { useCopy } from '@/lib/copy'

interface Props {
  insight: string
  visible: boolean
  instant: boolean
  stripeUrl?: string
}

export default function ComparisonInsightBlock({
  insight,
  visible,
  instant,
  stripeUrl = '#',
}: Props) {
  const { getCopy } = useCopy()
  if (!visible && !instant) return null

  return (
    <div
      style={{
        opacity: visible || instant ? 1 : 0,
        transform: visible || instant ? 'translateY(0)' : 'translateY(20px)',
        transition: instant ? 'none' : 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Insight block */}
      <div
        style={{
          borderLeft: '3px solid var(--color-success)',
          background: 'rgba(61, 154, 95, 0.06)',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-12)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h4)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--lh-h4)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {getCopy('amplify.insight.heading')}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--lh-body)',
          }}
        >
          {insight}
        </p>
      </div>

      {/* CTA section */}
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-12) 0',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h3)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--lh-h3)',
            marginBottom: 'var(--space-4)',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {getCopy('amplify.insight.tagline')}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--lh-body)',
            marginBottom: 'var(--space-8)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {getCopy('amplify.insight.body')}
        </p>

        <a
          href={stripeUrl}
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-cta)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all var(--transition-base)',
            boxShadow: '0 2px 8px rgba(245, 245, 100, 0.3)',
          }}
        >
          {getCopy('amplify.insight.cta')}
        </a>

        <p
          style={{
            marginTop: 'var(--space-4)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {getCopy('amplify.insight.caption')}
        </p>
      </div>
    </div>
  )
}
