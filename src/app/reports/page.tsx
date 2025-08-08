'use client'

import React, { useState } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Database, BarChart2, TrendingUp } from 'lucide-react'

import PerformanceReports from '@/components/reports/PerformanceReports'
import PeriodReports from '@/components/reports/PeriodReports'
import UnifiedDataView from '@/components/reports/UnifiedDataView'
import { FadeIn } from '@/components/ui/Animations'

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('performance')

    const tabs = [
        { id: 'performance', name: 'Performance звіти', icon: TrendingUp, component: <PerformanceReports /> },
        { id: 'period', name: 'Звіти за період', icon: BarChart2, component: <PeriodReports /> },
        { id: 'unified', name: 'Об\'єднані дані', icon: Database, component: <UnifiedDataView /> },
    ]

    return (
        <ProtectedRoute>
            <ModernLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Звіти та аналітика</h1>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <nav className="-mb-px flex gap-4 min-w-max" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    } group inline-flex items-center py-3 px-2 sm:px-3 border-b-2 font-medium text-sm whitespace-nowrap`}
                                >
                                    <tab.icon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6">
                        <FadeIn>
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </FadeIn>
                    </div>
                </div>
            </ModernLayout>
        </ProtectedRoute>
    );
} 
 