'use client';

import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import LevelUpModal from '../components/LevelUpModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const syncMockUser = useAuthStore((state) => state.syncMockUser);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Sync user state and configure root document elements for dark/light mode
  useEffect(() => {
    // Sync default guest user for immediate, flawless presentation
    syncMockUser();

    // Check system preference if localStorage theme not set, otherwise set dark default
    const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      setTheme('dark');
    }
  }, [syncMockUser, setTheme]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20 pb-16 md:pb-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <LevelUpModal />
    </div>
  );
}
