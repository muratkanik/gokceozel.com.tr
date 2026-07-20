import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Video as VideoIcon, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VideolarListPage() {
  const videos = await prisma.video.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1a1410] flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-[#887865]" />
            Video Galerisi
          </h1>
          <p className="text-[#66574a] text-sm mt-1">YouTube videolarınızı ve özel açıklamalarını yönetin.</p>
        </div>
        <Link 
          href="/admin/videolar/yeni"
          className="bg-[#1a1410] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#3d2f22] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Video Ekle
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-[#e0d8c8] overflow-hidden">
        {videos.length === 0 ? (
          <div className="text-center py-12 text-[#887865]">
            <VideoIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium text-[#1a1410]">Henüz hiç video eklenmemiş.</p>
            <p className="text-sm mt-1 mb-4">Sağ üstteki butondan ilk videonuzu ekleyebilirsiniz.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf9f5] border-b border-[#e0d8c8] text-xs uppercase tracking-wider text-[#887865]">
                <th className="p-4 font-semibold w-24">Görsel</th>
                <th className="p-4 font-semibold">Video Başlığı</th>
                <th className="p-4 font-semibold">Durum</th>
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} className="border-b border-[#f0ebe1] hover:bg-[#faf9f5] transition-colors">
                  <td className="p-4">
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                      alt={video.title} 
                      className="w-20 h-auto rounded shadow-sm object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#1a1410]">{video.title}</div>
                    <div className="text-xs text-[#887865] flex items-center gap-1 mt-0.5">
                      <span className="truncate max-w-[200px]">Slug: {video.slug}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${video.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {video.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/videolar/${video.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-white hover:text-black hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
