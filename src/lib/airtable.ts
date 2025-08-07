import Airtable from 'airtable'

// Конфігурація Airtable
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || 'patR0YRacAA6i5hns.d3e5abcc560a9f64265f6ec6b925529d16f3d41c0034110b6a048ee0bfb58f66'
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || 'app5OIIDRHnpG7rXt'

// Ініціалізація Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

// Назви таблиць
export const TABLES = {
  ACCOUNTS: 'Accounts',
  CAMPAIGNS: 'Campaigns', // Додано
  OFFERS: 'Offers',
  EXPENSES: 'Expenses',
  CARDS: 'Cards',
  PROXIES: 'Proxies',
  TEAM: 'Team Members',
  TESTS: 'Tests',
  AUTOMATIONS: 'Automations',
} as const

// Уніфіковані назви полів для всіх таблиць
export const FIELD_NAMES = {
  // Загальні поля
  ID: 'id',
  NAME: 'Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  STATUS: 'Status',
  CREATED_TIME: 'createdTime',
  UPDATED_TIME: 'updatedTime',
  
  // Поля для Accounts
  ACCOUNT_ID: 'Account ID',
  PLATFORM: 'Platform',
  ACCOUNT_STATUS: 'Account Status',
  CATEGORY: 'Category',
  FARMER_ID: 'Farmer ID',
  COMMENTS: 'Comments',
  PRIORITY: 'Priority',
  TAGS: 'Tags',
  
  // Поля для Offers
  VERTICAL: 'Vertical',
  SOURCE: 'Source',
  RATE: 'Rate',
  REVENUE: 'Revenue',
  EXPENSES: 'Expenses',
  ROI: 'ROI',
  PERIOD: 'Period',
  OFFER_STATUS: 'Status',
  
  // Поля для Expenses
  EXPENSE_TYPE: 'Expense Type',
  AMOUNT: 'Amount',
  LINKED_OFFER: 'Linked Offer',
  LINKED_CARD: 'Linked Card',
  LINKED_PROXY: 'Linked Proxy',
  DATE: 'Date',
  DESCRIPTION: 'Description',
  
  // Поля для Team Members
  ROLE: 'Role',
  JOIN_DATE: 'Join Date',
  PERMISSIONS: 'Permissions',
  
  // Поля для Cards
  CARD_NUMBER: 'Card Number',
  BALANCE: 'Balance',
  CARD_STATUS: 'Status',
  LINKED_OFFER_CARD: 'Linked Offer',
  LINKED_EXPENSE_CARD: 'Linked Expense',
  AI_EVALUATION: 'AI Evaluation',
  AUTOMATIONS: 'Automations',
  
  // Поля для Campaigns (додано)
  BUDGET: 'Budget',
  SPENT: 'Spent',
  CLICKS: 'Clicks',
  CONVERSIONS: 'Conversions',
  START_DATE: 'Start Date',
  LAUNCHER: 'Launcher',
  LINKED_ACCOUNT: 'Account',
} as const

// Типи для Airtable записів
export interface AirtableRecord {
  id: string
  fields: Record<string, any>
  createdTime: string
}

export interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

