'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteBlock(formData: FormData) {
  const id = formData.get('id') as string;
  const pageId = formData.get('pageId') as string;

  if (!id) throw new Error('Block ID required');

  await prisma.contentBlock.delete({ where: { id } });

  revalidatePath('/admin/icerikler');
  if (pageId) revalidatePath(`/admin/icerikler/${pageId}`);
}

export async function updateBlockOrder(updates: { id: string; sortOrder: number }[]) {
  await Promise.all(
    updates.map(({ id, sortOrder }) =>
      prisma.contentBlock.update({ where: { id }, data: { sortOrder } })
    )
  );
}
