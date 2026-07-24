import { prisma } from '@/lib/db'
import AboutForm from '@/components/admin/AboutForm'

export default async function AboutAdminPage() {
  // Fetch all about sections and convert to keyed object for the form
  let data: Record<string, any> = {}
  try {
    const sections = await prisma.aboutSection.findMany()
    sections.forEach(s => {
      data[s.key] = s.data
    })
  } catch (e) {
    console.error('[dashboard/company/about] Failed to load sections:', e)
  }

  return <AboutForm initialData={data} />
}
