export interface User {
  id: string
  email: string
  name: string
  role: 'farmer' | 'launcher' | 'leader'
  avatar?: string
  
  // Розширені дані профілю
  telegramUsername?: string
  phoneNumber?: string
  location?: string
  birthDate?: Date
  birthTime?: string
  
  // Проекти
  projects?: Project[]
  
  // Мови
  languages?: string[]
  
  // Опис
  description?: string
  
  // Статус верифікації
  isVerified?: boolean
  verificationDate?: Date
  
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  links: string[]
  description: string
  role: string
  responsibilities: string
  startDate?: Date
  endDate?: Date
  isActive: boolean
}

// Розхідники для фармерів
export interface Expense {
  id: string
  type: 'card' | 'proxy' | 'sim' | 'other'
  name: string
  cost: number
  status: 'active' | 'used' | 'expired'
  farmerId: string
  platform?: string
  details?: string
  createdAt: Date
  usedAt?: Date
}

export interface LoginHistory {
  id: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  success: boolean
  notes?: string
}

// Оффери (замість Campaigns)
export interface Offer {
  id: string
  name: string
  category: string
  platform: string
  payout: number
  currency: string
  status: 'active' | 'paused' | 'expired' | 'draft'
  requirements: string[]
  creatives: string[]
  targeting: CampaignTargeting
  performance: {
    totalClicks: number
    totalConversions: number
    totalRevenue: number
    conversionRate: number
    averagePayout: number
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
  description?: string
}

// Аккаунти, створені фармерами
export interface Account {
  id: string
  name: string
  email: string
  phone: string
  platform: string
  status: 'farming_day_1' | 'farming_day_2' | 'farming_day_3' | 'blocked_pp' | 'blocked_system' | 'blocked_passport' | 'ready_for_ads' | 'dead' | 'sold'
  category: string
  farmerId: string
  launcherId?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  comments?: string
  notes?: string; 
  aiEvaluation?: any
  automations?: any[]
  // Безпека
  password?: string
  twoFactorCode?: string
  backupCodes?: string[]
  statusHistory?: string[] // Added statusHistory
  trafficType?: string // Added trafficType
  createdAt: Date
  updatedAt: Date
}

// Кампанії, запущені арбітражниками
export interface Campaign {
  id: string
  name: string
  offerId: string // ID офери замість просто назви
  linkId: string // ID посилання офери
  accountId: string // ID аккаунта від фармера
  launcherId: string // ID арбітражника
  budget: number
  spent: number
  clicks: number
  conversions: number
  revenue: number
  roi: number
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Instagram' | 'YouTube'
  status: 'active' | 'paused' | 'completed' | 'failed'
  startDate: Date
  endDate?: Date
  creatives: string[]
  targeting?: CampaignTargeting
  results: CampaignResult[]
  googleAdsData?: GoogleAdsCampaignData // Додаємо Google Ads дані
  createdAt: Date
  updatedAt: Date
}

// Налаштування таргетингу
export interface CampaignTargeting {
  age?: { min: number; max: number }
  gender?: 'male' | 'female' | 'all'
  interests?: string[]
  locations?: string[]
  devices?: string[]
  customAudience?: string[]
  countries?: string[]
}

// Результати кампанії
export interface CampaignResult {
  id: string
  campaignId: string
  date: Date
  impressions: number
  clicks: number
  conversions: number
  spend: number
  revenue: number
  ctr: number
  cpc: number
  cpa: number
  roi: number
}

// Щоденна статистика кампанії
export interface CampaignDailyStats {
  id: string
  campaignId: string
  date: string // YYYY-MM-DD format
  impressions: number
  clicks: number
  conversions: number
  leads: number
  spend: number
  revenue: number
  ctr: number // Click-through rate
  cvr: number // Conversion rate
  cpl: number // Cost per lead
  roi: number // Return on investment
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string // User ID who entered the stats
}

export interface Task {
  id: string
  title: string
  description: string
  assigneeId: string
  deadline: Date
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  sprint?: string
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  date: Date
  earnings: number
  expenses: number
  accountsCount: number
  campaignsCount: number
  roi: number
  teamId: string
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string
  tests: Test[]
  order: number
}

export interface Test {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export interface TestResult {
  id: string
  userId: string
  moduleId: string
  score: number
  completedAt: Date
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: Date
  type: 'text' | 'file'
}

export interface Sprint {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: 'planning' | 'active' | 'completed'
  tasks: Task[]
}

// Статистика для дашборду
export interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  totalOffers: number
  activeOffers: number
  totalRevenue: number
  totalSpent: number
  totalROI: number
  accountsByPlatform: { platform: string; count: number }[]
  offersByStatus: { status: string; count: number }[]
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'account_created' | 'account_transferred' | 'offer_started' | 'offer_completed'
  userId: string
  userName: string
  description: string
  timestamp: Date
  metadata?: any
}

// Уніфіковані типи для Airtable
export interface AirtableAccount {
  id: string
  name: string
  email: string
  phone?: string
  platform: string
  status: string
  category: string
  farmerId: string
  comments?: string
  priority?: string
  tags?: string[]
  createdAt: string
}

export interface AirtableOffer {
  id: string
  name: string
  vertical: string
  source: string
  rate: number
  revenue: number
  expenses: number
  roi: number
  period: string
  status: string
  createdAt: string
}

export interface AirtableExpense {
  id: string
  name: string
  expenseType: string
  amount: number
  linkedOffer?: string
  linkedCard?: string
  linkedProxy?: string
  date?: string
  description?: string
  createdAt: string
}

export interface AirtableTeamMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate?: string
  permissions?: string[]
  createdAt: string
}

