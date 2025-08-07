import { NextRequest, NextResponse } from 'next/server'
import { googleAdsServerService, checkGoogleAdsServerConfig } from '@/lib/googleAdsServer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const customerId = searchParams.get('customerId')
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Перевірка налаштувань
    if (!checkGoogleAdsServerConfig()) {
      return NextResponse.json({
        success: false,
        message: 'Google Ads API не налаштовано. Перевірте змінні середовища.'
      }, { status: 400 })
    }

    switch (action) {
      case 'test-connection':
        if (!customerId) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID обов\'язковий для тестування підключення'
          }, { status: 400 })
        }

        const isConnected = await googleAdsServerService.initialize(customerId)
        return NextResponse.json({
          success: isConnected,
          message: isConnected ? 'Підключення успішне' : 'Помилка підключення'
        })

      case 'get-campaigns':
        if (!customerId) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID обов\'язковий'
          }, { status: 400 })
        }

        const campaigns = await googleAdsServerService.getCampaigns(customerId)
        return NextResponse.json({
          success: true,
          data: campaigns
        })

      case 'get-campaign-details':
        if (!customerId || !campaignId) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID та Campaign ID обов\'язкові'
          }, { status: 400 })
        }

        const campaignDetails = await googleAdsServerService.getCampaignDetails(customerId, campaignId)
        return NextResponse.json({
          success: true,
          data: campaignDetails
        })

      case 'get-campaign-metrics':
        if (!customerId || !campaignId || !startDate || !endDate) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID, Campaign ID, startDate та endDate обов\'язкові'
          }, { status: 400 })
        }

        const metrics = await googleAdsServerService.getCampaignMetrics(customerId, campaignId, startDate, endDate)
        return NextResponse.json({
          success: true,
          data: metrics
        })

      case 'get-accounts':
        if (!customerId) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID обов\'язковий'
          }, { status: 400 })
        }

        const accounts = await googleAdsServerService.getAccounts()
        return NextResponse.json({
          success: true,
          data: accounts
        })

      case 'get-overall-stats':
        if (!customerId || !startDate || !endDate) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID, startDate та endDate обов\'язкові'
          }, { status: 400 })
        }

        const stats = await googleAdsServerService.getOverallStats(customerId, startDate, endDate)
        return NextResponse.json({
          success: true,
          data: stats
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Невідома дія. Доступні дії: test-connection, get-campaigns, get-campaign-details, get-campaign-metrics, get-accounts, get-overall-stats'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Google Ads API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Внутрішня помилка сервера'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, customerId, ...params } = body

    // Перевірка налаштувань
    if (!checkGoogleAdsServerConfig()) {
      return NextResponse.json({
        success: false,
        message: 'Google Ads API не налаштовано. Перевірте змінні середовища.'
      }, { status: 400 })
    }

    switch (action) {
      case 'create-campaign':
        if (!customerId || !params.name || !params.budget || !params.startDate) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID, name, budget та startDate обов\'язкові'
          }, { status: 400 })
        }

        const campaignId = await googleAdsServerService.createCampaign(customerId, {
          name: params.name,
          budget: params.budget,
          startDate: params.startDate,
          endDate: params.endDate,
          networkType: params.networkType || 'SEARCH'
        })

        return NextResponse.json({
          success: !!campaignId,
          message: campaignId ? 'Кампанію створено успішно' : 'Помилка створення кампанії',
          campaignId
        })

      case 'update-campaign-status':
        if (!customerId || !params.campaignId || !params.status) {
          return NextResponse.json({
            success: false,
            message: 'Customer ID, campaignId та status обов\'язкові'
          }, { status: 400 })
        }

        const updated = await googleAdsServerService.updateCampaignStatus(
          customerId,
          params.campaignId,
          params.status
        )

        return NextResponse.json({
          success: updated,
          message: updated ? 'Статус кампанії оновлено' : 'Помилка оновлення статусу'
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Невідома дія. Доступні дії: create-campaign, update-campaign-status'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Google Ads API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Внутрішня помилка сервера'
    }, { status: 500 })
  }
} 