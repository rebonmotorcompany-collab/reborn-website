import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { VehicleForm } from '../components/VehicleForm';
import { VehicleList } from '../components/VehicleList';
import { useVehicles } from '../hooks/useVehicles';
import { vehicleService } from '../services/vehicle.service';
import { Plus, Search } from 'lucide-react';

export const Vehicles = () => {
  const { vehicles, loading, error, total, page, fetchVehicles, createVehicle, updateVehicle, deleteVehicle, setPage } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Fetch models
    vehicleService.getModels().then(setModels).catch(console.error);
    // Fetch vehicles
    fetchVehicles({ status: filterStatus });
  }, [filterStatus]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const results = await vehicleService.searchVehicles(searchQuery);
        // This would update the vehicles list - for now we just search
        console.log('Search results:', results);
      } catch (err) {
        console.error('Search error:', err);
      }
    }
  };

  const handleCreateVehicle = async (data: any) => {
    await createVehicle(data);
    setShowForm(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateVehicle(id, { status });
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Inventory</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by chassis or motor number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>

          <div className="flex gap-4 text-sm text-gray-600">
            <div>Total: <span className="font-bold text-gray-800">{total}</span></div>
            <div>Page: <span className="font-bold text-gray-800">{page}</span></div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow">
          <VehicleList
            vehicles={vehicles}
            loading={loading}
            onEdit={(vehicle) => console.log('Edit:', vehicle)}
            onDelete={handleDeleteVehicle}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {showForm && (
        <VehicleForm
          models={models}
          onSubmit={handleCreateVehicle}
          onClose={() => setShowForm(false)}
          loading={loading}
        />
      )}
    </Layout>
  );
};
