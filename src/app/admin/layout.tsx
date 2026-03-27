import AdminLayout from '@/components/admin/AdminLayout'
import { ReactNode } from 'react'

export default function AdminPageLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
