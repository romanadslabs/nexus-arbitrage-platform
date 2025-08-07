'use client'

import React, { useState, useEffect } from 'react'
import { CampaignDailyStats } from '@/types'
import { CampaignStatsService } from '@/lib/campaignStats'
import { BarChart3, Calendar, DollarSign, TrendingUp, Edit, Trash2, Download, Eye } from 'lucide-react'

interface CampaignStatsViewProps {
  campaignId: string
  campaignName: string
  onEditStats: (date: string) => void
}

export default function CampaignStatsView({ 
  campaignId, 
  campaignName, 
  onEditStats 
}: CampaignStatsViewProps) {
  const [stats, setStats] = useState<CampaignDailyStats[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Завантаження статистики
  useEffect(() => {
    loadStats()
  }, [campaignId])

  const loadStats = () => {
    const campaignStats = CampaignStatsService.getStatsByCampaign(campaignId)
    const campaignSummary = CampaignStatsService.getCampaignSummary(campaignId)
    
    setStats(campaignStats)
    setSummary(campaignSummary)
  }

  const handleDeleteStats = (statsId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю статистику?')) {
      CampaignStatsService.deleteStats(statsId)
      loadStats()
    }
  }

  const handleExportCsv = () => {
    const csvContent = CampaignStatsService.exportToCsv(campaignId)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `campaign_${campaignId}_stats.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (!summary) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        Завантаження статистики...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Загальна статистика */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Загальна статистика: {campaignName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title={showDetails ? 'Сховати деталі' : 'Показати деталі'}
            >
              <Eye size={16} />
            </button>
            {stats.length > 0 && (
              <button
                onClick={handleExportCsv}
                className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                title="Експорт в CSV"
              >
                <Download size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.daysActive}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Днів активності</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.totalImpressions.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Покази</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.totalClicks.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Кліки</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.totalLeads}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Ліди</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary.totalSpend)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Витрати</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${summary.totalRoi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercent(summary.totalRoi)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">ROI</div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatPercent(summary.avgCtr)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Середній CTR</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatPercent(summary.avgCvr)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Середній CVR</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.avgCpl)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Середній CPL</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totalRevenue)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Загальний дохід</div>
            </div>
          </div>
        )}
      </div>

      {/* Список статистики по днях */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Статистика по днях
        </h4>
        
        {stats.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Ще немає статистики для цієї кампанії</p>
            <p className="text-sm mt-1">Додайте перші дані, щоб побачити результати</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(stat.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>👁 {stat.impressions.toLocaleString()}</span>
                      <span>👆 {stat.clicks}</span>
                      <span>🎯 {stat.leads}</span>
                      <span className="text-red-600 dark:text-red-400">📉 {formatCurrency(stat.spend)}</span>
                      <span className="text-green-600 dark:text-green-400">📈 {formatCurrency(stat.revenue)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className={`font-medium ${stat.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ROI: {formatPercent(stat.roi)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        CPL: {formatCurrency(stat.cpl)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onEditStats(stat.date)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Редагувати"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteStats(stat.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {stat.notes && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                    💭 {stat.notes}
                  </div>
                )}
                
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>CTR: {formatPercent(stat.ctr)}</span>
                  <span>CVR: {formatPercent(stat.cvr)}</span>
                  <span>Прибуток: {formatCurrency(stat.revenue - stat.spend)}</span>
                  <span>Оновлено: {new Date(stat.updatedAt).toLocaleString('uk-UA')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 