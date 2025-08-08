'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CampaignsManager from '@/components/campaigns/CampaignsManager'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <ModernLayout>
        <FadeIn>
          <SlideUp>
            <CampaignsManager />
          </SlideUp>
        </FadeIn>
      </ModernLayout>
    </ProtectedRoute>
  )
} 