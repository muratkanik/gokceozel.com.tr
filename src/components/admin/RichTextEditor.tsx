'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type ReactQuillType from 'react-quill-new';
import MediaBrowser from './MediaBrowser';

// Import React Quill dynamically to avoid SSR errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);
  const quillRef = useRef<ReactQuillType>(null);

  // Custom toolbar setup
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        // Intercept standard image button
        image: () => {
          setShowMediaBrowser(true);
        }
      }
    }
  }), []);

  const handleMediaSelect = (url: string) => {
    setShowMediaBrowser(false);

    // Get the editor instance and current cursor position
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);

      // Insert the image
      editor.insertEmbed(range.index, 'image', url);
      // Move cursor right after the image
      editor.setSelection(range.index + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* The Editor */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          style={{ height: '400px' }}
        />
      </div>

      {/* Media Browser Modal / Inline View */}
      {showMediaBrowser && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }}>
          <div style={{ 
            background: '#fff', width: '100%', maxWidth: '1000px', maxHeight: '90vh', 
            borderRadius: '12px', overflowY: 'auto', position: 'relative', padding: '20px'
          }}>
            <button 
              onClick={() => setShowMediaBrowser(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#ff4757', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}
            >
              Kapat
            </button>
            <MediaBrowser onSelect={handleMediaSelect} />
          </div>
        </div>
      )}
    </div>
  );
}
