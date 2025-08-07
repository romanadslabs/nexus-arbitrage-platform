import { CampaignDailyStats } from '@/types'

const LOCAL_STORAGE_KEY = 'nexus_campaign_daily_stats'

// Утиліти для роботи з localStorage
const localStorageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }
}

export class CampaignStatsService {
  // Отримати всю статистику
  static getAllStats(): CampaignDailyStats[] {
    return localStorageUtils.get<CampaignDailyStats[]>(LOCAL_STORAGE_KEY, [])
  }

  // Отримати статистику для конкретної кампанії
  static getStatsByCampaign(campaignId: string): CampaignDailyStats[] {
    const allStats = this.getAllStats()
    return allStats.filter(stat => stat.campaignId === campaignId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Отримати статистику за конкретну дату
  static getStatsByDate(campaignId: string, date: string): CampaignDailyStats | null {
    const allStats = this.getAllStats()
    return allStats.find(stat => stat.campaignId === campaignId && stat.date === date) || null
  }

  // Створити або оновити статистику
  static createOrUpdateStats(statsData: Omit<CampaignDailyStats, 'id' | 'createdAt' | 'updatedAt'>): CampaignDailyStats {
    const allStats = this.getAllStats()
    
    // Перевіряємо чи є вже статистика за цю дату
    const existingIndex = allStats.findIndex(
      stat => stat.campaignId === statsData.campaignId && stat.date === statsData.date
    )

    // Розраховуємо похідні метрики
    const calculatedStats = this.calculateMetrics(statsData)

    if (existingIndex >= 0) {
      // Оновлюємо існуючу статистику
      const updatedStats: CampaignDailyStats = {
        ...allStats[existingIndex],
        ...calculatedStats,
        updatedAt: new Date()
      }
      allStats[existingIndex] = updatedStats
      localStorageUtils.set(LOCAL_STORAGE_KEY, allStats)
      return updatedStats
    } else {
      // Створюємо нову статистику
      const newStats: CampaignDailyStats = {
        id: `stats_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...calculatedStats,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      allStats.push(newStats)
      localStorageUtils.set(LOCAL_STORAGE_KEY, allStats)
      return newStats
    }
  }

  // Видалити статистику
  static deleteStats(statsId: string): boolean {
    const allStats = this.getAllStats()
    const filteredStats = allStats.filter(stat => stat.id !== statsId)
    
    if (filteredStats.length !== allStats.length) {
      localStorageUtils.set(LOCAL_STORAGE_KEY, filteredStats)
      return true
    }
    return false
  }

  // Розрахувати метрики
  private static calculateMetrics(data: Omit<CampaignDailyStats, 'id' | 'createdAt' | 'updatedAt' | 'ctr' | 'cvr' | 'cpl' | 'roi'>): Omit<CampaignDailyStats, 'id' | 'createdAt' | 'updatedAt'> {
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0
    const cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
    const cpl = data.leads > 0 ? data.spend / data.leads : 0
    const roi = data.spend > 0 ? ((data.revenue - data.spend) / data.spend) * 100 : 0

    return {
      ...data,
      ctr: parseFloat(ctr.toFixed(2)),
      cvr: parseFloat(cvr.toFixed(2)),
      cpl: parseFloat(cpl.toFixed(2)),
      roi: parseFloat(roi.toFixed(2))
    }
  }

  // Отримати загальну статистику для кампанії
  static getCampaignSummary(campaignId: string): {
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    totalLeads: number
    totalSpend: number
    totalRevenue: number
    avgCtr: number
    avgCvr: number
    avgCpl: number
    totalRoi: number
    daysActive: number
  } {
    const stats = this.getStatsByCampaign(campaignId)
    
    if (stats.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalLeads: 0,
        totalSpend: 0,
        totalRevenue: 0,
        avgCtr: 0,
        avgCvr: 0,
        avgCpl: 0,
        totalRoi: 0,
        daysActive: 0
      }
    }

    const totals = stats.reduce((acc, stat) => ({
      totalImpressions: acc.totalImpressions + stat.impressions,
      totalClicks: acc.totalClicks + stat.clicks,
      totalConversions: acc.totalConversions + stat.conversions,
      totalLeads: acc.totalLeads + stat.leads,
      totalSpend: acc.totalSpend + stat.spend,
      totalRevenue: acc.totalRevenue + stat.revenue
    }), {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalLeads: 0,
      totalSpend: 0,
      totalRevenue: 0
    })

    const avgCtr = totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0
    const avgCvr = totals.totalClicks > 0 ? (totals.totalConversions / totals.totalClicks) * 100 : 0
    const avgCpl = totals.totalLeads > 0 ? totals.totalSpend / totals.totalLeads : 0
    const totalRoi = totals.totalSpend > 0 ? ((totals.totalRevenue - totals.totalSpend) / totals.totalSpend) * 100 : 0

    return {
      ...totals,
      avgCtr: parseFloat(avgCtr.toFixed(2)),
      avgCvr: parseFloat(avgCvr.toFixed(2)),
      avgCpl: parseFloat(avgCpl.toFixed(2)),
      totalRoi: parseFloat(totalRoi.toFixed(2)),
      daysActive: stats.length
    }
  }

  // Отримати статистику за період
  static getStatsForPeriod(campaignId: string, startDate: string, endDate: string): CampaignDailyStats[] {
    const stats = this.getStatsByCampaign(campaignId)
    return stats.filter(stat => stat.date >= startDate && stat.date <= endDate)
  }

  // Експорт статистики в CSV
  static exportToCsv(campaignId: string): string {
    const stats = this.getStatsByCampaign(campaignId)
    const headers = [
      'Дата', 'Покази', 'Кліки', 'Конверсії', 'Ліди', 'Витрати', 'Дохід', 
      'CTR %', 'CVR %', 'CPL', 'ROI %', 'Нотатки'
    ]
    
    const csvContent = [
      headers.join(','),
      ...stats.map(stat => [
        stat.date,
        stat.impressions,
        stat.clicks,
        stat.conversions,
        stat.leads,
        stat.spend,
        stat.revenue,
        stat.ctr,
        stat.cvr,
        stat.cpl,
        stat.roi,
        `"${stat.notes || ''}"`
      ].join(','))
    ].join('\n')

    return csvContent
  }
}

export default CampaignStatsService 