const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: 'gokce-ozel-kimdir' },
    include: {
      blocks: {
        where: { componentType: 'biography' },
        include: { translations: true }
      }
    }
  });

  const block = page?.blocks[0];
  if (block && block.translations.length > 0) {
    for (const t of block.translations) {
      try {
        const data = JSON.parse(t.contentData);
        if (data.image === '/images/gokcebanner.jpg' || data.image) {
          data.image = '/images/gokceozel.png';
          await prisma.translation.update({
            where: { id: t.id },
            data: { contentData: JSON.stringify(data) }
          });
          console.log(`Updated locale ${t.locale} in DB`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    console.log("No data in DB, changing fallback should be enough.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
