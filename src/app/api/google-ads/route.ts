import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: 'Google Ads API temporarily disabled',
      campaigns: []
    })
  } catch (error) {
    console.error('Google Ads API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: 'Google Ads API temporarily disabled',
      success: false
    })
  } catch (error) {
    console.error('Google Ads API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 