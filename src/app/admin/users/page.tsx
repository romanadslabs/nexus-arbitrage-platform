'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Shield, 
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
  Edit,
  Ban,
  Unlock
} from 'lucide-react'
import { useAuth, User } from '@/components/providers/AuthProvider'
import ModernLayout from '@/components/layout/ModernLayout'
import { Card } from '@/components/ui/Card'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import UserStats from '@/components/admin/UserStats'

export default function UserManagementPage() {
  const { user, getAllUsers, approveUser, suspendUser, activateUser, deleteUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showActions, setShowActions] = useState<string | null>(null)

  useEffect(() => {
    // Тільки адмін може бачити цю сторінку
    if (user?.role === 'admin') {
      setUsers(getAllUsers())
    }
  }, [user, getAllUsers])

  const handleApproveUser = (userId: string) => {
    approveUser(userId).then(() => {
      setUsers(getAllUsers()) // Оновлюємо список після дії
      setShowActions(null)
    })
  }

  const handleSuspendUser = (userId: string) => {
    suspendUser(userId).then(() => {
      setUsers(getAllUsers())
      setShowActions(null)
    })
  }

  const handleActivateUser = (userId: string) => {
    activateUser(userId).then(() => {
      setUsers(getAllUsers())
      setShowActions(null)
    })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      deleteUser(userId).then(() => {
        setUsers(getAllUsers())
        setShowActions(null)
      })
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute requiredRole="admin">
      <ModernLayout title="Управління користувачами" description="Адміністрування акаунтів системи">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Статистика користувачів */}
          <UserStats users={users} />

          {/* Пошук та управління */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Список користувачів
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {filteredUsers.length} користувачів знайдено
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук користувачів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ім'я
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Роль
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата реєстрації
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Дії</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.status === 'active' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">Активний</span>}
                        {u.status === 'pending' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Очікує</span>}
                        {u.status === 'suspended' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Заблокований</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div className="flex items-center justify-end space-x-2">
                          {u.status === 'pending' && (
                            <button 
                              onClick={() => handleApproveUser(u.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center space-x-1"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Підтвердити</span>
                            </button>
                          )}
                          
                          {u.status === 'active' && (
                            <button 
                              onClick={() => handleSuspendUser(u.id)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 flex items-center space-x-1"
                            >
                              <Ban className="w-4 h-4" />
                              <span>Заблокувати</span>
                            </button>
                          )}
                          
                          {u.status === 'suspended' && (
                            <button 
                              onClick={() => handleActivateUser(u.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center space-x-1"
                            >
                              <Unlock className="w-4 h-4" />
                              <span>Розблокувати</span>
                            </button>
                          )}
                          
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === u.id ? null : u.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showActions === u.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Видалити
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </ModernLayout>
    </ProtectedRoute>
  )
} 