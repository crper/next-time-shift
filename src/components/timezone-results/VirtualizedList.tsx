'use client';

import TimezoneCard from '@/components/timezone-card';
import { useResponsive } from '@/hooks/useResponsive';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, Suspense, useMemo, useRef } from 'react';
import { SkeletonCard } from '../LoadingStates';
import GridLayout from './GridLayout';

interface VirtualizedListProps {
  timestamp: number;
  timezones: string[];
}

/**
 * 虚拟化列表组件
 * 使用 TanStack Virtual 优化大量时区卡片的渲染性能
 */
const VirtualizedList = memo(({ timestamp, timezones }: VirtualizedListProps) => {
  const { isMobile, isMd } = useResponsive();

  // 计算网格列数
  const columns = useMemo(() => {
    if (isMobile) return 1;
    if (isMd) return 2;
    return timezones.length > 8 ? 4 : 3;
  }, [isMobile, isMd, timezones.length]);

  // 计算行数
  const rows = Math.ceil(timezones.length / columns);

  // 动态计算卡片高度
  const cardHeight = useMemo(() => {
    if (isMobile) return 340;
    if (isMd) return 320;
    return 280;
  }, [isMobile, isMd]);

  // 虚拟化配置
  const parentRef = useRef<HTMLDivElement>(null);

  // 虚拟化器
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cardHeight,
    overscan: 3, // 增加预渲染行数以提升滚动体验
    measureElement: element => {
      // 动态测量实际高度，提高精确度
      return element?.getBoundingClientRect().height ?? cardHeight;
    },
  });

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{
        height: isMobile ? '70vh' : '65vh',
        contain: 'strict',
        scrollBehavior: 'smooth',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const rowIndex = virtualRow.index;
          const startIndex = rowIndex * columns;
          const endIndex = Math.min(startIndex + columns, timezones.length);
          const rowTimezones = timezones.slice(startIndex, endIndex);

          return (
            <GridLayout
              key={virtualRow.key}
              virtualRow={virtualRow}
              columns={columns}
              isMobile={isMobile}
              measureElement={element => {
                if (element) {
                  element.setAttribute('data-index', String(virtualRow.index));
                  rowVirtualizer.measureElement(element);
                }
              }}
            >
              {rowTimezones.map(timezone => (
                <Suspense key={timezone} fallback={<SkeletonCard className="h-full" />}>
                  <TimezoneCard
                    timezone={timezone}
                    timestamp={timestamp}
                    className="h-full"
                  />
                </Suspense>
              ))}
            </GridLayout>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;