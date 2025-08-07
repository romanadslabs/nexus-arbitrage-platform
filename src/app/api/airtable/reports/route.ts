import { NextRequest, NextResponse } from 'next/server'
import { ReportsService } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let data: any

    switch (type) {
      case 'overall':
        data = await ReportsService.getOverallStats(startDate || undefined, endDate || undefined);
        break
      case 'platforms':
        data = await ReportsService.getPlatformStats()
        break
      case 'top-roi':
        data = await ReportsService.getTopCampaignsByROI(limit ? parseInt(limit) : 10)
        break
      case 'top-revenue':
        data = await ReportsService.getTopCampaignsByRevenue(limit ? parseInt(limit) : 10)
        break
      case 'accounts':
        data = await ReportsService.getAccountStats()
        break
      case 'campaigns':
        data = await ReportsService.getCampaignDetails()
        break
      case 'expenses':
        data = await ReportsService.getExpenseStats()
        break
      case 'period':
        if (!startDate || !endDate) {
          return NextResponse.json({
            success: false,
            error: 'startDate and endDate are required for period reports'
          }, { status: 400 })
        }
        data = await ReportsService.getStatsByPeriod(startDate, endDate)
        break
      case 'team':
        data = await ReportsService.getTeamStats()
        break
      case 'cards':
        data = await ReportsService.getCardStats()
        break
      case 'proxies':
        data = await ReportsService.getProxyStats()
        break
      case 'tests':
        data = await ReportsService.getTestStats()
        break
      case 'automations':
        data = await ReportsService.getAutomationStats()
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid report type. Available types: overall, platforms, top-roi, top-revenue, accounts, campaigns, expenses, period, team, cards, proxies, tests, automations'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, filters, customMetrics } = body

    // Створення кастомного звіту
    const customReport = await ReportsService.createCustomReport(type, filters, customMetrics)

    return NextResponse.json({
      success: true,
      data: customReport,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error creating custom report:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create custom report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 