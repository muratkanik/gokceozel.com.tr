'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBlock(formData: FormData) {
  try {
    const targetPageId = formData.get('pageId') as string;
    const componentType = formData.get('componentType') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

    if (!targetPageId || !componentType) return;

    await prisma.contentBlock.create({
      data: {
        pageId: targetPageId,
        componentType,
        sortOrder
      }
    });

    revalidatePath('/admin/blocks');
    revalidatePath('/[locale]', 'layout');
  } catch (e: any) {
    if (e.message && e.message.includes('NEXT_REDIRECT')) throw e;
    console.error('createBlock error:', e);
    redirect(`/admin/blocks?pageId=${formData.get('pageId')}&error=${encodeURIComponent(e.message || 'Bilinmeyen Hata')}`);
  }
}

export async function deleteBlock(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) return;

    await prisma.contentBlock.delete({ where: { id } });
    
    revalidatePath('/admin/blocks');
    revalidatePath('/[locale]', 'layout');
  } catch (e: any) {
    if (e.message && e.message.includes('NEXT_REDIRECT')) throw e;
    console.error('deleteBlock error:', e);
    const pageId = formData.get('pageId') as string;
    redirect(`/admin/blocks${pageId ? `?pageId=${pageId}&` : '?'}error=${encodeURIComponent(e.message || 'Bilinmeyen Hata')}`);
  }
}

export async function selectPageAction(formData: FormData) {
  const pId = formData.get('selectedPageId');
  if (pId) {
    redirect(`/admin/blocks?pageId=${pId}`);
  }
}

export async function updateBlockOrder(updates: { id: string, sortOrder: number }[]) {
  // Execute a transaction to update all sort orders at once
  await prisma.$transaction(
    updates.map(update => 
      prisma.contentBlock.update({
        where: { id: update.id },
        data: { sortOrder: update.sortOrder }
      })
    )
  );

  revalidatePath('/admin/blocks');
  revalidatePath('/[locale]', 'layout');
}
