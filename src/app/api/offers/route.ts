import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockOffers = [
      {
        id: '1',
        name: 'Dating App UK',
        category: 'Dating',
        payout: 15.50,
        currency: 'USD',
        status: 'active',
        countries: ['UK', 'US', 'CA'],
        platforms: ['Facebook', 'TikTok', 'Instagram'],
        description: 'Популярний дітинг додаток з високою конверсією',
        requirements: '18+, геотаргетинг UK',
        trackingURL: 'https://track.datingapp.com/uk',
        previewURL: 'https://datingapp.com/uk',
        notes: 'Топ перформер, стабільні конверсії',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:22:00Z'
      },
      {
        id: '2',
        name: 'E-commerce Store US',
        category: 'E-commerce',
        payout: 8.75,
        currency: 'USD',
        status: 'active',
        countries: ['US', 'CA'],
        platforms: ['Google Ads', 'Facebook'],
        description: 'Онлайн магазин електроніки з широким асортиментом',
        requirements: '25+, кредитна карта',
        trackingURL: 'https://track.ecomstore.com/us',
        previewURL: 'https://ecomstore.com/us',
        notes: 'Високий AOV, стабільні продажі',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-20T16:45:00Z'
      },
      {
        id: '3',
        name: 'Gaming App DE',
        category: 'Gaming',
        payout: 12.25,
        currency: 'EUR',
        status: 'active',
        countries: ['DE', 'AT', 'CH'],
        platforms: ['TikTok', 'YouTube'],
        description: 'Мобільна гра з віртуальною валютою',
        requirements: '16+, Android/iOS',
        trackingURL: 'https://track.gamingapp.com/de',
        previewURL: 'https://gamingapp.com/de',
        notes: 'Високий retention, стабільний трафік',
        createdAt: '2024-01-18T11:20:00Z',
        updatedAt: '2024-01-19T13:10:00Z'
      },
      {
        id: '4',
        name: 'Dating Site FR',
        category: 'Dating',
        payout: 18.90,
        currency: 'EUR',
        status: 'active',
        countries: ['FR', 'BE', 'CH'],
        platforms: ['Instagram', 'Facebook'],
        description: 'Преміум дітинг сайт для серйозних стосунків',
        requirements: '25+, преміум підписка',
        trackingURL: 'https://track.datingsite.com/fr',
        previewURL: 'https://datingsite.com/fr',
        notes: 'Високий payout, якісний трафік',
        createdAt: '2024-01-05T08:45:00Z',
        updatedAt: '2024-01-20T12:30:00Z'
      },
      {
        id: '5',
        name: 'E-commerce AU',
        category: 'E-commerce',
        payout: 10.50,
        currency: 'AUD',
        status: 'paused',
        countries: ['AU', 'NZ'],
        platforms: ['Google Ads', 'Facebook'],
        description: 'Австралійський онлайн магазин одягу',
        requirements: '18+, доставка в AU',
        trackingURL: 'https://track.ecomau.com/au',
        previewURL: 'https://ecomau.com/au',
        notes: 'Призупинено через сезонність',
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-19T10:15:00Z'
      },
      {
        id: '6',
        name: 'Gaming Platform ES',
        category: 'Gaming',
        payout: 9.25,
        currency: 'EUR',
        status: 'active',
        countries: ['ES', 'PT'],
        platforms: ['TikTok', 'YouTube'],
        description: 'Платформа для онлайн ігор',
        requirements: '18+, реєстрація',
        trackingURL: 'https://track.gamingplatform.com/es',
        previewURL: 'https://gamingplatform.com/es',
        notes: 'Новий оффер, тестування',
        createdAt: '2024-01-08T16:30:00Z',
        updatedAt: '2024-01-20T15:20:00Z'
      },
      {
        id: '7',
        name: 'Dating App IT',
        category: 'Dating',
        payout: 14.75,
        currency: 'EUR',
        status: 'blocked',
        countries: ['IT'],
        platforms: ['Facebook', 'Instagram'],
        description: 'Італійський дітинг додаток',
        requirements: '18+, геотаргетинг IT',
        trackingURL: 'https://track.datingapp.it/it',
        previewURL: 'https://datingapp.it/it',
        notes: 'Заблоковано за порушення політики',
        createdAt: '2024-01-14T12:10:00Z',
        updatedAt: '2024-01-18T09:45:00Z'
      },
      {
        id: '8',
        name: 'E-commerce CA',
        category: 'E-commerce',
        payout: 11.25,
        currency: 'CAD',
        status: 'active',
        countries: ['CA'],
        platforms: ['Google Ads', 'Facebook'],
        description: 'Канадський магазин здорового харчування',
        requirements: '25+, доставка в CA',
        trackingURL: 'https://track.ecomca.com/ca',
        previewURL: 'https://ecomca.com/ca',
        notes: 'Стабільний трафік, хороший AOV',
        createdAt: '2024-01-06T10:25:00Z',
        updatedAt: '2024-01-20T17:10:00Z'
      }
    ]

    return NextResponse.json({
      success: true,
      offers: mockOffers,
      total: mockOffers.length,
      stats: {
        active: mockOffers.filter(o => o.status === 'active').length,
        paused: mockOffers.filter(o => o.status === 'paused').length,
        blocked: mockOffers.filter(o => o.status === 'blocked').length,
        totalPayout: mockOffers.reduce((sum, o) => sum + o.payout, 0),
        categories: {
          'Dating': mockOffers.filter(o => o.category === 'Dating').length,
          'E-commerce': mockOffers.filter(o => o.category === 'E-commerce').length,
          'Gaming': mockOffers.filter(o => o.category === 'Gaming').length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      category, 
      payout, 
      currency, 
      countries, 
      platforms, 
      description, 
      requirements, 
      trackingURL, 
      previewURL, 
      notes 
    } = body

    // Валідація
    if (!name || !category || !payout) {
      return NextResponse.json(
        { success: false, error: 'Name, category and payout are required' },
        { status: 400 }
      )
    }

    // Створення нового оффера
    const newOffer = {
      id: Date.now().toString(),
      name,
      category,
      payout: parseFloat(payout),
      currency: currency || 'USD',
      status: 'pending',
      countries: countries || [],
      platforms: platforms || [],
      description: description || '',
      requirements: requirements || '',
      trackingURL: trackingURL || '',
      previewURL: previewURL || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      offer: newOffer
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}