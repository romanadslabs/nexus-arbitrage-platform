'use client'

import ModernLayout from '@/components/layout/ModernLayout'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <ModernLayout title="Дашборд" description="Головна сторінка аналітики та статистики">
        <AnalyticsDashboard />
      </ModernLayout>
    </ProtectedRoute>
  )
} 