'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { User as UserIcon, Settings, LogOut, Shield } from 'lucide-react'
import { User } from '@/components/providers/AuthProvider'

interface UserProfileProps {
  user: User | null
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

export default function UserProfile({ user, onLogout, isOpen, onClose }: UserProfileProps) {
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  }
  
  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          onClick={onClose}
        >
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Role Info */}
          <div className="p-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Shield className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                Роль: <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <Link href="/settings" className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
              <span>Налаштування</span>
            </Link>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Вийти</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 