import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', color: '#333' }}>
      {session && (
        <aside style={{ width: '250px', background: 'var(--color-bg-dark)', padding: '20px', color: '#fff' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 className="gold-gradient-text" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Gökçe Özel Admin</h2>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link href="/admin" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
            <Link href="/" target="_blank" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Siteye Git</Link>
            
            <form action="/auth/signout" method="post" style={{ marginTop: 'auto', paddingTop: '40px' }}>
              <button type="submit" style={{ 
                background: 'transparent', 
                border: '1px solid var(--color-gold)', 
                color: 'var(--color-gold)', 
                padding: '8px 15px', 
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}>
                Çıkış Yap
              </button>
            </form>
          </nav>
        </aside>
      )}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
