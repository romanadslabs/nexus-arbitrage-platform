'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, User } from './AuthProvider'
import { Offer, OfferLink, LinkStats } from '@/types/offers'

// Local Storage Keys
const LOCAL_STORAGE_KEYS = {
  ACCOUNTS: 'nexus_local_accounts',
  CAMPAIGNS: 'nexus_local_campaigns',
  EXPENSES: 'nexus_local_expenses',
  CARDS: 'nexus_local_cards',
  PROXIES: 'nexus_local_proxies',
  WORKSPACE: 'nexus_local_workspace', // Note: singular now
  OFFERS: 'nexus_local_offers',
  OFFER_LINKS: 'nexus_local_offer_links',
  LINK_STATS: 'nexus_local_link_stats',
}

// Типи даних
export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface StatusChangeEvent {
  status: string;
  changedBy: string;
  changedAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assigneeId?: string;
    dueDate?: Date;
}

export interface Activity {
    id: string;
    text: string;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    timestamp: string;
    isSystem?: boolean;
    channelId: string;
    mentions?: string[]; // Array of user IDs mentioned
    attachments?: ChatAttachment[];
    reactions?: ChatReaction[];
    replyTo?: string; // ID of message being replied to
}

export interface ChatAttachment {
    id: string;
    type: 'file' | 'image' | 'link';
    name: string;
    url?: string;
    size?: number;
}

export interface ChatReaction {
    emoji: string;
    userIds: string[];
}

export interface ChatChannel {
    id: string;
    name: string;
    description: string;
    type: 'work' | 'general' | 'private';
    members: string[]; // Array of user IDs
    isActive: boolean;
    createdAt: Date;
    lastMessageAt?: Date;
}

export interface Workspace {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    team: TeamMember[];
    tasks: Task[];
    activity: Activity[];
    chat: ChatMessage[];
    channels: ChatChannel[];
    createdAt: Date;
}

export interface TeamMember {
    id: string;
    name: string;
    role: 'leader' | 'member';
    avatarUrl?: string;
}

export interface Account {
  id: string
  name: string
  email: string
  phone: string
  platform: string
  status: string
  statusHistory: StatusChangeEvent[]
  trafficType: 'paid' | 'organic' | 'other'
  farmerId?: string
  priority: string
  tags: string[]
  comments: Comment[]
  aiEvaluation: string
  automations: string[]
  twoFactorCode?: string
  cookieData?: string
  createdAt: Date
  updatedAt: Date
  isLocal?: boolean
}

export interface Card {
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

export interface Proxy {
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

export interface Campaign {
  id: string
  name: string
  platform: string
  status: string
  budget: number
  spent: number
  accountId: string
  launcherId: string
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  name: string
  description: string
  amount: number
  date: Date
  accountId: string
  createdAt: Date
}


// Контекст даних
interface DataContextType {
  accounts: Account[]
  campaigns: Campaign[]
  expenses: Expense[]
  cards: Card[]
  proxies: Proxy[]
  workspace: Workspace | null
  dashboardStats: {
    totalRevenue: number
    totalExpenses: number
    totalProfit: number
    totalROI: number
  }
  
  isLoading: {
    accounts: boolean
    campaigns: boolean
    expenses: boolean
    stats: boolean
    cards: boolean
    proxies: boolean
    workspace: boolean
  }
  
  // Функції для акаунтів
  createAccount: (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'farmerId' | 'comments' | 'statusHistory'>) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  addCommentToAccount: (accountId: string, commentText: string) => Promise<void>
  assignFarmerToAccount: (accountId: string, farmerId: string) => Promise<void>

  // Функції для робочого простору
  updateWorkspace: (updates: Partial<Workspace>) => Promise<void>
  addTask: (taskData: Omit<Task, 'id'>) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  addTeamMember: (memberData: Omit<TeamMember, 'id'>) => Promise<void>
  removeTeamMember: (memberId: string) => Promise<void>
  logActivity: (text: string) => Promise<void>
  addChatMessage: (messageData: { text: string; authorId: string; authorName: string; channelId: string }) => Promise<void>
  createChannel: (channelData: Omit<ChatChannel, 'id' | 'createdAt'>) => Promise<void>
  updateChannel: (channelId: string, updates: Partial<ChatChannel>) => Promise<void>
  deleteChannel: (channelId: string) => Promise<void>
  addReaction: (messageId: string, emoji: string, userId: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string, userId: string) => Promise<void>

