const { createClient } = require('@supabase/supabase-js');
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
        .replace(/KaÅx/g, 'Kaş')
        .replace(/EstetiÄxi/g, 'Estetiği')
        .replace(/Äx/g, 'ğ')
        .replace(/Åx/g, 'ş');

      // More generic replacements just in case
      newStr = newStr
        .replace(/KaÅ\w/g, 'Kaş')
        .replace(/EstetiÄ\w/g, 'Estetiğ')
        .replace(/Esteti\w\wi/g, function(match) {
            if(match.includes('Estetiği')) return match;
            return 'Estetiği';
        });

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
