const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: 'contact_address' },
    update: { value: 'Mustafa Kemal Bulvarı 2133. sokak No:4 Hane : 3 - ROYALE OFFICE, 06510 Çankaya/Ankara' },
    create: { key: 'contact_address', value: 'Mustafa Kemal Bulvarı 2133. sokak No:4 Hane : 3 - ROYALE OFFICE, 06510 Çankaya/Ankara' }
  });

  await prisma.setting.upsert({
    where: { key: 'contact_phone' },
    update: { value: '+90 534 209 69 35' },
    create: { key: 'contact_phone', value: '+90 534 209 69 35' }
  });
  
  await prisma.setting.upsert({
    where: { key: 'contact_email' },
    update: { value: 'info@gokceozel.com.tr' },
    create: { key: 'contact_email', value: 'info@gokceozel.com.tr' }
  });

  console.log("Settings added.");
}

main().catch(console.error).finally(() => process.exit());
