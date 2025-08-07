import { useState, useEffect, useCallback } from 'react';

// Спрощений інтерфейс для статистики дашборду
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics/dashboard-stats');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}; 