import prisma from '@/lib/prisma';
import Link from 'next/link';
import DeleteForm from '@/components/admin/DeleteForm';
import { createBlock, deleteBlock, selectPageAction } from './actions';

export default async function BlocksManagementPage({ searchParams }: { searchParams: Promise<{ pageId?: string }> }) {
  const params = await searchParams;
  const pageId = params.pageId;

  const pages = await prisma.page.findMany({ orderBy: { titleInternal: 'asc' } });
  
  const blocks = pageId ? await prisma.contentBlock.findMany({
    where: { pageId },
    orderBy: { sortOrder: 'asc' },
    include: {
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
                  <option value="hero">Hero / Banner</option>
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
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Sayfadaki Bloklar</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '15px 10px', color: '#666', width: '80px' }}>Sıra</th>
                  <th style={{ padding: '15px 10px', color: '#666' }}>Bileşen Türü</th>
                  <th style={{ padding: '15px 10px', color: '#666' }}>Çeviriler</th>
                  <th style={{ padding: '15px 10px', color: '#666', width: '250px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{block.sortOrder}</td>
                    <td style={{ padding: '15px 10px', fontWeight: '500', color: 'var(--color-gold)' }}>{block.componentType}</td>
                    <td style={{ padding: '15px 10px' }}>
                      <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '10px', fontSize: '12px' }}>
                        {block._count.translations} dilde çeviri
                      </span>
                    </td>
                    <td style={{ padding: '15px 10px', display: 'flex', gap: '10px' }}>
                      <Link href={`/admin/blocks/${block.id}`} style={{ background: '#000', color: '#fff', textDecoration: 'none', padding: '8px 15px', borderRadius: '4px', fontSize: '14px' }}>
                        İçeriği Düzenle
                      </Link>
                      <DeleteForm action={deleteBlock} confirmMessage="Bu bloğu ve içindeki tüm çevirileri silmek istediğinize emin misiniz?">
                        <input type="hidden" name="id" value={block.id} />
                        <input type="hidden" name="pageId" value={pageId} />
                      </DeleteForm>
                    </td>
                  </tr>
                ))}
                {blocks.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Bu sayfada henüz blok bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
