const { createClient } = require('@supabase/supabase-js');

// Parse .env.production directly
const fs = require('fs');
const envProd = fs.readFileSync('.env.production', 'utf-8');

let supabaseUrl = '';
let supabaseKey = '';

envProd.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].replace(/"/g, '').replace(/\\n/g, '').trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].replace(/"/g, '').replace(/\\n/g, '').trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('content_entries').select('id, slug, type, translations');
  if (error) {
    console.error(error);
    return;
  }
  
  let fixedCount = 0;
  
  for (const row of data) {
    if (row.translations && row.translations.tr) {
      let tr = row.translations.tr;
      let originalStr = JSON.stringify(tr);
      
      let newStr = originalStr
        .replace(/Ä±/g, 'ı')
        .replace(/Ä°/g, 'İ')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã‡/g, 'Ç')
        .replace(/ÅŸ/g, 'ş')
        .replace(/Åž/g, 'Ş')
        .replace(/Ã¶/g, 'ö')
        .replace(/Ã–/g, 'Ö')
        .replace(/Ã¼/g, 'ü')
        .replace(/Ãœ/g, 'Ü')
        .replace(/ÄŸ/g, 'ğ')
        .replace(/Äž/g, 'Ğ')
        .replace(/Ã¢/g, 'â')
        .replace(/Ã»/g, 'û')
        .replace(/Ã®/g, 'î')
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€\x9D/g, '"')
        .replace(/â€“/g, '-');

      if (newStr !== originalStr) {
        console.log(`Fixing row: ${row.slug}`);
        const { error: updateError } = await supabase.from('content_entries')
          .update({ translations: { ...row.translations, tr: JSON.parse(newStr) } })
          .eq('id', row.id);
          
        if (updateError) {
          console.error(`Error updating ${row.slug}:`, updateError);
        } else {
          fixedCount++;
        }
      }
    }
  }
  console.log(`Fixed ${fixedCount} rows.`);
}

run();
