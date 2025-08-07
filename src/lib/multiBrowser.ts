// MultiBrowser API Client
export interface BrowserProfile {
  id: string
  name: string
  platform: 'google' | 'facebook' | 'telegram' | 'tiktok' | 'instagram'
  browserType: 'desktop' | 'mobile' | 'tablet'
  os: 'windows' | 'macos' | 'linux' | 'android' | 'ios'
  browserEngine: 'chrome' | 'firefox' | 'safari' | 'edge'
  status: 'active' | 'inactive' | 'running' | 'stopped' | 'error'
  category: string
  tags: string[]
  
  // Browser fingerprint
  fingerprint: {
    userAgent: string
    screenResolution: string
    timezone: string
    language: string
    geolocation: string
    webglVendor: string
    webglRenderer: string
    canvasFingerprint: string
    webRTC: { enabled: boolean }
    fonts: string[]
    plugins: string[]
    extensions: string[]
  }
  
  // Proxy settings
  proxy?: {
    type: 'http' | 'https' | 'socks5'
    host: string
    port: number
    username?: string
    password?: string
    rotation?: boolean
  }
  
  // Automation settings
  automation?: {
    enabled: boolean
    cookieWarming: boolean
    macroRecording: boolean
    schedule?: {
      enabled: boolean
      interval: number // minutes
      actions: string[]
    }
  }
  
  // Session info
  sessionId?: string
  sessionUrl?: string
  lastActivity?: string
  usageCount: number
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
  notes?: string
}

export interface BrowserSession {
  id: string
  profileId: string
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error'
  url: string
  title: string
  lastActivity: string
  screenshot?: string
  logs: string[]
}

export interface AutomationTask {
  id: string
  profileId: string
  type: 'cookie_warming' | 'macro' | 'custom'
  status: 'pending' | 'running' | 'completed' | 'failed'
  config: any
  result?: any
  startedAt?: string
  completedAt?: string
}

class MultiBrowserClient {
  private apiUrl: string
  private apiKey: string

  constructor() {
    // Налаштування для мультибраузера
    this.apiUrl = process.env.NEXT_PUBLIC_MULTIBROWSER_API_URL || 'http://localhost:8080'
    this.apiKey = process.env.NEXT_PUBLIC_MULTIBROWSER_API_KEY || 'demo-key'
  }

  // Профілі браузерів
  async getProfiles(): Promise<BrowserProfile[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/profiles`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка отримання профілів:', error)
      // Повертаємо пустий масив у разі помилки
      return []
    }
  }

  async createProfile(profile: Omit<BrowserProfile, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<BrowserProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/api/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка створення профілю:', error)
      // Повертаємо помилку
      throw error
    }
  }

  async updateProfile(id: string, updates: Partial<BrowserProfile>): Promise<BrowserProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/api/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка оновлення профілю:', error)
      throw error
    }
  }

  async deleteProfile(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/profiles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Помилка видалення профілю:', error)
      throw error
    }
  }

  // Сесії браузерів
  async startSession(profileId: string): Promise<BrowserSession> {
    try {
      const response = await fetch(`${this.apiUrl}/api/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileId })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка запуску сесії:', error)
      // Повертаємо помилку
      throw error
    }
  }

  async stopSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Помилка зупинки сесії:', error)
      throw error
    }
  }

  async getSessions(): Promise<BrowserSession[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/sessions`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка отримання сесій:', error)
      return []
    }
  }

  // Автоматизація
  async startAutomation(task: Omit<AutomationTask, 'id' | 'status' | 'startedAt'>): Promise<AutomationTask> {
    try {
      const response = await fetch(`${this.apiUrl}/api/automation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Помилка запуску автоматизації:', error)
      throw error
    }
  }

  // Тестові дані видалено
}

export const multiBrowserClient = new MultiBrowserClient() 