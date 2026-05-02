import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminActionFeedback from '@/components/admin/AdminActionFeedback';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-[#fafaf7] text-[#1a1410] font-sans text-sm">
      <AdminSidebar />
      <main className="flex flex-col min-h-screen overflow-hidden">
        <AdminActionFeedback />
        {children}
      </main>
    </div>
  );
}
