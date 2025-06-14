'use client';

import { Typography } from 'antd';
import clsx from 'clsx';

const { Title, Text } = Typography;

interface TimeDisplayProps {
  time: string;
  date: string;
  isMobile: boolean;
}

/**
 * 时间显示组件
 * 显示时间和日期
 */
const TimeDisplay = ({ time, date, isMobile }: TimeDisplayProps) => {
  return (
    <div className={clsx('mb-4', isMobile ? 'mb-3' : 'mb-4')}>
      <Title
        level={isMobile ? 4 : 3}
        className={clsx('!mb-1', isMobile ? 'text-lg' : 'text-xl')}
      >
        {time}
      </Title>
      <Text
        copyable
        className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
      >
        {date}
      </Text>
    </div>
  );
};

export default TimeDisplay;