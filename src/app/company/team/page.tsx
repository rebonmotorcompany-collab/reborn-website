import type { Metadata } from 'next'
import { TeamPage } from '@/components/TeamPage'

export const metadata: Metadata = {
  title: 'Our Team | Rebon Motor Company',
  description: 'Meet the passionate engineers, designers, and innovators driving the future of electric mobility at Rebon Motor Company.',
}

export default function CompanyTeamRoute() {
  return <TeamPage />
}
