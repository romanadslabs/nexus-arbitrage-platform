'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'

export default function WorkspaceTeamPage() {
    return (
        <ModernLayout title="Команда" description="Управління учасниками команди">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Команда тимчасово недоступна</p>
                <p className="text-sm mt-1">Ведуться технічні роботи</p>
            </div>
        </ModernLayout>
    )
} 