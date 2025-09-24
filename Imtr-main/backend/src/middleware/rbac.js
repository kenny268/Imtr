const { logger } = require('../config/logger');

// Define role permissions matrix
const ROLE_PERMISSIONS = {
  ADMIN: [
    // User management
    'users:read', 'users:write', 'users:delete',
    'users:assign_roles', 'users:manage_permissions',
    
    // Student management
    'students:read', 'students:write', 'students:delete',
    'students:admit', 'students:enroll', 'students:clearance',
    
    // Lecturer management
    'lecturers:read', 'lecturers:write', 'lecturers:delete',
    'lecturers:assign_departments', 'lecturers:manage_roles',
    
    // Program management
    'programs:read', 'programs:write', 'programs:delete',
    'programs:assign_coordinators', 'programs:manage_courses',
    
    // Faculty and Department management
    'faculties:read', 'faculties:write', 'faculties:delete',
    'departments:read', 'departments:write', 'departments:delete',
    
    // Course management
    'courses:read', 'courses:write', 'courses:delete',
    'courses:assign_lecturers', 'courses:manage_sections',
    
    // Assessment management
    'assessments:read', 'assessments:write', 'assessments:delete',
    'assessments:grade', 'assessments:publish', 'assessments:statistics',
    
    // Academic management
    'academics:read', 'academics:write', 'academics:delete',
    'academics:attendance', 'academics:grades', 'academics:exams',
    
    // Finance management
    'finance:read', 'finance:write', 'finance:delete',
    'finance:invoices', 'finance:payments', 'finance:reports',
    
    // Library management
    'library:read', 'library:write', 'library:delete',
    'library:loans', 'library:fines',
    
    // Research management
    'research:read', 'research:write', 'research:delete',
    'research:projects', 'research:members',
    
    // System administration
    'system:read', 'system:write', 'system:delete',
    'system:config', 'system:backup', 'system:logs',
    
    // Reports and analytics
    'reports:read', 'reports:write', 'reports:export',
    'reports:compliance', 'reports:analytics'
  ],
  
  LECTURER: [
    // Student information (read-only)
    'students:read',
    
    // Lecturer information (own profile)
    'lecturers:read',
    
    // Program information (read-only)
    'programs:read',
    
    // Faculty and Department information (read-only)
    'faculties:read', 'departments:read',
    
    // Course management (own courses)
    'courses:read', 'courses:write_own',
    
    // Assessment management (own assessments)
    'assessments:read', 'assessments:write_own', 'assessments:grade_own',
    'assessments:publish_own', 'assessments:statistics_own',
    
    // Academic management (own sections)
    'academics:read', 'academics:write_own',
    'academics:attendance_own', 'academics:grades_own',
    
    // Research management
    'research:read', 'research:write_own',
    'research:projects_own', 'research:members_own',
    
    // Reports (own data)
    'reports:read_own'
  ],
  
  STUDENT: [
    // Own profile
    'profile:read', 'profile:write_own',
    
    // Course information (read-only)
    'courses:read_own',
    
    // Academic information (own data)
    'academics:read_own', 'academics:attendance_own',
    'academics:grades_own',
    
    // Finance (own data)
    'finance:read_own', 'finance:payments_own',
    
    // Library (own loans)
    'library:read_own', 'library:loans_own',
    
    // Research (if member)
    'research:read_own'
  ],
  
  FINANCE: [
    // Student information (read-only)
    'students:read',
    
    // Finance management
    'finance:read', 'finance:write',
    'finance:invoices', 'finance:payments',
    'finance:reports',
    
    // Reports (financial)
    'reports:read', 'reports:export_financial'
  ],
  
  LIBRARIAN: [
    // Student information (read-only)
    'students:read',
    
    // Library management
    'library:read', 'library:write',
    'library:loans', 'library:fines',
    'library:catalog',
    
    // Reports (library)
    'reports:read_library'
  ],
  
  IT: [
    // User management (limited)
    'users:read', 'users:write_limited',
    
    // System administration
    'system:read', 'system:write',
    'system:config', 'system:logs',
    
    // Technical reports
    'reports:read_technical'
  ]
};

// Define resource ownership rules
const RESOURCE_OWNERSHIP = {
  'courses:write_own': (user, resource) => {
    return resource.lecturer_id === user.id;
  },
  'academics:attendance_own': (user, resource) => {
    return resource.lecturer_id === user.id;
  },
  'academics:grades_own': (user, resource) => {
    return resource.lecturer_id === user.id;
  },
  'research:projects_own': (user, resource) => {
    return resource.lead_lecturer_id === user.id;
  },
  'profile:write_own': (user, resource) => {
    return resource.user_id === user.id;
  },
  'students:read_own': (user, resource) => {
    return resource.user_id === user.id;
  },
  'finance:read_own': (user, resource) => {
    return resource.student_id === user.id;
  },
  'library:loans_own': (user, resource) => {
    return resource.borrower_user_id === user.id;
  }
};

