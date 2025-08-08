'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, DollarSign, BarChart3, Download, RefreshCw, AlertCircle } from 'lucide-react'
import { LinkStatsService } from '@/lib/offers'

interface PeriodStats {
  period: {
    startDate: string
    endDate: string
  }
  offers: number
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  totalROI: number
}

export default function PeriodReports() {
  const [periodStats, setPeriodStats] = useState<PeriodStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Встановлюємо початкові дати (поточний місяць)
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  const fetchPeriodStats = async () => {
    if (!startDate || !endDate) {
      setError('Будь ласка, виберіть початкову та кінцеву дату')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const start = new Date(startDate)
      const end = new Date(endDate)

      const stats = LinkStatsService.getStatsByPeriod(start, end)

      const totalRevenue = stats.reduce((sum, s) => sum + (s.revenue || 0), 0)
      const totalExpenses = stats.reduce((sum, s) => sum + (s.cost || 0), 0)
      const totalProfit = totalRevenue - totalExpenses
      const totalROI = totalExpenses > 0 ? (totalProfit / totalExpenses) * 100 : 0
      const offers = new Set(stats.map(s => s.offerId)).size

      setPeriodStats({
        period: { startDate, endDate },
        offers,
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalROI,
      })
    } catch (err) {
      setError('Помилка обробки даних')
      console.error('Error calculating period stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0.0%'
    return `${value.toFixed(1)}%`
  }

  const formatNumber = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0'
    return value.toLocaleString()
  }

  const handleExport = () => {
    if (!periodStats) return

    const reportData = {
      period: periodStats.period,
      stats: periodStats,
      generatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexus_period_report_${startDate}_to_${endDate}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getPresetPeriods = () => {
    const now = new Date()
    const periods = [
      {
        name: 'Поточний місяць',
        start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      },
      {
        name: 'Попередній місяць',
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
        end: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      },
      {
        name: 'Поточний квартал',
        start: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString().split('T')[0],
        end: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0).toISOString().split('T')[0]
      },
      {
        name: 'Поточний рік',
        start: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
        end: new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
      }
    ]
    return periods
  }

  const handlePresetPeriod = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Звіти за період
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Детальна аналітика продуктивності за обраний період
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchPeriodStats}
            disabled={loading}
            className="btn-primary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Оновити
          </button>
          <button
            onClick={handleExport}
            disabled={!periodStats}
            className="btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Початкова дата:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Кінцева дата:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>
          <button
            onClick={fetchPeriodStats}
            disabled={loading || !startDate || !endDate}
            className="btn-primary"
          >
            Аналізувати
          </button>
        </div>

        {/* Preset Periods */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Швидкі періоди:
          </p>
          <div className="flex flex-wrap gap-2">
            {getPresetPeriods().map((period, index) => (
              <button
                key={index}
                onClick={() => handlePresetPeriod(period.start, period.end)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {periodStats && (
        <div className="space-y-6">
          {/* Period Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Період аналізу
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Початкова дата</p>
                <p className="font-medium">{new Date(periodStats.period.startDate).toLocaleDateString('uk-UA')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Кінцева дата</p>
                <p className="font-medium">{new Date(periodStats.period.endDate).toLocaleDateString('uk-UA')}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Оффери</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(periodStats.offers)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Дохід</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(periodStats.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Витрати</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(periodStats.totalExpenses)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPercentage(periodStats.totalROI)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Прибутковість
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Загальний дохід:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(periodStats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Загальні витрати:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(periodStats.totalExpenses)}
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-medium">Чистий прибуток:</span>
                  <span className={`font-bold text-lg ${
                    periodStats.totalProfit >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(periodStats.totalProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ефективність
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Кількість офферів:</span>
                  <span className="font-medium">{formatNumber(periodStats.offers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Середній дохід на оффер:</span>
                  <span className="font-medium">
                    {formatCurrency(periodStats.offers > 0 ? periodStats.totalRevenue / periodStats.offers : 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Середні витрати на оффер:</span>
                  <span className="font-medium">
                    {formatCurrency(periodStats.offers > 0 ? periodStats.totalExpenses / periodStats.offers : 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Загальний ROI:</span>
                  <span className={`font-bold ${
                    periodStats.totalROI >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatPercentage(periodStats.totalROI)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!periodStats && !loading && (
        <div className="card">
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Виберіть період для аналізу
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Оберіть початкову та кінцеву дату або використайте швидкі періоди для отримання детальної аналітики
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 