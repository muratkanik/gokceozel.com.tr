export { generateMetadata } from '../../[locale]/hizmetler/[slug]/page';
import HizmetDetailPage from '../../[locale]/hizmetler/[slug]/page';

export const revalidate = 60;

export default async function DefaultLocaleServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HizmetDetailPage
      params={Promise.resolve({
        slug,
        locale: 'tr',
      })}
    />
  );
}