// Базові функції для роботи з Airtable
export class AirtableService {
  // Отримання всіх записів з таблиці
  static async getAllRecords(tableName: string): Promise<AirtableRecord[]> {
    try {
      const records: AirtableRecord[] = []
      
      await base(tableName).select({
        view: 'Grid view',
      }).eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          fields: record.fields,
          createdTime: record._rawJson.createdTime,
        })))
        fetchNextPage()
      })
      
      return records
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error)
      throw error
    }
  }

  // Отримання одного запису за ID
  static async getRecord(tableName: string, recordId: string): Promise<AirtableRecord | null> {
    try {
      const record = await base(tableName).find(recordId)
      return {
        id: record.id,
        fields: record.fields,
        createdTime: record._rawJson.createdTime,
      }
    } catch (error) {
      console.error(`Error fetching record ${recordId} from ${tableName}:`, error)
      return null
    }
  }

  // Створення нового запису
  static async createRecord(tableName: string, fields: Record<string, any>): Promise<AirtableRecord> {
    try {
      const record = await base(tableName).create([
        { fields }
      ])
      
      return {
        id: record[0].id,
        fields: record[0].fields,
        createdTime: record[0]._rawJson.createdTime,
      }
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error)
      throw error
    }
  }

  // Оновлення запису
  static async updateRecord(tableName: string, recordId: string, fields: Record<string, any>): Promise<AirtableRecord> {
    try {
      const record = await base(tableName).update([
        { id: recordId, fields }
      ])
      
      return {
        id: record[0].id,
        fields: record[0].fields,
        createdTime: record[0]._rawJson.createdTime,
      }
    } catch (error) {
      console.error(`Error updating record ${recordId} in ${tableName}:`, error)
      throw error
    }
  }

  // Видалення запису
  static async deleteRecord(tableName: string, recordId: string): Promise<boolean> {
    try {
      await base(tableName).destroy(recordId)
      return true
    } catch (error) {
      console.error(`Error deleting record ${recordId} from ${tableName}:`, error)
      return false
    }
  }

  // Пошук записів за формулою
  static async findRecords(tableName: string, filterFormula: string): Promise<AirtableRecord[]> {
    try {
      const records: AirtableRecord[] = []
      
      await base(tableName).select({
        filterByFormula: filterFormula,
        view: 'Grid view',
      }).eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          fields: record.fields,
          createdTime: record._rawJson.createdTime,
        })))
        fetchNextPage()
      })
      
      return records
    } catch (error) {
      console.error(`Error finding records in ${tableName}:`, error)
      throw error
    }
  }

  // Отримання записів з сортуванням
  static async getRecordsSorted(tableName: string, sortField: string, sortDirection: 'asc' | 'desc' = 'asc'): Promise<AirtableRecord[]> {
    try {
      const records: AirtableRecord[] = []
      
      await base(tableName).select({
        sort: [{ field: sortField, direction: sortDirection }],
        view: 'Grid view',
      }).eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          fields: record.fields,
          createdTime: record._rawJson.createdTime,
        })))
        fetchNextPage()
      })
      
      return records
    } catch (error) {
      console.error(`Error fetching sorted records from ${tableName}:`, error)
      throw error
    }
  }
}

// Специфічні функції для роботи з аккаунтами
export class AccountsService {
  static async getAllAccounts() {
    return AirtableService.getAllRecords(TABLES.ACCOUNTS)
  }

  static async getAccountById(id: string) {
    return AirtableService.getRecord(TABLES.ACCOUNTS, id)
  }

  static async createAccount(accountData: {
    name: string
    email: string
    phone: string
    platform: string
    status: string
    category: string
    farmerId: string
    comments?: string
    priority?: string
    tags?: string[]
  }) {
    return AirtableService.createRecord(TABLES.ACCOUNTS, {
      [FIELD_NAMES.NAME]: accountData.name,
      [FIELD_NAMES.EMAIL]: accountData.email,
      [FIELD_NAMES.PHONE]: accountData.phone,
      [FIELD_NAMES.PLATFORM]: accountData.platform,
      [FIELD_NAMES.ACCOUNT_STATUS]: accountData.status,
      [FIELD_NAMES.CATEGORY]: accountData.category,
      [FIELD_NAMES.FARMER_ID]: accountData.farmerId,
      [FIELD_NAMES.COMMENTS]: accountData.comments || '',
      [FIELD_NAMES.PRIORITY]: accountData.priority || 'medium',
      [FIELD_NAMES.TAGS]: accountData.tags || [],
    })
  }

  static async updateAccount(id: string, accountData: Partial<{
    name: string
    email: string
    phone: string
    platform: string
    status: string
    category: string
    farmerId: string
    comments: string
    priority: string
    tags: string[]
  }>) {
    const fields: Record<string, any> = {}
    if (accountData.name) fields[FIELD_NAMES.NAME] = accountData.name
    if (accountData.email) fields[FIELD_NAMES.EMAIL] = accountData.email
    if (accountData.phone) fields[FIELD_NAMES.PHONE] = accountData.phone
    if (accountData.platform) fields[FIELD_NAMES.PLATFORM] = accountData.platform
    if (accountData.status) fields[FIELD_NAMES.ACCOUNT_STATUS] = accountData.status
    if (accountData.category) fields[FIELD_NAMES.CATEGORY] = accountData.category
    if (accountData.farmerId) fields[FIELD_NAMES.FARMER_ID] = accountData.farmerId
    if (accountData.comments !== undefined) fields[FIELD_NAMES.COMMENTS] = accountData.comments
    if (accountData.priority) fields[FIELD_NAMES.PRIORITY] = accountData.priority
    if (accountData.tags) fields[FIELD_NAMES.TAGS] = accountData.tags

    return AirtableService.updateRecord(TABLES.ACCOUNTS, id, fields)
  }

