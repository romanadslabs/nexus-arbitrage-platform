'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CampaignsManager from '@/components/campaigns/CampaignsManager'

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <ModernLayout>
        <CampaignsManager />
      </ModernLayout>
    </ProtectedRoute>
  )
} 