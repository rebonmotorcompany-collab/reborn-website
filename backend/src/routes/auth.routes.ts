import { Router, Request, Response, NextFunction } from 'express';
import authController from '../controllers/auth.controller';
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

// Register endpoint
router.post(
  '/register',
  [
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next)
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next)
);

// Setup 2FA endpoint (protected)
router.post(
  '/2fa/setup',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => authController.setupTwoFA(req, res, next)
);

// Verify 2FA setup endpoint (protected)
router.post(
  '/2fa/verify-setup',
  authenticate,
  [body('token').notEmpty().withMessage('2FA token is required')],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) =>
    authController.verifyTwoFASetup(req, res, next)
);

// Verify 2FA during login
router.post(
  '/2fa/verify-login',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('token').notEmpty().withMessage('2FA token is required'),
  ],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) =>
    authController.verifyTwoFALogin(req, res, next)
);

// Refresh token endpoint
router.post(
  '/refresh-token',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  handleValidationErrors,
  (req: Request, res: Response, next: NextFunction) => authController.refreshToken(req, res, next)
);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Auth service is healthy' });
});

export default router;
