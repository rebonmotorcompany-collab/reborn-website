import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import DealerProfileView from '@/components/admin/DealerProfileView'

export default async function ViewDealerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const dealer = await prisma.dealer.findFirst({
    where: { id, deletedAt: null },
  })

  if (!dealer) {
    notFound()
  }

  return <DealerProfileView dealer={dealer} />
}
