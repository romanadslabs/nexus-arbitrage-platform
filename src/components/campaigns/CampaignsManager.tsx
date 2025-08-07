'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Campaign, Account } from '@/types'
import GoogleAdsSettings from '@/components/settings/GoogleAdsSettings'
import { OffersService, OfferLinksService } from '@/lib/offers'
import CampaignStatsModal from './CampaignStatsModal'
import CampaignStatsView from './CampaignStatsView'
import { Plus, Edit, Trash2, Play, Pause, Target, TrendingUp, Filter, Search, Settings, DollarSign, Eye, Download, Users, Bot, ExternalLink, BarChart3 } from 'lucide-react'

type CampaignStatus = 'active' | 'paused' | 'completed' | 'failed'

export default function CampaignsManager() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [offerLinks, setOfferLinks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'active' | 'paused' | 'completed' | 'failed' | 'all'>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [showGoogleAdsSettings, setShowGoogleAdsSettings] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showStatsView, setShowStatsView] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [statsEditDate, setStatsEditDate] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    offerId: '',
    linkId: '',
    accountId: '',
    budget: '',
    platform: '',
    startDate: '',
    status: 'active' as CampaignStatus,
  })

  // Завантаження даних з localStorage
  useEffect(() => {
    loadData()
  }, [])

  // Перевіряємо чи є вибраний оффер з localStorage
  useEffect(() => {
    const savedOffer = localStorage.getItem('selectedOfferForCampaign')
    if (savedOffer) {
      const offer = JSON.parse(savedOffer)
      setSelectedOffer(offer)
      setFormData(prev => ({
        ...prev,
        offerId: offer.id,
        linkId: '', // Почнемо з порожнього значення
        name: `Кампанія ${offer.name}`
      }))
      // Очищаємо localStorage
      localStorage.removeItem('selectedOfferForCampaign')
      // Автоматично показуємо форму створення
      setShowAddForm(true)
    }
  }, [offerLinks])

  const loadData = () => {
    // Завантажуємо кампанії з localStorage
    const savedCampaigns = localStorage.getItem('nexus_local_campaigns')
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }

    // Завантажуємо акаунти з localStorage
    const savedAccounts = localStorage.getItem('nexus_local_accounts')
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }

    // Завантажуємо оффери
    const allOffers = OffersService.getAllOffers()
    setOffers(allOffers)

    // Завантажуємо посилання офферів
    const allLinks = OfferLinksService.getAllLinks()
    setOfferLinks(allLinks)
  }

  // Отримуємо заголовок залежно від ролі
  const getCampaignsTitle = () => {
    if (user?.role === 'leader') {
      return 'Управління всіма кампаніями'
    }
    return 'Управління моїми кампаніями'
  }

  const getCampaignsDescription = () => {
    if (user?.role === 'leader') {
      return 'Перегляд та управління всіма кампаніями в системі'
    }
    return 'Створення та управління рекламними кампаніями'
  }

  // Фільтрація кампаній поточного арбітражника або всі для адміністратора
  const baseFilteredCampaigns = user?.role === 'leader' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.launcherId === user?.id)

  const filteredCampaigns = baseFilteredCampaigns.filter(campaign => {
    const statusMatch = filterStatus === 'all' || campaign.status === filterStatus
    const platformMatch = filterPlatform === 'all' || campaign.platform === filterPlatform
    return statusMatch && platformMatch
  })

  // Отримання інформації про аккаунт
  const getAccountInfo = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)
  }

  // Отримання посилань для обраного офферу
  const getOfferLinks = (offerId: string) => {
    return offerLinks.filter(link => link.offerId === offerId && link.status === 'active')
  }

  // Отримання інформації про обраний оффер
  const getSelectedOfferInfo = () => {
    return offers.find(offer => offer.id === formData.offerId)
  }

  // Отримання інформації про обране посилання
  const getSelectedLinkInfo = () => {
    return offerLinks.find(link => link.id === formData.linkId)
  }

  // Функції для роботи зі статистикою
  const handleShowStats = (campaign: any) => {
    setSelectedCampaign(campaign)
    setShowStatsView(true)
  }

  const handleAddStats = (campaign: any) => {
    setSelectedCampaign(campaign)
    setStatsEditDate('')
    setShowStatsModal(true)
  }

  const handleEditStats = (campaign: any, date: string) => {
    setSelectedCampaign(campaign)
    setStatsEditDate(date)
    setShowStatsModal(true)
  }

  const handleStatsClose = () => {
    setShowStatsModal(false)
    setShowStatsView(false)
    setSelectedCampaign(null)
    setStatsEditDate('')
  }

  // Отримання доступних аккаунтів для вибраної платформи
  const availableAccounts = selectedPlatform ? accounts.filter(acc => acc.platform === selectedPlatform) : accounts

  const createCampaign = async (campaignData: any) => {
    if (!user) return
    
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp_${Date.now()}`,
      launcherId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const updatedCampaigns = [...campaigns, newCampaign]
    setCampaigns(updatedCampaigns)
    localStorage.setItem('nexus_local_campaigns', JSON.stringify(updatedCampaigns))
  }

  const updateCampaign = async (id: string, updates: any) => {
    const updatedCampaigns = campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date() } : campaign
    )
    setCampaigns(updatedCampaigns)
    localStorage.setItem('nexus_local_campaigns', JSON.stringify(updatedCampaigns))
  }

  const deleteCampaign = async (id: string) => {
    const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id)
    setCampaigns(updatedCampaigns)
    localStorage.setItem('nexus_local_campaigns', JSON.stringify(updatedCampaigns))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const campaignData = {
      name: formData.name,
      offerId: formData.offerId,
      linkId: formData.linkId,
      accountId: formData.accountId,
      budget: parseFloat(formData.budget),
      spent: 0,
      platform: formData.platform,
      status: formData.status,
    };

    if (editingCampaign) {
      await updateCampaign(editingCampaign, campaignData);
    } else {
      await createCampaign(campaignData);
    }

    resetForm()
    setShowAddForm(false)
  }

  const handleStatusToggle = async (campaignId: string, currentStatus: CampaignStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    await updateCampaign(campaignId, { status: newStatus })
  }

  const handleDelete = async (campaignId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю кампанію?')) {
      await deleteCampaign(campaignId)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      offerId: '',
      linkId: '',
      accountId: '',
      budget: '',
      platform: '',
      startDate: '',
      status: 'active',
    })
    setEditingCampaign(null)
    setSelectedOffer(null)
  }

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      offerId: '',
      linkId: '',
      accountId: campaign.accountId,
      budget: campaign.budget.toString(),
      platform: campaign.platform,
      startDate: '',
      status: campaign.status as CampaignStatus,
    })
    setEditingCampaign(campaign.id)
    setShowAddForm(true)
  }

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
      case 'completed': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
    }
  }

  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case 'active': return <Play size={16} />
      case 'paused': return <Pause size={16} />
      case 'completed': return <Target size={16} />
      case 'failed': return <TrendingUp size={16} />
      default: return <Target size={16} />
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Users size={16} />
      case 'google': return <Search size={16} />
      case 'tiktok': return <Bot size={16} />
      case 'instagram': return <Eye size={16} />
      case 'youtube': return <Download size={16} />
      default: return <Target size={16} />
    }
  }

  const calculateROI = (revenue: number, spent: number) => {
    if (spent === 0) return 0
    return ((revenue - spent) / spent) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header з інформацією про вибраний оффер */}
      {selectedOffer && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                🎯 Створення кампанії для оффера
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {selectedOffer.name} - ${selectedOffer.rate} за лід
              </p>
            </div>
            <button
              onClick={() => setSelectedOffer(null)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getCampaignsTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {getCampaignsDescription()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGoogleAdsSettings(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings size={16} />
            Налаштування
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Створити кампанію
          </button>
        </div>
      </div>

      {/* Фільтри */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Всі статуси</option>
            <option value="active">Активні</option>
            <option value="paused">На паузі</option>
            <option value="completed">Завершені</option>
            <option value="failed">Помилки</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Target size={16} className="text-gray-400" />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Всі платформи</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>
      </div>

      {/* Список кампаній */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => {
          const account = getAccountInfo(campaign.accountId)
          const offer = offers.find(o => o.id === campaign.offerId)
          const link = offerLinks.find(l => l.id === campaign.linkId)
          
          return (
            <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {getPlatformIcon(campaign.platform)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>
                        {campaign.platform} • {account?.name || 'Невідомий аккаунт'}
                      </div>
                      {offer && (
                        <div className="flex items-center gap-2">
                          <ExternalLink size={14} className="text-blue-500" />
                          <span>
                            Оффер: {offer.name} (${offer.rate})
                          </span>
                        </div>
                      )}
                      {link && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Посилання: {link.name} ({link.type === 'landing' ? 'Лендинг' : 'Прелендинг'})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(campaign.status as CampaignStatus)}`}>
                    {getStatusIcon(campaign.status as CampaignStatus)}
                    <span className="ml-1">
                      {campaign.status === 'active' ? 'Активна' :
                       campaign.status === 'paused' ? 'На паузі' :
                       campaign.status === 'completed' ? 'Завершена' : 'Помилка'}
                    </span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddStats(campaign)}
                      className="p-2 text-green-400 hover:text-green-600 dark:hover:text-green-300"
                      title="Додати статистику"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleShowStats(campaign)}
                      className="p-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                      title="Переглянути статистику"
                    >
                      <BarChart3 size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleStatusToggle(campaign.id, campaign.status as CampaignStatus)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={campaign.status === 'active' ? 'Призупинити' : 'Запустити'}
                    >
                      {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Редагувати"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Бюджет:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    ${campaign.budget}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Витрачено:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    ${campaign.spent}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ROI:</span>
                  <span className={`ml-1 font-medium ${calculateROI(0, campaign.spent) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {calculateROI(0, campaign.spent).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Створено:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Форма створення/редагування кампанії */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCampaign ? 'Редагувати кампанію' : 'Створити кампанію'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Назва кампанії *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Блок офферу */}
              {selectedOffer && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-3 mb-2">
                    <ExternalLink size={20} className="text-blue-600" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Обраний оффер: {selectedOffer.name}
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Ставка: ${selectedOffer.rate} • Вертикаль: {selectedOffer.vertical}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Оффер *
                  </label>
                  <select
                    value={formData.offerId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, offerId: e.target.value, linkId: '' }))
                      const selectedOfferObj = offers.find(offer => offer.id === e.target.value)
                      setSelectedOffer(selectedOfferObj || null)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Виберіть оффер</option>
                    {offers.map((offer) => (
                      <option key={offer.id} value={offer.id}>
                        {offer.name} (${offer.rate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Посилання *
                  </label>
                  <select
                    value={formData.linkId}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={!formData.offerId}
                  >
                    <option value="">
                      {!formData.offerId ? 'Спочатку виберіть оффер' : 'Виберіть посилання'}
                    </option>
                    {formData.offerId && getOfferLinks(formData.offerId).map((link) => (
                      <option key={link.id} value={link.id}>
                        {link.name} ({link.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Інформація про обране посилання */}
              {formData.linkId && (() => {
                const linkInfo = getSelectedLinkInfo()
                return linkInfo ? (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {linkInfo.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      URL: {linkInfo.url}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Тип: {linkInfo.type === 'landing' ? 'Лендинг' : 'Прелендинг'}
                    </div>
                  </div>
                ) : null
              })()}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Платформа *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, platform: e.target.value }))
                      setSelectedPlatform(e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Виберіть платформу</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Аккаунт *
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Виберіть аккаунт</option>
                    {availableAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.platform})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Бюджет ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CampaignStatus }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Активна</option>
                    <option value="paused">На паузі</option>
                    <option value="completed">Завершена</option>
                    <option value="failed">Помилка</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingCampaign ? 'Оновити' : 'Створити'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Налаштування Google Ads */}
      {showGoogleAdsSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Google Ads Налаштування
              </h3>
              <button
                onClick={() => setShowGoogleAdsSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <GoogleAdsSettings />
          </div>
        </div>
      )}

      {/* Модаль додавання/редагування статистики */}
      {showStatsModal && selectedCampaign && (
        <CampaignStatsModal
          isOpen={showStatsModal}
          onClose={handleStatsClose}
          campaignId={selectedCampaign.id}
          campaignName={selectedCampaign.name}
          onSave={() => {
            // Оновлюємо дані після збереження
            loadData()
          }}
        />
      )}

      {/* Модаль перегляду статистики */}
      {showStatsView && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Статистика кампанії
              </h3>
              <button
                onClick={handleStatsClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <CampaignStatsView
              campaignId={selectedCampaign.id}
              campaignName={selectedCampaign.name}
              onEditStats={(date) => handleEditStats(selectedCampaign, date)}
            />
          </div>
        </div>
      )}


    </div>
  )
} 