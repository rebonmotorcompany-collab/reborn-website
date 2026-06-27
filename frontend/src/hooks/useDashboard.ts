import { useState, useEffect } from 'react';
import { dashboardService, DashboardData } from '../services/dashboard.service';

interface UseDashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [state, setState] = useState<UseDashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await dashboardService.getDashboardData();
        setState((prev) => ({ ...prev, data, loading: false, error: null }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    };

    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await dashboardService.getDashboardData();
      setState((prev) => ({ ...prev, data, loading: false, error: null }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh dashboard';
      setState((prev) => ({ ...prev, error: message, loading: false }));
    }
  };

  return {
    ...state,
    refresh,
  };
};
