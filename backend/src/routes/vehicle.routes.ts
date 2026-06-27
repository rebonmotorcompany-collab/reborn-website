import { Router, Request, Response, NextFunction } from 'express';
import { vehicleController, vehicleModelController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Apply authentication to all routes
router.use(authenticate);

// ============ VEHICLE MODEL ROUTES ============

// Get all models
router.get('/models', (req: Request, res: Response, next: NextFunction) =>
  vehicleModelController.getModels(req, res, next)
);

// Get single model
router.get('/models/:id', (req: Request, res: Response, next: NextFunction) =>
  vehicleModelController.getModel(req, res, next)
);

// Create model
router.post(
  '/models',
  [
    body('name').notEmpty().withMessage('Model name is required'),
    body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => vehicleModelController.createModel(req, res, next)
);

// Update model
router.put(
  '/models/:id',
  [
    body('name').optional().notEmpty().withMessage('Model name cannot be empty'),
    body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price must be positive'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => vehicleModelController.updateModel(req, res, next)
);

// Delete model
router.delete('/models/:id', (req: Request, res: Response, next: NextFunction) =>
  vehicleModelController.deleteModel(req, res, next)
);

// ============ VEHICLE ROUTES ============

// Get all vehicles
router.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => vehicleController.getVehicles(req, res, next)
);

// Search vehicles
router.get('/search', (req: Request, res: Response, next: NextFunction) =>
  vehicleController.searchVehicles(req, res, next)
);

// Get vehicles by status
router.get('/status/:status', (req: Request, res: Response, next: NextFunction) =>
  vehicleController.getVehiclesByStatus(req, res, next)
);

// Get single vehicle
router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  vehicleController.getVehicle(req, res, next)
);

// Create vehicle
router.post(
  '/',
  [
    body('modelId').notEmpty().withMessage('Model ID is required'),
    body('chassisNumber').notEmpty().withMessage('Chassis number is required'),
    body('motorNumber').notEmpty().withMessage('Motor number is required'),
    body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be positive'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => vehicleController.createVehicle(req, res, next)
);

// Update vehicle
router.put(
  '/:id',
  [
    body('sellingPrice').optional().isFloat({ min: 0 }).withMessage('Selling price must be positive'),
    body('status')
      .optional()
      .isIn(['available', 'reserved', 'sold', 'claimed'])
      .withMessage('Invalid status'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => vehicleController.updateVehicle(req, res, next)
);

// Delete vehicle
router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
  vehicleController.deleteVehicle(req, res, next)
);

export default router;
