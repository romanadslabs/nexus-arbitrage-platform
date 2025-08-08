'use client'

import React, { useState, useEffect } from 'react'
import { Card, Proxy } from '@/types'
import { useAuth } from '@/components/providers/AuthProvider'
import { 
  Plus, 
  CreditCard, 
  Globe, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  User, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Tag,
  Link,
  Unlink,
  MessageSquare
} from 'lucide-react'

// Local Storage Keys
const LOCAL_STORAGE_KEYS = {
  CARDS: 'nexus_local_cards',
  PROXIES: 'nexus_local_proxies',
  ACCOUNTS: 'nexus_local_accounts'
}

// Утиліти для localStorage
const localStorageUtils = {
  get: function<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },
  set: function<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }
}

// Сервіси для управління даними
const CardsService = {
  getAllCards: (): Card[] => localStorageUtils.get(LOCAL_STORAGE_KEYS.CARDS, []),
  createCard: (cardData: Omit<Card, 'id' | 'createdAt'>): void => {
    const cards = CardsService.getAllCards()
    const newCard: Card = {
      ...cardData,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    cards.push(newCard)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, cards)
  },
  updateCard: (id: string, updates: Partial<Card>): void => {
    const cards = CardsService.getAllCards()
    const index = cards.findIndex(card => card.id === id)
    if (index !== -1) {
      cards[index] = { ...cards[index], ...updates }
      localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, cards)
    }
  },
  addNote: (id: string, note: string): void => {
    const cards = CardsService.getAllCards()
    const index = cards.findIndex(card => card.id === id)
    if (index === -1) return
    const prev = cards[index].notes || ''
    const combined = prev ? `${prev}\n${note}` : note
    cards[index] = { ...cards[index], notes: combined }
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, cards)
  },
  deleteCard: (id: string): void => {
    const cards = CardsService.getAllCards()
    const filteredCards = cards.filter(card => card.id !== id)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, filteredCards)
  },
  assignCard: (cardId: string, accountId: string, assignedBy: string): void => {
    CardsService.updateCard(cardId, {
      assignedTo: accountId,
      assignedBy,
      assignedAt: new Date(),
      status: 'assigned'
    })
  },
  unassignCard: (cardId: string): void => {
    CardsService.updateCard(cardId, {
      assignedTo: undefined,
      assignedBy: undefined,
      assignedAt: undefined,
      status: 'active'
    })
  }
}

