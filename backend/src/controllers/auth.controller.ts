import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyName, email, password, firstName, lastName } = req.body;

      const registerRequest: RegisterRequest = {
        companyName,
        email,
        password,
        firstName,
        lastName,
      };

      const result = await authService.register(registerRequest);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, tenantId } = req.body;

      const loginRequest: LoginRequest = {
        email,
        password,
        tenantId,
      };

      const result = await authService.login(loginRequest);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async setupTwoFA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const result = await authService.setupTwoFA(req.user.userId);

      res.status(200).json({
        success: true,
        message: '2FA setup initiated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyTwoFASetup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { token } = req.body;

      await authService.verifyTwoFASetup(req.user.userId, token);

      res.status(200).json({
        success: true,
        message: '2FA enabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyTwoFALogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, token } = req.body;

      const result = await authService.verifyTwoFALogin(userId, token);

      res.status(200).json({
        success: true,
        message: '2FA verification successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
