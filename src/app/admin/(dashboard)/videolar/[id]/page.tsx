'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { saveVideo, getVideo, deleteVideo } from '../actions';
import dynamic from 'next/dynamic';
import { Save, Trash2, ArrowLeft, Video as VideoIcon } from 'lucide-react';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function VideoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '',
    slug: '',
    contentHtml: '',
    sortOrder: 0,
    isActive: true,
  });

  // Fetch video data if not 'yeni'
  if (id !== 'yeni' && !initialFetchDone) {
    getVideo(id).then(video => {
      if (video) {
        setFormData({
          title: video.title,
          youtubeId: video.youtubeId,
          slug: video.slug,
          contentHtml: video.contentHtml || '',
          sortOrder: video.sortOrder,
          isActive: video.isActive,
        });
      }
      setInitialFetchDone(true);
    });
  } else if (id === 'yeni' && !initialFetchDone) {
    setInitialFetchDone(true);
  }

  const handleSave = async () => {
    setLoading(true);
    const res = await saveVideo(id, formData);
    if (res.success) {
      alert('Video başarıyla kaydedildi!');
      if (id === 'yeni') {
        router.push(`/admin/videolar/${res.id}`);
      } else {
        router.refresh();
      }
    } else {
      alert('Hata: ' + res.error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
      setLoading(true);
      const res = await deleteVideo(id);
      if (res.success) {
        router.push('/admin/videolar');
      } else {
        alert('Hata: ' + res.error);
        setLoading(false);
      }
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (!initialFetchDone) {
    return <div className="p-12 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/videolar" className="w-10 h-10 rounded-full bg-white border border-[#e0d8c8] flex items-center justify-center text-[#887865] hover:bg-[#fcfbf9] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1a1410]">
              {id === 'yeni' ? 'Yeni Video Ekle' : 'Videoyu Düzenle'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {id !== 'yeni' && (
            <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Sil
            </button>
          )}
          <button onClick={handleSave} disabled={loading} className="bg-[#1a1410] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#3d2f22] transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#e0d8c8] p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a1410] mb-2">Video Başlığı</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => {
                  setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: id === 'yeni' ? generateSlug(e.target.value) : formData.slug
                  });
                }}
                className="w-full bg-[#faf9f5] border border-[#e0d8c8] rounded-lg px-4 py-3 text-[#1a1410] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-all"
                placeholder="Örn: Burun Estetiği Ameliyatı Sonrası..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#1a1410] mb-2">Videonun Altındaki Zengin Metin (Opsiyonel)</label>
              <p className="text-xs text-[#887865] mb-3">Bu alana video detaylarını, makaleyi veya notlarınızı yazabilirsiniz.</p>
              <div className="bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={formData.contentHtml} 
                  onChange={(val) => setFormData({...formData, contentHtml: val})}
                  className="h-64 mb-12"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#e0d8c8] p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a1410] mb-2">YouTube Video ID</label>
              <input
                type="text"
                value={formData.youtubeId}
                onChange={e => {
                  let val = e.target.value;
                  // Auto extract if full URL is pasted
                  if (val.includes('v=')) {
                    val = new URLSearchParams(val.split('?')[1]).get('v') || val;
                  } else if (val.includes('youtu.be/')) {
                    val = val.split('youtu.be/')[1].split('?')[0];
                  }
                  setFormData({ ...formData, youtubeId: val });
                }}
                className="w-full bg-[#faf9f5] border border-[#e0d8c8] rounded-lg px-4 py-2.5 text-[#1a1410] focus:outline-none focus:border-amber-700 transition-all font-mono text-sm"
                placeholder="Örn: dQw4w9WgXcQ"
              />
              {formData.youtubeId && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[#e0d8c8]">
                  <img src={`https://img.youtube.com/vi/${formData.youtubeId}/mqdefault.jpg`} className="w-full h-auto" alt="Preview" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1410] mb-2">SEO Slug (URL Uzantısı)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[#faf9f5] border border-[#e0d8c8] rounded-lg px-4 py-2.5 text-[#1a1410] focus:outline-none focus:border-amber-700 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-amber-700 rounded focus:ring-amber-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#1a1410]">Aktif (Sitede Görünsün)</label>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#1a1410] mb-2">Sıralama (Opsiyonel)</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-24 bg-[#faf9f5] border border-[#e0d8c8] rounded-lg px-4 py-2.5 text-[#1a1410] focus:outline-none focus:border-amber-700 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
