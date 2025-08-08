'use client'

import React from 'react'
import AdvancedTaskManager from '@/components/workspaces/AdvancedTaskManager'
import { useAuth } from '@/components/providers/AuthProvider'
import { mockTeamMembers } from '@/components/workspaces/mockData'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function WorkspaceTasksPage() {
  const { user } = useAuth()
  const currentUser = (user?.name || user?.email) || mockTeamMembers[0].name

  return (
    <FadeIn>
      <SlideUp>
        <AdvancedTaskManager 
          workspaceId="ws-1"
          currentUser={currentUser}
        />
      </SlideUp>
    </FadeIn>
  )
} 