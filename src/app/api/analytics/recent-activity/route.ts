import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Повертаємо тестові дані замість реальних з Airtable
    const mockActivities = [
      {
        id: '1',
        type: 'campaign_started',
        title: 'Кампанія запущена',
        description: 'Facebook E-commerce Campaign успішно запущено',
        time: '2 хвилини тому',
        status: 'success',
        icon: 'Target',
        color: 'text-green-600'
      },
      {
        id: '2',
        type: 'account_created',
        title: 'Аккаунт додано',
        description: 'Google Ads Business Account додано до системи',
        time: '15 хвилин тому',
        status: 'info',
        icon: 'Users',
        color: 'text-blue-600'
      },
      {
        id: '3',
        type: 'expense_added',
        title: 'Витрата додана',
        description: 'Проксі сервіс - $25.00',
        time: '1 година тому',
        status: 'warning',
        icon: 'DollarSign',
        color: 'text-orange-600'
      },
      {
        id: '4',
        type: 'campaign_completed',
        title: 'Кампанія завершена',
        description: 'TikTok Dating Campaign завершено з ROI 245%',
        time: '2 години тому',
        status: 'success',
        icon: 'Target',
        color: 'text-green-600'
      },
      {
        id: '5',
        type: 'account_updated',
        title: 'Аккаунт оновлено',
        description: 'Facebook Personal Account статус змінено на активний',
        time: '3 години тому',
        status: 'info',
        icon: 'Users',
        color: 'text-blue-600'
      }
    ]
    
    return NextResponse.json(mockActivities)
  } catch (error) {
    console.error('Recent activity error:', error)
    return NextResponse.json([])
  }
} 