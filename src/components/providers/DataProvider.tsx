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

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'critical';
    assigneeId?: string;
    dueDate?: Date;
    comments?: TaskComment[];
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
  backupCodes?: string[]
  cookieData?: string
  createdAt: Date
  updatedAt: Date
  isLocal?: boolean
  createdBy?: string
  createdByName?: string
}

export interface Card {
  id: string
  number: string
  type: 'visa' | 'mastercard' | 'amex'
  status: 'active' | 'blocked' | 'expired' | 'testing' | 'assigned' | 'in_use'
  balance: number
  currency: string
  country: string
  bank: string
  expiryDate: string
  cvv: string
  holderName: string
  cost: number // Собівартість карти
  assignedTo?: string // ID аккаунта, якому призначена карта
  assignedBy?: string // ID користувача, який призначив карту
  assignedAt?: Date
  createdAt: Date
  lastUsed?: Date
  notes?: string
  tags?: string[]
}

export interface Proxy {
  id: string
  ip: string
  port: number
  type: 'http' | 'https' | 'socks4' | 'socks5'
  status: 'active' | 'inactive' | 'testing' | 'blocked' | 'assigned' | 'in_use'
  country: string
  city?: string
  speed: number
  uptime: number
  username?: string
  password?: string
  cost: number // Собівартість проксі
  assignedTo?: string // ID аккаунта, якому призначений проксі
  assignedBy?: string // ID користувача, який призначив проксі
  assignedAt?: Date
  createdAt: Date
  lastTested?: Date
  notes?: string
  tags?: string[]
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
  createAccount: (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'farmerId' | 'comments' | 'statusHistory' | 'isLocal' | 'createdBy' | 'createdByName'>) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  addCommentToAccount: (accountId: string, commentText: string) => Promise<void>
  assignFarmerToAccount: (accountId: string, farmerId: string) => Promise<void>

  // Функції для робочого простору
  updateWorkspace: (updates: Partial<Workspace>) => Promise<void>
  addTask: (taskData: Omit<Task, 'id'>) => Promise<Task>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  addTeamMember: (memberData: Omit<TeamMember, 'id'>) => Promise<void>
  removeTeamMember: (memberId: string) => Promise<void>
  logActivity: (text: string) => Promise<void>
  addChatMessage: (messageData: { text: string; authorId: string; authorName: string; channelId: string; replyTo?: string }) => Promise<void>
  createChannel: (channelData: Omit<ChatChannel, 'id' | 'createdAt'>) => Promise<void>
  updateChannel: (channelId: string, updates: Partial<ChatChannel>) => Promise<void>
  deleteChannel: (channelId: string) => Promise<void>
  addReaction: (messageId: string, emoji: string, userId: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string, userId: string) => Promise<void>
  addCommentToTask: (taskId: string, content: string) => Promise<void>

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
  // Перевіряємо, чи вже є дані
  if (typeof window === 'undefined') return

  const existingCards = localStorage.getItem(LOCAL_STORAGE_KEYS.CARDS)
  const existingProxies = localStorage.getItem(LOCAL_STORAGE_KEYS.PROXIES)

  // Створюємо тестові карти
  if (!existingCards) {
    const mockCards: Card[] = [
      {
        id: 'card_1',
        number: '4111111111111111',
        type: 'visa',
        status: 'active',
        balance: 1000,
        currency: 'USD',
        country: 'USA',
        bank: 'Chase Bank',
        expiryDate: '12/25',
        cvv: '123',
        holderName: 'John Smith',
        cost: 50,
        createdAt: new Date(),
        tags: ['premium', 'verified']
      },
      {
        id: 'card_2',
        number: '5555555555554444',
        type: 'mastercard',
        status: 'active',
        balance: 2500,
        currency: 'USD',
        country: 'Canada',
        bank: 'Royal Bank',
        expiryDate: '06/26',
        cvv: '456',
        holderName: 'Jane Doe',
        cost: 75,
        createdAt: new Date(),
        tags: ['business']
      },
      {
        id: 'card_3',
        number: '378282246310005',
        type: 'amex',
        status: 'assigned',
        balance: 5000,
        currency: 'USD',
        country: 'USA',
        bank: 'American Express',
        expiryDate: '09/27',
        cvv: '789',
        holderName: 'Mike Johnson',
        cost: 100,
        assignedTo: 'account_1',
        assignedBy: 'user_1',
        assignedAt: new Date(),
        createdAt: new Date(),
        tags: ['platinum']
      }
    ]
    localStorage.setItem(LOCAL_STORAGE_KEYS.CARDS, JSON.stringify(mockCards))
  }

