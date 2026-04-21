'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleMaintenance(formData: FormData) {
  const currentSetting = await prisma.setting.findUnique({
    where: { key: 'maintenance_mode' }
  });

  let currentStatus = false;
  if (currentSetting?.value) {
    try {
      currentStatus = JSON.parse(currentSetting.value).isActive === true;
    } catch (e) {}
  }
  
  const newStatus = !currentStatus;

  await prisma.setting.upsert({
    where: { key: 'maintenance_mode' },
    update: { value: JSON.stringify({ isActive: newStatus }) },
    create: { key: 'maintenance_mode', value: JSON.stringify({ isActive: newStatus }) }
  });
    
  revalidatePath('/', 'layout');
  revalidatePath('/admin');
}
