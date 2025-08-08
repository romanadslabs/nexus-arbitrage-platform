'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CardsProxiesManager from '@/components/cards-proxies/CardsProxiesManager'

export default function CardsProxiesPage() {
  return (
    <ProtectedRoute>
      <ModernLayout>
        <CardsProxiesManager />
      </ModernLayout>
    </ProtectedRoute>
  )
} 