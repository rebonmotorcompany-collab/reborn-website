import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TestimonialForm from '@/components/admin/TestimonialForm'

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testimonial = await prisma.testimonial.findUnique({
    where: { id }
  })

  if (!testimonial) {
    notFound()
  }

  return <TestimonialForm initialData={testimonial} isEditing={true} />
}
