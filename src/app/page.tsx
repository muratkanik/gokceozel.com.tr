export default function UnderConstruction() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '20px',
      background: 'var(--color-bg-dark)'
    }}>
      <h1 className="gold-gradient-text" style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>
        Yapım Aşamasında
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
        Prof. Dr. Gökçe Özel kliniği web sitesi çok yakında yeni ve modern yüzüyle sizlerle olacak. Anlayışınız için teşekkür ederiz.
      </p>
    </main>
  );
}
