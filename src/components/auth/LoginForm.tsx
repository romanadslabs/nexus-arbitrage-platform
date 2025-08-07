'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

interface LoginFormProps {
  isRegister?: boolean
}

export default function LoginForm({ isRegister = false }: LoginFormProps) {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(!isRegister)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'farmer' as 'farmer' | 'launcher' | 'leader',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
      } else {
        await signUp(formData.email, formData.password, formData.name, formData.role)
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role: 'farmer' | 'launcher' | 'leader') => {
    setLoading(true)
    try {
      const mockUser = {
        id: `test-${role}-id`,
        email: `${role}@test.com`,
        name: `Test ${role}`,
        role,
        createdAt: new Date(),
      }
      
      // Симулюємо вхід
      await signIn(mockUser.email, 'password123')
    } catch (error) {
      console.error('Quick login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Увійти в систему' : 'Створити акаунт'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? (
              <>
                Або{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  створити новий акаунт
                </button>
              </>
            ) : (
              <>
                Або{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  увійти в існуючий акаунт
                </button>
              </>
            )}
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Швидкий вхід для тестування:
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickLogin('farmer')}
              disabled={loading}
              className="btn-secondary text-xs py-2"
            >
              Фармер
            </button>
            <button
              onClick={() => handleQuickLogin('launcher')}
              disabled={loading}
              className="btn-secondary text-xs py-2"
            >
              Арбітражник
            </button>
            <button
              onClick={() => handleQuickLogin('leader')}
              disabled={loading}
              className="btn-secondary text-xs py-2"
            >
              Адміністратор
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Або введіть дані
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ім'я
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Введіть ваше ім'я"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Роль
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'farmer' | 'launcher' | 'leader' })}
                    className="input-field"
                  >
                    <option value="farmer">Фармер</option>
                    <option value="launcher">Арбітражник</option>
                    <option value="leader">Адміністратор</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Введіть ваш email"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Пароль
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Введіть ваш пароль"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-2 px-4"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                isLogin ? 'Увійти' : 'Створити акаунт'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 