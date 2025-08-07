import { TeamService } from './airtable'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'leader' | 'farmer' | 'launcher' | 'viewer'
  status: 'active' | 'pending' | 'suspended'
  permissions: string[]
  joinDate: Date
  lastLogin?: Date
  avatar?: string
  phone?: string
  department?: string
  manager?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: User['role']
  phone?: string
  department?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Отримання поточного стану
  getState(): AuthState {
    return {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false,
      error: null
    }
  }

  // Підписка на зміни стану
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Сповіщення слухачів про зміни
  private notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }

  // Вхід в систему
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Отримуємо всіх користувачів з Airtable
      const teamMembers = await TeamService.getAllTeamMembers()
      
      // Шукаємо користувача за email
      const userRecord = teamMembers.find(member => 
        member.fields.Email?.toLowerCase() === credentials.email.toLowerCase()
      )

      if (!userRecord) {
        throw new Error('Користувача не знайдено')
      }

      // Перевіряємо статус користувача
      if (userRecord.fields.Status !== 'active') {
        throw new Error('Обліковий запис не активний')
      }

      // В реальному проекті тут була б перевірка пароля
      // Поки що просто перевіряємо, що пароль не пустий
      if (!credentials.password) {
        throw new Error('Невірний пароль')
      }

      // Конвертуємо запис в об'єкт користувача
      const user: User = {
        id: userRecord.id,
        name: userRecord.fields.Name || '',
        email: userRecord.fields.Email || '',
        role: userRecord.fields.Role || 'viewer',
        status: userRecord.fields.Status || 'pending',
        permissions: userRecord.fields.Permissions || [],
        joinDate: userRecord.fields['Join Date'] ? new Date(userRecord.fields['Join Date']) : new Date(),
        lastLogin: new Date(),
        avatar: userRecord.fields.Avatar || '',
        phone: userRecord.fields.Phone || '',
        department: userRecord.fields.Department || '',
        manager: userRecord.fields.Manager || ''
      }

      this.currentUser = user
      
      // Зберігаємо в localStorage
      localStorage.setItem('nexus_user', JSON.stringify(user))
      
      // Оновлюємо останній вхід в Airtable
      await TeamService.updateTeamMember(userRecord.id, {
        'Last Login': new Date().toISOString()
      })

      this.notifyListeners()
      return user

    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Реєстрація нового користувача (тільки для адміністраторів)
  async registerUser(data: RegisterData): Promise<User> {
    try {
      // Перевіряємо, чи поточний користувач є адміністратором
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав для створення користувачів')
      }

      // Перевіряємо, чи email вже існує
      const teamMembers = await TeamService.getAllTeamMembers()
      const existingUser = teamMembers.find(member => 
        member.fields.Email?.toLowerCase() === data.email.toLowerCase()
      )

      if (existingUser) {
        throw new Error('Користувач з таким email вже існує')
      }

      // Створюємо нового користувача в Airtable
      const newUserRecord = await TeamService.createTeamMember({
        Name: data.name,
        Email: data.email,
        Role: data.role,
        Status: 'pending', // Потребує підтвердження адміністратора
        'Join Date': new Date().toISOString(),
        Phone: data.phone || '',
        Department: data.department || '',
        Manager: this.currentUser.id,
        Permissions: this.getDefaultPermissions(data.role)
      })

      // Конвертуємо в об'єкт користувача
      const user: User = {
        id: newUserRecord.id,
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'pending',
        permissions: this.getDefaultPermissions(data.role),
        joinDate: new Date(),
        phone: data.phone,
        department: data.department,
        manager: this.currentUser.id
      }

      return user

    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Підтвердження користувача адміністратором
  async approveUser(userId: string): Promise<boolean> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав для підтвердження користувачів')
      }

      await TeamService.updateTeamMember(userId, {
        Status: 'active',
        'Approved By': this.currentUser.id,
        'Approved At': new Date().toISOString()
      })

      return true

    } catch (error) {
      console.error('User approval error:', error)
      throw error
    }
  }

  // Блокування користувача
  async suspendUser(userId: string, reason: string): Promise<boolean> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав для блокування користувачів')
      }

      await TeamService.updateTeamMember(userId, {
        Status: 'suspended',
        'Suspended By': this.currentUser.id,
        'Suspended At': new Date().toISOString(),
        'Suspension Reason': reason
      })

      return true

    } catch (error) {
      console.error('User suspension error:', error)
      throw error
    }
  }

  // Оновлення профілю користувача
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Перевіряємо права
      if (!this.currentUser || (this.currentUser.id !== userId && this.currentUser.role !== 'admin')) {
        throw new Error('Недостатньо прав для оновлення профілю')
      }

      const updateData: Record<string, any> = {}
      
      if (updates.name) updateData.Name = updates.name
      if (updates.phone) updateData.Phone = updates.phone
      if (updates.department) updateData.Department = updates.department
      if (updates.avatar) updateData.Avatar = updates.avatar

      await TeamService.updateTeamMember(userId, updateData)

      // Оновлюємо локальний стан, якщо це поточний користувач
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = { ...this.currentUser, ...updates }
        localStorage.setItem('nexus_user', JSON.stringify(this.currentUser))
        this.notifyListeners()
      }

      return this.currentUser!

    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  // Зміна ролі користувача
  async changeUserRole(userId: string, newRole: User['role']): Promise<boolean> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав для зміни ролі')
      }

      await TeamService.updateTeamMember(userId, {
        Role: newRole,
        Permissions: this.getDefaultPermissions(newRole),
        'Role Changed By': this.currentUser.id,
        'Role Changed At': new Date().toISOString()
      })

      return true

    } catch (error) {
      console.error('Role change error:', error)
      throw error
    }
  }

  // Вихід з системи
  logout(): void {
    this.currentUser = null
    localStorage.removeItem('nexus_user')
    this.notifyListeners()
  }

  // Перевірка автентифікації при завантаженні
  async checkAuth(): Promise<User | null> {
    try {
      const savedUser = localStorage.getItem('nexus_user')
      if (!savedUser) return null

      const user: User = JSON.parse(savedUser)
      
      // Перевіряємо, чи користувач все ще існує в базі
      const userRecord = await TeamService.getTeamMemberById(user.id)
      if (!userRecord || userRecord.fields.Status !== 'active') {
        this.logout()
        return null
      }

      this.currentUser = user
      this.notifyListeners()
      return user

    } catch (error) {
      console.error('Auth check error:', error)
      this.logout()
      return null
    }
  }

  // Отримання всіх користувачів (тільки для адміністраторів)
  async getAllUsers(): Promise<User[]> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав для перегляду користувачів')
      }

      const teamMembers = await TeamService.getAllTeamMembers()
      
      return teamMembers.map(member => ({
        id: member.id,
        name: member.fields.Name || '',
        email: member.fields.Email || '',
        role: member.fields.Role || 'viewer',
        status: member.fields.Status || 'pending',
        permissions: member.fields.Permissions || [],
        joinDate: member.fields['Join Date'] ? new Date(member.fields['Join Date']) : new Date(),
        lastLogin: member.fields['Last Login'] ? new Date(member.fields['Last Login']) : undefined,
        avatar: member.fields.Avatar || '',
        phone: member.fields.Phone || '',
        department: member.fields.Department || '',
        manager: member.fields.Manager || ''
      }))

    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  }

  // Отримання користувачів за статусом
  async getUsersByStatus(status: User['status']): Promise<User[]> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        throw new Error('Недостатньо прав')
      }

      const teamMembers = await TeamService.getTeamMembersByRole(status)
      
      return teamMembers.map(member => ({
        id: member.id,
        name: member.fields.Name || '',
        email: member.fields.Email || '',
        role: member.fields.Role || 'viewer',
        status: member.fields.Status || 'pending',
        permissions: member.fields.Permissions || [],
        joinDate: member.fields['Join Date'] ? new Date(member.fields['Join Date']) : new Date(),
        lastLogin: member.fields['Last Login'] ? new Date(member.fields['Last Login']) : undefined,
        avatar: member.fields.Avatar || '',
        phone: member.fields.Phone || '',
        department: member.fields.Department || '',
        manager: member.fields.Manager || ''
      }))

    } catch (error) {
      console.error('Get users by status error:', error)
      throw error
    }
  }

  // Перевірка прав доступу
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false
    return this.currentUser.permissions.includes(permission) || this.currentUser.role === 'admin'
  }

  // Перевірка ролі
  hasRole(role: User['role']): boolean {
    if (!this.currentUser) return false
    return this.currentUser.role === role
  }

  // Отримання прав за замовчуванням для ролі
  private getDefaultPermissions(role: User['role']): string[] {
    const permissions = {
      admin: [
        'users.manage',
        'users.view',
        'accounts.manage',
        'accounts.view',
        'campaigns.manage',
        'campaigns.view',
        'reports.view',
        'settings.manage'
      ],
      leader: [
        'users.view',
        'accounts.manage',
        'accounts.view',
        'campaigns.manage',
        'campaigns.view',
        'reports.view'
      ],
      farmer: [
        'accounts.view',
        'campaigns.view',
        'reports.view'
      ],
      launcher: [
        'accounts.view',
        'campaigns.manage',
        'campaigns.view',
        'reports.view'
      ],
      viewer: [
        'accounts.view',
        'campaigns.view',
        'reports.view'
      ]
    }

    return permissions[role] || []
  }
}

export default AuthService.getInstance() 