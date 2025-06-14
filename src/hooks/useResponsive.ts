'use client';

import { Grid } from 'antd';

const { useBreakpoint } = Grid;

/**
 * 响应式布局 Hook
 * 提供统一的响应式布局判断和组件尺寸设置
 * @returns 包含响应式属性的对象
 */
export function useResponsive() {
  const screens = useBreakpoint();

  // 是否为移动设备（小于 md 断点）
  const isMobile = !screens.md;

  // 根据设备类型返回对应的组件尺寸
  const componentSize = isMobile ? 'small' : 'middle';

  return {
    screens,
    isMobile,
    componentSize,
    // 各种断点的状态
    isXs: !!screens.xs,
    isSm: !!screens.sm,
    isMd: !!screens.md,
    isLg: !!screens.lg,
    isXl: !!screens.xl,
    isXxl: !!screens.xxl,
  };
}
