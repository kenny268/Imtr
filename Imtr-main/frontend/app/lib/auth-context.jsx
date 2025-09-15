'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials) => api.post('/auth/register', credentials),
    onSuccess: (response) => {
      const userData = response.data.data;
      setUser(userData);
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('Register error:', error);
      toast.error('Registration failed');
    }
  });

  // register funtion
  const register = async (credentials) => {
    try {
      await registerMutation.mutateAsync(credentials);
    } catch (error) {
      throw error;
    }
  };

  // Get current user profile - only fetch if not on auth pages
  const isAuthPage = pathname?.startsWith('/auth/') || pathname?.startsWith('/access-denied') || pathname?.startsWith('/not-found');
  
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/auth/me').then(res => res.data.data),
    retry: false,
    enabled: !isAuthPage
  });

  // Handle user data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else if (userError) {
      setUser(null);
      setLoading(false);
    } else if (isAuthPage) {
      // On auth pages, don't wait for API call
      setLoading(false);
    }
  }, [userData, userError, isAuthPage]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (response) => {
      const userData = response.data.data;
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      // Don't redirect here - let the page handle it
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
      queryClient.clear();
      router.push('/auth/login');
    }
  });

  // Login function
  const login = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Force logout even if API call fails
      setUser(null);
      queryClient.clear();
      router.push('/auth/login');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Create user mutation (admin only)
  const createUserMutation = useMutation({
    mutationFn: (userData) => api.post('/auth/admin/create-user', userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Create user error:', error);
    }
  });

  // Create user function
  const createUser = async (userData) => {
    try {
      await createUserMutation.mutateAsync(userData);
    } catch (error) {
      throw error;
    }
  };

  // Complete profile mutation
  const completeProfileMutation = useMutation({
    mutationFn: (profileData) => api.put('/auth/complete-profile', profileData),
    onSuccess: (response) => {
      const userData = response.data.data;
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      console.error('Complete profile error:', error);
    }
  });

  // Complete profile function
  const completeProfile = async (profileData) => {
    try {
      await completeProfileMutation.mutateAsync(profileData);
    } catch (error) {
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Get user permissions based on role
  const getPermissions = () => {
    if (!user) return [];
    
    const rolePermissions = {
      ADMIN: [
        'users:read', 'users:write', 'users:delete',
        'students:read', 'students:write', 'students:delete',
        'programs:read', 'programs:write', 'programs:delete',
        'courses:read', 'courses:write', 'courses:delete',
        'faculties:read', 'faculties:write', 'faculties:delete',
        'departments:read', 'departments:write', 'departments:delete',
        'finance:read', 'finance:write',
        'reports:read', 'reports:write',
        'system:admin'
      ],
      LECTURER: [
        'students:read',
        'programs:read',
        'courses:read', 'courses:write',
        'faculties:read',
        'departments:read',
        'attendance:read', 'attendance:write',
        'grades:read', 'grades:write',
        'research:read', 'research:write'
      ],
      STUDENT: [
        'profile:read', 'profile:write',
        'courses:read',
        'grades:read',
        'attendance:read',
        'finance:read'
      ],
      FINANCE: [
        'students:read',
        'finance:read', 'finance:write',
        'reports:read'
      ],
      LIBRARIAN: [
        'library:read', 'library:write',
        'students:read'
      ],
      IT: [
        'system:read', 'system:write',
        'users:read', 'users:write'
      ]
    };
    
    return rolePermissions[user.role] || [];
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    const permissions = getPermissions();
    return permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    const userPermissions = getPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Redirect to login if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
    }
  };

  // Redirect to dashboard if already authenticated
  const requireGuest = () => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  };

  const value = {
    user,
    loading: loading || userLoading,
    isAuthenticated,
    register,
    login,
    logout,
    createUser,
    completeProfile,
    hasRole,
    hasAnyRole,
    getPermissions,
    hasPermission,
    hasAnyPermission,
    requireAuth,
    requireGuest,
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    createUserLoading: createUserMutation.isPending,
    completeProfileLoading: completeProfileMutation.isPending
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
