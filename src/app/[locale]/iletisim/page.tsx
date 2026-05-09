import prisma from '@/lib/prisma';
import ClientPage from './ClientPage';

export const revalidate = 60; // 1 minute revalidation

export default async function IletisimPage({ params }: { params: Promise<{ locale: string }> }) {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['contact_address', 'contact_phone', 'contact_email', 'contact_lat', 'contact_lng']
      }
    }
  });

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return <ClientPage params={params} settings={settingsMap} />;
}