/**
 * Check if user has specific permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @param {Object} resource - Resource being accessed (optional)
 * @returns {boolean} - True if user has permission
 */
const hasPermission = (user, permission, resource = null) => {
  if (!user || !user.role) {
    return false;
  }

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // Check for exact permission
  if (userPermissions.includes(permission)) {
    return true;
  }

  // Check for ownership-based permissions
  const ownershipKey = `${permission.split(':')[0]}:${permission.split(':')[1]}_own`;
  if (userPermissions.includes(ownershipKey) && resource) {
    const ownershipCheck = RESOURCE_OWNERSHIP[ownershipKey];
    if (ownershipCheck) {
      return ownershipCheck(user, resource);
    }
  }

  return false;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object
 * @param {Array} permissions - Array of permissions to check
 * @param {Object} resource - Resource being accessed (optional)
 * @returns {boolean} - True if user has any permission
 */
const hasAnyPermission = (user, permissions, resource = null) => {
  return permissions.some(permission => hasPermission(user, permission, resource));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object
 * @param {Array} permissions - Array of permissions to check
 * @param {Object} resource - Resource being accessed (optional)
 * @returns {boolean} - True if user has all permissions
 */
const hasAllPermissions = (user, permissions, resource = null) => {
  return permissions.every(permission => hasPermission(user, permission, resource));
};

/**
 * Get all permissions for a user role
 * @param {string} role - User role
 * @returns {Array} - Array of permissions
 */
const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has role
 */
const hasRole = (user, role) => {
  return user && user.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles to check
 * @returns {boolean} - True if user has any role
 */
const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};

/**
 * RBAC middleware factory
 * @param {string|Array} permission - Permission(s) required
 * @param {Object} options - Options for the middleware
 * @returns {Function} - Express middleware function
 */
const requirePermission = (permission, options = {}) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const permissions = Array.isArray(permission) ? permission : [permission];
      const resource = options.resource ? req[options.resource] : null;
      const requireAll = options.requireAll || false;

      let hasAccess = false;
      if (requireAll) {
        hasAccess = hasAllPermissions(req.user, permissions, resource);
      } else {
        hasAccess = hasAnyPermission(req.user, permissions, resource);
      }

      if (!hasAccess) {
        logger.warn('Access denied', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredPermissions: permissions,
          resource: resource ? resource.id : null,
          url: req.url,
          method: req.method
        });

        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: permissions,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      logger.error('RBAC middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

/**
 * Role-based middleware factory
 * @param {string|Array} role - Role(s) required
 * @returns {Function} - Express middleware function
 */
const requireRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const roles = Array.isArray(role) ? role : [role];
      const hasAccess = hasAnyRole(req.user, roles);

      if (!hasAccess) {
        logger.warn('Role access denied', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: roles,
          url: req.url,
          method: req.method
        });

        return res.status(403).json({
          success: false,
          message: 'Insufficient role privileges',
          required: roles,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Role check failed'
      });
    }
  };
};

/**
 * Resource ownership middleware
 * @param {string} resourceParam - Parameter name containing resource ID
 * @param {Function} getResource - Function to get resource by ID
 * @param {string} ownershipField - Field that indicates ownership
 * @returns {Function} - Express middleware function
 */
const requireOwnership = (resourceParam, getResource, ownershipField = 'user_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const resourceId = req.params[resourceParam];
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID required'
        });
      }

      const resource = await getResource(resourceId);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Admin can access any resource
      if (req.user.role === 'ADMIN') {
        req.resource = resource;
        return next();
      }

      // Check ownership
      if (resource[ownershipField] !== req.user.id) {
        logger.warn('Ownership access denied', {
          userId: req.user.id,
          userRole: req.user.role,
          resourceId: resourceId,
          resourceOwner: resource[ownershipField],
          url: req.url,
          method: req.method
        });

        return res.status(403).json({
          success: false,
          message: 'Access denied to this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      logger.error('Ownership middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Ownership check failed'
      });
    }
  };
};

module.exports = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  hasRole,
  hasAnyRole,
  requirePermission,
  requireRole,
  requireOwnership,
  ROLE_PERMISSIONS,
  RESOURCE_OWNERSHIP
};
