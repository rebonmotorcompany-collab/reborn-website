import { Request, Response, NextFunction } from 'express';
import vehicleService from '../services/vehicle.service';
import vehicleModelService from '../services/vehicle-model.service';

export class VehicleController {
  // Get all vehicles
  async getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { status, modelId, page, limit } = req.query;

      const result = await vehicleService.getVehicles(req.user.tenantId, {
        status: status as string,
        modelId: modelId as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single vehicle
  async getVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const vehicle = await vehicleService.getVehicle(req.params.id, req.user.tenantId);

      res.json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create vehicle
  async createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { modelId, chassisNumber, motorNumber, purchasePrice } = req.body;

      const vehicle = await vehicleService.createVehicle(req.user.tenantId, {
        modelId,
        chassisNumber,
        motorNumber,
        purchasePrice,
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update vehicle
  async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { sellingPrice, status } = req.body;

      const vehicle = await vehicleService.updateVehicle(req.params.id, req.user.tenantId, {
        sellingPrice,
        status,
      });

      res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete vehicle
  async deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await vehicleService.deleteVehicle(req.params.id, req.user.tenantId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search vehicles
  async searchVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { q } = req.query;
      if (!q) {
        res.status(400).json({ success: false, message: 'Search query required' });
        return;
      }

      const results = await vehicleService.searchVehicles(req.user.tenantId, q as string);

      res.json({
        success: true,
        message: 'Search completed',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get vehicles by status
  async getVehiclesByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { status } = req.params;
      const count = await vehicleService.getVehiclesByStatus(req.user.tenantId, status);

      res.json({
        success: true,
        message: `Vehicles with status '${status}'`,
        data: { status, count },
      });
    } catch (error) {
      next(error);
    }
  }
}

export class VehicleModelController {
  // Get all models
  async getModels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const models = await vehicleModelService.getModels(req.user.tenantId);

      res.json({
        success: true,
        message: 'Vehicle models retrieved successfully',
        data: models,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single model
  async getModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const model = await vehicleModelService.getModel(req.params.id, req.user.tenantId);

      res.json({
        success: true,
        message: 'Vehicle model retrieved successfully',
        data: model,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create model
  async createModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { name, basePrice, specifications } = req.body;

      const model = await vehicleModelService.createModel(req.user.tenantId, {
        name,
        basePrice,
        specifications,
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle model created successfully',
        data: model,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update model
  async updateModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { name, basePrice, specifications } = req.body;

      const model = await vehicleModelService.updateModel(req.params.id, req.user.tenantId, {
        name,
        basePrice,
        specifications,
      });

      res.json({
        success: true,
        message: 'Vehicle model updated successfully',
        data: model,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete model
  async deleteModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await vehicleModelService.deleteModel(req.params.id, req.user.tenantId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
export const vehicleModelController = new VehicleModelController();
