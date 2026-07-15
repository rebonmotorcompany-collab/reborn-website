'use server'

import * as yup from 'yup';
import { prisma } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';
import { CaptchaService } from '@/lib/captcha';
import bcrypt from 'bcryptjs';

// Schemas for backend validation
const emailSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const resetSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  captchaToken: yup.string().required('Captcha token is missing'),
  captchaCode: yup.string().required('Captcha code is missing'),
});

export async function sendOtpAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    // Yup validation
    await emailSchema.validate({ email });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { error: 'Email does not exist in our database.', success: false };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Upsert the token for the user (we delete old ones first to keep it clean)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: otp,
        expires,
      }
    });

    // Send email
    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return { error: 'Failed to send OTP email. Please try again.', success: false };
    }

    return { success: true, email };
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      return { error: error.message, success: false };
    }
    return { error: 'Something went wrong.', success: false };
  }
}

export async function verifyAndResetAction(prevState: any, formData: FormData) {
  try {
    const data = {
      email: formData.get('email') as string,
      otp: formData.get('otp') as string,
      newPassword: formData.get('newPassword') as string,
      captchaToken: formData.get('captchaToken') as string,
      captchaCode: formData.get('captchaCode') as string,
    };

    // Yup validation
    await resetSchema.validate(data);

    // Validate CAPTCHA
    const isCaptchaValid = await CaptchaService.validate(data.captchaToken, data.captchaCode);
    if (!isCaptchaValid) {
      return { error: 'Invalid or expired CAPTCHA.', errorType: 'captcha', success: false };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return { error: 'User not found.', success: false };
    }

    // Find OTP
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: data.otp,
        used: false,
        expires: { gt: new Date() }
      }
    });

    if (!resetToken) {
      // We explicitly return errorType 'otp' so the frontend knows to show an alert popup
      return { error: 'OTP is not correct or has expired.', errorType: 'otp', success: false };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update user password and mark OTP as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ]);

    return { success: true, redirectUrl: '/login' };
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      return { error: error.message, success: false };
    }
    console.error('Reset error:', error);
    return { error: 'Something went wrong during password reset.', success: false };
  }
}
