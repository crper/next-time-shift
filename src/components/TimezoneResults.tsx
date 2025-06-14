'use client';

import TimezoneCard from '@/components/timezone-card';
import { useResponsive } from '@/hooks/useResponsive';
import { useTimezoneStore } from '@/store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Empty } from 'antd';
import { isEqual } from 'es-toolkit';
import { memo, Suspense, useMemo, useRef } from 'react';
import { SkeletonCard } from './LoadingStates';

interface TimezoneResultsProps {
  timestamp: number | null;
  timezones?: string[];
}

/**
 * 时区结果展示组件
 * 使用虚拟化列表优化大量时区卡片的渲染性能
 */
const TimezoneResults = memo(
  ({ timestamp, timezones }: TimezoneResultsProps) => {
    const { selectedTimezones } = useTimezoneStore();
    const { isMobile, isMd } = useResponsive();

    // 使用传入的时区列表或默认使用选中的时区
    const displayTimezones = useMemo(() => {
      return timezones || selectedTimezones;
    }, [timezones, selectedTimezones]);

    // 虚拟化配置
    const parentRef = useRef<HTMLDivElement>(null);

    // 计算网格列数
    const columns = useMemo(() => {
      if (isMobile) return 1;
      if (isMd) return 2;
      return displayTimezones.length > 8 ? 4 : 3;
    }, [isMobile, isMd, displayTimezones.length]);

    // 计算行数
    const rows = Math.ceil(displayTimezones.length / columns);

    // 动态计算卡片高度
    const cardHeight = useMemo(() => {
      if (isMobile) return 340;
      if (isMd) return 320;
      return 280;
    }, [isMobile, isMd]);

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

    // 如果没有时间戳，显示提示
    if (timestamp === null) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Empty description="请先输入时间戳" styles={{ image: { height: 60 } }} />
        </div>
      );
    }

    // 如果没有选中时区，显示提示
    if (displayTimezones.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Empty description="请选择要显示的时区" styles={{ image: { height: 60 } }} />
        </div>
      );
    }

    return (
      <div className="min-h-[400px]">
        {/* 虚拟化时区卡片网格 */}
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
              const endIndex = Math.min(startIndex + columns, displayTimezones.length);
              const rowTimezones = displayTimezones.slice(startIndex, endIndex);

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: isMobile ? '8px' : '12px',
                  }}
                >
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                      gap: isMobile ? '12px' : '16px',
                      height: '100%',
                      alignItems: 'stretch',
                      padding: isMobile ? '4px' : '8px',
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.timezones, nextProps.timezones) &&
      prevProps.timestamp === nextProps.timestamp
    );
  }
);

TimezoneResults.displayName = 'TimezoneResults';

export default TimezoneResults;
