// KasmWeb конфігурація
export const KASM_CONFIG = {
  // API ключі
  API_KEY: process.env.NEXT_PUBLIC_KASM_API_KEY || 'dcV08sbYEhM1',
  API_SECRET: process.env.NEXT_PUBLIC_KASM_API_SECRET || 'dl3vOjcoAsvFE65GYIBjOwieFrnRMvz7',
  
  // URL сервера (заміни на свій)
  SERVER_URL: process.env.NEXT_PUBLIC_KASM_SERVER_URL || 'https://172.232.39.97',
  
  // Налаштування сесій
  SESSION_CONFIG: {
    // Максимальна кількість одночасних сесій
    MAX_SESSIONS: 5,
    
    // Час життя сесії (в хвилинах)
    SESSION_TIMEOUT: 30,
    
    // Автоматичне очищення неактивних сесій
    AUTO_CLEANUP: true,
    
    // Затримка між запитами (в мілісекундах)
    REQUEST_DELAY: 1000,
  },
  
  // Образів браузерів для різних платформ
  BROWSER_IMAGES: {
    default: 'chrome-120',
    facebook: 'chrome-120',
    google: 'chrome-120',
    telegram: 'chrome-120',
    tiktok: 'chrome-120',
    instagram: 'chrome-120',
    youtube: 'chrome-120',
    twitter: 'chrome-120',
    linkedin: 'chrome-120',
  },
  
  // Налаштування браузерних профілів
  BROWSER_PROFILES: {
    default: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      screenResolution: '1920x1080',
      timezone: 'Europe/Kiev',
      language: 'uk-UA,uk;q=0.9,en;q=0.8',
      geolocation: '50.4501,30.5234',
    },
    mobile: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      screenResolution: '390x844',
      timezone: 'Europe/Kiev',
      language: 'uk-UA,uk;q=0.9,en;q=0.8',
      geolocation: '50.4501,30.5234',
    },
    tablet: {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      screenResolution: '1024x1366',
      timezone: 'Europe/Kiev',
      language: 'uk-UA,uk;q=0.9,en;q=0.8',
      geolocation: '50.4501,30.5234',
    }
  },
  
  // Проксі налаштування (опціонально)
  PROXY_CONFIG: {
    enabled: false,
    type: 'http', // 'http', 'https', 'socks5'
    host: '',
    port: 8080,
    username: '',
    password: '',
  },
  
  // Налаштування логування
  LOGGING: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    saveToFile: false,
  }
}

// Функція для отримання конфігурації браузера для платформи
export function getBrowserImageForPlatform(platform: string): string {
  const platformKey = platform.toLowerCase()
  return KASM_CONFIG.BROWSER_IMAGES[platformKey as keyof typeof KASM_CONFIG.BROWSER_IMAGES] || KASM_CONFIG.BROWSER_IMAGES.default
}

// Функція для отримання браузерного профілю
export function getBrowserProfile(profileType: 'default' | 'mobile' | 'tablet' = 'default') {
  return KASM_CONFIG.BROWSER_PROFILES[profileType]
}

// Функція для перевірки конфігурації
export function validateKasmConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!KASM_CONFIG.API_KEY || KASM_CONFIG.API_KEY === 'dcV08sbYEhM1') {
    errors.push('API_KEY не налаштований')
  }
  
  if (!KASM_CONFIG.API_SECRET || KASM_CONFIG.API_SECRET === 'dl3vOjcoAsvFE65GYIBjOwieFrnRMvz7') {
    errors.push('API_SECRET не налаштований')
  }
  
  if (!KASM_CONFIG.SERVER_URL || KASM_CONFIG.SERVER_URL.includes('your-domain.com')) {
    errors.push('SERVER_URL не налаштований')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 