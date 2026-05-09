'use client';

import dynamic from 'next/dynamic';

const AdminMap = dynamic(() => import('./AdminMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">Harita Yükleniyor...</div>
});

export default function AdminMapWrapper(props: any) {
  return <AdminMap {...props} />;
}