  static async deleteAccount(id: string) {
    return AirtableService.deleteRecord(TABLES.ACCOUNTS, id)
  }

  static async getAccountsByStatus(status: string) {
    return AirtableService.findRecords(TABLES.ACCOUNTS, `{${FIELD_NAMES.ACCOUNT_STATUS}} = '${status}'`)
  }

  static async getAccountsByPlatform(platform: string) {
    return AirtableService.findRecords(TABLES.ACCOUNTS, `{${FIELD_NAMES.PLATFORM}} = '${platform}'`)
  }

  static async getAccountsByFarmer(farmerId: string) {
    return AirtableService.findRecords(TABLES.ACCOUNTS, `{${FIELD_NAMES.FARMER_ID}} = '${farmerId}'`)
  }
}

// Специфічні функції для роботи з офферами
export class OffersService {
  static async getAllOffers() {
    return AirtableService.getAllRecords(TABLES.OFFERS)
  }

  static async getOfferById(id: string) {
    return AirtableService.getRecord(TABLES.OFFERS, id)
  }

  static async createOffer(offerData: {
    name: string
    vertical: string
    source: string
    rate: number
    revenue: number
    expenses: number
    roi: number
    period: string
    status?: string
  }) {
    return AirtableService.createRecord(TABLES.OFFERS, {
      [FIELD_NAMES.NAME]: offerData.name,
      [FIELD_NAMES.VERTICAL]: offerData.vertical,
      [FIELD_NAMES.SOURCE]: offerData.source,
      [FIELD_NAMES.RATE]: offerData.rate,
      [FIELD_NAMES.REVENUE]: offerData.revenue,
      [FIELD_NAMES.EXPENSES]: offerData.expenses,
      [FIELD_NAMES.ROI]: offerData.roi,
      [FIELD_NAMES.PERIOD]: offerData.period,
      [FIELD_NAMES.OFFER_STATUS]: offerData.status || 'active',
    })
  }

  static async updateOffer(id: string, offerData: Partial<{
    name: string
    vertical: string
    source: string
    rate: number
    revenue: number
    expenses: number
    roi: number
    period: string
    status: string
  }>) {
    const fields: Record<string, any> = {}
    if (offerData.name) fields[FIELD_NAMES.NAME] = offerData.name
    if (offerData.vertical) fields[FIELD_NAMES.VERTICAL] = offerData.vertical
    if (offerData.source) fields[FIELD_NAMES.SOURCE] = offerData.source
    if (offerData.rate !== undefined) fields[FIELD_NAMES.RATE] = offerData.rate
    if (offerData.revenue !== undefined) fields[FIELD_NAMES.REVENUE] = offerData.revenue
    if (offerData.expenses !== undefined) fields[FIELD_NAMES.EXPENSES] = offerData.expenses
    if (offerData.roi !== undefined) fields[FIELD_NAMES.ROI] = offerData.roi
    if (offerData.period) fields[FIELD_NAMES.PERIOD] = offerData.period
    if (offerData.status) fields[FIELD_NAMES.OFFER_STATUS] = offerData.status

    return AirtableService.updateRecord(TABLES.OFFERS, id, fields)
  }

  static async deleteOffer(id: string) {
    return AirtableService.deleteRecord(TABLES.OFFERS, id)
  }

  static async getOffersByVertical(vertical: string) {
    return AirtableService.findRecords(TABLES.OFFERS, `{${FIELD_NAMES.VERTICAL}} = '${vertical}'`)
  }

  static async getOffersBySource(source: string) {
    return AirtableService.findRecords(TABLES.OFFERS, `{${FIELD_NAMES.SOURCE}} = '${source}'`)
  }

  static async getTopOffersByROI(limit: number = 10) {
    const offers = await AirtableService.getRecordsSorted(TABLES.OFFERS, FIELD_NAMES.ROI, 'desc')
    return offers.slice(0, limit)
  }

