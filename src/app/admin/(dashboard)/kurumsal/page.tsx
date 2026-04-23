import ContentEntryEditor from '@/components/admin/ContentEntryEditor';
import { ensureContentEntryExists, saveContentEntryTranslations } from '@/app/admin/(dashboard)/shared-actions';

export default async function KurumsalManagementPage() {
  const locales = ['tr', 'en', 'ar', 'ru'];
  
  // Sitenin ön yüzünde "profdr-gke-zel" kullanılıyor
  const defaultData = {
    tr: {
      title: 'Prof. Dr. Gökçe Özel Kliniği',
      content: '<p>Prof. Dr. Gökçe Özel, Kulak Burun Boğaz ve Baş Boyun Cerrahisi alanında...</p>'
    }
  };

  const entry = await ensureContentEntryExists('profdr-gke-zel', 'page', defaultData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kurumsal (Hakkımızda) Yönetimi</h1>
        <p className="text-slate-500 mt-1">
          Bu sayfadaki bilgiler, web sitenizin <strong className="text-slate-700">"Kurumsal"</strong> bölümünde gösterilir.
        </p>
      </div>

      <ContentEntryEditor 
        initialData={entry.translations || {}} 
        locales={locales}
        onSave={async (data) => {
          'use server';
          await saveContentEntryTranslations(entry.id, data);
        }}
      />
    </div>
  );
}
