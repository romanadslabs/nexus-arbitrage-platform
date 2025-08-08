'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdvancedTaskManager from '@/components/workspaces/AdvancedTaskManager'
import { useAuth } from '@/components/providers/AuthProvider'
import { mockTeamMembers } from '@/components/workspaces/mockData'

export default function WorkspaceTasksPage() {
    const { user } = useAuth()
    
    // Поточний користувач або перший з мок-даних
    const currentUser = (user?.name || user?.email) || mockTeamMembers[0].name;

    return (
        <ProtectedRoute>
            <ModernLayout>
                <AdvancedTaskManager 
                    workspaceId="ws-1"
                    currentUser={currentUser}
                />
            </ModernLayout>
        </ProtectedRoute>
    )
} 