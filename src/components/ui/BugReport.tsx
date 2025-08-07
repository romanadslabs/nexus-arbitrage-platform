'use client'

import React, { useState } from 'react'
import { 
  Bug, 
  X, 
  Send, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface BugReportProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function BugReport({ isOpen = false, onClose }: BugReportProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    severity: 'medium',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Тут можна додати відправку на сервер
      // Поки що зберігаємо в localStorage
      const reports = JSON.parse(localStorage.getItem('bugReports') || '[]')
      const newReport = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'new'
      }
      reports.push(newReport)
      localStorage.setItem('bugReports', JSON.stringify(reports))

      // Симулюємо затримку
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          title: '',
          description: '',
          steps: '',
          expected: '',
          actual: '',
          severity: 'medium',
          email: ''
        })
        onClose?.()
      }, 2000)
    } catch (error) {
      console.error('Error submitting bug report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Bug className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Звіт про помилку
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Допоможіть нам покращити систему
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Дякуємо за звіт!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ваш звіт успішно відправлено. Ми розглянемо його найближчим часом.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Короткий опис проблеми *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Наприклад: Не завантажуються кампанії"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Детальний опис *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Опишіть проблему детально..."
                />
              </div>

              {/* Steps to reproduce */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Кроки для відтворення *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.steps}
                  onChange={(e) => handleInputChange('steps', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="1. Відкрив сторінку кампаній&#10;2. Натиснув кнопку 'Оновити'&#10;3. Побачив помилку..."
                />
              </div>

              {/* Expected vs Actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Очікувана поведінка
                  </label>
                  <textarea
                    rows={3}
                    value={formData.expected}
                    onChange={(e) => handleInputChange('expected', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Що має статися..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Фактична поведінка
                  </label>
                  <textarea
                    rows={3}
                    value={formData.actual}
                    onChange={(e) => handleInputChange('actual', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Що сталося насправді..."
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Важливість *
                </label>
                <select
                  required
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="low">Низька - не критично</option>
                  <option value="medium">Середня - помітно, але не критично</option>
                  <option value="high">Висока - заважає роботі</option>
                  <option value="critical">Критична - система не працює</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (для зв'язку)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Відправка...' : 'Відправити звіт'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 