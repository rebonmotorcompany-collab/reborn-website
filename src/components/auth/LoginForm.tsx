'use client'

import { useState } from 'react'
import { validateCaptchaAction } from '@/actions/auth'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Captcha from '@/components/Captcha'

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const captchaToken = formData.get('captchaToken') as string;
    const captchaCode = formData.get('captchaCode') as string;

    // 1. Validate CAPTCHA on server
    const captchaResult = await validateCaptchaAction(captchaToken, captchaCode, 'login');
    if (!captchaResult.success) {
      setErrorMessage(captchaResult.error || 'CAPTCHA failed');
      setIsPending(false);
      return;
    }

    // 2. Sign In
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage('Invalid email or password.');
      setIsPending(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@rebonmotorcompany.com.pk"
              required
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <Captcha moduleKey="login" />

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isPending ? 'Signing in...' : 'Sign In'}</span>
        {!isPending && <ArrowRight className="w-5 h-5" />}
      </button>

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center border border-red-200 dark:border-red-800">
          {errorMessage}
        </div>
      )}
    </form>
  )
}
