'use client'

import { useEffect } from 'react'
import analyticsService from '@/lib/analytics'

export default function AnalyticsInitializer() {
  useEffect(() => {
    // Ініціалізуємо аналітику при завантаженні додатку
    const initializeAnalytics = async () => {
      try {
        await analyticsService.initialize()
        console.log('✅ Аналітика ініціалізована')
      } catch (error) {
        console.error('❌ Помилка ініціалізації аналітики:', error)
      }
    }

    initializeAnalytics()
  }, [])

  // Цей компонент не рендерить нічого
  return null
} 