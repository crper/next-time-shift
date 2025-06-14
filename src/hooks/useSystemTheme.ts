'use client';

import { useThemeStore } from '@/store';
import { useEffect } from 'react';

/**
 * 系统主题监听 Hook
 * 当使用系统主题时，监听系统主题变化
 */
export function useSystemTheme() {
  const { themeMode } = useThemeStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 只在系统主题模式下监听系统主题变化
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 初始化和变化时更新主题
    const updateTheme = (e: MediaQueryListEvent) => {
      // 不再调用setThemeMode('system')，而是直接根据媒体查询结果更新实际主题
      // 避免重新触发effect导致无限循环
      console.log('系统主题变化:', e.matches ? 'dark' : 'light');
      // 这里不需要做任何操作，因为actualTheme会在ThemeStore中自动计算
    };

    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeMode]);
}
