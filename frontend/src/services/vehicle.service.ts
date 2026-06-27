import apiClient from './api';

export interface VehicleModel {
  id: string;
  name: string;
  basePrice: number;
  specifications?: Record<string, any>;
}

export interface Vehicle {
  id: string;
  modelId: string;
  model: VehicleModel;
  chassisNumber: string;
  motorNumber: string;
  status: 'available' | 'reserved' | 'sold' | 'claimed';
  purchasePrice: number;
  sellingPrice?: number;
  createdAt: string;
}

export const vehicleService = {
  // Vehicle Models
  getModels: async (): Promise<VehicleModel[]> => {
    const response = await apiClient.get('/vehicles/models');
    return response.data.data;
  },

  createModel: async (data: {
    name: string;
    basePrice: number;
    specifications?: Record<string, any>;
  }): Promise<VehicleModel> => {
    const response = await apiClient.post('/vehicles/models', data);
    return response.data.data;
  },

  updateModel: async (
    id: string,
    data: Partial<VehicleModel>
  ): Promise<VehicleModel> => {
    const response = await apiClient.put(`/vehicles/models/${id}`, data);
    return response.data.data;
  },

  deleteModel: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/models/${id}`);
  },

  // Vehicles
  getVehicles: async (filters?: {
    status?: string;
    modelId?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    const response = await apiClient.get('/vehicles', { params: filters });
    return response.data.data;
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data.data;
  },

  createVehicle: async (data: {
    modelId: string;
    chassisNumber: string;
    motorNumber: string;
    purchasePrice: number;
  }): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles', data);
    return response.data.data;
  },

  updateVehicle: async (
    id: string,
    data: {
      sellingPrice?: number;
      status?: string;
    }
  ): Promise<Vehicle> => {
    const response = await apiClient.put(`/vehicles/${id}`, data);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  searchVehicles: async (query: string): Promise<Vehicle[]> => {
    const response = await apiClient.get('/vehicles/search', { params: { q: query } });
    return response.data.data;
  },
};
