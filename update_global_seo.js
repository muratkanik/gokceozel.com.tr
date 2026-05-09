const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: 'seo_meta_title' },
    update: { value: "Prof. Dr. Gökçe Özel | Ankara KBB, Rinoplasti ve Yüz Estetiği" },
    create: { key: 'seo_meta_title', value: "Prof. Dr. Gökçe Özel | Ankara KBB, Rinoplasti ve Yüz Estetiği" }
  });

  await prisma.setting.upsert({
    where: { key: 'seo_meta_description' },
    update: { value: "Ankara ve Antalya'da KBB Uzmanı Prof. Dr. Gökçe Özel kliniği. Burun estetiği (rinoplasti), endolift lazer, blefaroplasti ve ameliyatsız yüz estetiği tedavileri." },
    create: { key: 'seo_meta_description', value: "Ankara ve Antalya'da KBB Uzmanı Prof. Dr. Gökçe Özel kliniği. Burun estetiği (rinoplasti), endolift lazer, blefaroplasti ve ameliyatsız yüz estetiği tedavileri." }
  });
  
  await prisma.setting.upsert({
    where: { key: 'seo_meta_keywords' },
    update: { value: "Burun estetiği Ankara, Rinoplasti, KBB Uzmanı, Endolift Lazer, Göz kapağı estetiği, Blefaroplasti, Yüz estetiği, Prof. Dr. Gökçe Özel" },
    create: { key: 'seo_meta_keywords', value: "Burun estetiği Ankara, Rinoplasti, KBB Uzmanı, Endolift Lazer, Göz kapağı estetiği, Blefaroplasti, Yüz estetiği, Prof. Dr. Gökçe Özel" }
  });

  console.log("Global SEO Settings updated.");
}

main().catch(console.error).finally(() => process.exit());
