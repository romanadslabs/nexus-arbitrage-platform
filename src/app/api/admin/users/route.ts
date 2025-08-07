import { NextRequest, NextResponse } from 'next/server'
import { TeamService } from '@/lib/airtable'

export async function GET() {
  try {
    const users = await TeamService.getAllTeamMembers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, phone, department, password } = body

    // Валідація
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email and role are required' },
        { status: 400 }
      )
    }

    // Створення користувача
    const newUser = await TeamService.createTeamMember({
      Name: name,
      Email: email,
      Role: role,
      Status: 'pending', // Потребує підтвердження адміністратора
      Phone: phone || '',
      Department: department || '',
      Password: password || 'default123', // В реальному проекті пароль має бути захешований
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 