'use client'

import React, { useState } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Settings, Database, Cloud, BarChart, Code, TestTube2, AlertTriangle, CheckCircle, Info } from 'lucide-react'

import AirtableSettings from '@/components/settings/AirtableSettings'
import GoogleAdsSettings from '@/components/settings/GoogleAdsSettings'
import KasmWebSettings from '@/components/settings/KasmWebSettings'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('airtable')

    const tabs = [
        { id: 'airtable', name: 'Airtable', icon: Database, component: <AirtableSettings /> },
        { id: 'google-ads', name: 'Google Ads', icon: BarChart, component: <GoogleAdsSettings /> },
        { id: 'kasmweb', name: 'KasmWeb', icon: Cloud, component: <KasmWebSettings /> },
    ]

    return (
        <ProtectedRoute>
            <ModernLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Налаштування системи</h1>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    <tab.icon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-8">
                        {tabs.find(tab => tab.id === activeTab)?.component}
                    </div>
                </div>
            </ModernLayout>
        </ProtectedRoute>
    );
} 