const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    include: { blocks: true, service: true }
  });

  let deletedCount = 0;
  for (const page of pages) {
    if (page.blocks.length === 0 && !page.service) {
      await prisma.page.delete({ where: { id: page.id } });
      deletedCount++;
    } else if ((page.titleInternal === 'Yeni Sayfa' || page.titleInternal === 'İsimsiz Sayfa' || !page.titleInternal) && !page.service) {
       await prisma.page.delete({ where: { id: page.id } });
       deletedCount++;
    }
  }

  console.log("Deleted", deletedCount, "empty/unused orphan pages.");
}

main().catch(console.error).finally(() => process.exit());
