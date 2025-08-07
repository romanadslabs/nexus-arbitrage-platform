// Клієнтський сервіс для роботи з Google Ads API
export interface GoogleAdsApiResponse {
  success: boolean
  message: string
  data?: any
  campaignId?: string
  campaigns?: any[]
}

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

class GoogleAdsClientService {
  private baseUrl = '/api/google-ads'

  // Тестування підключення
  async testConnection(params: {
    clientId: string
    clientSecret: string
    customerId: string
    refreshToken: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test-connection',
          ...params,
        }),
      })

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Створення кампанії
  async createCampaign(params: {
    clientId: string
    clientSecret: string
    customerId: string
    refreshToken: string
    name: string
    budget: number
    startDate: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-campaign',
          ...params,
        }),
      })

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Отримання кампаній
  async getCampaigns(params: {
    clientId: string
    clientSecret: string
    customerId: string
    refreshToken: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-campaigns',
          ...params,
        }),
      })

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Отримання деталей кампанії
  async getCampaignDetails(params: {
    customerId: string
    campaignId: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?action=get-campaign-details&customerId=${params.customerId}&campaignId=${params.campaignId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Отримання метрик кампанії
  async getCampaignMetrics(params: {
    customerId: string
    campaignId: string
    startDate: string
    endDate: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?action=get-campaign-metrics&customerId=${params.customerId}&campaignId=${params.campaignId}&startDate=${params.startDate}&endDate=${params.endDate}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Отримання аккаунтів
  async getAccounts(params: {
    customerId: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?action=get-accounts&customerId=${params.customerId}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }

  // Отримання загальної статистики
  async getOverallStats(params: {
    customerId: string
    startDate: string
    endDate: string
  }): Promise<GoogleAdsApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?action=get-overall-stats&customerId=${params.customerId}&startDate=${params.startDate}&endDate=${params.endDate}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Помилка мережі: ' + (error as Error).message,
      }
    }
  }
}

export const googleAdsClientService = new GoogleAdsClientService()

// Функція для перевірки налаштувань
export const checkGoogleAdsConfig = (): boolean => {
  return true // Завжди повертає true для клієнтської сторони
} 