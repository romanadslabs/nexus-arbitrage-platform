'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Типи для кешування
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface Cache<T> {
  [key: string]: CacheEntry<T>
}

// Налаштування кешу
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 хвилин
  MAX_CACHE_SIZE: 50, // Максимальна кількість записів в кеші
  BATCH_SIZE: 20, // Розмір пакету для завантаження
  DEBOUNCE_DELAY: 300, // Затримка для дебаунсу
}

// Хук для ленивого завантаження даних
export function useLazyData<T>(
  key: string,
  loadFunction: (page: number, limit: number) => Promise<T[]>,
  options: {
    ttl?: number
    batchSize?: number
    initialData?: T[]
    dependencies?: any[]
  } = {}
) {
  const {
    ttl = CACHE_CONFIG.DEFAULT_TTL,
    batchSize = CACHE_CONFIG.BATCH_SIZE,
    initialData = [],
    dependencies = []
  } = options

  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const cache = useRef<Cache<T[]>>({})
  const currentPage = useRef(0)
  const isLoadingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Очищення кешу
  const clearCache = useCallback(() => {
    cache.current = {}
  }, [])

  // Очищення застарілих записів кешу
  const cleanupCache = useCallback(() => {
    const now = Date.now()
    const entries = Object.entries(cache.current)
    
    // Видаляємо застарілі записи
    const validEntries = entries.filter(([_, entry]) => entry.expiresAt > now)
    
    // Якщо кеш все ще завеликий, видаляємо найстаріші записи
    if (validEntries.length > CACHE_CONFIG.MAX_CACHE_SIZE) {
      const sortedEntries = validEntries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      const entriesToKeep = sortedEntries.slice(-CACHE_CONFIG.MAX_CACHE_SIZE)
      cache.current = Object.fromEntries(entriesToKeep)
    } else {
      cache.current = Object.fromEntries(validEntries)
    }
  }, [])

  // Завантаження даних з кешу або сервера
  const loadData = useCallback(async (page: number = 0, forceRefresh: boolean = false) => {
    if (isLoadingRef.current) return

    const cacheKey = `${key}_${page}_${batchSize}`
    const now = Date.now()

    // Перевіряємо кеш
    if (!forceRefresh && cache.current[cacheKey] && cache.current[cacheKey].expiresAt > now) {
      const cachedData = cache.current[cacheKey].data
      setData(prev => page === 0 ? cachedData : [...prev, ...cachedData])
      setHasMore(cachedData.length === batchSize)
      return
    }

    // Скасовуємо попередній запит
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const newData = await loadFunction(page, batchSize)
      
      // Зберігаємо в кеш
      cache.current[cacheKey] = {
        data: newData,
        timestamp: now,
        expiresAt: now + ttl
      }

      setData(prev => page === 0 ? newData : [...prev, ...newData])
      setHasMore(newData.length === batchSize)
      currentPage.current = page
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [key, loadFunction, batchSize, ttl, ...dependencies])

  // Завантаження наступної сторінки
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadData(currentPage.current + 1)
    }
  }, [isLoading, hasMore, loadData])

  // Оновлення даних
  const refresh = useCallback(() => {
    currentPage.current = 0
    loadData(0, true)
  }, [loadData])

  // Ініціалізація
  useEffect(() => {
    cleanupCache()
    loadData(0)
  }, [loadData, cleanupCache])

  // Очищення при розмонтуванні
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    clearCache,
    currentPage: currentPage.current
  }
}

// Хук для віртуалізації списків
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // +2 для буфера
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount, items.length)

  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Хук для дебаунсу
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Хук для інтерсекції (для ленивого завантаження при скролі)
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback()
        }
      })
    }, options)

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [callback, options])

  return elementRef
}