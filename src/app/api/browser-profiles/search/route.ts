import { NextRequest, NextResponse } from 'next/server'
import { BrowserProfile } from '@/types/browserProfiles'

// TODO: Замінити на реальну базу даних
let profiles: BrowserProfile[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filters, sorting, pagination } = body

    let filteredProfiles = [...profiles]

    // Застосовуємо фільтри
    if (filters?.platform) {
      filteredProfiles = filteredProfiles.filter(p => p.platform === filters.platform)
    }
    if (filters?.browserType) {
      filteredProfiles = filteredProfiles.filter(p => p.browserType === filters.browserType)
    }
    if (filters?.status) {
      filteredProfiles = filteredProfiles.filter(p => p.status === filters.status)
    }
    if (filters?.ownerId) {
      filteredProfiles = filteredProfiles.filter(p => p.ownerId === filters.ownerId)
    }
    if (filters?.tags && filters.tags.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.tags.some((tag: string) => p.tags.includes(tag))
      )
    }
    if (filters?.category) {
      filteredProfiles = filteredProfiles.filter(p => p.category === filters.category)
    }
    if (filters?.isAvailable) {
      filteredProfiles = filteredProfiles.filter(p => !p.assignedTo)
    }
    if (filters?.hasProxy) {
      filteredProfiles = filteredProfiles.filter(p => p.proxy !== null)
    }
    if (filters?.automationEnabled) {
      filteredProfiles = filteredProfiles.filter(p => p.automation?.enabled)
    }

    // Застосовуємо сортування
    const sortField = sorting?.field || 'createdAt'
    const sortDirection = sorting?.direction || 'desc'
    
    filteredProfiles.sort((a, b) => {
      const aValue = a[sortField as keyof BrowserProfile]
      const bValue = b[sortField as keyof BrowserProfile]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    // Застосовуємо пагінацію
    const page = pagination?.page || 1
    const limit = pagination?.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      result: {
        profiles: paginatedProfiles,
        pagination: {
          page,
          limit,
          total: filteredProfiles.length
        },
        filters: filters || {},
        sorting: sorting || { field: 'createdAt', direction: 'desc' }
      }
    })
  } catch (error) {
    console.error('Error searching profiles:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка пошуку' },
      { status: 500 }
    )
  }
} 