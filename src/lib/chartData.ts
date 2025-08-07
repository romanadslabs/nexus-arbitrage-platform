import { Campaign, Account } from '@/types'

// Кольори для графіків
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
  orange: '#F97316',
  gray: '#6B7280',
}

export const chartGradients = {
  blue: ['#3B82F6', '#1D4ED8'],
  green: ['#10B981', '#059669'],
  purple: ['#8B5CF6', '#7C3AED'],
  orange: ['#F59E0B', '#D97706'],
  red: ['#EF4444', '#DC2626'],
}

// Генерація даних для лінійного графіка доходів
export function generateRevenueChartData(campaigns: Campaign[], days: number = 30) {
  const labels = []
  const revenueData = []
  const spentData = []
  const profitData = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const dateStr = date.toLocaleDateString('uk-UA', { 
      month: 'short', 
      day: 'numeric' 
    })
    
    labels.push(dateStr)
    
    // Генеруємо реалістичні дані на основі існуючих кампаній
    const baseRevenue = campaigns.reduce((sum, camp) => sum + camp.revenue, 0) / campaigns.length
    const baseSpent = campaigns.reduce((sum, camp) => sum + camp.spent, 0) / campaigns.length
    
    const revenue = Math.floor(baseRevenue * (0.5 + Math.random() * 1.5))
    const spent = Math.floor(baseSpent * (0.3 + Math.random() * 1.2))
    const profit = revenue - spent
    
    revenueData.push(revenue)
    spentData.push(spent)
    profitData.push(profit)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Дохід',
        data: revenueData,
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Витрати',
        data: spentData,
        borderColor: chartColors.danger,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Прибуток',
        data: profitData,
        borderColor: chartColors.secondary,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
}

// Генерація даних для кругової діаграми платформ
export function generatePlatformChartData(campaigns: Campaign[]) {
  const platformStats = campaigns.reduce((acc, campaign) => {
    if (!acc[campaign.platform]) {
      acc[campaign.platform] = {
        revenue: 0,
        campaigns: 0,
        conversions: 0,
      }
    }
    acc[campaign.platform].revenue += campaign.revenue
    acc[campaign.platform].campaigns += 1
    acc[campaign.platform].conversions += campaign.conversions
    return acc
  }, {} as Record<string, any>)

  const labels = Object.keys(platformStats)
  const revenueData = labels.map(platform => platformStats[platform].revenue)
  const campaignData = labels.map(platform => platformStats[platform].campaigns)
  const conversionData = labels.map(platform => platformStats[platform].conversions)

  const colors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.accent,
    chartColors.purple,
    chartColors.pink,
  ]

  return {
    revenue: {
      labels,
      datasets: [{
        data: revenueData,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2,
      }],
    },
    campaigns: {
      labels,
      datasets: [{
        data: campaignData,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2,
      }],
    },
    conversions: {
      labels,
      datasets: [{
        data: conversionData,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2,
      }],
    },
  }
}

// Генерація даних для стовпчикової діаграми статусів аккаунтів
export function generateAccountStatusChartData(accounts: Account[]) {
  const statusStats = accounts.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const labels = Object.keys(statusStats).map(status => {
    switch (status) {
      case 'active': return 'Активні'
      case 'banned': return 'Заблоковані'
      case 'moderation': return 'На модерації'
      case 'pending': return 'В очікуванні'
      case 'suspended': return 'Призупинені'
      default: return status
    }
  })

  const data = Object.values(statusStats)
  const colors = data.map((_, index) => {
    switch (index) {
      case 0: return chartColors.secondary // Активні - зелений
      case 1: return chartColors.danger // Заблоковані - червоний
      case 2: return chartColors.accent // На модерації - жовтий
      case 3: return chartColors.primary // В очікуванні - синій
      case 4: return chartColors.gray // Призупинені - сірий
      default: return chartColors.gray
    }
  })

  return {
    labels,
    datasets: [{
      label: 'Кількість аккаунтів',
      data,
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1,
    }],
  }
}

