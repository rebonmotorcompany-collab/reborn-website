import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TeamMemberForm from '@/components/admin/TeamMemberForm'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) notFound()

  // Convert dates to strings for client form
  const initialData = {
    ...member,
    joiningDate: member.joiningDate?.toISOString() ?? '',
  }

  return <TeamMemberForm initialData={initialData} isEditing />
}
