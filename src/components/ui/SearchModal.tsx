'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  type: string;
}

export default function SearchModal({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
    
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('open-search', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-search', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsLoading(false);
      }
    }, 400);

  }, [query, locale]);

  if (!mounted || !isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleSelect = (url: string) => {
    handleClose();
    router.push(url);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 pb-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-[#48544f]/10 px-4 py-4">
          <svg className="w-6 h-6 text-[#48544f]/50 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 w-full bg-transparent outline-none text-[18px] text-[#1a1a1a] placeholder:text-[#48544f]/40"
            placeholder={locale === 'tr' ? 'Aradığınız kelimeyi yazın...' : 'Search for something...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <div className="w-5 h-5 rounded-full border-2 border-[#6f263d] border-t-transparent animate-spin ml-3"></div>
          )}
          <button onClick={handleClose} className="ml-3 p-1 rounded-md text-[#48544f]/50 hover:bg-[#48544f]/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto px-2 py-2 pb-4">
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(result.url)}
                className="w-full text-left group flex flex-col p-3 rounded-xl hover:bg-[#48544f]/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#1a1a1a] group-hover:text-[#6f263d] transition-colors line-clamp-1">
                    {result.title}
                  </span>
                  <span className="text-[11px] font-medium tracking-wider uppercase bg-[#e8efe9] text-[#48544f] px-2 py-0.5 rounded-full shrink-0 ml-3">
                    {result.type}
                  </span>
                </div>
                <p className="text-[13px] text-[#48544f]/80 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: result.snippet }} />
              </button>
            ))}
          </div>
        )}
        
        {query.length >= 2 && results.length === 0 && !isLoading && (
          <div className="p-8 text-center text-[#48544f]/60">
            {locale === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
