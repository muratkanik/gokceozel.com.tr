import MediaBrowser from '@/components/admin/MediaBrowser';

export default function MediaGalleryPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#111' }}>Medya Galerisi</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Buraya yüklediğiniz dosyaları Rich Text Editör (İçerik Blokları) içerisinde veya sitenin herhangi bir yerinde URL kopyalayarak kullanabilirsiniz.
      </p>
      
      <MediaBrowser />
    </div>
  );
}
