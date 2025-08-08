'use client'

import React, { useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useData } from '@/components/providers/DataProvider'
import AccountFilters from './AccountFilters'
import AccountGroups from './AccountGroups'
import AccountModal from './AccountModal'
import AccountDetailsModal from './AccountDetailsModal'

export default function AccountsManager() {
  const { user } = useAuth()
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount, assignFarmerToAccount, refreshAllData } = useData()

  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    status: 'all',
    category: 'all',
    priority: 'all',
    tags: [] as string[],
  })
  const [groupBy, setGroupBy] = useState<'platform' | 'status' | 'category' | 'priority' | 'none'>('none')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [viewing, setViewing] = useState<any | null>(null)

  const handleFiltersChange = (partial: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', platform: 'all', status: 'all', category: 'all', priority: 'all', tags: [] })
  }

  const handleClearTestAccounts = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexus_local_accounts')
        refreshAllData()
      }
    } catch (e) {
      console.error('Failed to clear test accounts', e)
    }
  }

  const normalizedSearch = (s: string) => s.trim().toLowerCase()

  const filteredAccounts = useMemo(() => {
    const s = normalizedSearch(filters.search)
    return accounts.filter(acc => {
      const matchSearch = !s ||
        acc.name.toLowerCase().includes(s) ||
        (acc.email || '').toLowerCase().includes(s) ||
        (acc.platform || '').toLowerCase().includes(s) ||
        (acc.tags || []).some(t => t.toLowerCase().includes(s))

      const matchPlatform = filters.platform === 'all' || acc.platform === filters.platform
      const matchStatus = filters.status === 'all' || acc.status === filters.status
      const matchCategory = filters.category === 'all' || (acc as any).category === filters.category
      const matchPriority = filters.priority === 'all' || acc.priority === filters.priority

      return matchSearch && matchPlatform && matchStatus && matchCategory && matchPriority
    })
  }, [accounts, filters])

  const handleCreate = async (data: any) => {
    await createAccount(data)
    setShowCreate(false)
  }

  const handleUpdate = async (accountId: string, updates: any) => {
    await updateAccount(accountId, updates)
    setEditing(null)
  }

  const handleDelete = async (accountId: string) => {
    if (!confirm('Видалити акаунт?')) return
    await deleteAccount(accountId)
  }

  const handleTransfer = async (accountId: string) => {
    if (!user) return
    await assignFarmerToAccount(accountId, user.id)
  }

  if (isLoading.accounts) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Акаунти</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Керуйте вашими акаунтами</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Додати акаунт
          </button>
          <button
            onClick={handleClearTestAccounts}
            className="px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
            title="Видалити всі тестові акаунти"
          >
            Очистити тестові акаунти
          </button>
        </div>
      </div>

      {/* Filters */}
      <AccountFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Groups/List */}
      <AccountGroups
        accounts={filteredAccounts as any}
        onUpdate={handleUpdate as any}
        onDelete={handleDelete}
        onTransfer={handleTransfer}
        onView={(acc) => setViewing(acc)}
        onEdit={(acc) => setEditing(acc)}
        groupBy={groupBy}
        viewMode={viewMode}
        onGroupByChange={setGroupBy}
        onViewModeChange={setViewMode}
      />

      {/* Create/Edit Modals */}
      <AccountModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
      />

      <AccountModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSave={(data) => handleUpdate(editing.id, data)}
        initialData={editing || undefined}
      />

      {/* Details Modal */}
      <AccountDetailsModal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { setEditing(viewing); setViewing(null) }}
        account={viewing}
      />
    </div>
  )
} 