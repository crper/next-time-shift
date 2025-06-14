'use client';

import { Descriptions, Typography } from 'antd';

const { Text } = Typography;

interface TimezoneDetailsProps {
  offset: string;
  region: string;
  country?: string;
  isDST: boolean;
  description?: string;
  isMobile: boolean;
  isDark: boolean;
}

/**
 * 时区详情组件
 * 显示时区的偏移量、地区、国家和夏令时信息
 */
const TimezoneDetails = ({
  offset,
  region,
  country,
  isDST,
  description,
  isMobile,
  isDark,
}: TimezoneDetailsProps) => {
  // 描述列表项
  const descriptionItems = [
    {
      key: 'offset',
      label: '偏移量',
      children: <Text strong>{offset}</Text>,
    },
    {
      key: 'region',
      label: '地区',
      children: <Text strong>{region}</Text>,
    },
    ...(country
      ? [
          {
            key: 'country',
            label: '国家/地区',
            children: <Text strong>{country}</Text>,
          },
        ]
      : []),
    {
      key: 'dst',
      label: '夏令时',
      children: (
        <Text strong className={isDST ? 'text-yellow-600' : undefined}>
          {isDST ? '☀️ 是' : '否'}
        </Text>
      ),
    },
  ];

  return (
    <div className="flex-1 mb-4">
      {/* 时区描述 */}
      {description && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <Text className="text-sm text-gray-700 leading-relaxed">{description}</Text>
        </div>
      )}

      {/* 详细信息 */}
      <Descriptions
        size={isMobile ? 'small' : 'default'}
        column={isMobile ? 1 : 2}
        items={descriptionItems}
        labelStyle={{
          fontWeight: 500,
          color: isDark ? '#9ca3af' : '#6b7280',
        }}
      />
    </div>
  );
};

export default TimezoneDetails;