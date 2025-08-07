'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import AirtableSettings from '@/components/settings/AirtableSettings'
import GoogleAdsSettings from '@/components/settings/GoogleAdsSettings'
import KasmWebSettings from '@/components/settings/KasmWebSettings'

export default function SettingsPage() {
  return (
    <ModernLayout
      title="Налаштування"
      description="Керуйте налаштуваннями інтеграцій та системи"
    >
      <div className="space-y-8">
        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Airtable Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <AirtableSettings />
          </div>

          {/* Google Ads Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <GoogleAdsSettings />
          </div>
        </div>

        {/* KasmWeb Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <KasmWebSettings />
        </div>
      </div>
    </ModernLayout>
  )
} 