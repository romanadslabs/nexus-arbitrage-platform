'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card as UICard, StatCard } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import { useData } from '@/components/providers/DataProvider'
import { 
  CreditCard, 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  TestTube,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Settings,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react'

interface CardItem {
  id: string
  number: string
  type: 'visa' | 'mastercard' | 'amex'
  status: 'active' | 'blocked' | 'expired' | 'testing'
  balance: number
  currency: string
  country: string
  bank: string
  expiryDate: string
  cvv: string
  holderName: string
  createdAt: Date
  lastUsed?: Date
  notes?: string
}

interface ProxyItem {
  id: string
  ip: string
  port: number
  type: 'http' | 'https' | 'socks4' | 'socks5'
  status: 'active' | 'inactive' | 'testing' | 'blocked'
  country: string
  city?: string
  speed: number
  uptime: number
  username?: string
  password?: string
  createdAt: Date
  lastTested?: Date
  notes?: string
}

export default function CardsProxiesManager() {
  const { cards, proxies, isLoading, createCard, updateCard, deleteCard, createProxy, updateProxy, deleteProxy, refreshAllData } = useData()
  const [activeTab, setActiveTab] = useState<'cards' | 'proxies'>('cards')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CardItem | ProxyItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked' | 'testing'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  // Форма для додавання/редагування
  const [formData, setFormData] = useState({
    // Для карт
    cardNumber: '',
    cardType: 'visa' as CardItem['type'],
    holderName: '',
    expiryDate: '',
    cvv: '',
    cardCountry: '',
    bank: '',
    balance: '',
    currency: 'USD',
    cardNotes: '',
    
    // Для проксі
    ip: '',
    port: '',
    proxyType: 'http' as ProxyItem['type'],
    proxyCountry: '',
    city: '',
    username: '',
    password: '',
    speed: '',
    proxyNotes: ''
  })

  // Фільтрація карт
  const filteredCards = cards?.filter(card => {
    if (filterStatus !== 'all' && card.status !== filterStatus) return false
    if (searchQuery && !card.number.includes(searchQuery) && !card.holderName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) || []

  // Фільтрація проксі
  const filteredProxies = proxies?.filter(proxy => {
    if (filterStatus !== 'all' && proxy.status !== filterStatus) return false
    if (searchQuery && !proxy.ip.includes(searchQuery) && !proxy.country.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) || []

  // Додавання карти
  const handleAddCard = async () => {
    try {
      const newCard: Omit<CardItem, 'id' | 'createdAt'> = {
        number: formData.cardNumber,
        type: formData.cardType,
        status: 'active',
        balance: parseFloat(formData.balance) || 0,
        currency: formData.currency,
        country: formData.cardCountry,
        bank: formData.bank,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        holderName: formData.holderName,
        notes: formData.cardNotes
      }
      await createCard(newCard)
      setShowAddModal(false)
      setFormData({ cardNumber: '', cardType: 'visa', holderName: '', expiryDate: '', cvv: '', cardCountry: '', bank: '', balance: '', currency: 'USD', cardNotes: '', ip: '', port: '', proxyType: 'http', proxyCountry: '', city: '', username: '', password: '', speed: '', proxyNotes: '' })
    } catch (error) {
      console.error('Error adding card:', error)
    }
  }

  // Додавання проксі
  const handleAddProxy = async () => {
    try {
      const newProxy: Omit<ProxyItem, 'id' | 'createdAt'> = {
        ip: formData.ip,
        port: parseInt(formData.port) || 8080,
        type: formData.proxyType,
        status: 'active',
        country: formData.proxyCountry,
        city: formData.city,
        speed: parseFloat(formData.speed) || 0,
        uptime: 100,
        username: formData.username,
        password: formData.password,
        notes: formData.proxyNotes
      }
      await createProxy(newProxy)
      setShowAddModal(false)
      setFormData({ cardNumber: '', cardType: 'visa', holderName: '', expiryDate: '', cvv: '', cardCountry: '', bank: '', balance: '', currency: 'USD', cardNotes: '', ip: '', port: '', proxyType: 'http', proxyCountry: '', city: '', username: '', password: '', speed: '', proxyNotes: '' })
    } catch (error) {
      console.error('Error adding proxy:', error)
    }
  }

  // Тестування проксі
  const testProxy = async (proxyId: string) => {
    try {
      // Тут буде виклик API для тестування проксі
      console.log('Testing proxy:', proxyId)
    } catch (error) {
      console.error('Error testing proxy:', error)
    }
  }

  // Отримання кольору статусу
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'blocked': return 'red'
      case 'testing': return 'yellow'
      case 'expired': return 'gray'
      case 'inactive': return 'gray'
      default: return 'gray'
    }
  }

  // Отримання іконки статусу
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'blocked': return XCircle
      case 'testing': return Clock
      case 'expired': return AlertTriangle
      case 'inactive': return WifiOff
      default: return Clock
    }
  }

  // Маскування номера карти
  const maskCardNumber = (number: string) => {
    if (showSensitiveData) return number
    return number.replace(/(\d{4})\d{8}(\d{4})/, '$1 **** **** $2')
  }

  // Маскування CVV
  const maskCVV = (cvv: string) => {
    if (showSensitiveData) return cvv
    return '***'
  }

  if (isLoading.cards || isLoading.proxies) {
    return <LoadingState message="Завантаження карт та проксі..." />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              💳 Карти та проксі
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Управління платіжними картами та проксі-серверами
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              variant="outline"
              icon={showSensitiveData ? EyeOff : Eye}
            >
              {showSensitiveData ? 'Приховати' : 'Показати'} дані
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              icon={Plus}
            >
              Додати {activeTab === 'cards' ? 'карту' : 'проксі'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всього карт"
            value={cards?.length.toString() || '0'}
            icon={CreditCard}
            color="blue"
          />
          <StatCard
            title="Активних карт"
            value={cards?.filter(c => c.status === 'active').length.toString() || '0'}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Всього проксі"
            value={proxies?.length.toString() || '0'}
            icon={Globe}
            color="purple"
          />
          <StatCard
            title="Активних проксі"
            value={proxies?.filter(p => p.status === 'active').length.toString() || '0'}
            icon={Wifi}
            color="green"
          />
        </div>
      </motion.div>

      {/* Табы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'cards'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Платіжні карти
          </button>
          <button
            onClick={() => setActiveTab('proxies')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'proxies'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Проксі-сервери
          </button>
        </div>
      </motion.div>

      {/* Фільтри та пошук */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
            >
              <option value="all">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="blocked">Заблоковані</option>
              <option value="testing">Тестування</option>
            </select>
          </div>
          <Button
            onClick={() => {
              refreshAllData()
            }}
            variant="outline"
            icon={RefreshCw}
            size="sm"
          >
            Оновити
          </Button>
        </div>
      </motion.div>

      {/* Список карт */}
      {activeTab === 'cards' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              >
                <UICard
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{card.holderName}</h3>
                      <p className="text-sm text-gray-500">{card.bank}</p>
                    </div>
                    <div className={`p-2 rounded-full bg-${getStatusColor(card.status)}-100 text-${getStatusColor(card.status)}-600`}>
                      {React.createElement(getStatusIcon(card.status), { className: "w-5 h-5" })}
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Номер:</span>
                        <p className="font-mono text-sm">{maskCardNumber(card.number)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Тип:</span>
                        <p className="text-sm font-medium">{card.type.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Баланс:</span>
                        <p className="font-medium">{card.balance} {card.currency}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Статус:</span>
                        <div className="flex items-center space-x-1">
                          {React.createElement(getStatusIcon(card.status), {
                            className: `w-4 h-4 text-${getStatusColor(card.status)}-500`
                          })}
                          <span className={`text-sm font-medium text-${getStatusColor(card.status)}-600`}>
                            {card.status === 'active' ? 'Активна' :
                             card.status === 'blocked' ? 'Заблокована' :
                             card.status === 'expired' ? 'Протермінована' : 'Тестування'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Країна:</span>
                        <p className="text-sm">{card.country}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Термін дії:</span>
                        <p className="text-sm">{card.expiryDate}</p>
                      </div>
                    </div>

                    {card.notes && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Примітки:</span>
                        <p className="text-sm">{card.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Edit}
                        onClick={() => {
                          setSelectedItem(card)
                          setShowEditModal(true)
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Eye}
                      >
                        Деталі
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => deleteCard(card.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </UICard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Список проксі */}
      {activeTab === 'proxies' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProxies.map((proxy, index) => (
              <motion.div
                key={proxy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              >
                <UICard
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mono font-bold">{`${proxy.ip}:${proxy.port}`}</h3>
                      <p className="text-sm text-gray-500">{proxy.country}</p>
                    </div>
                    <div className={`p-2 rounded-full bg-${getStatusColor(proxy.status)}-100 text-${getStatusColor(proxy.status)}-600`}>
                      {React.createElement(getStatusIcon(proxy.status), { className: "w-5 h-5" })}
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Тип:</span>
                        <p className="text-sm font-medium">{proxy.type.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Статус:</span>
                        <div className="flex items-center space-x-1">
                          {React.createElement(getStatusIcon(proxy.status), {
                            className: `w-4 h-4 text-${getStatusColor(proxy.status)}-500`
                          })}
                          <span className={`text-sm font-medium text-${getStatusColor(proxy.status)}-600`}>
                            {proxy.status === 'active' ? 'Активний' :
                             proxy.status === 'inactive' ? 'Неактивний' :
                             proxy.status === 'blocked' ? 'Заблокований' : 'Тестування'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Швидкість:</span>
                        <p className="text-sm">{proxy.speed} ms</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uptime:</span>
                        <p className="text-sm">{proxy.uptime}%</p>
                      </div>
                    </div>

                    {proxy.city && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Місто:</span>
                        <p className="text-sm">{proxy.city}</p>
                      </div>
                    )}

                    {proxy.notes && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Примітки:</span>
                        <p className="text-sm">{proxy.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={TestTube}
                        onClick={() => testProxy(proxy.id)}
                      >
                        Тестувати
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Edit}
                        onClick={() => {
                          setSelectedItem(proxy)
                          setShowEditModal(true)
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Eye}
                      >
                        Деталі
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => deleteProxy(proxy.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </UICard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Модальне вікно додавання */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Додати {activeTab === 'cards' ? 'карту' : 'проксі'}
            </h3>
            
            {activeTab === 'cards' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Номер карти</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Тип</label>
                    <select
                      value={formData.cardType}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardType: e.target.value as CardItem['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">American Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Валюта</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="UAH">UAH</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Власник</label>
                    <input
                      type="text"
                      value={formData.holderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Термін дії</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="MM/YY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Баланс</label>
                    <input
                      type="number"
                      value={formData.balance}
                      onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Країна</label>
                    <input
                      type="text"
                      value={formData.cardCountry}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardCountry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Банк</label>
                    <input
                      type="text"
                      value={formData.bank}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Примітки</label>
                  <textarea
                    value={formData.cardNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">IP адреса</label>
                    <input
                      type="text"
                      value={formData.ip}
                      onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Порт</label>
                    <input
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="8080"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Тип</label>
                    <select
                      value={formData.proxyType}
                      onChange={(e) => setFormData(prev => ({ ...prev, proxyType: e.target.value as ProxyItem['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="http">HTTP</option>
                      <option value="https">HTTPS</option>
                      <option value="socks4">SOCKS4</option>
                      <option value="socks5">SOCKS5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Країна</label>
                    <input
                      type="text"
                      value={formData.proxyCountry}
                      onChange={(e) => setFormData(prev => ({ ...prev, proxyCountry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Місто</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Швидкість (мс)</label>
                    <input
                      type="number"
                      value={formData.speed}
                      onChange={(e) => setFormData(prev => ({ ...prev, speed: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Логін</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Пароль</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Примітки</label>
                  <textarea
                    value={formData.proxyNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, proxyNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="flex-1"
              >
                Скасувати
              </Button>
              <Button
                onClick={activeTab === 'cards' ? handleAddCard : handleAddProxy}
                variant="primary"
                className="flex-1"
              >
                Додати
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 