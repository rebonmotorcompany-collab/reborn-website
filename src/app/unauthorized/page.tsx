import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unauthorized Access | Rebon Motor Company',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Access Denied
        </h2>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
          You do not have the required permissions to view this page. If you believe this is a mistake, please contact your system administrator.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
