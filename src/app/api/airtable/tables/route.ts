import { NextResponse } from 'next/server'
import { TABLES } from '@/lib/airtable'

export async function GET() {
  try {
    console.log('[API /airtable/tables] Checking available tables...');
    
    // Повертаємо список таблиць, які ми намагаємося використовувати
    const availableTables = Object.values(TABLES);
    
    return NextResponse.json({
      success: true,
      tables: availableTables,
      message: 'Available tables in configuration',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API /airtable/tables] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking tables',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 