  // Функції для кампаній
  createCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'launcherId'>) => Promise<void>
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>
  deleteCampaign: (id: string) => Promise<void>
  
  // Функції для витрат
  createExpense: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>

  // Функції для карт
  createCard: (cardData: Omit<Card, 'id' | 'createdAt'>) => Promise<void>
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>
  deleteCard: (id: string) => Promise<void>

  // Функції для проксі
  createProxy: (proxyData: Omit<Proxy, 'id' | 'createdAt'>) => Promise<void>
  updateProxy: (id: string, updates: Partial<Proxy>) => Promise<void>
  deleteProxy: (id: string) => Promise<void>


  refreshAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Утиліти для localStorage
const localStorageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window === 'undefined') return defaultValue
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return defaultValue
    }
  },
  set: (key: string, value: any) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
    }
  },
}

function seedMockData() {
  const hasAccounts = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCOUNTS);
  if (!hasAccounts) {
    const mockAccounts: Account[] = [
      {
        id: 'acc_1',
        name: 'Alpha Facebook Account',
        email: 'alpha@example.com',
        phone: '123-456-7890',
        platform: 'Facebook',
        status: 'ready_for_farm',
        statusHistory: [{ status: 'ready_for_farm', changedBy: 'System', changedAt: new Date() }],
        trafficType: 'paid',
        farmerId: 'farmer_1',
        priority: 'High',
        tags: ['USA', 'Tier 1'],
        comments: [
          { id: 'comment_1', text: 'Initial setup complete.', authorId: 'admin', authorName: 'Admin', createdAt: new Date() }
        ],
        aiEvaluation: 'Positive',
        automations: ['auto-bidding'],
        twoFactorCode: '1234567890123456',
        cookieData: '{"name": "test-cookie", "value": "12345"}',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocal: true,
      },
      {
        id: 'acc_2',
        name: 'Beta Google Ads Account',
        email: 'beta@example.com',
        phone: '234-567-8901',
        platform: 'Google Ads',
        status: 'in_progress',
        statusHistory: [{ status: 'in_progress', changedBy: 'System', changedAt: new Date() }],
        trafficType: 'organic',
        farmerId: 'farmer_2',
        priority: 'Medium',
        tags: ['EU', 'Tier 2'],
        comments: [],
        aiEvaluation: 'Neutral',
        automations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocal: true,
      },
    ];
    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, mockAccounts);
    console.log('🌱 Mock accounts seeded');
  }

  const hasWorkspace = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSPACE);
  if (!hasWorkspace) {
    const mockWorkspace: Workspace = {
            id: 'ws_main',
            name: 'Головний робочий простір',
            description: 'Єдиний робочий простір для всієї команди.',
            ownerId: 'admin',
            team: [{ id: 'user_1', name: 'Admin User', role: 'leader' }],
            tasks: [
                { id: 'task_1', title: 'Налаштувати першу кампанію', status: 'todo', priority: 'high', description: 'Детальний опис задачі тут.' },
                { id: 'task_2', title: 'Запросити команду', status: 'todo', priority: 'medium' },
                { id: 'task_3', title: 'Проаналізувати ринок', status: 'in_progress', priority: 'medium', assigneeId: 'user_1' },
                { id: 'task_4', title: 'Зробити тестовий запуск', status: 'done', priority: 'low', assigneeId: 'user_1' },
            ],
            activity: [
                { id: `act_${Date.now()}`, text: 'Створено робочий простір.', timestamp: new Date() }
            ],
            chat: [
                {
                    id: 'msg_1',
                    text: 'Вітаю команду! Радий бачити вас у нашому робочому просторі.',
                    authorId: 'user_1',
                    authorName: 'Admin User',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    channelId: 'channel_work_moments',
                },
                {
                    id: 'msg_2',
                    text: 'Привіт! Готовий до роботи. Що потрібно зробити першим?',
                    authorId: 'user_1',
                    authorName: 'Admin User',
                    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                    channelId: 'channel_work_moments',
                },
                {
                    id: 'msg_3',
                    text: 'Давайте почнемо з налаштування першої кампанії. Хто хоче взятися за це?',
                    authorId: 'user_1',
                    authorName: 'Admin User',
                    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
                    channelId: 'channel_google_ads',
                },
                {
                    id: 'msg_4',
                    text: 'Потрібно перевірити всі Google аккаунти на предмет блокувань',
                    authorId: 'user_1',
                    authorName: 'Admin User',
                    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
                    channelId: 'channel_google_ads',
                },
                {
                    id: 'msg_5',
                    text: 'Ідея: додати автоматичне тестування проксі перед використанням',
                    authorId: 'user_1',
                    authorName: 'Admin User',
                    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
                    channelId: 'channel_improvements',
                }
            ],
            channels: [
                {
                    id: 'channel_google_ads',
                    name: '🔍 Робота з Google аккаунтами',
                    description: 'Робота з Google аккаунтами та запуск реклами',
                    type: 'work',
                    members: ['user_1'],
                    isActive: true,
                    createdAt: new Date(),
                },
                {
                    id: 'channel_work_moments',
                    name: '💼 Робочі моменти',
                    description: 'Обговорення робочих питань та координація',
                    type: 'work',
                    members: ['user_1'],
                    isActive: true,
                    createdAt: new Date(),
                },
                {
                    id: 'channel_improvements',
                    name: '🚀 Покращення сайту',
                    description: 'Обговорення покращень та нових функцій',
                    type: 'work',
                    members: ['user_1'],
                    isActive: true,
                    createdAt: new Date(),
                },
            ],
            createdAt: new Date(),
        };
    localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, mockWorkspace);
    console.log('🌱 Mock workspace seeded');
  }

  const hasCampaigns = localStorage.getItem(LOCAL_STORAGE_KEYS.CAMPAIGNS);
  if (!hasCampaigns) {
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_1',
        name: 'Summer Sale Campaign',
        platform: 'Facebook',
        status: 'active',
        budget: 5000,
        spent: 2345,
        accountId: 'acc_1',
        launcherId: 'launcher_1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CAMPAIGNS, mockCampaigns);
    console.log('🌱 Mock campaigns seeded');
  }

  const hasExpenses = localStorage.getItem(LOCAL_STORAGE_KEYS.EXPENSES);
  if (!hasExpenses) {
    const mockExpenses: Expense[] = [
      {
        id: 'exp_1',
        name: 'Proxy Services',
        description: 'Monthly subscription',
        amount: 150,
        date: new Date(),
        accountId: 'acc_1',
        createdAt: new Date(),
      },
    ];
    localStorageUtils.set(LOCAL_STORAGE_KEYS.EXPENSES, mockExpenses);
    console.log('🌱 Mock expenses seeded');
  }

  const hasCards = localStorage.getItem(LOCAL_STORAGE_KEYS.CARDS);
  if (!hasCards) {
    const mockCards: Card[] = [
      {
        id: 'card_1',
        number: '1234567890123456',
        type: 'visa',
        status: 'active',
        balance: 1500,
        currency: 'USD',
        country: 'USA',
        bank: 'Chase',
        expiryDate: '12/25',
        cvv: '123',
        holderName: 'John Doe',
        createdAt: new Date(),
      },
    ];
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, mockCards);
    console.log('🌱 Mock cards seeded');
  }

  const hasProxies = localStorage.getItem(LOCAL_STORAGE_KEYS.PROXIES);
  if (!hasProxies) {
    const mockProxies: Proxy[] = [
      {
        id: 'proxy_1',
        ip: '127.0.0.1',
        port: 8080,
        type: 'http',
        status: 'active',
        country: 'USA',
        city: 'New York',
        speed: 120,
        uptime: 99,
        createdAt: new Date(),
      },
    ];
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, mockProxies);
    console.log('🌱 Mock proxies seeded');
  }
}


