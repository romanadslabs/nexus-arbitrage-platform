import { NextResponse } from 'next/server'
import { CampaignsService, convertAirtableToAppData, FIELD_NAMES } from '@/lib/airtable'

// Оновлення кампанії
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const airtableData: Record<string, any> = {};

    // Динамічно додаємо поля, які прийшли в тілі запиту
    if (body.name) airtableData[FIELD_NAMES.NAME] = body.name;
    if (body.platform) airtableData[FIELD_NAMES.PLATFORM] = body.platform;
    if (body.status) airtableData[FIELD_NAMES.STATUS] = body.status;
    if (body.budget) airtableData[FIELD_NAMES.BUDGET] = body.budget;
    if (body.spent) airtableData[FIELD_NAMES.SPENT] = body.spent;
    if (body.clicks) airtableData[FIELD_NAMES.CLICKS] = body.clicks;
    if (body.conversions) airtableData[FIELD_NAMES.CONVERSIONS] = body.conversions;
    if (body.revenue) airtableData[FIELD_NAMES.REVENUE] = body.revenue;
    if (body.roi) airtableData[FIELD_NAMES.ROI] = body.roi;
    if (body.startDate) airtableData[FIELD_NAMES.START_DATE] = body.startDate;
    if (body.accountId) airtableData[FIELD_NAMES.LINKED_ACCOUNT] = [body.accountId];
    if (body.launcherId) airtableData[FIELD_NAMES.LAUNCHER] = [body.launcherId];
    
    const updatedRecord = await CampaignsService.updateCampaign(id, airtableData);
    const updatedCampaign = convertAirtableToAppData.campaign(updatedRecord);

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка оновлення кампанії в Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}

// Видалення кампанії
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await CampaignsService.deleteCampaign(id);

    return NextResponse.json({
      success: true,
      message: `Кампанію з ID ${id} було успішно видалено`
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Помилка видалення кампанії з Airtable',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
} 