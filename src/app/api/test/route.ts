import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Сервер працює!',
    timestamp: new Date().toISOString()
  })
} 