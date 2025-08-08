'use client'

import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ModernLayout from '@/components/layout/ModernLayout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useData } from '@/components/providers/DataProvider'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { workspace } = useData()

  const totalTasks = workspace?.tasks?.length || 0
  const inProgress = (workspace?.tasks || []).filter((t: any) => t.status === 'in_progress').length
  const unreadChat = (workspace?.chat || []).length
  const teamCount = (workspace?.team || []).length

  const tabs = [
    { href: '/workspace/dashboard', label: 'Дашборд' },
    { href: '/workspace/tasks', label: `Задачі (${totalTasks}${inProgress ? ` • ${inProgress} в роботі` : ''})` },
    { href: '/workspace/chat', label: `Чат${unreadChat ? ` (${unreadChat})` : ''}` },
    { href: '/workspace/team', label: `Команда (${teamCount})` },
    { href: '/workspace/data', label: 'Дані' },
  ]

  return (
    <ProtectedRoute>
      <ModernLayout title="Робочий простір" description="Координація команди, задач і комунікацій">
        <nav className="mb-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <ul className="flex flex-nowrap gap-2">
            {tabs.map((t) => {
              const isActive = pathname?.startsWith(t.href)
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className={`inline-flex items-center px-3 py-2 rounded-t-md text-sm whitespace-nowrap ${
                      isActive
                        ? 'bg-white dark:bg-gray-900 border border-b-0 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        {children}
      </ModernLayout>
    </ProtectedRoute>
  )
} 