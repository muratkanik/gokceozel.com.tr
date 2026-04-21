const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const dataRaw = fs.readFileSync('archive/icerik.json', 'utf8');
  const icerikList = JSON.parse(dataRaw);
  
  const entries = [];
  
  for (const item of icerikList) {
    let type = 'page';
    let typePrefix = '';
    const kat = parseInt(item.kategori.replace(/[^0-9]/g, '')); // " (43" -> 43
    
    if (kat === 52) {
      type = 'blog';
      typePrefix = 'blog/';
    } else if (kat === 42 || kat === 43) {
      type = 'service';
      typePrefix = 'hizmetler/';
    } else if (kat === 2) {
      type = 'page';
      typePrefix = 'kurumsal/';
    } else {
      type = 'page';
    }
    
    // We try to match image from yonetim/dosya. But we only have icerik_belge table for that, which we didn't export.
    // For now we will just use a placeholder or empty image, the user can upload them in the dashboard later,
    // or if the user wants exact mapping, we need icerik_belge.
    // Let's just create the entries.
    
    // Some slugs are empty or null
    let slug = item.tr_slug || `page-${item.id}`;
    
    // Create translations object
    const translations = {
      tr: {
        title: item.tr_baslik || '',
        slug: item.tr_slug || '',
        content: item.tr_icerik || item.tr_detay || '',
        seo_title: item.tr_seo_title || '',
        seo_description: item.tr_seo_description || ''
      },
      en: {
        title: item.en_baslik || '',
        slug: item.en_slug || '',
        content: item.en_icerik || item.en_detay || '',
        seo_title: item.en_seo_title || '',
        seo_description: item.en_seo_description || ''
      }
    };
    
    // Some basic cleanup
    if (translations.tr.content.length < 5 && translations.en.content.length < 5) {
      continue; // Skip empty content
    }
    if (!translations.tr.title) {
        translations.tr.title = slug.replace(/-/g, ' ').toUpperCase();
    }
    
    entries.push({
      type: type,
      slug: slug,
      translations: translations,
      visible_locales: ['tr', 'en']
    });
  }

  console.log(`Prepared ${entries.length} entries for migration.`);
  
  // Clean existing (optional, but let's just insert)
  const { error: delError } = await supabase.from('content_entries').delete().in('type', ['blog', 'service']);
  if (delError) console.error("Error clearing old entries", delError);

  for (const entry of entries) {
    const { data, error } = await supabase.from('content_entries').insert({
      slug: entry.slug,
      type: entry.type,
      translations: entry.translations,
      visible_locales: entry.visible_locales
    });
    
    if (error) {
      console.error(`Error inserting slug ${entry.slug}:`, error.message);
    } else {
      console.log(`Inserted ${entry.slug} (${entry.type})`);
    }
  }
  
  console.log("Migration complete!");
}

migrate().catch(console.error);
