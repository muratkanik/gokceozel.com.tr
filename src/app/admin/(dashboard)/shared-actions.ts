'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(text: string) {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, match => trMap[match])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function savePageContent(pageId: string, data: any) {
  let finalPageId = pageId;
  let newSlug = '';

  if (pageId === 'new') {
    newSlug = generateSlug(data.titleInternal || 'yeni-sayfa');
    let count = 1;
    let originalSlug = newSlug;
    while (await prisma.page.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${originalSlug}-${count++}`;
    }
    
    const newPage = await prisma.page.create({
      data: {
        slug: newSlug,
        titleInternal: data.titleInternal || 'Yeni Sayfa',
        type: data.type || 'PAGE'
      }
    });
    finalPageId = newPage.id;
  } else {
    const updateData: any = {};
    if (data.type) updateData.type = data.type;
    if (data.titleInternal) updateData.titleInternal = data.titleInternal;
    
    if (Object.keys(updateData).length > 0) {
      await prisma.page.update({
        where: { id: finalPageId },
        data: updateData
      });
    }
  }

  if (data.blocks) {
    // Delete missing blocks (optional, if we want to support deletion)
    // For now, we will just upsert and create. Let's do full sync:
    const incomingBlockIds = data.blocks.map((b: any) => b.id).filter((id: string) => !id.startsWith('temp_'));
    
    // Delete blocks that are no longer in the list
    if (finalPageId !== 'new') {
      await prisma.contentBlock.deleteMany({
        where: {
          pageId: finalPageId,
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
            pageId: finalPageId,
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

    if (data.seoMeta && finalPageId !== 'new') {
    for (const locale of Object.keys(data.seoMeta)) {
      const meta = data.seoMeta[locale];
      if (meta.metaTitle !== undefined || meta.metaDescription !== undefined) {
        await prisma.seoMeta.upsert({
          where: {
            pageId_locale: {
              pageId: finalPageId,
              locale
            }
          },
          update: {
            metaTitle: meta.metaTitle || '',
            metaDescription: meta.metaDescription || '',
          },
          create: {
            pageId: finalPageId,
            locale,
            metaTitle: meta.metaTitle || '',
            metaDescription: meta.metaDescription || '',
          }
        });
      }
    }
  }

  revalidatePath('/', 'layout');
  
  return { id: finalPageId, slug: newSlug };
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

    if (data.seoMeta && finalPageId !== 'new') {
    for (const locale of Object.keys(data.seoMeta)) {
      const meta = data.seoMeta[locale];
      if (meta.metaTitle !== undefined || meta.metaDescription !== undefined) {
        await prisma.seoMeta.upsert({
          where: {
            pageId_locale: {
              pageId: finalPageId,
              locale
            }
          },
          update: {
            metaTitle: meta.metaTitle || '',
            metaDescription: meta.metaDescription || '',
          },
          create: {
            pageId: finalPageId,
            locale,
            metaTitle: meta.metaTitle || '',
            metaDescription: meta.metaDescription || '',
          }
        });
      }
    }
  }

  revalidatePath('/', 'layout');
  
  return { id: finalPageId, slug: newSlug };
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
