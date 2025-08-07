'use client'

import React, { useState } from 'react'
import { 
  Database, Key, Settings, CheckCircle, 
  AlertCircle, RefreshCw, Save, Eye, EyeOff
} from 'lucide-react'
import { useAirtableConnection } from '@/hooks/useAirtable'

export default function AirtableSettings() {
  const { isConnected, loading, checkConnection } = useAirtableConnection()
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [baseId, setBaseId] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Тут буде логіка збереження налаштувань
      console.log('Saving Airtable settings:', { apiKey, baseId })
      
      // Симуляція збереження
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Перевіряємо підключення після збереження
      await checkConnection()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    await checkConnection()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Налаштування Airtable
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Конфігурація інтеграції з Airtable
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        isConnected 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Статус підключення
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Підключено до Airtable' : 'Не підключено до Airtable'}
            </p>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="ml-auto btn-secondary text-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Перевірити
          </button>
        </div>
      </div>

      {/* API Configuration */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введіть ваш Airtable API Key"
              className="form-input pr-10 w-full"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Знайдіть ваш API Key в налаштуваннях Airtable
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Base ID
          </label>
          <input
            type="text"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            placeholder="Введіть ID вашої бази даних"
            className="form-input w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            ID бази даних можна знайти в URL Airtable
          </p>
        </div>
      </div>

      {/* Table Structure */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Структура таблиць
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Accounts</h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Name (Single line text)</li>
              <li>• Email (Email)</li>
              <li>• Phone (Phone number)</li>
              <li>• Platform (Single select)</li>
              <li>• Status (Single select)</li>
              <li>• Category (Single select)</li>
              <li>• FarmerID (Single line text)</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Campaigns</h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Name (Single line text)</li>
              <li>• Platform (Single select)</li>
              <li>• Status (Single select)</li>
              <li>• Budget (Currency)</li>
              <li>• Spent (Currency)</li>
              <li>• Revenue (Currency)</li>
              <li>• Clicks (Number)</li>
              <li>• Conversions (Number)</li>
              <li>• ROI (Percent)</li>
              <li>• OfferID (Single line text)</li>
              <li>• StartDate (Date)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving || !apiKey || !baseId}
          className="btn-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Збереження...' : 'Зберегти налаштування'}
        </button>
        <button
          onClick={handleTestConnection}
          disabled={loading}
          className="btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Тестувати підключення
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Інструкції по налаштуванню
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Створіть базу даних в Airtable з таблицями Accounts та Campaigns</li>
          <li>2. Налаштуйте поля відповідно до структури вище</li>
          <li>3. Отримайте API Key в налаштуваннях вашого акаунту Airtable</li>
          <li>4. Скопіюйте Base ID з URL вашої бази даних</li>
          <li>5. Введіть дані в поля вище та збережіть налаштування</li>
        </ol>
      </div>
    </div>
  )
} 