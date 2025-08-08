import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock дані для карт
    const mockCards = [
      {
        id: '1',
        number: '**** **** **** 1234',
        type: 'Visa',
        status: 'active',
        balance: 1250.50,
        currency: 'USD',
        country: 'US',
        bank: 'Chase Bank',
        expiryDate: '2025-12',
        cvv: '***',
        holderName: 'John Smith',
        notes: 'Основна карта для реклами',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:22:00Z'
      },
      {
        id: '2',
        number: '**** **** **** 5678',
        type: 'Mastercard',
        status: 'active',
        balance: 890.75,
        currency: 'EUR',
        country: 'DE',
        bank: 'Deutsche Bank',
        expiryDate: '2026-03',
        cvv: '***',
        holderName: 'Maria Schmidt',
        notes: 'Карта для німецьких кампаній',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-20T16:45:00Z'
      },
      {
        id: '3',
        number: '**** **** **** 9012',
        type: 'Visa',
        status: 'blocked',
        balance: 0,
        currency: 'GBP',
        country: 'UK',
        bank: 'Barclays',
        expiryDate: '2025-08',
        cvv: '***',
        holderName: 'David Wilson',
        notes: 'Заблокована за підозрілу активність',
        createdAt: '2024-01-08T11:20:00Z',
        updatedAt: '2024-01-19T13:10:00Z'
      },
      {
        id: '4',
        number: '**** **** **** 3456',
        type: 'Mastercard',
        status: 'active',
        balance: 2100.00,
        currency: 'EUR',
        country: 'FR',
        bank: 'BNP Paribas',
        expiryDate: '2026-06',
        cvv: '***',
        holderName: 'Pierre Dubois',
        notes: 'Високий ліміт, стабільна робота',
        createdAt: '2024-01-05T08:45:00Z',
        updatedAt: '2024-01-20T12:30:00Z'
      },
      {
        id: '5',
        number: '**** **** **** 7890',
        type: 'Visa',
        status: 'pending',
        balance: 0,
        currency: 'CAD',
        country: 'CA',
        bank: 'RBC',
        expiryDate: '2025-11',
        cvv: '***',
        holderName: 'Sarah Johnson',
        notes: 'Очікує активації',
        createdAt: '2024-01-18T14:20:00Z',
        updatedAt: '2024-01-19T10:15:00Z'
      },
      {
        id: '6',
        number: '**** **** **** 2345',
        type: 'Mastercard',
        status: 'active',
        balance: 750.25,
        currency: 'AUD',
        country: 'AU',
        bank: 'Commonwealth Bank',
        expiryDate: '2026-02',
        cvv: '***',
        holderName: 'Michael Brown',
        notes: 'Карта для австралійських кампаній',
        createdAt: '2024-01-12T16:30:00Z',
        updatedAt: '2024-01-20T15:20:00Z'
      }
    ]

    return NextResponse.json({
      success: true,
      cards: mockCards,
      total: mockCards.length,
      stats: {
        active: mockCards.filter(c => c.status === 'active').length,
        pending: mockCards.filter(c => c.status === 'pending').length,
        blocked: mockCards.filter(c => c.status === 'blocked').length,
        totalBalance: mockCards.reduce((sum, c) => sum + c.balance, 0)
      }
    })
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      number, 
      type, 
      status, 
      balance, 
      currency, 
      country, 
      bank, 
      expiryDate, 
      cvv, 
      holderName, 
      notes 
    } = body

    // Валідація
    if (!number || !type || !holderName) {
      return NextResponse.json(
        { success: false, error: 'Card number, type and holder name are required' },
        { status: 400 }
      )
    }

    // Створення карти
    const newCard = {
      id: Date.now().toString(),
      number: number.replace(/\d(?=\d{4})/g, '*'),
      type: type,
      status: status || 'pending',
      balance: parseFloat(balance) || 0,
      currency: currency || 'USD',
      country: country || '',
      bank: bank || '',
      expiryDate: expiryDate || '',
      cvv: '***',
      holderName: holderName,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      card: newCard
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create card' },
      { status: 500 }
    )
  }
} 