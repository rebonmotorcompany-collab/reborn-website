import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import DealerForm from '@/components/admin/DealerForm'

export default async function EditDealerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const dealer = await prisma.dealer.findFirst({
    where: { id, deletedAt: null },
  })

  if (!dealer) {
    notFound()
  }

  return <DealerForm initialData={dealer} isEditing={true} />
}
