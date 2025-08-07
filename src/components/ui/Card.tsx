'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  animate?: boolean
  whileHover?: boolean
  whileTap?: boolean
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  trend?: { value: number; isPositive: boolean } | string
  className?: string
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
  gray: 'bg-gray-500 text-white'
}

const colorTextClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  gray: 'text-gray-600 dark:text-gray-400'
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  animate = false,
  whileHover = false,
  whileTap = false
}: CardProps) {
  const baseClasses = 'rounded-xl p-4 sm:p-6 transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={whileHover ? { scale: 1.02, y: -2 } : undefined}
        whileTap={whileTap ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={classes}>{children}</div>
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  trend,
  className = ''
}: StatCardProps) {
  return (
    <Card 
      className={`relative overflow-hidden ${className}`}
      whileHover={true}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20 opacity-50`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} ml-3 flex-shrink-0`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center mt-2">
            {typeof trend === 'string' ? (
              <span className={`text-xs font-medium ${colorTextClasses[color]}`}>
                {trend}
              </span>
            ) : (
              <>
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend.isPositive ? '+' : '-'}{trend.value}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  з минулого місяця
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  className = ''
}: MetricCardProps) {
  return (
    <Card 
      className={`text-center ${className}`}
      whileHover={true}
    >
      {Icon && (
        <div className={`inline-flex p-3 rounded-full ${colorClasses[color]} mb-3`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </p>
      
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </Card>
  )
}

export default Card 