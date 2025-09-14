'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/app/lib/auth-context';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { NavigationProvider } from '@/app/contexts/NavigationContext';
import MainLayout from '@/app/components/layout/MainLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata will be handled by Next.js head

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>IMTR School Management System</title>
        <meta name="description" content="Institute for Meteorological Training and Research - School Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-dark-900`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <NavigationProvider>
                <MainLayout>
                  {children}
                </MainLayout>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#dc2626',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </NavigationProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
