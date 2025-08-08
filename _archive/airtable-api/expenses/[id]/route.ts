import { NextResponse } from 'next/server'
import { ExpensesService, convertAirtableToAppData } from '@/lib/airtable'

// Оновлення витрати
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedRecord = await ExpensesService.updateExpense(id, body);

    const updatedExpense = convertAirtableToAppData.expense(updatedRecord);

    return NextResponse.json({
      success: true,
      expense: updatedExpense
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка оновлення витрати в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}

// Видалення витрати
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await ExpensesService.deleteExpense(id);

    return NextResponse.json({
      success: true,
      message: `Витрату з ID ${id} було успішно видалено`
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка видалення витрати з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 