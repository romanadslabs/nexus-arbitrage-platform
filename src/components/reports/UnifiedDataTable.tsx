'use client'

import React, { useState, useMemo } from 'react'
import { 
  Search,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface UnifiedDataTableProps {
  data: any[]
  columns: Column[]
  title: string
  description?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onExport?: () => void
  onRefresh?: () => void
  isLoading?: boolean
  pageSize?: number
}

interface Column {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'status' | 'currency' | 'percentage' | 'badge' | 'action'
  sortable?: boolean
  filterable?: boolean
  width?: string
  formatter?: (value: any) => string | React.ReactNode
}

export default function UnifiedDataTable({
  data,
  columns,
  title,
  description,
  onEdit,
  onDelete,
  onView,
  onExport,
  onRefresh,
  isLoading = false,
  pageSize = 10
}: UnifiedDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})

  // Фільтрація даних
  const filteredData = useMemo(() => {
    let result = data

    // Пошук
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Фільтри
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => String(item[key]).toLowerCase() === value.toLowerCase())
      }
    })

    // Сортування
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()
        
        if (sortDirection === 'asc') {
          return aString.localeCompare(bString)
        } else {
          return bString.localeCompare(aString)
        }
      })
    }

    return result
  }, [data, searchTerm, filters, sortColumn, sortDirection])

  // Пагінація
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Обробка сортування
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  // Обробка фільтрів
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
    setCurrentPage(1)
  }

  // Форматування значень
  const formatValue = (value: any, column: Column) => {
    if (column.formatter) {
      return column.formatter(value)
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('uk-UA', {
          style: 'currency',
          currency: 'USD'
        }).format(value || 0)
      
      case 'percentage':
        return `${(value || 0).toFixed(2)}%`
      
      case 'number':
        return new Intl.NumberFormat('uk-UA').format(value || 0)
      
      case 'date':
        return value ? new Date(value).toLocaleDateString('uk-UA') : '-'
      
      case 'status':
        const statusClass = getStatusClass(value)
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {value || 'Unknown'}
          </span>
        )
      
      case 'badge':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {value || '-'}
          </span>
        )
      
      default:
        return value || '-'
    }
  }

  // Визначення класу статусу
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Отримання унікальних значень для фільтрів
  const getUniqueValues = (columnKey: string) => {
    const values = Array.from(new Set(data.map(item => item[columnKey]).filter(Boolean)))
    return values.sort()
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Заголовок */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            {onExport && (
              <button 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
                Експорт
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Пошук та фільтри */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук по всіх полях..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Фільтри для колонок */}
          <div className="flex gap-2 flex-wrap">
            {columns
              .filter(col => col.filterable)
              .map(column => (
                <select
                  key={column.key}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{column.label}</option>
                  {getUniqueValues(column.key).map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ))}
          </div>
        </div>

        {/* Таблиця */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 w-20">
                    Дії
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      Завантаження...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Немає даних для відображення
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {columns.map(column => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {formatValue(item[column.key], column)}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          {onView && (
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                              onClick={() => onView(item.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                              onClick={() => onEdit(item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                              onClick={() => onDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Пагінація */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Показано {startIndex + 1}-{Math.min(endIndex, filteredData.length)} з {filteredData.length} записів
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Попередня
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Наступна
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 