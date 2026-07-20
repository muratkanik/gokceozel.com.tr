'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeoBatchPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all videos
    fetch('/api/admin/videos/batch-seo')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos || []);
      });
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev]);
  };

  const startBatch = async () => {
    setStatus('running');
    for (let i = 0; i < videos.length; i++) {
      setCurrentIndex(i);
      const video = videos[i];
      addLog(`İşleniyor: ${video.title}`);
      
      try {
        const res = await fetch('/api/admin/videos/batch-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: video.id })
        });
        const data = await res.json();
        
        if (data.success) {
          addLog(`✅ Tamamlandı: ${video.title} (Atlanan: ${data.skipped ? 'Evet' : 'Hayır'})`);
        } else {
          addLog(`❌ Hata (${video.title}): ${data.error}`);
        }
      } catch (e: any) {
        addLog(`❌ Hata (${video.title}): ${e.message}`);
      }
      
      // sleep 1 second to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }
    setStatus('done');
    addLog('🎉 Tüm videolar tamamlandı!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Toplu SEO & Çeviri İşlemi</h1>
      <p className="mb-6 text-gray-600">
        Bu sayfada tüm videolar (toplam {videos.length} adet) sırayla taranacak.
        SEO uyumlu metinleri eksik olanlara Yapay Zeka ile içerik üretilip, tüm dillere çevrilecektir.
      </p>
      
      <div className="mb-6">
        <button 
          onClick={startBatch}
          disabled={status === 'running' || videos.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
        >
          {status === 'running' ? 'İşleniyor...' : 'İşlemi Başlat'}
        </button>
      </div>
      
      {status !== 'idle' && (
        <div className="mb-4">
          <p className="font-semibold">İlerleme: {currentIndex + 1} / {videos.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${videos.length ? ((currentIndex + 1) / videos.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">{log}</div>
        ))}
        {logs.length === 0 && <div className="text-gray-500">Hazır bekleniyor...</div>}
      </div>
    </div>
  );
}
