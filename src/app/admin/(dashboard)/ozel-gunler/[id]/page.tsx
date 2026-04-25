import { getEventById } from '../actions';
import EventForm from './EventForm';

export const metadata = {
  title: 'Etkinlik Düzenle | Admin Panel'
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let initialData = null;
  
  if (id !== 'yeni') {
    initialData = await getEventById(id);
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-[#1a1410] mb-2">
          {id === 'yeni' ? 'Yeni Özel Gün Ekle' : 'Özel Gün Düzenle'}
        </h1>
        <p className="text-[#6a5f54] text-sm">
          Etkinlik tarihlerini, görselini ve çevirilerini bu alandan ayarlayabilirsiniz.
        </p>
      </div>

      <EventForm initialData={initialData} />
    </div>
  );
}
