import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { CareerDetail } from '@/components/CareerDetail'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const career = await prisma.career.findUnique({
      where: { id },
      select: { title: true, metaTitle: true, metaDesc: true, department: true, location: true }
    })
    if (!career || career === null) return { title: 'Job Not Found | Rebon Motor Company' }
    return {
      title: career.metaTitle || `${career.title} | Careers at Rebon Motor Company`,
      description: career.metaDesc || `Apply for ${career.title} at Rebon Motor Company${career.location ? ` in ${career.location}` : ''}.`,
    }
  } catch {
    return { title: 'Careers | Rebon Motor Company' }
  }
}

export default async function CompanyCareerDetailPage({ params }: Props) {
  const { id } = await params
  return <CareerDetail id={id} />
}
