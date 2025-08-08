import { NextResponse } from 'next/server'
import { TeamService } from '@/lib/airtable'

// Оновлення користувача
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedRecord = await TeamService.updateTeamMember(id, body);
    const updatedUser = { id: updatedRecord.id, ...updatedRecord.fields };

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка оновлення користувача в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}

// Видалення користувача
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await TeamService.deleteTeamMember(id);

    return NextResponse.json({
      success: true,
      message: `Користувача з ID ${id} було успішно видалено`
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка видалення користувача з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 