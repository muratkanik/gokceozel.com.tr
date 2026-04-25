'use client';

import { useState } from 'react';
import MediaBrowser from './MediaBrowser';

interface MediaInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MediaInput({ value, onChange, placeholder = 'Görsel veya Video URL', className = '' }: MediaInputProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="shrink-0 px-3 py-2 bg-[#1a1410] text-[#e9e4d8] text-[12px] font-semibold rounded-lg hover:bg-[#b8893c] hover:text-white transition-colors"
      >
        Medya Seç
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-y-auto relative p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
            >
              ✕
            </button>
            <MediaBrowser onSelect={(url) => {
              onChange(url);
              setShowModal(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
