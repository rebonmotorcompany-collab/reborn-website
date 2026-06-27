import { useState, useCallback } from 'react';
import { vehicleService, Vehicle } from '../services/vehicle.service';

interface UseVehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export const useVehicles = () => {
  const [state, setState] = useState<UseVehicleState>({
    vehicles: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchVehicles = useCallback(
    async (filters?: any) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await vehicleService.getVehicles({
          page: state.page,
          limit: state.limit,
          ...filters,
        });
        setState((prev) => ({
          ...prev,
          vehicles: data.data,
          total: data.total,
          loading: false,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    },
    [state.page, state.limit]
  );

  const createVehicle = useCallback(
    async (vehicleData: any) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await vehicleService.createVehicle(vehicleData);
        await fetchVehicles();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create vehicle';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    },
    [fetchVehicles]
  );

  const updateVehicle = useCallback(
    async (id: string, vehicleData: any) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await vehicleService.updateVehicle(id, vehicleData);
        await fetchVehicles();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update vehicle';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    },
    [fetchVehicles]
  );

  const deleteVehicle = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await vehicleService.deleteVehicle(id);
        await fetchVehicles();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete vehicle';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    },
    [fetchVehicles]
  );

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  return {
    ...state,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    setPage,
  };
};
