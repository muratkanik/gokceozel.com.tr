import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function PagesManagement() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { blocks: true }
      }
    }
  });

  const createPage = async (formData: FormData) => {
    'use server';
    const slug = formData.get('slug') as string;
    const titleInternal = formData.get('titleInternal') as string;
    const seoScore = parseInt(formData.get('seoScore') as string) || 0;

    if (!slug || !titleInternal) return;

    await prisma.page.create({
      data: {
        slug: slug.toLowerCase().replace(/[^a-z0-9/-]/g, '-'),
        titleInternal,
        seoScore
      }
    });

    revalidatePath('/admin/pages');
  };

  const deletePage = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    if (!id) return;

    await prisma.page.delete({ where: { id } });
    revalidatePath('/admin/pages');
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#111' }}>Sayfalar (Pages) Yönetimi</h1>

      {/* Create New Page Form */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Yeni Sayfa Ekle</h2>
        <form action={createPage} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>URL Slug</label>
            <input type="text" name="slug" required placeholder="örn: hizmetler/endolift" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ flex: '2 1 300px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Sayfa Adı (İç Gösterim)</label>
            <input type="text" name="titleInternal" required placeholder="Endolift Sayfası" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>SEO Skoru</label>
            <input type="number" name="seoScore" defaultValue={100} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ paddingTop: '25px' }}>
            <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
              Sayfa Oluştur
            </button>
          </div>
        </form>
      </div>

      {/* Pages List */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Kayıtlı Sayfalar</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px 10px', color: '#666' }}>URL (Slug)</th>
              <th style={{ padding: '15px 10px', color: '#666' }}>Sayfa Adı</th>
              <th style={{ padding: '15px 10px', color: '#666' }}>Blok Sayısı</th>
              <th style={{ padding: '15px 10px', color: '#666', width: '250px' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px 10px', fontWeight: '500', color: 'var(--color-gold)' }}>/{page.slug}</td>
                <td style={{ padding: '15px 10px' }}>{page.titleInternal}</td>
                <td style={{ padding: '15px 10px' }}>
                  <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '10px', fontSize: '12px' }}>
                    {page._count.blocks} Blok
                  </span>
                </td>
                <td style={{ padding: '15px 10px', display: 'flex', gap: '10px' }}>
                  <Link href={`/admin/blocks?pageId=${page.id}`} style={{ background: '#000', color: '#fff', textDecoration: 'none', padding: '8px 15px', borderRadius: '4px', fontSize: '14px' }}>
                    Blokları Yönet
                  </Link>
                  <form action={deletePage}>
                    <input type="hidden" name="id" value={page.id} />
                    <button type="submit" onClick={(e) => {
                      if (!confirm('Sayfayı ve içindeki tüm blokları silmek istediğinize emin misiniz?')) {
                        e.preventDefault();
                      }
                    }} style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Henüz sayfa oluşturulmamış.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
