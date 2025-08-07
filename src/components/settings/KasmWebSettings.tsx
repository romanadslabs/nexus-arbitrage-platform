'use client'

import React, { useState, useEffect } from 'react'
import { KASM_CONFIG, validateKasmConfig } from '@/lib/kasmConfig'
import { useKasmWeb } from '@/components/providers/KasmWebProvider'
import { Settings, Server, Key, Globe, TestTube, CheckCircle, AlertCircle } from 'lucide-react'

export default function KasmWebSettings() {
  const { refreshSessions, refreshImages, refreshServers, isLoading, error } = useKasmWeb()
  const [config, setConfig] = useState(KASM_CONFIG)
  const [validation, setValidation] = useState(validateKasmConfig())
  const [testResults, setTestResults] = useState<{
    sessions: boolean
    images: boolean
    servers: boolean
  } | null>(null)

  useEffect(() => {
    setValidation(validateKasmConfig())
  }, [config])

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTestConnection = async () => {
    setTestResults(null)
    
    try {
      // Тестуємо підключення до різних ендпоінтів
      const results = {
        sessions: false,
        images: false,
        servers: false
      }

      try {
        await refreshSessions()
        results.sessions = true
      } catch (err) {
        console.error('Помилка тестування сесій:', err)
      }

      try {
        await refreshImages()
        results.images = true
      } catch (err) {
        console.error('Помилка тестування образів:', err)
      }

      try {
        await refreshServers()
        results.servers = true
      } catch (err) {
        console.error('Помилка тестування серверів:', err)
      }

      setTestResults(results)
    } catch (err) {
      console.error('Помилка тестування підключення:', err)
    }
  }

  const getTestIcon = (test: boolean | undefined) => {
    if (test === undefined) return <TestTube className="h-4 w-4 text-gray-400" />
    return test ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          KasmWeb Налаштування
        </h2>
      </div>

      {/* Статус конфігурації */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Статус конфігурації
          </h3>
          {validation.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>

        {validation.errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Помилки конфігурації:</h4>
            <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Основні налаштування */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Основні налаштування
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* URL сервера */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              URL сервера
            </label>
            <input
              type="url"
              value={config.SERVER_URL}
              onChange={(e) => handleConfigChange('SERVER_URL', e.target.value)}
              placeholder="https://kasm.your-domain.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Приклад: https://192.168.1.100:6901
            </p>
          </div>

          {/* API ключ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Key className="h-4 w-4 inline mr-1" />
              API ключ
            </label>
            <input
              type="text"
              value={config.API_KEY}
              onChange={(e) => handleConfigChange('API_KEY', e.target.value)}
              placeholder="Ваш API ключ"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* API секрет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Key className="h-4 w-4 inline mr-1" />
              API секрет
            </label>
            <input
              type="password"
              value={config.API_SECRET}
              onChange={(e) => handleConfigChange('API_SECRET', e.target.value)}
              placeholder="Ваш API секрет"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Максимальна кількість сесій */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Server className="h-4 w-4 inline mr-1" />
              Максимум сесій
            </label>
            <input
              type="number"
              value={config.SESSION_CONFIG.MAX_SESSIONS}
              onChange={(e) => handleConfigChange('SESSION_CONFIG', {
                ...config.SESSION_CONFIG,
                MAX_SESSIONS: parseInt(e.target.value)
              })}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Тестування підключення */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Тестування підключення
          </h3>
          <button
            onClick={handleTestConnection}
            disabled={isLoading || !validation.isValid}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TestTube className="h-4 w-4" />
            <span>{isLoading ? 'Тестування...' : 'Тестувати підключення'}</span>
          </button>
        </div>

        {testResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {getTestIcon(testResults.sessions)}
              <span className="text-sm font-medium">Сесії</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {getTestIcon(testResults.images)}
              <span className="text-sm font-medium">Образів</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {getTestIcon(testResults.servers)}
              <span className="text-sm font-medium">Серверів</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Інструкції */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
          Інструкції по налаштуванню
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>Скопіюй файл <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">kasm-config.example.env</code> як <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code></li>
          <li>Відредагуй <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> з твоїми налаштуваннями</li>
          <li>Перезапусти сервер розробки</li>
          <li>Протестуй підключення за допомогою кнопки вище</li>
        </ol>
      </div>
    </div>
  )
} 