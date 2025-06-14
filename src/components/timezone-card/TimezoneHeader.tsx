'use client';

import { Space, Tag, Typography } from 'antd';

const { Text: AntText } = Typography;

interface TimezoneHeaderProps {
  name: string;
  abbreviation?: string;
  timestamp: number;
  isMobile: boolean;
}

/**
 * 时区卡片头部组件
 * 显示时区名称、缩写和时间戳
 */
const TimezoneHeader = ({ name, abbreviation, timestamp, isMobile }: TimezoneHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <Space size="small">
        <AntText strong className={isMobile ? 'text-sm' : 'text-base'}>
          {name}
        </AntText>
        {abbreviation && (
          <Tag color="blue" className="text-xs">
            {abbreviation}
          </Tag>
        )}
      </Space>
      <AntText className="text-xs text-gray-600 block mb-2 font-medium" copyable>
        时间戳: {timestamp}
      </AntText>
    </div>
  );
};

export default TimezoneHeader;