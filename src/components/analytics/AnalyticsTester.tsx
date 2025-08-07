'use client'

import React, { useState } from 'react'
import { 
  Play, BarChart3, Users, Target, CheckSquare, 
  MessageSquare, Settings, Eye, Activity, Zap
} from 'lucide-react'
import analyticsService from '@/lib/analytics'

export default function AnalyticsTester() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testAnalyticsEvents = () => {
    addResult('🧪 Початок тестування аналітики...')

    // Тестуємо відстеження користувача
    analyticsService.identifyUser({
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'farmer'
    })
    addResult('✅ Користувач ідентифікований')

    // Тестуємо створення аккаунта
    analyticsService.trackAccountCreation({
      id: 'test-account-1',
      platform: 'Facebook',
      category: 'business',
      status: 'active',
      farmerId: 'test-user-1'
    })
    addResult('✅ Подія створення аккаунта відправлена')

    // Тестуємо запуск кампанії
    analyticsService.trackCampaignLaunch({
      id: 'test-campaign-1',
      platform: 'Google',
      budget: 1000,
      status: 'active',
      launcherId: 'test-user-1'
    })
    addResult('✅ Подія запуску кампанії відправлена')

    // Тестуємо активність команди
    analyticsService.trackTeamActivity({
      type: 'task_completed',
      teamId: 'test-team-1',
      userRole: 'farmer',
      userId: 'test-user-1'
    })
    addResult('✅ Подія активності команди відправлена')

    // Тестуємо завершення завдання
    analyticsService.trackTaskCompletion({
      category: 'account_creation',
      priority: 'high',
      assignedTo: 'test-user-1',
      completionTime: '2h 30m'
    })
    addResult('✅ Подія завершення завдання відправлена')

    // Тестуємо вхід користувача
    analyticsService.trackUserLogin({
      id: 'test-user-1',
      role: 'farmer'
    })
    addResult('✅ Подія входу користувача відправлена')

    // Тестуємо перегляд сторінки
    analyticsService.trackPageView('analytics-tester', {
      section: 'testing',
      user_role: 'farmer'
    })
    addResult('✅ Подія перегляду сторінки відправлена')

    addResult('🎉 Тестування завершено! Перевірте консоль браузера.')
  }

  const testHotjar = () => {
    addResult('🔥 Тестування Hotjar...')
    
    if (typeof window !== 'undefined' && (window as any).hj) {
      addResult('✅ Hotjar завантажений')
      
      // Тестуємо Hotjar події
      try {
        ;(window as any).hj('event', 'analytics_test')
        addResult('✅ Hotjar подія відправлена')
      } catch (error) {
        addResult('❌ Помилка Hotjar події')
      }
    } else {
      addResult('❌ Hotjar не завантажений')
    }
  }

  const testGoogleAnalytics = () => {
    addResult('📊 Тестування Google Analytics...')
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      addResult('✅ Google Analytics завантажений')
      
      try {
        ;(window as any).gtag('event', 'analytics_test', {
          event_category: 'testing',
          event_label: 'manual_test'
        })
        addResult('✅ Google Analytics подія відправлена')
      } catch (error) {
        addResult('❌ Помилка Google Analytics події')
      }
    } else {
      addResult('❌ Google Analytics не завантажений')
    }
  }

  const testMixpanel = () => {
    addResult('📈 Тестування Mixpanel...')
    
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      addResult('✅ Mixpanel завантажений')
      
      try {
        ;(window as any).mixpanel.track('analytics_test', {
          test_type: 'manual',
          timestamp: new Date().toISOString()
        })
        addResult('✅ Mixpanel подія відправлена')
      } catch (error) {
        addResult('❌ Помилка Mixpanel події')
      }
    } else {
      addResult('❌ Mixpanel не завантажений')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Тестування аналітики
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Перевірка роботи аналітичних сервісів
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearResults}
            className="btn-secondary"
          >
            Очистити результати
          </button>
        </div>
      </div>

      {/* Кнопки тестування */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={testAnalyticsEvents}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Тестувати всі події
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Відправити всі типи подій
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={testHotjar}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Тестувати Hotjar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Перевірити завантаження Hotjar
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={testGoogleAnalytics}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Тестувати GA4
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Перевірити Google Analytics
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={testMixpanel}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Тестувати Mixpanel
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Перевірити Mixpanel
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Результати тестування */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Результати тестування
          </h3>
          <div className="text-sm text-gray-500">
            {testResults.length} записів
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Натисніть кнопку для початку тестування
            </div>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {result}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Інструкції */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Інструкції по тестуванню
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div>
              <strong>1. Відкрийте DevTools (F12)</strong>
              <p>Перейдіть на вкладку Console для перегляду логів</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div>
              <strong>2. Натисніть "Тестувати всі події"</strong>
              <p>Це відправить всі типи подій в аналітику</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
            <div>
              <strong>3. Перевірте консоль браузера</strong>
              <p>Ви побачите логи аналітичних подій</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
            <div>
              <strong>4. Перевірте дашборди сервісів</strong>
              <p>Hotjar, Google Analytics, Mixpanel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 