export type UserRole = 'farmer' | 'launcher' | 'leader'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type AccountStatus = 'active' | 'banned' | 'moderation' | 'pending'
export type OfferStatus = 'active' | 'paused' | 'expired' | 'draft'
export type ExpenseType = 'card' | 'proxy' | 'sim' | 'other'
export type ExpenseStatus = 'active' | 'used' | 'expired' 

// Google Ads типи
export interface GoogleAdsConnection {
  id: string
  name: string
  clientId: string
  clientSecret: string
  customerId: string
  accessToken: string
  refreshToken: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GoogleAdsCampaignData {
  id: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  budget: number
  budgetType: 'STANDARD' | 'UNLIMITED'
  startDate: string
  endDate?: string
  targeting: {
    locations: string[]
    languages: string[]
    ageRanges: string[]
    genders: string[]
  }
  metrics?: {
    impressions: number
    clicks: number
    cost: number
    conversions: number
    conversionValue: number
    ctr: number
    cpc: number
    cpm: number
    roas: number
  }
}

// Додаткові типи для повідомлень та звітів
export interface Message {
  id: string
  senderId: string
  receiverId?: string
  teamId?: string
  content: string
  timestamp: Date
  type: 'message' | 'announcement' | 'task' | 'system'
  priority: 'low' | 'medium' | 'high'
  status: 'read' | 'unread'
  isPinned?: boolean
  relatedTaskId?: string
}

export interface Report {
  id: string
  title: string
  type: 'performance' | 'team' | 'financial' | 'analytics'
  dateGenerated: Date
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  data: any
  generatedBy: string
  createdAt: Date
  updatedAt: Date
}

// Робочі простори
export interface Workspace {
  id: string
  name: string
  description?: string
  type: 'personal' | 'team' | 'project'
  ownerId: string
  members: WorkspaceMember[]
  settings: WorkspaceSettings
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  id: string
  userId: string
  workspaceId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: WorkspacePermission[]
  joinedAt: Date
  invitedBy?: string
}

export interface WorkspacePermission {
  resource: 'accounts' | 'campaigns' | 'reports' | 'settings' | 'members'
  actions: ('read' | 'write' | 'delete' | 'admin')[]
}

export interface WorkspaceSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'uk' | 'en' | 'ru'
  timezone: string
  notifications: NotificationSettings
  security: SecuritySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  telegram: boolean
  types: {
    accountAlerts: boolean
    campaignUpdates: boolean
    teamMessages: boolean
    systemAnnouncements: boolean
  }
}

export interface SecuritySettings {
  twoFactorRequired: boolean
  sessionTimeout: number // в хвилинах
  ipWhitelist?: string[]
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
  }
}

