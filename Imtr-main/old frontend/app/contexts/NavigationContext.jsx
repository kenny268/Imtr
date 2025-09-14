'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load navigation state from localStorage
    const savedSidebarOpen = localStorage.getItem('imtr-sidebar-open') === 'true';
    const savedActiveMenu = localStorage.getItem('imtr-active-menu') || 'dashboard';
    const savedSidebarCollapsed = localStorage.getItem('imtr-sidebar-collapsed') === 'true';

    setSidebarOpen(savedSidebarOpen);
    setActiveMenu(savedActiveMenu);
    setSidebarCollapsed(savedSidebarCollapsed);
  }, []);

  useEffect(() => {
    // Save navigation state to localStorage
    localStorage.setItem('imtr-sidebar-open', sidebarOpen.toString());
    localStorage.setItem('imtr-active-menu', activeMenu);
    localStorage.setItem('imtr-sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarOpen, activeMenu, sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const setMenu = (menu) => {
    setActiveMenu(menu);
  };

  const value = {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    activeMenu,
    setMenu,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebarCollapse,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
