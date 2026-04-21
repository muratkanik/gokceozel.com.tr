const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('settings').select('*').limit(1);
  if (error) console.log("settings table error", error.message);
  else console.log("settings:", data);
  
  const { data: cData, error: cError } = await supabase.from('content_entries').select('*').eq('slug', 'iletisim').limit(1);
  if (cError) console.log("content_entries error", cError.message);
  else console.log("content_entries iletisim:", JSON.stringify(cData, null, 2));
}
run();
