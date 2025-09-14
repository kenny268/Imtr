'use client';

import { useAuth } from '@/app/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children, requireAuth = true, redirectTo = '/auth/login' }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname?.startsWith('/auth/') || 
                      pathname?.startsWith('/access-denied') || 
                      pathname?.startsWith('/not-found');

    if (requireAuth && !user && !isAuthPage && !hasRedirected) {
      setHasRedirected(true);
      setTimeout(() => router.push(redirectTo), 50);
    } else if (!requireAuth && user && !hasRedirected) {
      // If user is authenticated but on a guest-only page (like login)
      setHasRedirected(true);
      setTimeout(() => router.push('/'), 50);
    }
  }, [user, loading, pathname, requireAuth, redirectTo, hasRedirected, router]);

  // Reset redirect flag when conditions change
  useEffect(() => {
    if (requireAuth && user && hasRedirected) {
      setHasRedirected(false);
    } else if (!requireAuth && !user && hasRedirected) {
      setHasRedirected(false);
    }
  }, [user, requireAuth, hasRedirected]);

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

  // Show loading while redirecting
  if (requireAuth && !user && !pathname?.startsWith('/auth/')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
