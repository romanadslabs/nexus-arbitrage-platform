'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, RefreshCw, Download, Trash2, Users, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react'
import { useData } from '@/components/providers/DataProvider'
import AccountCard from './AccountCard'
import AccountModal from './AccountModal'
import AccountDetailsModal from './AccountDetailsModal'
import { StatCard } from '@/components/ui/Card'
import { Account } from '@/components/providers/DataProvider'

// Нові статуси акаунтів
const accountStatuses = {
  ready_for_farm: { label: 'Готовий до фарму', color: 'blue' },
  farming_day_1: { label: 'Фарм: День 1', color: 'cyan' },
  farming_day_2: { label: 'Фарм: День 2', color: 'cyan' },
  farming_day_3: { label: 'Фарм: День 3', color: 'cyan' },
  ready_for_ads: { label: 'Готовий до запуску', color: 'green' },
  launched: { label: 'Запущений', color: 'teal' },
  in_progress: { label: 'В роботі', color: 'yellow' },
  blocked_pp: { label: 'Бан: ПП', color: 'red' },
  blocked_system: { label: 'Бан: Система', color: 'red' },
  blocked_passport: { label: 'Бан: Паспорт', color: 'red' },
  sold: { label: 'Проданий', color: 'purple' },
  dead: { label: 'Відпрацьований', color: 'gray' },
}

export default function AccountsManager() {
  const { accounts, isLoading, refreshAllData, deleteAccount } = useData()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt-desc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
  const [viewingAccountId, setViewingAccountId] = useState<string | null>(null)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  const editingAccount = useMemo(() => {
    if (!editingAccountId) return null
    return accounts.find(acc => acc.id === editingAccountId) || null
  }, [editingAccountId, accounts])

  const viewingAccount = useMemo(() => {
    if (!viewingAccountId) return null
    return accounts.find(acc => acc.id === viewingAccountId) || null
  }, [viewingAccountId, accounts])


  // Фільтрація та сортування
  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = accounts.filter(account => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        account.name.toLowerCase().includes(searchLower) ||
        (account.email && account.email.toLowerCase().includes(searchLower)) ||
        account.platform.toLowerCase().includes(searchLower) ||
        account.trafficType.toLowerCase().includes(searchLower)

      const matchesStatus = selectedStatus === 'all' || account.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })

    const [field, order] = sortBy.split('-')
    
    return filtered.sort((a: any, b: any) => {
      let aValue = a[field]
      let bValue = b[field]
      
      if (field === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [accounts, searchTerm, selectedStatus, sortBy])

  // Статистика
  const stats = useMemo(() => ({
    total: accounts.length,
    ready_for_farm: accounts.filter(acc => acc.status === 'ready_for_farm').length,
    ready_for_ads: accounts.filter(acc => acc.status === 'ready_for_ads').length,
    blocked: accounts.filter(acc => acc.status.startsWith('blocked')).length,
    sold: accounts.filter(acc => acc.status === 'sold').length,
  }), [accounts])


  const handleCreateAccount = () => {
    setEditingAccountId(null)
    setShowCreateModal(true)
  }

  const handleEditAccount = (account: Account) => {
    setViewingAccountId(null)
    setEditingAccountId(account.id)
    setShowCreateModal(true)
  }

  const handleViewAccount = (account: Account) => {
    setViewingAccountId(account.id)
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей акаунт?')) {
      await deleteAccount(accountId)
    }
  }
  
  const handleBulkDelete = async () => {
    if (confirm(`Ви впевнені, що хочете видалити ${selectedAccounts.length} акаунтів?`)) {
      for (const accountId of selectedAccounts) {
        await deleteAccount(accountId);
      }
      setSelectedAccounts([]);
    }
  }

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Управління акаунтами</h1>
          <p className="text-gray-600 mt-1">{stats.total} акаунтів</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => refreshAllData()} disabled={isLoading.accounts} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <RefreshCw className={`w-5 h-5 ${isLoading.accounts ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleCreateAccount} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Plus className="w-4 h-4" />
            <span>Створити</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Готові до фарму" value={stats.ready_for_farm} icon={Users} color="blue" />
        <StatCard title="Готові до запуску" value={stats.ready_for_ads} icon={CheckCircle} color="green" />
        <StatCard title="Заблоковані" value={stats.blocked} icon={XCircle} color="red" />
        <StatCard title="Продані" value={stats.sold} icon={DollarSign} color="purple" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="all">Всі статуси</option>
            {Object.entries(accountStatuses).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="createdAt-desc">Новіші</option>
            <option value="createdAt-asc">Старіші</option>
            <option value="name-asc">Ім'я (А-Я)</option>
            <option value="name-desc">Ім'я (Я-А)</option>
          </select>
        </div>
        {selectedAccounts.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
            <span>Вибрано: {selectedAccounts.length}</span>
            <button onClick={handleBulkDelete} className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-500 text-white rounded">
              <Trash2 className="w-4 h-4" />
              <span>Видалити</span>
            </button>
          </div>
        )}
      </div>

      {isLoading.accounts ? (
        <div className="text-center py-12">Завантаження...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredAndSortedAccounts.map((account, index) => (
              <motion.div key={account.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AccountCard
                  account={account}
                  isSelected={selectedAccounts.includes(account.id)}
                  onSelect={() => handleSelectAccount(account.id)}
                  onView={() => handleViewAccount(account)}
                  onEdit={() => handleEditAccount(account)}
                  onDelete={() => handleDeleteAccount(account.id)}
                  statusConfig={accountStatuses[account.status as keyof typeof accountStatuses]}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <AccountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        account={editingAccount}
        statuses={accountStatuses}
      />

      <AccountDetailsModal
        isOpen={!!viewingAccount}
        onClose={() => setViewingAccountId(null)}
        onEdit={() => viewingAccount && handleEditAccount(viewingAccount)}
        account={viewingAccount}
      />
    </div>
  )
} 