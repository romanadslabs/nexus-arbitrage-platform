import { NextRequest, NextResponse } from 'next/server'
import { AccountsService, convertAirtableToAppData } from '@/lib/airtable'

// GET /api/airtable/accounts/[id] - Отримання аккаунта за ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const account = await AccountsService.getAccountById(id)
    
    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    const convertedAccount = convertAirtableToAppData.account(account)

    return NextResponse.json({
      success: true,
      data: convertedAccount,
    })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account' },
      { status: 500 }
    )
  }
}

// PUT /api/airtable/accounts/[id] - Оновлення аккаунта
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const accountData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      platform: body.platform,
      status: body.status,
      category: body.category,
      farmerId: body.farmerId,
    }

    const updatedAccount = await AccountsService.updateAccount(id, accountData)
    const convertedAccount = convertAirtableToAppData.account(updatedAccount)

    return NextResponse.json({
      success: true,
      data: convertedAccount,
    })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    )
  }
}

// DELETE /api/airtable/accounts/[id] - Видалення аккаунта
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await AccountsService.deleteAccount(id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    )
  }
} 