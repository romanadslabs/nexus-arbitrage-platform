'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'

export default function WorkspaceDashboardPage() {
    return (
        <ModernLayout title="Дашборд" description="Робочий простір команди">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Дашборд тимчасово недоступний</p>
                <p className="text-sm mt-1">Ведуться технічні роботи</p>
            </div>
        </ModernLayout>
    )
} 