const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function migrate() {
  console.log('Connecting to local MySQL...');
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'gokceozel_local',
    port: 3306
  });

  const [rows] = await connection.execute('SELECT * FROM icerik WHERE durum="1" AND kategori IN (42, 43, 30)'); 
  // 42, 43 are typically services, 30 might be blog/about
  console.log(`Found ${rows.length} rows to migrate.`);

  for (const row of rows) {
    // 42,43 = services, others might be blog
    let type = 'service';
    if (row.kategori != 42 && row.kategori != 43) {
       type = 'blog';
    }

    const translations = {
      tr: { title: row.tr_baslik, content: row.tr_icerik, seo_title: row.tr_seo_title, seo_description: row.tr_seo_description },
      en: { title: row.en_baslik, content: row.en_icerik, seo_title: row.en_seo_title, seo_description: row.en_seo_description },
      ru: { title: row.ru_baslik, content: row.ru_icerik, seo_title: row.ru_seo_title, seo_description: row.ru_seo_description },
      ar: { title: row.ar_baslik, content: row.ar_icerik, seo_title: row.ar_seo_title, seo_description: row.ar_seo_description },
      de: { title: row.de_baslik, content: row.de_icerik, seo_title: row.de_seo_title, seo_description: row.de_seo_description },
      fr: { title: row.fr_baslik, content: row.fr_icerik, seo_title: row.fr_seo_title, seo_description: row.fr_seo_description }
    };

    const slug = row.tr_slug || `migrated-${row.id}`;
    
    // Check if exists
    const { data: existing } = await supabase.from('content_entries').select('id').eq('slug', slug).single();
    
    if (!existing) {
        const { error } = await supabase.from('content_entries').insert({
          type,
          slug,
          translations,
          visible_locales: ['tr', 'en', 'ru', 'ar', 'de', 'fr', 'cin'] // By default visible to all. The admin can change this later.
        });
        if (error) console.error('Error inserting', slug, error);
        else console.log('Inserted', slug);
    } else {
        console.log('Skipping existing', slug);
    }
  }

  await connection.end();
  console.log('Migration complete.');
}

migrate().catch(console.error);
