'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import AccountsManager from '@/components/accounts/AccountsManager'

export default function AccountsPage() {
  return (
    <ModernLayout title="Аккаунти" description="Керуйте вашими рекламними аккаунтами">
      <AccountsManager />
    </ModernLayout>
  )
} 