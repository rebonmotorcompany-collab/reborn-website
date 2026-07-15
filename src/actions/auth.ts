'use server'

import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { CaptchaService } from '@/lib/captcha'
import { headers } from 'next/headers'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const headerList = await headers()
    const ipAddress = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || 'unknown'

    const captchaToken = formData.get('captchaToken') as string
    const captchaCode = formData.get('captchaCode') as string

    const validation = await CaptchaService.validate(captchaToken, captchaCode, 'login', ipAddress.split(',')[0].trim())

    if (!validation.success) {
      return validation.message || 'CAPTCHA validation failed.'
    }

    formData.delete('captchaToken')
    formData.delete('captchaCode')

    await signIn('credentials', Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function validateCaptchaAction(captchaToken: string, captchaCode: string, moduleKey: string) {
  const headerList = await headers()
  const ipAddress = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || 'unknown'

  const validation = await CaptchaService.validate(captchaToken, captchaCode, moduleKey, ipAddress.split(',')[0].trim())

  if (!validation.success) {
    return { success: false, error: validation.message || 'CAPTCHA validation failed.' }
  }
  return { success: true }
}

export async function logOut() {
  await signOut({ redirectTo: '/' })
}
