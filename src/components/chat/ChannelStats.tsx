'use client'

import React from 'react'
import { TrendingUp, MessageSquare, Users, Clock } from 'lucide-react'

interface ChannelStatsProps {
  channelId: string
  messages: any[]
  members: any[]
  lastMessageAt?: Date
}

export default function ChannelStats({ channelId, messages, members, lastMessageAt }: ChannelStatsProps) {
  const messageCount = messages.length
  const memberCount = members.length
  const todayMessages = messages.filter(msg => {
    const msgDate = new Date(msg.timestamp)
    const today = new Date()
    return msgDate.toDateString() === today.toDateString()
  }).length

  const formatLastActivity = (date?: Date) => {
    if (!date) return 'Немає активності'
    
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Щойно'
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} год тому`
    return `${Math.floor(diffInMinutes / 1440)} дн тому`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Статистика каналу</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-500" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{messageCount}</div>
            <div className="text-xs text-gray-500">Всього повідомлень</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green-500" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{todayMessages}</div>
            <div className="text-xs text-gray-500">Сьогодні</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users size={16} className="text-purple-500" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{memberCount}</div>
            <div className="text-xs text-gray-500">Учасників</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-orange-500" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatLastActivity(lastMessageAt)}
            </div>
            <div className="text-xs text-gray-500">Остання активність</div>
          </div>
        </div>
      </div>
    </div>
  )
} 