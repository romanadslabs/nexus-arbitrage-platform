'use client'

import React, { useState } from 'react'

export default function AccountsManager() {
  const [isLoading] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Акаунти
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Керуйте вашими акаунтами
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Завантаження...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Тимчасово недоступно
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Цей розділ тимчасово недоступний. Ведуться технічні роботи.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 