// Генерація даних для стовпчикової діаграми ROI кампаній
export function generateROIChartData(campaigns: Campaign[]) {
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 10)

  const labels = topCampaigns.map(campaign => campaign.name)
  const roiData = topCampaigns.map(campaign => campaign.roi)
  const revenueData = topCampaigns.map(campaign => campaign.revenue)

  return {
    roi: {
      labels,
      datasets: [{
        label: 'ROI (%)',
        data: roiData,
        backgroundColor: roiData.map(roi => 
          roi > 100 ? chartColors.secondary : 
          roi > 0 ? chartColors.accent : chartColors.danger
        ),
        borderColor: roiData.map(roi => 
          roi > 100 ? chartColors.secondary : 
          roi > 0 ? chartColors.accent : chartColors.danger
        ),
        borderWidth: 1,
      }],
    },
    revenue: {
      labels,
      datasets: [{
        label: 'Дохід ($)',
        data: revenueData,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary,
        borderWidth: 1,
      }],
    },
  }
}

// Генерація даних для графіка конверсій
export function generateConversionChartData(campaigns: Campaign[], days: number = 30) {
  const labels = []
  const clicksData = []
  const conversionsData = []
  const ctrData = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const dateStr = date.toLocaleDateString('uk-UA', { 
      month: 'short', 
      day: 'numeric' 
    })
    
    labels.push(dateStr)
    
    // Генеруємо реалістичні дані
    const baseClicks = campaigns.reduce((sum, camp) => sum + camp.clicks, 0) / campaigns.length
    const baseConversions = campaigns.reduce((sum, camp) => sum + camp.conversions, 0) / campaigns.length
    
    const clicks = Math.floor(baseClicks * (0.3 + Math.random() * 2))
    const conversions = Math.floor(baseConversions * (0.2 + Math.random() * 1.8))
    const ctr = clicks > 0 ? (conversions / clicks) * 100 : 0
    
    clicksData.push(clicks)
    conversionsData.push(conversions)
    ctrData.push(ctr)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Кліки',
        data: clicksData,
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Конверсії',
        data: conversionsData,
        borderColor: chartColors.secondary,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'CTR (%)',
        data: ctrData,
        borderColor: chartColors.accent,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  }
}

// Генерація даних для графіка продуктивності за платформами
export function generatePlatformPerformanceData(campaigns: Campaign[]) {
  const platformStats = campaigns.reduce((acc, campaign) => {
    if (!acc[campaign.platform]) {
      acc[campaign.platform] = {
        revenue: 0,
        spent: 0,
        clicks: 0,
        conversions: 0,
        campaigns: 0,
      }
    }
    acc[campaign.platform].revenue += campaign.revenue
    acc[campaign.platform].spent += campaign.spent
    acc[campaign.platform].clicks += campaign.clicks
    acc[campaign.platform].conversions += campaign.conversions
    acc[campaign.platform].campaigns += 1
    return acc
  }, {} as Record<string, any>)

  const labels = Object.keys(platformStats)
  const revenueData = labels.map(platform => platformStats[platform].revenue)
  const roiData = labels.map(platform => {
    const spent = platformStats[platform].spent
    const revenue = platformStats[platform].revenue
    return spent > 0 ? ((revenue - spent) / spent) * 100 : 0
  })
  const ctrData = labels.map(platform => {
    const clicks = platformStats[platform].clicks
    const conversions = platformStats[platform].conversions
    return clicks > 0 ? (conversions / clicks) * 100 : 0
  })

  return {
    revenue: {
      labels,
      datasets: [{
        label: 'Дохід ($)',
        data: revenueData,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary,
        borderWidth: 1,
      }],
    },
    roi: {
      labels,
      datasets: [{
        label: 'ROI (%)',
        data: roiData,
        backgroundColor: roiData.map(roi => 
          roi > 100 ? chartColors.secondary : 
          roi > 0 ? chartColors.accent : chartColors.danger
        ),
        borderColor: roiData.map(roi => 
          roi > 100 ? chartColors.secondary : 
          roi > 0 ? chartColors.accent : chartColors.danger
        ),
        borderWidth: 1,
      }],
    },
    ctr: {
      labels,
      datasets: [{
        label: 'CTR (%)',
        data: ctrData,
        backgroundColor: chartColors.purple,
        borderColor: chartColors.purple,
        borderWidth: 1,
      }],
    },
  }
} 