// Особистий простір
export interface PersonalSpace {
  id: string
  userId: string
  workspace: Workspace
  dashboard: PersonalDashboard
  quickActions: QuickAction[]
  recentItems: RecentItem[]
  preferences: PersonalPreferences
}

export interface PersonalDashboard {
  widgets: DashboardWidget[]
  layout: WidgetLayout[]
  customMetrics: CustomMetric[]
}

export interface DashboardWidget {
  id: string
  type: 'stats' | 'chart' | 'list' | 'calendar' | 'progress'
  title: string
  config: any
  position: { x: number; y: number; w: number; h: number }
  isVisible: boolean
}

export interface WidgetLayout {
  widgetId: string
  position: { x: number; y: number; w: number; h: number }
}

export interface CustomMetric {
  id: string
  name: string
  formula: string
  color: string
  isVisible: boolean
}

export interface QuickAction {
  id: string
  name: string
  icon: string
  action: string
  shortcut?: string
  isVisible: boolean
}

export interface RecentItem {
  id: string
  type: 'account' | 'campaign' | 'report' | 'task'
  title: string
  url: string
  lastAccessed: Date
}

export interface PersonalPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'uk' | 'en' | 'ru'
  timezone: string
  dateFormat: string
  numberFormat: string
  sidebarCollapsed: boolean
  compactMode: boolean
}

// Командний простір
export interface TeamSpace {
  id: string
  workspace: Workspace
  team: Team
  projects: Project[]
  sprints: Sprint[]
  tasks: Task[]
  analytics: TeamAnalytics
  communication: TeamCommunication
}

export interface Team {
  id: string
  name: string
  description?: string
  leaderId: string
  members: TeamMember[]
  roles: TeamRole[]
  settings: TeamSettings
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  permissions: TeamPermission[]
  joinedAt: Date
  isActive: boolean
  performance: MemberPerformance
}

export interface TeamRole {
  id: string
  name: string
  description?: string
  permissions: TeamPermission[]
  color: string
  isDefault: boolean
}

export interface TeamPermission {
  resource: 'accounts' | 'campaigns' | 'reports' | 'tasks' | 'team' | 'settings'
  actions: ('read' | 'write' | 'delete' | 'admin')[]
}

export interface TeamSettings {
  autoAssignTasks: boolean
  requireApproval: boolean
  dailyStandup: boolean
  weeklyRetrospective: boolean
  notifications: TeamNotificationSettings
}

export interface TeamNotificationSettings {
  taskAssignments: boolean
  deadlineReminders: boolean
  teamMessages: boolean
  performanceUpdates: boolean
}

export interface MemberPerformance {
  tasksCompleted: number
  tasksOverdue: number
  averageCompletionTime: number
  qualityScore: number
  lastUpdated: Date
}

export interface TeamAnalytics {
  productivity: ProductivityMetrics
  collaboration: CollaborationMetrics
  performance: PerformanceMetrics
  trends: TrendData[]
}

export interface ProductivityMetrics {
  tasksCompleted: number
  tasksInProgress: number
  averageTaskDuration: number
  completionRate: number
  overdueTasks: number
}

export interface CollaborationMetrics {
  messagesSent: number
  filesShared: number
  meetingsHeld: number
  teamEngagement: number
}

export interface PerformanceMetrics {
  totalRevenue: number
  totalSpent: number
  roi: number
  accountsCreated: number
  campaignsLaunched: number
}

export interface TrendData {
  date: Date
  metric: string
  value: number
  change: number
}

export interface TeamCommunication {
  channels: CommunicationChannel[]
  messages: Message[]
  announcements: Announcement[]
  meetings: Meeting[]
}

export interface CommunicationChannel {
  id: string
  name: string
  type: 'general' | 'project' | 'announcements' | 'random'
  members: string[]
  isPrivate: boolean
  createdAt: Date
}

export interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  priority: 'low' | 'medium' | 'high'
  isPinned: boolean
  expiresAt?: Date
  createdAt: Date
}

export interface Meeting {
  id: string
  title: string
  description?: string
  organizerId: string
  participants: string[]
  startTime: Date
  endTime: Date
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  meetingUrl?: string
  notes?: string
  createdAt: Date
} 