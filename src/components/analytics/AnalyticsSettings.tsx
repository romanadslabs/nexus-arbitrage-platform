'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, BarChart3, Eye, Users, Activity, 
  CheckCircle, AlertCircle, RefreshCw, Download,
  ExternalLink, Copy, EyeOff
} from 'lucide-react'
import analyticsService from '@/lib/analytics'

interface AnalyticsSettingsProps {
  onClose?: () => void
}

export default function AnalyticsSettings({ onClose }: AnalyticsSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [settings, setSettings] = useState({
    googleAnalytics: {
      enabled: false,
      measurementId: ''
    },
    mixpanel: {
      enabled: false,
      token: ''
    },
    hotjar: {
      enabled: true,
      siteId: '6477760'
    }
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const data = await analyticsService.getAnalyticsData()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Помилка завантаження аналітичних даних:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Тут буде логіка збереження налаштувань
      await analyticsService.initialize()
      console.log('✅ Налаштування аналітики збережено')
    } catch (error) {
      console.error('❌ Помилка збереження налаштувань:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Можна додати toast повідомлення
  }

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-600' : 'text-gray-400'
  }

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Налаштування аналітики
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Інтеграція з зовнішніми аналітичними сервісами
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadAnalyticsData}
            disabled={isLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Оновити</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Закрити
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Налаштування сервісів */}
        <div className="space-y-6">
          {/* Google Analytics */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Google Analytics 4
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Відстеження трафіку та поведінки користувачів
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(settings.googleAnalytics.enabled)}`}>
                {getStatusIcon(settings.googleAnalytics.enabled)}
                <span className="text-sm font-medium">
                  {settings.googleAnalytics.enabled ? 'Активний' : 'Неактивний'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Measurement ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={settings.googleAnalytics.measurementId}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      googleAnalytics: {
                        ...prev.googleAnalytics,
                        measurementId: e.target.value
                      }
                    }))}
                    placeholder="G-XXXXXXXXXX"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => copyToClipboard(settings.googleAnalytics.measurementId)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ga-enabled"
                  checked={settings.googleAnalytics.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    googleAnalytics: {
                      ...prev.googleAnalytics,
                      enabled: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="ga-enabled" className="text-sm text-gray-700 dark:text-gray-300">
                  Увімкнути Google Analytics
                </label>
              </div>
            </div>
          </div>

          {/* Mixpanel */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mixpanel
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Детальна аналітика користувачів та подій
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(settings.mixpanel.enabled)}`}>
                {getStatusIcon(settings.mixpanel.enabled)}
                <span className="text-sm font-medium">
                  {settings.mixpanel.enabled ? 'Активний' : 'Неактивний'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Token
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={settings.mixpanel.token}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mixpanel: {
                        ...prev.mixpanel,
                        token: e.target.value
                      }
                    }))}
                    placeholder="your-mixpanel-token"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mixpanel-enabled"
                  checked={settings.mixpanel.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    mixpanel: {
                      ...prev.mixpanel,
                      enabled: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="mixpanel-enabled" className="text-sm text-gray-700 dark:text-gray-300">
                  Увімкнути Mixpanel
                </label>
              </div>
            </div>
          </div>

          {/* Hotjar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hotjar
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Теплові карти та записи сесій користувачів
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(settings.hotjar.enabled)}`}>
                {getStatusIcon(settings.hotjar.enabled)}
                <span className="text-sm font-medium">
                  {settings.hotjar.enabled ? 'Активний' : 'Неактивний'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site ID
                </label>
                <input
                  type="text"
                  value={settings.hotjar.siteId}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hotjar: {
                      ...prev.hotjar,
                      siteId: e.target.value
                    }
                  }))}
                  placeholder="1234567"
                  className="input-field"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hotjar-enabled"
                  checked={settings.hotjar.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hotjar: {
                      ...prev.hotjar,
                      enabled: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="hotjar-enabled" className="text-sm text-gray-700 dark:text-gray-300">
                  Увімкнути Hotjar
                </label>
              </div>
            </div>
          </div>

          {/* Кнопки дій */}
          <div className="flex space-x-3">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>{isLoading ? 'Збереження...' : 'Зберегти налаштування'}</span>
            </button>
            <button
              onClick={loadAnalyticsData}
              disabled={isLoading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Тестувати підключення</span>
            </button>
          </div>
        </div>

        {/* Аналітичні дані */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Швидкі метрики
              </h3>
              <Download className="w-5 h-5 text-gray-500" />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : analyticsData ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Користувачів', value: analyticsData.totalUsers, icon: Users },
                  { label: 'Активних', value: analyticsData.activeUsers, icon: Activity },
                  { label: 'Аккаунтів', value: analyticsData.totalAccounts, icon: BarChart3 },
                  { label: 'Кампаній', value: analyticsData.totalCampaigns, icon: Activity }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <metric.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Немає даних для відображення
              </div>
            )}
          </div>

          {/* Топ платформи */}
          {analyticsData?.topPlatforms && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Топ платформи
              </h3>
              <div className="space-y-3">
                {analyticsData.topPlatforms.map((platform: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {platform.platform}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {platform.count} аккаунтів
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Остання активність */}
          {analyticsData?.recentActivity && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Остання активність
              </h3>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {activity.type === 'account_created' ? 'Створено аккаунтів' :
                         activity.type === 'campaign_launched' ? 'Запущено кампаній' :
                         activity.type === 'task_completed' ? 'Завершено завдань' : activity.type}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Інструкції */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Інструкції по налаштуванню
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Google Analytics 4
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Створіть акаунт на <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Analytics</a></li>
              <li>Створіть новий ресурс (property)</li>
              <li>Скопіюйте Measurement ID (формат: G-XXXXXXXXXX)</li>
              <li>Вставте ID в поле вище та увімкніть аналітику</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Mixpanel
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Зареєструйтесь на <a href="https://mixpanel.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Mixpanel</a></li>
              <li>Створіть новий проект</li>
              <li>Скопіюйте Project Token</li>
              <li>Вставте токен в поле вище та увімкніть аналітику</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Hotjar
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Створіть акаунт на <a href="https://hotjar.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Hotjar</a></li>
              <li>Створіть новий сайт</li>
              <li>Скопіюйте Site ID (число)</li>
              <li>Вставте ID в поле вище та увімкніть аналітику</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 