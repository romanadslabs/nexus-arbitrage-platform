'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AccountsManager from '@/components/accounts/AccountsManager'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <ModernLayout>
        <FadeIn>
          <SlideUp>
            <AccountsManager />
          </SlideUp>
        </FadeIn>
      </ModernLayout>
    </ProtectedRoute>
  )
} 