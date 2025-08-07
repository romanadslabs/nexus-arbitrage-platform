'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { kasmWebClient, KasmSession, KasmImage, KasmServer } from '@/lib/kasmWeb'
import { Account } from '@/types'

interface KasmWebContextType {
  // Дані
  sessions: KasmSession[]
  images: KasmImage[]
  servers: KasmServer[]
  isLoading: boolean
  error: string | null
  
  // Методи для роботи з сесіями
  createSession: (accountId: string, imageId: string, options?: any) => Promise<KasmSession>
  stopSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  getSessionUrl: (sessionId: string) => Promise<string>
  
  // Методи для роботи з аккаунтами
  launchAccountBrowser: (account: Account) => Promise<KasmSession>
  stopAccountBrowser: (accountId: string) => Promise<void>
  getAccountSession: (accountId: string) => KasmSession | null
  
  // Утиліти
  refreshSessions: () => Promise<void>
  refreshImages: () => Promise<void>
  refreshServers: () => Promise<void>
}

const KasmWebContext = createContext<KasmWebContextType | undefined>(undefined)

export function KasmWebProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<KasmSession[]>([])
  const [images, setImages] = useState<KasmImage[]>([])
  const [servers, setServers] = useState<KasmServer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Завантажити початкові дані
  useEffect(() => {
    refreshImages()
    refreshServers()
    refreshSessions()
  }, [])

  const refreshSessions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const sessionsData = await kasmWebClient.getSessions()
      setSessions(sessionsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження сесій')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshImages = async () => {
    try {
      setError(null)
      const imagesData = await kasmWebClient.getImages()
      setImages(imagesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження образів')
    }
  }

  const refreshServers = async () => {
    try {
      setError(null)
      const serversData = await kasmWebClient.getServers()
      setServers(serversData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження серверів')
    }
  }

  const createSession = async (accountId: string, imageId: string, options?: any): Promise<KasmSession> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const sessionName = `Account-${accountId}-${Date.now()}`
      const session = await kasmWebClient.createSession(imageId, sessionName, options)
      
      // Оновлюємо список сесій
      setSessions(prev => [...prev, session])
      
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка створення сесії'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const stopSession = async (sessionId: string): Promise<void> => {
    try {
      setError(null)
      await kasmWebClient.stopSession(sessionId)
      
      // Оновлюємо статус сесії
      setSessions(prev => prev.map(session => 
        session.session_id === sessionId 
          ? { ...session, status: 'stopping' as const }
          : session
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка зупинки сесії')
      throw err
    }
  }

  const deleteSession = async (sessionId: string): Promise<void> => {
    try {
      setError(null)
      await kasmWebClient.deleteSession(sessionId)
      
      // Видаляємо сесію зі списку
      setSessions(prev => prev.filter(session => session.session_id !== sessionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка видалення сесії')
      throw err
    }
  }

  const getSessionUrl = async (sessionId: string): Promise<string> => {
    try {
      setError(null)
      return await kasmWebClient.getSessionUrl(sessionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка отримання URL сесії')
      throw err
    }
  }

  // Запустити браузер для конкретного аккаунта
  const launchAccountBrowser = async (account: Account): Promise<KasmSession> => {
    try {
      setIsLoading(true)
      setError(null)

      // Визначаємо образ браузера залежно від платформи
      const getImageForPlatform = (platform: string): string => {
        switch (platform.toLowerCase()) {
          case 'facebook':
            return 'chrome-120' // або спеціальний образ для Facebook
          case 'google':
            return 'chrome-120'
          case 'telegram':
            return 'chrome-120'
          case 'tiktok':
            return 'chrome-120'
          case 'instagram':
            return 'chrome-120'
          default:
            return 'chrome-120'
        }
      }

      const imageId = getImageForPlatform(account.platform)
      
      // Створюємо браузерний профіль на основі даних аккаунта
      const browserProfile = kasmWebClient.createBrowserProfile({
        userAgent: account.browserProfile?.userAgent,
        screenResolution: account.browserProfile?.screenResolution,
        timezone: account.browserProfile?.timezone,
        language: account.browserProfile?.language,
        geolocation: account.browserProfile?.geolocation
      })

      const sessionName = `${account.platform}-${account.name}-${Date.now()}`
      
      const session = await kasmWebClient.createSession(imageId, sessionName, {
        browser_profile: browserProfile,
        view_only: false
      })

      // Оновлюємо список сесій
      setSessions(prev => [...prev, session])
      
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка запуску браузера'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Зупинити браузер для конкретного аккаунта
  const stopAccountBrowser = async (accountId: string): Promise<void> => {
    try {
      setError(null)
      
      // Знаходимо сесію для цього аккаунта
      const session = sessions.find(s => s.name.includes(accountId))
      if (session) {
        await stopSession(session.session_id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка зупинки браузера')
      throw err
    }
  }

  // Отримати сесію для конкретного аккаунта
  const getAccountSession = (accountId: string): KasmSession | null => {
    return sessions.find(s => s.name.includes(accountId)) || null
  }

  const value: KasmWebContextType = {
    sessions,
    images,
    servers,
    isLoading,
    error,
    createSession,
    stopSession,
    deleteSession,
    getSessionUrl,
    launchAccountBrowser,
    stopAccountBrowser,
    getAccountSession,
    refreshSessions,
    refreshImages,
    refreshServers
  }

  return (
    <KasmWebContext.Provider value={value}>
      {children}
    </KasmWebContext.Provider>
  )
}

export function useKasmWeb() {
  const context = useContext(KasmWebContext)
  if (context === undefined) {
    throw new Error('useKasmWeb must be used within a KasmWebProvider')
  }
  return context
} 