'use client';

import { useResponsive } from '@/hooks';
import { useThemeStore } from '@/store';
import { getTimeInfo, getTimezoneInfo, timestampToDateTime } from '@/utils/datetime';
import { Card } from 'antd';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import TimeDisplay from './TimeDisplay';
import TimezoneDetails from './TimezoneDetails';
import TimezoneHeader from './TimezoneHeader';

export interface TimezoneCardProps {
  timezone: string;
  timestamp: number;
  className?: string;
}

/**
 * 时区卡片组件 - 使用 Ant Design Card
 * 显示时区详细信息：名称、缩写、描述、时间、日期和时间戳
 */
const TimezoneCard = memo(({ timezone, timestamp, className }: TimezoneCardProps) => {
  const { isMobile } = useResponsive();
  const { actualTheme } = useThemeStore();
  const isDark = actualTheme === 'dark';

  // 获取时区详细信息
  const timezoneDetails = useMemo(() => {
    try {
      const timezoneInfo = getTimezoneInfo(timezone);
      const dateTime = timestampToDateTime(timestamp, timezone);
      const timeInfo = getTimeInfo(timestamp, timezone);

      // 获取周几信息
      // Luxon weekday: 1=周一, 2=周二, ..., 7=周日
      const weekdayChinese = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][
        dateTime.weekday - 1
      ];

      return {
        ...timezoneInfo,
        time: dateTime.toFormat('HH:mm:ss'),
        date: `${dateTime.toFormat('MM/dd')} ${weekdayChinese}`,
        fullDate: dateTime.toFormat('yyyy-MM-dd'),
        timeInfo,
        timestamp,
      };
    } catch (_error) {
      console.error(`时区信息获取失败: ${timezone}`, _error);
      return null;
    }
  }, [timezone, timestamp]);

  if (!timezoneDetails) {
    return (
      <Card className={clsx('h-full', className)} size={isMobile ? 'small' : 'default'} variant="outlined">
        <div className="flex items-center justify-center h-32">
          <span className="text-red-500">时区数据加载失败</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <TimezoneHeader
          name={timezoneDetails.name}
          abbreviation={timezoneDetails.abbreviation}
          timestamp={timezoneDetails.timestamp}
          isMobile={isMobile}
        />
      }
      className={clsx('h-full', className)}
      size={isMobile ? 'small' : 'default'}
      variant="outlined"
      styles={{
        header: {
          paddingBottom: isMobile ? 8 : 12,
          minHeight: 'auto',
        },
        body: {
          paddingTop: isMobile ? 8 : 12,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
    >
      <div className="flex flex-col h-full">
        {/* 时间显示区域 */}
        <TimeDisplay
          time={timezoneDetails.time}
          date={timezoneDetails.date}
          isMobile={isMobile}
        />

        {/* 时区详情 */}
        <TimezoneDetails
          offset={timezoneDetails.offset}
          region={timezoneDetails.region}
          country={timezoneDetails.country}
          isDST={timezoneDetails.isDST}
          description={timezoneDetails.description}
          isMobile={isMobile}
          isDark={isDark}
        />
      </div>
    </Card>
  );
});

TimezoneCard.displayName = 'TimezoneCard';

export default TimezoneCard;
