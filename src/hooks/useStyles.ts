import {
  COMMON_STYLES,
  createResponsiveStyle,
  createTransition,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getThemeStyle,
  mergeStyles,
} from '@/config/styles';
import { useResponsive } from '@/hooks';
import { useThemeStore } from '@/store';
import { CSSProperties, useMemo } from 'react';

/**
 * 样式 Hook
 * 提供统一的样式管理和响应式样式
 */
export function useStyles() {
  const responsive = useResponsive();
  const { isMobile } = responsive;
  const isTablet = responsive.screens?.md && !responsive.screens?.lg;
  const { actualTheme } = useThemeStore();
  const isDark = actualTheme === 'dark';

  // 基础样式工具
  const styles = useMemo(
    () => ({
      // 获取响应式间距
      spacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') =>
        getResponsiveSpacing(size, isMobile),

      // 获取响应式字体大小
      fontSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') =>
        getResponsiveFontSize(size, isMobile),

      // 创建响应式样式
      responsive: (mobileStyle: CSSProperties, desktopStyle: CSSProperties) =>
        createResponsiveStyle(mobileStyle, desktopStyle, isMobile),

      // 合并样式
      merge: mergeStyles,

      // 创建过渡效果
      transition: createTransition,

      // 获取主题样式
      theme: getThemeStyle(isDark),

      // 常用样式
      common: COMMON_STYLES,

      // 条件样式
      when: (condition: boolean, style: CSSProperties) => (condition ? style : {}),

      // 设备特定样式
      mobile: (style: CSSProperties) => (isMobile ? style : {}),
      tablet: (style: CSSProperties) => (isTablet ? style : {}),
      desktop: (style: CSSProperties) => (!isMobile && !isTablet ? style : {}),

      // 主题特定样式
      dark: (style: CSSProperties) => (isDark ? style : {}),
      light: (style: CSSProperties) => (!isDark ? style : {}),
    }),
    [isMobile, isTablet, isDark]
  );

  // 预定义的组件样式
  const componentStyles = useMemo(
    () => ({
      // 页面容器样式
      pageContainer: mergeStyles(
        {
          padding: styles.spacing(isMobile ? 'sm' : 'lg'),
          minHeight: '100vh',
        },
        styles.theme
      ),

      // 卡片容器样式
      cardContainer: mergeStyles(
        COMMON_STYLES.card,
        {
          padding: styles.spacing(isMobile ? 'md' : 'lg'),
          margin: styles.spacing('sm'),
        },
        styles.transition(['box-shadow', 'transform'])
      ),

      // 输入组件样式
      inputContainer: mergeStyles(
        COMMON_STYLES.input,
        {
          padding: styles.spacing(isMobile ? 'sm' : 'md'),
          fontSize: styles.fontSize('md'),
        },
        styles.transition(['border-color', 'box-shadow'])
      ),

      // 按钮样式
      buttonContainer: mergeStyles(
        COMMON_STYLES.button,
        {
          padding: `${styles.spacing('sm')}px ${styles.spacing(isMobile ? 'md' : 'lg')}px`,
          fontSize: styles.fontSize('md'),
        },
        styles.transition(['background-color', 'transform'])
      ),

      // 标题样式
      titleContainer: {
        fontSize: styles.fontSize(isMobile ? 'xl' : 'xxl'),
        fontWeight: 600,
        marginBottom: styles.spacing('lg'),
        color: isDark ? '#ffffff' : '#000000',
      },

      // 副标题样式
      subtitleContainer: {
        fontSize: styles.fontSize(isMobile ? 'md' : 'lg'),
        fontWeight: 500,
        marginBottom: styles.spacing('md'),
        color: isDark ? '#d9d9d9' : '#666666',
      },

      // 文本样式
      textContainer: {
        fontSize: styles.fontSize('md'),
        lineHeight: 1.6,
        color: isDark ? '#d9d9d9' : '#333333',
      },

      // 分隔线样式
      dividerContainer: {
        margin: `${styles.spacing('lg')}px 0`,
        borderColor: isDark ? '#303030' : '#f0f0f0',
      },

      // 列表项样式
      listItemContainer: mergeStyles(
        {
          padding: styles.spacing(isMobile ? 'sm' : 'md'),
          borderRadius: 6,
          marginBottom: styles.spacing('xs'),
        },
        styles.transition(['background-color'])
      ),

      // 网格容器样式
      gridContainer: {
        display: 'grid',
        gap: styles.spacing(isMobile ? 'md' : 'lg'),
        gridTemplateColumns: isMobile
          ? '1fr'
          : isTablet
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(300px, 1fr))',
      },

      // 弹性布局容器
      flexContainer: {
        display: 'flex',
        gap: styles.spacing('md'),
        flexWrap: 'wrap' as const,
        alignItems: 'center',
      },

      // 垂直弹性布局
      flexColumnContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: styles.spacing('md'),
      },

      // 滚动容器样式
      scrollContainer: mergeStyles(
        {
          maxHeight: isMobile ? '60vh' : '70vh',
          overflowY: 'auto' as const,
          padding: styles.spacing('sm'),
        },
        COMMON_STYLES.scrollbar
      ),

      // 加载状态样式
      loadingContainer: mergeStyles(COMMON_STYLES.center, {
        padding: styles.spacing('xl'),
        minHeight: '200px',
      }),

      // 错误状态样式
      errorContainer: mergeStyles(COMMON_STYLES.center, {
        padding: styles.spacing('xl'),
        minHeight: '200px',
        flexDirection: 'column' as const,
        gap: styles.spacing('md'),
      }),

      // 空状态样式
      emptyContainer: mergeStyles(COMMON_STYLES.center, {
        padding: styles.spacing('xxl'),
        minHeight: '300px',
        flexDirection: 'column' as const,
        gap: styles.spacing('lg'),
      }),
    }),
    [styles, isMobile, isTablet, isDark]
  );

  return {
    styles,
    componentStyles,
    isMobile,
    isTablet,
    isDark,
  };
}
