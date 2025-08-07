'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Calendar, BarChart3, DollarSign, Users, TrendingUp } from 'lucide-react'
import { LinkStatsService } from '@/lib/offers'
import { useAuth } from '@/components/providers/AuthProvider'

interface StatsTrackerProps {
  isOpen: boolean
  onClose: () => void
  selectedLink: any
  onSave: () => void
}

export default function StatsTracker({ isOpen, onClose, selectedLink, onSave }: StatsTrackerProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    impressions: '',
    clicks: '',
    opens: '',
    leads: '',
    conversions: '',
    revenue: '',
    cost: '',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [savedStats, setSavedStats] = useState<any[]>([])

  useEffect(() => {
    if (selectedLink) {
      loadExistingStats()
    }
  }, [selectedLink])

  const loadExistingStats = () => {
    if (!selectedLink) return
    
    const stats = LinkStatsService.getStatsByLinkId(selectedLink.id)
    setSavedStats(stats)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateMetrics = () => {
    const impressions = parseFloat(formData.impressions) || 0
    const clicks = parseFloat(formData.clicks) || 0
    const opens = parseFloat(formData.opens) || 0
    const leads = parseFloat(formData.leads) || 0
    const conversions = parseFloat(formData.conversions) || 0
    const revenue = parseFloat(formData.revenue) || 0
    const cost = parseFloat(formData.cost) || 0

    const ctr = impressions > 0 ? (clicks / impressions * 100) : 0
    const cvr = clicks > 0 ? (conversions / clicks * 100) : 0
    const profit = revenue - cost
    const roi = cost > 0 ? (profit / cost * 100) : 0

    return { ctr, cvr, profit, roi }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLink) return

    setIsLoading(true)

    try {
      const { ctr, cvr, profit, roi } = calculateMetrics()

      const newStats = LinkStatsService.createStats({
        linkId: selectedLink.id,
        offerId: selectedLink.offerId,
        date: new Date(formData.date),
        impressions: parseFloat(formData.impressions) || 0,
        clicks: parseFloat(formData.clicks) || 0,
        opens: parseFloat(formData.opens) || 0,
        leads: parseFloat(formData.leads) || 0,
        conversions: parseFloat(formData.conversions) || 0,
        revenue: parseFloat(formData.revenue) || 0,
        cost: parseFloat(formData.cost) || 0,
        ctr,
        cvr,
        profit,
        roi,
        notes: formData.notes,
        updatedBy: user.id
      })

      console.log('✅ Статистика збережена:', newStats)
      
      // Очищаємо форму
      setFormData({
        date: new Date().toISOString().split('T')[0],
        impressions: '',
        clicks: '',
        opens: '',
        leads: '',
        conversions: '',
        revenue: '',
        cost: '',
        notes: ''
      })

      // Оновлюємо список збережених статистик
      loadExistingStats()
      
      // Викликаємо callback
      onSave()
      
    } catch (error) {
      console.error('❌ Помилка збереження статистики:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const { ctr, cvr, profit, roi } = calculateMetrics()

  if (!isOpen || !selectedLink) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Відстеження статистики
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedLink.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Форма введення */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Ввести статистику за день
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Дата
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Покази
                    </label>
                    <input
                      type="number"
                      value={formData.impressions}
                      onChange={(e) => handleInputChange('impressions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Кліки
                    </label>
                    <input
                      type="number"
                      value={formData.clicks}
                      onChange={(e) => handleInputChange('clicks', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Відкриття
                    </label>
                    <input
                      type="number"
                      value={formData.opens}
                      onChange={(e) => handleInputChange('opens', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ліди
                    </label>
                    <input
                      type="number"
                      value={formData.leads}
                      onChange={(e) => handleInputChange('leads', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Конверсії
                    </label>
                    <input
                      type="number"
                      value={formData.conversions}
                      onChange={(e) => handleInputChange('conversions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Дохід ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.revenue}
                      onChange={(e) => handleInputChange('revenue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Витрати ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Нотатки
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Додаткові коментарі про кампанію..."
                  />
                </div>

                {/* Розраховані метрики */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📈 Розраховані метрики
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CTR:</span>
                      <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                        {ctr.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CVR:</span>
                      <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                        {cvr.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Прибуток:</span>
                      <span className={`ml-2 font-medium ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${profit.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">ROI:</span>
                      <span className={`ml-2 font-medium ${roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {roi.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Збереження...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Зберегти статистику
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Історія статистики */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📅 Історія статистики
              </h3>
              
              {savedStats.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Статистика ще не введена
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {savedStats
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((stat) => (
                      <div key={stat.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(stat.date).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            stat.profit >= 0 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            ${stat.profit.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div>
                            <span>Покази: {stat.impressions}</span>
                          </div>
                          <div>
                            <span>Кліки: {stat.clicks}</span>
                          </div>
                          <div>
                            <span>Конверсії: {stat.conversions}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <div>
                            <span>CTR: {stat.ctr.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span>ROI: {stat.roi.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        {stat.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {stat.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 