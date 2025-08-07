// Типи для системи браузерних профілів

export type BrowserType = 'desktop' | 'mobile' | 'vm' | 'emulator'
export type PlatformType = 'facebook' | 'google' | 'telegram'
export type OSType = 'windows' | 'macos' | 'linux' | 'ios' | 'android'
export type BrowserEngine = 'chrome' | 'firefox' | 'safari' | 'edge'
export type ProfileStatus = 'active' | 'inactive' | 'running' | 'stopped' | 'error' | 'maintenance'

// Браузерний профіль
export interface BrowserProfile {
  id: string
  name: string
  description?: string
  
  // Основна інформація
  platform: PlatformType
  browserType: BrowserType
  os: OSType
  browserEngine: BrowserEngine
  
  // Статус та власність
  status: ProfileStatus
  ownerId?: string // ID фармера/баєра
  assignedTo?: string // ID користувача, якому призначено
  
  // Теги та категорії
  tags: string[]
  category: string
  
  // KasmWeb інтеграція
  kasmSessionId?: string
  kasmImageId: string
  kasmServerId?: string
  
  // Браузерні відбитки
  fingerprint: BrowserFingerprint
  
  // Проксі налаштування
  proxy?: ProxyConfig
  
  // Автоматизація
  automation?: AutomationConfig
  
  // Метадані
  createdAt: Date
  updatedAt: Date
  lastUsed?: Date
  usageCount: number
  
  // Airtable синхронізація
  airtableId?: string
  isSynced: boolean
}

// Браузерні відбитки
export interface BrowserFingerprint {
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  geolocation: string
  webglVendor: string
  webglRenderer: string
  canvasFingerprint: string
  webRTC: WebRTCConfig
  fonts: string[]
  plugins: string[]
  extensions: string[]
}

// WebRTC конфігурація
export interface WebRTCConfig {
  enabled: boolean
  ipAddress?: string
  publicIP?: string
}

// Проксі конфігурація
export interface ProxyConfig {
  type: 'http' | 'https' | 'socks5'
  host: string
  port: number
  username?: string
  password?: string
  country?: string
  city?: string
  isp?: string
  isWorking: boolean
  lastChecked?: Date
  rotationUrl?: string // URL для зміни IP
}

// Автоматизація
export interface AutomationConfig {
  enabled: boolean
  type: 'cookie_farming' | 'macro' | 'custom'
  settings: CookieFarmingSettings | MacroSettings | CustomSettings
  schedule?: AutomationSchedule
  lastRun?: Date
  nextRun?: Date
  isRunning: boolean
}

// Налаштування нагулу кук
export interface CookieFarmingSettings {
  searchKeywords: string[]
  maxSitesPerKeyword: number
  scrollDepth: number // 0-100%
  timeOnSite: {
    min: number // секунди
    max: number // секунди
  }
  searchEngines: ('google' | 'bing' | 'yandex')[]
  excludeDomains: string[]
  includeDomains: string[]
}

// Налаштування макросів
export interface MacroSettings {
  actions: MacroAction[]
  repeatCount: number
  delayBetweenActions: number
}

// Кастомні налаштування
export interface CustomSettings {
  script: string
  parameters: Record<string, any>
}

// Дія макросу
export interface MacroAction {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'navigate' | 'screenshot'
  selector?: string
  value?: string
  delay?: number
  coordinates?: { x: number; y: number }
}

// Розклад автоматизації
export interface AutomationSchedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly'
  time: string // HH:MM
  days?: number[] // для weekly/monthly
  enabled: boolean
}

// Статистика профілю
export interface ProfileStats {
  totalUsageTime: number // хвилини
  sessionsCount: number
  lastSessionDuration?: number
  automationRuns: number
  successfulAutomations: number
  errors: number
  cookiesCollected: number
}

// Користувач (фармер/баєр)
export interface ProfileUser {
  id: string
  name: string
  email: string
  role: 'farmer' | 'buyer' | 'admin'
  assignedProfiles: string[] // ID профілів
  permissions: UserPermissions
  createdAt: Date
  lastActive?: Date
}

// Права користувача
export interface UserPermissions {
  canCreateProfiles: boolean
  canEditProfiles: boolean
  canDeleteProfiles: boolean
  canAssignProfiles: boolean
  canRunAutomation: boolean
  canViewStats: boolean
  canManageUsers: boolean
}

// Airtable синхронізація
export interface AirtableSync {
  tableId: string
  recordId: string
  lastSynced: Date
  syncStatus: 'pending' | 'synced' | 'error'
  errorMessage?: string
}

// Фільтри для пошуку профілів
export interface ProfileFilters {
  platform?: PlatformType
  browserType?: BrowserType
  status?: ProfileStatus
  ownerId?: string
  tags?: string[]
  category?: string
  isAvailable?: boolean
  hasProxy?: boolean
  automationEnabled?: boolean
}

// Сортування профілів
export interface ProfileSorting {
  field: 'name' | 'createdAt' | 'lastUsed' | 'usageCount' | 'status'
  direction: 'asc' | 'desc'
}

// Пагінація
export interface Pagination {
  page: number
  limit: number
  total: number
}

// Результат пошуку профілів
export interface ProfileSearchResult {
  profiles: BrowserProfile[]
  pagination: Pagination
  filters: ProfileFilters
  sorting: ProfileSorting
} 