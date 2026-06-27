export interface AuthPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
}

export interface TokenPayload extends AuthPayload {
  iat: number;
  exp: number;
}

export interface RegisterRequest {
  companyName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface TwoFASetupResponse {
  secret: string;
  qrCode: string;
}

export interface TwoFAVerifyRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
  };
}
