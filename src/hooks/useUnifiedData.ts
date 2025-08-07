import { useState, useEffect } from 'react'
import { AirtableAccount, AirtableOffer, AirtableExpense, AirtableTeamMember } from '@/types'

interface UseUnifiedDataOptions {
  table: 'accounts' | 'offers' | 'expenses' | 'team'
  limit?: number
  filters?: Record<string, any>
}

interface UseUnifiedDataResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => void
  total: number
}

export function useUnifiedData<T>({ table, limit, filters }: UseUnifiedDataOptions): UseUnifiedDataResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = `/api/airtable/unified?table=${table}`
      const params = new URLSearchParams()
      
      if (limit) {
        params.append('limit', limit.toString())
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value.toString())
          }
        })
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setTotal(result.total || result.data.length)
      } else {
        setError(result.message || 'Помилка завантаження даних')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Невідома помилка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [table, limit, JSON.stringify(filters)])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    total
  }
}

// Специфічні хуки для кожного типу даних
export function useAccounts(options?: Omit<UseUnifiedDataOptions, 'table'>) {
  return useUnifiedData<AirtableAccount>({ table: 'accounts', ...options })
}

export function useOffers(options?: Omit<UseUnifiedDataOptions, 'table'>) {
  return useUnifiedData<AirtableOffer>({ table: 'offers', ...options })
}

export function useExpenses(options?: Omit<UseUnifiedDataOptions, 'table'>) {
  return useUnifiedData<AirtableExpense>({ table: 'expenses', ...options })
}

export function useTeamMembers(options?: Omit<UseUnifiedDataOptions, 'table'>) {
  return useUnifiedData<AirtableTeamMember>({ table: 'team', ...options })
} 