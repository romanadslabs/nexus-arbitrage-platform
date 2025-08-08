'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { X, Link, Copy, ExternalLink, Users, TrendingUp, DollarSign, Target, Calendar, MapPin, Smartphone, BarChart3, Plus, Play, Pause, Archive, MessageSquare } from 'lucide-react'
import { Offer, OfferLink, LinkStats, OfferComment } from '@/types/offers'
import { OffersService, OfferLinksService, LinkStatsService, OffersAnalytics } from '@/lib/offers'
import StatsTracker from './StatsTracker'

interface OfferDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  offer: Offer | null
}

export default function OfferDetailsModal({ isOpen, onClose, offer }: OfferDetailsModalProps) {
  const { user } = useAuth()
  const [links, setLinks] = useState<OfferLink[]>([])
  const [stats, setStats] = useState<LinkStats[]>([])
  const [showCreateLink, setShowCreateLink] = useState(false)
  const [showStatsTracker, setShowStatsTracker] = useState(false)
  const [selectedLink, setSelectedLink] = useState<OfferLink | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'stats' | 'analytics' | 'comments'>('overview')
  const [comments, setComments] = useState<OfferComment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (offer) {
      loadOfferData()
    }
  }, [offer])

  const loadOfferData = () => {
    if (!offer) return
    
    const offerLinks = OfferLinksService.getLinksByOfferId(offer.id)
    const offerStats = LinkStatsService.getStatsByOfferId(offer.id)
    const offerComments = OffersService.getOfferComments(offer.id)
    
    setLinks(offerLinks)
    setStats(offerStats)
    setComments(offerComments)
  }

  const handleCreateLink = async (linkData: Omit<OfferLink, 'id' | 'createdAt'>) => {
    if (!offer) return
    
    const newLink = OfferLinksService.createLink({
      ...linkData,
      offerId: offer.id
    })
    
    loadOfferData()
    setShowCreateLink(false)
  }

  const handleSaveStats = async (statsData: Omit<LinkStats, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
    if (!user) return
    
    const newStats = LinkStatsService.createStats({
      ...statsData,
      updatedBy: user.id
    })
    
    loadOfferData()
    setShowStatsTracker(false)
  }

  const handleAddComment = () => {
    if (!offer || !user || !newComment.trim()) return
    const comment: OfferComment = {
      id: `ocom_${Date.now()}`,
      authorId: user.id,
      authorName: user.name || user.email,
      text: newComment.trim(),
      createdAt: new Date(),
    }
    OffersService.addCommentToOffer(offer.id, comment)
    setNewComment('')
    loadOfferData()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Тут можна додати повідомлення про успішне копіювання
  }

  const handleLaunch = () => {
    if (!offer) return
    localStorage.setItem('selectedOfferForCampaign', JSON.stringify({
      id: offer.id,
      name: offer.name,
      rate: offer.rate,
      vertical: offer.vertical,
      source: offer.source,
    }))
    window.location.href = '/campaigns?from=offer'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
      case 'completed': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
      case 'draft': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активний'
      case 'paused': return 'На паузі'
      case 'completed': return 'Завершений'
      case 'draft': return 'Чернетка'
      default: return status
    }
  }

  const getVerticalIcon = (vertical: string) => {
    switch (vertical) {
      case 'travel': return <MapPin size={16} />
      case 'gaming': return <Target size={16} />
      case 'e-commerce': return <DollarSign size={16} />
      case 'dating': return <Users size={16} />
      case 'finance': return <DollarSign size={16} />
      case 'health': return <TrendingUp size={16} />
      default: return <Target size={16} />
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone size={16} />
      case 'desktop': return <ExternalLink size={16} />
      case 'tablet': return <Smartphone size={16} />
      default: return <ExternalLink size={16} />
    }
  }

  if (!isOpen || !offer) return null

  const offerStats = OffersAnalytics.getStatsByOffer(offer.id)
  const activeLinks = links.filter(link => link.status === 'active')
  const totalLinks = links.length
  const uniqueAccounts = new Set(links.map(link => link.accountId)).size

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {getVerticalIcon(offer.vertical)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {offer.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {offer.vertical} • {offer.source}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunch}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              title="Запустити кампанію"
            >
              <Play size={16} />
              Запустити кампанію
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Огляд', icon: BarChart3 },
              { id: 'links', name: 'Посилання', icon: Link },
              { id: 'stats', name: 'Статистика', icon: TrendingUp },
              { id: 'analytics', name: 'Аналітика', icon: Target },
              { id: 'comments', name: 'Коментарі', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Основна інформація */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Опис оффера
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      💰 Виплати та ROI
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 dark:text-green-400 font-semibold">🎯 Основна виплата</span>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          <strong>$12 за лід</strong> - одразу після реєстрації користувача
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">🔄 Рекурентні виплати</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          <strong>$2 щомісячно</strong> з кожного залученого користувача
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                          Пасивний дохід на довгостроковій основі
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">📈 Потенційний ROI</span>
                        </div>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          <strong>ROI 100%+</strong> за 6 місяців (12$ + 6×2$ = 24$ з одного ліда)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      📊 Статистика оффера
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${offer.rate}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          За лід
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          $2
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Щомісячно
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {offer.activeUsers}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Активних партнерів
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {offer.maxLinks}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Макс. посилань
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🎯 Вимоги до трафіку
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600 dark:text-gray-400">Країни: {offer.countries.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600 dark:text-gray-400">Пристрої: {offer.devices.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-600 dark:text-gray-400">Трафік: {offer.trafficTypes.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      ⚠️ Обмеження
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {offer.restrictions}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Поради для арбітражників */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                  💡 Поради для арбітражників
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">🎯</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Цільова аудиторія</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Люди 25-55 років, що цікавляться подорожами та заробітком</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">💰</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Ключова перевага</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Рекурентний дохід $2/місяць з кожного ліда</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">📱</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Кращі канали</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Facebook, Instagram, TikTok, Telegram</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">⚡</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Швидкий старт</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Виплата $12 одразу після реєстрації</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">📈</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Довгостроковий ROI</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">За 1 рік: $12 + 12×$2 = $36 з одного ліда</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">🎪</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Унікальність</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Кожен аккаунт може запускати тільки 1 посилання</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Теги */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Теги
                </h3>
                <div className="flex flex-wrap gap-2">
                  {offer.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Заголовок з кнопкою створення */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Посилання для відстеження
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{activeLinks.length} активних з {totalLinks} загалом</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {uniqueAccounts} унікальних аккаунтів
                    </span>
                    {offer.maxLinks && (
                      <span className="text-green-600 dark:text-green-400">
                        {offer.maxLinks - totalLinks} вільних слотів
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {offer.maxLinks && totalLinks >= offer.maxLinks && (
                    <span className="text-red-600 dark:text-red-400 text-sm">
                      Ліміт посилань досягнуто
                    </span>
                  )}
                  <button
                    onClick={() => setShowCreateLink(true)}
                    disabled={offer.maxLinks ? totalLinks >= offer.maxLinks : false}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Створити посилання
                  </button>
                </div>
              </div>

              {/* Список посилань */}
              <div className="space-y-6">
                {/* Прелендинги */}
                {links.filter(link => link.tags.includes('prelanding')).length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Прелендинги ({links.filter(link => link.tags.includes('prelanding')).length})
                    </h4>
                    <div className="grid gap-3">
                      {links.filter(link => link.tags.includes('prelanding')).map((link) => (
                  <div key={link.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {link.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {link.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                          {getStatusText(link.status)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Копіювати URL"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Відкрити посилання"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedLink(link)
                            setShowStatsTracker(true)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Додати статистику"
                        >
                          <BarChart3 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>ID: {link.uniqueId}</span>
                      {link.accountId && (
                        <span className="flex items-center gap-1">
                          Аккаунт: 
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs">
                            {link.accountId}
                          </span>
                          <span className="text-green-600 dark:text-green-400">✓ Унікальний</span>
                        </span>
                      )}
                      <span>Створено: {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>

                    {link.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {link.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                    </div>
                  </div>
                )}

                {/* Лендинги */}
                {links.filter(link => link.tags.includes('landing')).length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Лендинги ({links.filter(link => link.tags.includes('landing')).length})
                    </h4>
                    <div className="grid gap-3">
                      {links.filter(link => link.tags.includes('landing')).map((link) => (
                        <div key={link.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {link.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {link.url}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                                {getStatusText(link.status)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(link.url)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Копіювати URL"
                              >
                                <Copy size={16} />
                              </button>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Відкрити посилання"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <button
                                onClick={() => {
                                  setSelectedLink(link)
                                  setShowStatsTracker(true)
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Додати статистику"
                              >
                                <BarChart3 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>ID: {link.uniqueId}</span>
                            {link.accountId && <span>Аккаунт: {link.accountId}</span>}
                            <span>Створено: {new Date(link.createdAt).toLocaleDateString()}</span>
                          </div>

                          {link.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {link.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Статистика посилань
                </h3>
                <button
                  onClick={() => setShowStatsTracker(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Додати статистику
                </button>
              </div>

              {/* Загальна статистика */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Покази</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {offerStats.totalImpressions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Кліки</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {offerStats.totalClicks.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Конверсії</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {offerStats.totalConversions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Прибуток</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${offerStats.totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Детальна статистика */}
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Остання статистика
                  </h4>
                </div>
                <div className="p-4">
                  {stats.length > 0 ? (
                    <div className="space-y-3">
                      {stats.slice(0, 5).map((stat) => (
                        <div key={stat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(stat.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {stat.accountName || 'Без аккаунта'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{stat.impressions} показів</span>
                            <span>{stat.clicks} кліків</span>
                            <span>{stat.conversions} конверсій</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              ${stat.profit.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Поки що немає статистики. Додайте перші дані!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Аналітика оффера
              </h3>

              {/* Показники ефективності */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Target size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CTR</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {offerStats.avgCtr.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Середній показник клікабельності
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Users size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CVR</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {offerStats.avgCvr.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Середній показник конверсії
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {offerStats.avgRoi.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Середній показник прибутковості
                  </p>
                </div>
              </div>

              {/* Рекомендації */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Рекомендації для покращення
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Створіть більше посилань для різних кампаній</p>
                  <p>• Тестуйте різні UTM-параметри</p>
                  <p>• Відстежуйте статистику щодня</p>
                  <p>• Аналізуйте найкращі джерела трафіку</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Коментарі ({comments.length})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments.length === 0 && (
                  <div className="text-sm text-gray-500">Поки що немає коментарів.</div>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{c.authorName}</span>
                      <span className="text-gray-500 dark:text-gray-400">{new Date(c.createdAt).toLocaleString('uk-UA')}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm mt-1 whitespace-pre-wrap">{c.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Додати коментар..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  Додати
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальні вікна */}
      {showCreateLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Створити посилання
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Функція створення посилань тимчасово недоступна
            </p>
            <button
              onClick={() => setShowCreateLink(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {showStatsTracker && selectedLink && (
        <StatsTracker
          isOpen={showStatsTracker}
          onClose={() => {
            setShowStatsTracker(false)
            setSelectedLink(null)
          }}
          selectedLink={selectedLink}
          onSave={() => {
            loadOfferData()
          }}
        />
      )}
    </div>
  )
} 