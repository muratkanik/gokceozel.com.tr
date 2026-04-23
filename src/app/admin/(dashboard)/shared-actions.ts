'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function savePageContent(pageId: string, data: any) {
  // data contains blocks and seoMeta
  
  if (data.blocks) {
    // Upsert blocks
    for (const block of data.blocks) {
      await prisma.contentBlock.upsert({
        where: { id: block.id || 'new' },
        create: {
          pageId,
          componentType: block.componentType,
          sortOrder: block.sortOrder,
          isActive: block.isActive,
          translations: {
            create: block.translations.map((t: any) => ({
              locale: t.locale,
              contentData: t.contentData
            }))
          }
        },
        update: {
          sortOrder: block.sortOrder,
          isActive: block.isActive,
          // Handle translations update...
        }
      });
    }
  }

  revalidatePath('/', 'layout');
}

// Legacy Methods - To be removed after full migration
export async function saveContentEntryTranslations(id: string, translations: Record<string, any>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('content_entries')
    .update({ translations })
    .eq('id', id);

  if (error) {
    console.error('Error saving content entry:', error);
    throw new Error('Failed to save translations');
  }

  revalidatePath('/', 'layout');
}

export async function ensureContentEntryExists(slug: string, type: string, defaultTranslations: Record<string, any>) {
  const supabase = await createClient();

  let { data } = await supabase
    .from('content_entries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) {
    const { data: newEntry, error } = await supabase
      .from('content_entries')
      .insert([{ 
        slug, 
        type, 
        translations: defaultTranslations,
        visible_locales: ['tr', 'en', 'ar', 'ru'] 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating content entry:', error);
      throw new Error('Failed to create content entry');
    }
    data = newEntry;
  }

  return data;
}
