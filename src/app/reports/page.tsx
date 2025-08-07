'use client'

import React, { useState } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import AirtableReports from '@/components/reports/AirtableReports'
import PerformanceReports from '@/components/reports/PerformanceReports'
import PeriodReports from '@/components/reports/PeriodReports'
import UnifiedDataView from '@/components/reports/UnifiedDataView'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('airtable')

  const tabs = [
    { id: 'airtable', name: 'Airtable Звіти' },
    { id: 'performance', name: 'Продуктивність' },
    { id: 'period', name: 'Періодичні' },
    { id: 'unified', name: 'Об\'єднані дані' }
  ]

  return (
    <ModernLayout
      title="Звіти та Аналітика"
      description="Глибокий аналіз ефективності та детальні звіти для прийняття обґрунтованих рішень."
    >
      <div className="space-y-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'airtable' && <AirtableReports />}
          {activeTab === 'performance' && <PerformanceReports />}
          {activeTab === 'period' && <PeriodReports />}
          {activeTab === 'unified' && <UnifiedDataView />}
        </div>
      </div>
    </ModernLayout>
  )
} 
 