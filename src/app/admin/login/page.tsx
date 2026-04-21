'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        setIsLoading(false);
      } else {
        // Success
        router.push('/admin');
        router.refresh(); // Refresh the router to apply layout changes
      }
    } catch (err) {
      setErrorMsg('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            disabled={isLoading}
            style={{
              background: isLoading ? '#666' : 'var(--color-gold)',
              color: '#000',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

          {errorMsg && (
            <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
