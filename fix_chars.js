const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('content_entries').select('id, slug, type, translations').in('type', ['service', 'hero_section', 'page']);
  if (error) {
    console.error(error);
    return;
  }
  
  let needsUpdate = false;
  
  for (const row of data) {
    if (row.translations && row.translations.tr) {
      let tr = row.translations.tr;
      let originalStr = JSON.stringify(tr);
      
      // Basic UTF-8 artifact fixing
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
        .replace(/â€“/g, '-')
        .replace(/Â/g, '');

      if (newStr !== originalStr) {
        console.log(`Fixing row: ${row.slug}`);
        const { error: updateError } = await supabase.from('content_entries').update({ translations: { ...row.translations, tr: JSON.parse(newStr) } }).eq('id', row.id);
        if (updateError) console.error(`Error updating ${row.slug}:`, updateError);
        else needsUpdate = true;
      }
    }
  }
  console.log(needsUpdate ? "Fixed broken characters in DB." : "No broken characters found in DB.");
}
run();
