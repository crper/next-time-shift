'use client';

import { ThemeMode, useThemeStore } from '@/store';
import { DesktopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Grid, Segmented } from 'antd';

const { useBreakpoint } = Grid;

/**
 * 主题切换组件
 * 响应式设计：PC端正常大小，移动端紧凑型
 */
export default function ThemeSwitcher() {
  const { themeMode, setThemeMode } = useThemeStore();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 主题选项配置
  const options = [
    {
      value: 'light',
      icon: <SunOutlined />,
    },
    {
      value: 'dark',
      icon: <MoonOutlined />,
    },
    {
      value: 'system',
      icon: <DesktopOutlined />,
    },
  ];

  return (
    <Segmented
      value={themeMode}
      options={options}
      onChange={value => setThemeMode(value as ThemeMode)}
      size={isMobile ? 'small' : 'middle'}
      shape="round"
    />
  );
}
