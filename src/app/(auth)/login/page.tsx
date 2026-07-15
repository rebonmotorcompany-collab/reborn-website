import LoginForm from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Rebon Motor Company',
  description: 'Sign in to the Rebon Motor Company portal.',
}

export default function LoginPage() {
  return <LoginForm />
}
