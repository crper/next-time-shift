'use client';

import { useStyles } from '@/hooks';
import { useTimezoneStore } from '@/store';
import {
  generateCommonUTCTimezones,
  getAllTimezonesWithUTC,
} from '@/utils/datetime';
import { Button, Space, Typography } from 'antd';
import { uniq } from 'es-toolkit';
import { memo, useCallback } from 'react';

const { Text } = Typography;

interface TimezoneActionsProps {
  onChange?: (timezones: string[]) => void;
}

/**
 * 时区快速操作按钮组件
 * 提供常用的时区选择操作
 */
const TimezoneActions = memo(({ onChange }: TimezoneActionsProps) => {
  const { selectedTimezones, setSelectedTimezones } = useTimezoneStore();
  const { styles, isMobile } = useStyles();

  // 获取所有时区选项和分组
  const allTimezones = getAllTimezonesWithUTC();
  const groupedTimezones = allTimezones.reduce<Record<string, string[]>>((acc, tz) => {
    const region = tz.region || 'Etc';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(tz.key);
    return acc;
  }, {});

  // 重置到常用时区
  const handleResetToCommon = useCallback(() => {
    const commonTimezones = generateCommonUTCTimezones();
    setSelectedTimezones(commonTimezones);
    onChange?.(commonTimezones);
  }, [setSelectedTimezones, onChange]);

  // 清空所有选择
  const handleClearAll = useCallback(() => {
    setSelectedTimezones([]);
    onChange?.([]);
  }, [setSelectedTimezones, onChange]);

  // 全选当前筛选结果
  const handleSelectAll = useCallback(() => {
    const allKeys = allTimezones.map(tz => tz.key);
    setSelectedTimezones(allKeys);
    onChange?.(allKeys);
  }, [allTimezones, setSelectedTimezones, onChange]);

  // 反选当前选择
  const handleInvertSelection = useCallback(() => {
    const allKeys = allTimezones.map(tz => tz.key);
    const invertedSelection = allKeys.filter(key => !selectedTimezones.includes(key));
    setSelectedTimezones(invertedSelection);
    onChange?.(invertedSelection);
  }, [allTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  // 快速选择标准UTC时区
  const handleSelectStandardUTC = useCallback(() => {
    const standardUTCTimezones = groupedTimezones['Etc'] || [];
    const newSelection = uniq([...selectedTimezones, ...standardUTCTimezones]);
    setSelectedTimezones(newSelection);
    onChange?.(newSelection);
  }, [groupedTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  return (
    <div>
      <Text
        type="secondary"
        style={{
          fontSize: styles.fontSize('xs'),
          marginBottom: styles.spacing('xs'),
          display: 'block',
        }}
      >
        快速操作
      </Text>
      <Space size="small" wrap style={{ width: '100%' }}>
        <Button
          type="primary"
          size={isMobile ? 'small' : 'middle'}
          onClick={handleSelectAll}
        >
          全选所有时区
        </Button>

        <Button size={isMobile ? 'small' : 'middle'} onClick={handleInvertSelection}>
          反选当前选择
        </Button>

        <Button size={isMobile ? 'small' : 'middle'} onClick={handleSelectStandardUTC}>
          选择标准UTC时区
        </Button>

        <Button size={isMobile ? 'small' : 'middle'} onClick={handleResetToCommon}>
          选择常用时区
        </Button>

        <Button
          danger
          size={isMobile ? 'small' : 'middle'}
          onClick={handleClearAll}
          disabled={selectedTimezones.length === 0}
        >
          清空所有选择
        </Button>
      </Space>
    </div>
  );
});

TimezoneActions.displayName = 'TimezoneActions';

export default TimezoneActions;