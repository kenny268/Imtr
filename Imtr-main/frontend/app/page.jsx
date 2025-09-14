'use client';

import { useAuth } from '@/app/lib/auth-context';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardContent from '@/app/components/dashboard/DashboardContent';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { activeMenu } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Only redirect if not authenticated and not on auth pages
  useEffect(() => {
    if (!loading && !user) {
      const isAuthPage = pathname?.startsWith('/auth/') || pathname?.startsWith('/access-denied') || pathname?.startsWith('/not-found');
      
      if (!isAuthPage && !hasRedirected) {
        setHasRedirected(true);
        router.push('/auth/login');
      }
    } else if (user && hasRedirected) {
      // Reset redirect flag when user logs in
      setHasRedirected(false);
    }
  }, [user, loading, router, pathname, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on auth page, show loading while redirecting
  if (!user) {
    const isAuthPage = pathname?.startsWith('/auth/') || pathname?.startsWith('/access-denied') || pathname?.startsWith('/not-found');
    
    if (!isAuthPage) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
          </div>
        </div>
      );
    }
    
    return null; // Let auth pages render normally
  }

  // Render the main dashboard with role-based content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="p-6">
        <DashboardContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}
