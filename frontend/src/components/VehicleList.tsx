import React from 'react';
import { Edit2, Trash2, Badge } from 'lucide-react';
import { Vehicle } from '../services/vehicle.service';

interface VehicleListProps {
  vehicles: Vehicle[];
  loading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
  available: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
  reserved: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100' },
  sold: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
  claimed: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
};

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading vehicles...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">No vehicles found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chassis #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Motor #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const colors = statusColors[vehicle.status];
            return (
              <tr key={vehicle.id} className={`border-b border-gray-200 hover:${colors.bg}`}>
                <td className="px-6 py-4 text-sm text-gray-800">{vehicle.model.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  {vehicle.chassisNumber}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  {vehicle.motorNumber}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={vehicle.status}
                    onChange={(e) => onStatusChange(vehicle.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.text} ${colors.badge} border-0 cursor-pointer`}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="claimed">Claimed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  ₹{vehicle.sellingPrice?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
