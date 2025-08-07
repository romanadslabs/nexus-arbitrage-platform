import { useState, useEffect, useCallback } from 'react'

interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: string
  message?: string
}

interface UseAirtableOptions {
  autoFetch?: boolean
  refetchInterval?: number
}

// Хук для роботи з аккаунтами
export function useAccounts(options: UseAirtableOptions = {}) {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = useCallback(async (filters?: { status?: string; platform?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.platform) params.append('platform', filters.platform)
      
      const response = await fetch(`/api/airtable/accounts?${params.toString()}`)
      const result: ApiResponse<any[]> = await response.json()
      
      if (result.success && result.data) {
        setAccounts(result.data)
      } else {
        setError(result.error || 'Failed to fetch accounts')
      }
    } catch (err) {
      setError('Network error while fetching accounts')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAccount = useCallback(async (accountData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/airtable/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success && result.data) {
        setAccounts(prev => [...prev, result.data])
        return result.data
      } else {
        setError(result.error || 'Failed to create account')
        return null
      }
    } catch (err) {
      setError('Network error while creating account')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAccount = useCallback(async (id: string, accountData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/airtable/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success && result.data) {
        setAccounts(prev => prev.map(acc => acc.id === id ? result.data : acc))
        return result.data
      } else {
        setError(result.error || 'Failed to update account')
        return null
      }
    } catch (err) {
      setError('Network error while updating account')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/airtable/accounts/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setAccounts(prev => prev.filter(acc => acc.id !== id))
        return true
      } else {
        setError(result.error || 'Failed to delete account')
        return false
      }
    } catch (err) {
      setError('Network error while deleting account')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAccounts()
    }
  }, [fetchAccounts, options.autoFetch])

  useEffect(() => {
    if (options.refetchInterval) {
      const interval = setInterval(() => {
        fetchAccounts()
      }, options.refetchInterval)
      
      return () => clearInterval(interval)
    }
  }, [fetchAccounts, options.refetchInterval])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}

// Хук для роботи з кампаніями
export function useCampaigns(options: UseAirtableOptions = {}) {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async (filters?: { 
    status?: string; 
    platform?: string; 
    sortBy?: string; 
    limit?: number 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.platform) params.append('platform', filters.platform)
      if (filters?.sortBy) params.append('sortBy', filters.sortBy)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const response = await fetch(`/api/airtable/campaigns?${params.toString()}`)
      const result: ApiResponse<any[]> = await response.json()
      
      if (result.success && result.data) {
        setCampaigns(result.data)
      } else {
        setError(result.error || 'Failed to fetch campaigns')
      }
    } catch (err) {
      setError('Network error while fetching campaigns')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCampaign = useCallback(async (campaignData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/airtable/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success && result.data) {
        setCampaigns(prev => [...prev, result.data])
        return result.data
      } else {
        setError(result.error || 'Failed to create campaign')
        return null
      }
    } catch (err) {
      setError('Network error while creating campaign')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCampaign = useCallback(async (id: string, campaignData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/airtable/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success && result.data) {
        setCampaigns(prev => prev.map(camp => camp.id === id ? result.data : camp))
        return result.data
      } else {
        setError(result.error || 'Failed to update campaign')
        return null
      }
    } catch (err) {
      setError('Network error while updating campaign')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/airtable/campaigns/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setCampaigns(prev => prev.filter(camp => camp.id !== id))
        return true
      } else {
        setError(result.error || 'Failed to delete campaign')
        return false
      }
    } catch (err) {
      setError('Network error while deleting campaign')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchCampaigns()
    }
  }, [fetchCampaigns, options.autoFetch])

  useEffect(() => {
    if (options.refetchInterval) {
      const interval = setInterval(() => {
        fetchCampaigns()
      }, options.refetchInterval)
      
      return () => clearInterval(interval)
    }
  }, [fetchCampaigns, options.refetchInterval])

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  }
}

// Хук для перевірки підключення до Airtable
export function useAirtableConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const checkConnection = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/airtable/connection')
      const result = await response.json()
      setIsConnected(result.success)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  return {
    isConnected,
    loading,
    checkConnection,
  }
} 