'use client'

import React from 'react'

export default function FarmingManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Фармінг
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Управління фармінгом акаунтів
          </p>
        </div>
      </div>

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
    </div>
  )
} 