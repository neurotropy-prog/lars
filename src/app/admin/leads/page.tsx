'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { IconUsers } from '@/components/admin/AdminIcons'

export default function LeadsPage() {
  return (
    <AdminLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: 'rgba(180, 90, 50, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-5)',
          color: 'var(--color-accent)',
        }}>
          <IconUsers size={28} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-lora)',
          fontSize: 'var(--text-h2)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Leads
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          color: 'var(--color-text-tertiary)',
          maxWidth: '400px',
        }}>
          Próximamente — Sprint 3
        </p>
      </div>
    </AdminLayout>
  )
}
