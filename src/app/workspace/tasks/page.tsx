'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'

export default function WorkspaceTasksPage() {
    return (
        <ModernLayout title="Задачі" description="Управління задачами команди">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Задачі тимчасово недоступні</p>
                <p className="text-sm mt-1">Ведуться технічні роботи</p>
            </div>
        </ModernLayout>
    )
} 