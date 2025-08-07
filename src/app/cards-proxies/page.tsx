'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import CardsProxiesManager from '@/components/cards-proxies/CardsProxiesManager'

export default function CardsProxiesPage() {
  return (
    <ModernLayout title="Карти та проксі" description="Управління платіжними картами та проксі-серверами">
      <CardsProxiesManager />
    </ModernLayout>
  )
} 