  // Створюємо тестові проксі
  if (!existingProxies) {
    const mockProxies: Proxy[] = [
      {
        id: 'proxy_1',
        ip: '192.168.1.100',
        port: 8080,
        type: 'http',
        status: 'active',
        country: 'USA',
        city: 'New York',
        speed: 100,
        uptime: 99,
        username: 'user1',
        password: 'pass1',
        cost: 10,
        createdAt: new Date(),
        tags: ['fast', 'reliable']
      },
      {
        id: 'proxy_2',
        ip: '10.0.0.50',
        port: 3128,
        type: 'https',
        status: 'active',
        country: 'Germany',
        city: 'Berlin',
        speed: 150,
        uptime: 98,
        username: 'user2',
        password: 'pass2',
        cost: 15,
        createdAt: new Date(),
        tags: ['secure']
      },
      {
        id: 'proxy_3',
        ip: '172.16.0.25',
        port: 1080,
        type: 'socks5',
        status: 'assigned',
        country: 'Netherlands',
        city: 'Amsterdam',
        speed: 200,
        uptime: 99,
        username: 'user3',
        password: 'pass3',
        cost: 20,
        assignedTo: 'account_2',
        assignedBy: 'user_1',
        assignedAt: new Date(),
        createdAt: new Date(),
        tags: ['premium', 'anonymous']
      }
    ]
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROXIES, JSON.stringify(mockProxies))
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
    let singleWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null)

    // Створюємо робочий простір за замовчуванням, якщо відсутній
    if (!singleWorkspace && user) {
      singleWorkspace = {
        id: 'ws-1',
        name: 'Default Workspace',
        description: 'Автоматично створений простір',
        ownerId: user.id,
        team: [],
        tasks: [],
        activity: [],
        chat: [],
        channels: [],
        createdAt: new Date(),
      }
      localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, singleWorkspace)
    }
    
    // Validate and fix workspace data if needed
    const validatedWorkspace = singleWorkspace ? {
      ...singleWorkspace,
      team: Array.isArray(singleWorkspace.team) ? singleWorkspace.team : [],
      tasks: Array.isArray(singleWorkspace.tasks) ? singleWorkspace.tasks.map((t: any) => ({
        ...t,
        dueDate: t?.dueDate ? new Date(t.dueDate) : undefined,
      })) : [],
      activity: Array.isArray(singleWorkspace.activity) ? singleWorkspace.activity.map((a: any) => ({...a, timestamp: new Date(a.timestamp)})) : [],
      chat: Array.isArray(singleWorkspace.chat) ? singleWorkspace.chat : [],
      channels: Array.isArray(singleWorkspace.channels) ? singleWorkspace.channels.map((c: any) => ({
        ...c,
        createdAt: c?.createdAt ? new Date(c.createdAt) : undefined,
        lastMessageAt: c?.lastMessageAt ? new Date(c.lastMessageAt) : undefined,
      })) : [],
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
  const createAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'farmerId' | 'comments' | 'statusHistory' | 'isLocal' | 'createdBy' | 'createdByName'>) => {
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
      createdBy: user.id,
      createdByName: user.name || user.email,
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
  
  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
      const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null);
      if (currentWorkspace) {
          const newTask: Task = { ...taskData, id: `task_${Date.now()}`, comments: [] };
          const updatedWorkspace = { ...currentWorkspace, tasks: [...currentWorkspace.tasks, newTask] };
          localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace);
          setWorkspace(updatedWorkspace);
          logActivity(`створив(ла) нову задачу: "${newTask.title}"`);
          return newTask;
      }
      // Якщо робочого простору ще немає, створимо його і додамо задачу
      const newWorkspace: Workspace = {
        id: 'ws-1',
        name: 'Default Workspace',
        description: 'Автоматично створений простір',
        ownerId: user?.id || 'unknown',
        team: [],
        tasks: [],
        activity: [],
        chat: [],
        channels: [],
        createdAt: new Date(),
      }
      const newTask: Task = { ...taskData, id: `task_${Date.now()}`, comments: [] };
      newWorkspace.tasks = [newTask];
      localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, newWorkspace);
      setWorkspace(newWorkspace);
      logActivity(`створив(ла) нову задачу: "${newTask.title}"`);
      return newTask;
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

  const addCommentToTask = async (taskId: string, content: string) => {
    const currentWorkspace = localStorageUtils.get<Workspace | null>(LOCAL_STORAGE_KEYS.WORKSPACE, null)
    if (!currentWorkspace || !user) return

    const newComment: TaskComment = {
      id: `tcomment_${Date.now()}`,
      authorId: user.id,
      authorName: user.name || user.email,
      content,
      timestamp: new Date(),
    }

    const updatedTasks = (currentWorkspace.tasks || []).map((t: any) =>
      t.id === taskId
        ? { ...t, comments: Array.isArray(t.comments) ? [...t.comments, newComment] : [newComment] }
        : t
    )

    const updatedWorkspace = { ...currentWorkspace, tasks: updatedTasks }
    localStorageUtils.set(LOCAL_STORAGE_KEYS.WORKSPACE, updatedWorkspace)
    setWorkspace(updatedWorkspace)
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

  const addChatMessage = async (messageData: { text: string; authorId: string; authorName: string; channelId: string; replyTo?: string }) => {
    if (!workspace) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageData.text,
      authorId: messageData.authorId,
      authorName: messageData.authorName,
      timestamp: new Date().toISOString(),
      channelId: messageData.channelId,
      replyTo: messageData.replyTo,
    }
    
    // Ensure chat is an array, fallback to empty array if not
    const currentChat = Array.isArray(workspace.chat) ? workspace.chat : []
    console.log('Current chat:', currentChat, 'Type:', typeof workspace.chat, 'IsArray:', Array.isArray(workspace.chat))
    
    const updatedWorkspace = {
      ...workspace,
      chat: [...currentChat, newMessage]
    }
    
    // Update channel's lastMessageAt
    const currentChannels = Array.isArray(workspace.channels) ? workspace.channels : []
    const updatedChannels = currentChannels.map(channel => 
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
    addCommentToTask,
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

export default DataProvider;

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