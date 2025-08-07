'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import ModernLayout from '@/components/layout/ModernLayout'
import { OffersService, OfferLinksService, LinkStatsService, OffersAnalytics, seedOffersData } from '@/lib/offers'
import OfferDetailsModal from '@/components/offers/OfferDetailsModal'
import { 
  Plus, 
  TrendingUp, 
  Link, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { Offer, OfferLink, LinkStats } from '@/types/offers'

export default function OffersPage() {
  const { user } = useAuth()
  const [offers, setOffers] = useState<Offer[]>([])
  const [links, setLinks] = useState<OfferLink[]>([])
  const [stats, setStats] = useState<LinkStats[]>([])
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterVertical, setFilterVertical] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showOfferDetails, setShowOfferDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Завантаження даних
  useEffect(() => {
    loadOffersData()
  }, [])

  const loadOffersData = () => {
    console.log('🔄 Завантаження даних офферів...')
    setIsLoading(true)
    
    // Ініціалізуємо дані якщо їх немає
    seedOffersData()
    
    // Завантажуємо дані з localStorage
    const loadedOffers = OffersService.getAllOffers()
    const loadedLinks = OfferLinksService.getAllLinks()
    const loadedStats = LinkStatsService.getAllStats()
    
    console.log('📊 Завантажені дані:', {
      offers: loadedOffers.length,
      links: loadedLinks.length,
      stats: loadedStats.length
    })
    
    setOffers(loadedOffers)
    setLinks(loadedLinks)
    setStats(loadedStats)
    setIsLoading(false)
  }

  // Фільтрація офферів
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus
    const matchesVertical = filterVertical === 'all' || offer.vertical === filterVertical
    
    return matchesSearch && matchesStatus && matchesVertical
  })

  // Розрахунок загальної статистики
  const totalStats = OffersAnalytics.getTotalStats()
  const totalOffers = offers.length
  const activeOffers = offers.filter(o => o.status === 'active').length
  const totalLinks = links.length
  const activeLinks = links.filter(l => l.status === 'active').length

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Тут можна додати повідомлення про успішне копіювання
  }

  const handleLaunchCampaign = (offer: Offer) => {
    // Зберігаємо дані про оффер в localStorage для передачі на сторінку кампаній
    localStorage.setItem('selectedOfferForCampaign', JSON.stringify({
      id: offer.id,
      name: offer.name,
      rate: offer.rate,
      vertical: offer.vertical,
      source: offer.source
    }))
    
    // Перенаправляємо на сторінку кампаній
    window.location.href = '/campaigns?from=offer'
  }

  return (
    <ModernLayout title="Оффери та посилання" description="Управління офферами та відстеження статистики">
      <div className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Завантаження офферів...</p>
            </div>
          </div>
        )}

        {/* Заголовок та кнопки */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Оффери та посилання
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Управління офферами, створення посилань та відстеження статистики
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log('🔄 Примусове створення даних...')
                localStorage.removeItem('nexus_local_offers')
                localStorage.removeItem('nexus_local_offer_links')
                localStorage.removeItem('nexus_local_link_stats')
                loadOffersData()
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Створити дані
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Статистика
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} />
              Новий оффер
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Всього офферів</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOffers}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 dark:text-green-400">
                {activeOffers} активних
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Посилання</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLinks}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Link size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 dark:text-green-400">
                {activeLinks} активних
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Конверсії</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalConversions}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                CTR: {totalStats.totalImpressions > 0 ? ((totalStats.totalClicks / totalStats.totalImpressions) * 100).toFixed(2) : '0'}%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Прибуток</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalStats.totalProfit.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 dark:text-green-400">
                Дохід: ${totalStats.totalRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Пошук офферів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Всі статуси</option>
                <option value="active">Активні</option>
                <option value="paused">На паузі</option>
                <option value="completed">Завершені</option>
                <option value="draft">Чернетки</option>
              </select>
              <select
                value={filterVertical}
                onChange={(e) => setFilterVertical(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Всі вертикалі</option>
                <option value="gaming">Gaming</option>
                <option value="e-commerce">E-commerce</option>
                <option value="dating">Dating</option>
                <option value="finance">Finance</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        </div>

        {/* Список офферів */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Оффери ({filteredOffers.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOffers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Target size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Оффери не знайдено
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {offers.length === 0 
                    ? 'Дані офферів ще не створені. Натисніть "Створити дані" для ініціалізації.'
                    : 'Спробуйте змінити фільтри або пошуковий запит.'
                  }
                </p>
                {offers.length === 0 && (
                  <button
                    onClick={() => {
                      console.log('🔄 Примусове створення даних...')
                      localStorage.removeItem('nexus_local_offers')
                      localStorage.removeItem('nexus_local_offer_links')
                      localStorage.removeItem('nexus_local_link_stats')
                      loadOffersData()
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={16} />
                    Створити тестові дані
                  </button>
                )}
              </div>
            ) : (
              filteredOffers.map((offer) => (
                <div key={offer.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {offer.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          offer.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          offer.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          offer.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}>
                          {offer.status === 'active' ? 'Активний' :
                           offer.status === 'paused' ? 'На паузі' :
                           offer.status === 'completed' ? 'Завершений' : 'Чернетка'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                          {offer.vertical}
                        </span>
                        {offer.activeUsers && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            {offer.activeUsers} партнерів
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {offer.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">За лід:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">${offer.rate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Щомісячно:</span>
                          <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">$2</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Джерело:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">{offer.source}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Тип:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">{offer.payoutType.toUpperCase()}</span>
                        </div>
                        {offer.maxLinks && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Вільні слоти:</span>
                            <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                              {offer.maxLinks - links.filter(l => l.offerId === offer.id).length}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {offer.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedOffer(offer)
                          setShowOfferDetails(true)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Переглянути деталі"
                      >
                        <BarChart3 size={16} />
                      </button>
                      <button
                        onClick={() => handleLaunchCampaign(offer)}
                        className="p-2 text-green-400 hover:text-green-600 dark:hover:text-green-300"
                        title="Запустити кампанію"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(offer.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Копіювати ID"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Більше опцій"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Модальне вікно деталей оффера */}
      <OfferDetailsModal
        isOpen={showOfferDetails}
        onClose={() => {
          setShowOfferDetails(false)
          setSelectedOffer(null)
        }}
        offer={selectedOffer}
      />
    </ModernLayout>
  )
} 