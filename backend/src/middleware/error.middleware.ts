import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError } from '../types/index';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if ('status' in err) {
    const apiError = err as ApiError;
    res.status(apiError.status).json({
      success: false,
      message: apiError.message,
      code: apiError.code,
      details: apiError.details,
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : 'Internal server error';

  res.status(500).json({
    success: false,
    message: errorMessage,
  });
};

export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Store original send function
  const originalSend = res.send;

  // Override send to log request
  res.send = function (data: unknown) {
    // Log non-GET requests
    if (req.method !== 'GET' && req.user) {
      prisma.auditLog
        .create({
          data: {
            tenantId: req.user.tenantId,
            userId: req.user.userId,
            entityType: req.path,
            action: req.method.toLowerCase(),
            newValues: req.body,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
          },
        })
        .catch((err) => console.error('Audit log error:', err));
    }

    res.send = originalSend;
    return res.send(data);
  };

  next();
};
