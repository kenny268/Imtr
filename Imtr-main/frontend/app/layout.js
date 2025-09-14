import { Inter } from 'next/font/google';
import ClientProviders from '@/app/components/providers/ClientProviders';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IMTR School Management System',
  description: 'Institute for Meteorological Training and Research - School Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50 dark:bg-dark-900">
      <body className={`${inter.className} h-full`} suppressHydrationWarning={true}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
