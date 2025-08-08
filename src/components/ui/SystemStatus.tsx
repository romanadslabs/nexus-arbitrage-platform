'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database,
  Server,
  Shield
} from 'lucide-react'
import { Card } from './Card'

interface SystemStatusProps {
  className?: string
}

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'warning'
  message: string
  lastCheck: Date
  responseTime?: number
}

export default function SystemStatus({ className = '' }: SystemStatusProps) {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Локальне зберігання',
      status: 'online',
      message: 'Працює нормально',
      lastCheck: new Date()
    },
    {
      name: 'Кешування даних',
      status: 'online',
      message: 'Активне',
      lastCheck: new Date()
    },
    {
      name: 'Система аутентифікації',
      status: 'online',
      message: 'Працює нормально',
      lastCheck: new Date()
    }
  ])
  
  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Локальна перевірка без зовнішніх API
  const checkAllServices = async () => {
    setIsChecking(true)
    // Емуляція швидкої локальної перевірки
    setServices(prev => prev.map(s => ({ ...s, lastCheck: new Date(), status: 'online' })))
    setLastUpdate(new Date())
    setIsChecking(false)
  }

  useEffect(() => {
    checkAllServices()
    const interval = setInterval(checkAllServices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 dark:text-green-400'
      case 'offline':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const onlineServices = services.filter(s => s.status === 'online').length
  const totalServices = services.length

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Статус системи
          </h3>
        </div>
        
        <button
          onClick={checkAllServices}
          disabled={isChecking}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Загальний статус
          </span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${getStatusColor(onlineServices === totalServices ? 'online' : 'warning')}`}>
              {onlineServices}/{totalServices} сервісів працює
            </span>
            {onlineServices === totalServices ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(service.status)}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {service.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {service.message}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              {service.responseTime && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {service.responseTime}ms
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {service.lastCheck.toLocaleTimeString('uk-UA')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Last Update */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Останнє оновлення: {lastUpdate.toLocaleTimeString('uk-UA')}
        </p>
      </div>
    </Card>
  )
} 