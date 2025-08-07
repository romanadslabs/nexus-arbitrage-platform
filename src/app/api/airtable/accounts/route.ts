import { NextResponse } from 'next/server'
import { AccountsService, convertAirtableToAppData } from '@/lib/airtable'

export async function GET() {
  console.log('[API /accounts] Received GET request.');
  try {
    console.log('[API /accounts] Fetching records from Airtable...');
    const records = await AccountsService.getAllAccounts();
    console.log(`[API /accounts] Successfully fetched ${records.length} records.`);

    console.log('[API /accounts] Converting records to app data format...');
    const accounts = records.map(convertAirtableToAppData.account);
    console.log('[API /accounts] Conversion complete.');
    
    return NextResponse.json({
      success: true,
      accounts,
    })
  } catch (error) {
    console.error('[API /accounts] CRITICAL ERROR:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка отримання аккаунтів з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Тут ми можемо додати валідацію для body
    
    const newRecord = await AccountsService.createAccount(body);
    const newAccount = convertAirtableToAppData.account(newRecord);

    return NextResponse.json({
      success: true,
      account: newAccount
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка створення аккаунту в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 