import { AirtableService, TABLES, FIELD_NAMES } from './airtable'

export interface Card {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  balance: number
  currency: string
  status: 'active' | 'blocked' | 'expired' | 'low_balance'
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover'
  bank: string
  linkedOffers: string[]
  linkedExpenses: string[]
  aiEvaluation: string
  automations: string[]
  lastUsed: Date
  createdAt: Date
  updatedAt: Date
}

export interface Proxy {
  id: string
  ip: string
  port: number
  username: string
  password: string
  proxyType: 'http' | 'https' | 'socks4' | 'socks5'
  country: string
  city: string
  status: 'active' | 'inactive' | 'blocked' | 'testing'
  speed: number
  uptime: number
  lastTested: Date
  linkedOffers: string[]
  linkedExpenses: string[]
  monthlyCost: number
  provider: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface CardUsage {
  id: string
  cardId: string
  amount: number
  currency: string
  description: string
  date: Date
  linkedOffer?: string
  linkedProxy?: string
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
}

export interface ProxyUsage {
  id: string
  proxyId: string
  startTime: Date
  endTime?: Date
  dataUsed: number
  linkedOffer?: string
  linkedCard?: string
  status: 'active' | 'completed' | 'failed'
  notes?: string
}

class CardsService {
  private static instance: CardsService

  static getInstance(): CardsService {
    if (!CardsService.instance) {
      CardsService.instance = new CardsService()
    }
    return CardsService.instance
  }

  // === КАРТИ ===

  // Отримання всіх карт
  async getAllCards(): Promise<Card[]> {
    try {
      const records = await AirtableService.getAllRecords(TABLES.CARDS)
      
      return records.map(record => ({
        id: record.id,
        cardNumber: record.fields[FIELD_NAMES.CARD_NUMBER] || '',
        cardHolder: record.fields['Card Holder'] || '',
        expiryDate: record.fields['Expiry Date'] || '',
        cvv: record.fields['CVV'] || '',
        balance: record.fields[FIELD_NAMES.BALANCE] || 0,
        currency: record.fields['Currency'] || 'USD',
        status: record.fields[FIELD_NAMES.CARD_STATUS] || 'active',
        cardType: record.fields['Card Type'] || 'visa',
        bank: record.fields['Bank'] || '',
        linkedOffers: record.fields[FIELD_NAMES.LINKED_OFFER_CARD] || [],
        linkedExpenses: record.fields[FIELD_NAMES.LINKED_EXPENSE_CARD] || [],
        aiEvaluation: record.fields[FIELD_NAMES.AI_EVALUATION] || '',
        automations: record.fields[FIELD_NAMES.AUTOMATIONS] || [],
        lastUsed: record.fields['Last Used'] ? new Date(record.fields['Last Used']) : new Date(record.createdTime),
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }))
    } catch (error) {
      console.error('Error getting all cards:', error)
      throw error
    }
  }

  // Отримання карти за ID
  async getCardById(id: string): Promise<Card | null> {
    try {
      const record = await AirtableService.getRecord(TABLES.CARDS, id)
      if (!record) return null

      return {
        id: record.id,
        cardNumber: record.fields[FIELD_NAMES.CARD_NUMBER] || '',
        cardHolder: record.fields['Card Holder'] || '',
        expiryDate: record.fields['Expiry Date'] || '',
        cvv: record.fields['CVV'] || '',
        balance: record.fields[FIELD_NAMES.BALANCE] || 0,
        currency: record.fields['Currency'] || 'USD',
        status: record.fields[FIELD_NAMES.CARD_STATUS] || 'active',
        cardType: record.fields['Card Type'] || 'visa',
        bank: record.fields['Bank'] || '',
        linkedOffers: record.fields[FIELD_NAMES.LINKED_OFFER_CARD] || [],
        linkedExpenses: record.fields[FIELD_NAMES.LINKED_EXPENSE_CARD] || [],
        aiEvaluation: record.fields[FIELD_NAMES.AI_EVALUATION] || '',
        automations: record.fields[FIELD_NAMES.AUTOMATIONS] || [],
        lastUsed: record.fields['Last Used'] ? new Date(record.fields['Last Used']) : new Date(record.createdTime),
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }
    } catch (error) {
      console.error('Error getting card by ID:', error)
      throw error
    }
  }

