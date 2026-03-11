'use client';

import { useErrorHandler } from '@/hooks';
import { useTimezoneStore } from '@/store';
import { Col, Row } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { TimestampInputSection, TimezoneDisplaySection } from './timestamp-converter';

/**
 * 时间戳转换组件
 * 支持用户添加多个时间戳，并在不同时区下查看对应的时间
 */
export default function TimestampConverter() {
  const {
    selectedTimezones,
    setSelectedTimezones,
    timestampItems,
    activeTimestamp,
    addTimestamp,
    setActiveTimestamp,
    removeTimestamp,
  } = useTimezoneStore(
    useShallow(state => ({
      selectedTimezones: state.selectedTimezones,
      setSelectedTimezones: state.setSelectedTimezones,
      timestampItems: state.timestampItems,
      activeTimestamp: state.activeTimestamp,
      addTimestamp: state.addTimestamp,
      setActiveTimestamp: state.setActiveTimestamp,
      removeTimestamp: state.removeTimestamp,
    }))
  );
  const { handleError, showSuccess, showWarning } = useErrorHandler();

  // 处理添加时间戳
  const handleAddTimestamp = (timestamp: number) => {
    const result = addTimestamp(timestamp);

    if (result === 'added') {
      showSuccess('时间戳添加成功');
      return;
    }

    if (result === 'duplicate') {
      showWarning('该时间戳已存在，已自动定位到对应项');
      return;
    }

    if (result === 'invalid') {
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
            onSelectTimestamp={setActiveTimestamp}
            onDeleteTimestamp={removeTimestamp}
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
