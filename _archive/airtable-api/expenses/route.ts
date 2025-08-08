import { NextResponse } from 'next/server'
import { ExpensesService, convertAirtableToAppData } from '@/lib/airtable'

export async function GET() {
  try {
    const records = await ExpensesService.getAllExpenses()
    const expenses = records.map(convertAirtableToAppData.expense)
    
    return NextResponse.json({
      success: true,
      expenses,
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка отримання витрат з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newRecord = await ExpensesService.createExpense(body);
    const newExpense = convertAirtableToAppData.expense(newRecord);

    return NextResponse.json({
      success: true,
      expense: newExpense
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка створення витрати в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 