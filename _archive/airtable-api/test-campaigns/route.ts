import { NextResponse } from 'next/server'
import { AirtableService, TABLES } from '@/lib/airtable'

export async function GET() {
  try {
    console.log('[API /airtable/test-campaigns] Testing Campaigns table...');
    
    // Спроба отримати записи з таблиці Campaigns
    const records = await AirtableService.getAllRecords(TABLES.CAMPAIGNS);
    
    return NextResponse.json({
      success: true,
      message: 'Campaigns table is accessible',
      recordCount: records.length,
      sampleRecords: records.slice(0, 2), // Перші 2 записи як приклад
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API /airtable/test-campaigns] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Campaigns table error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 