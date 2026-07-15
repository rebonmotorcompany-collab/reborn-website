'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { sendOtpAction, verifyAndResetAction } from '@/actions/password-reset';
import Captcha from '@/components/Captcha';
import { ArrowLeft, Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { RmcLogo } from '@/components/RmcLogo';

// Yup validation schemas for frontend
const emailSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
});

const resetSchema = yup.object().shape({
  otp: yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]+$/, 'OTP must be numeric')
    .required('OTP is required'),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 1 Form
  const { 
    register: registerEmail, 
    handleSubmit: handleEmailSubmit, 
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting } 
  } = useForm({
    resolver: yupResolver(emailSchema)
  });

  const [emailError, setEmailError] = useState('');

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting }
  } = useForm({
    resolver: yupResolver(resetSchema)
  });

  const [resetError, setResetError] = useState('');

  const onEmailSubmit = async (data: { email: string }) => {
    setEmailError('');
    
    // We create a FormData object to pass to the Server Action
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await sendOtpAction(null, formData);
    
    if (result.success) {
      setVerifiedEmail(result.email);
      setStep(2);
    } else {
      setEmailError(result.error || 'An error occurred.');
    }
  };

  const onResetSubmit = async (data: any) => {
    setResetError('');
    
    // Extract captcha from DOM manually since it's not a standard form input handled by react-hook-form
    const captchaToken = (document.querySelector('input[name="captchaToken"]') as HTMLInputElement)?.value;
    const captchaCode = (document.querySelector('input[name="captchaCode"]') as HTMLInputElement)?.value;

    if (!captchaToken || !captchaCode) {
      setResetError('Please complete the CAPTCHA validation.');
      return;
    }

    const formData = new FormData();
    formData.append('email', verifiedEmail);
    formData.append('otp', data.otp);
    formData.append('newPassword', data.newPassword);
    formData.append('captchaToken', captchaToken);
    formData.append('captchaCode', captchaCode);

    const result = await verifyAndResetAction(null, formData);

    if (result.success && result.redirectUrl) {
      // Show success and redirect
      alert('Password updated successfully!');
      router.push(result.redirectUrl);
    } else {
      if (result.errorType === 'otp') {
        // Requested specifically by user to show alert popup if OTP is not correct
        alert('OTP is not correct');
      }
      setResetError(result.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D72626]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D72626]/5 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center mb-6">
          <RmcLogo theme="dark" className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {step === 1 ? 'Enter your email to receive a secure code.' : 'Enter your secure code and new password.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-200 dark:border-neutral-800">
          
          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Registered Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...registerEmail('email')}
                    className={`block w-full pl-10 pr-3 py-3 border ${emailErrors.email ? 'border-red-300' : 'border-neutral-300 dark:border-neutral-700'} rounded-xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D72626]/20 focus:border-[#D72626] sm:text-sm transition-all`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {emailErrors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{emailErrors.email.message}</p>
                )}
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{emailError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isEmailSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#D72626] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D72626] transition-all disabled:opacity-50"
                >
                  {isEmailSubmitting ? 'Verifying...' : 'Send OTP'}
                </button>
              </div>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-6" noValidate>
              
              {/* Email Summary */}
              <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg flex items-center justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Sending to: {verifiedEmail}</span>
                <button type="button" onClick={() => setStep(1)} className="text-[#D72626] font-medium hover:underline text-xs">
                  Change
                </button>
              </div>

              {/* OTP */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  6-Digit OTP Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    {...registerReset('otp')}
                    className={`block w-full pl-10 pr-3 py-3 border ${resetErrors.otp ? 'border-red-300' : 'border-neutral-300 dark:border-neutral-700'} rounded-xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D72626]/20 focus:border-[#D72626] sm:text-sm transition-all tracking-widest font-mono text-center`}
                    placeholder="123456"
                    required
                  />
                </div>
                {resetErrors.otp && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{resetErrors.otp.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...registerReset('newPassword')}
                    className={`block w-full pl-10 pr-10 py-3 border ${resetErrors.newPassword ? 'border-red-300' : 'border-neutral-300 dark:border-neutral-700'} rounded-xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D72626]/20 focus:border-[#D72626] sm:text-sm transition-all`}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {resetErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{resetErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...registerReset('confirmPassword')}
                    className={`block w-full pl-10 pr-10 py-3 border ${resetErrors.confirmPassword ? 'border-red-300' : 'border-neutral-300 dark:border-neutral-700'} rounded-xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D72626]/20 focus:border-[#D72626] sm:text-sm transition-all`}
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {resetErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              {/* Captcha */}
              <div className="pt-2">
                <Captcha moduleKey="password_reset" />
              </div>

              {resetError && (
                <div className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  {resetError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#D72626] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D72626] transition-all disabled:opacity-50"
                >
                  {isResetSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
