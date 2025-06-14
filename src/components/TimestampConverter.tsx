'use client';

import { useErrorHandler } from '@/hooks';
import { useTimezoneStore } from '@/store';
import { isValidTimezone } from '@/utils/datetime';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { TimestampInputSection, TimezoneDisplaySection } from './timestamp-converter';

/**
 * 时间戳转换组件
 * 支持用户添加多个时间戳，并在不同时区下查看对应的时间
 */
export default function TimestampConverter() {
  const { 
    // 时区相关状态和方法
    selectedTimezones, 
    setSelectedTimezones, 
    // 时间戳相关状态和方法
    timestampItems,
    activeTimestamp,
    addTimestamp
  } = useTimezoneStore();
  const { handleError, showSuccess } = useErrorHandler();

  // 移除初始化时区的 useEffect，因为现在只在添加时间戳时才会自动选择时区

  // 监听并验证时区有效性
  useEffect(() => {
    // 如果已有选中的时区，则检查它们的有效性
    if (selectedTimezones.length > 0) {
      // 检查当前选中的时区是否都有效
      const validSelectedTimezones = selectedTimezones.filter(tz => isValidTimezone(tz));

      // 如果有无效时区，更新为只包含有效时区的列表
      if (
        validSelectedTimezones.length !== selectedTimezones.length &&
        validSelectedTimezones.length > 0
      ) {
        setSelectedTimezones(validSelectedTimezones);
      } else if (validSelectedTimezones.length === 0) {
        // 如果没有有效时区，设置为空数组
        setSelectedTimezones([]);
      }
    }
  }, [selectedTimezones, setSelectedTimezones]);

  // 处理添加时间戳
  const handleAddTimestamp = (timestamp: number) => {
    try {
      // 检查是否已存在相同的时间戳
      const isDuplicate = timestampItems.some(item => item.timestamp === timestamp);
      
      addTimestamp(timestamp);
      
      // 只有在非重复添加时才显示成功提示
      if (!isDuplicate) {
        showSuccess('时间戳添加成功');
      }
    } catch (_error) {
      handleError('时间戳超出合理范围，请检查输入');
    }
  };

  return (
    <div className="timestamp-converter">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <TimestampInputSection
            timestampItems={timestampItems}
            activeTimestamp={activeTimestamp}
            onAddTimestamp={handleAddTimestamp}
            onSelectTimestamp={useTimezoneStore().setActiveTimestamp}
            onDeleteTimestamp={useTimezoneStore().removeTimestamp}
          />
        </Col>

        <Col xs={24} lg={18}>
          <TimezoneDisplaySection
            timestamp={activeTimestamp}
            selectedTimezones={selectedTimezones}
            onTimezoneChange={setSelectedTimezones}
          />
        </Col>
      </Row>
    </div>
  );
}
