'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function savePageContent(pageId: string, data: any) {
  // data contains blocks, seoMeta, and type
  
  if (data.type) {
    await prisma.page.update({
      where: { id: pageId },
      data: { type: data.type }
    });
  }

  if (data.blocks) {
    // Delete missing blocks (optional, if we want to support deletion)
    // For now, we will just upsert and create. Let's do full sync:
    const incomingBlockIds = data.blocks.map((b: any) => b.id).filter((id: string) => !id.startsWith('temp_'));
    
    // Delete blocks that are no longer in the list
    if (pageId !== 'new') {
      await prisma.contentBlock.deleteMany({
        where: {
          pageId,
          id: { notIn: incomingBlockIds }
        }
      });
    }

    // Upsert blocks
    for (const block of data.blocks) {
      let blockId = block.id;
      
      if (blockId.startsWith('temp_') || !blockId) {
        // Create new block
        const createdBlock = await prisma.contentBlock.create({
          data: {
            pageId,
            componentType: block.componentType,
            sortOrder: block.sortOrder,
            isActive: block.isActive !== undefined ? block.isActive : true,
          }
        });
        blockId = createdBlock.id;
      } else {
        // Update existing block
        await prisma.contentBlock.update({
          where: { id: blockId },
          data: {
            sortOrder: block.sortOrder,
            isActive: block.isActive !== undefined ? block.isActive : true,
          }
        });
      }

      // Upsert translations
      if (block.translations) {
        for (const t of block.translations) {
          await prisma.translation.upsert({
            where: {
              blockId_locale: {
                blockId: blockId,
                locale: t.locale
              }
            },
            update: {
              contentData: t.contentData
            },
            create: {
              blockId: blockId,
              locale: t.locale,
              contentData: t.contentData
            }
          });
        }
      }
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
