'use client'

import React, { useMemo } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import TeamLeaderDashboard from '@/components/workspaces/TeamLeaderDashboard'
import { useData } from '@/components/providers/DataProvider'

export default function WorkspaceDashboardPage() {
  const { workspace } = useData()

  const teamMembers = useMemo(() => {
    const team = workspace?.team || []
    const tasks = workspace?.tasks || []

    return team.map((m: any) => {
      const memberTasks = tasks.filter(t => t.assigneeId === m.id)
      const done = memberTasks.filter(t => t.status === 'done').length
      const total = memberTasks.length || 1
      const performance = Math.round((done / total) * 100)

      return {
        id: m.id,
        name: m.name,
        role: m.role || 'member',
        status: 'online' as const,
        performance,
        tasksCompleted: done,
        lastActivity: undefined,
        isActive: true,
      }
    })
  }, [workspace])

  const metrics = useMemo(() => {
    const team = workspace?.team || []
    const tasks = workspace?.tasks || []
    const completed = tasks.filter(t => t.status === 'done').length
    const pending = tasks.filter(t => t.status === 'in_progress' || (t as any).status === 'todo').length
    const overdue = 0
    const avgPerf = teamMembers.length
      ? Math.round(teamMembers.reduce((s, m: any) => s + (m.performance || 0), 0) / teamMembers.length)
      : 0

    return {
      totalMembers: team.length,
      activeMembers: team.length,
      averagePerformance: avgPerf,
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      weeklyGrowth: 0,
    }
  }, [workspace, teamMembers])

  return (
    <ProtectedRoute requiredRole="leader">
      <ModernLayout>
        <TeamLeaderDashboard 
          workspaceId="ws-1"
          teamMembers={teamMembers as any}
          metrics={metrics as any}
        />
      </ModernLayout>
    </ProtectedRoute>
  )
} 