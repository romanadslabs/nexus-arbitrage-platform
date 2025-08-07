'use client'

import React, { useState, useEffect } from 'react'
import { 
  TestTube, Database, RefreshCw, CheckCircle, 
  XCircle, AlertTriangle, Info, Play, 
  StopCircle, FileText, BarChart3, TrendingUp,
  Users, DollarSign, Calendar, Filter
} from 'lucide-react'

interface TestResult {
  id: string
  name: string
  status: 'success' | 'error' | 'loading' | 'pending'
  message: string
  data?: any
  duration?: number
  timestamp: string
}

interface DataSourceTest {
  table: string
  fields: string[]
  recordCount: number
  lastRecord?: string
  sampleData?: any
}

export default function AirtableTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [dataSources, setDataSources] = useState<Record<string, DataSourceTest>>({})
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)

  const tests = [
         {
       id: 'connection',
       name: 'Підключення до Airtable',
       description: 'Перевірка з\'єднання з Airtable API'
     },
    {
      id: 'accounts',
      name: 'Таблиця Accounts',
      description: 'Тестування доступу до таблиці аккаунтів'
    },
    {
      id: 'offers',
      name: 'Таблиця Offers',
      description: 'Тестування доступу до таблиці офферів'
    },
    {
      id: 'expenses',
      name: 'Таблиця Expenses',
      description: 'Тестування доступу до таблиці витрат'
    },
    {
      id: 'reports-overall',
      name: 'Звіт Overall',
      description: 'Тестування загальної статистики'
    },
    {
      id: 'reports-platforms',
      name: 'Звіт Platforms',
      description: 'Тестування статистики по вертикалях'
    },
    {
      id: 'reports-top-roi',
      name: 'Звіт Top ROI',
      description: 'Тестування топ офферів за ROI'
    },
    {
      id: 'reports-accounts',
      name: 'Звіт Accounts',
      description: 'Тестування статистики аккаунтів'
    },
    {
      id: 'reports-period',
      name: 'Звіт за період',
      description: 'Тестування звітів за періодами'
    }
  ]

  const runTest = async (testId: string): Promise<TestResult> => {
    const startTime = Date.now()
    const test = tests.find(t => t.id === testId)
    
    if (!test) {
      return {
        id: testId,
        name: 'Невідомий тест',
        status: 'error',
        message: 'Тест не знайдено',
        timestamp: new Date().toISOString()
      }
    }

    try {
      let response: Response
      let data: any

      switch (testId) {
        case 'connection':
          response = await fetch('/api/airtable/test')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Підключення успішне',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка підключення')
          }

        case 'accounts':
          response = await fetch('/api/airtable/accounts')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: `Знайдено ${data.data.length} аккаунтів`,
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання аккаунтів')
          }

        case 'offers':
          response = await fetch('/api/airtable/reports?type=overall')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Дані офферів отримано успішно',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання офферів')
          }

        case 'expenses':
          response = await fetch('/api/airtable/reports?type=expenses')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Дані витрат отримано успішно',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання витрат')
          }

        case 'reports-overall':
          response = await fetch('/api/airtable/reports?type=overall')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Загальна статистика отримана',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання загальної статистики')
          }

        case 'reports-platforms':
          response = await fetch('/api/airtable/reports?type=platforms')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Статистика по вертикалях отримана',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання статистики по вертикалях')
          }

        case 'reports-top-roi':
          response = await fetch('/api/airtable/reports?type=top-roi&limit=5')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: `Топ ${data.data.length} офферів за ROI отримано`,
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання топ офферів')
          }

        case 'reports-accounts':
          response = await fetch('/api/airtable/reports?type=accounts')
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: 'Статистика аккаунтів отримана',
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання статистики аккаунтів')
          }

        case 'reports-period':
          const endDate = new Date().toISOString().split('T')[0]
          const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          response = await fetch(`/api/airtable/reports?type=period&startDate=${startDate}&endDate=${endDate}`)
          data = await response.json()
          if (data.success) {
            return {
              id: testId,
              name: test.name,
              status: 'success',
              message: `Звіт за період ${startDate} - ${endDate} отримано`,
              data: data.data,
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          } else {
            throw new Error(data.error || 'Помилка отримання звіту за період')
          }

        default:
          throw new Error('Невідомий тип тесту')
      }
    } catch (error) {
      return {
        id: testId,
        name: test.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Невідома помилка',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    const testsToRun = selectedTests.length > 0 ? selectedTests : tests.map(t => t.id)
    
    for (const testId of testsToRun) {
      // Додаємо тест в стан як "loading"
      setTestResults(prev => [...prev, {
        id: testId,
        name: tests.find(t => t.id === testId)?.name || testId,
        status: 'loading',
        message: 'Виконується...',
        timestamp: new Date().toISOString()
      }])

      const result = await runTest(testId)
      
      setTestResults(prev => prev.map(r => r.id === testId ? result : r))
      
      // Невелика затримка між тестами
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunning(false)
  }

  const runSingleTest = async (testId: string) => {
    const result = await runTest(testId)
    setTestResults(prev => [...prev, result])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'loading':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      default:
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const totalTests = testResults.length

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Тестування Airtable
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Діагностика підключення та функціональності звітів
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn btn-outline btn-sm"
          >
            <Info className="w-4 h-4 mr-2" />
            {showDetails ? 'Сховати деталі' : 'Показати деталі'}
          </button>
          <button
            onClick={clearResults}
            className="btn btn-outline btn-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Очистити
          </button>
        </div>
      </div>

      {/* Інформація про джерела даних */}
      {showDetails && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Джерела даних</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold mb-2">Таблиця Accounts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Аккаунти з різних рекламних платформ
              </p>
              <div className="text-xs text-gray-500">
                <strong>Поля:</strong> Account ID, Email, Phone, Platform, Status, Category
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold mb-2">Таблиця Offers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Рекламні оффери та кампанії
              </p>
              <div className="text-xs text-gray-500">
                <strong>Поля:</strong> Name, Vertical, Source, Rate, Revenue, Expenses, ROI
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold mb-2">Таблиця Expenses</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Детальний облік витрат
              </p>
              <div className="text-xs text-gray-500">
                <strong>Поля:</strong> Name, Expense Type, Amount, Linked Offer
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold mb-2">API Endpoints</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Доступні точки доступу
              </p>
              <div className="text-xs text-gray-500">
                <strong>Роути:</strong> /api/airtable/reports, /api/airtable/accounts, /api/airtable/test
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Вибір тестів */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Вибір тестів</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tests.map((test) => (
            <label key={test.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTests.length === 0 || selectedTests.includes(test.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTests(prev => [...prev.filter(id => id !== test.id), test.id])
                  } else {
                    setSelectedTests(prev => prev.filter(id => id !== test.id))
                  }
                }}
                className="checkbox"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{test.name}</div>
                <div className="text-xs text-gray-500">{test.description}</div>
              </div>
            </label>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="btn btn-primary"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Виконується...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Запустити всі тести
              </>
            )}
          </button>
          
          <button
            onClick={() => setSelectedTests([])}
            className="btn btn-outline btn-sm"
          >
            Скинути вибір
          </button>
        </div>
      </div>

      {/* Статистика тестів */}
      {totalTests > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Результати тестування</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalTests}</div>
              <div className="text-sm text-gray-600">Всього тестів</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-600">Успішних</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-600">Помилок</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-600">Успішність</div>
            </div>
          </div>

          {/* Детальні результати */}
          <div className="space-y-3">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.message}
                      </p>
                      {result.duration && (
                        <p className="text-xs text-gray-500">
                          Час виконання: {result.duration}ms
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {result.data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400">
                      Показати дані
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Швидкі тести */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Швидкі тести</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tests.slice(0, 4).map((test) => (
            <button
              key={test.id}
              onClick={() => runSingleTest(test.id)}
              disabled={isRunning}
              className="btn btn-outline btn-sm"
            >
              {test.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 