// Провайдер даних
export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  const [accounts, setAccounts] = useState<Account[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalROI: 0
  })
  
  const [isLoading, setIsLoading] = useState({
    accounts: true,
    campaigns: true,
    expenses: true,
    stats: true,
    cards: true,
    proxies: true,
    workspace: true,
  })

  // Завантаження всіх даних з localStorage при монтуванні
  useEffect(() => {
    if (user) {
      seedMockData(); // Seed mock data if localStorage is empty
      refreshAllData()
    }
    // Залежність від user, щоб перезавантажувати дані при зміні користувача
  }, [user])

  const refreshAllData = () => {
    setIsLoading({ accounts: true, campaigns: true, expenses: true, stats: true, cards: true, proxies: true, workspace: true })

    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, [])
    const allCampaigns = localStorageUtils.get<Campaign[]>(LOCAL_STORAGE_KEYS.CAMPAIGNS, [])
    const allExpenses = localStorageUtils.get<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, [])
    const allCards = localStorageUtils.get<Card[]>(LOCAL_STORAGE_KEYS.CARDS, [])
    const allProxies = localStorageUtils.get<Proxy[]>(LOCAL_STORAGE_KEYS.PROXIES, [])
    const singleWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null)
    
    // Validate and fix workspace data if needed
    const validatedWorkspace = singleWorkspace ? {
      ...singleWorkspace,
      team: Array.isArray(singleWorkspace.team) ? singleWorkspace.team : [],
      tasks: Array.isArray(singleWorkspace.tasks) ? singleWorkspace.tasks : [],
      activity: Array.isArray(singleWorkspace.activity) ? singleWorkspace.activity : [],
      chat: Array.isArray(singleWorkspace.chat) ? singleWorkspace.chat : [],
      channels: Array.isArray(singleWorkspace.channels) ? singleWorkspace.channels : [],
    } : null
    
    // Фільтрація даних відповідно до ролі користувача
    const filteredAccounts = filterAccountsByRole(allAccounts, user)
    const filteredCampaigns = filterCampaignsByRole(allCampaigns, user)
    
    setAccounts(filteredAccounts)
    setCampaigns(filteredCampaigns)
    setExpenses(allExpenses) // Витрати бачать всі
    setCards(allCards)
    setProxies(allProxies)
    setWorkspace(validatedWorkspace)

    // Розрахунок статистики
    const totalRevenue = filteredCampaigns.reduce((sum, camp) => sum + (camp.budget || 0), 0)
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const totalProfit = totalRevenue - totalExpenses
    const totalROI = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0

    setDashboardStats({
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalROI
    })

    setIsLoading({ accounts: false, campaigns: false, expenses: false, stats: false, cards: false, proxies: false, workspace: false })
  }

  // --- Управління акаунтами ---
  const createAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'farmerId' | 'comments' | 'statusHistory'>) => {
    if (!user) return
    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, [])
    const newAccount: Account = {
      ...accountData,
      id: `acc_${Date.now()}`,
      farmerId: user.role === 'farmer' ? user.id : undefined,
      comments: [],
      statusHistory: [{ status: accountData.status || 'ready_for_farm', changedBy: user.name, changedAt: new Date() }],
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocal: true,
    }
    const updatedAccounts = [...allAccounts, newAccount]
    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, updatedAccounts)
    setAccounts(filterAccountsByRole(updatedAccounts, user))
  }

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    if(!user) return;
    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, [])
    const updatedAccounts = allAccounts.map(acc => {
      if (acc.id === id) {
        const newStatusHistory = acc.status !== updates.status && updates.status
          ? [...acc.statusHistory, { status: updates.status, changedBy: user.name, changedAt: new Date() }]
          : acc.statusHistory;

        return { ...acc, ...updates, statusHistory: newStatusHistory, updatedAt: new Date() }
      }
      return acc;
    })
    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, updatedAccounts)
    setAccounts(filterAccountsByRole(updatedAccounts, user))
  }

  const deleteAccount = async (id: string) => {
    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, [])
    const updatedAccounts = allAccounts.filter(acc => acc.id !== id)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, updatedAccounts)
    setAccounts(filterAccountsByRole(updatedAccounts, user))
  }
  
  const addCommentToAccount = async (accountId: string, commentText: string) => {
    if (!user) return;
    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, []);
    
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      text: commentText,
      authorId: user.id,
      authorName: user.name || user.email,
      createdAt: new Date()
    };

    const updatedAccounts = allAccounts.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          comments: [...(acc.comments || []), newComment],
          updatedAt: new Date()
        };
      }
      return acc;
    });

    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, updatedAccounts);
    setAccounts(filterAccountsByRole(updatedAccounts, user));
  }

  const assignFarmerToAccount = async (accountId: string, farmerId: string) => {
    if (!user) return;
    const allAccounts = localStorageUtils.get<Account[]>(LOCAL_STORAGE_KEYS.ACCOUNTS, []);
    const updatedAccounts = allAccounts.map(acc => {
        if (acc.id === accountId) {
            const newStatusHistory = [...acc.statusHistory, { status: acc.status, changedBy: user.name, changedAt: new Date() }];
            return { ...acc, farmerId, statusHistory: newStatusHistory, updatedAt: new Date() };
        }
        return acc;
    });
    localStorageUtils.set(LOCAL_STORAGE_KEYS.ACCOUNTS, updatedAccounts);
    setAccounts(filterAccountsByRole(updatedAccounts, user));
  }

  // --- Управління робочим простором ---
  const logActivity = async (text: string) => {
    if (!workspace) return
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      text,
      timestamp: new Date()
    }
    
    const updatedWorkspace = {
      ...workspace,
      activity: [newActivity, ...workspace.activity]
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }

  const updateWorkspace = async (updates: Partial<Workspace>) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const updatedWorkspace = { ...currentWorkspace, ...updates };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
      }
  }
  
  const addTask = async (taskData: Omit<Task, 'id'>) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const newTask: Task = { ...taskData, id: `task_${Date.now()}` };
          const updatedWorkspace = { ...currentWorkspace, tasks: [...currentWorkspace.tasks, newTask] };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          logActivity(`створив(ла) нову задачу: "${newTask.title}"`);
      }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const updatedTasks = currentWorkspace.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task);
          const updatedWorkspace = { ...currentWorkspace, tasks: updatedTasks };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          
          if(updates.status) {
              const task = updatedTasks.find(t => t.id === taskId);
              logActivity(`змінив(ла) статус задачі "${task?.title}" на "${updates.status}"`);
          }
      }
  }

  const deleteTask = async (taskId: string) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const taskToDelete = currentWorkspace.tasks.find(t => t.id === taskId);
          const updatedTasks = currentWorkspace.tasks.filter(task => task.id !== taskId);
          const updatedWorkspace = { ...currentWorkspace, tasks: updatedTasks };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          if (taskToDelete) {
            logActivity(`видалив(ла) задачу: "${taskToDelete.title}"`);
          }
      }
  }

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const newMember: TeamMember = { ...memberData, id: `user_${Date.now()}` };
          const updatedWorkspace = { ...currentWorkspace, team: [...currentWorkspace.team, newMember] };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          logActivity(`додав(ла) нового учасника: "${newMember.name}"`);
      }
  }

  const removeTeamMember = async (memberId: string) => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const memberToRemove = currentWorkspace.team.find(m => m.id === memberId);
          const updatedTeam = currentWorkspace.team.filter(member => member.id !== memberId);
          const updatedWorkspace = { ...currentWorkspace, team: updatedTeam };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          if(memberToRemove) {
            logActivity(`видалив(ла) учасника: "${memberToRemove.name}"`);
          }
      }
  }

  const addChatMessage = async (messageData: { text: string; authorId: string; authorName: string; channelId: string }) => {
    if (!workspace) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageData.text,
      authorId: messageData.authorId,
      authorName: messageData.authorName,
      timestamp: new Date().toISOString(),
      channelId: messageData.channelId
    }
    
    // Ensure chat is an array, fallback to empty array if not
    const currentChat = Array.isArray(workspace.chat) ? workspace.chat : []
    console.log('Current chat:', currentChat, 'Type:', typeof workspace.chat, 'IsArray:', Array.isArray(workspace.chat))
    
    const updatedWorkspace = {
      ...workspace,
      chat: [...currentChat, newMessage]
    }
    
    // Update channel's lastMessageAt
    const updatedChannels = workspace.channels.map(channel => 
      channel.id === messageData.channelId 
        ? { ...channel, lastMessageAt: new Date() }
        : channel
    )
    
    const finalUpdatedWorkspace = {
      ...updatedWorkspace,
      channels: updatedChannels
    }
    
    setWorkspace(finalUpdatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(finalUpdatedWorkspace))
  }

  const createChannel = async (channelData: Omit<ChatChannel, 'id' | 'createdAt'>) => {
    if (!workspace) return
    
    const newChannel: ChatChannel = {
      ...channelData,
      id: `channel_${Date.now()}`,
      createdAt: new Date()
    }
    
    const updatedWorkspace = {
      ...workspace,
      channels: [...workspace.channels, newChannel]
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }

  const updateChannel = async (channelId: string, updates: Partial<ChatChannel>) => {
    if (!workspace) return
    
    const updatedChannels = workspace.channels.map(channel =>
      channel.id === channelId ? { ...channel, ...updates } : channel
    )
    
    const updatedWorkspace = {
      ...workspace,
      channels: updatedChannels
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }

  const deleteChannel = async (channelId: string) => {
    if (!workspace) return
    
    const updatedChannels = workspace.channels.filter(channel => channel.id !== channelId)
    const updatedChat = workspace.chat.filter(message => message.channelId !== channelId)
    
    const updatedWorkspace = {
      ...workspace,
      channels: updatedChannels,
      chat: updatedChat
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }

  const addReaction = async (messageId: string, emoji: string, userId: string) => {
    if (!workspace) return
    
    const updatedChat = workspace.chat.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions?.find(r => r.emoji === emoji)
        if (existingReaction) {
          const updatedReactions = message.reactions?.map(r =>
            r.emoji === emoji 
              ? { ...r, userIds: [...r.userIds, userId] }
              : r
          ) || []
          return { ...message, reactions: updatedReactions }
        } else {
          const newReaction: ChatReaction = { emoji, userIds: [userId] }
          return { 
            ...message, 
            reactions: [...(message.reactions || []), newReaction] 
          }
        }
      }
      return message
    })
    
    const updatedWorkspace = {
      ...workspace,
      chat: updatedChat
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }

  const removeReaction = async (messageId: string, emoji: string, userId: string) => {
    if (!workspace) return
    
    const updatedChat = workspace.chat.map(message => {
      if (message.id === messageId) {
        const updatedReactions = message.reactions?.map(r =>
          r.emoji === emoji 
            ? { ...r, userIds: r.userIds.filter(id => id !== userId) }
            : r
        ).filter(r => r.userIds.length > 0) || []
        return { ...message, reactions: updatedReactions }
      }
      return message
    })
    
    const updatedWorkspace = {
      ...workspace,
      chat: updatedChat
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE, JSON.stringify(updatedWorkspace))
  }


  // --- Управління кампаніями ---
  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'launcherId'>) => {
      if (!user) return
      const allCampaigns = localStorageUtils.get<Campaign[]>(LOCAL_STORAGE_KEYS.CAMPAIGNS, [])
      const newCampaign: Campaign = {
          ...campaignData,
          id: `camp_${Date.now()}`,
          launcherId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
      }
      const updatedCampaigns = [...allCampaigns, newCampaign]
      localStorageUtils.set(LOCAL_STORAGE_KEYS.CAMPAIGNS, updatedCampaigns)
      setCampaigns(filterCampaignsByRole(updatedCampaigns, user))
  }

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
      if (!user) return
      const allCampaigns = localStorageUtils.get<Campaign[]>(LOCAL_STORAGE_KEYS.CAMPAIGNS, [])
      const updatedCampaigns = allCampaigns.map(campaign =>
          campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date() } : campaign
      )
      localStorageUtils.set(LOCAL_STORAGE_KEYS.CAMPAIGNS, updatedCampaigns)
      setCampaigns(filterCampaignsByRole(updatedCampaigns, user))
  }

  const deleteCampaign = async (id: string) => {
      if (!user) return
      const allCampaigns = localStorageUtils.get<Campaign[]>(LOCAL_STORAGE_KEYS.CAMPAIGNS, [])
      const updatedCampaigns = allCampaigns.filter(campaign => campaign.id !== id)
      localStorageUtils.set(LOCAL_STORAGE_KEYS.CAMPAIGNS, updatedCampaigns)
      setCampaigns(filterCampaignsByRole(updatedCampaigns, user))
  }

  // --- Управління витратами ---
  const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
      const allExpenses = localStorageUtils.get<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, [])
      const newExpense: Expense = {
          ...expenseData,
          id: `exp_${Date.now()}`,
          createdAt: new Date(),
      }
      const updatedExpenses = [...allExpenses, newExpense]
      localStorageUtils.set(LOCAL_STORAGE_KEYS.EXPENSES, updatedExpenses)
      setExpenses(updatedExpenses)
  }

  // --- Управління картами ---
  const createCard = async (cardData: Omit<Card, 'id' | 'createdAt'>) => {
    const allCards = localStorageUtils.get<Card[]>(LOCAL_STORAGE_KEYS.CARDS, [])
    const newCard: Card = {
      ...cardData,
      id: `card_${Date.now()}`,
      createdAt: new Date(),
    }
    const updatedCards = [...allCards, newCard]
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, updatedCards)
    setCards(updatedCards)
  }

  const updateCard = async (id: string, updates: Partial<Card>) => {
    const allCards = localStorageUtils.get<Card[]>(LOCAL_STORAGE_KEYS.CARDS, [])
    const updatedCards = allCards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    )
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, updatedCards)
    setCards(updatedCards)
  }

  const deleteCard = async (id: string) => {
    const allCards = localStorageUtils.get<Card[]>(LOCAL_STORAGE_KEYS.CARDS, [])
    const updatedCards = allCards.filter(card => card.id !== id)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.CARDS, updatedCards)
    setCards(updatedCards)
  }

  // --- Управління проксі ---
  const createProxy = async (proxyData: Omit<Proxy, 'id' | 'createdAt'>) => {
    const allProxies = localStorageUtils.get<Proxy[]>(LOCAL_STORAGE_KEYS.PROXIES, [])
    const newProxy: Proxy = {
      ...proxyData,
      id: `proxy_${Date.now()}`,
      createdAt: new Date(),
    }
    const updatedProxies = [...allProxies, newProxy]
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, updatedProxies)
    setProxies(updatedProxies)
  }

  const updateProxy = async (id: string, updates: Partial<Proxy>) => {
    const allProxies = localStorageUtils.get<Proxy[]>(LOCAL_STORAGE_KEYS.PROXIES, [])
    const updatedProxies = allProxies.map(proxy =>
      proxy.id === id ? { ...proxy, ...updates } : proxy
    )
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, updatedProxies)
    setProxies(updatedProxies)
  }

  const deleteProxy = async (id: string) => {
    const allProxies = localStorageUtils.get<Proxy[]>(LOCAL_STORAGE_KEYS.PROXIES, [])
    const updatedProxies = allProxies.filter(proxy => proxy.id !== id)
    localStorageUtils.set(LOCAL_STORAGE_KEYS.PROXIES, updatedProxies)
    setProxies(updatedProxies)
  }

  const value: DataContextType = {
    accounts,
    campaigns,
    expenses,
    cards,
    proxies,
    workspace,
    dashboardStats,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
    addCommentToAccount,
    assignFarmerToAccount,
    updateWorkspace,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    removeTeamMember,
    logActivity,
    addChatMessage,
    createChannel,
    updateChannel,
    deleteChannel,
    addReaction,
    removeReaction,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    createExpense,
    createCard,
    updateCard,
    deleteCard,
    createProxy,
    updateProxy,
    deleteProxy,
    refreshAllData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Хук для використання даних
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// --- Утиліти для фільтрації ---
function filterAccountsByRole(accounts: Account[], user: User | null): Account[] {
  if (!user) return []
  if (user.role === 'admin' || user.role === 'leader') {
    return accounts
  }
  if (user.role === 'farmer') {
    return accounts.filter(acc => acc.farmerId === user.id)
  }
  return [] // Інші ролі не бачать акаунти
}

function filterCampaignsByRole(campaigns: Campaign[], user: User | null): Campaign[] {
    if (!user || user.role === 'admin' || user.role === 'leader') {
        return campaigns
    }
    if (user.role === 'launcher') {
        return campaigns.filter(camp => camp.launcherId === user.id)
    }
    return [] // Інші ролі не бачать кампанії
} 