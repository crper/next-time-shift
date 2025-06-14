'use client';

import { useStyles } from '@/hooks';
import { useTimezoneStore } from '@/store';
import {
  getAllTimezonesWithUTC,
  getRegionInfo,
  searchTimezones,
  type TimezoneOption,
} from '@/utils/datetime';
import { Select, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import TimezoneGroup from './TimezoneGroup';

const { Text } = Typography;
const { OptGroup } = Select;

interface TimezoneSearchProps {
  onChange?: (timezones: string[]) => void;
}

/**
 * 时区搜索组件
 * 支持搜索、按地区分组显示时区
 */
const TimezoneSearch = ({ onChange }: TimezoneSearchProps) => {
  const { selectedTimezones, setSelectedTimezones } = useTimezoneStore();
  const { styles, isMobile } = useStyles();

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

    // 使用统一的 searchTimezones 函数进行搜索
    const matchedTimezones = searchTimezones(searchValue);
    const filtered: Record<string, TimezoneOption[]> = {};

    // 按地区分组搜索结果
    matchedTimezones.forEach(tz => {
      const region = tz.region || 'Etc';
      if (!filtered[region]) {
        filtered[region] = [];
      }
      filtered[region].push(tz);
    });

    // 对每个分组内的时区按偏移量排序
    Object.keys(filtered).forEach(region => {
      filtered[region].sort((a, b) => a.offset.localeCompare(b.offset));
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

  // 渲染时区选项
  const renderOptions = useMemo(() => {
    return Object.entries(filteredOptions).map(([region, timezones]) => {
      const regionData = regionInfo[region as keyof typeof regionInfo];
      const groupLabel = regionData ? `${regionData.icon} ${regionData.region}` : region;

      return (
        <OptGroup key={region} label={groupLabel}>
          <TimezoneGroup timezones={timezones} />
        </OptGroup>
      );
    });
  }, [filteredOptions, regionInfo]);

  const totalFilteredCount = Object.values(filteredOptions).reduce(
    (sum, timezones) => sum + timezones.length,
    0
  );

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
        时区选择器
        {searchValue && (
          <Text
            type="secondary"
            style={{ fontSize: styles.fontSize('xs'), marginLeft: styles.spacing('xs') }}
          >
            （筛选出 {totalFilteredCount} 个）
          </Text>
        )}
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
  );
};

export default TimezoneSearch;