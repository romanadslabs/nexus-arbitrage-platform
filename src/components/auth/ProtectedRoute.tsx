'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'leader' | 'farmer' | 'launcher' | 'viewer'
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Якщо користувач не авторизований, перенаправляємо на вхід
      if (!isAuthenticated || !user) {
        router.push('/login')
        return
      }

      // Якщо потрібна певна роль і користувач її не має
      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        if (fallback) {
          return
        }
        // Перенаправляємо на головну сторінку або показуємо помилку
        router.push('/')
        return
      }
    }
  }, [user, isLoading, isAuthenticated, requiredRole, router, fallback])

  // Показуємо завантаження поки перевіряємо авторизацію
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Завантаження...</p>
        </div>
      </div>
    )
  }

  // Якщо користувач не авторизований, не показуємо нічого (буде перенаправлено)
  if (!isAuthenticated || !user) {
    return null
  }

  // Якщо потрібна певна роль і користувач її не має
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Доступ заборонено</h1>
          <p className="text-gray-600">У вас немає прав для перегляду цієї сторінки.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 