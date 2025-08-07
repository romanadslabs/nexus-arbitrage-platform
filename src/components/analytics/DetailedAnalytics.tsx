'use client'

import React from 'react';
import { useData } from '@/components/providers/DataProvider';
import AccountsAnalytics from './AccountsAnalytics';
import AccountsCharts from './AccountsCharts';

interface DetailedAnalyticsProps {
  activeTab: 'overview' | 'charts';
}

export default function DetailedAnalytics({ activeTab }: DetailedAnalyticsProps) {
  const { accounts, expenses, isLoading } = useData();

  if (isLoading.accounts || isLoading.expenses) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Завантаження детальних даних...</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'overview') {
    return <AccountsAnalytics accounts={accounts} expenses={expenses} userRole="leader" />;
  }

  if (activeTab === 'charts') {
    return <AccountsCharts accounts={accounts} expenses={expenses} />;
  }

  return null;
} 