  static async getTopOffersByRevenue(limit: number = 10) {
    const offers = await AirtableService.getRecordsSorted(TABLES.OFFERS, FIELD_NAMES.REVENUE, 'desc')
    return offers.slice(0, limit)
  }
}

// Специфічні функції для роботи з витратами
export class ExpensesService {
  static async getAllExpenses() {
    return AirtableService.getAllRecords(TABLES.EXPENSES)
  }

  static async createExpense(expenseData: {
    name: string
    expenseType: string
    amount: number
    linkedOffer?: string
    linkedCard?: string
    linkedProxy?: string
    date?: string
    description?: string
  }) {
    return AirtableService.createRecord(TABLES.EXPENSES, {
      [FIELD_NAMES.NAME]: expenseData.name,
      [FIELD_NAMES.EXPENSE_TYPE]: expenseData.expenseType,
      [FIELD_NAMES.AMOUNT]: expenseData.amount,
      [FIELD_NAMES.LINKED_OFFER]: expenseData.linkedOffer || '',
      [FIELD_NAMES.LINKED_CARD]: expenseData.linkedCard || '',
      [FIELD_NAMES.LINKED_PROXY]: expenseData.linkedProxy || '',
      [FIELD_NAMES.DATE]: expenseData.date || new Date().toISOString().split('T')[0],
      [FIELD_NAMES.DESCRIPTION]: expenseData.description || '',
    })
  }

  static async updateExpense(id: string, expenseData: Partial<any>) {
    return AirtableService.updateRecord(TABLES.EXPENSES, id, expenseData)
  }

  static async deleteExpense(id: string) {
    return AirtableService.deleteRecord(TABLES.EXPENSES, id)
  }

  static async getExpensesByType(expenseType: string) {
    return AirtableService.findRecords(TABLES.EXPENSES, `{${FIELD_NAMES.EXPENSE_TYPE}} = '${expenseType}'`)
  }
}

// Специфічні функції для роботи з командою
export class TeamService {
  static async getAllTeamMembers() {
    return AirtableService.getAllRecords(TABLES.TEAM)
  }

  static async getTeamMemberById(id: string) {
    return AirtableService.getRecord(TABLES.TEAM, id)
  }

  static async createTeamMember(userData: any) {
    return AirtableService.createRecord(TABLES.TEAM, userData)
  }

  static async updateTeamMember(id: string, userData: any) {
    return AirtableService.updateRecord(TABLES.TEAM, id, userData)
  }

  static async deleteTeamMember(id: string) {
    return AirtableService.deleteRecord(TABLES.TEAM, id)
  }

  static async getTeamMembersByRole(role: string) {
    return AirtableService.findRecords(TABLES.TEAM, `{${FIELD_NAMES.ROLE}} = '${role}'`)
  }
}

// Специфічні функції для роботи з кампаніями
export class CampaignsService {
  static async getAllCampaigns() {
    return AirtableService.getAllRecords(TABLES.CAMPAIGNS);
  }

  static async getCampaignById(id: string) {
    return AirtableService.getRecord(TABLES.CAMPAIGNS, id);
  }

  static async createCampaign(campaignData: any) {
    return AirtableService.createRecord(TABLES.CAMPAIGNS, campaignData);
  }

  static async updateCampaign(id: string, campaignData: any) {
    return AirtableService.updateRecord(TABLES.CAMPAIGNS, id, campaignData);
  }

  static async deleteCampaign(id: string) {
    return AirtableService.deleteRecord(TABLES.CAMPAIGNS, id);
  }
}

