import { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Gökçe Özel Admin Dashboard',
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
