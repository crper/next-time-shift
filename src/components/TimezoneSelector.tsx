'use client';

import { useStyles } from '@/hooks';
import { useTimezoneStore } from '@/store';
import {
  generateCommonUTCTimezones,
  getAllTimezonesWithUTC,
  getRegionInfo,
  type TimezoneOption,
} from '@/utils/datetime';
import { Button, Card, Divider, Select, Space, Typography } from 'antd';
import { uniq } from 'es-toolkit';
import { useCallback, useMemo, useState } from 'react';

const { Text } = Typography;
const { OptGroup, Option } = Select;

interface TimezoneSelectorProps {
  onChange?: (timezones: string[]) => void;
}

/**
 * 时区选择器组件
 * 支持搜索、按地区分组、快速操作等功能
 */
const TimezoneSelector = ({ onChange }: TimezoneSelectorProps) => {
  const { selectedTimezones, setSelectedTimezones } = useTimezoneStore();
  const { componentStyles, styles, isMobile } = useStyles();

  // 本地状态
  const [searchValue, setSearchValue] = useState<string>('');

  // 获取所有时区选项
  const allTimezones = useMemo(() => getAllTimezonesWithUTC(), []);

  // 获取地区信息
  const regionInfo = useMemo(() => getRegionInfo(), []);

  // 按地区分组时区
  const groupedTimezones = useMemo(() => {
    const groups: Record<string, TimezoneOption[]> = {};

    allTimezones.forEach(tz => {
      const region = tz.region || 'Etc';
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(tz);
    });

    // 对每个分组内的时区按偏移量排序
    Object.keys(groups).forEach(region => {
      groups[region].sort((a, b) => a.offset.localeCompare(b.offset));
    });

    return groups;
  }, [allTimezones]);

  // 过滤后的时区选项
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      return groupedTimezones;
    }

    const query = searchValue.toLowerCase().trim();
    const filtered: Record<string, TimezoneOption[]> = {};

    Object.entries(groupedTimezones).forEach(([region, timezones]) => {
      const matchedTimezones = timezones.filter(
        tz =>
          tz.key.toLowerCase().includes(query) ||
          tz.name.toLowerCase().includes(query) ||
          tz.offset.includes(query) ||
          tz.chineseName?.toLowerCase().includes(query) ||
          tz.englishName?.toLowerCase().includes(query) ||
          tz.country?.toLowerCase().includes(query) ||
          // 增强UTC搜索支持
          (query === 'utc' &&
            (tz.key === 'UTC' ||
              tz.key.startsWith('Etc/GMT') ||
              tz.englishName?.toLowerCase().includes('utc') ||
              tz.name.toLowerCase().includes('utc')))
      );

      if (matchedTimezones.length > 0) {
        filtered[region] = matchedTimezones;
      }
    });

    return filtered;
  }, [groupedTimezones, searchValue]);

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
    const newSelection = uniq([...selectedTimezones, ...allKeys]);
    setSelectedTimezones(newSelection);
    onChange?.(newSelection);
  }, [filteredOptions, selectedTimezones, setSelectedTimezones, onChange]);

  // 反选当前选择
  const handleInvertSelection = useCallback(() => {
    const allAvailableTimezones = Object.values(groupedTimezones).flat();
    const allKeys = allAvailableTimezones.map(tz => tz.key);
    const invertedSelection = allKeys.filter(key => !selectedTimezones.includes(key));
    setSelectedTimezones(invertedSelection);
    onChange?.(invertedSelection);
  }, [groupedTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  // 快速选择标准UTC时区
  const handleSelectStandardUTC = useCallback(() => {
    const standardUTCTimezones = Object.values(groupedTimezones)
      .flat()
      .filter(tz => tz.region === 'Etc')
      .map(tz => tz.key);
    const newSelection = uniq([...selectedTimezones, ...standardUTCTimezones]);
    setSelectedTimezones(newSelection);
    onChange?.(newSelection);
  }, [groupedTimezones, selectedTimezones, setSelectedTimezones, onChange]);

  // 渲染时区选项
  const renderOptions = useMemo(() => {
    return Object.entries(filteredOptions).map(([region, timezones]) => {
      const regionData = regionInfo[region as keyof typeof regionInfo];
      const groupLabel = regionData ? `${regionData.icon} ${regionData.region}` : region;

      return (
        <OptGroup key={region} label={groupLabel}>
          {timezones.map(tz => (
            <Option key={tz.key} value={tz.key}>
              <div style={componentStyles.flexContainer}>
                <span>{tz.name}</span>
                <Text type="secondary" style={{ fontSize: styles.fontSize('xs') }}>
                  {tz.offset}
                </Text>
              </div>
            </Option>
          ))}
        </OptGroup>
      );
    });
  }, [filteredOptions, regionInfo, componentStyles.flexContainer, styles]);

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
          >
            {renderOptions}
          </Select>
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
