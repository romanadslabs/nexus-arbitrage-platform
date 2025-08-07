'use client'

import React, { useState } from 'react'
import { Search, Filter, X, RefreshCw } from 'lucide-react'
import { getStatusDisplayName, getStatusCategory } from '@/lib/accountStatus'

interface AccountFiltersProps {
  filters: {
    search: string
    platform: string
    status: string
    category: string
    priority: string
    tags: string[]
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export default function AccountFilters({ filters, onFiltersChange, onClearFilters }: AccountFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const platforms = ['Facebook', 'Google', 'TikTok', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn']
  const statuses = [
    'farming_day_1', 'farming_day_2', 'farming_day_3',
    'blocked_pp', 'blocked_system', 'blocked_passport',
    'ready_for_ads', 'dead', 'sold'
  ]
  const categories = ['personal', 'business', 'advertising', 'testing', 'backup']
  const priorities = ['low', 'medium', 'high', 'critical']

  const handleFilterChange = (key: string, value: string | string[]) => {
    onFiltersChange({ [key]: value })
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Фільтри
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Очистити
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Пошук аккаунтів..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Платформа
            </label>
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Всі платформи</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Всі статуси</option>
              <optgroup label="Фармінг">
                {statuses.filter(s => s.includes('farming')).map(status => (
                  <option key={status} value={status}>{getStatusDisplayName(status as any)}</option>
                ))}
              </optgroup>
              <optgroup label="Блокування">
                {statuses.filter(s => s.includes('blocked')).map(status => (
                  <option key={status} value={status}>{getStatusDisplayName(status as any)}</option>
                ))}
              </optgroup>
              <optgroup label="Статуси">
                {statuses.filter(s => !s.includes('farming') && !s.includes('blocked')).map(status => (
                  <option key={status} value={status}>{getStatusDisplayName(status as any)}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Категорія
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Всі категорії</option>
              {categories.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пріоритет
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Всі пріоритети</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                Пошук: {filters.search}
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.platform !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Платформа: {filters.platform}
                <button
                  onClick={() => handleFilterChange('platform', 'all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                Статус: {getStatusDisplayName(filters.status as any)}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 