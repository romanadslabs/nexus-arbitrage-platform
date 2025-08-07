import { NextResponse } from 'next/server'
import { checkAirtableConnection } from '@/lib/airtable'

// GET /api/airtable/connection - Перевірка підключення до Airtable
export async function GET() {
  try {
    const isConnected = await checkAirtableConnection()
    
    return NextResponse.json({
      success: isConnected,
      message: isConnected ? 'Connected to Airtable' : 'Failed to connect to Airtable',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error checking Airtable connection:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check Airtable connection',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 