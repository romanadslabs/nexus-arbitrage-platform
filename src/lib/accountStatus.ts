import { Account } from '@/types'

export const getStatusDisplayName = (status: Account['status']): string => {
  switch (status) {
    case 'farming_day_1': return 'Фармінг - День 1'
    case 'farming_day_2': return 'Фармінг - День 2'
    case 'farming_day_3': return 'Фармінг - День 3'
    case 'blocked_pp': return 'Заблоковано - ПП'
    case 'blocked_system': return 'Заблоковано - Система'
    case 'blocked_passport': return 'Заблоковано - Паспорт'
    case 'ready_for_ads': return 'Готовий до реклами'
    case 'dead': return 'Мертвий'
    case 'sold': return 'Проданий'
    default: return status
  }
}

export const getStatusColor = (status: Account['status']): string => {
  switch (status) {
    // Фармінг
    case 'farming_day_1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'farming_day_2': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    case 'farming_day_3': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    
    // Блокування
    case 'blocked_pp': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'blocked_system': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'blocked_passport': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    
    // Статуси
    case 'ready_for_ads': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'dead': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'sold': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
    
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export const getStatusCategory = (status: Account['status']): 'farming' | 'blocked' | 'ready' | 'dead' | 'sold' => {
  if (status.includes('farming')) return 'farming'
  if (status.includes('blocked')) return 'blocked'
  if (status === 'ready_for_ads') return 'ready'
  if (status === 'dead') return 'dead'
  if (status === 'sold') return 'sold'
  return 'farming' // за замовчуванням
}

export const getStatusIcon = (status: Account['status']): string => {
  switch (status) {
    case 'farming_day_1':
    case 'farming_day_2':
    case 'farming_day_3':
      return 'clock'
    case 'blocked_pp':
    case 'blocked_system':
    case 'blocked_passport':
      return 'x-circle'
    case 'ready_for_ads':
      return 'check-circle'
    case 'dead':
      return 'x-circle'
    case 'sold':
      return 'check-circle'
    default:
      return 'clock'
  }
} 