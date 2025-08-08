'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AccountsManager from '@/components/accounts/AccountsManager'

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <ModernLayout>
        <AccountsManager />
      </ModernLayout>
    </ProtectedRoute>
  )
} 