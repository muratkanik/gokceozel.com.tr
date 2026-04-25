import { redirect } from 'next/navigation';

// Blog posts are managed through the icerikler (content) editor
export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/icerikler/${id}`);
}
