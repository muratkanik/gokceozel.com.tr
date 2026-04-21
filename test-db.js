const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:GokceOzelDB2026!+@db.dqofmirqzyoumhzlndbv.supabase.co:5432/postgres'
});
async function test() {
  await client.connect();
  const res = await client.query('SELECT id, email, confirmed_at FROM auth.users');
  console.log(res.rows);
  await client.end();
}
test().catch(console.error);
