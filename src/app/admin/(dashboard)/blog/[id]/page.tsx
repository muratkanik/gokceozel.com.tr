import { createClient } from '@/lib/supabase/server';
import ContentEntryEditor from '@/components/admin/ContentEntryEditor';
import { saveContentEntryTranslations } from '@/app/admin/(dashboard)/shared-actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from('content_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (!blog) {
    notFound();
  }

  const locales = ['tr', 'en', 'ar', 'ru'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/admin/blog" className="hover:text-slate-900 transition-colors">Blog Yazıları</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Düzenle</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {blog.translations?.tr?.title || blog.slug}
          </h1>
          <p className="text-slate-500 mt-1">Bu blog yazısının tüm dil çevirilerini ve içeriklerini aşağıdan yönetebilirsiniz.</p>
        </div>
      </div>

      <ContentEntryEditor 
        initialData={blog.translations || {}} 
        locales={locales}
        onSave={async (data) => {
          'use server';
          await saveContentEntryTranslations(id, data);
        }}
      />
    </div>
  );
}
