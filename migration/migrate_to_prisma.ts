import fs from 'fs';
import path from 'path';

// Fixes common UTF-8 double-encoding issues from Latin-1 dumps
function fixEncoding(text: string): string {
  if (!text) return text;
  return text
    .replace(/Ã¼/g, 'ü').replace(/Ã§/g, 'ç').replace(/ÅŸ/g, 'ş')
    .replace(/ÄŸ/g, 'ğ').replace(/Ä±/g, 'ı').replace(/Ã–/g, 'Ö')
    .replace(/Ã‡/g, 'Ç').replace(/Åž/g, 'Ş').replace(/Ä°/g, 'İ')
    .replace(/Ãœ/g, 'Ü').replace(/Ã¶/g, 'ö');
}

async function main() {
  const archivePath = path.join(__dirname, '../archive/icerik.json');
  
  if (!fs.existsSync(archivePath)) {
    console.warn(`[WARN] ${archivePath} bulunamadı. Lütfen eski veritabanı yedeğini bu yola koyun.`);
    return;
  }

  const rawData = fs.readFileSync(archivePath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    console.error('JSON parse hatası:', e);
    return;
  }

  console.log(`[INFO] Toplam ${data.length || 0} içerik bulundu. Encoding düzeltiliyor...`);

  // Sadece encoding düzeltme (Örnek migration logu)
  let fixedCount = 0;
  const fixedData = data.map((row: any) => {
    fixedCount++;
    return {
      ...row,
      tr_baslik: fixEncoding(row.tr_baslik || ''),
      tr_icerik: fixEncoding(row.tr_icerik || ''),
      en_baslik: fixEncoding(row.en_baslik || ''),
      en_icerik: fixEncoding(row.en_icerik || ''),
    };
  });

  const fixedPath = path.join(__dirname, 'icerik_fixed.json');
  fs.writeFileSync(fixedPath, JSON.stringify(fixedData, null, 2));
  
  console.log(`[SUCCESS] ${fixedCount} kaydın encoding'i düzeltildi ve ${fixedPath} konumuna kaydedildi.`);
  console.log(`[NEXT STEPS] Bu veriler, Prisma "Page", "ContentBlock", "Translation" ve "Service" modellerine migrate edilebilir.`);
}

main().catch(console.error);
