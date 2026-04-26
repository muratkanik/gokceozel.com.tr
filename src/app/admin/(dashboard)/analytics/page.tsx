export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analitik</h1>
        <p className="text-slate-500 mt-1">
          Ziyaretçi istatistikleri ve performans verileri çok yakında burada olacak.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Google Analytics Entegrasyonu</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Bu sayfa yapım aşamasındadır. Daha detaylı veriler için doğrudan Google Analytics panelinizi ziyaret edebilirsiniz.
        </p>
      </div>
    </div>
  );
}
