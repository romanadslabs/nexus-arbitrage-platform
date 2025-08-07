'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  BrowserProfile, 
  ProfileFilters, 
  ProfileSorting, 
  Pagination,
  ProfileSearchResult,
  ProfileUser,
  ProfileStats
} from '@/types/browserProfiles'
import { useKasmWeb } from './KasmWebProvider'

interface BrowserProfilesContextType {
  // Дані
  profiles: BrowserProfile[]
  users: ProfileUser[]
  stats: ProfileStats[]
  isLoading: boolean
  error: string | null
  
  // Пошук та фільтрація
  searchProfiles: (filters: ProfileFilters, sorting: ProfileSorting, pagination: Pagination) => Promise<ProfileSearchResult>
  getProfileById: (id: string) => BrowserProfile | null
  getProfilesByUser: (userId: string) => BrowserProfile[]
  getAvailableProfiles: () => BrowserProfile[]
  
  // Керування профілями
  createProfile: (profile: Omit<BrowserProfile, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'isSynced'>) => Promise<BrowserProfile>
  updateProfile: (id: string, updates: Partial<BrowserProfile>) => Promise<BrowserProfile>
  deleteProfile: (id: string) => Promise<void>
  duplicateProfile: (id: string, newName: string) => Promise<BrowserProfile>
  
  // KasmWeb інтеграція
  launchProfile: (profileId: string) => Promise<void>
  stopProfile: (profileId: string) => Promise<void>
  getProfileSession: (profileId: string) => any | null
  
  // Призначення профілів
  assignProfile: (profileId: string, userId: string) => Promise<void>
  unassignProfile: (profileId: string) => Promise<void>
  
  // Автоматизація
  startAutomation: (profileId: string) => Promise<void>
  stopAutomation: (profileId: string) => Promise<void>
  getAutomationStatus: (profileId: string) => any
  
  // Проксі
  addProxyToProfile: (profileId: string, proxy: any) => Promise<void>
  removeProxyFromProfile: (profileId: string) => Promise<void>
  testProxy: (proxy: any) => Promise<boolean>
  
  // Airtable синхронізація
  syncToAirtable: (profileId: string) => Promise<void>
  syncFromAirtable: () => Promise<void>
  getSyncStatus: () => any
  
  // Утиліти
  refreshProfiles: () => Promise<void>
  clearError: () => void
}

const BrowserProfilesContext = createContext<BrowserProfilesContextType | undefined>(undefined)

