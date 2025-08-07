import { NextRequest, NextResponse } from 'next/server'
import { AirtableService, TABLES, FIELD_NAMES } from '@/lib/airtable'

export async function GET() {
  try {
    const cards = await AirtableService.getAllRecords(TABLES.CARDS)
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      number, 
      type, 
      status, 
      balance, 
      currency, 
      country, 
      bank, 
      expiryDate, 
      cvv, 
      holderName, 
      notes 
    } = body

    // Валідація
    if (!number || !type || !holderName) {
      return NextResponse.json(
        { error: 'Card number, type and holder name are required' },
        { status: 400 }
      )
    }

    // Створення карти
    const newCard = await AirtableService.createRecord(TABLES.CARDS, {
      'Card Number': number,
      'Type': type,
      'Status': status || 'active',
      'Balance': balance || 0,
      'Currency': currency || 'USD',
      'Country': country || '',
      'Bank': bank || '',
      'Expiry Date': expiryDate || '',
      'CVV': cvv || '',
      'Holder Name': holderName,
      'Notes': notes || '',
      'Created At': new Date().toISOString(),
      'Updated At': new Date().toISOString()
    })

    return NextResponse.json(newCard, { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    )
  }
} 