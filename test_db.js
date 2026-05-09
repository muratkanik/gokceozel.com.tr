require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.page.findUnique({
    where: { slug: 'revizyon-rinoplasti' },
    include: { blocks: { include: { translations: true } } }
  });
  console.log(JSON.stringify(p, null, 2));
}
main().catch(e => console.error(e)).finally(() => process.exit());
