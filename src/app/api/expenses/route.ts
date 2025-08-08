import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockExpenses = [
      {
        id: '1',
        category: 'Proxy Services',
        description: 'Bright Data - Residential Proxies',
        amount: 45.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-20T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: '30 днів, 100 IP адрес',
        recurring: true,
        nextPayment: '2024-02-20T00:00:00Z'
      },
      {
        id: '2',
        category: 'Virtual Cards',
        description: 'Revolut Business Card',
        amount: 200.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-19T00:00:00Z',
        paymentMethod: 'Bank Transfer',
        notes: 'Поповнення для рекламних кампаній',
        recurring: false,
        nextPayment: null
      },
      {
        id: '3',
        category: 'Software Tools',
        description: 'AdSpy - Ad Intelligence',
        amount: 99.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-18T00:00:00Z',
        paymentMethod: 'PayPal',
        notes: 'Місячна підписка для аналізу конкурентів',
        recurring: true,
        nextPayment: '2024-02-18T00:00:00Z'
      },
      {
        id: '4',
        category: 'Domain & Hosting',
        description: 'Namecheap - Domain Registration',
        amount: 12.99,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-17T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: 'Реєстрація домену для лендінгу',
        recurring: false,
        nextPayment: null
      },
      {
        id: '5',
        category: 'Proxy Services',
        description: 'Oxylabs - Datacenter Proxies',
        amount: 75.00,
        currency: 'USD',
        status: 'pending',
        date: '2024-01-16T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: 'Очікує оплати, 50 IP адрес',
        recurring: true,
        nextPayment: '2024-02-16T00:00:00Z'
      },
      {
        id: '6',
        category: 'Software Tools',
        description: 'SpyFu - Competitor Research',
        amount: 39.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-15T00:00:00Z',
        paymentMethod: 'PayPal',
        notes: 'Місячна підписка для дослідження ключових слів',
        recurring: true,
        nextPayment: '2024-02-15T00:00:00Z'
      },
      {
        id: '7',
        category: 'Virtual Cards',
        description: 'TransferWise Business Card',
        amount: 150.00,
        currency: 'EUR',
        status: 'paid',
        date: '2024-01-14T00:00:00Z',
        paymentMethod: 'Bank Transfer',
        notes: 'Поповнення для європейських кампаній',
        recurring: false,
        nextPayment: null
      },
      {
        id: '8',
        category: 'Proxy Services',
        description: 'SmartProxy - Mobile Proxies',
        amount: 60.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-13T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: 'Мобільні проксі для TikTok кампаній',
        recurring: true,
        nextPayment: '2024-02-13T00:00:00Z'
      },
      {
        id: '9',
        category: 'Software Tools',
        description: 'SimilarWeb - Traffic Analysis',
        amount: 125.00,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-12T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: 'Квартальна підписка для аналізу трафіку',
        recurring: true,
        nextPayment: '2024-04-12T00:00:00Z'
      },
      {
        id: '10',
        category: 'Domain & Hosting',
        description: 'Hostinger - Web Hosting',
        amount: 8.99,
        currency: 'USD',
        status: 'paid',
        date: '2024-01-11T00:00:00Z',
        paymentMethod: 'Credit Card',
        notes: 'Місячний хостинг для лендінгів',
        recurring: true,
        nextPayment: '2024-02-11T00:00:00Z'
      }
    ]

    return NextResponse.json({
      success: true,
      expenses: mockExpenses,
      total: mockExpenses.length,
      stats: {
        totalAmount: mockExpenses.reduce((sum, e) => sum + e.amount, 0),
        paid: mockExpenses.filter(e => e.status === 'paid').length,
        pending: mockExpenses.filter(e => e.status === 'pending').length,
        recurring: mockExpenses.filter(e => e.recurring).length,
        categories: {
          'Proxy Services': mockExpenses.filter(e => e.category === 'Proxy Services').length,
          'Virtual Cards': mockExpenses.filter(e => e.category === 'Virtual Cards').length,
          'Software Tools': mockExpenses.filter(e => e.category === 'Software Tools').length,
          'Domain & Hosting': mockExpenses.filter(e => e.category === 'Domain & Hosting').length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      category, 
      description, 
      amount, 
      currency, 
      paymentMethod, 
      notes, 
      recurring 
    } = body

    // Валідація
    if (!category || !description || !amount) {
      return NextResponse.json(
        { success: false, error: 'Category, description and amount are required' },
        { status: 400 }
      )
    }

    // Створення нової витрати
    const newExpense = {
      id: Date.now().toString(),
      category,
      description,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      status: 'pending',
      date: new Date().toISOString(),
      paymentMethod: paymentMethod || '',
      notes: notes || '',
      recurring: recurring || false,
      nextPayment: recurring ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
    }

    return NextResponse.json({
      success: true,
      expense: newExpense
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}