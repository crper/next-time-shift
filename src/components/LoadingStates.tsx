'use client';

import { useStyles } from '@/hooks';
import { memo } from 'react';

interface LoadingCardProps {
  className?: string;
}

// 骨架屏卡片
export const SkeletonCard = memo(({ className }: LoadingCardProps) => {
  const { componentStyles, styles, isDark } = useStyles();

  const SkeletonLine = ({ width = '100%', height = '16px', marginBottom = '8px' }) => (
    <div
      style={{
        width,
        height,
        background: isDark
          ? 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)'
          : 'linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        borderRadius: '4px',
        marginBottom,
      }}
    />
  );

  return (
    <div
      className={className}
      style={styles.merge(componentStyles.cardContainer, {
        background: isDark
          ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        borderRadius: styles.spacing('md'),
        height: '100%',
        minHeight: '400px',
      })}
    >
      {/* 头部骨架 */}
      <div
        style={{
          padding: `${styles.spacing('lg')}px ${styles.spacing('xl')}px ${styles.spacing('md')}px`,
          borderBottom: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        }}
      >
        <SkeletonLine width="60%" height="20px" marginBottom="0" />
      </div>

      {/* 内容骨架 */}
      <div style={{ padding: styles.spacing('lg') }}>
        <SkeletonLine width="40%" height="32px" marginBottom="12px" />
        <SkeletonLine width="80%" height="16px" marginBottom="16px" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: styles.spacing('md'),
            marginBottom: styles.spacing('lg'),
          }}
        >
          <div>
            <SkeletonLine width="50%" height="14px" marginBottom="4px" />
            <SkeletonLine width="70%" height="16px" marginBottom="0" />
          </div>
          <div>
            <SkeletonLine width="50%" height="14px" marginBottom="4px" />
            <SkeletonLine width="70%" height="16px" marginBottom="0" />
          </div>
        </div>

        <SkeletonLine width="100%" height="40px" marginBottom="0" />
      </div>

      <style jsx>{`
        @keyframes skeleton-loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';
