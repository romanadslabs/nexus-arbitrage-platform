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
  const totalAccounts = 2;
  const activeAccounts = 1;
  const totalExpenses = 150;
  const totalCampaigns = 1;
  const activeCampaigns = 1;

  const platformBreakdown = {
    Facebook: 1,
    'Google Ads': 1,
  };

  const statusBreakdown = {
    active: 1,
    pending: 1,
  };

  const farmingStats = {
    day1: 0,
    day2: 0,
    day3: 0,
    total: 0,
  };

  const blockedStats = {
    pp: 0,
    system: 0,
    passport: 0,
    total: 0,
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