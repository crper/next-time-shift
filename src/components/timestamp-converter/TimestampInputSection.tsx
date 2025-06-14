'use client';

import { useResponsive } from '@/hooks';
import { TimestampItem } from '@/types';
import { Card, Divider, Typography } from 'antd';
import { useState } from 'react';
import TimestampInput from '../TimestampInput';
import TimestampList from '../TimestampList';

const { Title } = Typography;

interface TimestampInputSectionProps {
  timestampItems: TimestampItem[];
  activeTimestamp: number | null;
  onAddTimestamp: (timestamp: number) => void;
  onSelectTimestamp: (timestamp: number) => void;
  onDeleteTimestamp: (id: string) => void;
}

/**
 * 时间戳输入区域组件
 * 包含时间戳输入框和时间戳列表
 */
export default function TimestampInputSection({
  timestampItems,
  activeTimestamp,
  onAddTimestamp,
  onSelectTimestamp,
  onDeleteTimestamp,
}: TimestampInputSectionProps) {
  const [inputValue, setInputValue] = useState<number | null>(null);
  const { isMobile } = useResponsive();

  // 处理输入框变更
  const handleInputChange = (value: number | null) => {
    setInputValue(value);
  };

  // 处理添加时间戳
  const handleAddTimestamp = (timestamp: number) => {
    onAddTimestamp(timestamp);
    setInputValue(null); // 清空输入框
  };

  return (
    <Card size="small" variant="outlined">
      <Card
        size="small"
        title={
          <Title level={5} style={{ margin: 0 }}>
            添加时间戳
          </Title>
        }
        variant="borderless"
        styles={{
          body: { padding: isMobile ? 12 : 16 },
        }}
      >
        <TimestampInput
          value={inputValue}
          onChange={handleInputChange}
          onAdd={handleAddTimestamp}
          size={isMobile ? 'small' : 'middle'}
        />
      </Card>

      <Divider style={{ margin: '16px 0' }} />

      <TimestampList
        items={timestampItems}
        activeTimestamp={activeTimestamp}
        onSelect={onSelectTimestamp}
        onDelete={onDeleteTimestamp}
        size={isMobile ? 'small' : 'middle'}
      />
    </Card>
  );
}
