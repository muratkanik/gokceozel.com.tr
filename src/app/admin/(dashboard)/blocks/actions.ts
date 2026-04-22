'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBlock(formData: FormData) {
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
  revalidatePath('/', 'layout');
}

export async function deleteBlock(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  await prisma.contentBlock.delete({ where: { id } });
  
  revalidatePath('/admin/blocks');
  revalidatePath('/', 'layout');
}

export async function selectPageAction(formData: FormData) {
  const pId = formData.get('selectedPageId');
  if (pId) {
    redirect(`/admin/blocks?pageId=${pId}`);
  }
}
