'use client';

import { useAuth } from '@/app/lib/auth-context';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { setMenu } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        setMenu('dashboard');
      }
    }
  }, [user, loading, router, setMenu]);

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

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to IMTR School Management System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Dashboard content will be loaded here based on your role.
        </p>
      </div>
    </div>
  );
}
