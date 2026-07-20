'use client';

import { useFormStatus } from 'react-dom';
import { RefreshCw } from 'lucide-react';
import { syncYouTubeChannel } from './actions';
import { toast } from 'sonner'; // Ensure toast is available, if not we will just alert

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-white border border-[#e0d8c8] text-[#1a1410] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <RefreshCw className={`w-4 h-4 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Senkronize Ediliyor...' : 'YouTube\'dan Çek'}
    </button>
  );
}

export function SyncButton() {
  async function handleSync() {
    try {
      const res = await syncYouTubeChannel();
      if (res.success) {
        alert(`Başarıyla senkronize edildi. Toplam ${res.count} video eklendi/güncellendi.`);
      } else {
        alert(`Hata oluştu: ${res.error}`);
      }
    } catch (e: any) {
      alert(`Beklenmeyen hata: ${e.message}`);
    }
  }

  // We can just use an onClick instead of a form to easily show alerts, but we need local loading state
  return (
     <form action={handleSync}>
       <SubmitButton />
     </form>
  );
}
