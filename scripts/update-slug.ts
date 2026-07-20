import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: 'gke-zel-kimdir' },
  });

  if (page) {
    await prisma.page.update({
      where: { id: page.id },
      data: { slug: 'gokceozel-kimdir' },
    });
    console.log('Successfully updated slug to gokceozel-kimdir');
  } else {
    console.log('Page with slug gke-zel-kimdir not found');
    
    // Let's check if the target already exists
    const target = await prisma.page.findUnique({
      where: { slug: 'gokceozel-kimdir' }
    });
    if (target) {
      console.log('Page with slug gokceozel-kimdir already exists.');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
