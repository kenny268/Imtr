
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Get server-side session
 * @returns {Promise<Object|null>} - User session or null
 */
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return null;
    }

    // Verify token with API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        'Cookie': `accessToken=${accessToken}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

/**
 * Require authentication on server-side
 * @param {string} redirectTo - Redirect path if not authenticated
 * @returns {Promise<Object>} - User session
 */
export async function requireAuth(redirectTo = '/login') {
  const session = await getServerSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Require specific role on server-side
 * @param {string|Array} roles - Required role(s)
 * @param {string} redirectTo - Redirect path if not authorized
 * @returns {Promise<Object>} - User session
 */
export async function requireRole(roles, redirectTo = '/unauthorized') {
  const session = await requireAuth();
  
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!requiredRoles.includes(session.role)) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string|Array} roles - Role(s) to check
 * @returns {boolean} - True if user has role
 */
export function hasRole(user, roles) {
  if (!user || !user.role) {
    return false;
  }
  
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(user.role);
}

/**
 * Check if user has specific permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export function hasPermission(user, permission) {
  if (!user || !user.role) {
    return false;
  }
  
  const rolePermissions = {
    ADMIN: [
      'users:read', 'users:write', 'users:delete',
      'students:read', 'students:write', 'students:delete',
      'courses:read', 'courses:write', 'courses:delete',
      'finance:read', 'finance:write', 'finance:delete',
      'reports:read', 'reports:write', 'reports:export'
    ],
    LECTURER: [
      'students:read',
      'courses:read', 'courses:write_own',
      'academics:read', 'academics:write_own',
      'research:read', 'research:write_own'
    ],
    STUDENT: [
      'profile:read', 'profile:write_own',
      'courses:read_own',
      'academics:read_own',
      'finance:read_own'
    ],
    FINANCE: [
      'students:read',
      'finance:read', 'finance:write',
      'reports:read', 'reports:export_financial'
    ],
    LIBRARIAN: [
      'students:read',
      'library:read', 'library:write',
      'reports:read_library'
    ],
    IT: [
      'users:read', 'users:write_limited',
      'system:read', 'system:write',
      'reports:read_technical'
    ]
  };
  
  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
}

/**
 * Get user permissions
 * @param {Object} user - User object
 * @returns {Array} - Array of permissions
 */
export function getUserPermissions(user) {
  if (!user || !user.role) {
    return [];
  }
  
  const rolePermissions = {
    ADMIN: [
      'users:read', 'users:write', 'users:delete',
      'students:read', 'students:write', 'students:delete',
      'courses:read', 'courses:write', 'courses:delete',
      'finance:read', 'finance:write', 'finance:delete',
      'reports:read', 'reports:write', 'reports:export'
    ],
    LECTURER: [
      'students:read',
      'courses:read', 'courses:write_own',
      'academics:read', 'academics:write_own',
      'research:read', 'research:write_own'
    ],
    STUDENT: [
      'profile:read', 'profile:write_own',
      'courses:read_own',
      'academics:read_own',
      'finance:read_own'
    ],
    FINANCE: [
      'students:read',
      'finance:read', 'finance:write',
      'reports:read', 'reports:export_financial'
    ],
    LIBRARIAN: [
      'students:read',
      'library:read', 'library:write',
      'reports:read_library'
    ],
    IT: [
      'users:read', 'users:write_limited',
      'system:read', 'system:write',
      'reports:read_technical'
    ]
  };
  
  return rolePermissions[user.role] || [];
}
