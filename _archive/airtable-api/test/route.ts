import { NextResponse } from 'next/server'
import Airtable from 'airtable'
import { AccountsService, ExpensesService } from '@/lib/airtable'

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing API credentials',
          message: 'AIRTABLE_API_KEY or AIRTABLE_BASE_ID not found in environment variables'
        },
        { status: 500 }
      )
    }

    const base = new Airtable({ apiKey }).base(baseId)

    // Тестуємо підключення до різних таблиць
    const testResults = {
      accounts: false,
      campaigns: false,
      expenses: false,
      offers: false,
      team: false
    }

    try {
      // Тест таблиці Accounts
      const accountsRecords = await base('Accounts').select({ maxRecords: 1 }).firstPage()
      testResults.accounts = true
    } catch (error) {
      console.error('Error testing Accounts table:', error)
    }

    try {
      // Тест таблиці Campaigns
      const campaignsRecords = await base('Campaigns').select({ maxRecords: 1 }).firstPage()
      testResults.campaigns = true
    } catch (error) {
      console.error('Error testing Campaigns table:', error)
    }

    try {
      // Тест таблиці Expenses
      const expensesRecords = await base('Expenses').select({ maxRecords: 1 }).firstPage()
      testResults.expenses = true
    } catch (error) {
      console.error('Error testing Expenses table:', error)
    }

    try {
      // Тест таблиці Offers
      const offersRecords = await base('Offers').select({ maxRecords: 1 }).firstPage()
      testResults.offers = true
    } catch (error) {
      console.error('Error testing Offers table:', error)
    }

    try {
      // Тест таблиці Team Members
      const teamRecords = await base('Team Members').select({ maxRecords: 1 }).firstPage()
      testResults.team = true
    } catch (error) {
      console.error('Error testing Team Members table:', error)
    }

    const workingTables = Object.entries(testResults)
      .filter(([_, isWorking]) => isWorking)
      .map(([tableName, _]) => tableName)

    const failedTables = Object.entries(testResults)
      .filter(([_, isWorking]) => !isWorking)
      .map(([tableName, _]) => tableName)

    return NextResponse.json({
      success: true,
      message: 'Airtable connection test completed',
      apiKey: apiKey ? '***' + apiKey.slice(-4) : 'Not found',
      baseId: baseId ? baseId : 'Not found',
      testResults,
      workingTables,
      failedTables,
      summary: {
        total: Object.keys(testResults).length,
        working: workingTables.length,
        failed: failedTables.length
      }
    })

  } catch (error) {
    console.error('Error testing Airtable connection:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test Airtable connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST метод для детальнішого тестування
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { testType, options } = body

    switch (testType) {
      case 'connection':
        return await testConnection()
      
      case 'accounts':
        return await testAccounts(options)
      
      case 'offers':
        return await testOffers(options)
      
      case 'expenses':
        return await testExpenses(options)
      
      case 'reports':
        return await testReports(options)
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Невідомий тип тесту'
        })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка обробки запиту',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
}

// Допоміжні функції для тестування
async function testConnection() {
  try {
    const accounts = await AccountsService.getAllAccounts()
    return NextResponse.json({
      success: true,
      message: 'Підключення успішне',
      data: {
        connection: true,
        recordCount: accounts.length,
        sampleRecord: accounts[0] || null
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка підключення',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
}

async function testAccounts(options?: any) {
  try {
    const accounts = await AccountsService.getAllAccounts()
    const filteredAccounts = options?.status 
      ? accounts.filter(acc => acc.fields.Status === options.status)
      : accounts

    return NextResponse.json({
      success: true,
      message: `Знайдено ${filteredAccounts.length} аккаунтів`,
      data: {
        total: accounts.length,
        filtered: filteredAccounts.length,
        sample: filteredAccounts.slice(0, 3)
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка отримання аккаунтів',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
}

async function testOffers(options?: any) {
  try {
    // Тимчасово повертаємо пустий результат
    return NextResponse.json({
      success: true,
      message: 'Оффери тимчасово недоступні',
      data: {
        total: 0,
        filtered: 0,
        sample: []
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка отримання офферів',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
}

async function testExpenses(options?: any) {
  try {
    const expenses = await ExpensesService.getAllExpenses()
    const filteredExpenses = options?.type
      ? expenses.filter(exp => exp.fields['Expense Type'] === options.type)
      : expenses

    return NextResponse.json({
      success: true,
      message: `Знайдено ${filteredExpenses.length} витрат`,
      data: {
        total: expenses.length,
        filtered: filteredExpenses.length,
        sample: filteredExpenses.slice(0, 3)
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка отримання витрат',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
}

async function testReports(options?: any) {
  try {
    const testResults = []
    
    // Тестування різних типів звітів
    const reportTypes = ['overall', 'platforms', 'accounts', 'expenses']
    
    for (const type of reportTypes) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/airtable/reports?type=${type}`)
        const data = await response.json()
        
        testResults.push({
          type,
          success: data.success,
          error: data.error || null,
          dataCount: data.data ? Object.keys(data.data).length : 0
        })
      } catch (error) {
        testResults.push({
          type,
          success: false,
          error: error instanceof Error ? error.message : 'Невідома помилка',
          dataCount: 0
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Тестування звітів завершено',
      data: {
        results: testResults,
        summary: {
          total: testResults.length,
          successful: testResults.filter(r => r.success).length,
          failed: testResults.filter(r => !r.success).length
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Помилка тестування звітів',
      details: error instanceof Error ? error.message : 'Невідома помилка'
    })
  }
} 