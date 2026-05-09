export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analitik</h1>
        <p className="text-slate-500 mt-1">
          Web sitenizin ziyaretçi istatistikleri ve performans verileri
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Google Analytics Aktif!</h3>
        <p className="text-slate-600 max-w-lg mx-auto mb-8 text-lg">
          Google Analytics izleme kodunuz <strong>(G-Z5G51S538X)</strong> web sitenize başarıyla entegre edildi ve şu anda ziyaretçileri takip ediyor.
        </p>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          En detaylı ziyaretçi analizlerine, kaynak verilerine ve sayfa performanslarına ulaşmak için doğrudan Google Analytics panelinizi kullanabilirsiniz.
        </p>
        
        <a 
          href="https://analytics.google.com/analytics/web/#/p438183170/reports/intelligenthome"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#fbbc04] hover:bg-[#f2a60c] text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Google Analytics'i Aç
        </a>
      </div>
    </div>
  );
}
