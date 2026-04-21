import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/admin/login?message=Giriş başarısız. Bilgileri kontrol edin.');
    }

    return redirect('/admin');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--color-bg-dark)',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    }}>
      <div style={{
        background: 'rgba(25,25,25,0.9)',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid var(--color-gold-muted)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 className="gold-gradient-text" style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>Gökçe Özel</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Yönetim Paneli Girişi</p>
        </div>

        <form action={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '8px', fontSize: '0.9rem' }}>E-posta</label>
            <input 
              name="email" 
              type="email" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #444',
                background: '#111',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '8px', fontSize: '0.9rem' }}>Şifre</label>
            <input 
              name="password" 
              type="password" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #444',
                background: '#111',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'linear-gradient(45deg, var(--color-gold), var(--color-gold-muted))',
              color: 'var(--color-bg-dark)',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'opacity 0.2s',
            }}
          >
            Giriş Yap
          </button>

          {searchParams?.message && (
            <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
