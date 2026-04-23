import prisma from '@/lib/prisma';
import Link from 'next/link';
import DeleteForm from '@/components/admin/DeleteForm';
import { createBlock, deleteBlock, selectPageAction } from './actions';
import BlockManagerClient from '@/components/admin/BlockManagerClient';

function getPreviewText(block: any) {
  const data = block.translations?.[0]?.contentData;
  if (!data || data === '{}' || data === '[]') return <span style={{ color: '#999', fontStyle: 'italic' }}>İçerik Yok</span>;
  
  try {
    if (block.componentType === 'hero') {
      const parsed = JSON.parse(data);
      return <span style={{ color: '#555' }}>{Array.isArray(parsed) ? `${parsed.length} Slayt` : 'JSON Formatı'}</span>;
    }
    if (block.componentType === 'biography') {
      const parsed = JSON.parse(data);
      return <span style={{ color: '#555' }}>{parsed.title || 'Biyografi Modülü'}</span>;
    }
  } catch (e) {
    // ignore
  }
  
  // For text block, strip HTML
  const stripped = data.replace(/<[^>]+>/g, '').trim();
  if (!stripped) return <span style={{ color: '#999', fontStyle: 'italic' }}>Medya/Boş</span>;
  return <span style={{ color: '#555' }}>{stripped.substring(0, 60)}...</span>;
}

export default async function BlocksManagementPage({ searchParams }: { searchParams: Promise<{ pageId?: string }> }) {
  const params = await searchParams;
  const pageId = params.pageId;

  const pages = await prisma.page.findMany({ orderBy: { titleInternal: 'asc' } });
  
  const blocks = pageId ? await prisma.contentBlock.findMany({
    where: { pageId },
    orderBy: { sortOrder: 'asc' },
    include: {
      translations: {
        where: { locale: 'tr' }, // Fetch TR locale for preview
        select: { contentData: true }
      },
      _count: {
        select: { translations: true }
      }
    }
  }) : [];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#111' }}>İçerik Blokları Yönetimi</h1>

      {/* Page Selector */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Sayfa Seçimi</h2>
        
        <form action={selectPageAction} style={{ display: 'flex', gap: '15px' }}>
          <select name="selectedPageId" defaultValue={pageId || ''} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option value="" disabled>Düzenlemek istediğiniz sayfayı seçin...</option>
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.titleInternal} (/{p.slug})</option>
            ))}
          </select>
          <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
            Blokları Getir
          </button>
        </form>
      </div>

      {pageId && (
        <>
          {/* Create New Block Form */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Yeni Blok Ekle</h2>
            <form action={createBlock} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <input type="hidden" name="pageId" value={pageId} />
              
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Bileşen Türü (Component Type)</label>
                <select name="componentType" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="text_block">Standart Metin Bloğu (Text Block)</option>
                  <option value="hero">Hero / Banner Slayt Yöneticisi</option>
                  <option value="biography">Biyografi / Özgeçmiş (CV) Yöneticisi</option>
                  <option value="services_grid">Hizmetler Grid</option>
                  <option value="custom_html">Özel HTML</option>
                </select>
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Sıralama (Sort Order)</label>
                <input type="number" name="sortOrder" defaultValue={0} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ paddingTop: '25px' }}>
                <button type="submit" style={{ background: '#2ed573', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  + Blok Ekle
                </button>
              </div>
            </form>
          </div>

          {/* Blocks List */}
          <div style={{ background: 'transparent' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Sayfadaki Bloklar</h2>
            <BlockManagerClient pageId={pageId} initialBlocks={blocks} />
          </div>
        </>
      )}
    </div>
  );
}
