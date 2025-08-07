'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Monitor, ArrowRight } from 'lucide-react'

export default function BrowserProfilesPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляємо на нову систему мультибраузера
    router.push('/multi-browser')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Monitor className="h-8 w-8 text-blue-600" />
          <ArrowRight className="h-6 w-6 text-gray-400" />
          <Monitor className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Перенаправлення на нову систему
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Система браузерних профілів оновлена. Перенаправляємо...
        </p>
      </div>
    </div>
  )
} 