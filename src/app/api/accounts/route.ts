import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockAccounts = [
      {
        id: '1',
        name: 'Dating_UK_01',
        email: 'dating.uk.01@example.com',
        phone: '+44 7911 123456',
        platform: 'Facebook',
        status: 'active',
        category: 'Dating',
        farmerID: 'FARM_001',
        balance: 1250.50,
        currency: 'USD',
        country: 'UK',
        createdAt: '2024-01-15T10:30:00Z',
        lastActivity: '2024-01-20T14:22:00Z',
        notes: 'Високий CTR, стабільні конверсії'
      },
      {
        id: '2',
        name: 'Ecom_US_02',
        email: 'ecom.us.02@example.com',
        phone: '+1 555 123 4567',
        platform: 'Google Ads',
        status: 'active',
        category: 'E-commerce',
        farmerID: 'FARM_002',
        balance: 890.75,
        currency: 'USD',
        country: 'US',
        createdAt: '2024-01-10T09:15:00Z',
        lastActivity: '2024-01-20T16:45:00Z',
        notes: 'Новий аккаунт, тестування'
      },
      {
        id: '3',
        name: 'Gaming_DE_03',
        email: 'gaming.de.03@example.com',
        phone: '+49 30 12345678',
        platform: 'TikTok',
        status: 'pending',
        category: 'Gaming',
        farmerID: 'FARM_003',
        balance: 0,
        currency: 'EUR',
        country: 'DE',
        createdAt: '2024-01-18T11:20:00Z',
        lastActivity: '2024-01-19T13:10:00Z',
        notes: 'Очікує верифікації'
      },
      {
        id: '4',
        name: 'Dating_FR_04',
        email: 'dating.fr.04@example.com',
        phone: '+33 1 42 34 56 78',
        platform: 'Instagram',
        status: 'active',
        category: 'Dating',
        farmerID: 'FARM_004',
        balance: 2100.00,
        currency: 'EUR',
        country: 'FR',
        createdAt: '2024-01-05T08:45:00Z',
        lastActivity: '2024-01-20T12:30:00Z',
        notes: 'Топ перформер, ROI 342%'
      },
      {
        id: '5',
        name: 'Ecom_CA_05',
        email: 'ecom.ca.05@example.com',
        phone: '+1 416 555 0123',
        platform: 'Facebook',
        status: 'blocked',
        category: 'E-commerce',
        farmerID: 'FARM_005',
        balance: 0,
        currency: 'CAD',
        country: 'CA',
        createdAt: '2024-01-12T14:20:00Z',
        lastActivity: '2024-01-19T10:15:00Z',
        notes: 'Заблоковано за порушення політики'
      },
      {
        id: '6',
        name: 'Gaming_AU_06',
        email: 'gaming.au.06@example.com',
        phone: '+61 2 9876 5432',
        platform: 'YouTube',
        status: 'active',
        category: 'Gaming',
        farmerID: 'FARM_006',
        balance: 750.25,
        currency: 'AUD',
        country: 'AU',
        createdAt: '2024-01-08T16:30:00Z',
        lastActivity: '2024-01-20T15:20:00Z',
        notes: 'Стабільний трафік, середній CTR'
      },
      {
        id: '7',
        name: 'Dating_IT_07',
        email: 'dating.it.07@example.com',
        phone: '+39 06 1234 5678',
        platform: 'TikTok',
        status: 'suspended',
        category: 'Dating',
        farmerID: 'FARM_007',
        balance: 0,
        currency: 'EUR',
        country: 'IT',
        createdAt: '2024-01-14T12:10:00Z',
        lastActivity: '2024-01-18T09:45:00Z',
        notes: 'Тимчасово призупинено'
      },
      {
        id: '8',
        name: 'Ecom_ES_08',
        email: 'ecom.es.08@example.com',
        phone: '+34 91 123 45 67',
        platform: 'Google Ads',
        status: 'active',
        category: 'E-commerce',
        farmerID: 'FARM_008',
        balance: 1650.80,
        currency: 'EUR',
        country: 'ES',
        createdAt: '2024-01-06T10:25:00Z',
        lastActivity: '2024-01-20T17:10:00Z',
        notes: 'Високий дохід, стабільні продажі'
      }
    ]

    return NextResponse.json({
      success: true,
      accounts: mockAccounts,
      total: mockAccounts.length,
      stats: {
        active: mockAccounts.filter(a => a.status === 'active').length,
        pending: mockAccounts.filter(a => a.status === 'pending').length,
        blocked: mockAccounts.filter(a => a.status === 'blocked').length,
        suspended: mockAccounts.filter(a => a.status === 'suspended').length
      }
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      platform, 
      category, 
      country, 
      notes 
    } = body

    // Валідація
    if (!name || !email || !platform) {
      return NextResponse.json(
        { success: false, error: 'Name, email and platform are required' },
        { status: 400 }
      )
    }

    // Створення нового аккаунта
    const newAccount = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      platform,
      status: 'pending',
      category: category || 'General',
      farmerID: `FARM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      balance: 0,
      currency: 'USD',
      country: country || '',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: notes || ''
    }

    return NextResponse.json({
      success: true,
      account: newAccount
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    )
  }
}