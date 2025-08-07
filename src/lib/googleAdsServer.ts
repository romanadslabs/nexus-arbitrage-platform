import { GoogleAdsApi, Customer } from 'google-ads-api'

// Конфігурація Google Ads API
const GOOGLE_ADS_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const GOOGLE_ADS_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const GOOGLE_ADS_DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const GOOGLE_ADS_LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID

// Ініціалізація Google Ads API
const client = new GoogleAdsApi({
  client_id: GOOGLE_ADS_CLIENT_ID || '',
  client_secret: GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: GOOGLE_ADS_DEVELOPER_TOKEN || '',
})

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

// Клас для роботи з Google Ads на сервері
export class GoogleAdsServerService {
  private customer: Customer | null = null

  // Ініціалізація клієнта
  async initialize(customerId: string, refreshToken?: string): Promise<boolean> {
    try {
      if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_CLIENT_SECRET || !GOOGLE_ADS_DEVELOPER_TOKEN) {
        throw new Error('Google Ads API credentials not configured')
      }

      this.customer = client.Customer({
        customer_id: customerId,
        refresh_token: refreshToken,
      })

      // Тестуємо підключення
      await this.testConnection()
      return true
    } catch (error) {
      console.error('Google Ads initialization error:', error)
      return false
    }
  }

  // Тестування підключення
  async testConnection(): Promise<boolean> {
    try {
      if (!this.customer) {
        throw new Error('Customer not initialized')
      }

      // Простий запит для тестування
      const query = `
        SELECT 
          customer.id,
          customer.descriptive_name,
          customer.status
        FROM customer 
        LIMIT 1
      `

      const response = await this.customer.query(query)
      return response.length > 0
    } catch (error) {
      console.error('Google Ads connection test failed:', error)
      return false
    }
  }

  // Отримання списку кампаній
  async getCampaigns(customerId: string): Promise<GoogleAdsCampaign[]> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.start_date,
          campaign.end_date,
          campaign.network_settings.target_google_search,
          campaign.network_settings.target_search_network,
          campaign.network_settings.target_content_network,
          campaign.bidding_strategy_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.start_date DESC
      `

      const response = await this.customer!.query(query)
      
      return response.map((row: any) => ({
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
        budget: 0, // Потрібно окремий запит для бюджету
        startDate: row.campaign.startDate,
        endDate: row.campaign.endDate,
        networkType: this.getNetworkType(row),
        biddingStrategyType: row.campaign.biddingStrategyType,
        metrics: {
          impressions: parseInt(row.metrics.impressions) || 0,
          clicks: parseInt(row.metrics.clicks) || 0,
          cost: parseInt(row.metrics.costMicros) / 1000000 || 0,
          conversions: parseFloat(row.metrics.conversions) || 0,
          conversionValue: parseFloat(row.metrics.conversionsValue) || 0,
        }
      }))
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return []
    }
  }

  // Отримання детальної інформації про кампанію
  async getCampaignDetails(customerId: string, campaignId: string): Promise<GoogleAdsCampaign | null> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.start_date,
          campaign.end_date,
          campaign.network_settings.target_google_search,
          campaign.network_settings.target_search_network,
          campaign.network_settings.target_content_network,
          campaign.bidding_strategy_type,
          campaign_budget.amount_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.average_cpm,
          metrics.ctr,
          metrics.conversion_rate,
          metrics.roas
        FROM campaign 
        WHERE campaign.id = ${campaignId}
      `

      const response = await this.customer!.query(query)
      
      if (response.length === 0) {
        return null
      }

      const row = response[0]
      return {
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
        budget: parseInt(row.campaignBudget?.amountMicros) / 1000000 || 0,
        startDate: row.campaign.startDate,
        endDate: row.campaign.endDate,
        networkType: this.getNetworkType(row),
        biddingStrategyType: row.campaign.biddingStrategyType,
        metrics: {
          impressions: parseInt(row.metrics.impressions) || 0,
          clicks: parseInt(row.metrics.clicks) || 0,
          cost: parseInt(row.metrics.costMicros) / 1000000 || 0,
          conversions: parseFloat(row.metrics.conversions) || 0,
          conversionValue: parseFloat(row.metrics.conversionsValue) || 0,
        }
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error)
      return null
    }
  }

  // Отримання метрик кампанії за період
  async getCampaignMetrics(
    customerId: string, 
    campaignId: string, 
    startDate: string, 
    endDate: string
  ): Promise<GoogleAdsMetrics[]> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      const query = `
        SELECT 
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.average_cpm,
          metrics.ctr,
          metrics.conversion_rate,
          metrics.roas
        FROM campaign 
        WHERE 
          campaign.id = ${campaignId}
          AND segments.date >= '${startDate}'
          AND segments.date <= '${endDate}'
        ORDER BY segments.date
      `

      const response = await this.customer!.query(query)
      
      return response.map((row: any) => ({
        date: row.segments.date,
        impressions: parseInt(row.metrics.impressions) || 0,
        clicks: parseInt(row.metrics.clicks) || 0,
        cost: parseInt(row.metrics.costMicros) / 1000000 || 0,
        conversions: parseFloat(row.metrics.conversions) || 0,
        conversionValue: parseFloat(row.metrics.conversionsValue) || 0,
        ctr: parseFloat(row.metrics.ctr) || 0,
        cpc: parseFloat(row.metrics.averageCpc) / 1000000 || 0,
        cpm: parseFloat(row.metrics.averageCpm) / 1000000 || 0,
        conversionRate: parseFloat(row.metrics.conversionRate) || 0,
        roas: parseFloat(row.metrics.roas) || 0,
      }))
    } catch (error) {
      console.error('Error fetching campaign metrics:', error)
      return []
    }
  }

  // Отримання списку аккаунтів
  async getAccounts(): Promise<GoogleAdsAccount[]> {
    try {
      if (!this.customer) {
        throw new Error('Customer not initialized')
      }

      const query = `
        SELECT 
          customer.id,
          customer.descriptive_name,
          customer.status,
          customer.currency_code,
          customer.time_zone,
          customer.manager
        FROM customer
      `

      const response = await this.customer.query(query)
      
      return response.map((row: any) => ({
        id: row.customer.id,
        name: row.customer.descriptiveName,
        status: row.customer.status,
        currency: row.customer.currencyCode,
        timeZone: row.customer.timeZone,
        manager: row.customer.manager,
      }))
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return []
    }
  }

  // Створення нової кампанії
  async createCampaign(customerId: string, campaignData: {
    name: string
    budget: number
    startDate: string
    endDate?: string
    networkType: string
  }): Promise<string | null> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      // Створення бюджету кампанії
      const budgetOperation = {
        create: {
          name: `${campaignData.name} Budget`,
          amountMicros: campaignData.budget * 1000000,
          deliveryMethod: 'STANDARD',
        }
      }

      const budgetResponse = await this.customer!.campaignBudget.create(budgetOperation)
      const budgetId = budgetResponse.results[0].resourceName.split('/').pop()

      // Створення кампанії
      const campaignOperation = {
        create: {
          name: campaignData.name,
          status: 'PAUSED',
          campaignBudget: `customers/${customerId}/campaignBudgets/${budgetId}`,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          networkSettings: {
            targetGoogleSearch: campaignData.networkType.includes('SEARCH'),
            targetSearchNetwork: campaignData.networkType.includes('SEARCH'),
            targetContentNetwork: campaignData.networkType.includes('DISPLAY'),
          },
          biddingStrategyType: 'MANUAL_CPC',
        }
      }

      const campaignResponse = await this.customer!.campaign.create(campaignOperation)
      return campaignResponse.results[0].resourceName.split('/').pop() || null
    } catch (error) {
      console.error('Error creating campaign:', error)
      return null
    }
  }

  // Оновлення статусу кампанії
  async updateCampaignStatus(
    customerId: string, 
    campaignId: string, 
    status: 'ENABLED' | 'PAUSED'
  ): Promise<boolean> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      const operation = {
        update: {
          resourceName: `customers/${customerId}/campaigns/${campaignId}`,
          status: status,
        }
      }

      await this.customer!.campaign.update(operation)
      return true
    } catch (error) {
      console.error('Error updating campaign status:', error)
      return false
    }
  }

  // Отримання загальної статистики
  async getOverallStats(customerId: string, startDate: string, endDate: string): Promise<{
    totalImpressions: number
    totalClicks: number
    totalCost: number
    totalConversions: number
    totalConversionValue: number
    averageCtr: number
    averageCpc: number
    averageRoas: number
  }> {
    try {
      if (!this.customer) {
        await this.initialize(customerId)
      }

      const query = `
        SELECT 
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.roas
        FROM campaign 
        WHERE 
          segments.date >= '${startDate}'
          AND segments.date <= '${endDate}'
      `

      const response = await this.customer!.query(query)
      
      if (response.length === 0) {
        return {
          totalImpressions: 0,
          totalClicks: 0,
          totalCost: 0,
          totalConversions: 0,
          totalConversionValue: 0,
          averageCtr: 0,
          averageCpc: 0,
          averageRoas: 0,
        }
      }

      const totals = response.reduce((acc: any, row: any) => {
        acc.impressions += parseInt(row.metrics.impressions) || 0
        acc.clicks += parseInt(row.metrics.clicks) || 0
        acc.cost += parseInt(row.metrics.costMicros) / 1000000 || 0
        acc.conversions += parseFloat(row.metrics.conversions) || 0
        acc.conversionValue += parseFloat(row.metrics.conversionsValue) || 0
        acc.ctr += parseFloat(row.metrics.ctr) || 0
        acc.cpc += parseFloat(row.metrics.averageCpc) / 1000000 || 0
        acc.roas += parseFloat(row.metrics.roas) || 0
        return acc
      }, {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        conversionValue: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
      })

      const count = response.length

      return {
        totalImpressions: totals.impressions,
        totalClicks: totals.clicks,
        totalCost: totals.cost,
        totalConversions: totals.conversions,
        totalConversionValue: totals.conversionValue,
        averageCtr: count > 0 ? totals.ctr / count : 0,
        averageCpc: count > 0 ? totals.cpc / count : 0,
        averageRoas: count > 0 ? totals.roas / count : 0,
      }
    } catch (error) {
      console.error('Error fetching overall stats:', error)
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalCost: 0,
        totalConversions: 0,
        totalConversionValue: 0,
        averageCtr: 0,
        averageCpc: 0,
        averageRoas: 0,
      }
    }
  }

  // Допоміжна функція для визначення типу мережі
  private getNetworkType(row: any): string {
    const networks = []
    if (row.campaign.networkSettings?.targetGoogleSearch) networks.push('SEARCH')
    if (row.campaign.networkSettings?.targetSearchNetwork) networks.push('SEARCH_NETWORK')
    if (row.campaign.networkSettings?.targetContentNetwork) networks.push('DISPLAY')
    return networks.join(', ') || 'UNKNOWN'
  }
}

// Експорт екземпляру сервісу
export const googleAdsServerService = new GoogleAdsServerService()

// Функція для перевірки налаштувань
export const checkGoogleAdsServerConfig = (): boolean => {
  return !!(GOOGLE_ADS_CLIENT_ID && GOOGLE_ADS_CLIENT_SECRET && GOOGLE_ADS_DEVELOPER_TOKEN)
} 