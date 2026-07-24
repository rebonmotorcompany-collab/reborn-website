import type { Metadata } from 'next'
import { CareersPage } from '@/components/CareersPage'

export const metadata: Metadata = {
  title: 'Careers | Rebon Motor Company',
  description: 'Join Rebon Motor Company — Pakistan\'s leading electric vehicle manufacturer. Explore open positions across engineering, design, sales, and more.',
}

export default function CompanyCareersRoute() {
  return <CareersPage />
}
