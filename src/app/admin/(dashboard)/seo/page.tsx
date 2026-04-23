"use client";

import { useState } from "react";
import {
  Search, Sparkles, Copy, ChevronDown, ChevronUp, AlertCircle, Loader2,
  PenLine, CheckCircle2, FileText, RefreshCw, ExternalLink,
} from "lucide-react";

interface AnalysisSection { title: string; content: string; }
interface SimilarPost { slug: string; title: string; category: string; excerpt?: string; score: number; image?: string; }
interface GeneratedBlog {
  title: string; metaTitle: string; metaDescription: string;
  excerpt: string; content: string; tags: string[];
  category: string; readTime: string; seoKeyword: string;
}

function parseAnalysis(raw: string): AnalysisSection[] {
  const sections: AnalysisSection[] = [];
  const lines = raw.split("\n");
  let current: AnalysisSection | null = null;
  for (const line of lines) {
    const m = line.match(/^##\s+\d+\.\s+(.+)/);
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1].trim(), content: "" };
    } else if (current) current.content += line + "\n";
  }
  if (current) sections.push(current);
  return sections;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^-\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-5 space-y-1 my-2">${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p class='mt-2'>")
    .replace(/^(.+)$/m, "<p>$1</p>");
}

const SECTION_ICONS: Record<string, string> = {
  "Rakip Stratejileri": "🏆", "İçerik Boşlukları ve Fırsatlar": "🎯",
  "Önerilen Sayfa Yapısı": "📐", "Semantik Anahtar Kelimeler": "🔑",
  "İç Bağlantı Önerileri": "🔗", "Önerilen Meta Başlık ve Meta Açıklama": "📝",
  "Zorluk & Fırsat Değerlendirmesi": "📊",
};

const QUICK_KEYWORDS = [
  "burun estetiği fiyatları", "rinoplasti ankara", "endolift lazer",
  "yüz germe ameliyatı", "kbb uzmanı ankara", "botoks fiyatları"
];

