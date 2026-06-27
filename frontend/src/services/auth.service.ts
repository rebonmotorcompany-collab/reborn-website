import apiClient from './api';
import { RegisterPayload, LoginPayload, AuthResponse, TwoFASetup } from '../types/auth';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data.data;
  },

  setupTwoFA: async (): Promise<TwoFASetup> => {
    const response = await apiClient.post('/auth/2fa/setup');
    return response.data.data;
  },

  verifyTwoFASetup: async (token: string): Promise<void> => {
    await apiClient.post('/auth/2fa/verify-setup', { token });
  },

  verifyTwoFALogin: async (userId: string, token: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/2fa/verify-login', { userId, token });
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },
};
