const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    include: { blocks: true, service: true }
  });

  let deletedCount = 0;
  for (const page of pages) {
    if (page.blocks.length === 0) {
      if (page.service) {
        await prisma.service.delete({ where: { id: page.service.id } });
      }
      await prisma.page.delete({ where: { id: page.id } });
      deletedCount++;
    }
  }

  console.log("Deleted", deletedCount, "empty pages and their associated services.");
}

main().catch(console.error).finally(() => process.exit());
