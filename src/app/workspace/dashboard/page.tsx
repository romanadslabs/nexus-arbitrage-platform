'use client'

import React, { useMemo } from 'react'
import { useData } from '@/components/providers/DataProvider'
import { Card, StatCard } from '@/components/ui/Card'
import { CheckSquare, Users, Clock, CheckCircle, Activity } from 'lucide-react'
import ModernLayout from '@/components/layout/ModernLayout'

export default function WorkspaceDashboardPage() {
    const { workspace } = useData()

    const stats = useMemo(() => {
        if (!workspace) return { totalTasks: 0, completedTasks: 0, pendingTasks: 0, teamSize: 0 }
        
        const totalTasks = workspace.tasks.length
        const completedTasks = workspace.tasks.filter(t => t.status === 'done').length
        const pendingTasks = totalTasks - completedTasks
        const teamSize = workspace.team.length

        return { totalTasks, completedTasks, pendingTasks, teamSize }
    }, [workspace])

    if (!workspace) {
        return (
             <ModernLayout title="Дашборд робочого простору" description="Огляд вашої активності, задач та команди.">
                <div>Завантаження дашборду...</div>
            </ModernLayout>
        )
    }

    return (
        <ModernLayout
            title="Дашборд робочого простору"
            description="Огляд вашої активності, задач та команди."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Всього задач" value={stats.totalTasks} icon={CheckSquare} color="blue" />
                    <StatCard title="Виконано" value={stats.completedTasks} icon={CheckCircle} color="green" />
                    <StatCard title="В роботі" value={stats.pendingTasks} icon={Clock} color="orange" />
                    <StatCard title="Учасників" value={stats.teamSize} icon={Users} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18}/>Остання активність</h3>
                        <ul className="space-y-3">
                            {workspace.activity?.slice(0, 5).map(act => (
                                <li key={act.id} className="text-sm text-gray-600 dark:text-gray-400">
                                    {act.text}
                                    <span className="block text-xs text-gray-400">{new Date(act.timestamp).toLocaleString()}</span>
                                </li>
                            ))}
                            {(!workspace.activity || workspace.activity.length === 0) && <p className="text-sm text-gray-500">Активності ще немає.</p>}
                        </ul>
                    </Card>
                    <Card>
                        <h3 className="font-semibold mb-4">Задачі до виконання</h3>
                        <ul className="space-y-3">
                            {workspace.tasks?.filter(t => t.status !== 'done').slice(0, 5).map(task => (
                                <li key={task.id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <span>{task.title}</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </li>
                            ))}
                             {workspace.tasks?.filter(t => t.status !== 'done').length === 0 && <p className="text-sm text-gray-500">Всі задачі виконано!</p>}
                        </ul>
                    </Card>
                </div>
            </div>
        </ModernLayout>
    )
} 