const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const iconv = require('iconv-lite');
require('dotenv').config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to decode win1252 string parsed from utf-8 file
function fixEncoding(str) {
  if (!str || str === 'NULL') return '';
  return iconv.decode(Buffer.from(str, 'binary'), 'win1252');
}

// Helper to parse MySQL INSERT VALUES
function parseMySqlValues(valuesStr) {
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let inString = false;
  let escape = false;

  const fullStr = valuesStr + ",";
  
  for (let i = 0; i < fullStr.length; i++) {
    const char = fullStr[i];
    
    if (escape) {
      if (char === 'n') currentVal += '\n';
      else if (char === 'r') currentVal += '\r';
      else currentVal += char;
      escape = false;
      continue;
    }
    
    if (char === '\\') {
      escape = true;
      continue;
    }
    
    if (char === "'" && !inString) {
      inString = true;
      continue;
    }
    
    if (char === "'" && inString) {
      inString = false;
      continue;
    }
    
    if (!inString) {
      if (char === ',') {
        currentRow.push(currentVal);
        currentVal = "";
        continue;
      }
      if (char === ')' && fullStr.slice(i, i+3) === '),(') {
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = "";
        i += 2; // skip `,(`
        continue;
      }
      if (char === ')' && i === fullStr.length - 2) {
        currentRow.push(currentVal);
        rows.push(currentRow);
        break;
      }
      if (char === '(' && currentRow.length === 0 && currentVal === "") {
        continue;
      }
    }
    
    currentVal += char;
  }
  return rows;
}

async function migrate() {
  console.log("Reading SQL dump...");
  const sqlContent = fs.readFileSync('archive/db_backups/gokceozel_local_20260420.sql', 'utf8');
  
  const icerikMatch = sqlContent.match(/INSERT INTO `icerik` VALUES \((.*?)\);/s);
  const belgeMatch = sqlContent.match(/INSERT INTO `icerik_belge` VALUES \((.*?)\);/s);
  
  if (!icerikMatch || !belgeMatch) {
    console.error("Could not find INSERT statements");
    return;
  }

  const icerikRowsRaw = parseMySqlValues(icerikMatch[1]);
  const belgeRowsRaw = parseMySqlValues(belgeMatch[1]);
  
  console.log(`Parsed ${icerikRowsRaw.length} icerik rows, ${belgeRowsRaw.length} belge rows.`);

  // Mapping belgeler (images) by eskayit
  // icerik_belge structure: id (0), kayit_id (1), belge_turu (2), belge_adi (3), belge (4)
  const imagesByEskayit = {};
  for (const row of belgeRowsRaw) {
    const kayit_id = row[1];
    const belge = row[4];
    const durum = parseInt(row[8], 10);
    // Only use active images (durum === 1 or 7, etc) but actually we'll just take the first one we find
    if (kayit_id && belge && !imagesByEskayit[kayit_id] && durum !== -1) {
      imagesByEskayit[kayit_id] = belge;
    }
  }

  // icerik columns structure
  // 'id'(0), 'kategori'(1), 'tarih'(2), 'tutar'(3), 'tr_baslik'(4), 'tr_slug'(5), 'tr_goster'(6), 
  // 'tr_seo_title'(7), 'tr_seo_description'(8), 'tr_icerik'(9), 'tr_detay'(10), 'en_baslik'(11), 
  // 'en_slug'(12), 'en_goster'(13), 'en_seo_title'(14), 'en_seo_description'(15), 'en_icerik'(16), 
  // 'en_detay'(17), ... 'eskayit'(53)
  
  const entries = [];
  
  for (const row of icerikRowsRaw) {
    if (row.length < 54) continue;
    
    const id = row[0];
    const kategori = parseInt(row[1], 10);
    const eskayit = row[53];
    
    let type = 'page';
    if (kategori === 52) type = 'blog';
    else if (kategori === 42 || kategori === 43) type = 'service';
    else if (kategori === 2) type = 'page'; // kurumsal
    
    let slug = fixEncoding(row[5]) || `page-${id}`;
    let imageFile = imagesByEskayit[eskayit] || null;
    let imageUrl = imageFile ? `/uploads/${imageFile}` : null;
    
    const tr_baslik = fixEncoding(row[4]);
    const tr_icerik = fixEncoding(row[9]) || fixEncoding(row[10]);
    
    const en_baslik = fixEncoding(row[11]);
    const en_icerik = fixEncoding(row[16]) || fixEncoding(row[17]);
    
    // Removing length filter to allow all content to be migrated
    // if (tr_icerik.length < 5 && en_icerik.length < 5) continue;
    
    const translations = {
      tr: {
        title: tr_baslik || slug.replace(/-/g, ' ').toUpperCase(),
        slug: slug,
        content: tr_icerik,
        seo_title: fixEncoding(row[7]),
        seo_description: fixEncoding(row[8])
      },
      en: {
        title: en_baslik || '',
        slug: fixEncoding(row[12]) || slug,
        content: en_icerik,
        seo_title: fixEncoding(row[14]),
        seo_description: fixEncoding(row[15])
      }
    };
    
    entries.push({
      slug,
      type,
      image_url: imageUrl,
      translations,
      visible_locales: ['tr', 'en']
    });
  }
  
  console.log(`Prepared ${entries.length} corrected entries for migration.`);
  
  // Clear old entries
  const { error: delError } = await supabase.from('content_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) console.error("Error clearing old entries:", delError);
  
  let inserted = 0;
  for (const entry of entries) {
    const { data, error } = await supabase.from('content_entries').insert(entry);
    if (error) {
      console.error(`Error inserting ${entry.slug}:`, error.message);
    } else {
      inserted++;
    }
  }
  
  console.log(`Successfully migrated ${inserted} entries.`);
}

migrate().catch(console.error);
