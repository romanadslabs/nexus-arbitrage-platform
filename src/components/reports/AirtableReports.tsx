'use client'

import React, { useState, useMemo } from 'react'
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Target,
  RefreshCw
} from 'lucide-react'
import { useData } from '@/components/providers/DataProvider'
import PieChartComponent from '@/components/analytics/PieChart'
import BarChartComponent from '@/components/analytics/BarChart'

export default function AirtableReports() {
  const { accounts, campaigns, expenses, isLoading: dataLoading, refreshAllData } = useData()
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (selectedPeriod === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0); // all time
    }

    const filteredAccounts = accounts.filter(acc => new Date(acc.createdAt) >= startDate);
    const filteredCampaigns = campaigns.filter(camp => new Date(camp.createdAt) >= startDate);
    const filteredExpenses = expenses.filter(exp => new Date(exp.date) >= startDate);

    return {
      accounts: filteredAccounts,
      campaigns: filteredCampaigns,
      expenses: filteredExpenses,
    };
  }, [accounts, campaigns, expenses, selectedPeriod]);

  // --- Recalculate all stats based on local data ---
  const overallStats = useMemo(() => {
    const totalRevenue = filteredData.campaigns.reduce((sum, camp) => sum + camp.budget, 0)
    const totalExpenses = filteredData.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalProfit = totalRevenue - totalExpenses
    const roi = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      roi,
      activeCampaigns: filteredData.campaigns.filter(c => c.status === 'active').length,
      activeAccounts: filteredData.accounts.filter(a => a.status === 'active').length,
    }
  }, [filteredData])

  const platformStats = useMemo(() => {
    const stats = filteredData.campaigns.reduce((acc, campaign) => {
      const platform = campaign.platform || 'Unknown'
      if (!acc[platform]) {
        acc[platform] = { revenue: 0, campaigns: 0, spent: 0 }
      }
      acc[platform].revenue += campaign.budget
      acc[platform].spent += campaign.spent
      acc[platform].campaigns += 1
      return acc
    }, {} as Record<string, { revenue: number; campaigns: number; spent: number }>)

    return Object.entries(stats).map(([platform, data]) => ({
      platform,
      revenue: data.revenue,
      campaigns: data.campaigns,
      spent: data.spent,
      profit: data.revenue - data.spent,
      roi: data.spent > 0 ? ((data.revenue - data.spent) / data.spent) * 100 : 0,
    }))
  }, [filteredData.campaigns])
  
  const accountStatusStats = useMemo(() => {
    return filteredData.accounts.reduce((acc, account) => {
      const status = account.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [filteredData.accounts])

  const isLoading = dataLoading.accounts || dataLoading.campaigns || dataLoading.expenses

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (value: number) => value.toLocaleString()

  const handleRefresh = () => {
    refreshAllData()
  }

  const prepareChartData = (data: typeof platformStats, dataKey: 'revenue' | 'campaigns' | 'spent') => {
    if (!data) return { labels: [], datasets: [] };
    const labels = data.map(d => d.platform);
    const values = data.map(d => d[dataKey]);
    return {
      labels,
      datasets: [{
        label: dataKey,
        data: values,
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      }]
    };
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mr-3" />
        <span className="text-lg">Завантаження звітів...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Звіти</h1>
        <div className="flex items-center gap-2">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600"
          >
            <option value="week">Тиждень</option>
            <option value="month">Місяць</option>
            <option value="all">За весь час</option>
          </select>
          <button onClick={handleRefresh} className="btn btn-primary btn-sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Оновити
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Загальний дохід" value={formatCurrency(overallStats.totalRevenue)} icon={DollarSign} color="green" />
        <StatCard title="Загальні витрати" value={formatCurrency(overallStats.totalExpenses)} icon={DollarSign} color="red" />
        <StatCard title="Загальний прибуток" value={formatCurrency(overallStats.totalProfit)} icon={DollarSign} color="blue" />
        <StatCard title="ROI" value={formatPercentage(overallStats.roi)} icon={TrendingUp} color="purple" />
        <StatCard title="Активні кампанії" value={formatNumber(overallStats.activeCampaigns)} icon={Target} color="orange" />
        <StatCard title="Активні акаунти" value={formatNumber(overallStats.activeAccounts)} icon={Users} color="gray" />
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Доходи по платформах</h3>
          <PieChartComponent data={prepareChartData(platformStats, 'revenue')} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Кампанії по платформах</h3>
          <BarChartComponent data={prepareChartData(platformStats, 'campaigns')} />
                </div>
              </div>

      {/* Detailed Platform Table */}
              <div className="card">
        <h3 className="text-lg font-semibold mb-4">Детальна статистика по платформах</h3>
                <div className="overflow-x-auto">
          <table className="table w-full">
                    <thead>
                      <tr>
                <th>Платформа</th>
                <th>Кампанії</th>
                        <th>Доходи</th>
                        <th>Витрати</th>
                        <th>Прибуток</th>
                        <th>ROI</th>
                      </tr>
                    </thead>
                    <tbody>
              {platformStats.map(stat => (
                <tr key={stat.platform}>
                  <td className="font-medium">{stat.platform}</td>
                  <td>{formatNumber(stat.campaigns)}</td>
                  <td className="text-green-600">{formatCurrency(stat.revenue)}</td>
                  <td className="text-red-600">{formatCurrency(stat.spent)}</td>
                  <td className={`font-medium ${stat.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(stat.profit)}
                          </td>
                  <td className={`font-medium ${stat.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(stat.roi)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

      {/* Account Stats */}
                <div className="card">
        <h3 className="text-lg font-semibold mb-4">Статистика по акаунтах</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(accountStatusStats).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold">{formatNumber(count)}</div>
              <div className="text-sm capitalize">{status}</div>
                    </div>
                  ))}
                </div>
              </div>
                    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <div className="card p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
                </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
    </div>
  )
} 