  // Створення нової карти
  async createCard(data: {
    cardNumber: string
    cardHolder: string
    expiryDate: string
    cvv: string
    balance: number
    currency?: string
    cardType?: Card['cardType']
    bank?: string
  }): Promise<Card> {
    try {
      const record = await AirtableService.createRecord(TABLES.CARDS, {
        [FIELD_NAMES.CARD_NUMBER]: data.cardNumber,
        'Card Holder': data.cardHolder,
        'Expiry Date': data.expiryDate,
        'CVV': data.cvv,
        [FIELD_NAMES.BALANCE]: data.balance,
        'Currency': data.currency || 'USD',
        [FIELD_NAMES.CARD_STATUS]: 'active',
        'Card Type': data.cardType || 'visa',
        'Bank': data.bank || '',
        [FIELD_NAMES.LINKED_OFFER_CARD]: [],
        [FIELD_NAMES.LINKED_EXPENSE_CARD]: [],
        [FIELD_NAMES.AI_EVALUATION]: '',
        [FIELD_NAMES.AUTOMATIONS]: [],
        'Last Used': new Date().toISOString()
      })

      return {
        id: record.id,
        cardNumber: data.cardNumber,
        cardHolder: data.cardHolder,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        balance: data.balance,
        currency: data.currency || 'USD',
        status: 'active',
        cardType: data.cardType || 'visa',
        bank: data.bank || '',
        linkedOffers: [],
        linkedExpenses: [],
        aiEvaluation: '',
        automations: [],
        lastUsed: new Date(),
        createdAt: new Date(record.createdTime),
        updatedAt: new Date(record.createdTime)
      }
    } catch (error) {
      console.error('Error creating card:', error)
      throw error
    }
  }

  // Оновлення карти
  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    try {
      const updateData: Record<string, any> = {}
      
      if (updates.cardNumber) updateData[FIELD_NAMES.CARD_NUMBER] = updates.cardNumber
      if (updates.cardHolder) updateData['Card Holder'] = updates.cardHolder
      if (updates.expiryDate) updateData['Expiry Date'] = updates.expiryDate
      if (updates.cvv) updateData['CVV'] = updates.cvv
      if (updates.balance !== undefined) updateData[FIELD_NAMES.BALANCE] = updates.balance
      if (updates.currency) updateData['Currency'] = updates.currency
      if (updates.status) updateData[FIELD_NAMES.CARD_STATUS] = updates.status
      if (updates.cardType) updateData['Card Type'] = updates.cardType
      if (updates.bank) updateData['Bank'] = updates.bank
      if (updates.aiEvaluation) updateData[FIELD_NAMES.AI_EVALUATION] = updates.aiEvaluation
      if (updates.automations) updateData[FIELD_NAMES.AUTOMATIONS] = updates.automations
      if (updates.lastUsed) updateData['Last Used'] = updates.lastUsed.toISOString()

      updateData['Updated At'] = new Date().toISOString()

      const record = await AirtableService.updateRecord(TABLES.CARDS, id, updateData)

      return await this.getCardById(id) as Card
    } catch (error) {
      console.error('Error updating card:', error)
      throw error
    }
  }

  // Видалення карти
  async deleteCard(id: string): Promise<boolean> {
    try {
      return await AirtableService.deleteRecord(TABLES.CARDS, id)
    } catch (error) {
      console.error('Error deleting card:', error)
      throw error
    }
  }

  // Отримання карт за статусом
  async getCardsByStatus(status: Card['status']): Promise<Card[]> {
    try {
      const records = await AirtableService.findRecords(
        TABLES.CARDS,
        `{${FIELD_NAMES.CARD_STATUS}} = '${status}'`
      )

      return records.map(record => ({
        id: record.id,
        cardNumber: record.fields[FIELD_NAMES.CARD_NUMBER] || '',
        cardHolder: record.fields['Card Holder'] || '',
        expiryDate: record.fields['Expiry Date'] || '',
        cvv: record.fields['CVV'] || '',
        balance: record.fields[FIELD_NAMES.BALANCE] || 0,
        currency: record.fields['Currency'] || 'USD',
        status: record.fields[FIELD_NAMES.CARD_STATUS] || 'active',
        cardType: record.fields['Card Type'] || 'visa',
        bank: record.fields['Bank'] || '',
        linkedOffers: record.fields[FIELD_NAMES.LINKED_OFFER_CARD] || [],
        linkedExpenses: record.fields[FIELD_NAMES.LINKED_EXPENSE_CARD] || [],
        aiEvaluation: record.fields[FIELD_NAMES.AI_EVALUATION] || '',
        automations: record.fields[FIELD_NAMES.AUTOMATIONS] || [],
        lastUsed: record.fields['Last Used'] ? new Date(record.fields['Last Used']) : new Date(record.createdTime),
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }))
    } catch (error) {
      console.error('Error getting cards by status:', error)
      throw error
    }
  }

