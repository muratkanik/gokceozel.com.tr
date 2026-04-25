'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import DeleteForm from '@/components/admin/DeleteForm';
import { deleteBlock, updateBlockOrder } from '@/app/admin/(dashboard)/blocks/actions';

interface BlockManagerClientProps {
  pageId: string;
  initialBlocks: any[];
}

function SortableBlockItem({ block, pageId, getPreviewText }: { block: any, pageId: string, getPreviewText: (b: any) => React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="block-card"
    >
      <div 
        {...attributes} 
        {...listeners} 
        style={{ cursor: 'grab', padding: '15px', color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>
      
      <div style={{ flex: 1, padding: '15px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {block.componentType}
          </span>
          <span style={{ background: '#f5f5f5', color: '#666', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
            Sıra: {block.sortOrder}
          </span>
          <span style={{ background: '#e3f2fd', color: '#0288d1', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
            {block._count?.translations || 0} Çeviri
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#444', lineHeight: 1.5 }}>
          {getPreviewText(block)}
        </div>
      </div>

      <div style={{ padding: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Link 
          href={`/admin/blocks/${block.id}`} 
          style={{ background: '#111', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }}
        >
          Düzenle
        </Link>
        <DeleteForm action={deleteBlock} confirmMessage="Bu bloğu silmek istediğinize emin misiniz?">
          <input type="hidden" name="id" value={block.id} />
          <input type="hidden" name="pageId" value={pageId} />
          {/* Sadece icon kullanalım silme işlemi için */}
          <button type="submit" style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }} title="Bloğu Sil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </DeleteForm>
      </div>
    </div>
  );
}

export default function BlockManagerClient({ pageId, initialBlocks }: BlockManagerClientProps) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Sort logic here ensures visual consistency
    setBlocks(initialBlocks.sort((a, b) => a.sortOrder - b.sortOrder));
  }, [initialBlocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag to initiate to avoid clicking issues
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sortOrders immediately in UI
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          sortOrder: index * 10, // Multiply by 10 to leave gaps if needed
        }));

        // Send update to server
        saveOrder(updatedItems);

        return updatedItems;
      });
    }
  };

  const saveOrder = async (updatedItems: any[]) => {
    setIsSaving(true);
    try {
      const updates = updatedItems.map(item => ({
        id: item.id,
        sortOrder: item.sortOrder
      }));
      await updateBlockOrder(updates);
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Sıralama kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Same preview text logic from page.tsx to keep it consistent
  const getPreviewText = (block: any) => {
    const data = block.translations?.[0]?.contentData;
    if (!data || data === '{}' || data === '[]') return <span style={{ color: '#999', fontStyle: 'italic' }}>İçerik Yok</span>;
    
    try {
      if (block.componentType === 'hero') {
        const parsed = JSON.parse(data);
        return <span style={{ color: '#555' }}>{Array.isArray(parsed) ? `${parsed.length} Slayt` : 'JSON Formatı'}</span>;
      }
      if (block.componentType === 'biography') {
        const parsed = JSON.parse(data);
        return <span style={{ color: '#555' }}>{parsed.title || 'Biyografi Modülü'}</span>;
      }
    } catch (e) {
      // ignore
    }
    
    const stripped = data.replace(/<[^>]+>/g, '').trim();
    if (!stripped) return <span style={{ color: '#999', fontStyle: 'italic' }}>Medya/Boş</span>;
    return <span style={{ color: '#555' }}>{stripped.substring(0, 100)}...</span>;
  };

  return (
    <>
      <style>{`
        .block-card {
          display: flex;
          background: #fff;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .block-card:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border-color: #ddd;
        }
        .saving-indicator {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 14px;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1000;
        }
      `}</style>
      
      <div className="saving-indicator" style={{ opacity: isSaving ? 1 : 0 }}>
        Sıralama kaydediliyor...
      </div>

      {blocks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '12px', color: '#666' }}>
          Bu sayfada henüz blok bulunmuyor. Yeni bir blok ekleyerek başlayın.
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={blocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {blocks.map((block) => (
                <SortableBlockItem key={block.id} block={block} pageId={pageId} getPreviewText={getPreviewText} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
}
