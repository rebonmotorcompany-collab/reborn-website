import speakeasy from 'speakeasy';

export const generateTwoFASecret = (email: string): { secret: string; qrCodeUrl: string } => {
  const secret = speakeasy.generateSecret({
    name: `EV Showroom ERP (${email})`,
    issuer: 'EV Showroom ERP',
  });

  return {
    secret: secret.base32 || '',
    qrCodeUrl: secret.otpauth_url || '',
  };
};

export const verifyTwoFAToken = (secret: string, token: string, window: number = 2): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window,
  });
};