export default function SeoAnalysisPage() {
  // Analysis state
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState("");
  const [sections, setSections] = useState<AnalysisSection[]>([]);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0, 1, 2]));
  const [copied, setCopied] = useState(false);
  const [analyzed, setAnalyzed] = useState("");

  // Blog generation state
  const [generatingBlog, setGeneratingBlog] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null);
  const [blogError, setBlogError] = useState("");
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([]);
  const [applyTarget, setApplyTarget] = useState<string | "new" | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<{ success: boolean; slug: string; isNew: boolean } | null>(null);
  const [blogPreviewOpen, setBlogPreviewOpen] = useState(false);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setRaw("");
    setSections([]);
    setGeneratedBlog(null);
    setApplyResult(null);
    try {
      const res = await fetch("/api/ai/seo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setRaw(data.analysis);
      setSections(parseAnalysis(data.analysis));
      setAnalyzed(keyword.trim());
      setOpenSections(new Set([0, 1, 2, 3, 4, 5, 6]));
      // Also search for similar posts
      fetch(`/api/admin/blog?q=${encodeURIComponent(keyword.trim())}`)
        .then((r) => r.json())
        .then((d) => setSimilarPosts(d.posts ?? []));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateBlog() {
    setGeneratingBlog(true);
    setBlogError("");
    setGeneratedBlog(null);
    setApplyResult(null);
    try {
      const res = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: analyzed, analysis: raw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Oluşturma başarısız");
      setGeneratedBlog(data.blog);
      setBlogPreviewOpen(true);
    } catch (err: unknown) {
      setBlogError(err instanceof Error ? err.message : "Hata");
    } finally {
      setGeneratingBlog(false);
    }
  }

  async function handleApply() {
    if (!generatedBlog || applyTarget === null) return;
    setApplying(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetSlug: applyTarget === "new" ? null : applyTarget,
          blogData: generatedBlog,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Uygulama başarısız");
      setApplyResult(data);
    } catch (err: unknown) {
      setBlogError(err instanceof Error ? err.message : "Hata");
    } finally {
      setApplying(false);
    }
  }

  function toggleSection(idx: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9972B] to-[#A07720] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">SEO Rakip Analizi & Blog Üretici</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Analiz → Blog yaz → Mevcut sayfaya uygula veya yeni oluştur</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Anahtar Kelime</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Örn: cami halısı fiyatları"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B] text-sm"
                />
              </div>
              <button type="submit" disabled={loading || !keyword.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#006064] text-white font-bold text-sm hover:bg-[#003B40] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analiz ediliyor...</> : <><Sparkles className="w-4 h-4" /> Analiz Et</>}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_KEYWORDS.map((kw) => (
              <button key={kw} type="button" onClick={() => setKeyword(kw)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${keyword === kw ? "bg-[#006064] text-white border-[#006064]" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
                {kw}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Analysis Results ── */}
      {sections.length > 0 && !loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Analiz: <span className="text-[#C9972B] font-bold">"{analyzed}"</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{sections.length} bölüm · GPT-4o</p>
            </div>
            <button type="button" onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Kopyalandı!" : "Kopyala"}
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {sections.map((section, idx) => {
              const isOpen = openSections.has(idx);
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <button type="button" onClick={() => toggleSection(idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <span className="text-xl flex-shrink-0">{SECTION_ICONS[section.title] ?? "📋"}</span>
                    <span className="flex-1 font-bold text-slate-800 dark:text-white text-sm">{section.title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800">
                      <div className="mt-4 text-sm text-slate-700 dark:text-slate-300
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2
                        [&_li]:text-slate-600 [&_li]:dark:text-slate-400
                        [&_strong]:text-slate-800 [&_strong]:dark:text-white [&_strong]:font-semibold
                        [&_p]:mb-2 [&_p]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content.trim()) }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Site İçi Karşılaştırma ── */}
          {similarPosts.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Sitenizdeki Benzer Sayfalar — "{analyzed}"
              </h3>
              <div className="space-y-2">
                {similarPosts.map((post) => (
                  <div key={post.slug} className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-3 border border-blue-100 dark:border-blue-900">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{post.title}</p>
                      <p className="text-xs text-slate-400">{post.category} · Benzerlik skoru: {post.score}</p>
                    </div>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all flex-shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                Bu sayfaları analiz sonuçlarıyla karşılaştırarak iyileştirme yapabilir ya da yeni bir blog yazısı oluşturabilirsiniz.
              </p>
            </div>
          )}

          {/* ── Blog Üretici ── */}
          <div className="bg-gradient-to-br from-[#006064] to-[#003B40] rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C9972B] flex items-center justify-center flex-shrink-0">
                <PenLine className="w-5 h-5 text-[#003B40]" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg mb-1">Bu Analizden Blog Yazısı Üret</h3>
                <p className="text-white/70 text-sm mb-4">
                  GPT-4o, rakip analizine göre "{analyzed}" için 1000+ kelimelik, SEO uyumlu tam bir blog yazısı oluşturur.
                </p>

                {!generatedBlog && !applyResult && (
                  <button type="button" onClick={handleGenerateBlog} disabled={generatingBlog}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9972B] text-[#003B40] font-bold text-sm hover:bg-[#E4B84A] disabled:opacity-50 transition-all">
                    {generatingBlog ? <><Loader2 className="w-4 h-4 animate-spin" /> Blog yazısı oluşturuluyor...</> : <><Sparkles className="w-4 h-4" /> Blog Yazısı Oluştur</>}
                  </button>
                )}

                {blogError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-700/40 text-red-300 text-sm mt-3">
                    <AlertCircle className="w-4 h-4" /> {blogError}
                  </div>
                )}

                {/* Generated blog preview */}
                {generatedBlog && !applyResult && (
                  <div className="mt-4 space-y-4">
                    {/* Preview card */}
                    <div className="bg-white/10 rounded-xl p-4 space-y-2">
                      <div>
                        <span className="text-xs text-white/50 uppercase tracking-wider">Başlık</span>
                        <p className="text-white font-bold text-sm mt-0.5">{generatedBlog.title}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/50 uppercase tracking-wider">Meta Açıklama</span>
                        <p className="text-white/80 text-xs mt-0.5">{generatedBlog.metaDescription}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/50 uppercase tracking-wider">Özet</span>
                        <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{generatedBlog.excerpt}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{generatedBlog.category}</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{generatedBlog.readTime}</span>
                        {generatedBlog.tags?.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs bg-[#C9972B]/30 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                      <button type="button" onClick={() => setBlogPreviewOpen(!blogPreviewOpen)}
                        className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1 mt-1">
                        {blogPreviewOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {blogPreviewOpen ? "İçeriği Gizle" : "Tam İçeriği Gör"}
                      </button>
                      {blogPreviewOpen && (
                        <pre className="text-xs text-white/60 whitespace-pre-wrap max-h-60 overflow-y-auto bg-black/20 rounded-lg p-3 mt-2">
                          {generatedBlog.content?.slice(0, 800)}...
                        </pre>
                      )}
                    </div>

                    {/* Apply target selection */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-3">Nereye Uygulansın?</p>

                      {similarPosts.length > 0 && (
                        <div className="space-y-2 mb-3">
                          <p className="text-xs text-white/60">Mevcut benzer sayfalara uygula:</p>
                          {similarPosts.map((post) => (
                            <button key={post.slug} type="button" onClick={() => setApplyTarget(post.slug)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm ${
                                applyTarget === post.slug
                                  ? "bg-[#C9972B] border-[#C9972B] text-[#003B40] font-semibold"
                                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                              }`}>
                              <FileText className="w-4 h-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="truncate block">{post.title}</span>
                                <span className="text-xs opacity-70">{post.category}</span>
                              </div>
                              {applyTarget === post.slug && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}

                      <button type="button" onClick={() => setApplyTarget("new")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm ${
                          applyTarget === "new"
                            ? "bg-[#C9972B] border-[#C9972B] text-[#003B40] font-semibold"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}>
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">Yeni Blog Yazısı Oluştur</span>
                        {applyTarget === "new" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button type="button" onClick={handleApply}
                        disabled={!applyTarget || applying}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9972B] text-[#003B40] font-bold text-sm hover:bg-[#E4B84A] disabled:opacity-50 transition-all">
                        {applying ? <><Loader2 className="w-4 h-4 animate-spin" /> Uygulanıyor...</> : <><CheckCircle2 className="w-4 h-4" /> Uygula</>}
                      </button>
                      <button type="button" onClick={handleGenerateBlog}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-all">
                        <RefreshCw className="w-4 h-4" /> Yeniden Üret
                      </button>
                    </div>
                  </div>
                )}

                {/* Success state */}
                {applyResult?.success && (
                  <div className="mt-4 p-4 bg-emerald-900/40 border border-emerald-600/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-emerald-300 text-sm">
                        {applyResult.isNew ? "Yeni blog yazısı oluşturuldu!" : "Mevcut yazı güncellendi!"}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <a href={`/blog/${applyResult.slug}`} target="_blank" rel="noopener"
                        className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
                      </a>
                      <a href="/admin/blog" className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition-colors">
                        <FileText className="w-3.5 h-3.5" /> Blog Admininde Düzenle
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Raw text */}
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" /> Ham metni göster
            </summary>
            <pre className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap">
              {raw}
            </pre>
          </details>
        </>
      )}

      {/* Empty state */}
      {!loading && sections.length === 0 && !error && (
        <div className="text-center py-16 text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">Analiz başlatmak için bir anahtar kelime girin</p>
          <p className="text-sm mt-1">GPT-4o analiz eder → Blog yazar → Sayfanıza uygular</p>
        </div>
      )}
    </div>
  );
}
