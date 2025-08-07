'use client'

import React from 'react'

export default function SimpleLayoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            🎉 Nexus Platform - Простий тест
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ✅ Система обробки помилок
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                ErrorBoundary налаштовано та працює
              </p>
            </div>
            
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Придушення помилок
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Помилки розширень придушено
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Доступні тестові сторінки:
            </h2>
            <div className="space-y-2">
              <a 
                href="/simple-test" 
                className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                🧪 Простий тест ErrorBoundary
              </a>
              <a 
                href="/test-error-handling" 
                className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                🔧 Повний тест обробки помилок
              </a>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200 text-center">
              ℹ️ Відкрийте консоль браузера (F12) та перевірте, чи немає помилок "message port closed"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 