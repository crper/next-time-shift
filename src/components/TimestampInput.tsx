'use client';

import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, InputNumber, Radio, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { DateTime } from 'luxon';
import { useState } from 'react';

type InputMode = 'timestamp' | 'datetime';

interface TimestampInputProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  onAdd?: (value: number) => void;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
}

/**
 * 灵活的时间戳输入组件
 * 支持 Unix 时间戳、JS 时间戳输入和日期时间选择器
 */
export default function TimestampInput({
  value,
  onChange,
  onAdd,
  placeholder: _placeholder = '输入时间戳或选择日期时间',
  size = 'middle',
  disabled = false,
}: TimestampInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('timestamp');

  // 处理快捷时间按钮点击，直接添加到列表
  const handleQuickTime = (timestamp: number) => {
    onChange?.(timestamp);
    onAdd?.(timestamp);
  };

  // 快捷时间按钮配置
  const quickTimeButtons = [
    {
      label: '🕐 现在',
      value: () => Math.floor(Date.now() / 1000),
      tooltip: '添加当前时间戳',
    },
    {
      label: '📅 今天',
      value: () => Math.floor(DateTime.now().startOf('day').toSeconds()),
      tooltip: '添加今天 00:00:00',
    },
    {
      label: '🌅 明天',
      value: () => Math.floor(DateTime.now().plus({ days: 1 }).startOf('day').toSeconds()),
      tooltip: '添加明天 00:00:00',
    },
    {
      label: '📅 昨天',
      value: () => Math.floor(DateTime.now().minus({ days: 1 }).startOf('day').toSeconds()),
      tooltip: '添加昨天 00:00:00',
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={inputMode} onChange={e => setInputMode(e.target.value)} size={size}>
        <Radio.Button value="timestamp">
          <ClockCircleOutlined /> 时间戳
        </Radio.Button>
        <Radio.Button value="datetime">
          <CalendarOutlined /> 日期时间
        </Radio.Button>
      </Radio.Group>

      <Space.Compact style={{ width: '100%' }}>
        {inputMode === 'timestamp' ? (
          <InputNumber
            value={value}
            onChange={onChange}
            placeholder="输入时间戳(支持Unix时间戳和JS时间戳)"
            style={{ flex: 1 }}
            size={size}
            disabled={disabled}
            controls={false}
          />
        ) : (
          <DatePicker
            showTime
            value={value ? dayjs.unix(value) : null}
            onChange={date => onChange?.(date ? date.unix() : null)}
            placeholder="选择日期和时间"
            style={{ flex: 1 }}
            size={size}
            disabled={disabled}
            format="YYYY-MM-DD HH:mm:ss"
          />
        )}
        <Button
          type="primary"
          onClick={() => value && onAdd?.(value)}
          disabled={!value || disabled}
          size={size}
        >
          添加
        </Button>
      </Space.Compact>

      <Space wrap>
        {quickTimeButtons.map((button, index) => (
          <Tooltip key={index} title={button.tooltip} placement='bottom'>
            <Button size={size} onClick={() => handleQuickTime(button.value())} disabled={disabled}>
              {button.label}
            </Button>
          </Tooltip>
        ))}
      </Space>
    </Space>
  );
}
