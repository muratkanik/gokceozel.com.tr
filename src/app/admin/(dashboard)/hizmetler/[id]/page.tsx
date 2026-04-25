import { redirect } from 'next/navigation';

// Services are managed through the icerikler (content) editor
export default async function AdminHizmetEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/icerikler/${id}`);
}
