import { useState, useCallback } from 'react'
import { KasmSession, KasmImage, KasmServer } from '@/lib/kasmWeb'

interface UseKasmWebReturn {
  // Дані
  sessions: KasmSession[]
  images: KasmImage[]
  servers: KasmServer[]
  isLoading: boolean
  error: string | null
  
  // Методи
  fetchSessions: () => Promise<void>
  fetchImages: () => Promise<void>
  fetchServers: () => Promise<void>
  createSession: (imageId: string, name: string, options?: any) => Promise<KasmSession>
  stopSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  getSessionUrl: (sessionId: string) => Promise<string>
}

export function useKasmWeb(): UseKasmWebReturn {
  const [sessions, setSessions] = useState<KasmSession[]>([])
  const [images, setImages] = useState<KasmImage[]>([])
  const [servers, setServers] = useState<KasmServer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/kasmweb?action=sessions')
      const result = await response.json()
      
      if (result.success) {
        setSessions(result.data)
      } else {
        setError(result.error || 'Помилка завантаження сесій')
      }
    } catch (err) {
      setError('Помилка мережі')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchImages = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch('/api/kasmweb?action=images')
      const result = await response.json()
      
      if (result.success) {
        setImages(result.data)
      } else {
        setError(result.error || 'Помилка завантаження образів')
      }
    } catch (err) {
      setError('Помилка мережі')
    }
  }, [])

  const fetchServers = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch('/api/kasmweb?action=servers')
      const result = await response.json()
      
      if (result.success) {
        setServers(result.data)
      } else {
        setError(result.error || 'Помилка завантаження серверів')
      }
    } catch (err) {
      setError('Помилка мережі')
    }
  }, [])

  const createSession = useCallback(async (imageId: string, name: string, options?: any): Promise<KasmSession> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/kasmweb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_session',
          imageId,
          name,
          options
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Оновлюємо список сесій
        setSessions(prev => [...prev, result.data])
        return result.data
      } else {
        throw new Error(result.error || 'Помилка створення сесії')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка створення сесії'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      setError(null)
      
      const response = await fetch('/api/kasmweb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'stop_session',
          sessionId
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Оновлюємо статус сесії
        setSessions(prev => prev.map(session => 
          session.session_id === sessionId 
            ? { ...session, status: 'stopping' as const }
            : session
        ))
      } else {
        throw new Error(result.error || 'Помилка зупинки сесії')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка зупинки сесії'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      setError(null)
      
      const response = await fetch('/api/kasmweb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_session',
          sessionId
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Видаляємо сесію зі списку
        setSessions(prev => prev.filter(session => session.session_id !== sessionId))
      } else {
        throw new Error(result.error || 'Помилка видалення сесії')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка видалення сесії'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getSessionUrl = useCallback(async (sessionId: string): Promise<string> => {
    try {
      setError(null)
      
      const response = await fetch('/api/kasmweb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_session_url',
          sessionId
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        return result.data.url
      } else {
        throw new Error(result.error || 'Помилка отримання URL')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка отримання URL'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  return {
    sessions,
    images,
    servers,
    isLoading,
    error,
    fetchSessions,
    fetchImages,
    fetchServers,
    createSession,
    stopSession,
    deleteSession,
    getSessionUrl
  }
} 