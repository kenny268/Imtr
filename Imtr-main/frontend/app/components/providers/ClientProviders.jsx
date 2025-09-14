'use client';

import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/app/lib/auth-context';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { NavigationProvider } from '@/app/contexts/NavigationContext';
import { UIProvider } from '@/app/contexts/UIContext';
import MainLayout from '@/app/components/layout/MainLayout';

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

export default function ClientProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UIProvider>
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
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
