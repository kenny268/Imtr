import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-KE', { ...defaultOptions, ...options }).format(new Date(date));
}

export function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatPhoneNumber(phone) {
  // Format Kenyan phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  return phone;
}

export function generateInitials(name) {
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function getRoleDisplayName(role) {
  const roleMap = {
    ADMIN: 'Administrator',
    LECTURER: 'Lecturer',
    STUDENT: 'Student',
    FINANCE: 'Finance Officer',
    LIBRARIAN: 'Librarian',
    IT: 'IT Support',
  };
  return roleMap[role] || role;
}

export function getRoleColor(role) {
  const colorMap = {
    ADMIN: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    LECTURER: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    STUDENT: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    FINANCE: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    LIBRARIAN: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    IT: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
  };
  return colorMap[role] || 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
}
