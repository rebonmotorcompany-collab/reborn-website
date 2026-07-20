import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import FaqForm from '@/components/admin/FaqForm'

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const faq = await prisma.faqItem.findUnique({
    where: { id }
  })

  if (!faq) {
    notFound()
  }

  return <FaqForm initialData={faq} isEditing={true} />
}
