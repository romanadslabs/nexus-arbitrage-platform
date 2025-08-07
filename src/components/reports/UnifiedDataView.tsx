'use client'

import React, { useState } from 'react'
import { useAccounts, useOffers, useExpenses, useTeamMembers } from '@/hooks/useUnifiedData'
import UnifiedDataTable from './UnifiedDataTable'
import { Database, Users, Target, CreditCard, RefreshCw } from 'lucide-react'

interface UnifiedDataViewProps {
  defaultTable?: 'accounts' | 'offers' | 'expenses' | 'team'
}

export default function UnifiedDataView({ defaultTable = 'accounts' }: UnifiedDataViewProps) {
  const [selectedTable, setSelectedTable] = useState(defaultTable)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Використання хуків для отримання даних
  const accountsData = useAccounts({ filters: selectedTable === 'accounts' ? filters : undefined })
  const offersData = useOffers({ filters: selectedTable === 'offers' ? filters : undefined })
  const expensesData = useExpenses({ filters: selectedTable === 'expenses' ? filters : undefined })
  const teamData = useTeamMembers({ filters: selectedTable === 'team' ? filters : undefined })

  // Отримання поточних даних
  const getCurrentData = () => {
    switch (selectedTable) {
      case 'accounts':
        return accountsData
      case 'offers':
        return offersData
      case 'expenses':
        return expensesData
      case 'team':
        return teamData
      default:
        return accountsData
    }
  }

  const currentData = getCurrentData()

  // Конфігурація колонок для кожної таблиці
  const getColumns = () => {
    switch (selectedTable) {
      case 'accounts':
        return [
          { key: 'name', label: 'Назва', type: 'text' as const, sortable: true, filterable: true },
          { key: 'email', label: 'Email', type: 'text' as const, sortable: true, filterable: true },
          { key: 'phone', label: 'Телефон', type: 'text' as const, sortable: false, filterable: false },
          { key: 'platform', label: 'Платформа', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'category', label: 'Категорія', type: 'text' as const, sortable: true, filterable: true },
          { key: 'priority', label: 'Пріоритет', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'farmerId', label: 'Farmer ID', type: 'text' as const, sortable: false, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'offers':
        return [
          { key: 'name', label: 'Назва', type: 'text' as const, sortable: true, filterable: true },
          { key: 'vertical', label: 'Вертикаль', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'source', label: 'Джерело', type: 'text' as const, sortable: true, filterable: true },
          { key: 'rate', label: 'Ставка', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'revenue', label: 'Дохід', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'expenses', label: 'Витрати', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'roi', label: 'ROI', type: 'percentage' as const, sortable: true, filterable: false },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'period', label: 'Період', type: 'text' as const, sortable: true, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'expenses':
        return [
          { key: 'name', label: 'Назва', type: 'text' as const, sortable: true, filterable: true },
          { key: 'expenseType', label: 'Тип', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'amount', label: 'Сума', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'linkedOffer', label: 'Пов\'язаний оффер', type: 'text' as const, sortable: false, filterable: false },
          { key: 'linkedCard', label: 'Пов\'язана карта', type: 'text' as const, sortable: false, filterable: false },
          { key: 'linkedProxy', label: 'Пов\'язаний проксі', type: 'text' as const, sortable: false, filterable: false },
          { key: 'date', label: 'Дата', type: 'date' as const, sortable: true, filterable: false },
          { key: 'description', label: 'Опис', type: 'text' as const, sortable: false, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'team':
        return [
          { key: 'name', label: 'Ім\'я', type: 'text' as const, sortable: true, filterable: true },
          { key: 'email', label: 'Email', type: 'text' as const, sortable: true, filterable: true },
          { key: 'role', label: 'Роль', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'joinDate', label: 'Дата приєднання', type: 'date' as const, sortable: true, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      default:
        return []
    }
  }

  // Обробники дій
  const handleEdit = (id: string) => {
    console.log(`Редагування ${selectedTable} з ID:`, id)
    // Тут можна додати логіку редагування
  }

  const handleDelete = (id: string) => {
    console.log(`Видалення ${selectedTable} з ID:`, id)
    // Тут можна додати логіку видалення
  }

  const handleView = (id: string) => {
    console.log(`Перегляд ${selectedTable} з ID:`, id)
    // Тут можна додати логіку перегляду
  }

  const handleExport = () => {
    const data = currentData.data
    const csvContent = generateCSV(data, getColumns())
    downloadCSV(csvContent, `${selectedTable}_export.csv`)
  }

  const handleRefresh = () => {
    currentData.refetch()
  }

  // Генерація CSV
  const generateCSV = (data: any[], columns: any[]) => {
    const headers = columns.map(col => col.label).join(',')
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    )
    return [headers, ...rows].join('\n')
  }

  // Завантаження CSV
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Отримання заголовка та опису
  const getTableInfo = () => {
    switch (selectedTable) {
      case 'accounts':
        return {
          title: 'Аккаунти',
          description: 'Управління рекламними аккаунтами з різних платформ',
          icon: Users
        }
      case 'offers':
        return {
          title: 'Оффери',
          description: 'Оффери з різних вертикалей та джерел трафіку',
          icon: Target
        }
      case 'expenses':
        return {
          title: 'Витрати',
          description: 'Витрати по категоріях та зв\'язки з офферами',
          icon: CreditCard
        }
      case 'team':
        return {
          title: 'Команда',
          description: 'Члени команди та їх ролі',
          icon: Users
        }
      default:
        return {
          title: 'Дані',
          description: 'Перегляд даних',
          icon: Database
        }
    }
  }

  const tableInfo = getTableInfo()
  const IconComponent = tableInfo.icon

  return (
    <div className="space-y-6">
      {/* Навігація по таблицях */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'accounts', label: 'Аккаунти', icon: Users },
          { key: 'offers', label: 'Оффери', icon: Target },
          { key: 'expenses', label: 'Витрати', icon: CreditCard },
          { key: 'team', label: 'Команда', icon: Users }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedTable(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              selectedTable === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Уніфікована таблиця */}
      <UnifiedDataTable
        data={currentData.data}
        columns={getColumns()}
        title={tableInfo.title}
        description={tableInfo.description}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isLoading={currentData.loading}
        pageSize={10}
      />

      {/* Помилка */}
      {currentData.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-red-500" />
            <span className="text-red-700 dark:text-red-400 font-medium">
              Помилка завантаження даних
            </span>
          </div>
          <p className="text-red-600 dark:text-red-300 mt-1">
            {currentData.error}
          </p>
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Всього записів
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {currentData.total}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Статус
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {currentData.loading ? 'Завантаження...' : 'Активний'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Таблиця
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {tableInfo.title}
          </p>
        </div>
      </div>
    </div>
  )
} 