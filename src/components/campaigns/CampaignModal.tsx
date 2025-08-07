'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Target, DollarSign, Calendar, BarChart3, Users } from 'lucide-react'
import { Campaign } from '@/types'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  campaign?: Campaign | null
  onSave: (campaign: Partial<Campaign>) => void
  mode: 'create' | 'edit'
  availableAccounts: any[]
}

export default function CampaignModal({ isOpen, onClose, campaign, onSave, mode, availableAccounts }: CampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    offerId: '',
    accountId: '',
    launcherId: '',
    budget: 0,
    platform: 'Facebook' as 'Facebook' | 'Google' | 'TikTok' | 'Instagram' | 'YouTube',
    status: 'active' as 'active' | 'paused' | 'completed' | 'failed',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    creatives: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (campaign && mode === 'edit') {
      setFormData({
        name: campaign.name || '',
        offerId: campaign.offerId || '',
        accountId: campaign.accountId || '',
        launcherId: campaign.launcherId || '',
        budget: campaign.budget || 0,
        platform: campaign.platform || 'Facebook',
        status: campaign.status || 'active',
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
        creatives: campaign.creatives || []
      })
    } else {
      setFormData({
        name: '',
        offerId: '',
        accountId: '',
        launcherId: '',
        budget: 0,
        platform: 'Facebook',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        creatives: []
      })
    }
    setErrors({})
  }, [campaign, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Назва кампанії обов\'язкова'
    }

    if (!formData.offerId.trim()) {
      newErrors.offerId = 'ID офери обов\'язковий'
    }

    if (!formData.accountId.trim()) {
      newErrors.accountId = 'Аккаунт обов\'язковий'
    }

    if (!formData.launcherId.trim()) {
      newErrors.launcherId = 'ID арбітражника обов\'язковий'
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Бюджет повинен бути більше 0'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата початку обов\'язкова'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const campaignData: Partial<Campaign> = {
      ...formData,
      platform: formData.platform as 'Facebook' | 'Google' | 'TikTok' | 'Instagram' | 'YouTube',
      status: formData.status as 'active' | 'paused' | 'completed' | 'failed',
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      createdAt: mode === 'create' ? new Date() : campaign?.createdAt,
      updatedAt: new Date()
    }

    onSave(campaignData)
    onClose()
  }

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addCreative = (creative: string) => {
    if (creative.trim() && !formData.creatives.includes(creative.trim())) {
      handleInputChange('creatives', [...formData.creatives, creative.trim()])
    }
  }

  const removeCreative = (creativeToRemove: string) => {
    handleInputChange('creatives', formData.creatives.filter(creative => creative !== creativeToRemove))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Створити кампанію' : 'Редагувати кампанію'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Створення нової рекламної кампанії' : 'Оновлення існуючої кампанії'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Основна інформація</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Назва кампанії *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Введіть назву кампанії"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Офери *
                </label>
                <input
                  type="text"
                  value={formData.offerId}
                  onChange={(e) => handleInputChange('offerId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.offerId 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="offer-1"
                />
                {errors.offerId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.offerId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account and Launcher */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Аккаунт та арбітражник</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Аккаунт *
                </label>
                <select
                  value={formData.accountId}
                  onChange={(e) => handleInputChange('accountId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.accountId 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="">Виберіть аккаунт</option>
                  {availableAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.platform})
                    </option>
                  ))}
                </select>
                {errors.accountId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accountId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Арбітражника *
                </label>
                <input
                  type="text"
                  value={formData.launcherId}
                  onChange={(e) => handleInputChange('launcherId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.launcherId 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="launcher-1"
                />
                {errors.launcherId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.launcherId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Budget and Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Бюджет та платформа</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Бюджет ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.budget 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="100"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Платформа
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status and Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Статус та дати</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Активна</option>
                  <option value="paused">Призупинена</option>
                  <option value="completed">Завершена</option>
                  <option value="failed">Невдала</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата початку *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.startDate 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата завершення
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Creatives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Креативи
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Додати креатив..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCreative((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {formData.creatives.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.creatives.map((creative, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {creative}
                      <button
                        type="button"
                        onClick={() => removeCreative(creative)}
                        className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="w-4 h-4" />
              <span>{mode === 'create' ? 'Створити' : 'Зберегти'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 