'use client'

import React, { useState } from 'react'
import { useKasmWeb } from '@/components/providers/KasmWebProvider'
import { useData } from '@/components/providers/DataProvider'
import { Account } from '@/types'
import { Monitor, Play, Square, ExternalLink, Settings, RefreshCw } from 'lucide-react'

interface BrowserManagerProps {
  account: Account
  onSessionUpdate?: (sessionId: string) => void
}

export default function BrowserManager({ account, onSessionUpdate }: BrowserManagerProps) {
  const { 
    launchAccountBrowser, 
    stopAccountBrowser, 
    getAccountSession, 
    getSessionUrl,
    isLoading,
    error 
  } = useKasmWeb()
  
  const [sessionUrl, setSessionUrl] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)

  const session = getAccountSession(account.id)

  const handleLaunchBrowser = async () => {
    try {
      setIsConnecting(true)
      const newSession = await launchAccountBrowser(account)
      onSessionUpdate?.(newSession.session_id)
      
      // Отримуємо URL для підключення
      const url = await getSessionUrl(newSession.session_id)
      setSessionUrl(url)
    } catch (err) {
      console.error('Помилка запуску браузера:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleStopBrowser = async () => {
    try {
      await stopAccountBrowser(account.id)
      setSessionUrl('')
    } catch (err) {
      console.error('Помилка зупинки браузера:', err)
    }
  }

  const handleConnect = async () => {
    if (session) {
      try {
        const url = await getSessionUrl(session.session_id)
        window.open(url, '_blank')
      } catch (err) {
        console.error('Помилка підключення:', err)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100'
      case 'starting':
        return 'text-yellow-600 bg-yellow-100'
      case 'stopping':
        return 'text-orange-600 bg-orange-100'
      case 'stopped':
        return 'text-gray-600 bg-gray-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Запущений'
      case 'starting':
        return 'Запускається'
      case 'stopping':
        return 'Зупиняється'
      case 'stopped':
        return 'Зупинений'
      case 'error':
        return 'Помилка'
      default:
        return 'Невідомо'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Браузер для {account.name}
          </h3>
        </div>
        
        {session && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
            {getStatusText(session.status)}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {/* Інформація про сесію */}
        {session && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Сесія:</span>
                <span className="ml-2 font-mono text-xs">{session.session_id.slice(0, 8)}...</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Образ:</span>
                <span className="ml-2">{session.image_name}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Створено:</span>
                <span className="ml-2">{new Date(session.created).toLocaleString('uk-UA')}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Активність:</span>
                <span className="ml-2">{new Date(session.last_activity).toLocaleString('uk-UA')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки керування */}
        <div className="flex space-x-2">
          {!session ? (
            <button
              onClick={handleLaunchBrowser}
              disabled={isLoading || isConnecting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>{isConnecting ? 'Запуск...' : 'Запустити браузер'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleConnect}
                disabled={session.status !== 'running'}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Підключитися</span>
              </button>
              
              <button
                onClick={handleStopBrowser}
                disabled={session.status === 'stopping' || session.status === 'stopped'}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4" />
                <span>Зупинити</span>
              </button>
            </>
          )}
        </div>

        {/* Додаткова інформація */}
        {session && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Платформа: {account.platform}</p>
            <p>Категорія: {account.category}</p>
            {/* Browser profile information would go here */}
            <div className="mt-2">
              <p>User Agent: Chrome/120.0.0.0</p>
              <p>Розширення: 1920x1080</p>
              <p>Часовий пояс: UTC+2</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 