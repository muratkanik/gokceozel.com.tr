import { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Gökçe Özel Admin Dashboard',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
