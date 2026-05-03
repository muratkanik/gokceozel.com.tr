import prisma from '@/lib/prisma';
import IceriklerClient from './IceriklerClient';

export const dynamic = 'force-dynamic';

export default async function ContentManagementPage() {
  const pages = await prisma.page.findMany({
    select: {
      id: true,
      slug: true,
      titleInternal: true,
      type: true,
      createdAt: true,
    },
    orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
  });

  const serialized = pages.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return <IceriklerClient pages={serialized} />;
}
