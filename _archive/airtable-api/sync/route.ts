import { NextResponse } from 'next/server';
import AirtableService, { TABLES } from '@/lib/airtable';

export async function POST() {
  try {
    // Тут буде логіка для синхронізації даних
    console.log('Синхронізація з Airtable...');
    
    // Приклад: отримання записів з таблиці
    const records = await AirtableService.getAllRecords(TABLES.ACCOUNTS);
    console.log(records);

    return NextResponse.json({ success: true, message: 'Синхронізація успішна' });
  } catch (error) {
    console.error('Помилка синхронізації з Airtable:', error);
    return NextResponse.json({ success: false, message: 'Помилка синхронізації' }, { status: 500 });
  }
} 