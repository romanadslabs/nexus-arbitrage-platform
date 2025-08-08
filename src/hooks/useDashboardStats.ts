import { useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';

export interface DashboardStats {
  totalAccounts: number;
  activeAccounts: number;
  totalExpenses: number;
  totalCampaigns: number;
  activeCampaigns: number;
  platformBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  efficiency: number;
}

export const useDashboardStats = () => {
  const { accounts, campaigns, expenses } = useData();

  const stats: DashboardStats = useMemo(() => {
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(acc => (acc as any).status === 'ready_for_ads').length;
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => (c as any).status === 'active').length;
    const totalExpenses = expenses.reduce((sum, exp: any) => sum + (exp.amount || exp.cost || 0), 0);

    const platformBreakdown = accounts.reduce((acc: Record<string, number>, a: any) => {
      acc[a.platform] = (acc[a.platform] || 0) + 1;
      return acc;
    }, {});

    const statusBreakdown = accounts.reduce((acc: Record<string, number>, a: any) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});

    const efficiency = totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0;

    return {
      totalAccounts,
      activeAccounts,
      totalCampaigns,
      activeCampaigns,
      totalExpenses,
      platformBreakdown,
      statusBreakdown,
      efficiency,
    };
  }, [accounts, campaigns, expenses]);

  return { stats, isLoading: false, error: null, refetch: async () => {} };
} 