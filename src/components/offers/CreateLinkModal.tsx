'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { X, Save, Link, Copy, Plus, Tag } from 'lucide-react'
import { OfferLink } from '@/types/offers'

interface CreateLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (link: Omit<OfferLink, 'id' | 'createdAt'>) => void
  offerId: string
  offerName: string
}

export default function CreateLinkModal({ 
  isOpen, 
  onClose, 
  onSave, 
  offerId, 
  offerName 
}: CreateLinkModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    status: 'active' as const,
    accountId: '',
    notes: '',
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      // Генеруємо унікальний ID для відстеження
      const uniqueId = `${offerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      await onSave({
        offerId,
        name: formData.name,
        url: formData.url,
        uniqueId,
        status: formData.status,
        createdBy: user.id,
        accountId: formData.accountId || undefined,
        notes: formData.notes,
        tags: formData.tags
      })

      // Reset form
      setFormData({
        name: '',
        url: '',
        status: 'active',
        accountId: '',
        notes: '',
        tags: []
      })
      onClose()
    } catch (error) {
      console.error('Помилка створення посилання:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateTrackingUrl = () => {
    const baseUrl = formData.url || 'https://example.com'
    const trackingId = `${offerId}-${Date.now()}`
    const trackingUrl = `${baseUrl}?utm_source=nexus&utm_medium=affiliate&utm_campaign=${trackingId}`
    setFormData(prev => ({ ...prev, url: trackingUrl }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Створити посилання для відстеження
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Оффер */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Оффер
            </label>
            <input
              type="text"
              value={offerName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Назва посилання */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Назва посилання *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Наприклад: Gaming App - US Mobile"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL для відстеження *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/offer"
                required
              />
              <button
                type="button"
                onClick={generateTrackingUrl}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                title="Згенерувати URL з відстеженням"
              >
                <Link size={16} />
              </button>
            </div>
          </div>

          {/* Статус та аккаунт */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Активне</option>
                <option value="paused">На паузі</option>
                <option value="archived">Архівоване</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Аккаунт (опціонально)
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Не вибрано</option>
                <option value="account_1">Google Ads US</option>
                <option value="account_2">Facebook Ads</option>
                <option value="account_3">TikTok Ads</option>
              </select>
            </div>
          </div>

          {/* Теги */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Теги
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Додати тег..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm flex items-center gap-1"
                >
                  <Tag size={12} />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Нотатки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Нотатки
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Додайте нотатки про це посилання..."
            />
          </div>

          {/* Приклад відстеження */}
          {formData.url && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Приклад URL з відстеженням
              </h4>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                  {formData.url}?utm_source=nexus&utm_medium=affiliate&utm_campaign={offerId}-{Date.now()}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${formData.url}?utm_source=nexus&utm_medium=affiliate&utm_campaign=${offerId}-${Date.now()}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Копіювати"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.url}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Створення...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Створити посилання
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // Тут можна додати повідомлення про успішне копіювання
} 