'use client'

import React, { useEffect, useState } from 'react'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export default function AccountModal({ isOpen, onClose, onSave, initialData }: AccountModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'Facebook',
    status: 'ready_for_farm',
    trafficType: 'paid',
    priority: 'medium',
    category: 'personal',
    tags: '' as string,
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        platform: initialData.platform || 'Facebook',
        status: initialData.status || 'ready_for_farm',
        trafficType: initialData.trafficType || 'paid',
        priority: initialData.priority || 'medium',
        category: initialData.category || 'personal',
        tags: (initialData.tags || []).join(', '),
      })
    }
  }, [initialData])

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      platform: form.platform,
      status: form.status,
      trafficType: form.trafficType,
      priority: form.priority,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      aiEvaluation: '',
      automations: [],
    }
    onSave(payload)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Редагувати акаунт' : 'Створити акаунт'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ім'я</label>
              <input className="w-full p-2 border rounded" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full p-2 border rounded" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input className="w-full p-2 border rounded" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Платформа</label>
              <select className="w-full p-2 border rounded" value={form.platform} onChange={e => handleChange('platform', e.target.value)}>
                <option>Facebook</option>
                <option>Google</option>
                <option>TikTok</option>
                <option>Instagram</option>
                <option>YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Статус</label>
              <select className="w-full p-2 border rounded" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                <option value="ready_for_farm">Готовий до фарму</option>
                <option value="farming_day_1">Фармінг День 1</option>
                <option value="farming_day_2">Фармінг День 2</option>
                <option value="farming_day_3">Фармінг День 3</option>
                <option value="ready_for_ads">Готовий до реклами</option>
                <option value="blocked_pp">Бан PP</option>
                <option value="blocked_system">Бан Система</option>
                <option value="blocked_passport">Бан Паспорт</option>
                <option value="sold">Продано</option>
                <option value="dead">Мертвий</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Тип трафіку</label>
              <select className="w-full p-2 border rounded" value={form.trafficType} onChange={e => handleChange('trafficType', e.target.value)}>
                <option value="paid">Платний</option>
                <option value="organic">Органічний</option>
                <option value="other">Інший</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пріоритет</label>
              <select className="w-full p-2 border rounded" value={form.priority} onChange={e => handleChange('priority', e.target.value)}>
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
                <option value="urgent">Терміновий</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Категорія</label>
              <select className="w-full p-2 border rounded" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                <option value="personal">Особистий</option>
                <option value="business">Бізнес</option>
                <option value="advertising">Рекламний</option>
                <option value="testing">Тестовий</option>
                <option value="backup">Резервний</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Теги (через кому)</label>
              <input className="w-full p-2 border rounded" value={form.tags} onChange={e => handleChange('tags', e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Скасувати</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  )
} 