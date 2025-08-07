import { NextResponse } from 'next/server'
import { CampaignsService, convertAirtableToAppData, FIELD_NAMES } from '@/lib/airtable'

export async function GET() {
  try {
    const records = await CampaignsService.getAllCampaigns();
    const campaigns = records.map(convertAirtableToAppData.campaign);
    
    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Помилка отримання кампаній з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Перетворюємо дані з формату додатку у формат Airtable
    const airtableData = {
      [FIELD_NAMES.NAME]: body.name,
      [FIELD_NAMES.PLATFORM]: body.platform,
      [FIELD_NAMES.STATUS]: body.status,
      [FIELD_NAMES.BUDGET]: body.budget,
      [FIELD_NAMES.START_DATE]: body.startDate,
      // Поля-зв'язки очікують масив ID
      [FIELD_NAMES.LINKED_ACCOUNT]: body.accountId ? [body.accountId] : [],
      [FIELD_NAMES.LAUNCHER]: body.launcherId ? [body.launcherId] : [],
      // Додаткові поля, якщо вони є в body
      ...(body.offerId && { 'OfferID': body.offerId }),
    };

    const newRecord = await CampaignsService.createCampaign(airtableData);
    const newCampaign = convertAirtableToAppData.campaign(newRecord);

    return NextResponse.json({
      success: true,
      campaign: newCampaign
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка створення кампанії в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 