'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  ShieldCheck,
  Clock,
  XCircle,
  DollarSign,
  Rocket,
  Wrench,
  UserCheck,
  Home
} from 'lucide-react'
import { Account } from '@/components/providers/DataProvider'

interface AccountCardProps {
  account: Account
  statusConfig: { label: string; color: string }
  isSelected?: boolean
  onSelect?: () => void
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function AccountCard({ 
  account, 
  statusConfig,
  isSelected = false, 
  onSelect, 
  onView,
  onEdit, 
  onDelete,
}: AccountCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusVisuals = (status: string) => {
    switch (status) {
      case 'ready_for_farm': return { icon: UserCheck, color: 'blue' };
      case 'farming_day_1':
      case 'farming_day_2':
      case 'farming_day_3': return { icon: Clock, color: 'cyan' };
      case 'ready_for_ads': return { icon: ShieldCheck, color: 'green' };
      case 'launched': return { icon: Rocket, color: 'teal' };
      case 'in_progress': return { icon: Wrench, color: 'yellow' };
      case 'blocked_pp':
      case 'blocked_system':
      case 'blocked_passport': return { icon: XCircle, color: 'red' };
      case 'sold': return { icon: DollarSign, color: 'purple' };
      case 'dead': return { icon: XCircle, color: 'gray' };
      default: return { icon: Clock, color: 'gray' };
    }
  }

  const { icon: StatusIcon, color: statusColorName } = getStatusVisuals(account.status)
  const statusColor = `bg-${statusColorName}-100 text-${statusColorName}-800 dark:bg-${statusColorName}-900/20 dark:text-${statusColorName}-300`

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  const formatDate = (date: Date | string) => {
    if (!date) return 'Н/Д'
    return new Date(date).toLocaleDateString('uk-UA')
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Allow clicks on buttons inside the card without triggering onView
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
        return;
    }
    onView?.();
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 cursor-pointer ${
        isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={handleCardClick}
    >
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-blue-600"
          />
        </div>
      )}
      
      <div className="absolute top-3 right-3 z-10">
        <div className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${statusColor}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{statusConfig?.label || account.status}</span>
        </div>
      </div>
      

      <div className="p-4 pt-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {account.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {account.email || 'No Email'}
            </p>
          </div>
          
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-20">
                <button onClick={() => { setShowMenu(false); onEdit?.() }} className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100">
                  <Edit className="w-4 h-4" />
                  <span>Редагувати</span>
                </button>
                <button onClick={() => { setShowMenu(false); onDelete?.() }} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  <span>Видалити</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-3 text-xs">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Платформа</span>
            <span className="font-medium">{account.platform}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Тип трафіку</span>
            <span className="font-medium">{account.trafficType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Пріоритет</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(account.priority)}`}>
              {account.priority}
            </span>
          </div>
        </div>

        {account.tags && account.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {account.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t text-xs text-gray-500">
          <span>Створено: {formatDate(account.createdAt)}</span>
          {account.isLocal && <Home className="w-3 h-3" />}
        </div>
      </div>
    </motion.div>
  )
} 