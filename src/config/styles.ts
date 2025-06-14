/**
 * 统一样式配置
 * 提供一致的样式值和响应式样式工具
 */

import { CSSProperties } from 'react';

// 间距配置
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// 响应式间距配置
export const RESPONSIVE_SPACING = {
  mobile: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
  },
  desktop: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
} as const;

// 字体大小配置
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
} as const;

// 响应式字体大小配置
export const RESPONSIVE_FONT_SIZES = {
  mobile: {
    xs: 10,
    sm: 11,
    md: 12,
    lg: 14,
    xl: 16,
    xxl: 18,
    xxxl: 20,
  },
  desktop: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
} as const;

// 边框圆角配置
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: '50%',
} as const;

// 阴影配置
export const BOX_SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xxl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// 常用样式组合
export const COMMON_STYLES = {
  // 居中布局
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,

  // 垂直居中
  centerVertical: {
    display: 'flex',
    alignItems: 'center',
  } as CSSProperties,

  // 水平居中
  centerHorizontal: {
    display: 'flex',
    justifyContent: 'center',
  } as CSSProperties,

  // 卡片样式
  card: {
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: BOX_SHADOWS.md,
    backgroundColor: 'var(--color-bg-container)',
    border: '1px solid var(--color-border)',
  } as CSSProperties,

  // 输入框样式
  input: {
    borderRadius: BORDER_RADIUS.md,
    border: '1px solid var(--color-border)',
  } as CSSProperties,

  // 按钮样式
  button: {
    borderRadius: BORDER_RADIUS.md,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  } as CSSProperties,

  // 文本截断
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as CSSProperties,

  // 多行文本截断
  textEllipsisMultiline: (lines: number) =>
    ({
      display: '-webkit-box',
      WebkitLineClamp: lines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }) as CSSProperties,

  // 滚动条样式
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'var(--color-bg-base)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--color-border)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'var(--color-primary)',
    },
  } as CSSProperties,
} as const;

// 响应式样式工具函数
export const getResponsiveSpacing = (size: keyof typeof SPACING, isMobile: boolean) => {
  return isMobile ? RESPONSIVE_SPACING.mobile[size] : RESPONSIVE_SPACING.desktop[size];
};

export const getResponsiveFontSize = (size: keyof typeof FONT_SIZES, isMobile: boolean) => {
  return isMobile ? RESPONSIVE_FONT_SIZES.mobile[size] : RESPONSIVE_FONT_SIZES.desktop[size];
};

// 创建响应式样式对象
export const createResponsiveStyle = (
  mobileStyle: CSSProperties,
  desktopStyle: CSSProperties,
  isMobile: boolean
): CSSProperties => {
  return isMobile ? mobileStyle : desktopStyle;
};

// 合并样式工具函数
export const mergeStyles = (...styles: (CSSProperties | undefined)[]): CSSProperties => {
  return styles.reduce<CSSProperties>((acc, style) => {
    if (style) {
      return { ...acc, ...style };
    }
    return acc;
  }, {});
};

// 条件样式工具函数
export const conditionalStyle = (
  condition: boolean,
  trueStyle: CSSProperties,
  falseStyle?: CSSProperties
): CSSProperties => {
  return condition ? trueStyle : falseStyle || {};
};

// 主题相关样式
export const getThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? 'var(--color-bg-container)' : 'var(--color-bg-container)',
  color: isDark ? '#ffffff' : '#000000',
  borderColor: isDark ? 'var(--color-border)' : 'var(--color-border)',
});

// 动画配置
export const ANIMATIONS = {
  duration: {
    fast: '0.1s',
    normal: '0.2s',
    slow: '0.3s',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// 创建过渡样式
export const createTransition = (
  property: string | string[],
  duration: keyof typeof ANIMATIONS.duration = 'normal',
  easing: keyof typeof ANIMATIONS.easing = 'easeInOut'
): CSSProperties => {
  const properties = Array.isArray(property) ? property : [property];
  return {
    transition: properties
      .map(prop => `${prop} ${ANIMATIONS.duration[duration]} ${ANIMATIONS.easing[easing]}`)
      .join(', '),
  };
};
