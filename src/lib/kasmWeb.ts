export interface KasmSession {
  session_id: string
  user_id: string
  server_id: string
  container_id: string
  name: string
  image_id: string
  image_name: string
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error'
  created: string
  last_activity: string
  view_only: boolean
  connection_count: number
  proxy_enabled: boolean
  proxy_config?: {
    proxy_type: string
    proxy_host: string
    proxy_port: number
    proxy_username?: string
    proxy_password?: string
  }
  browser_profile?: {
    user_agent: string
    screen_resolution: string
    timezone: string
    language: string
    geolocation: string
    webgl_vendor: string
    webgl_renderer: string
    canvas_fingerprint: string
  }
}

export interface KasmImage {
  image_id: string
  name: string
  description: string
  category: string
  is_public: boolean
  is_enabled: boolean
  created: string
  updated: string
}

export interface KasmServer {
  server_id: string
  name: string
  hostname: string
  ip_address: string
  status: 'online' | 'offline' | 'maintenance'
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  active_sessions: number
  max_sessions: number
}

import { KASM_CONFIG, getBrowserImageForPlatform, getBrowserProfile } from './kasmConfig'

class KasmWebClient {
  private apiKey: string
  private apiSecret: string
  private baseUrl: string

  constructor() {
    // Примусово встановлюємо правильні значення
    this.apiKey = 'dcV08sbYEhM1'
    this.apiSecret = 'dl3vOjcoAsvFE65GYIBjOwieFrnRMvz7'
    this.baseUrl = 'https://172.232.39.97'
    
    console.log('🔧 KasmWebClient ініціалізований з:', {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret ? '✅ Налаштований' : '❌ Відсутній',
      baseUrl: this.baseUrl
    })
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    // Спробуємо різні варіанти API endpoints
    const possibleUrls = [
      `${this.baseUrl}/api/public${endpoint}`,
      `${this.baseUrl}/api/v1${endpoint}`,
      `${this.baseUrl}/api${endpoint}`,
      `${this.baseUrl}/rest${endpoint}`
    ]
    
    // Спробуємо різні формати авторизації
    const authHeaders = [
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Secret': this.apiSecret
      },
      {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-API-Secret': this.apiSecret
      },
      {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${this.apiKey}:${this.apiSecret}`)}`
      }
    ]

    // Налаштування для ігнорування SSL помилок
    const fetchOptions: RequestInit = {
      method,
      body: data ? JSON.stringify(data) : undefined,
      // @ts-ignore - ігноруємо SSL помилки для самопідписаних сертифікатів
      rejectUnauthorized: false,
      // @ts-ignore
      strictSSL: false
    }

    // Спробуємо кожен URL з різними заголовками авторизації
    for (const url of possibleUrls) {
      for (const headers of authHeaders) {
        try {
          console.log(`🔍 Спробуємо URL: ${url} з заголовками:`, Object.keys(headers))
          
          const options: RequestInit = {
            ...fetchOptions,
            headers
          }
          
          const response = await fetch(url, options)
          
          if (response.ok) {
            console.log(`✅ Успішний запит до: ${url}`)
            return await response.json()
          } else {
            console.log(`❌ Помилка ${response.status} для: ${url}`)
          }
        } catch (error) {
          console.log(`❌ Помилка мережі для: ${url}`, error)
        }
      }
    }
    
    throw new Error('Не вдалося підключитися до жодного API endpoint')
  }

  // Отримати список доступних образів браузерів
  async getImages(): Promise<KasmImage[]> {
    const response = await this.makeRequest('/images')
    return response.images || []
  }

  // Отримати список серверів
  async getServers(): Promise<KasmServer[]> {
    const response = await this.makeRequest('/servers')
    return response.servers || []
  }

  // Створити нову браузерну сесію
  async createSession(imageId: string, name: string, options?: {
    proxy_config?: any
    browser_profile?: any
    view_only?: boolean
  }): Promise<KasmSession> {
    const data = {
      image_id: imageId,
      name,
      ...options
    }

    const response = await this.makeRequest('/sessions', 'POST', data)
    return response.session
  }

  // Отримати список активних сесій
  async getSessions(): Promise<KasmSession[]> {
    const response = await this.makeRequest('/sessions')
    return response.sessions || []
  }

  // Отримати інформацію про конкретну сесію
  async getSession(sessionId: string): Promise<KasmSession> {
    const response = await this.makeRequest(`/sessions/${sessionId}`)
    return response.session
  }

  // Зупинити сесію
  async stopSession(sessionId: string): Promise<void> {
    await this.makeRequest(`/sessions/${sessionId}/stop`, 'POST')
  }

  // Видалити сесію
  async deleteSession(sessionId: string): Promise<void> {
    await this.makeRequest(`/sessions/${sessionId}`, 'DELETE')
  }

  // Отримати URL для підключення до сесії
  async getSessionUrl(sessionId: string): Promise<string> {
    const session = await this.getSession(sessionId)
    return `${this.baseUrl}/sessions/${sessionId}`
  }

  // Створити браузерний профіль з унікальними параметрами
  createBrowserProfile(profile: {
    userAgent?: string
    screenResolution?: string
    timezone?: string
    language?: string
    geolocation?: string
  }): any {
    const defaultProfile = {
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      screen_resolution: '1920x1080',
      timezone: 'Europe/Kiev',
      language: 'uk-UA,uk;q=0.9,en;q=0.8',
      geolocation: '50.4501,30.5234',
      webgl_vendor: 'Intel Inc.',
      webgl_renderer: 'Intel Iris OpenGL Engine',
      canvas_fingerprint: this.generateCanvasFingerprint()
    }

    return { ...defaultProfile, ...profile }
  }

  // Генерувати унікальний canvas fingerprint
  private generateCanvasFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'default'

    // Створюємо унікальний малюнок
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('KasmWeb Browser Profile', 2, 2)
    
    return canvas.toDataURL()
  }

  // Створити проксі конфігурацію
  createProxyConfig(type: 'http' | 'https' | 'socks5', host: string, port: number, username?: string, password?: string): any {
    return {
      proxy_type: type,
      proxy_host: host,
      proxy_port: port,
      proxy_username: username,
      proxy_password: password
    }
  }
}

// Експортуємо інстанс клієнта
export const kasmWebClient = new KasmWebClient()

export default KasmWebClient 