'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

interface GoogleAdsSettingsProps {}

export default function GoogleAdsSettings({}: GoogleAdsSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const [settings, setSettings] = useState({
    clientId: '',
    clientSecret: '',
    developerToken: '',
    customerId: '',
    refreshToken: '',
    loginCustomerId: ''
  })

  // Завантаження налаштувань
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      // Тут можна додати завантаження з localStorage або API
      const savedSettings = localStorage.getItem('googleAdsSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      // Зберігаємо в localStorage (в продакшені краще використовувати безпечне сховище)
      localStorage.setItem('googleAdsSettings', JSON.stringify(settings))
      setMessage('Налаштування збережено успішно')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Помилка збереження налаштувань')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setTestLoading(true)
      setConnectionStatus('idle')

      const response = await fetch('/api/google-ads?action=test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: settings.customerId,
          clientId: settings.clientId,
          clientSecret: settings.clientSecret,
          developerToken: settings.developerToken,
          refreshToken: settings.refreshToken
        }),
      })

      const data = await response.json()

      if (data.success) {
        setConnectionStatus('success')
        setMessage('Підключення успішне!')
      } else {
        setConnectionStatus('error')
        setMessage(data.message || 'Помилка підключення')
      }
    } catch (error) {
      console.error('Connection test error:', error)
      setConnectionStatus('error')
      setMessage('Помилка тестування підключення')
    } finally {
      setTestLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Settings className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Підключено'
      case 'error':
        return 'Помилка підключення'
      default:
        return 'Не підключено'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Google Ads API
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Налаштування інтеграції з Google Ads API
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${
            connectionStatus === 'success' ? 'text-green-600' : 
            connectionStatus === 'error' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          connectionStatus === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : connectionStatus === 'error'
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <p className={`text-sm ${
            connectionStatus === 'success' ? 'text-green-800 dark:text-green-200' :
            connectionStatus === 'error' ? 'text-red-800 dark:text-red-200' :
            'text-blue-800 dark:text-blue-200'
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client ID
            </label>
            <input
              type="text"
              value={settings.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть Client ID"
            />
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Secret
            </label>
            <div className="relative">
              <input
                type={showSecrets ? 'text' : 'password'}
                value={settings.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введіть Client Secret"
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showSecrets ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Developer Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Developer Token
            </label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.developerToken}
              onChange={(e) => handleInputChange('developerToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть Developer Token"
            />
          </div>

          {/* Customer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer ID
            </label>
            <input
              type="text"
              value={settings.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть Customer ID"
            />
          </div>

          {/* Refresh Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refresh Token
            </label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.refreshToken}
              onChange={(e) => handleInputChange('refreshToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть Refresh Token"
            />
          </div>

          {/* Login Customer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Login Customer ID (опціонально)
            </label>
            <input
              type="text"
              value={settings.loginCustomerId}
              onChange={(e) => handleInputChange('loginCustomerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть Login Customer ID"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Збереження...' : 'Зберегти'}</span>
            </button>

            <button
              onClick={testConnection}
              disabled={testLoading || !settings.customerId}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span>{testLoading ? 'Тестування...' : 'Тестувати підключення'}</span>
            </button>
          </div>

          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {showSecrets ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Сховати секрети</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Показати секрети</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">
          Інструкції по налаштуванню
        </h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <p>1. Створіть проект в Google Cloud Console</p>
          <p>2. Увімкніть Google Ads API</p>
          <p>3. Створіть OAuth 2.0 credentials</p>
          <p>4. Отримайте Developer Token від Google Ads</p>
          <p>5. Заповніть всі поля та протестуйте підключення</p>
        </div>
        <div className="mt-4">
          <a
            href="https://developers.google.com/google-ads/api/docs/first-call/dev-token"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Документація Google Ads API →
          </a>
        </div>
      </div>
    </div>
  )
} 