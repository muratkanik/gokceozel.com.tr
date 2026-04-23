'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

  // Revalidate frontend and admin paths
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
