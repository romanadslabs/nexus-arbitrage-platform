'use client'

import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import EnhancedWorkspace from '@/components/workspaces/EnhancedWorkspace'
import { useAuth } from '@/components/providers/AuthProvider'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function WorkspaceTeamPage() {
  const { user } = useAuth()
  
  return (
    <ProtectedRoute requiredRole="leader">
      <FadeIn>
        <SlideUp>
          <EnhancedWorkspace 
            workspaceId="ws-1"
            currentUser={user?.name || ''}
            currentUserId={user?.id || ''}
          />
        </SlideUp>
      </FadeIn>
    </ProtectedRoute>
  )
} 