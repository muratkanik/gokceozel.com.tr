import MediaBrowser from '@/components/admin/MediaBrowser';

export default function MediaGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medya Galerisi</h1>
        <p className="text-slate-500 mt-1">
          Buraya yüklediğiniz görselleri ve dosyaları web sitenizin içeriklerinde veya biyografi formlarında URL adreslerini kopyalayarak kullanabilirsiniz.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <MediaBrowser />
      </div>
    </div>
  );
}
