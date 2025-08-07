'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Local Storage Keys
const USERS_STORAGE_KEY = 'nexus_users'
const CURRENT_USER_STORAGE_KEY = 'nexus_user'

// Типи
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'leader' | 'farmer' | 'launcher' | 'viewer'
  status: 'active' | 'pending' | 'suspended'
  createdAt: Date
  updatedAt: Date
  password?: string // Пароль зберігається тільки локально, ніколи не відправляється на сервер
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: string
}

// Контекст
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  registerUser: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => void
  approveUser: (userId: string) => Promise<{ success: boolean }>
  getAllUsers: () => User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Провайдер
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  // Ініціалізація тільки на клієнті
  useEffect(() => {
    const getInitialUsers = (): User[] => {
      try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          return parsedUsers.map((u: any) => ({
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt)
          }))
        }
      } catch (error) {
        console.error("Failed to parse users from localStorage", error)
      }

      const initialUsers: User[] = [
          { id: '1', name: 'Адміністратор', email: 'admin@nexus.com', password: 'admin123', role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date() },
          { id: '2', name: 'Олександр Петренко', email: 'leader@nexus.com', password: 'leader123', role: 'leader', status: 'active', createdAt: new Date(), updatedAt: new Date() },
          { id: '3', name: 'Марія Іваненко', email: 'farmer@nexus.com', password: 'farmer123', role: 'farmer', status: 'active', createdAt: new Date(), updatedAt: new Date() },
          { id: '4', name: 'Дмитро Коваленко', email: 'launcher@nexus.com', password: 'launcher123', role: 'launcher', status: 'active', createdAt: new Date(), updatedAt: new Date() },
          { id: '5', name: 'Анна Сидоренко', email: 'viewer@nexus.com', password: 'viewer123', role: 'viewer', status: 'active', createdAt: new Date(), updatedAt: new Date() }
      ]
      
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers))
      } catch (error) {
        console.error("Failed to save initial users to localStorage", error)
      }
      
      return initialUsers
    }

    setUsers(getInitialUsers())
    checkAuth()
  }, [])

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))
    } catch (error) {
      console.error("Failed to save users to localStorage", error)
    }
  }

  const checkAuth = () => {
    setIsLoading(true)
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser({ ...userData, createdAt: new Date(userData.createdAt), updatedAt: new Date(userData.updatedAt) })
      } else {
        // Create a guest user if no one is logged in
        const guestUser: User = {
          id: 'guest',
          name: 'Guest User',
          email: 'guest@nexus.com',
          role: 'viewer',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUser(guestUser);
      }
    } catch (error) {
      console.error('Error checking auth from localStorage:', error)
      setUser(null) // Очищуємо користувача у разі помилки
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const foundUser = users.find(u => u.email === credentials.email)

    if (!foundUser) {
      return { success: false, error: 'Користувача не знайдено' }
    }

    if (foundUser.password !== credentials.password) {
      return { success: false, error: 'Невірний пароль' }
    }

    if (foundUser.status === 'suspended') {
      return { success: false, error: 'Акаунт заблоковано' }
    }

    if (foundUser.status === 'pending') {
      return { success: false, error: 'Акаунт очікує підтвердження' }
    }
    
    const { password, ...userToSave } = foundUser
    
    setUser(userToSave)
    try {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToSave))
    } catch (error) {
      console.error("Failed to save current user to localStorage", error)
      return { success: false, error: 'Помилка збереження сесії' }
    }
    
    return { success: true }
  }

  const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const existingUser = users.find(u => u.email === data.email)
    if (existingUser) {
      return { success: false, error: 'Користувач з таким email вже існує' }
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as User['role'],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    saveUsers([...users, newUser])
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      // Перенаправляємо на сторінку входу
      window.location.href = '/login'
    } catch (error) {
      console.error("Failed to remove current user from localStorage", error)
    }
  }

  const approveUser = async (userId: string): Promise<{ success: boolean }> => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'active' as const, updatedAt: new Date() } : u
    )
    saveUsers(updatedUsers)
    return { success: true }
  }

  const getAllUsers = () => {
    return users
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerUser,
    logout,
    checkAuth,
    approveUser,
    getAllUsers
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 