import { NextRequest, NextResponse } from 'next/server'
import { TeamService } from '@/lib/airtable'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    // Отримуємо користувача
    const user = await TeamService.getTeamMemberById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Підтверджуємо користувача
    const updatedUser = await TeamService.updateTeamMember(userId, {
      Status: 'active',
      UpdatedAt: new Date().toISOString()
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    )
  }
} 