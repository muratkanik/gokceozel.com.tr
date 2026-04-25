import { redirect } from 'next/navigation';

// Services are managed through the icerikler (content) editor
export default function AdminHizmetlerPage() {
  redirect('/admin/icerikler');
}