const ProxiesService = {
  getAllProxies: (): Proxy[] => localStorageUtils.get(LOCAL_STORAGE_KEYS.PROXIES, []),
  createProxy: (proxyData: Omit<Proxy, 'id' | 'createdAt'>): void => {
    const proxies = ProxiesService.getAllProxies()
    const newProxy: Proxy = {
      ...proxyData,
      id: `proxy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    proxies.push(newProxy)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, proxies)
  },
  updateProxy: (id: string, updates: Partial<Proxy>): void => {
    const proxies = ProxiesService.getAllProxies()
    const index = proxies.findIndex(proxy => proxy.id === id)
    if (index !== -1) {
      proxies[index] = { ...proxies[index], ...updates }
      localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, proxies)
    }
  },
  addNote: (id: string, note: string): void => {
    const proxies = ProxiesService.getAllProxies()
    const index = proxies.findIndex(proxy => proxy.id === id)
    if (index === -1) return
    const prev = proxies[index].notes || ''
    const combined = prev ? `${prev}\n${note}` : note
    proxies[index] = { ...proxies[index], notes: combined }
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, proxies)
  },
  deleteProxy: (id: string): void => {
    const proxies = ProxiesService.getAllProxies()
    const filteredProxies = proxies.filter(proxy => proxy.id !== id)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, filteredProxies)
  },
  assignProxy: (proxyId: string, accountId: string, assignedBy: string): void => {
    ProxiesService.updateProxy(proxyId, {
      assignedTo: accountId,
      assignedBy,
      assignedAt: new Date(),
      status: 'assigned'
    })
  },
  unassignProxy: (proxyId: string): void => {
    ProxiesService.updateProxy(proxyId, {
      assignedTo: undefined,
      assignedBy: undefined,
      assignedAt: undefined,
      status: 'active'
    })
  }
}

const AccountsService = {
  getAllAccounts: () => localStorageUtils.get(LOCAL_STORAGE_KEYS.ACCOUNTS, [])
}

// Компоненти модальних вікон
const CreateCardModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (cardData: any) => void
}) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'visa' as 'visa' | 'mastercard' | 'amex',
    balance: 0,
    currency: 'USD',
    country: '',
    bank: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    cost: 0,
    notes: '',
    tags: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      number: '',
      type: 'visa',
      balance: 0,
      currency: 'USD',
      country: '',
      bank: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
      cost: 0,
      notes: '',
      tags: []
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Створити карту</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Номер карти</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Тип</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full p-2 border rounded"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Баланс</label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Країна</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Банк</label>
              <input
                type="text"
                value={formData.bank}
                onChange={(e) => setFormData({...formData, bank: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Термін дії</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Власник карти</label>
            <input
              type="text"
              value={formData.holderName}
              onChange={(e) => setFormData({...formData, holderName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Собівартість ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Примітки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Створити
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CreateProxyModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (proxyData: any) => void
}) => {
  const [formData, setFormData] = useState({
    ip: '',
    port: 8080,
    type: 'http' as 'http' | 'https' | 'socks4' | 'socks5',
    country: '',
    city: '',
    speed: 100,
    uptime: 99,
    username: '',
    password: '',
    cost: 0,
    notes: '',
    tags: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      ip: '',
      port: 8080,
      type: 'http',
      country: '',
      city: '',
      speed: 100,
      uptime: 99,
      username: '',
      password: '',
      cost: 0,
      notes: '',
      tags: []
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Створити проксі</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">IP адреса</label>
              <input
                type="text"
                value={formData.ip}
                onChange={(e) => setFormData({...formData, ip: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Порт</label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Тип</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full p-2 border rounded"
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks4">SOCKS4</option>
              <option value="socks5">SOCKS5</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Країна</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Місто</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Швидкість (Мб/с)</label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({...formData, speed: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Аптайм (%)</label>
              <input
                type="number"
                value={formData.uptime}
                onChange={(e) => setFormData({...formData, uptime: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Логін</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Собівартість ($/міс)</label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Примітки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Створити
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AssignModal = ({ isOpen, onClose, onAssign, item, accounts }: {
  isOpen: boolean
  onClose: () => void
  onAssign: (itemId: string, accountId: string) => void
  item: Card | Proxy | null
  accounts: any[]
}) => {
  const [selectedAccount, setSelectedAccount] = useState('')

  const handleAssign = () => {
    if (selectedAccount && item) {
      onAssign(item.id, selectedAccount)
      setSelectedAccount('')
      onClose()
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Призначити {item.hasOwnProperty('number') ? 'карту' : 'проксі'}
        </h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {item.hasOwnProperty('number') 
              ? `Карта: ${(item as Card).number}`
              : `Проксі: ${(item as Proxy).ip}:${(item as Proxy).port}`
            }
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Виберіть аккаунт</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Виберіть аккаунт...</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            Скасувати
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAccount}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Призначити
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CardsProxiesManager() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'cards' | 'proxies'>('cards')
  const [cards, setCards] = useState<Card[]>([])
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [showCreateProxy, setShowCreateProxy] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Card | Proxy | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setCards(CardsService.getAllCards())
    setProxies(ProxiesService.getAllProxies())
    setAccounts(AccountsService.getAllAccounts())
  }

  const handleCreateCard = (cardData: any) => {
    CardsService.createCard(cardData)
    loadData()
  }

  const handleCreateProxy = (proxyData: any) => {
    ProxiesService.createProxy(proxyData)
    loadData()
  }

  const handleAssign = (itemId: string, accountId: string) => {
    if (selectedItem?.hasOwnProperty('number')) {
      CardsService.assignCard(itemId, accountId, user?.id || '')
    } else {
      ProxiesService.assignProxy(itemId, accountId, user?.id || '')
    }
    loadData()
  }

  const handleUnassign = (itemId: string) => {
    if (activeTab === 'cards') {
      CardsService.unassignCard(itemId)
    } else {
      ProxiesService.unassignProxy(itemId)
    }
    loadData()
  }

  const handleDelete = (itemId: string) => {
    if (activeTab === 'cards') {
      CardsService.deleteCard(itemId)
    } else {
      ProxiesService.deleteProxy(itemId)
    }
    loadData()
  }

  const handleAddNote = (item: Card | Proxy) => {
    const name = (user?.name || user?.email || 'Користувач')
    const text = window.prompt('Додайте коментар (нотатку) для цього елемента:')
    if (!text || !text.trim()) return
    const note = `[${new Date().toLocaleString('uk-UA')}] ${name}: ${text.trim()}`
    if ((item as Card).number !== undefined) {
      CardsService.addNote(item.id, note)
    } else {
      ProxiesService.addNote(item.id, note)
    }
    loadData()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'assigned': return <Link className="w-4 h-4 text-blue-500" />
      case 'in_use': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'blocked': return <XCircle className="w-4 h-4 text-red-500" />
      case 'testing': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'in_use': return 'bg-yellow-100 text-yellow-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'testing': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.number.includes(searchTerm) || 
                         card.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.bank.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredProxies = proxies.filter(proxy => {
    const matchesSearch = proxy.ip.includes(searchTerm) || 
                         proxy.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proxy.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCardsCost = cards.reduce((sum, card) => sum + card.cost, 0)
  const totalProxiesCost = proxies.reduce((sum, proxy) => sum + proxy.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Карти та проксі
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Управління платіжними картами та проксі-серверами
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateCard(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Додати карту
          </button>
          <button
            onClick={() => setShowCreateProxy(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Globe className="w-4 h-4 mr-2" />
            Додати проксі
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Всього карт</p>
              <p className="text-xl font-semibold">{cards.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Всього проксі</p>
              <p className="text-xl font-semibold">{proxies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Вартість карт</p>
              <p className="text-xl font-semibold">${totalCardsCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Вартість проксі</p>
              <p className="text-xl font-semibold">${totalProxiesCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cards'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Карти ({cards.length})
          </button>
          <button
            onClick={() => setActiveTab('proxies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'proxies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Проксі ({proxies.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Пошук ${activeTab === 'cards' ? 'карт' : 'проксі'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Всі статуси</option>
            <option value="active">Активні</option>
            <option value="assigned">Призначені</option>
            <option value="in_use">Використовуються</option>
            <option value="blocked">Заблоковані</option>
            <option value="testing">Тестування</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        {activeTab === 'cards' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Карта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Баланс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Собівартість
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Призначено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCards.map((card) => {
                  const assignedAccount = accounts.find(acc => acc.id === card.assignedTo)
                  return (
                    <tr key={card.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {card.number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {card.holderName} • {card.bank}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(card.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(card.status)}`}>
                            {card.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${card.balance} {card.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${card.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignedAccount ? (
                          <div>
                            <div className="font-medium">{assignedAccount.name}</div>
                            <div className="text-xs">{assignedAccount.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Не призначено</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!card.assignedTo ? (
                            <button
                              onClick={() => {
                                setSelectedItem(card)
                                setShowAssignModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnassign(card.id)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleAddNote(card)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Додати коментар"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Проксі
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Швидкість
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Собівартість
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Призначено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProxies.map((proxy) => {
                  const assignedAccount = accounts.find(acc => acc.id === proxy.assignedTo)
                  return (
                    <tr key={proxy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {proxy.ip}:{proxy.port}
                          </div>
                          <div className="text-sm text-gray-500">
                            {proxy.type.toUpperCase()} • {proxy.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(proxy.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proxy.status)}`}>
                            {proxy.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proxy.speed} Мб/с
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${proxy.cost}/міс
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignedAccount ? (
                          <div>
                            <div className="font-medium">{assignedAccount.name}</div>
                            <div className="text-xs">{assignedAccount.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Не призначено</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!proxy.assignedTo ? (
                            <button
                              onClick={() => {
                                setSelectedItem(proxy)
                                setShowAssignModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnassign(proxy.id)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleAddNote(proxy)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Додати коментар"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(proxy.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCardModal
        isOpen={showCreateCard}
        onClose={() => setShowCreateCard(false)}
        onSave={handleCreateCard}
      />
      
      <CreateProxyModal
        isOpen={showCreateProxy}
        onClose={() => setShowCreateProxy(false)}
        onSave={handleCreateProxy}
      />

      <AssignModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssign}
        item={selectedItem}
        accounts={accounts}
      />
    </div>
  )
} 