import { NextRequest, NextResponse } from 'next/server'
import { BrowserProfile } from '@/types/browserProfiles'

// TODO: Замінити на реальну базу даних
let profiles: BrowserProfile[] = []

// Генерувати унікальний ID
const generateId = () => `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'search':
        return await handleSearch(request)
      default:
        return NextResponse.json({ 
          success: true, 
          profiles: profiles,
          total: profiles.length 
        })
    }
  } catch (error) {
    console.error('Browser profiles API error:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'create':
        return await handleCreate(body)
      case 'search':
        return await handleSearch(request)
      default:
        return NextResponse.json(
          { success: false, error: 'Невідома дія' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Browser profiles API error:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    )
  }
}

async function handleCreate(body: any) {
  try {
    const {
      name,
      description,
      platform,
      browserType,
      os,
      browserEngine,
      category,
      tags,
      kasmImageId,
      kasmServerId,
      fingerprint,
      proxy,
      automation
    } = body

    // Валідація обов'язкових полів
    if (!name || !platform || !browserType || !kasmImageId) {
      return NextResponse.json(
        { success: false, error: 'Відсутні обов\'язкові поля' },
        { status: 400 }
      )
    }

    const newProfile: BrowserProfile = {
      id: generateId(),
      name,
      description,
      platform,
      browserType,
      os,
      browserEngine,
      status: 'active',
      tags: tags || [],
      category: category || '',
      kasmImageId,
      kasmServerId,
      fingerprint: fingerprint || {
        userAgent: '',
        screenResolution: '1920x1080',
        timezone: 'Europe/Kiev',
        language: 'uk-UA,uk;q=0.9,en;q=0.8',
        geolocation: '50.4501,30.5234',
        webglVendor: 'Intel Inc.',
        webglRenderer: 'Intel Iris OpenGL Engine',
        canvasFingerprint: '',
        webRTC: { enabled: false },
        fonts: [],
        plugins: [],
        extensions: []
      },
      proxy: proxy || null,
      automation: automation || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isSynced: false
    }

    profiles.push(newProfile)

    return NextResponse.json({
      success: true,
      profile: newProfile
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка створення профілю' },
      { status: 500 }
    )
  }
}

async function handleSearch(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = JSON.parse(searchParams.get('filters') || '{}')
    const sorting = JSON.parse(searchParams.get('sorting') || '{"field":"createdAt","direction":"desc"}')
    const pagination = JSON.parse(searchParams.get('pagination') || '{"page":1,"limit":20}')

    let filteredProfiles = [...profiles]

    // Застосовуємо фільтри
    if (filters.platform) {
      filteredProfiles = filteredProfiles.filter(p => p.platform === filters.platform)
    }
    if (filters.browserType) {
      filteredProfiles = filteredProfiles.filter(p => p.browserType === filters.browserType)
    }
    if (filters.status) {
      filteredProfiles = filteredProfiles.filter(p => p.status === filters.status)
    }
    if (filters.ownerId) {
      filteredProfiles = filteredProfiles.filter(p => p.ownerId === filters.ownerId)
    }
    if (filters.tags && filters.tags.length > 0) {
      filteredProfiles = filteredProfiles.filter(p => 
        filters.tags.some((tag: string) => p.tags.includes(tag))
      )
    }
    if (filters.category) {
      filteredProfiles = filteredProfiles.filter(p => p.category === filters.category)
    }
    if (filters.isAvailable) {
      filteredProfiles = filteredProfiles.filter(p => !p.assignedTo)
    }
    if (filters.hasProxy) {
      filteredProfiles = filteredProfiles.filter(p => p.proxy !== null)
    }
    if (filters.automationEnabled) {
      filteredProfiles = filteredProfiles.filter(p => p.automation?.enabled)
    }

    // Застосовуємо сортування
    filteredProfiles.sort((a, b) => {
      const aValue = a[sorting.field as keyof BrowserProfile]
      const bValue = b[sorting.field as keyof BrowserProfile]
      
      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1
      return 0
    })

    // Застосовуємо пагінацію
    const startIndex = (pagination.page - 1) * pagination.limit
    const endIndex = startIndex + pagination.limit
    const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      result: {
        profiles: paginatedProfiles,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: filteredProfiles.length
        },
        filters,
        sorting
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