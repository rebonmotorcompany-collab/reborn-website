import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import PageForm from '@/components/admin/PageForm'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await prisma.contentPage.findUnique({
    where: { id: id }
  })

  if (!page) {
    notFound()
  }

  return <PageForm initialData={page} isEditing={true} />
}
