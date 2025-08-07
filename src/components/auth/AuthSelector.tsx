'use client'

import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import { User, FileText, UserCheck } from 'lucide-react'

export default function AuthSelector() {
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'simple-register' | 'full-register'>('select')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Nexus Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Система управління арбітражними кампаніями
          </p>
        </div>

        {/* Mode Selection */}
        {authMode === 'select' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Виберіть спосіб входу
              </h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setAuthMode('login')}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Увійти в систему</span>
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Або створити акаунт
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAuthMode('simple-register')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Швидка реєстрація</span>
                </button>
                
                <button
                  onClick={() => setAuthMode('full-register')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Повна реєстрація</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Forms */}
        {authMode === 'login' && <LoginForm />}
        {authMode === 'simple-register' && <LoginForm isRegister={true} />}
        {authMode === 'full-register' && <RegistrationForm />}

        {/* Back Button */}
        {authMode !== 'select' && (
          <div className="text-center mt-4">
            <button
              onClick={() => setAuthMode('select')}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm"
            >
              ← Назад до вибору
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 