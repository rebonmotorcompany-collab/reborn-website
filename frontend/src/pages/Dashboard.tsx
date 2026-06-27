import { Layout } from '../components/Layout';
import { useDashboard } from '../hooks/useDashboard';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { data, loading, error, refresh } = useDashboard();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center">No data available</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Vehicles */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-800">{data.kpis.vehicles.total}</p>
              </div>
              <div className="text-4xl">🚗</div>
            </div>
          </div>

          {/* Available Stock */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {data.kpis.vehicles.available}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {data.kpis.vehicles.reserved} reserved, {data.kpis.vehicles.sold} sold
            </p>
          </div>

          {/* Monthly Sales */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month Sales</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{(data.kpis.sales.thisMonth / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {data.kpis.sales.thisMonthCount} transactions
            </p>
          </div>

          {/* Warranty Claims */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Claims</p>
                <p className="text-3xl font-bold text-orange-600">
                  {data.kpis.warranty.needsAttention}
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {data.kpis.warranty.pending} pending, {data.kpis.warranty.underReview} under review
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vehicle Status Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available</span>
                <span className="font-bold text-green-600">{data.kpis.vehicles.available}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reserved</span>
                <span className="font-bold text-yellow-600">{data.kpis.vehicles.reserved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sold</span>
                <span className="font-bold text-blue-600">{data.kpis.vehicles.sold}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Claimed</span>
                <span className="font-bold text-red-600">{data.kpis.vehicles.claimed}</span>
              </div>
            </div>
          </div>

          {/* Customer Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customers</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.kpis.customers.total}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Outstanding Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{(data.kpis.customers.outstandingBalance / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>

          {/* Sales Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Performance</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{(data.kpis.sales.thisMonth / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last 30 Days</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{(data.kpis.sales.last30Days / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-800">Active Alerts</h3>
                {data.alerts.map((alert, idx) => (
                  <p key={idx} className="text-sm text-yellow-700">
                    {alert.icon} {alert.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        {data.recentActivities.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {data.recentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.amount && (
                    <p className="text-sm font-bold text-gray-800">
                      ₹{activity.amount.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
