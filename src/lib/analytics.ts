// Розширення типу Window для Google Analytics
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    mixpanel: any
  }
}

// Сервіс для інтеграції зовнішніх аналітичних сервісів
export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  userId?: string
  timestamp?: Date
}

export interface AnalyticsUser {
  id: string
  email?: string
  name?: string
  role?: string
  properties?: Record<string, any>
}

export interface AnalyticsConfig {
  googleAnalytics?: {
    measurementId: string
    enabled: boolean
  }
  mixpanel?: {
    token: string
    enabled: boolean
  }
  hotjar?: {
    siteId: string
    enabled: boolean
  }
}

class AnalyticsService {
  private config: AnalyticsConfig
  private isInitialized = false

  constructor(config: AnalyticsConfig) {
    this.config = config
  }

  // Ініціалізація аналітики
  async initialize() {
    if (this.isInitialized) return

    try {
      // Google Analytics 4
      if (this.config.googleAnalytics?.enabled) {
        await this.initializeGoogleAnalytics()
      }

      // Mixpanel
      if (this.config.mixpanel?.enabled) {
        await this.initializeMixpanel()
      }

      // Hotjar
      if (this.config.hotjar?.enabled) {
        await this.initializeHotjar()
      }

      this.isInitialized = true
      console.log('✅ Аналітика успішно ініціалізована')
    } catch (error) {
      console.error('❌ Помилка ініціалізації аналітики:', error)
    }
  }

  // Google Analytics 4
  private async initializeGoogleAnalytics() {
    if (typeof window === 'undefined') return

    // Завантажуємо Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics!.measurementId}`
    document.head.appendChild(script)

    // Ініціалізуємо gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', this.config.googleAnalytics!.measurementId)

    // Зберігаємо gtag функцію глобально
    ;(window as any).gtag = gtag
  }

  // Mixpanel
  private async initializeMixpanel() {
    if (typeof window === 'undefined') return

    // Завантажуємо Mixpanel
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2.2.0.min.js'
    document.head.appendChild(script)

    script.onload = () => {
      ;(window as any).mixpanel.init(this.config.mixpanel!.token)
      console.log('✅ Mixpanel ініціалізований')
    }
  }

  // Hotjar
  private async initializeHotjar() {
    if (typeof window === 'undefined') return

    // Hotjar скрипт
    const script = document.createElement('script')
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${this.config.hotjar!.siteId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `
    document.head.appendChild(script)
  }

  // Відстеження подій
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      console.warn('⚠️ Аналітика не ініціалізована')
      return
    }

    try {
      // Google Analytics
      if (this.config.googleAnalytics?.enabled && (window as any).gtag) {
        ;(window as any).gtag('event', event.event, {
          ...event.properties,
          user_id: event.userId,
          timestamp: event.timestamp?.toISOString()
        })
      }

      // Mixpanel
      if (this.config.mixpanel?.enabled && (window as any).mixpanel) {
        ;(window as any).mixpanel.track(event.event, {
          ...event.properties,
          distinct_id: event.userId,
          time: event.timestamp?.getTime()
        })
      }

      // Локальне логування
      console.log('📊 Analytics Event:', event)
    } catch (error) {
      console.error('❌ Помилка відстеження події:', error)
    }
  }

  // Відстеження користувача
  identifyUser(user: AnalyticsUser) {
    if (!this.isInitialized) return

    try {
      // Google Analytics
      if (this.config.googleAnalytics?.enabled && (window as any).gtag) {
        ;(window as any).gtag('config', this.config.googleAnalytics.measurementId, {
          user_id: user.id,
          custom_map: {
            'user_role': 'user_role',
            'user_email': 'user_email'
          }
        })
      }

      // Mixpanel
      if (this.config.mixpanel?.enabled && (window as any).mixpanel) {
        ;(window as any).mixpanel.identify(user.id)
        ;(window as any).mixpanel.people.set({
          $email: user.email,
          $name: user.name,
          role: user.role,
          ...user.properties
        })
      }

      console.log('👤 User Identified:', user)
    } catch (error) {
      console.error('❌ Помилка ідентифікації користувача:', error)
    }
  }

  // Спеціалізовані події для нашого додатку
  trackAccountCreation(account: any) {
    this.trackEvent({
      event: 'account_created',
      properties: {
        platform: account.platform,
        category: account.category,
        status: account.status,
        farmer_id: account.farmerId
      },
      userId: account.farmerId,
      timestamp: new Date()
    })
  }

  trackCampaignLaunch(campaign: any) {
    this.trackEvent({
      event: 'campaign_launched',
      properties: {
        platform: campaign.platform,
        budget: campaign.budget,
        status: campaign.status,
        launcher_id: campaign.launcherId
      },
      userId: campaign.launcherId,
      timestamp: new Date()
    })
  }

  trackTeamActivity(activity: any) {
    this.trackEvent({
      event: 'team_activity',
      properties: {
        activity_type: activity.type,
        team_id: activity.teamId,
        user_role: activity.userRole
      },
      userId: activity.userId,
      timestamp: new Date()
    })
  }

  trackTaskCompletion(task: any) {
    this.trackEvent({
      event: 'task_completed',
      properties: {
        task_type: task.category,
        priority: task.priority,
        assigned_to: task.assignedTo,
        completion_time: task.completionTime
      },
      userId: task.assignedTo,
      timestamp: new Date()
    })
  }

  trackUserLogin(user: any) {
    this.trackEvent({
      event: 'user_login',
      properties: {
        user_role: user.role,
        login_method: 'email'
      },
      userId: user.id,
      timestamp: new Date()
    })
  }

  trackPageView(page: string, properties?: Record<string, any>) {
    this.trackEvent({
      event: 'page_view',
      properties: {
        page,
        url: window.location.href,
        ...properties
      },
      timestamp: new Date()
    })
  }

  // Отримання аналітичних даних
  async getAnalyticsData() {
    // Тут можна додати запити до API для отримання даних
    // Поки що повертаємо мокові дані
    return {
      totalUsers: 150,
      activeUsers: 89,
      totalAccounts: 342,
      activeAccounts: 287,
      totalCampaigns: 156,
      activeCampaigns: 98,
      conversionRate: 12.5,
      averageSessionDuration: '8m 32s',
      topPlatforms: [
        { platform: 'Facebook', count: 156 },
        { platform: 'Google', count: 89 },
        { platform: 'TikTok', count: 67 }
      ],
      recentActivity: [
        { type: 'account_created', count: 12, time: '1h ago' },
        { type: 'campaign_launched', count: 5, time: '2h ago' },
        { type: 'task_completed', count: 8, time: '3h ago' }
      ]
    }
  }
}

// Створюємо екземпляр сервісу
const analyticsService = new AnalyticsService({
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    enabled: process.env.NODE_ENV === 'production'
  },
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'your-mixpanel-token',
    enabled: process.env.NODE_ENV === 'production'
  },
  hotjar: {
    siteId: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID || '6477760',
    enabled: true // Увімкнули для тестування
  }
})

export default analyticsService 