'use client'

import React, { useState } from 'react'
import { Account } from '@/types'
import { Folder, Users, Globe, Tag, AlertTriangle, Clock, CheckCircle, XCircle, Pause, Grid, List } from 'lucide-react'
import AccountCard from './AccountCard'

interface AccountGroupsProps {
  accounts: Account[]
  onUpdate: (accountId: string, updates: Partial<Account>) => void
  onDelete: (accountId: string) => void
  onTransfer: (accountId: string) => void
  groupBy: 'platform' | 'status' | 'category' | 'priority' | 'none'
  viewMode: 'cards' | 'list'
  onGroupByChange: (groupBy: 'platform' | 'status' | 'category' | 'priority' | 'none') => void
  onViewModeChange: (viewMode: 'cards' | 'list') => void
}

export default function AccountGroups({ 
  accounts, 
  onUpdate, 
  onDelete, 
  onTransfer, 
  groupBy, 
  viewMode, 
  onGroupByChange, 
  onViewModeChange 
}: AccountGroupsProps) {
  
  const getGroupIcon = (groupKey: string) => {
    switch (groupKey) {
      case 'Facebook': return <Globe className="w-4 h-4 text-blue-500" />
      case 'Google': return <Globe className="w-4 h-4 text-red-500" />
      case 'TikTok': return <Globe className="w-4 h-4 text-pink-500" />
      case 'Instagram': return <Globe className="w-4 h-4 text-purple-500" />
      case 'YouTube': return <Globe className="w-4 h-4 text-red-600" />
      case 'Twitter': return <Globe className="w-4 h-4 text-blue-400" />
      case 'LinkedIn': return <Globe className="w-4 h-4 text-blue-700" />
      case 'Other': return <Globe className="w-4 h-4 text-gray-500" />
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />
      case 'moderation': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'suspended': return <Pause className="w-4 h-4 text-yellow-500" />
      case 'banned': return <XCircle className="w-4 h-4 text-red-500" />
      case 'personal': return <Users className="w-4 h-4 text-blue-500" />
      case 'business': return <Users className="w-4 h-4 text-purple-500" />
      case 'advertising': return <Users className="w-4 h-4 text-green-500" />
      case 'testing': return <Users className="w-4 h-4 text-yellow-500" />
      case 'backup': return <Users className="w-4 h-4 text-gray-500" />
      case 'low': return <Tag className="w-4 h-4 text-green-500" />
      case 'medium': return <Tag className="w-4 h-4 text-yellow-500" />
      case 'high': return <Tag className="w-4 h-4 text-orange-500" />
      case 'critical': return <Tag className="w-4 h-4 text-red-500" />
      default: return <Folder className="w-4 h-4 text-gray-500" />
    }
  }

  const getGroupColor = (groupKey: string) => {
    switch (groupKey) {
      case 'Facebook': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'Google': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'TikTok': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800'
      case 'Instagram': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
      case 'YouTube': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'Twitter': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'LinkedIn': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'Other': return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
      case 'active': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'pending': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'moderation': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
      case 'suspended': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'banned': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'personal': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'business': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
      case 'advertising': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'testing': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'backup': return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
      case 'low': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'medium': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'high': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
      case 'critical': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
    }
  }

  const getGroupLabel = (groupKey: string) => {
    const labels: { [key: string]: string } = {
      // Platforms
      'Facebook': 'Facebook',
      'Google': 'Google',
      'TikTok': 'TikTok',
      'Instagram': 'Instagram',
      'YouTube': 'YouTube',
      'Twitter': 'Twitter',
      'LinkedIn': 'LinkedIn',
      'Other': 'Інші платформи',
      
      // Statuses
      'active': 'Активні',
      'pending': 'В процесі',
      'moderation': 'На модерації',
      'suspended': 'Призупинені',
      'banned': 'Заблоковані',
      
      // Categories
      'personal': 'Особисті',
      'business': 'Бізнес',
      'advertising': 'Реклама',
      'testing': 'Тестування',
      'backup': 'Резервні',
      
      // Priorities
      'low': 'Низький пріоритет',
      'medium': 'Середній пріоритет',
      'high': 'Високий пріоритет',
      'critical': 'Критичний пріоритет',
    }
    return labels[groupKey] || groupKey
  }

  const groupAccounts = () => {
    if (groupBy === 'none') {
      return { 'Всі аккаунти': accounts }
    }

    const groups: { [key: string]: Account[] } = {}
    
    accounts.forEach(account => {
      let groupKey = ''
      
      switch (groupBy) {
        case 'platform':
          groupKey = account.platform
          break
        case 'status':
          groupKey = account.status
          break
        case 'category':
          groupKey = account.category
          break
        case 'priority':
          groupKey = account.priority
          break
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(account)
    })
    
    return groups
  }

  const groups = groupAccounts()

  const renderAccountCard = (account: Account) => (
    <AccountCard
      key={account.id}
      account={account}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onTransfer={onTransfer}
      onEdit={() => {}} // Додаємо пусту функцію для onEdit
    />
  )

  const renderAccountList = (account: Account) => (
    <div key={account.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {getGroupIcon(account.platform)}
          <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{account.email}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          account.status === 'ready_for_ads' ? 'bg-green-100 text-green-800' :
          account.status.includes('farming') ? 'bg-blue-100 text-blue-800' :
          account.status.includes('blocked') ? 'bg-orange-100 text-orange-800' :
          account.status === 'sold' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {getGroupLabel(account.status)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onTransfer(account.id)}
          className="text-blue-600 hover:text-blue-700"
          title="Передати"
        >
          <Users className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(account.id)}
          className="text-red-600 hover:text-red-700"
          title="Видалити"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Групувати по:</span>
            <select
              value={groupBy}
              onChange={(e) => onGroupByChange(e.target.value as any)}
              className="input-field text-sm"
            >
              <option value="none">Без групування</option>
              <option value="platform">Платформа</option>
              <option value="status">Статус</option>
              <option value="category">Категорія</option>
              <option value="priority">Пріоритет</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Вид:</span>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => onViewModeChange('cards')}
                className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Всього: {accounts.length} аккаунтів
        </div>
      </div>

      {/* Groups */}
      {Object.entries(groups).map(([groupKey, groupAccounts]) => (
        <div key={groupKey} className={`border rounded-lg ${getGroupColor(groupKey)}`}>
          {/* Group Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {getGroupIcon(groupKey)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getGroupLabel(groupKey)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {groupAccounts.length} аккаунтів
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {groupAccounts.filter(acc => acc.status === 'ready_for_ads').length} готових
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {groupAccounts.filter(acc => acc.status.includes('farming')).length} в фармінгу
              </div>
            </div>
          </div>

          {/* Group Content */}
          <div className="p-4">
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupAccounts.map(renderAccountCard)}
              </div>
            ) : (
              <div className="space-y-2">
                {groupAccounts.map(renderAccountList)}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Немає аккаунтів
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Створіть перший аккаунт або змініть фільтри
          </p>
        </div>
      )}
    </div>
  )
} 