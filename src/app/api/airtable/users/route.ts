import { NextResponse } from 'next/server'
import { TeamService } from '@/lib/airtable'

export async function GET() {
  try {
    const records = await TeamService.getAllTeamMembers()
    const users = records.map(record => ({
      id: record.id,
      ...record.fields
    }))
    
    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка отримання користувачів з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newRecord = await TeamService.createTeamMember(body);
    const newUser = { id: newRecord.id, ...newRecord.fields };

    return NextResponse.json({
      success: true,
      user: newUser
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка створення користувача в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 