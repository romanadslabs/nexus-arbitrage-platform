import { NextRequest, NextResponse } from 'next/server'
import { AccountsService } from '@/lib/airtable'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, accountId, farmerId, buyerId } = body

    console.log(`🚀 Дія фармінгу: ${action} для аккаунта ${accountId}`)

    let result = null

    switch (action) {
      case 'start':
        if (!accountId || !farmerId) {
          return NextResponse.json({ success: false, error: 'Необхідні accountId та farmerId' }, { status: 400 })
        }
        // Оновлюємо статус на farming_day_1
        result = await AccountsService.updateAccount(accountId, { 
          status: 'farming_day_1',
          farmerId: farmerId 
        })
        break
      case 'complete':
        if (!accountId) {
          return NextResponse.json({ success: false, error: 'Необхідний accountId' }, { status: 400 })
        }
        // Оновлюємо статус на ready_for_ads
        result = await AccountsService.updateAccount(accountId, { 
          status: 'ready_for_ads' 
        })
        break
      case 'sell':
        if (!accountId || !buyerId) {
          return NextResponse.json({ success: false, error: 'Необхідні accountId та buyerId' }, { status: 400 })
        }
        // Оновлюємо статус на sold
        result = await AccountsService.updateAccount(accountId, { 
          status: 'sold'
        })
        break
      default:
        return NextResponse.json({ success: false, error: 'Невідома дія' }, { status: 400 })
    }

    if (!result) {
      return NextResponse.json({ success: false, error: 'Помилка виконання дії' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Дія ${action} виконана успішно`,
      account: result
    })

  } catch (error) {
    console.error('❌ Помилка виконання дії фармінгу:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка виконання дії',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const farmerId = searchParams.get('farmerId')

    console.log(`📊 Отримання аккаунтів фармінгу: status=${status}, farmerId=${farmerId}`)

    let accounts = []

    if (status && status !== 'all') {
      accounts = await AccountsService.getAccountsByStatus(status)
    } else if (farmerId) {
      accounts = await AccountsService.getAccountsByFarmer(farmerId)
    } else {
      accounts = await AccountsService.getAllAccounts()
    }

    return NextResponse.json({
      success: true,
      accounts,
      count: accounts.length
    })

  } catch (error) {
    console.error('❌ Помилка отримання аккаунтів фармінгу:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка отримання аккаунтів',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
} 