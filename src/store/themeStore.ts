'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  actualTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * 主题存储 Hook
 * 管理应用的主题状态，支持亮色/暗色/跟随系统
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      themeMode: 'system',
      actualTheme: 'light',
      setThemeMode: (mode: ThemeMode) =>
        set(() => {
          if (mode === 'system') {
            const systemDarkMode =
              typeof window !== 'undefined'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                : false;
            return { themeMode: mode, actualTheme: systemDarkMode ? 'dark' : 'light' };
          }
          return { themeMode: mode, actualTheme: mode };
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
