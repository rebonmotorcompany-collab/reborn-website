import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import CareerForm from '@/components/admin/CareerForm'

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await prisma.career.findUnique({ where: { id } })
  if (!career) notFound()

  const initialData = {
    ...career,
    deadline: career.deadline?.toISOString() ?? '',
  }

  return <CareerForm initialData={initialData} isEditing />
}
