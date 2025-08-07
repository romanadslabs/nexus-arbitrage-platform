'use client'

import React, { useState, useEffect } from 'react'
import { useDashboardStats, DashboardStats } from '@/hooks/useDashboardStats'
import { 
  BarChart3, PieChart, TrendingUp, FileText, Download, 
  Activity, DollarSign, Users, Target, Globe
} from 'lucide-react'
import DetailedAnalytics from './DetailedAnalytics';

const MetricSkeleton = () => (
    <div className="card bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="flex items-center justify-between">
            <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    </div>
);

export default function AnalyticsDashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats()
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'reports'>('overview')

  const tabs = [
    { id: 'overview', label: 'Огляд', icon: BarChart3, description: 'Загальна статистика та метрики' },
    { id: 'charts', label: 'Графіки', icon: PieChart, description: 'Візуальні діаграми та аналіз' },
    { id: 'reports', label: 'Звіти', icon: FileText, description: 'Генерація та експорт звітів' }
  ];

  const generateReport = () => {
    console.log("Generating report with stats:", stats);
  }

  const renderContent = () => {
    if (isLoading && !stats) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricSkeleton /><MetricSkeleton /><MetricSkeleton /><MetricSkeleton />
          </div>
          <div className="card h-96 animate-pulse bg-gray-100 dark:bg-gray-800"></div>
        </>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500">
          <p>Помилка завантаження даних: {error}</p>
          <button onClick={refetch} className="btn-primary mt-4">Спробувати ще</button>
        </div>
      );
    }

    if (!stats) {
      return <div className="text-center">Немає даних для відображення.</div>;
    }

    const quickMetrics = [
        { title: 'Всього аккаунтів', value: stats.totalAccounts, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'Активні аккаунти', value: stats.activeAccounts, icon: Activity, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { title: 'Загальні витрати', value: `$${stats.totalExpenses.toFixed(2)}`, icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        { title: 'Ефективність', value: `${stats.efficiency.toFixed(1)}%`, icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
    ];
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickMetrics.map((metric, index) => (
            <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg ${metric.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
            {(activeTab === 'overview' || activeTab === 'charts') && (
              <DetailedAnalytics activeTab={activeTab} />
            )}
            {activeTab === 'reports' && (
              <div className="text-center py-8">
                <p className="text-gray-500">Звіти будуть доступні тут.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналітика</h1>
          <p className="text-gray-600 dark:text-gray-400">Детальний аналіз та статистика аккаунтів</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={generateReport} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            <span>Експорт звіту</span>
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  )
} 