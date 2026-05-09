const fs = require('fs');

const f = '/Users/mkanik/Documents/GitHub/gokceozel.com.tr/src/app/[locale]/iletisim/ClientPage.tsx';
let content = fs.readFileSync(f, 'utf8');

// Change export default function IletisimPage to ClientPage
content = content.replace(/export default function IletisimPage\(\{ params \}: PageProps\) \{/, `export default function ClientPage({ params, settings }: PageProps & { settings: Record<string, string> }) {`);

// Replace contact item values
content = content.replace(/<ContactItem icon="📍" label=\{t.address\} value=\{t.addressVal\} \/>/, `<ContactItem icon="📍" label={t.address} value={settings.contact_address || t.addressVal} />`);

content = content.replace(/<ContactItem\s*icon="📞" label=\{t.phone\}\s*value="\+90 534 209 69 35"\s*href="tel:\+905342096935"\s*\/>/, `<ContactItem\n                icon="📞" label={t.phone}\n                value={settings.contact_phone || "+90 534 209 69 35"}\n                href={\`tel:\${(settings.contact_phone || "+90 534 209 69 35").replace(/\\s+/g, '')}\`}\n              />`);

content = content.replace(/<ContactItem\s*icon="✉️" label=\{t.email\}\s*value="info@gokceozel.com.tr"\s*href="mailto:info@gokceozel.com.tr"\s*\/>/, `<ContactItem\n                icon="✉️" label={t.email}\n                value={settings.contact_email || "info@gokceozel.com.tr"}\n                href={\`mailto:\${settings.contact_email || "info@gokceozel.com.tr"}\`}\n              />`);

fs.writeFileSync(f, content);
console.log("ClientPage updated.");