// Новий сервіс для звітів та аналітики
export class ReportsService {
  // Отримання загальної статистики
  static async getOverallStats(startDate?: string, endDate?: string) {
    try {
      const [allAccounts, allOffers, allExpenses] = await Promise.all([
        AccountsService.getAllAccounts(),
        OffersService.getAllOffers(),
        ExpensesService.getAllExpenses()
      ]);

      const filterByDate = (records: AirtableRecord[], dateField: string, isCreatedTime: boolean = false) => {
        if (!startDate || !endDate) return records;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return records.filter(record => {
          const recordDateStr = isCreatedTime ? record.createdTime : record.fields[dateField];
          if (!recordDateStr) return false;
          const recordDate = new Date(recordDateStr);
          return recordDate >= start && recordDate <= end;
        });
      };

      const accounts = filterByDate(allAccounts, 'createdTime', true);
      const offers = filterByDate(allOffers, FIELD_NAMES.PERIOD);
      const expenses = filterByDate(allExpenses, FIELD_NAMES.DATE);

      const totalRevenue = offers.reduce((sum, offer) => sum + (offer.fields[FIELD_NAMES.REVENUE] || 0), 0);
      const totalExpenses = offers.reduce((sum, offer) => sum + (offer.fields[FIELD_NAMES.EXPENSES] || 0), 0);
      const totalProfit = totalRevenue - totalExpenses;
      const totalROI = totalExpenses > 0 ? ((totalRevenue - totalExpenses) / totalExpenses) * 100 : 0;

      const activeAccounts = accounts.filter(acc => acc.fields[FIELD_NAMES.ACCOUNT_STATUS] === 'active').length;
      const activeOffers = offers.filter(offer => offer.fields[FIELD_NAMES.OFFER_STATUS] === 'active').length;

      return {
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalROI,
        activeAccounts,
        activeOffers,
        totalAccounts: accounts.length,
        totalOffers: offers.length,
        totalExpensesAmount: expenses.reduce((sum, expense) => sum + (expense.fields[FIELD_NAMES.AMOUNT] || 0), 0)
      };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      throw error;
    }
  }

  // Отримання статистики за вертикалями
  static async getPlatformStats() {
    try {
      const offers = await OffersService.getAllOffers()
      
      const verticalStats = offers.reduce((acc, offer) => {
        const vertical = offer.fields[FIELD_NAMES.VERTICAL] || 'Unknown'
        if (!acc[vertical]) {
          acc[vertical] = {
            offers: 0,
            revenue: 0,
            expenses: 0,
            rate: 0
          }
        }
        acc[vertical].offers++
        acc[vertical].revenue += offer.fields[FIELD_NAMES.REVENUE] || 0
        acc[vertical].expenses += offer.fields[FIELD_NAMES.EXPENSES] || 0
        acc[vertical].rate += offer.fields[FIELD_NAMES.RATE] || 0
        return acc
      }, {} as Record<string, any>)

      // Додаємо ROI для кожної вертикалі
      Object.keys(verticalStats).forEach(vertical => {
        const stats = verticalStats[vertical]
        stats.roi = stats.expenses > 0 ? ((stats.revenue - stats.expenses) / stats.expenses) * 100 : 0
        stats.averageRate = stats.offers > 0 ? stats.rate / stats.offers : 0
        stats.profit = stats.revenue - stats.expenses
      })

      return verticalStats
    } catch (error) {
      console.error('Error getting vertical stats:', error)
      throw error
    }
  }

  // Отримання топ офферів за ROI
  static async getTopCampaignsByROI(limit: number = 10) {
    try {
      const offers = await OffersService.getTopOffersByROI(limit)
      return offers.map(offer => ({
        id: offer.id,
        name: offer.fields[FIELD_NAMES.NAME] || '',
        vertical: offer.fields[FIELD_NAMES.VERTICAL] || '',
        roi: offer.fields[FIELD_NAMES.ROI] || 0,
        revenue: offer.fields[FIELD_NAMES.REVENUE] || 0,
        expenses: offer.fields[FIELD_NAMES.EXPENSES] || 0,
        rate: offer.fields[FIELD_NAMES.RATE] || 0,
        source: offer.fields[FIELD_NAMES.SOURCE] || ''
      }))
    } catch (error) {
      console.error('Error getting top offers by ROI:', error)
      throw error
    }
  }

  // Отримання топ офферів за доходом
  static async getTopCampaignsByRevenue(limit: number = 10) {
    try {
      const offers = await OffersService.getTopOffersByRevenue(limit)
      return offers.map(offer => ({
        id: offer.id,
        name: offer.fields[FIELD_NAMES.NAME] || '',
        vertical: offer.fields[FIELD_NAMES.VERTICAL] || '',
        revenue: offer.fields[FIELD_NAMES.REVENUE] || 0,
        roi: offer.fields[FIELD_NAMES.ROI] || 0,
        expenses: offer.fields[FIELD_NAMES.EXPENSES] || 0,
        rate: offer.fields[FIELD_NAMES.RATE] || 0,
        source: offer.fields[FIELD_NAMES.SOURCE] || ''
      }))
    } catch (error) {
      console.error('Error getting top offers by revenue:', error)
      throw error
    }
  }

