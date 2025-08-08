'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  Shield,
  Target,
  User
} from 'lucide-react'
import { User as UserType } from '@/components/providers/AuthProvider'
import { Card } from '@/components/ui/Card'

interface UserStatsProps {
  users: UserType[]
}

export default function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const pendingUsers = users.filter(u => u.status === 'pending').length
  const suspendedUsers = users.filter(u => u.status === 'suspended').length

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    leader: users.filter(u => u.role === 'leader').length,
    farmer: users.filter(u => u.role === 'farmer').length,
    launcher: users.filter(u => u.role === 'launcher').length,
    viewer: users.filter(u => u.role === 'viewer').length,
  }

  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    {
      title: 'Всього користувачів',
      value: totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Активних',
      value: activeUsers,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Очікують підтвердження',
      value: pendingUsers,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Заблокованих',
      value: suspendedUsers,
      icon: UserX,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ]

  const roleIcons = {
    admin: Shield,
    leader: TrendingUp,
    farmer: Target,
    launcher: User,
    viewer: Users
  }

  return (
    <div className="space-y-6">
      {/* Основна статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Статистика по ролях */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Розподіл по ролях
            </h3>
            <div className="space-y-4">
              {Object.entries(roleStats).map(([role, count]) => {
                const Icon = roleIcons[role as keyof typeof roleIcons]
                const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {role}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {count} користувачів
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Останні зареєстровані користувачі */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Останні зареєстровані
            </h3>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : user.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {user.status === 'active' ? 'Активний' : user.status === 'pending' ? 'Очікує' : 'Заблокований'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 