export function BrowserProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<BrowserProfile[]>([])
  const [users, setUsers] = useState<ProfileUser[]>([])
  const [stats, setStats] = useState<ProfileStats[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { launchAccountBrowser, stopAccountBrowser, getAccountSession } = useKasmWeb()

  // Завантажити початкові дані
  useEffect(() => {
    refreshProfiles()
  }, [])

  const refreshProfiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Завантажити профілі з Airtable
      const response = await fetch('/api/browser-profiles')
      const data = await response.json()
      
      if (data.success) {
        setProfiles(data.profiles)
      } else {
        setError(data.error || 'Помилка завантаження профілів')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка мережі')
    } finally {
      setIsLoading(false)
    }
  }

  const searchProfiles = async (
    filters: ProfileFilters, 
    sorting: ProfileSorting, 
    pagination: Pagination
  ): Promise<ProfileSearchResult> => {
    try {
      setError(null)
      
      const response = await fetch('/api/browser-profiles/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, sorting, pagination })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.result
      } else {
        throw new Error(data.error || 'Помилка пошуку')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка пошуку')
      throw err
    }
  }

  const getProfileById = (id: string): BrowserProfile | null => {
    return profiles.find(profile => profile.id === id) || null
  }

  const getProfilesByUser = (userId: string): BrowserProfile[] => {
    return profiles.filter(profile => profile.assignedTo === userId)
  }

  const getAvailableProfiles = (): BrowserProfile[] => {
    return profiles.filter(profile => 
      profile.status === 'active' && !profile.assignedTo
    )
  }

  const createProfile = async (profileData: Omit<BrowserProfile, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'isSynced'>): Promise<BrowserProfile> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/browser-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        const newProfile = data.profile
        setProfiles(prev => [...prev, newProfile])
        return newProfile
      } else {
        throw new Error(data.error || 'Помилка створення профілю')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка створення профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (id: string, updates: Partial<BrowserProfile>): Promise<BrowserProfile> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/browser-profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      const data = await response.json()
      
      if (data.success) {
        const updatedProfile = data.profile
        setProfiles(prev => prev.map(profile => 
          profile.id === id ? updatedProfile : profile
        ))
        return updatedProfile
      } else {
        throw new Error(data.error || 'Помилка оновлення профілю')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка оновлення профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteProfile = async (id: string): Promise<void> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/browser-profiles/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProfiles(prev => prev.filter(profile => profile.id !== id))
      } else {
        throw new Error(data.error || 'Помилка видалення профілю')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка видалення профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const duplicateProfile = async (id: string, newName: string): Promise<BrowserProfile> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/browser-profiles/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const duplicatedProfile = data.profile
        setProfiles(prev => [...prev, duplicatedProfile])
        return duplicatedProfile
      } else {
        throw new Error(data.error || 'Помилка дублювання профілю')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка дублювання профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const launchProfile = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      
      const profile = getProfileById(profileId)
      if (!profile) {
        throw new Error('Профіль не знайдено')
      }

      // TODO: Інтеграція з KasmWeb
      // const session = await launchAccountBrowser(profile)
      
      // Оновлюємо статус профілю
      await updateProfile(profileId, { 
        status: 'running',
        lastUsed: new Date(),
        usageCount: profile.usageCount + 1
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка запуску профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const stopProfile = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      
      const profile = getProfileById(profileId)
      if (!profile) {
        throw new Error('Профіль не знайдено')
      }

      // TODO: Інтеграція з KasmWeb
      // await stopAccountBrowser(profileId)
      
      // Оновлюємо статус профілю
      await updateProfile(profileId, { status: 'stopped' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка зупинки профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getProfileSession = (profileId: string): any | null => {
    const profile = getProfileById(profileId)
    if (!profile?.kasmSessionId) return null
    
    // TODO: Отримати сесію з KasmWeb
    return null
  }

  const assignProfile = async (profileId: string, userId: string): Promise<void> => {
    try {
      setError(null)
      await updateProfile(profileId, { assignedTo: userId })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка призначення профілю'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const unassignProfile = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      await updateProfile(profileId, { assignedTo: undefined })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка зняття призначення'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const startAutomation = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      
      const profile = getProfileById(profileId)
      if (!profile?.automation) {
        throw new Error('Автоматизація не налаштована')
      }

      // TODO: Запустити автоматизацію
      await updateProfile(profileId, { 
        automation: { ...profile.automation, isRunning: true }
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка запуску автоматизації'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const stopAutomation = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      
      const profile = getProfileById(profileId)
      if (!profile?.automation) {
        throw new Error('Автоматизація не налаштована')
      }

      // TODO: Зупинити автоматизацію
      await updateProfile(profileId, { 
        automation: { ...profile.automation, isRunning: false }
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка зупинки автоматизації'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getAutomationStatus = (profileId: string): any => {
    const profile = getProfileById(profileId)
    return profile?.automation || null
  }

  const addProxyToProfile = async (profileId: string, proxy: any): Promise<void> => {
    try {
      setError(null)
      await updateProfile(profileId, { proxy })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка додавання проксі'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeProxyFromProfile = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      await updateProfile(profileId, { proxy: undefined })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка видалення проксі'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const testProxy = async (proxy: any): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch('/api/proxy/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proxy)
      })
      
      const data = await response.json()
      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка тестування проксі')
      return false
    }
  }

  const syncToAirtable = async (profileId: string): Promise<void> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/browser-profiles/${profileId}/sync`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Помилка синхронізації')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка синхронізації'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const syncFromAirtable = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/browser-profiles/sync', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProfiles(data.profiles)
      } else {
        throw new Error(data.error || 'Помилка синхронізації')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка синхронізації')
    } finally {
      setIsLoading(false)
    }
  }

  const getSyncStatus = (): any => {
    // TODO: Повернути статус синхронізації
    return {
      lastSync: new Date(),
      pendingChanges: 0,
      errors: []
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: BrowserProfilesContextType = {
    profiles,
    users,
    stats,
    isLoading,
    error,
    searchProfiles,
    getProfileById,
    getProfilesByUser,
    getAvailableProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    launchProfile,
    stopProfile,
    getProfileSession,
    assignProfile,
    unassignProfile,
    startAutomation,
    stopAutomation,
    getAutomationStatus,
    addProxyToProfile,
    removeProxyFromProfile,
    testProxy,
    syncToAirtable,
    syncFromAirtable,
    getSyncStatus,
    refreshProfiles,
    clearError
  }

  return (
    <BrowserProfilesContext.Provider value={value}>
      {children}
    </BrowserProfilesContext.Provider>
  )
}

export function useBrowserProfiles() {
  const context = useContext(BrowserProfilesContext)
  if (context === undefined) {
    throw new Error('useBrowserProfiles must be used within a BrowserProfilesProvider')
  }
  return context
} 