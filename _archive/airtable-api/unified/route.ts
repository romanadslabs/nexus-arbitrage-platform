import { NextRequest, NextResponse } from 'next/server'
import { 
  AccountsService, 
  OffersService, 
  ExpensesService, 
  TeamService,
  FIELD_NAMES 
} from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const vertical = searchParams.get('vertical')
    const expenseType = searchParams.get('expenseType')

    if (!table) {
      return NextResponse.json({
        success: false,
        message: 'Параметр table є обов\'язковим'
      }, { status: 400 })
    }

    let data: any[] = []
    let total = 0

    switch (table) {
      case 'accounts':
        if (status) {
          data = await AccountsService.getAccountsByStatus(status)
        } else if (platform) {
          data = await AccountsService.getAccountsByPlatform(platform)
        } else {
          data = await AccountsService.getAllAccounts()
        }
        
        // Трансформуємо дані в уніфікований формат
        data = data.map(record => ({
          id: record.id,
          name: record.fields[FIELD_NAMES.NAME] || '',
          email: record.fields[FIELD_NAMES.EMAIL] || '',
          phone: record.fields[FIELD_NAMES.PHONE] || '',
          platform: record.fields[FIELD_NAMES.PLATFORM] || '',
          status: record.fields[FIELD_NAMES.ACCOUNT_STATUS] || '',
          category: record.fields[FIELD_NAMES.CATEGORY] || '',
          farmerId: record.fields[FIELD_NAMES.FARMER_ID] || '',
          comments: record.fields[FIELD_NAMES.COMMENTS] || '',
          priority: record.fields[FIELD_NAMES.PRIORITY] || 'medium',
          tags: record.fields[FIELD_NAMES.TAGS] || [],
          createdAt: record.createdTime
        }))
        break

      case 'offers':
        if (vertical) {
          data = await OffersService.getOffersByVertical(vertical)
        } else {
          data = await OffersService.getAllOffers()
        }
        
        // Трансформуємо дані в уніфікований формат
        data = data.map(record => ({
          id: record.id,
          name: record.fields[FIELD_NAMES.NAME] || '',
          vertical: record.fields[FIELD_NAMES.VERTICAL] || '',
          source: record.fields[FIELD_NAMES.SOURCE] || '',
          rate: record.fields[FIELD_NAMES.RATE] || 0,
          revenue: record.fields[FIELD_NAMES.REVENUE] || 0,
          expenses: record.fields[FIELD_NAMES.EXPENSES] || 0,
          roi: record.fields[FIELD_NAMES.ROI] || 0,
          period: record.fields[FIELD_NAMES.PERIOD] || '',
          status: record.fields[FIELD_NAMES.OFFER_STATUS] || 'active',
          createdAt: record.createdTime
        }))
        break

      case 'expenses':
        if (expenseType) {
          data = await ExpensesService.getExpensesByType(expenseType)
        } else {
          data = await ExpensesService.getAllExpenses()
        }
        
        // Трансформуємо дані в уніфікований формат
        data = data.map(record => ({
          id: record.id,
          name: record.fields[FIELD_NAMES.NAME] || '',
          expenseType: record.fields[FIELD_NAMES.EXPENSE_TYPE] || '',
          amount: record.fields[FIELD_NAMES.AMOUNT] || 0,
          linkedOffer: record.fields[FIELD_NAMES.LINKED_OFFER] || '',
          linkedCard: record.fields[FIELD_NAMES.LINKED_CARD] || '',
          linkedProxy: record.fields[FIELD_NAMES.LINKED_PROXY] || '',
          date: record.fields[FIELD_NAMES.DATE] || '',
          description: record.fields[FIELD_NAMES.DESCRIPTION] || '',
          createdAt: record.createdTime
        }))
        break

      case 'team':
        data = await TeamService.getAllTeamMembers()
        
        // Трансформуємо дані в уніфікований формат
        data = data.map(record => ({
          id: record.id,
          name: record.fields[FIELD_NAMES.NAME] || '',
          email: record.fields[FIELD_NAMES.EMAIL] || '',
          role: record.fields[FIELD_NAMES.ROLE] || '',
          status: record.fields[FIELD_NAMES.STATUS] || '',
          joinDate: record.fields[FIELD_NAMES.JOIN_DATE] || '',
          permissions: record.fields[FIELD_NAMES.PERMISSIONS] || [],
          createdAt: record.createdTime
        }))
        break

      default:
        return NextResponse.json({
          success: false,
          message: `Невідома таблиця: ${table}`
        }, { status: 400 })
    }

    total = data.length

    // Застосовуємо ліміт
    if (limit) {
      const limitNum = parseInt(limit)
      data = data.slice(0, limitNum)
    }

    return NextResponse.json({
      success: true,
      data,
      total,
      table,
      message: `Успішно отримано ${data.length} записів з таблиці ${table}`
    })

  } catch (error) {
    console.error('Error in unified data API:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Внутрішня помилка сервера'
    }, { status: 500 })
  }
} 