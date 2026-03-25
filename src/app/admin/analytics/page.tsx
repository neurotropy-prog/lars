'use client'

/**
 * /admin/analytics — Panel de analytics L.A.R.S.
 *
 * Muestra el embudo completo, métricas clave y últimas evaluaciones.
 */

import AnalyticsDashboard from './AnalyticsDashboard'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: '960px' }}>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}
