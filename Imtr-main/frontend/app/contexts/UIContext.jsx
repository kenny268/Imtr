'use client';

import { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  // Toast functions
  const showToast = useCallback((message, type = 'default') => {
    switch (type) {
      case 'success':
        return toast.success(message, {
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
      case 'error':
        return toast.error(message, {
          duration: 5000,
          style: {
            background: '#dc2626',
            color: '#fff',
          },
        });
      case 'warning':
        return toast(message, {
          duration: 4000,
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
      case 'info':
        return toast(message, {
          duration: 4000,
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        });
      default:
        return toast(message, {
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        });
    }
  }, []);

  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast]);
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

  // Loading state management
  const showLoading = useCallback((message = 'Loading...') => {
    return toast.loading(message, {
      duration: Infinity,
    });
  }, []);

  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Form validation helpers
  const showValidationErrors = useCallback((errors) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        showError(error.message || error);
      });
    } else if (typeof errors === 'object' && errors.errors) {
      errors.errors.forEach(error => {
        showError(error.message || error);
      });
    } else {
      showError(errors.message || 'Validation failed');
    }
  }, [showError]);

  // API error handling
  const handleApiError = useCallback((error) => {
    console.error('API Error:', error);
    
    if (error.response?.data?.errors) {
      showValidationErrors(error.response.data);
    } else if (error.response?.data?.message) {
      showError(error.response.data.message);
    } else if (error.message) {
      showError(error.message);
    } else {
      showError('An unexpected error occurred');
    }
  }, [showError, showValidationErrors]);

  const value = {
    // Toast functions
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
    dismissAll,
    
    // Validation helpers
    showValidationErrors,
    
    // Error handling
    handleApiError,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
