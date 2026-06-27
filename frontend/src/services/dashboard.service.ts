import apiClient from './api';

export interface DashboardData {
  kpis: {
    vehicles: {
      total: number;
      available: number;
      reserved: number;
      sold: number;
      claimed: number;
    };
    sales: {
      thisMonth: number;
      thisMonthCount: number;
      last30Days: number;
    };
    customers: {
      total: number;
      outstandingBalance: number;
    };
    warranty: {
      total: number;
      pending: number;
      underReview: number;
      needsAttention: number;
    };
  };
  recentActivities: Array<any>;
  alerts: Array<any>;
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/dashboard/data');
    return response.data.data;
  },
};
