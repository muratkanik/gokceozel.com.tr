import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TranslationEditor from '@/components/admin/TranslationEditor';

export default async function BlockEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const block = await prisma.contentBlock.findUnique({
    where: { id },
    include: {
      page: true,
      translations: true
    }
  });

  if (!block) return notFound();

  // Prepare standard locales
  const locales = ['tr', 'en', 'ar', 'ru'];
  
  // Transform existing translations into an easy to use map
  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find(t => t.locale === loc);
    translationMap[loc] = existing?.contentData || '';
  });

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href={`/admin/blocks?pageId=${block.pageId}`} style={{ color: '#666', textDecoration: 'none' }}>
          ← Geri Dön ({block.page.titleInternal})
        </Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#111' }}>
        Blok Düzenle: {block.componentType}
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bu blok, <strong>/{block.page.slug}</strong> sayfasında <strong>{block.sortOrder}.</strong> sırada gösterilecektir.
      </p>

      {/* Client Component to handle tabs and RichTextEditor state */}
      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
