import { Offer, OfferLink, LinkStats } from '@/types/offers'

// Local Storage Keys
const LOCAL_STORAGE_KEYS = {
  OFFERS: 'nexus_local_offers',
  OFFER_LINKS: 'nexus_local_offer_links',
  LINK_STATS: 'nexus_local_link_stats',
}

// Функції для роботи з офферами
export const OffersService = {
  // Отримання всіх офферів
  getAllOffers: (): Offer[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFERS)
    return stored ? JSON.parse(stored) : []
  },

  // Створення нового оффера
  createOffer: (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Offer => {
    const newOffer: Offer = {
      ...offerData,
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const offers = OffersService.getAllOffers()
    offers.push(newOffer)
    localStorage.setItem(LOCAL_STORAGE_KEYS.OFFERS, JSON.stringify(offers))
    
    return newOffer
  },

  // Оновлення оффера
  updateOffer: (id: string, updates: Partial<Offer>): void => {
    const offers = OffersService.getAllOffers()
    const index = offers.findIndex(offer => offer.id === id)
    
    if (index !== -1) {
      offers[index] = { ...offers[index], ...updates, updatedAt: new Date() }
      localStorage.setItem(LOCAL_STORAGE_KEYS.OFFERS, JSON.stringify(offers))
    }
  },

  // Видалення оффера
  deleteOffer: (id: string): void => {
    const offers = OffersService.getAllOffers()
    const filteredOffers = offers.filter(offer => offer.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEYS.OFFERS, JSON.stringify(filteredOffers))
  },

  // Отримання оффера по ID
  getOfferById: (id: string): Offer | null => {
    const offers = OffersService.getAllOffers()
    return offers.find(offer => offer.id === id) || null
  }
}

// Функції для роботи з посиланнями
export const OfferLinksService = {
  // Отримання всіх посилань
  getAllLinks: (): OfferLink[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFER_LINKS)
    return stored ? JSON.parse(stored) : []
  },

  // Отримання посилань по ID оффера
  getLinksByOfferId: (offerId: string): OfferLink[] => {
    const links = OfferLinksService.getAllLinks()
    return links.filter(link => link.offerId === offerId)
  },

  // Перевірка унікальності URL для оффера
  isUrlUnique: (offerId: string, url: string, excludeId?: string): boolean => {
    const links = OfferLinksService.getLinksByOfferId(offerId)
    return !links.some(link => link.url === url && link.id !== excludeId)
  },

  // Перевірка унікальності аккаунта для оффера
  isAccountUnique: (offerId: string, accountId: string, excludeId?: string): boolean => {
    const links = OfferLinksService.getLinksByOfferId(offerId)
    return !links.some(link => link.accountId === accountId && link.id !== excludeId)
  },

  // Створення нового посилання з перевіркою унікальності
  createLink: (linkData: Omit<OfferLink, 'id' | 'createdAt'>): OfferLink => {
    // Перевіряємо унікальність URL
    if (!OfferLinksService.isUrlUnique(linkData.offerId, linkData.url)) {
      throw new Error(`URL ${linkData.url} вже використовується для цього оффера`)
    }

    // Перевіряємо унікальність аккаунта
    if (!OfferLinksService.isAccountUnique(linkData.offerId, linkData.accountId)) {
      throw new Error(`Аккаунт ${linkData.accountId} вже використовується для цього оффера`)
    }

    const newLink: OfferLink = {
      ...linkData,
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    
    const links = OfferLinksService.getAllLinks()
    links.push(newLink)
    localStorage.setItem(LOCAL_STORAGE_KEYS.OFFER_LINKS, JSON.stringify(links))
    
    return newLink
  },

  // Оновлення посилання з перевіркою унікальності
  updateLink: (id: string, updates: Partial<OfferLink>): void => {
    const links = OfferLinksService.getAllLinks()
    const index = links.findIndex(link => link.id === id)
    
    if (index !== -1) {
      const currentLink = links[index]
      
      // Перевіряємо унікальність URL якщо він змінюється
      if (updates.url && updates.url !== currentLink.url) {
        if (!OfferLinksService.isUrlUnique(currentLink.offerId, updates.url, id)) {
          throw new Error(`URL ${updates.url} вже використовується для цього оффера`)
        }
      }

      // Перевіряємо унікальність аккаунта якщо він змінюється
      if (updates.accountId && updates.accountId !== currentLink.accountId) {
        if (!OfferLinksService.isAccountUnique(currentLink.offerId, updates.accountId, id)) {
          throw new Error(`Аккаунт ${updates.accountId} вже використовується для цього оффера`)
        }
      }

      links[index] = { ...links[index], ...updates }
      localStorage.setItem(LOCAL_STORAGE_KEYS.OFFER_LINKS, JSON.stringify(links))
    }
  },

  // Видалення посилання
  deleteLink: (id: string): void => {
    const links = OfferLinksService.getAllLinks()
    const filteredLinks = links.filter(link => link.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEYS.OFFER_LINKS, JSON.stringify(filteredLinks))
  },

  // Отримання посилання по ID
  getLinkById: (id: string): OfferLink | null => {
    const links = OfferLinksService.getAllLinks()
    return links.find(link => link.id === id) || null
  }
}

// Функції для роботи зі статистикою
export const LinkStatsService = {
  // Отримання всієї статистики
  getAllStats: (): LinkStats[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.LINK_STATS)
    return stored ? JSON.parse(stored) : []
  },

  // Створення нової статистики
  createStats: (statsData: Omit<LinkStats, 'id' | 'createdAt' | 'updatedAt'>): LinkStats => {
    const newStats: LinkStats = {
      ...statsData,
      id: `stats_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const stats = LinkStatsService.getAllStats()
    stats.push(newStats)
    localStorage.setItem(LOCAL_STORAGE_KEYS.LINK_STATS, JSON.stringify(stats))
    
    return newStats
  },

  // Оновлення статистики
  updateStats: (id: string, updates: Partial<LinkStats>): void => {
    const stats = LinkStatsService.getAllStats()
    const index = stats.findIndex(stat => stat.id === id)
    
    if (index !== -1) {
      stats[index] = { ...stats[index], ...updates, updatedAt: new Date() }
      localStorage.setItem(LOCAL_STORAGE_KEYS.LINK_STATS, JSON.stringify(stats))
    }
  },

  // Видалення статистики
  deleteStats: (id: string): void => {
    const stats = LinkStatsService.getAllStats()
    const filteredStats = stats.filter(stat => stat.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEYS.LINK_STATS, JSON.stringify(filteredStats))
  },

  // Отримання статистики для конкретного посилання
  getStatsByLinkId: (linkId: string): LinkStats[] => {
    const stats = LinkStatsService.getAllStats()
    return stats.filter(stat => stat.linkId === linkId)
  },

  // Отримання статистики для конкретного оффера
  getStatsByOfferId: (offerId: string): LinkStats[] => {
    const stats = LinkStatsService.getAllStats()
    return stats.filter(stat => stat.offerId === offerId)
  },

  // Отримання статистики за період
  getStatsByPeriod: (startDate: Date, endDate: Date): LinkStats[] => {
    const stats = LinkStatsService.getAllStats()
    return stats.filter(stat => {
      const statDate = new Date(stat.date)
      return statDate >= startDate && statDate <= endDate
    })
  }
}

// Функції для розрахунків
export const OffersAnalytics = {
  // Розрахунок загальної статистики
  getTotalStats: () => {
    const stats = LinkStatsService.getAllStats()
    return {
      totalImpressions: stats.reduce((sum, stat) => sum + stat.impressions, 0),
      totalClicks: stats.reduce((sum, stat) => sum + stat.clicks, 0),
      totalOpens: stats.reduce((sum, stat) => sum + stat.opens, 0),
      totalLeads: stats.reduce((sum, stat) => sum + stat.leads, 0),
      totalConversions: stats.reduce((sum, stat) => sum + stat.conversions, 0),
      totalRevenue: stats.reduce((sum, stat) => sum + stat.revenue, 0),
      totalCost: stats.reduce((sum, stat) => sum + stat.cost, 0),
      totalProfit: stats.reduce((sum, stat) => sum + stat.profit, 0)
    }
  },

  // Розрахунок статистики по офферах
  getStatsByOffer: (offerId: string) => {
    const stats = LinkStatsService.getStatsByOfferId(offerId)
    return {
      totalImpressions: stats.reduce((sum, stat) => sum + stat.impressions, 0),
      totalClicks: stats.reduce((sum, stat) => sum + stat.clicks, 0),
      totalLeads: stats.reduce((sum, stat) => sum + stat.leads, 0),
      totalConversions: stats.reduce((sum, stat) => sum + stat.conversions, 0),
      totalRevenue: stats.reduce((sum, stat) => sum + stat.revenue, 0),
      totalProfit: stats.reduce((sum, stat) => sum + stat.profit, 0),
      avgCtr: stats.length > 0 ? stats.reduce((sum, stat) => sum + stat.ctr, 0) / stats.length : 0,
      avgCvr: stats.length > 0 ? stats.reduce((sum, stat) => sum + stat.cvr, 0) / stats.length : 0,
      avgRoi: stats.length > 0 ? stats.reduce((sum, stat) => sum + stat.roi, 0) / stats.length : 0
    }
  }
}

// Тимчасові дані для демонстрації
export const seedOffersData = () => {
  console.log('🌱 Перевірка даних офферів...')
  
  const existingOffers = OffersService.getAllOffers()
  console.log('📋 Існуючі оффери:', existingOffers.length)
  
  if (existingOffers.length > 0) {
    console.log('✅ Дані вже існують, пропускаємо створення')
    return
  }

  console.log('🚀 Створення нових даних офферів...')

  // Створюємо оффер inCruises
  const inCruisesOffer = OffersService.createOffer({
    name: 'inCruises — круїзний клуб',
    description: 'Міжнародний круїзний клуб із партнерською програмою, де ти заробляєш на залученні нових учасників та бронюванні подорожей. Можна заробляти з перших днів, навіть не вкладаючи власних грошей! 💰 СТАВКА: $12 за лід + $2 щомісячно з кожного залученого користувача!',
    vertical: 'travel',
    source: 'Партнерська програма',
    rate: 12, // $12 за лід (стартова тестова капа)
    revenue: 0,
    expenses: 0,
    roi: 0,
    period: 'daily',
    status: 'active',
    createdBy: 'user_1',
    tags: ['travel', 'cruises', 'affiliate', 'no-investment', 'recurring', 'test-cap'],
    requirements: 'Безкоштовне навчання, особистий куратор, готові матеріали для просування. Стартова тестова капа - $12 за лід + $2 щомісячно.',
    restrictions: 'Тільки для зареєстрованих партнерів. Стартова тестова капа.',
    payoutType: 'cpa',
    minPayout: 12, // $12 за лід
    maxPayout: 50, // $50 за преміум
    countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR'],
    devices: ['desktop', 'mobile', 'tablet'],
    trafficTypes: ['social', 'organic', 'referral'],
    maxLinks: 50, // Максимум 50 посилань
    activeUsers: 127, // 127 активних партнерів
    totalUsers: 342 // 342 загалом партнерів
  })

  console.log('✅ Оффер створений:', inCruisesOffer.name)

  // Створюємо всі 30 прелендингів
  const prelandingLinks = [
    { name: 'inCruises - Головна сторінка', url: 'https://cruises-world.lovable.app/', tags: ['prelanding', 'main', 'home'] },
    { name: 'inCruises - Круїзи', url: 'https://cruises-world.lovable.app/cruises', tags: ['prelanding', 'cruises', 'destinations'] },
    { name: 'inCruises - Заробіток', url: 'https://cruises-world.lovable.app/earnings', tags: ['prelanding', 'earnings', 'money'] },
    { name: 'inCruises - Відгуки', url: 'https://cruises-world.lovable.app/reviews', tags: ['prelanding', 'reviews', 'social-proof'] },
    { name: 'inCruises - Контакти', url: 'https://cruises-world.lovable.app/contact', tags: ['prelanding', 'contact', 'support'] },
    { name: 'inCruises - Сторінка 006', url: 'https://cruises-world.lovable.app/page006', tags: ['prelanding', 'page006'] },
    { name: 'inCruises - Сторінка 007', url: 'https://cruises-world.lovable.app/page007', tags: ['prelanding', 'page007'] },
    { name: 'inCruises - Сторінка 008', url: 'https://cruises-world.lovable.app/page008', tags: ['prelanding', 'page008'] },
    { name: 'inCruises - Сторінка 009', url: 'https://cruises-world.lovable.app/page009', tags: ['prelanding', 'page009'] },
    { name: 'inCruises - Сторінка 010', url: 'https://cruises-world.lovable.app/page010', tags: ['prelanding', 'page010'] },
    { name: 'inCruises - Сторінка 011', url: 'https://cruises-world.lovable.app/page011', tags: ['prelanding', 'page011'] },
    { name: 'inCruises - Сторінка 012', url: 'https://cruises-world.lovable.app/page012', tags: ['prelanding', 'page012'] },
    { name: 'inCruises - Сторінка 013', url: 'https://cruises-world.lovable.app/page013', tags: ['prelanding', 'page013'] },
    { name: 'inCruises - Сторінка 014', url: 'https://cruises-world.lovable.app/page014', tags: ['prelanding', 'page014'] },
    { name: 'inCruises - Сторінка 015', url: 'https://cruises-world.lovable.app/page015', tags: ['prelanding', 'page015'] },
    { name: 'inCruises - Сторінка 016', url: 'https://cruises-world.lovable.app/page016', tags: ['prelanding', 'page016'] },
    { name: 'inCruises - Сторінка 017', url: 'https://cruises-world.lovable.app/page017', tags: ['prelanding', 'page017'] },
    { name: 'inCruises - Сторінка 018', url: 'https://cruises-world.lovable.app/page018', tags: ['prelanding', 'page018'] },
    { name: 'inCruises - Сторінка 019', url: 'https://cruises-world.lovable.app/page019', tags: ['prelanding', 'page019'] },
    { name: 'inCruises - Сторінка 020', url: 'https://cruises-world.lovable.app/page020', tags: ['prelanding', 'page020'] },
    { name: 'inCruises - Сторінка 021', url: 'https://cruises-world.lovable.app/page021', tags: ['prelanding', 'page021'] },
    { name: 'inCruises - Сторінка 022', url: 'https://cruises-world.lovable.app/page022', tags: ['prelanding', 'page022'] },
    { name: 'inCruises - Сторінка 023', url: 'https://cruises-world.lovable.app/page023', tags: ['prelanding', 'page023'] },
    { name: 'inCruises - Сторінка 024', url: 'https://cruises-world.lovable.app/page024', tags: ['prelanding', 'page024'] },
    { name: 'inCruises - Сторінка 025', url: 'https://cruises-world.lovable.app/page025', tags: ['prelanding', 'page025'] },
    { name: 'inCruises - Сторінка 026', url: 'https://cruises-world.lovable.app/page026', tags: ['prelanding', 'page026'] },
    { name: 'inCruises - Сторінка 027', url: 'https://cruises-world.lovable.app/page027', tags: ['prelanding', 'page027'] },
    { name: 'inCruises - Сторінка 028', url: 'https://cruises-world.lovable.app/page028', tags: ['prelanding', 'page028'] },
    { name: 'inCruises - Сторінка 029', url: 'https://cruises-world.lovable.app/page029', tags: ['prelanding', 'page029'] },
    { name: 'inCruises - Сторінка 030', url: 'https://cruises-world.lovable.app/page030', tags: ['prelanding', 'page030'] }
  ]

  // Створюємо лендинги
  const landingLinks = [
    {
      name: 'Знижки на круїзи',
      url: 'https://cruise-launchpad-pro.lovable.app/cruise-sale',
      tags: ['landing', 'sale', 'discounts']
    },
    {
      name: 'Запуск бізнесу',
      url: 'https://cruise-launchpad-pro.lovable.app/biz-start',
      tags: ['landing', 'business', 'startup']
    },
    {
      name: 'Преміум відпочинок',
      url: 'https://cruise-launchpad-pro.lovable.app/dream-cruise',
      tags: ['landing', 'premium', 'luxury']
    },
    {
      name: 'Заробіток на подорожах',
      url: 'https://cruise-launchpad-pro.lovable.app/earn-travel',
      tags: ['landing', 'earnings', 'travel']
    },
    {
      name: 'Партнерська програма',
      url: 'https://cruise-launchpad-pro.lovable.app/partner-program',
      tags: ['landing', 'affiliate', 'partnership']
    },
    {
      name: 'Доступні круїзи',
      url: 'https://cruise-launchpad-pro.lovable.app/affordable-cruise',
      tags: ['landing', 'affordable', 'budget']
    },
    {
      name: 'Реферальна система',
      url: 'https://cruise-launchpad-pro.lovable.app/tell-friends',
      tags: ['landing', 'referral', 'friends']
    },
    {
      name: 'Віддалена робота',
      url: 'https://cruise-launchpad-pro.lovable.app/work-rest',
      tags: ['landing', 'remote-work', 'lifestyle']
    },
    {
      name: 'Легальність, не піраміда',
      url: 'https://cruise-launchpad-pro.lovable.app/not-pyramid',
      tags: ['landing', 'legal', 'trust']
    },
    {
      name: 'Зміни в житті',
      url: 'https://cruise-launchpad-pro.lovable.app/change-life',
      tags: ['landing', 'lifestyle', 'transformation']
    }
  ]

  // Створюємо прелендинги з унікальними аккаунтами
  prelandingLinks.forEach((linkData, index) => {
    const link = OfferLinksService.createLink({
      offerId: inCruisesOffer.id,
      name: linkData.name,
      url: linkData.url,
      uniqueId: `incruises-prelanding-${index + 1}-${Date.now()}`,
      status: 'active',
      createdBy: 'user_1',
      accountId: `account_prelanding_${index + 1}`, // Унікальний аккаунт для кожного прелендингу
      notes: `Прелендинг ${index + 1} для inCruises - ${linkData.tags.join(', ')}`,
      tags: linkData.tags
    })
    console.log(`✅ Прелендинг ${index + 1} створений:`, link.name)
  })

  // Створюємо лендинги з унікальними аккаунтами
  landingLinks.forEach((linkData, index) => {
    const link = OfferLinksService.createLink({
      offerId: inCruisesOffer.id,
      name: linkData.name,
      url: linkData.url,
      uniqueId: `incruises-landing-${index + 1}-${Date.now()}`,
      status: 'active',
      createdBy: 'user_1',
      accountId: `account_landing_${index + 1}`, // Унікальний аккаунт для кожного лендингу
      notes: `Лендинг ${index + 1} для inCruises - ${linkData.tags.join(', ')}`,
      tags: linkData.tags
    })
    console.log(`✅ Лендинг ${index + 1} створений:`, link.name)
  })

  console.log('🎉 Всі дані офферів успішно створені!')
  console.log(`📊 Створено: ${prelandingLinks.length} прелендингів + ${landingLinks.length} лендингів = ${prelandingLinks.length + landingLinks.length} посилань`)
} 