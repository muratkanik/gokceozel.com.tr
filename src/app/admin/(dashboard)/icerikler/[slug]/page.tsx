import PageEditor from '@/components/admin/PageEditor';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function EditContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let page = null;
  
  if (slug !== 'yeni') {
    page = await prisma.page.findUnique({
      where: { slug },
      include: {
        blocks: {
          include: { translations: true },
          orderBy: { sortOrder: 'asc' }
        },
        seoMeta: true
      }
    });

    if (!page) {
      notFound();
    }
  }

  return (
    <PageEditor 
      initialData={page || { slug: 'Yeni İçerik', type: 'SERVICE' }} 
      pageType="İçerikler"
    />
  );
}
