import { NextResponse } from 'next/server';
import { Account, Campaign, Expense } from '@/components/providers/DataProvider';

// Local Storage Keys (should be consistent with DataProvider)
const LOCAL_STORAGE_KEYS = {
  ACCOUNTS: 'nexus_local_accounts',
  CAMPAIGNS: 'nexus_local_campaigns',
  EXPENSES: 'nexus_local_expenses',
};

// Since this is a server-side route, we can't directly access localStorage.
// We'll simulate fetching from a local source. In a real app, this would be a database.
// For this project, we'll return the mock data structure.

function getMockStats() {
  // This function simulates generating stats from locally stored data.
  // In a real scenario, you'd fetch this from a DB or a shared local file.
  const totalAccounts = 47;
  const activeAccounts = 32;
  const totalExpenses = 15420;
  const totalCampaigns = 89;
  const activeCampaigns = 67;

  const platformBreakdown = {
    'Facebook': 18,
    'Google Ads': 12,
    'TikTok': 8,
    'Instagram': 6,
    'YouTube': 3
  };

  const statusBreakdown = {
    'active': 32,
    'pending': 8,
    'blocked': 5,
    'suspended': 2
  };

  const farmingStats = {
    day1: 12,
    day2: 8,
    day3: 5,
    total: 25
  };

  const blockedStats = {
    pp: 3,
    system: 1,
    passport: 1,
    total: 5
  };

  const revenueStats = {
    totalRevenue: 45680,
    totalProfit: 30260,
    averageROI: 196.3,
    bestPerformingCampaign: 'TikTok Dating - ROI 342%'
  };

  const performanceMetrics = {
    totalClicks: 125430,
    totalConversions: 3420,
    averageCTR: 2.73,
    averageCPC: 0.89,
    averageCPA: 4.51
  };

  const recentPerformance = {
    todayRevenue: 1240,
    yesterdayRevenue: 1180,
    weeklyGrowth: 12.5,
    monthlyGrowth: 23.8
  };

  return {
    totalAccounts,
    activeAccounts,
    totalExpenses,
    totalCampaigns,
    activeCampaigns,
    platformBreakdown,
    statusBreakdown,
    farmingStats,
    blockedStats,
    revenueStats,
    performanceMetrics,
    recentPerformance,
    efficiency: totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0,
  };
}

export async function GET(request: Request) {
  try {
    // We are simulating the data fetching process.
    // In a real-world application with server-side logic, you would fetch from a database here.
    // Since we are using localStorage on the client, this API route will return mock stats.
    const stats = getMockStats();

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 