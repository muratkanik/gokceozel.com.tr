const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

function cuid() {
  return crypto.randomBytes(12).toString('hex');
}

const envProd = fs.readFileSync('.env.production', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envProd.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].replace(/"/g, '').replace(/\\n/g, '').trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].replace(/"/g, '').replace(/\\n/g, '').trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('content_entries').select('*');
  if (error) {
    console.error(error);
    return;
  }

  for (const row of data) {
    // 1. Create Page
    const pageId = cuid();
    const { error: pageErr } = await supabase.from('Page').insert({
      id: pageId,
      slug: row.slug || row.id.toString(), // fallback to ID
      titleInternal: row.type || 'unknown_type'
    });
    
    if (pageErr) {
      console.log(`Page already exists or error for slug ${row.slug}:`, pageErr.message);
      continue;
    }

    // 2. Create ContentBlock
    const blockId = cuid();
    await supabase.from('ContentBlock').insert({
      id: blockId,
      pageId: pageId,
      componentType: 'legacy_content'
    });

    // 3. Create Translations
    if (row.translations) {
      for (const [locale, content] of Object.entries(row.translations)) {
        await supabase.from('Translation').insert({
          id: cuid(),
          blockId: blockId,
          locale: locale,
          contentData: JSON.stringify(content)
        });
      }
    }
  }
  console.log("Migration Complete!");
}

run();
