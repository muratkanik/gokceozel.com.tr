import { createClient } from '@/lib/supabase/server';
import PageEditor from '@/components/admin/PageEditor';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch from Prisma instead of Supabase!
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      page: {
        include: {
          blocks: {
            include: { translations: true }
          },
          seoMeta: true
        }
      }
    }
  });

  if (!service && id !== 'new') {
    notFound();
  }

  return (
    <PageEditor 
      initialData={service?.page || { slug: 'Yeni Hizmet' }} 
      pageType="Hizmetler"
    />
  );
}
