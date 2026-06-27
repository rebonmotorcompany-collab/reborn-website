import { Layout } from '../components/Layout';
import { Package, AlertCircle } from 'lucide-react';

export const Inventory = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Spare Parts Inventory</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h2 className="font-semibold text-blue-900">Coming in Phase 3</h2>
            <p className="text-blue-800 mt-2">
              Spare parts inventory management including stock tracking, purchase orders, and 
              reorder management will be available soon.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package size={24} className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">Total Parts</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package size={24} className="text-orange-600" />
              <h3 className="font-semibold text-gray-800">Low Stock</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package size={24} className="text-green-600" />
              <h3 className="font-semibold text-gray-800">Stock Value</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">₹0</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
