import { NextResponse } from 'next/server';

function getFallbackStats() {
  const totalAccounts = 0;
  const activeAccounts = 0;
  const totalExpenses = 0;
  const totalCampaigns = 0;
  const activeCampaigns = 0;

  const platformBreakdown = {} as Record<string, number>;
  const statusBreakdown = {} as Record<string, number>;

  return {
    totalAccounts,
    activeAccounts,
    totalExpenses,
    totalCampaigns,
    activeCampaigns,
    platformBreakdown,
    statusBreakdown,
    efficiency: 0,
  };
}

export async function GET(request: Request) {
  try {
    const stats = getFallbackStats();

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