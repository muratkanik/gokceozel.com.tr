const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL.trim(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim());

async function fix() {
  const { data, error } = await supabase.from('content_entries').select('*');
  if (error) {
    console.error(error);
    return;
  }

  for (const entry of data) {
    if (!entry.translations || !entry.translations.tr) continue;
    
    let title = entry.translations.tr.title || '';
    let content = entry.translations.tr.content || '';
    
    // Fix common encoding issues
    const replacements = [
      { bad: 'Ã\u0013zel', good: 'Özel' },
      { bad: 'Ã!ene', good: 'Çene' },
      { bad: 'Ã§', good: 'ç' },
      { bad: 'Ã¶', good: 'ö' },
      { bad: 'Ã¼', good: 'ü' },
      { bad: 'ÄŸ', good: 'ğ' },
      { bad: 'ÅŸ', good: 'ş' },
      { bad: 'Ä±', good: 'ı' },
      { bad: 'Ä°', good: 'İ' },
      { bad: 'Ã–', good: 'Ö' },
      { bad: 'Ã‡', good: 'Ç' },
      { bad: 'Ãœ', good: 'Ü' },
      { bad: 'Ã\u0093zel', good: 'Özel' },
      { bad: 'Ã\x13zel', good: 'Özel' }
    ];

    let updatedTitle = title;
    let updatedContent = content;

    for (const {bad, good} of replacements) {
      updatedTitle = updatedTitle.split(bad).join(good);
      updatedContent = updatedContent.split(bad).join(good);
    }

    if (updatedTitle !== title || updatedContent !== content) {
      console.log('Fixing:', entry.slug);
      console.log('Old title:', title);
      console.log('New title:', updatedTitle);
      
      const newTranslations = {
        ...entry.translations,
        tr: {
          ...entry.translations.tr,
          title: updatedTitle,
          content: updatedContent
        }
      };

      await supabase.from('content_entries').update({ translations: newTranslations }).eq('id', entry.id);
    }
  }
  console.log('Done');
}

fix();
