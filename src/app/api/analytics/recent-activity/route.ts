import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Повертаємо тестові дані замість реальних з Airtable
    const mockActivities = [
      {
        id: '1',
        type: 'campaign_started',
        title: 'Кампанія запущена',
        description: 'TikTok Dating Campaign успішно запущено з бюджетом $500',
        time: '2 хвилини тому',
        status: 'success',
        icon: 'Target',
        color: 'text-green-600',
        amount: 500,
        currency: 'USD'
      },
      {
        id: '2',
        type: 'account_created',
        title: 'Аккаунт додано',
        description: 'Facebook Business Account "Dating_UK_01" додано до системи',
        time: '15 хвилин тому',
        status: 'info',
        icon: 'Users',
        color: 'text-blue-600',
        accountName: 'Dating_UK_01'
      },
      {
        id: '3',
        type: 'expense_added',
        title: 'Витрата додана',
        description: 'Проксі сервіс Bright Data - $45.00 за 30 днів',
        time: '1 година тому',
        status: 'warning',
        icon: 'DollarSign',
        color: 'text-orange-600',
        amount: 45,
        currency: 'USD'
      },
      {
        id: '4',
        type: 'campaign_completed',
        title: 'Кампанія завершена',
        description: 'Google Ads E-commerce Campaign завершено з ROI 245%',
        time: '2 години тому',
        status: 'success',
        icon: 'Target',
        color: 'text-green-600',
        roi: 245,
        revenue: 2450
      },
      {
        id: '5',
        type: 'account_updated',
        title: 'Аккаунт оновлено',
        description: 'Instagram Personal Account статус змінено на активний',
        time: '3 години тому',
        status: 'info',
        icon: 'Users',
        color: 'text-blue-600',
        accountName: 'Insta_Dating_03'
      },
      {
        id: '6',
        type: 'conversion_achieved',
        title: 'Конверсія досягнута',
        description: 'Facebook Dating Campaign: 15 конверсій за останню годину',
        time: '4 години тому',
        status: 'success',
        icon: 'TrendingUp',
        color: 'text-green-600',
        conversions: 15,
        timeFrame: '1 година'
      },
      {
        id: '7',
        type: 'expense_added',
        title: 'Витрата додана',
        description: 'Віртуальна карта Revolut - $200 поповнено',
        time: '5 годин тому',
        status: 'warning',
        icon: 'CreditCard',
        color: 'text-orange-600',
        amount: 200,
        currency: 'USD'
      },
      {
        id: '8',
        type: 'campaign_paused',
        title: 'Кампанія призупинена',
        description: 'YouTube Gaming Campaign призупинено через низький CTR',
        time: '6 годин тому',
        status: 'warning',
        icon: 'Pause',
        color: 'text-yellow-600',
        reason: 'Низький CTR'
      },
      {
        id: '9',
        type: 'account_blocked',
        title: 'Аккаунт заблоковано',
        description: 'Facebook Personal Account заблоковано системою',
        time: '8 годин тому',
        status: 'error',
        icon: 'Shield',
        color: 'text-red-600',
        reason: 'Системна блокіровка'
      },
      {
        id: '10',
        type: 'revenue_milestone',
        title: 'Досягнуто мільстоун',
        description: 'Загальний дохід перевищив $45,000',
        time: '12 годин тому',
        status: 'success',
        icon: 'Trophy',
        color: 'text-green-600',
        milestone: 45000,
        currency: 'USD'
      }
    ]
    
    return NextResponse.json(mockActivities)
  } catch (error) {
    console.error('Recent activity error:', error)
    return NextResponse.json([])
  }
} 