  // Отримання статистики аккаунтів
  static async getAccountStats() {
    try {
      const accounts = await AccountsService.getAllAccounts()
      
      const statusStats = accounts.reduce((acc, account) => {
        const status = account.fields[FIELD_NAMES.ACCOUNT_STATUS] || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const platformStats = accounts.reduce((acc, account) => {
        const platform = account.fields[FIELD_NAMES.PLATFORM] || 'Unknown'
        acc[platform] = (acc[platform] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const categoryStats = accounts.reduce((acc, account) => {
        const category = account.fields[FIELD_NAMES.CATEGORY] || 'general'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        total: accounts.length,
        statusStats,
        platformStats,
        categoryStats,
        activeAccounts: statusStats.active || 0,
        pendingAccounts: statusStats.pending || 0,
        suspendedAccounts: statusStats.suspended || 0
      }
    } catch (error) {
      console.error('Error getting account stats:', error)
      throw error
    }
  }

  // Отримання статистики за період
  static async getStatsByPeriod(startDate: string, endDate: string) {
    try {
      const offers = await OffersService.getAllOffers()
      
      // Фільтруємо оффери за датою періоду
      const filteredOffers = offers.filter(offer => {
        const periodField = offer.fields[FIELD_NAMES.PERIOD]
        if (!periodField) return false
        
        const offerDate = new Date(periodField)
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        return offerDate >= start && offerDate <= end
      })

      const totalRevenue = filteredOffers.reduce((sum, offer) => sum + (offer.fields[FIELD_NAMES.REVENUE] || 0), 0)
      const totalExpenses = filteredOffers.reduce((sum, offer) => sum + (offer.fields[FIELD_NAMES.EXPENSES] || 0), 0)
      const totalProfit = totalRevenue - totalExpenses
      const totalROI = totalExpenses > 0 ? ((totalRevenue - totalExpenses) / totalExpenses) * 100 : 0

      return {
        period: { startDate, endDate },
        offers: filteredOffers.length,
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalROI
      }
    } catch (error) {
      console.error('Error getting stats by period:', error)
      throw error
    }
  }

  // Отримання детальної статистики офферів
  static async getCampaignDetails() {
    try {
      const offers = await OffersService.getAllOffers()
      
      return offers.map(offer => ({
        id: offer.id,
        name: offer.fields[FIELD_NAMES.NAME] || '',
        vertical: offer.fields[FIELD_NAMES.VERTICAL] || '',
        source: offer.fields[FIELD_NAMES.SOURCE] || '',
        rate: offer.fields[FIELD_NAMES.RATE] || 0,
        revenue: offer.fields[FIELD_NAMES.REVENUE] || 0,
        expenses: offer.fields[FIELD_NAMES.EXPENSES] || 0,
        roi: offer.fields[FIELD_NAMES.ROI] || 0,
        period: offer.fields[FIELD_NAMES.PERIOD] || offer.createdTime,
        profit: (offer.fields[FIELD_NAMES.REVENUE] || 0) - (offer.fields[FIELD_NAMES.EXPENSES] || 0)
      }))
    } catch (error) {
      console.error('Error getting offer details:', error)
      throw error
    }
  }

  // Отримання статистики витрат
  static async getExpenseStats() {
    try {
      const expenses = await ExpensesService.getAllExpenses()
      
      const typeStats = expenses.reduce((acc, expense) => {
        const type = expense.fields[FIELD_NAMES.EXPENSE_TYPE] || 'Other'
        if (!acc[type]) {
          acc[type] = { count: 0, total: 0 }
        }
        acc[type].count++
        acc[type].total += expense.fields[FIELD_NAMES.AMOUNT] || 0
        return acc
      }, {} as Record<string, { count: number, total: number }>)

      const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.fields[FIELD_NAMES.AMOUNT] || 0), 0)
      const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

      return {
        total: totalExpenses,
        count: expenses.length,
        average: averageExpense,
        typeStats
      }
    } catch (error) {
      console.error('Error getting expense stats:', error)
      throw error
    }
  }

  // Отримання статистики команди
  static async getTeamStats() {
    try {
      const team = await TeamService.getAllTeamMembers()
      
      const roleStats = team.reduce((acc, member) => {
        const role = member.fields[FIELD_NAMES.ROLE] || 'Unknown'
        if (!acc[role]) {
          acc[role] = { count: 0, totalEarnings: 0 }
        }
        acc[role].count++
        acc[role].totalEarnings += member.fields.Earnings || 0
        return acc
      }, {} as Record<string, { count: number, totalEarnings: number }>)

      const totalEarnings = team.reduce((sum, member) => sum + (member.fields.Earnings || 0), 0)
      const averageEarnings = team.length > 0 ? totalEarnings / team.length : 0

      return {
        total: team.length,
        totalEarnings,
        averageEarnings,
        roleStats
      }
    } catch (error) {
      console.error('Error getting team stats:', error)
      throw error
    }
  }

  // Отримання статистики карт
  static async getCardStats() {
    try {
      const cards = await AirtableService.getAllRecords(TABLES.CARDS)
      
      const statusStats = cards.reduce((acc, card) => {
        const status = card.fields[FIELD_NAMES.CARD_STATUS] || 'Unknown'
        if (!acc[status]) {
          acc[status] = { count: 0, totalBalance: 0 }
        }
        acc[status].count++
        acc[status].totalBalance += card.fields[FIELD_NAMES.BALANCE] || 0
        return acc
      }, {} as Record<string, { count: number, totalBalance: number }>)

      const totalBalance = cards.reduce((sum, card) => sum + (card.fields[FIELD_NAMES.BALANCE] || 0), 0)
      const averageBalance = cards.length > 0 ? totalBalance / cards.length : 0

      return {
        total: cards.length,
        totalBalance,
        averageBalance,
        statusStats
      }
    } catch (error) {
      console.error('Error getting card stats:', error)
      throw error
    }
  }

  // Отримання статистики проксі
  static async getProxyStats() {
    try {
      const proxies = await AirtableService.getAllRecords(TABLES.PROXIES)
      
      const typeStats = proxies.reduce((acc, proxy) => {
        const type = proxy.fields['Proxy Type'] || 'Unknown'
        if (!acc[type]) {
          acc[type] = { count: 0, active: 0 }
        }
        acc[type].count++
        if (proxy.fields['Proxy Status'] === 'active') {
          acc[type].active++
        }
        return acc
      }, {} as Record<string, { count: number, active: number }>)

      const activeProxies = proxies.filter(proxy => proxy.fields['Proxy Status'] === 'active').length

      return {
        total: proxies.length,
        active: activeProxies,
        inactive: proxies.length - activeProxies,
        typeStats
      }
    } catch (error) {
      console.error('Error getting proxy stats:', error)
      throw error
    }
  }

  // Отримання статистики тестів
  static async getTestStats() {
    try {
      const tests = await AirtableService.getAllRecords(TABLES.TESTS)
      
      const resultStats = tests.reduce((acc, test) => {
        const result = test.fields['Test Result'] || 'Unknown'
        acc[result] = (acc[result] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const successRate = tests.length > 0 ? 
        ((resultStats.success || 0) / tests.length) * 100 : 0

      return {
        total: tests.length,
        successRate,
        resultStats
      }
    } catch (error) {
      console.error('Error getting test stats:', error)
      throw error
    }
  }

  // Отримання статистики автоматизацій
  static async getAutomationStats() {
    try {
      const automations = await AirtableService.getAllRecords(TABLES.AUTOMATIONS)
      
      const conditionStats = automations.reduce((acc, automation) => {
        const condition = automation.fields.Condition || 'Unknown'
        acc[condition] = (acc[condition] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const notificationStats = automations.reduce((acc, automation) => {
        const medium = automation.fields['Notification Medium'] || 'Unknown'
        acc[medium] = (acc[medium] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        total: automations.length,
        conditionStats,
        notificationStats
      }
    } catch (error) {
      console.error('Error getting automation stats:', error)
      throw error
    }
  }

  // Створення кастомного звіту
  static async createCustomReport(type: string, filters: any, customMetrics: any) {
    try {
      // Базова логіка для кастомних звітів
      const baseStats = await this.getOverallStats()
      
      return {
        type,
        filters,
        customMetrics,
        baseStats,
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error creating custom report:', error)
      throw error
    }
  }
}

// Утиліти для конвертації даних
export const convertAirtableToAppData = {
  // Конвертація аккаунта
  account: (airtableRecord: AirtableRecord) => ({
    id: airtableRecord.id,
    name: airtableRecord.fields['Account ID'] || '',
    email: airtableRecord.fields.Email || '',
    phone: airtableRecord.fields.Phone || '',
    platform: airtableRecord.fields.Platform || '',
    status: airtableRecord.fields['Account Status'] || 'pending',
    category: airtableRecord.fields.Category || 'general',
    farmerId: airtableRecord.fields['Linked Farmer']?.[0] || '',
    priority: airtableRecord.fields.Priority || 'medium',
    tags: airtableRecord.fields.Tags || [],
    comments: airtableRecord.fields.Comments || '',
    aiEvaluation: airtableRecord.fields['AI Performance Evaluation'] || '',
    automations: airtableRecord.fields.Automations || [],
    createdAt: new Date(airtableRecord.createdTime),
    updatedAt: airtableRecord.fields.UpdatedAt ? new Date(airtableRecord.fields.UpdatedAt) : new Date(airtableRecord.createdTime),
  }),

  // Конвертація кампанії
  campaign: (airtableRecord: AirtableRecord) => ({
    id: airtableRecord.id,
    name: airtableRecord.fields[FIELD_NAMES.NAME] || '',
    platform: airtableRecord.fields[FIELD_NAMES.PLATFORM] || '',
    status: airtableRecord.fields[FIELD_NAMES.STATUS] || 'pending',
    budget: airtableRecord.fields[FIELD_NAMES.BUDGET] || 0,
    spent: airtableRecord.fields[FIELD_NAMES.SPENT] || 0,
    revenue: airtableRecord.fields[FIELD_NAMES.REVENUE] || 0,
    clicks: airtableRecord.fields[FIELD_NAMES.CLICKS] || 0,
    conversions: airtableRecord.fields[FIELD_NAMES.CONVERSIONS] || 0,
    roi: airtableRecord.fields[FIELD_NAMES.ROI] || 0,
    offerId: airtableRecord.fields.OfferID || '', // Це поле може бути іншим
    accountId: airtableRecord.fields[FIELD_NAMES.LINKED_ACCOUNT]?.[0] || '',
    launcherId: airtableRecord.fields[FIELD_NAMES.LAUNCHER]?.[0] || '',
    startDate: airtableRecord.fields[FIELD_NAMES.START_DATE] ? new Date(airtableRecord.fields[FIELD_NAMES.START_DATE]) : new Date(airtableRecord.createdTime),
    createdAt: new Date(airtableRecord.createdTime),
    updatedAt: airtableRecord.fields.UpdatedAt ? new Date(airtableRecord.fields.UpdatedAt) : new Date(airtableRecord.createdTime),
  }),

  // Конвертація витрати
  expense: (airtableRecord: AirtableRecord) => ({
    id: airtableRecord.id,
    name: airtableRecord.fields.Name || '',
    description: airtableRecord.fields.Description || '',
    amount: airtableRecord.fields.Amount || 0,
    expenseType: airtableRecord.fields['Expense Type'] || '',
    linkedOffer: airtableRecord.fields['Linked Offer']?.[0] || '',
    linkedCard: airtableRecord.fields['Linked Card']?.[0] || '',
    linkedProxy: airtableRecord.fields['Linked Proxy']?.[0] || '',
    date: airtableRecord.fields.Date ? new Date(airtableRecord.fields.Date) : new Date(airtableRecord.createdTime),
    createdAt: new Date(airtableRecord.createdTime),
  }),
}

// Перевірка підключення до Airtable
export const checkAirtableConnection = async (): Promise<boolean> => {
  try {
    await AirtableService.getAllRecords(TABLES.ACCOUNTS)
    return true
  } catch (error) {
    console.error('Airtable connection failed:', error)
    return false
  }
}

export default AirtableService 