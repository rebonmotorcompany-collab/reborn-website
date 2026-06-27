import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateTwoFASecret, verifyTwoFAToken } from '../utils/twofa';
import { RegisterRequest, LoginRequest, AuthResponse, TwoFASetupResponse } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  async register(req: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: req.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create tenant (company)
    const tenant = await prisma.tenant.create({
      data: {
        companyName: req.companyName,
        subscriptionTier: 'pro',
        status: 'active',
      },
    });

    // Create admin role for tenant
    const adminRole = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'Admin',
        description: 'Administrator role with full access',
      },
    });

    // Add default permissions for admin
    const adminPermissions = [
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'vehicles', action: 'create' },
      { resource: 'vehicles', action: 'read' },
      { resource: 'vehicles', action: 'update' },
      { resource: 'vehicles', action: 'delete' },
      { resource: 'dashboard', action: 'read' },
    ];

    for (const perm of adminPermissions) {
      await prisma.permission.create({
        data: {
          roleId: adminRole.id,
          resource: perm.resource,
          action: perm.action,
        },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(req.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: req.email,
        passwordHash,
        firstName: req.firstName,
        lastName: req.lastName,
        roleId: adminRole.id,
        status: 'active',
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      role: 'Admin',
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      role: 'Admin',
    });

    // Log the login
    await prisma.loginLog.create({
      data: {
        userId: user.id,
        loginTime: new Date(),
        success: true,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: 'Admin',
        tenantId: tenant.id,
      },
    };
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: req.email },
      include: { role: true, tenant: true },
    });

    if (!user) {
      await this.logFailedLogin(req.email, 'User not found');
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(req.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.logFailedLogin(req.email, 'Invalid password');
      throw new Error('Invalid email or password');
    }

    // Check if 2FA is enabled
    if (user.twoFAEnabled) {
      // Return partial auth - frontend needs to verify 2FA
      return {
        accessToken: '', // Placeholder, will be set after 2FA verification
        refreshToken: '',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role?.name || 'User',
          tenantId: user.tenantId,
        },
      };
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role?.name || 'User',
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role?.name || 'User',
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log successful login
    await prisma.loginLog.create({
      data: {
        userId: user.id,
        loginTime: new Date(),
        success: true,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role?.name || 'User',
        tenantId: user.tenantId,
      },
    };
  }

  async setupTwoFA(userId: string): Promise<TwoFASetupResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { secret, qrCodeUrl } = generateTwoFASecret(user.email);

    // Save secret temporarily (not yet verified)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFASecret: secret,
      },
    });

    return {
      secret,
      qrCode: qrCodeUrl,
    };
  }

  async verifyTwoFASetup(userId: string, token: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFASecret) {
      throw new Error('2FA setup not initiated');
    }

    const isValid = verifyTwoFAToken(user.twoFASecret, token);
    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: true },
    });
  }

  async verifyTwoFALogin(userId: string, token: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || !user.twoFASecret) {
      throw new Error('2FA not enabled for this user');
    }

    const isValid = verifyTwoFAToken(user.twoFASecret, token);
    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role?.name || 'User',
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role?.name || 'User',
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role?.name || 'User',
        tenantId: user.tenantId,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role?.name || 'User',
    });

    return { accessToken };
  }

  private async logFailedLogin(email: string, reason: string): Promise<void> {
    // Optional: log failed login attempts for security monitoring
    console.warn(`Failed login attempt for ${email}: ${reason}`);
  }
}

export default new AuthService();
