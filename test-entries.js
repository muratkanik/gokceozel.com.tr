const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
async function main() {
  const { data, error } = await supabase.from('content_entries').select('*').limit(2);
  console.log(JSON.stringify(data, null, 2));
}
main().catch(console.error);
