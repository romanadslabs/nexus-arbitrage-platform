'use client'

import ModernLayout from '@/components/layout/ModernLayout'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default function HomePage() {
  return (
    <ModernLayout title="Дашборд" description="Головна сторінка аналітики та статистики">
      <AnalyticsDashboard />
    </ModernLayout>
  )
} 