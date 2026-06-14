import type React from 'react';
import './global.css';
import { Sidebar } from '@/components/sidebar';
import { Providers } from './providers';

export const metadata = {
  title: 'Merchan Dashboard',
  description: 'Panel de control para promotores de ventas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-screen">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
