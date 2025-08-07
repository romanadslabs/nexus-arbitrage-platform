import React from 'react'
import UnifiedDataView from '@/components/reports/UnifiedDataView'

export const metadata = {
  title: 'Уніфіковані дані | Nexus',
  description: 'Перегляд та управління даними з Airtable в єдиному інтерфейсі'
}

export default function UnifiedDataPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Уніфіковані дані
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Перегляд та управління всіма даними з Airtable в єдиному інтерфейсі з однаковою структурою
        </p>
      </div>

      <UnifiedDataView defaultTable="accounts" />
    </div>
  )
} 