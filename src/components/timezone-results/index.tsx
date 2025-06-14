'use client';


import { useTimezoneStore } from '@/store';
import { Empty } from 'antd';
import { isEqual } from 'es-toolkit';
import { memo, useMemo } from 'react';
import VirtualizedList from './VirtualizedList';

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

    // 使用传入的时区列表或默认使用选中的时区
    const displayTimezones = useMemo(() => {
      return timezones || selectedTimezones;
    }, [timezones, selectedTimezones]);

    // 如果没有时间戳，显示提示
    if (timestamp === null) {
      return <EmptyState message="请先输入时间戳" />;
    }

    // 如果没有选中时区，显示提示
    if (displayTimezones.length === 0) {
      return <EmptyState message="请选择要显示的时区" />;
    }

    return (
      <div className="min-h-[400px]">
        <VirtualizedList timestamp={timestamp} timezones={displayTimezones} />
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

// 空状态组件
const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Empty description={message} styles={{ image: { height: 60 } }} />
    </div>
  );
};

TimezoneResults.displayName = 'TimezoneResults';

export default TimezoneResults;