'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Command } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'account' | 'campaign' | 'user' | 'report'
  title: string
  subtitle: string
  icon: string
  href: string
}

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ onSearch, placeholder = "Пошук...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search results - replace with real search logic
  const results: SearchResult[] = [
    {
      id: '1',
      type: 'account',
      title: 'Facebook Business Account',
      subtitle: 'Активний аккаунт з 5 кампаніями',
      icon: '📱',
      href: '/accounts/1'
    },
    {
      id: '2',
      type: 'campaign',
      title: 'E-commerce Campaign',
      subtitle: 'ROI: 245%, Витрати: $1,250',
      icon: '🎯',
      href: '/campaigns/2'
    },
    {
      id: '3',
      type: 'user',
      title: 'Іван Петренко',
      subtitle: 'Менеджер кампаній',
      icon: '👤',
      href: '/users/3'
    },
    {
      id: '4',
      type: 'report',
      title: 'Звіт за січень 2025',
      subtitle: 'Загальний дохід: $15,420',
      icon: '📊',
      href: '/reports/4'
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
      }

      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          } else {
            handleSearch()
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, results, selectedIndex])

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim())
      setIsOpen(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    // Navigate to result
    window.location.href = result.href
    setIsOpen(false)
    setQuery('')
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'account':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'campaign':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'report':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.subtitle.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Результати пошуку ({filteredResults.length})
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>↑↓ для навігації</span>
                <span>Enter для вибору</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="py-2">
            {filteredResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{result.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(result.type)}`}>
                        {result.type === 'account' && 'Аккаунт'}
                        {result.type === 'campaign' && 'Кампанія'}
                        {result.type === 'user' && 'Користувач'}
                        {result.type === 'report' && 'Звіт'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Натисніть Enter для пошуку</span>
              <div className="flex items-center space-x-1">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-6 text-center">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Немає результатів для "{query}"
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Спробуйте інші ключові слова
          </p>
        </div>
      )}
    </div>
  )
} 