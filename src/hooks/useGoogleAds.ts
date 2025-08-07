import { useState, useEffect } from 'react'

// Типи для Google Ads
export interface GoogleAdsCampaign {
  id: string
  name: string
  status: string
  budget: number
  startDate: string
  endDate?: string
  networkType: string
  biddingStrategyType: string
  metrics: {
    impressions: number
    clicks: number
    cost: number
    conversions: number
    conversionValue: number
  }
}

export interface GoogleAdsAccount {
  id: string
  name: string
  status: string
  currency: string
  timeZone: string
  manager: boolean
}

export interface GoogleAdsMetrics {
  date: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
  conversionValue: number
  ctr: number
  cpc: number
  cpm: number
  conversionRate: number
  roas: number
}

// Хук для роботи з Google Ads
export function useGoogleAds() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Тестування підключення
  const testConnection = async (customerId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/google-ads?action=test-connection&customerId=${customerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return false
      }

      return true
    } catch (err) {
      setError('Помилка тестування підключення')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Отримання кампаній
  const getCampaigns = async (customerId: string): Promise<GoogleAdsCampaign[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/google-ads?action=get-campaigns&customerId=${customerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return []
      }

      return data.data || []
    } catch (err) {
      setError('Помилка отримання кампаній')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Отримання деталей кампанії
  const getCampaignDetails = async (customerId: string, campaignId: string): Promise<GoogleAdsCampaign | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/google-ads?action=get-campaign-details&customerId=${customerId}&campaignId=${campaignId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return null
      }

      return data.data
    } catch (err) {
      setError('Помилка отримання деталей кампанії')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Отримання метрик кампанії
  const getCampaignMetrics = async (
    customerId: string, 
    campaignId: string, 
    startDate: string, 
    endDate: string
  ): Promise<GoogleAdsMetrics[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/google-ads?action=get-campaign-metrics&customerId=${customerId}&campaignId=${campaignId}&startDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return []
      }

      return data.data || []
    } catch (err) {
      setError('Помилка отримання метрик')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Отримання аккаунтів
  const getAccounts = async (customerId: string): Promise<GoogleAdsAccount[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/google-ads?action=get-accounts&customerId=${customerId}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return []
      }

      return data.data || []
    } catch (err) {
      setError('Помилка отримання аккаунтів')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Отримання загальної статистики
  const getOverallStats = async (
    customerId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{
    totalImpressions: number
    totalClicks: number
    totalCost: number
    totalConversions: number
    totalConversionValue: number
    averageCtr: number
    averageCpc: number
    averageRoas: number
  } | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/google-ads?action=get-overall-stats&customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return null
      }

      return data.data
    } catch (err) {
      setError('Помилка отримання статистики')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Створення кампанії
  const createCampaign = async (
    customerId: string,
    campaignData: {
      name: string
      budget: number
      startDate: string
      endDate?: string
      networkType: string
    }
  ): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/google-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-campaign',
          customerId,
          ...campaignData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return null
      }

      return data.campaignId
    } catch (err) {
      setError('Помилка створення кампанії')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Оновлення статусу кампанії
  const updateCampaignStatus = async (
    customerId: string,
    campaignId: string,
    status: 'ENABLED' | 'PAUSED'
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/google-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-campaign-status',
          customerId,
          campaignId,
          status,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message)
        return false
      }

      return true
    } catch (err) {
      setError('Помилка оновлення статусу кампанії')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Очищення помилки
  const clearError = () => {
    setError(null)
  }

  return {
    loading,
    error,
    testConnection,
    getCampaigns,
    getCampaignDetails,
    getCampaignMetrics,
    getAccounts,
    getOverallStats,
    createCampaign,
    updateCampaignStatus,
    clearError,
  }
}

// Хук для роботи з налаштуваннями Google Ads
export function useGoogleAdsSettings() {
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
    const savedSettings = localStorage.getItem('googleAdsSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error parsing saved settings:', error)
      }
    }
  }, [])

  // Збереження налаштувань
  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem('googleAdsSettings', JSON.stringify(newSettings))
  }

  // Оновлення окремого поля
  const updateSetting = (field: keyof typeof settings, value: string) => {
    const newSettings = { ...settings, [field]: value }
    setSettings(newSettings)
    localStorage.setItem('googleAdsSettings', JSON.stringify(newSettings))
  }

  return {
    settings,
    saveSettings,
    updateSetting,
  }
} 