  // Отримання карт з низьким балансом
  async getCardsWithLowBalance(threshold: number = 100): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards()
      return allCards.filter(card => card.balance < threshold)
    } catch (error) {
      console.error('Error getting cards with low balance:', error)
      throw error
    }
  }

  // === ПРОКСІ ===

  // Отримання всіх проксі
  async getAllProxies(): Promise<Proxy[]> {
    try {
      const records = await AirtableService.getAllRecords(TABLES.PROXIES)
      
      return records.map(record => ({
        id: record.id,
        ip: record.fields['IP Address'] || '',
        port: record.fields['Port'] || 0,
        username: record.fields['Username'] || '',
        password: record.fields['Password'] || '',
        proxyType: record.fields['Proxy Type'] || 'http',
        country: record.fields['Country'] || '',
        city: record.fields['City'] || '',
        status: record.fields['Proxy Status'] || 'active',
        speed: record.fields['Speed'] || 0,
        uptime: record.fields['Uptime'] || 0,
        lastTested: record.fields['Last Tested'] ? new Date(record.fields['Last Tested']) : new Date(record.createdTime),
        linkedOffers: record.fields['Linked Offers'] || [],
        linkedExpenses: record.fields['Linked Expenses'] || [],
        monthlyCost: record.fields['Monthly Cost'] || 0,
        provider: record.fields['Provider'] || '',
        notes: record.fields['Notes'] || '',
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }))
    } catch (error) {
      console.error('Error getting all proxies:', error)
      throw error
    }
  }

  // Отримання проксі за ID
  async getProxyById(id: string): Promise<Proxy | null> {
    try {
      const record = await AirtableService.getRecord(TABLES.PROXIES, id)
      if (!record) return null

      return {
        id: record.id,
        ip: record.fields['IP Address'] || '',
        port: record.fields['Port'] || 0,
        username: record.fields['Username'] || '',
        password: record.fields['Password'] || '',
        proxyType: record.fields['Proxy Type'] || 'http',
        country: record.fields['Country'] || '',
        city: record.fields['City'] || '',
        status: record.fields['Proxy Status'] || 'active',
        speed: record.fields['Speed'] || 0,
        uptime: record.fields['Uptime'] || 0,
        lastTested: record.fields['Last Tested'] ? new Date(record.fields['Last Tested']) : new Date(record.createdTime),
        linkedOffers: record.fields['Linked Offers'] || [],
        linkedExpenses: record.fields['Linked Expenses'] || [],
        monthlyCost: record.fields['Monthly Cost'] || 0,
        provider: record.fields['Provider'] || '',
        notes: record.fields['Notes'] || '',
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }
    } catch (error) {
      console.error('Error getting proxy by ID:', error)
      throw error
    }
  }

  // Створення нового проксі
  async createProxy(data: {
    ip: string
    port: number
    username: string
    password: string
    proxyType: Proxy['proxyType']
    country?: string
    city?: string
    provider?: string
    monthlyCost?: number
    notes?: string
  }): Promise<Proxy> {
    try {
      const record = await AirtableService.createRecord(TABLES.PROXIES, {
        'IP Address': data.ip,
        'Port': data.port,
        'Username': data.username,
        'Password': data.password,
        'Proxy Type': data.proxyType,
        'Country': data.country || '',
        'City': data.city || '',
        'Proxy Status': 'active',
        'Speed': 0,
        'Uptime': 0,
        'Last Tested': new Date().toISOString(),
        'Linked Offers': [],
        'Linked Expenses': [],
        'Monthly Cost': data.monthlyCost || 0,
        'Provider': data.provider || '',
        'Notes': data.notes || ''
      })

      return {
        id: record.id,
        ip: data.ip,
        port: data.port,
        username: data.username,
        password: data.password,
        proxyType: data.proxyType,
        country: data.country || '',
        city: data.city || '',
        status: 'active',
        speed: 0,
        uptime: 0,
        lastTested: new Date(),
        linkedOffers: [],
        linkedExpenses: [],
        monthlyCost: data.monthlyCost || 0,
        provider: data.provider || '',
        notes: data.notes || '',
        createdAt: new Date(record.createdTime),
        updatedAt: new Date(record.createdTime)
      }
    } catch (error) {
      console.error('Error creating proxy:', error)
      throw error
    }
  }

  // Оновлення проксі
  async updateProxy(id: string, updates: Partial<Proxy>): Promise<Proxy> {
    try {
      const updateData: Record<string, any> = {}
      
      if (updates.ip) updateData['IP Address'] = updates.ip
      if (updates.port) updateData['Port'] = updates.port
      if (updates.username) updateData['Username'] = updates.username
      if (updates.password) updateData['Password'] = updates.password
      if (updates.proxyType) updateData['Proxy Type'] = updates.proxyType
      if (updates.country) updateData['Country'] = updates.country
      if (updates.city) updateData['City'] = updates.city
      if (updates.status) updateData['Proxy Status'] = updates.status
      if (updates.speed !== undefined) updateData['Speed'] = updates.speed
      if (updates.uptime !== undefined) updateData['Uptime'] = updates.uptime
      if (updates.lastTested) updateData['Last Tested'] = updates.lastTested.toISOString()
      if (updates.monthlyCost !== undefined) updateData['Monthly Cost'] = updates.monthlyCost
      if (updates.provider) updateData['Provider'] = updates.provider
      if (updates.notes) updateData['Notes'] = updates.notes

      updateData['Updated At'] = new Date().toISOString()

      const record = await AirtableService.updateRecord(TABLES.PROXIES, id, updateData)

      return await this.getProxyById(id) as Proxy
    } catch (error) {
      console.error('Error updating proxy:', error)
      throw error
    }
  }

  // Видалення проксі
  async deleteProxy(id: string): Promise<boolean> {
    try {
      return await AirtableService.deleteRecord(TABLES.PROXIES, id)
    } catch (error) {
      console.error('Error deleting proxy:', error)
      throw error
    }
  }

  // Отримання проксі за статусом
  async getProxiesByStatus(status: Proxy['status']): Promise<Proxy[]> {
    try {
      const records = await AirtableService.findRecords(
        TABLES.PROXIES,
        `{Proxy Status} = '${status}'`
      )

      return records.map(record => ({
        id: record.id,
        ip: record.fields['IP Address'] || '',
        port: record.fields['Port'] || 0,
        username: record.fields['Username'] || '',
        password: record.fields['Password'] || '',
        proxyType: record.fields['Proxy Type'] || 'http',
        country: record.fields['Country'] || '',
        city: record.fields['City'] || '',
        status: record.fields['Proxy Status'] || 'active',
        speed: record.fields['Speed'] || 0,
        uptime: record.fields['Uptime'] || 0,
        lastTested: record.fields['Last Tested'] ? new Date(record.fields['Last Tested']) : new Date(record.createdTime),
        linkedOffers: record.fields['Linked Offers'] || [],
        linkedExpenses: record.fields['Linked Expenses'] || [],
        monthlyCost: record.fields['Monthly Cost'] || 0,
        provider: record.fields['Provider'] || '',
        notes: record.fields['Notes'] || '',
        createdAt: new Date(record.createdTime),
        updatedAt: record.fields['Updated At'] ? new Date(record.fields['Updated At']) : new Date(record.createdTime)
      }))
    } catch (error) {
      console.error('Error getting proxies by status:', error)
      throw error
    }
  }

  // Тестування проксі
  async testProxy(id: string): Promise<{ success: boolean; speed?: number; error?: string }> {
    try {
      const proxy = await this.getProxyById(id)
      if (!proxy) {
        throw new Error('Proxy not found')
      }

      // Симуляція тестування проксі
      const testResult = {
        success: Math.random() > 0.3, // 70% успішність
        speed: Math.floor(Math.random() * 1000) + 100, // 100-1100 ms
        error: undefined as string | undefined
      }

      if (!testResult.success) {
        testResult.error = 'Connection timeout'
      }

      // Оновлюємо статус проксі
      await this.updateProxy(id, {
        status: testResult.success ? 'active' : 'blocked',
        speed: testResult.speed,
        lastTested: new Date()
      })

      return testResult
    } catch (error) {
      console.error('Error testing proxy:', error)
      throw error
    }
  }

  // === ВИКОРИСТАННЯ ===

  // Запис використання карти
  async recordCardUsage(data: {
    cardId: string
    amount: number
    currency: string
    description: string
    linkedOffer?: string
    linkedProxy?: string
  }): Promise<CardUsage> {
    try {
      const record = await AirtableService.createRecord('Card Usage', {
        'Card ID': data.cardId,
        'Amount': data.amount,
        'Currency': data.currency,
        'Description': data.description,
        'Date': new Date().toISOString(),
        'Linked Offer': data.linkedOffer || '',
        'Linked Proxy': data.linkedProxy || '',
        'Status': 'completed',
        'Transaction ID': `TXN_${Date.now()}`
      })

      // Оновлюємо баланс карти
      const card = await this.getCardById(data.cardId)
      if (card) {
        await this.updateCard(data.cardId, {
          balance: card.balance - data.amount,
          lastUsed: new Date()
        })
      }

      return {
        id: record.id,
        cardId: data.cardId,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        date: new Date(),
        linkedOffer: data.linkedOffer,
        linkedProxy: data.linkedProxy,
        status: 'completed',
        transactionId: `TXN_${Date.now()}`
      }
    } catch (error) {
      console.error('Error recording card usage:', error)
      throw error
    }
  }

  // Запис використання проксі
  async recordProxyUsage(data: {
    proxyId: string
    dataUsed: number
    linkedOffer?: string
    linkedCard?: string
    notes?: string
  }): Promise<ProxyUsage> {
    try {
      const record = await AirtableService.createRecord('Proxy Usage', {
        'Proxy ID': data.proxyId,
        'Start Time': new Date().toISOString(),
        'Data Used': data.dataUsed,
        'Linked Offer': data.linkedOffer || '',
        'Linked Card': data.linkedCard || '',
        'Status': 'active',
        'Notes': data.notes || ''
      })

      return {
        id: record.id,
        proxyId: data.proxyId,
        startTime: new Date(),
        dataUsed: data.dataUsed,
        linkedOffer: data.linkedOffer,
        linkedCard: data.linkedCard,
        status: 'active',
        notes: data.notes
      }
    } catch (error) {
      console.error('Error recording proxy usage:', error)
      throw error
    }
  }

  // === АНАЛІТИКА ===

  // Отримання статистики карт
  async getCardStats(): Promise<{
    total: number
    active: number
    blocked: number
    lowBalance: number
    totalBalance: number
    averageBalance: number
  }> {
    try {
      const cards = await this.getAllCards()
      
      const stats = {
        total: cards.length,
        active: cards.filter(c => c.status === 'active').length,
        blocked: cards.filter(c => c.status === 'blocked').length,
        lowBalance: cards.filter(c => c.balance < 100).length,
        totalBalance: cards.reduce((sum, c) => sum + c.balance, 0),
        averageBalance: cards.length > 0 ? cards.reduce((sum, c) => sum + c.balance, 0) / cards.length : 0
      }

      return stats
    } catch (error) {
      console.error('Error getting card stats:', error)
      throw error
    }
  }

  // Отримання статистики проксі
  async getProxyStats(): Promise<{
    total: number
    active: number
    inactive: number
    blocked: number
    totalCost: number
    averageSpeed: number
  }> {
    try {
      const proxies = await this.getAllProxies()
      
      const stats = {
        total: proxies.length,
        active: proxies.filter(p => p.status === 'active').length,
        inactive: proxies.filter(p => p.status === 'inactive').length,
        blocked: proxies.filter(p => p.status === 'blocked').length,
        totalCost: proxies.reduce((sum, p) => sum + p.monthlyCost, 0),
        averageSpeed: proxies.length > 0 ? proxies.reduce((sum, p) => sum + p.speed, 0) / proxies.length : 0
      }

      return stats
    } catch (error) {
      console.error('Error getting proxy stats:', error)
      throw error
    }
  }
}

export default CardsService.getInstance() 