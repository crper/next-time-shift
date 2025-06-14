/**
 * 响应式配置
 * 统一管理断点和响应式相关的配置
 */

// Ant Design 默认断点
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

// 响应式配置
export const RESPONSIVE_CONFIG = {
  // 移动端断点
  mobileBreakpoint: BREAKPOINTS.md,

  // 平板断点
  tabletBreakpoint: BREAKPOINTS.lg,

  // 桌面端断点
  desktopBreakpoint: BREAKPOINTS.xl,

  // 组件尺寸映射
  componentSizes: {
    mobile: 'small' as const,
    tablet: 'middle' as const,
    desktop: 'middle' as const,
  },

  // 间距映射
  spacing: {
    mobile: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    desktop: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },

  // 网格列数配置
  gridColumns: {
    mobile: {
      xs: 1,
      sm: 1,
      md: 2,
    },
    tablet: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    desktop: {
      xs: 3,
      sm: 4,
      md: 6,
    },
  },
} as const;

// 响应式工具函数
export const getResponsiveValue = <T>(
  mobile: T,
  tablet?: T,
  desktop?: T
): { xs: T; sm?: T; md?: T; lg?: T; xl?: T; xxl?: T } => {
  return {
    xs: mobile,
    md: tablet || mobile,
    lg: desktop || tablet || mobile,
  };
};

// 获取组件尺寸
export const getComponentSize = (isMobile: boolean, isTablet?: boolean) => {
  if (isMobile) return RESPONSIVE_CONFIG.componentSizes.mobile;
  if (isTablet) return RESPONSIVE_CONFIG.componentSizes.tablet;
  return RESPONSIVE_CONFIG.componentSizes.desktop;
};

// 获取间距
export const getSpacing = (isMobile: boolean) => {
  return isMobile ? RESPONSIVE_CONFIG.spacing.mobile : RESPONSIVE_CONFIG.spacing.desktop;
};

// 获取网格列数
export const getGridColumns = (isMobile: boolean, isTablet: boolean, itemCount: number): number => {
  let config: { xs: number; sm: number; md: number };

  if (isMobile) {
    config = RESPONSIVE_CONFIG.gridColumns.mobile;
  } else if (isTablet) {
    config = RESPONSIVE_CONFIG.gridColumns.tablet;
  } else {
    config = RESPONSIVE_CONFIG.gridColumns.desktop;
  }

  // 根据项目数量调整列数
  if (itemCount <= 2) return Math.min(config.xs, itemCount);
  if (itemCount <= 4) return Math.min(config.sm, itemCount);
  return Math.min(config.md, itemCount);
};
