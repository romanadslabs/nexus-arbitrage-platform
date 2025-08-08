'use client'

import React, { useEffect, useMemo, useState } from 'react'
import UnifiedDataTable from './UnifiedDataTable'
import { Database, Users, Target, CreditCard, RefreshCw } from 'lucide-react'
import { useData } from '@/components/providers/DataProvider'
import { OffersService } from '@/lib/offers'
import type { Offer } from '@/types/offers'

interface UnifiedDataViewProps {
  defaultTable?: 'accounts' | 'offers' | 'expenses' | 'team' | 'cards' | 'proxies' | 'campaigns'
}

export default function UnifiedDataView({ defaultTable = 'accounts' }: UnifiedDataViewProps) {
  const [selectedTable, setSelectedTable] = useState(defaultTable)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Реальні дані з DataProvider
  const { accounts, expenses, workspace, cards, proxies, campaigns } = useData()

  // Реальні оффери з localStorage
  const [offers, setOffers] = useState<Offer[]>([])
  const [offersLoading, setOffersLoading] = useState(false)
  const [offersError, setOffersError] = useState<string | null>(null)

  const loadOffers = () => {
    try {
      setOffersLoading(true)
      setOffersError(null)
      const data = OffersService.getAllOffers()
      setOffers(Array.isArray(data) ? data : [])
    } catch (e) {
      setOffersError('Не вдалося завантажити оффери')
    } finally {
      setOffersLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  // Поточні дані для таблиці у форматі, сумісному з UnifiedDataTable
  const currentData = useMemo(() => {
    switch (selectedTable) {
      case 'accounts': {
        const data = Array.isArray(accounts) ? accounts : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
      }
      case 'offers': {
        const data = Array.isArray(offers) ? offers : []
        return { data, loading: offersLoading, error: offersError, refetch: loadOffers, total: data.length }
      }
      case 'expenses': {
        const data = Array.isArray(expenses) ? expenses : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
      }
      case 'team': {
        const data = Array.isArray(workspace?.team) ? workspace!.team : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
      }
      case 'cards': {
        const data = Array.isArray(cards) ? cards : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
      }
      case 'proxies': {
        const data = Array.isArray(proxies) ? proxies : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
  }
      case 'campaigns': {
        const data = Array.isArray(campaigns) ? campaigns : []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: data.length }
      }
      default: {
        const data: any[] = []
        return { data, loading: false, error: null as string | null, refetch: () => {}, total: 0 }
      }
    }
  }, [selectedTable, accounts, offers, offersLoading, offersError, expenses, workspace, cards, proxies, campaigns])

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
          { key: 'amount', label: 'Сума', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'date', label: 'Дата', type: 'date' as const, sortable: true, filterable: false },
          { key: 'accountId', label: 'ID аккаунта', type: 'text' as const, sortable: true, filterable: true },
          { key: 'description', label: 'Опис', type: 'text' as const, sortable: false, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'team':
        return [
          { key: 'name', label: 'Ім\'я', type: 'text' as const, sortable: true, filterable: true },
          { key: 'role', label: 'Роль', type: 'badge' as const, sortable: true, filterable: true }
        ]

      case 'cards':
        return [
          { key: 'number', label: 'Номер', type: 'text' as const, sortable: true, filterable: false },
          { key: 'type', label: 'Тип', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'balance', label: 'Баланс', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'country', label: 'Країна', type: 'text' as const, sortable: true, filterable: true },
          { key: 'bank', label: 'Банк', type: 'text' as const, sortable: true, filterable: true },
          { key: 'cost', label: 'Собівартість', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'assignedTo', label: 'Призначено', type: 'text' as const, sortable: false, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'proxies':
        return [
          { key: 'ip', label: 'IP', type: 'text' as const, sortable: true, filterable: false },
          { key: 'port', label: 'Порт', type: 'number' as const, sortable: true, filterable: false },
          { key: 'type', label: 'Тип', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'country', label: 'Країна', type: 'text' as const, sortable: true, filterable: true },
          { key: 'speed', label: 'Швидкість', type: 'number' as const, sortable: true, filterable: false },
          { key: 'uptime', label: 'Uptime %', type: 'percentage' as const, sortable: true, filterable: false },
          { key: 'cost', label: 'Собівартість', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'assignedTo', label: 'Призначено', type: 'text' as const, sortable: false, filterable: false },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false }
        ]

      case 'campaigns':
        return [
          { key: 'name', label: 'Назва', type: 'text' as const, sortable: true, filterable: true },
          { key: 'platform', label: 'Платформа', type: 'badge' as const, sortable: true, filterable: true },
          { key: 'status', label: 'Статус', type: 'status' as const, sortable: true, filterable: true },
          { key: 'budget', label: 'Бюджет', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'spent', label: 'Витрачено', type: 'currency' as const, sortable: true, filterable: false },
          { key: 'accountId', label: 'ID аккаунта', type: 'text' as const, sortable: true, filterable: true },
          { key: 'launcherId', label: 'Launcher', type: 'text' as const, sortable: true, filterable: true },
          { key: 'createdAt', label: 'Створено', type: 'date' as const, sortable: true, filterable: false },
          { key: 'updatedAt', label: 'Оновлено', type: 'date' as const, sortable: true, filterable: false }
        ]

      default:
        return []
    }
  }

  // Обробники дій
  const handleEdit = (id: string) => {
    console.log(`Редагування ${selectedTable} з ID:`, id)
  }

  const handleDelete = (id: string) => {
    console.log(`Видалення ${selectedTable} з ID:`, id)
  }

  const handleView = (id: string) => {
    console.log(`Перегляд ${selectedTable} з ID:`, id)
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
          description: 'Реальні аккаунти з розділу Аккаунти',
          icon: Users
        }
      case 'offers':
        return {
          title: 'Оффери',
          description: 'Реальні оффери з локального сховища',
          icon: Target
        }
      case 'expenses':
        return {
          title: 'Витрати',
          description: 'Реальні витрати, пов\'язані з аккаунтами/кампаніями',
          icon: CreditCard
        }
      case 'team':
        return {
          title: 'Команда',
          description: 'Учасники команди з робочого простору',
          icon: Users
        }
      case 'cards':
        return {
          title: 'Карти',
          description: 'Платіжні карти та їх статуси',
          icon: CreditCard
        }
      case 'proxies':
        return {
          title: 'Проксі',
          description: 'Проксі-сервери, стан і призначення',
          icon: Database
        }
      case 'campaigns':
        return {
          title: 'Кампанії',
          description: 'Реальні кампанії з розділу Кампанії',
          icon: Target
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
          { key: 'team', label: 'Команда', icon: Users },
          { key: 'cards', label: 'Карти', icon: CreditCard },
          { key: 'proxies', label: 'Проксі', icon: Database },
          { key: 'campaigns', label: 'Кампанії', icon: Target }
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