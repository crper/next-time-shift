'use client';

import { useSystemTheme, useThemeStore } from '@/store';
import { ConfigProvider, Grid, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ReactNode, useEffect } from 'react';

const { useBreakpoint } = Grid;

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题提供者组件
 * 为应用提供全局主题配置
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { actualTheme } = useThemeStore();

  // 使用antd的断点hook
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const componentSize = isMobile ? 'small' : 'middle';

  // 监听系统主题变化
  useSystemTheme();

  // 设置文档根元素和 body 的主题 class
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevTheme = actualTheme === 'dark' ? 'light' : 'dark';

    // 更新 HTML 根元素类名
    root.classList.remove(prevTheme);
    root.classList.add(actualTheme);

    // 更新 body 类名
    body.classList.remove(prevTheme);
    body.classList.add(actualTheme);

    // 设置背景色
    body.style.backgroundColor = actualTheme === 'dark' ? '#141414' : '#f0f2f5';
  }, [actualTheme]);

  // Ant Design 主题配置
  const antThemeConfig = {
    algorithm: actualTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
      // 确保字体样式正确
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      // 优化间距和尺寸
      paddingXS: isMobile ? 8 : 12,
      paddingSM: isMobile ? 12 : 16,
      padding: isMobile ? 16 : 24,
      paddingLG: isMobile ? 20 : 32,
      // 优化字体大小
      fontSize: isMobile ? 14 : 16,
      fontSizeSM: isMobile ? 12 : 14,
      fontSizeLG: isMobile ? 16 : 18,
      // 确保行高正确
      lineHeight: 1.5715,
      lineHeightSM: 1.66,
      lineHeightLG: 1.5,
    },
    components: {
      Layout: {
        headerBg: actualTheme === 'dark' ? '#1f1f1f' : '#fff',
        bodyBg: actualTheme === 'dark' ? '#141414' : '#f0f2f5',
        colorBgContainer: actualTheme === 'dark' ? '#1f1f1f' : '#fff',
        headerPadding: isMobile ? '0 12px' : '0 24px',
      },
      Card: {
        colorBorderSecondary: actualTheme === 'dark' ? '#303030' : '#f0f0f0',
        paddingLG: isMobile ? 16 : 24,
        borderRadiusLG: 8,
        // 确保卡片背景色正确
        colorBgContainer: actualTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        // 确保边框样式正确
        lineWidth: 1,
        lineType: 'solid',
        colorBorder: actualTheme === 'dark' ? '#303030' : '#d9d9d9',
      },
      Button: {
        borderRadius: 6,
        paddingInline: isMobile ? 12 : 16,
      },
      Input: {
        borderRadius: 6,
        paddingInline: isMobile ? 8 : 12,
      },
      Select: {
        borderRadius: 6,
      },
      DatePicker: {
        borderRadius: 6,
      },
      Segmented: {
        itemSelectedBg: actualTheme === 'dark' ? '#177ddc' : '#e6f4ff',
        borderRadius: 6,
      },
      FloatButton: {
        borderRadiusLG: 8,
      },
      Empty: {
        colorTextDescription: actualTheme === 'dark' ? '#8c8c8c' : '#999999',
      },
    },
  };

  return (
    <ConfigProvider
      theme={antThemeConfig}
      locale={zhCN}
      // 统一设置组件尺寸，根据屏幕断点自动适应
      componentSize={componentSize}
    >
      {children}
    </ConfigProvider>
  );
}
