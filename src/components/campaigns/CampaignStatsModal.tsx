'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { CampaignDailyStats } from '@/types'
import { CampaignStatsService } from '@/lib/campaignStats'
import { X, Save, Calendar, BarChart3, DollarSign, Users, TrendingUp, Calculator } from 'lucide-react'

interface CampaignStatsModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignName: string
  onSave?: () => void
}

export default function CampaignStatsModal({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  onSave
}: CampaignStatsModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    impressions: '',
    clicks: '',
    conversions: '',
    leads: '',
    spend: '',
    revenue: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [existingStats, setExistingStats] = useState<CampaignDailyStats | null>(null)

  // Завантаження існуючої статистики при зміні дати
  useEffect(() => {
    if (formData.date && campaignId) {
      const stats = CampaignStatsService.getStatsByDate(campaignId, formData.date)
      if (stats) {
        setExistingStats(stats)
        setFormData({
          date: stats.date,
          impressions: stats.impressions.toString(),
          clicks: stats.clicks.toString(),
          conversions: stats.conversions.toString(),
          leads: stats.leads.toString(),
          spend: stats.spend.toString(),
          revenue: stats.revenue.toString(),
          notes: stats.notes || ''
        })
      } else {
        setExistingStats(null)
        setFormData(prev => ({
          ...prev,
          impressions: '',
          clicks: '',
          conversions: '',
          leads: '',
          spend: '',
          revenue: '',
          notes: ''
        }))
      }
    }
  }, [formData.date, campaignId])

  // Скидання форми при відкритті/закритті
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        impressions: '',
        clicks: '',
        conversions: '',
        leads: '',
        spend: '',
        revenue: '',
        notes: ''
      })
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Розрахунок метрик в реальному часі
  const calculateMetrics = () => {
    const impressions = parseFloat(formData.impressions) || 0
    const clicks = parseFloat(formData.clicks) || 0
    const conversions = parseFloat(formData.conversions) || 0
    const leads = parseFloat(formData.leads) || 0
    const spend = parseFloat(formData.spend) || 0
    const revenue = parseFloat(formData.revenue) || 0

    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
    const cvr = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00'
    const cpl = leads > 0 ? (spend / leads).toFixed(2) : '0.00'
    const roi = spend > 0 ? (((revenue - spend) / spend) * 100).toFixed(2) : '0.00'
    const profit = (revenue - spend).toFixed(2)

    return { ctr, cvr, cpl, roi, profit }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const statsData = {
        campaignId,
        date: formData.date,
        impressions: parseFloat(formData.impressions) || 0,
        clicks: parseFloat(formData.clicks) || 0,
        conversions: parseFloat(formData.conversions) || 0,
        leads: parseFloat(formData.leads) || 0,
        spend: parseFloat(formData.spend) || 0,
        revenue: parseFloat(formData.revenue) || 0,
        ctr: 0, // Will be calculated in service
        cvr: 0, // Will be calculated in service
        cpl: 0, // Will be calculated in service
        roi: 0, // Will be calculated in service
        notes: formData.notes,
        createdBy: user.id
      }

      CampaignStatsService.createOrUpdateStats(statsData)
      
      if (onSave) {
        onSave()
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving campaign stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const metrics = calculateMetrics()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Статистика кампанії
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {campaignName} • {existingStats ? 'Редагування' : 'Додавання'} статистики
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Дата *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            {existingStats && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                ⚠️ За цю дату вже є статистика. При збереженні вона буде оновлена.
              </p>
            )}
          </div>

          {/* Основні метрики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <BarChart3 className="inline w-4 h-4 mr-1" />
                Покази
              </label>
              <input
                type="number"
                min="0"
                value={formData.impressions}
                onChange={(e) => handleInputChange('impressions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Users className="inline w-4 h-4 mr-1" />
                Кліки
              </label>
              <input
                type="number"
                min="0"
                value={formData.clicks}
                onChange={(e) => handleInputChange('clicks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                Ліди
              </label>
              <input
                type="number"
                min="0"
                value={formData.leads}
                onChange={(e) => handleInputChange('leads', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Конверсії
              </label>
              <input
                type="number"
                min="0"
                value={formData.conversions}
                onChange={(e) => handleInputChange('conversions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Фінансові метрики */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Витрати ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.spend}
                onChange={(e) => handleInputChange('spend', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                Дохід ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Розраховані метрики */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Calculator className="w-5 h-5 text-blue-500 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Розраховані метрики</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">CTR:</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">{metrics.ctr}%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">CVR:</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">{metrics.cvr}%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">CPL:</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">${metrics.cpl}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">ROI:</span>
                <span className={`ml-1 font-medium ${parseFloat(metrics.roi) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {metrics.roi}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Прибуток:</span>
                <span className={`ml-1 font-medium ${parseFloat(metrics.profit) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${metrics.profit}
                </span>
              </div>
            </div>
          </div>

          {/* Нотатки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Нотатки
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Додаткова інформація про результати дня..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Збереження...' : existingStats ? 'Оновити' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 