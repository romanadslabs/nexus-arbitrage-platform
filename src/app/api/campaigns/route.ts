import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockCampaigns = [
      {
        id: '1',
        name: 'TikTok Dating UK',
        platform: 'TikTok',
        status: 'active',
        budget: 500,
        spent: 245.50,
        revenue: 890.25,
        clicks: 1250,
        conversions: 45,
        roi: 262.5,
        offerID: 'OFFER_DATING_001',
        startDate: '2024-01-15T00:00:00Z',
        endDate: null,
        targetAudience: 'UK, 18-35, Dating',
        notes: 'Високий CTR, стабільні конверсії'
      },
      {
        id: '2',
        name: 'Facebook E-commerce US',
        platform: 'Facebook',
        status: 'active',
        budget: 1000,
        spent: 678.90,
        revenue: 2450.75,
        clicks: 2340,
        conversions: 89,
        roi: 261.2,
        offerID: 'OFFER_ECOMM_002',
        startDate: '2024-01-10T00:00:00Z',
        endDate: null,
        targetAudience: 'US, 25-45, E-commerce',
        notes: 'Топ перформер, високий дохід'
      },
      {
        id: '3',
        name: 'Google Ads Gaming DE',
        platform: 'Google Ads',
        status: 'paused',
        budget: 300,
        spent: 156.25,
        revenue: 234.50,
        clicks: 890,
        conversions: 12,
        roi: 50.1,
        offerID: 'OFFER_GAMING_003',
        startDate: '2024-01-18T00:00:00Z',
        endDate: null,
        targetAudience: 'DE, 16-30, Gaming',
        notes: 'Призупинено через низький ROI'
      },
      {
        id: '4',
        name: 'Instagram Dating FR',
        platform: 'Instagram',
        status: 'active',
        budget: 750,
        spent: 445.80,
        revenue: 1890.45,
        clicks: 1670,
        conversions: 67,
        roi: 324.1,
        offerID: 'OFFER_DATING_004',
        startDate: '2024-01-05T00:00:00Z',
        endDate: null,
        targetAudience: 'FR, 20-40, Dating',
        notes: 'Експертний рівень, ROI 324%'
      },
      {
        id: '5',
        name: 'YouTube Gaming AU',
        platform: 'YouTube',
        status: 'completed',
        budget: 400,
        spent: 398.50,
        revenue: 1250.75,
        clicks: 890,
        conversions: 34,
        roi: 213.8,
        offerID: 'OFFER_GAMING_005',
        startDate: '2024-01-08T00:00:00Z',
        endDate: '2024-01-20T00:00:00Z',
        targetAudience: 'AU, 18-35, Gaming',
        notes: 'Успішно завершено, високий ROI'
      },
      {
        id: '6',
        name: 'TikTok E-commerce ES',
        platform: 'TikTok',
        status: 'active',
        budget: 600,
        spent: 234.75,
        revenue: 678.90,
        clicks: 1450,
        conversions: 23,
        roi: 189.2,
        offerID: 'OFFER_ECOMM_006',
        startDate: '2024-01-12T00:00:00Z',
        endDate: null,
        targetAudience: 'ES, 25-50, E-commerce',
        notes: 'Новий формат, тестування'
      },
      {
        id: '7',
        name: 'Facebook Dating IT',
        platform: 'Facebook',
        status: 'blocked',
        budget: 350,
        spent: 89.25,
        revenue: 0,
        clicks: 234,
        conversions: 0,
        roi: 0,
        offerID: 'OFFER_DATING_007',
        startDate: '2024-01-14T00:00:00Z',
        endDate: null,
        targetAudience: 'IT, 18-35, Dating',
        notes: 'Заблоковано за порушення політики'
      },
      {
        id: '8',
        name: 'Google Ads E-commerce CA',
        platform: 'Google Ads',
        status: 'active',
        budget: 800,
        spent: 456.90,
        revenue: 1345.60,
        clicks: 1890,
        conversions: 56,
        roi: 194.5,
        offerID: 'OFFER_ECOMM_008',
        startDate: '2024-01-06T00:00:00Z',
        endDate: null,
        targetAudience: 'CA, 30-55, E-commerce',
        notes: 'Стабільний трафік, хороший ROI'
      }
    ]

    return NextResponse.json({
      success: true,
      campaigns: mockCampaigns,
      total: mockCampaigns.length,
      stats: {
        active: mockCampaigns.filter(c => c.status === 'active').length,
        paused: mockCampaigns.filter(c => c.status === 'paused').length,
        completed: mockCampaigns.filter(c => c.status === 'completed').length,
        blocked: mockCampaigns.filter(c => c.status === 'blocked').length,
        totalRevenue: mockCampaigns.reduce((sum, c) => sum + c.revenue, 0),
        totalSpent: mockCampaigns.reduce((sum, c) => sum + c.spent, 0),
        averageROI: mockCampaigns.reduce((sum, c) => sum + c.roi, 0) / mockCampaigns.length
      }
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      platform, 
      budget, 
      offerID, 
      targetAudience, 
      notes 
    } = body

    // Валідація
    if (!name || !platform || !budget) {
      return NextResponse.json(
        { success: false, error: 'Name, platform and budget are required' },
        { status: 400 }
      )
    }

    // Створення нової кампанії
    const newCampaign = {
      id: Date.now().toString(),
      name,
      platform,
      status: 'pending',
      budget: parseFloat(budget),
      spent: 0,
      revenue: 0,
      clicks: 0,
      conversions: 0,
      roi: 0,
      offerID: offerID || '',
      startDate: new Date().toISOString(),
      endDate: null,
      targetAudience: targetAudience || '',
      notes: notes || ''
    }

    return NextResponse.json({
      success: true,
      campaign: newCampaign
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}