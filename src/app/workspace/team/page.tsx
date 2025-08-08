'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import EnhancedWorkspace from '@/components/workspaces/EnhancedWorkspace'
import { useAuth } from '@/components/providers/AuthProvider'

export default function WorkspaceTeamPage() {
    const { user } = useAuth()
    
    return (
        <ProtectedRoute requiredRole="leader">
            <ModernLayout>
                <EnhancedWorkspace 
                    workspaceId="ws-1"
                    currentUser={user?.name || ''}
                    currentUserId={user?.id || ''}
                />
            </ModernLayout>
        </ProtectedRoute>
    )
} 