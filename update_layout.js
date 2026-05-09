const fs = require('fs');

const f = '/Users/mkanik/Documents/GitHub/gokceozel.com.tr/src/app/[locale]/layout.tsx';
let content = fs.readFileSync(f, 'utf8');

if (!content.includes('const settingsMap = settings.reduce')) {
  // Add prisma call
  content = content.replace(
    /export default async function LocaleLayout\(\{/,
    `export default async function LocaleLayout({`
  );
  
  content = content.replace(
    /const tContact = await getTranslations\('Contact'\);/,
    `const tContact = await getTranslations('Contact');
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['contact_address', 'contact_phone', 'contact_email'] } }
  });
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);`
  );

  // Replace tContact('address') and phone and email
  content = content.replace(
    /<li>\{tContact\('address'\)\}<\/li>/,
    `<li>{settingsMap.contact_address || tContact('address')}</li>`
  );
  content = content.replace(
    /<li><a href="tel:\+905342096935" className="hover:text-white transition-colors">\{tContact\('phone'\)\}<\/a><\/li>/,
    `<li><a href={\`tel:\${(settingsMap.contact_phone || "+905342096935").replace(/\\s+/g, '')}\`} className="hover:text-white transition-colors">{settingsMap.contact_phone || tContact('phone')}</a></li>`
  );
  content = content.replace(
    /<li><a href="mailto:info@gokceozel\.com\.tr" className="hover:text-white transition-colors">\{tContact\('email'\)\}<\/a><\/li>/,
    `<li><a href={\`mailto:\${settingsMap.contact_email || "info@gokceozel.com.tr"}\`} className="hover:text-white transition-colors">{settingsMap.contact_email || tContact('email')}</a></li>`
  );

  fs.writeFileSync(f, content);
  console.log("Layout updated.");
}
