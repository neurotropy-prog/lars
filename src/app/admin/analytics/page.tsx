/**
 * /admin/analytics — Panel de analytics L.A.R.S.
 *
 * Muestra el embudo completo, métricas clave y últimos diagnósticos.
 * Datos reales de Supabase.
 */

import AnalyticsDashboard from './AnalyticsDashboard'
import SiteHeader from '@/components/SiteHeader'

export const metadata = {
  title: 'Panel L.A.R.S. · Analytics',
  robots: { index: false, follow: false },
}

export default function AnalyticsPage() {
  return (
    <>
      <SiteHeader variant="admin" />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        padding: 'calc(var(--header-height, 56px) + var(--space-8)) var(--space-6) var(--space-8)',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  )
}
