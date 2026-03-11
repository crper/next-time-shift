'use client';

import { useStyles } from '@/hooks';
import { useTimezoneStore } from '@/store';
import {
  filterTimezonesByQuery,
  generateCommonUTCTimezones,
  getAllTimezonesWithUTC,
  getRegionInfo,
  groupTimezonesByRegion,
} from '@/utils/datetime';
import { Button, Card, Divider, Select, Space, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';

const { Text } = Typography;

interface TimezoneSelectorProps {
  onChange?: (timezones: string[]) => void;
}

/**
 * 时区选择器组件
 * 支持搜索、按地区分组、快速操作等功能
 */
const TimezoneSelector = ({ onChange }: TimezoneSelectorProps) => {
  const selectedTimezones = useTimezoneStore(state => state.selectedTimezones);
  const setSelectedTimezones = useTimezoneStore(state => state.setSelectedTimezones);
  const { styles, isMobile } = useStyles();

  // 本地状态
  const [searchValue, setSearchValue] = useState<string>('');

  // 获取所有时区选项
  const allTimezones = useMemo(() => getAllTimezonesWithUTC(), []);

  // 获取地区信息
  const regionInfo = useMemo(() => getRegionInfo(), []);

  // 按地区分组时区
  const groupedTimezones = useMemo(() => groupTimezonesByRegion(allTimezones), [allTimezones]);

  // 过滤后的时区选项
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return groupedTimezones;

    const matchedTimezones = filterTimezonesByQuery(allTimezones, searchValue);
    return groupTimezonesByRegion(matchedTimezones);
  }, [allTimezones, groupedTimezones, searchValue]);

  // 处理时区选择变更
  const handleChange = useCallback(
    (values: string[]) => {
      setSelectedTimezones(values);
      onChange?.(values);
    },
    [setSelectedTimezones, onChange]
  );

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // 重置到常用时区
  const handleResetToCommon = useCallback(() => {
    const commonTimezones = generateCommonUTCTimezones();
    setSelectedTimezones(commonTimezones);
    onChange?.(commonTimezones);
    setSearchValue('');
  }, [setSelectedTimezones, onChange]);

  // 清空所有选择
  const handleClearAll = useCallback(() => {
    setSelectedTimezones([]);
    onChange?.([]);
  }, [setSelectedTimezones, onChange]);

  // 全选当前筛选结果
  const handleSelectAllFiltered = useCallback(() => {
    const allFilteredTimezones = Object.values(filteredOptions).flat();
    const allKeys = allFilteredTimezones.map(tz => tz.key);
    const newSelection = Array.from(new Set([...selectedTimezones, ...allKeys]));
    setSelectedTimezones(newSelection);
    onChange?.(newSelection);
  }, [filteredOptions, selectedTimezones, setSelectedTimezones, onChange]);

  // 反选当前选择
  const handleInvertSelection = useCallback(() => {
    const allKeys = allTimezones.map(tz => tz.key);
    const invertedSelection = allKeys.filter(key => !selectedTimezones.includes(key));
    setSelectedTimezones(invertedSelection);
    onChange?.(invertedSelection);
  }, [allTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  // 快速选择标准UTC时区
  const handleSelectStandardUTC = useCallback(() => {
    const standardUTCTimezones = allTimezones.filter(tz => tz.region === 'Etc').map(tz => tz.key);
    const newSelection = Array.from(new Set([...selectedTimezones, ...standardUTCTimezones]));
    setSelectedTimezones(newSelection);
    onChange?.(newSelection);
  }, [allTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  // 使用 Select 原生 options 分组能力
  const selectOptions = useMemo(() => {
    return Object.entries(filteredOptions).map(([region, timezones]) => {
      const regionData = regionInfo[region as keyof typeof regionInfo];
      const groupLabel = regionData ? `${regionData.icon} ${regionData.region}` : region;

      return {
        label: groupLabel,
        options: timezones.map(tz => ({
          label: (
            <div className="flex items-center justify-between gap-2">
              <span>{tz.name}</span>
              <Text type="secondary" style={{ fontSize: styles.fontSize('xs') }}>
                {tz.offset}
              </Text>
            </div>
          ),
          value: tz.key,
        })),
      };
    });
  }, [filteredOptions, regionInfo, styles]);

  const totalFilteredCount = Object.values(filteredOptions).reduce(
    (sum, timezones) => sum + timezones.length,
    0
  );

  return (
    <Card className="shadow-sm" variant="outlined">
      <div className="space-y-4">
        {/* 状态信息 */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Text strong style={{ fontSize: styles.fontSize(isMobile ? 'md' : 'lg') }}>
              已选择 {selectedTimezones.length} 个时区
            </Text>
            {searchValue && (
              <Text
                type="secondary"
                style={{ fontSize: styles.fontSize('xs'), marginLeft: styles.spacing('xs') }}
              >
                （筛选出 {totalFilteredCount} 个）
              </Text>
            )}
          </div>
        </div>

        {/* 快速操作按钮组 */}
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
              onClick={handleSelectAllFiltered}
              disabled={totalFilteredCount === 0}
            >
              {searchValue ? '全选筛选结果' : '全选所有时区'}
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

        <Divider />

        {/* 时区选择器 */}
        <div>
          <Text
            type="secondary"
            style={{
              fontSize: styles.fontSize('xs'),
              marginBottom: styles.spacing('xs'),
              display: 'block',
            }}
          >
            时区选择器
          </Text>
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="搜索或选择时区..."
            value={selectedTimezones}
            onChange={handleChange}
            onSearch={handleSearch}
            searchValue={searchValue}
            filterOption={false}
            maxTagCount={isMobile ? 3 : 8}
            maxTagPlaceholder={omittedValues => `+${omittedValues.length} 个时区`}
            size="large"
            style={{ width: '100%' }}
            styles={{
              popup: {
                root: {
                  maxHeight: 400,
                },
              },
            }}
            notFoundContent={
              <div style={{ textAlign: 'center', padding: styles.spacing('xl') }}>
                <Text type="secondary">没有找到匹配的时区</Text>
              </div>
            }
            options={selectOptions}
          />
        </div>

        {/* 底部提示 */}
        <div style={{ textAlign: 'center', paddingTop: styles.spacing('xs') }}>
          <Text type="secondary" style={{ fontSize: styles.fontSize('xs') }}>
            💡 支持搜索时区名称、偏移量、地区等关键词
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default TimezoneSelector;
