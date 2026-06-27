import { Request } from 'express';
import { AuthPayload } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
}
