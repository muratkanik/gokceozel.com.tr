import { redirect } from 'next/navigation';

// Blog posts are managed through the icerikler (content) editor
export default function AdminBlogPage() {
  redirect('/admin/icerikler');
}
