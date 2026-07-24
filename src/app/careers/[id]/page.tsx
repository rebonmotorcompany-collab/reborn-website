import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>
}

export default async function LegacyCareerDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/company/careers/${id}`);
}
