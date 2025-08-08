export interface OfferComment {
  id: string
  authorId: string
  authorName: string
  text: string
  createdAt: Date
}

export interface Offer {
  id: string
  name: string
  description: string
  vertical: string // Вертикаль (e-commerce, gaming, dating, etc.)
  source: string // Джерело оффера
  rate: number // Ставка за конверсію
  revenue: number // Очікуваний дохід
  expenses: number // Витрати
  roi: number // ROI
  period: string // Період (daily, weekly, monthly)
  status: 'active' | 'paused' | 'completed' | 'draft'
  createdAt: Date
  updatedAt: Date
  createdBy: string // ID користувача, який створив
  tags: string[]
  requirements?: string // Вимоги до трафіку
  restrictions?: string // Обмеження
  payoutType: 'cpa' | 'cpc' | 'cpm' | 'revshare'
  minPayout: number
  maxPayout?: number
  countries: string[] // Дозволені країни
  devices: string[] // Дозволені пристрої
  trafficTypes: string[] // Типи трафіку
  maxLinks?: number // Максимальна кількість посилань
  activeUsers?: number // Кількість активних користувачів
  totalUsers?: number // Загальна кількість користувачів
  comments?: OfferComment[]
}

export interface OfferLink {
  id: string
  offerId: string
  name: string
  url: string
  uniqueId: string // Унікальний ідентифікатор для відстеження
  status: 'active' | 'paused' | 'archived'
  createdAt: Date
  createdBy: string // ID користувача, який створив
  accountId?: string // ID аккаунта, який запустив
  notes?: string
  tags: string[]
}

export interface LinkStats {
  id: string
  linkId: string
  offerId: string
  date: Date
  
  // Статистика
  impressions: number // Покази
  clicks: number // Кліки
  opens: number // Відкриття
  leads: number // Ліди
  conversions: number // Конверсії
  
  // Розрахунки
  ctr: number // Click-through rate
  cvr: number // Conversion rate
  revenue: number // Дохід за день
  cost: number // Витрати за день
  profit: number // Прибуток за день
  roi: number // ROI за день
  
  // Деталі
  accountId?: string // Який аккаунт запустив
  accountName?: string
  notes?: string // Нотатки про день
  
  // Метадані
  createdAt: Date
  updatedAt: Date
  updatedBy: string
}

export interface OfferCampaign {
  id: string
  offerId: string
  linkId: string
  accountId: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'stopped'
  startDate: Date
  endDate?: Date
  budget: number
  spent: number
  targetImpressions?: number
  targetClicks?: number
  targetConversions?: number
  createdAt: Date
  createdBy: string
  notes?: string
}

export interface OfferReport {
  id: string
  offerId: string
  period: 'daily' | 'weekly' | 'monthly'
  startDate: Date
  endDate: Date
  
  // Загальна статистика
  totalImpressions: number
  totalClicks: number
  totalOpens: number
  totalConversions: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  
  // Середні показники
  avgCtr: number
  avgCvr: number
  avgRoi: number
  
  // Деталізація по аккаунтах
  accountStats: {
    accountId: string
    accountName: string
    impressions: number
    clicks: number
    conversions: number
    revenue: number
    cost: number
    profit: number
  }[]
  
  // Деталізація по посиланнях
  linkStats: {
    linkId: string
    linkName: string
    impressions: number
    clicks: number
    conversions: number
    revenue: number
    cost: number
    profit: number
  }[]
  
  createdAt: Date
  generatedBy: string
} 