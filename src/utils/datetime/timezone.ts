/**
 * 时区工具
 * 提供完整的时区处理功能
 */

import { DateTime } from 'luxon';
import { normalizeTimestamp, toValidDateTime } from './core';
import { timezoneNameMapping } from './timezone-data';

/**
 * 时区选项类型
 */
export interface TimezoneOption {
  key: string;
  label: string;
  name: string;
  offset: string;
  region?: string;
  icon?: string;
  country?: string;
  chineseName?: string;
  englishName?: string;
  timeInfo?: {
    period: string;
    description: string;
    color: string;
    icon: string;
  };
}

/**
 * 时区详情类型
 */
export interface TimezoneDetail {
  key: string;
  name: string;
  region: string;
  offset: string;
  isDST: boolean;
  abbreviation?: string;
  description?: string;
  country?: string;
}

/**
 * 区域信息类型
 */
export interface RegionInfo {
  region: string;
  icon: string;
  color: string;
}

const MIN_UTC_OFFSET = -12;
const MAX_UTC_OFFSET = 12;

function toEtcTimezoneKey(offset: number): string {
  if (offset === 0) return 'UTC';
  // IANA 约定符号相反：UTC+8 => Etc/GMT-8
  return `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`;
}

function toUTCOffsetString(offset: number): string {
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${Math.abs(offset).toString().padStart(2, '0')}:00`;
}

function toUTCDisplayOffset(offset: number): string {
  return offset >= 0 ? `UTC+${Math.abs(offset)}` : `UTC${offset}`;
}

function offsetStringToMinutes(offset: string): number {
  const match = offset.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;

  const [, sign, hours, minutes] = match;
  const totalMinutes = Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10);
  return sign === '-' ? -totalMinutes : totalMinutes;
}

function isUTCKeywordMatch(timezone: TimezoneOption, query: string): boolean {
  if (query !== 'utc') return false;

  return (
    timezone.key === 'UTC' ||
    timezone.key.startsWith('Etc/GMT') ||
    timezone.englishName?.toLowerCase().includes('utc') ||
    timezone.name.toLowerCase().includes('utc')
  );
}

/**
 * 统一时区搜索匹配逻辑
 */
export function filterTimezonesByQuery(
  timezones: TimezoneOption[],
  query: string
): TimezoneOption[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return timezones;

  return timezones.filter(tz => {
    return (
      tz.key.toLowerCase().includes(normalizedQuery) ||
      tz.name.toLowerCase().includes(normalizedQuery) ||
      tz.offset.includes(normalizedQuery) ||
      tz.region?.toLowerCase().includes(normalizedQuery) ||
      tz.chineseName?.toLowerCase().includes(normalizedQuery) ||
      tz.englishName?.toLowerCase().includes(normalizedQuery) ||
      tz.country?.toLowerCase().includes(normalizedQuery) ||
      isUTCKeywordMatch(tz, normalizedQuery)
    );
  });
}

/**
 * 按地区分组并按 UTC 偏移排序
 */
export function groupTimezonesByRegion(
  timezones: TimezoneOption[]
): Record<string, TimezoneOption[]> {
  const groups: Record<string, TimezoneOption[]> = {};

  timezones.forEach(tz => {
    const region = tz.region || 'Etc';
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(tz);
  });

  Object.keys(groups).forEach(region => {
    groups[region] = sortTimezonesByOffset(groups[region]);
  });

  return groups;
}

/**
 * 获取时区的显示名称
 * @param timezone 时区选项或时区字符串
 * @returns 格式化的显示名称
 */
export function getTimezoneDisplayName(timezone: TimezoneOption | string): string {
  const key = typeof timezone === 'string' ? timezone : timezone.key;
  const mapping = timezoneNameMapping[key];

  if (mapping) {
    return `${mapping.chinese} (${mapping.english})`;
  }

  // 如果没有映射，从时区名称中提取城市名
  const parts = key.split('/');
  const cityName = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : key;

  // 对于没有中文名称的时区，使用城市名作为显示名称，并保持统一格式
  return `${cityName} (${cityName})`;
}

/**
 * 获取时区列表
 * @returns 时区选项数组
 */
export function getTimezoneList(): TimezoneOption[] {
  return getAllTimezones();
}

/**
 * 校验给定的时区字符串是否为有效的IANA时区名称。
 * @param timezone 时区字符串，例如 "America/New_York"。
 * @returns 如果时区有效则返回 true，否则返回 false。
 */
export function isValidTimezone(timezone?: string | null): boolean {
  if (!timezone) return false;

  try {
    // 尝试用时区创建DateTime对象，如果成功则为有效时区
    return DateTime.now().setZone(timezone).isValid;
  } catch (_error) {
    return false;
  }
}

/**
 * 获取指定时区的详细信息
 * @param timezone IANA时区名称
 * @returns 时区详细信息
 */
export function getTimezoneInfo(timezone: string): TimezoneDetail {
  if (!isValidTimezone(timezone)) {
    console.error(`无效的时区名: ${timezone}`);
    return {
      key: 'invalid',
      name: '无效时区',
      region: '未知',
      offset: '未知',
      isDST: false,
    };
  }

  try {
    const now = DateTime.now().setZone(timezone);
    const offset = now.toFormat('ZZ');
    const systemAbbreviation = now.toFormat('ZZZZ');
    const isDST = now.isInDST;

    // 从时区名称中提取区域信息
    const parts = timezone.split('/');
    const region = parts[0] || '其他';
    const name = getTimezoneDisplayName(timezone);

    // 获取映射信息
    const mapping = timezoneNameMapping[timezone];

    return {
      key: timezone,
      name,
      region,
      offset,
      isDST,
      abbreviation: mapping?.abbreviation || systemAbbreviation,
      description: mapping?.description || `${name}的本地时间`,
      country: mapping?.country,
    };
  } catch (error) {
    console.error(`获取时区信息失败: ${timezone}`, error);
    return {
      key: timezone,
      name: timezone,
      region: '未知',
      offset: '未知',
      isDST: false,
    };
  }
}

/**
 * 将给定的时间戳从一个时区转换到另一个时区
 * 语义：保持本地表盘时间不变，仅切换时区解释方式
 * 例如：把 "2026-03-11 09:00" 从 Asia/Shanghai 换算为 America/New_York 对应的 Unix 时间戳
 *
 * 注意：Unix 时间戳本身是绝对时间点，不存在“换时区后数值变化”的概念；
 * 若你只需要在不同时区展示同一时间点，请直接使用 formatDateTime / timestampToDateTime。
 *
 * @param timestamp 时间戳
 * @param fromTimezone 源时区
 * @param toTimezone 目标时区
 * @returns 转换后的时间戳
 */
export function convertTimezone(
  timestamp: number | string | Date,
  fromTimezone: string,
  toTimezone: string
): number {
  try {
    const source = toValidDateTime(timestamp, fromTimezone);
    if (!source || !isValidTimezone(toTimezone)) {
      return normalizeTimestamp(timestamp);
    }

    const target = DateTime.fromObject(
      {
        year: source.year,
        month: source.month,
        day: source.day,
        hour: source.hour,
        minute: source.minute,
        second: source.second,
        millisecond: source.millisecond,
      },
      { zone: toTimezone }
    );

    if (!target.isValid) {
      return normalizeTimestamp(timestamp);
    }

    return Math.floor(target.toSeconds());
  } catch (error) {
    console.error('时区转换失败:', error);
    return normalizeTimestamp(timestamp);
  }
}

/**
 * 获取给定时区在当前时间的UTC偏移
 * @param timezone IANA时区名称
 * @returns 格式化的UTC偏移字符串 (如 "+08:00")
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const now = DateTime.now().setZone(timezone);
    return now.toFormat('ZZ');
  } catch (error) {
    console.error(`获取时区偏移失败: ${timezone}`, error);
    return '';
  }
}

/**
 * 获取所有可用的时区列表
 * @returns 时区选项数组
 */
export function getAllTimezones(): TimezoneOption[] {
  try {
    // 使用 Intl.supportedValuesOf 获取所有支持的时区
    let zones: string[] = [];

    if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
      try {
        zones = Intl.supportedValuesOf('timeZone');
      } catch (error) {
        console.warn('Intl.supportedValuesOf 不可用，使用备用时区列表', error);
      }
    }

    // 如果无法获取完整列表，使用常用时区作为备用
    if (zones.length === 0) {
      zones = Object.keys(timezoneNameMapping);
    }

    // 确保UTC始终在列表中
    if (!zones.includes('UTC')) {
      zones.unshift('UTC');
    }

    // 当前时间
    const now = DateTime.now();

    return zones
      .map(zone => {
        try {
          // 特殊处理UTC
          if (zone === 'UTC') {
            return {
              key: 'UTC',
              label: 'UTC (+00:00)',
              name: '协调世界时 (UTC)',
              offset: '+00:00',
              region: 'Etc',
              chineseName: '协调世界时',
              englishName: 'UTC',
              country: '国际标准',
            };
          }

          const dateTime = now.setZone(zone);
          if (!dateTime.isValid) return null;

          const offset = dateTime.toFormat('ZZ');
          const mapping = timezoneNameMapping[zone];

          // 分割时区名称以获取区域和城市
          const parts = zone.split('/');
          const region = parts[0];
          const cityName = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : zone;

          // 确保所有时区都有中文名称和英文名称
          let chineseName = mapping?.chinese;
          let englishName = mapping?.english || cityName;

          // 如果没有中文名称，使用城市名作为中文名称
          if (!chineseName) {
            chineseName = cityName;
          }

          // 如果没有英文名称，使用城市名作为英文名称
          if (!englishName) {
            englishName = cityName;
          }

          // 统一 label 和 name 的格式
          const displayLabel = `${chineseName} (${englishName}) (${offset})`;
          const displayName = `${chineseName} (${englishName})`;

          return {
            key: zone,
            label: displayLabel,
            name: displayName,
            offset,
            region,
            chineseName,
            englishName,
            country: mapping?.country,
          };
        } catch {
          // 忽略无效时区
          return null;
        }
      })
      .filter(Boolean) as TimezoneOption[];
  } catch (error) {
    console.error('获取时区列表失败', error);
    return [
      {
        key: 'UTC',
        label: 'UTC (+00:00)',
        name: '协调世界时 (UTC)',
        offset: '+00:00',
        region: 'Etc',
        chineseName: '协调世界时',
        englishName: 'UTC',
        country: '国际标准',
      },
    ];
  }
}

/**
 * 获取常用时区列表
 * @returns 常用时区选项数组
 */
export function getCommonTimezones(): TimezoneOption[] {
  const commonZones = [
    'UTC',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Singapore',
    'Asia/Dubai',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Sao_Paulo',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];

  return commonZones.filter(isValidTimezone).map(zone => {
    const info = getTimezoneInfo(zone);
    const mapping = timezoneNameMapping[zone];
    let chineseName = mapping?.chinese;
    const englishName =
      mapping?.english ||
      (info.name.includes('(')
        ? info.name.substring(info.name.indexOf('(') + 1, info.name.lastIndexOf(')'))
        : info.name);

    // 如果没有中文名称，使用城市名作为中文名称
    if (!chineseName) {
      const parts = zone.split('/');
      const cityName = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : zone;
      chineseName = cityName;
    }

    // 统一 label 和 name 的格式
    const displayLabel = `${chineseName} (${englishName}) (${info.offset})`;
    const displayName = `${chineseName} (${englishName})`;

    return {
      key: zone,
      label: displayLabel,
      name: displayName,
      offset: info.offset,
      region: info.region,
      chineseName: chineseName,
      englishName: englishName,
      country: mapping?.country,
    };
  });
}

/**
 * 根据区域获取时区
 * @param region 区域名称 (如 'Asia', 'Europe')
 * @returns 该区域的时区选项数组
 */
export function getTimezonesByRegion(region: string): TimezoneOption[] {
  return getAllTimezones().filter(tz => tz.region === region);
}

/**
 * 获取包含时区区域和图标的映射
 * @returns 区域信息映射
 */
export function getRegionInfo(): Record<string, RegionInfo> {
  return {
    Africa: {
      region: '非洲',
      icon: '🌍',
      color: 'var(--region-africa, #f5c469)',
    },
    America: {
      region: '美洲',
      icon: '🌎',
      color: 'var(--region-america, #91caff)',
    },
    Antarctica: {
      region: '南极洲',
      icon: '🧊',
      color: 'var(--region-antarctica, #d9f7be)',
    },
    Asia: {
      region: '亚洲',
      icon: '🌏',
      color: 'var(--region-asia, #ff9c6e)',
    },
    Atlantic: {
      region: '大西洋',
      icon: '🌊',
      color: 'var(--region-atlantic, #87e8de)',
    },
    Australia: {
      region: '大洋洲',
      icon: '🦘',
      color: 'var(--region-australia, #ffa39e)',
    },
    Europe: {
      region: '欧洲',
      icon: '🏰',
      color: 'var(--region-europe, #b7eb8f)',
    },
    Indian: {
      region: '印度洋',
      icon: '🌊',
      color: 'var(--region-indian, #d3adf7)',
    },
    Pacific: {
      region: '太平洋',
      icon: '🏝️',
      color: 'var(--region-pacific, #ffd666)',
    },
    Arctic: {
      region: '北极',
      icon: '❄️',
      color: 'var(--region-arctic, #bfbfbf)',
    },
    Etc: {
      region: '🕐 标准UTC时区',
      icon: '🌐',
      color: 'var(--region-etc, #adc6ff)',
    },
  };
}

/**
 * 搜索时区
 * @param query 搜索关键词
 * @returns 匹配的时区选项数组
 */
export function searchTimezones(query: string): TimezoneOption[] {
  if (!query || query.trim() === '') {
    return getCommonTimezones();
  }

  return filterTimezonesByQuery(getAllTimezonesWithUTC(), query);
}

/**
 * 按偏移量排序时区
 * @param timezones 要排序的时区数组
 * @param ascending 是否升序排列 (默认为 true)
 * @returns 排序后的时区数组
 */
export function sortTimezonesByOffset(
  timezones: TimezoneOption[],
  ascending: boolean = true
): TimezoneOption[] {
  return [...timezones].sort((a, b) => {
    const offsetA = offsetStringToMinutes(a.offset);
    const offsetB = offsetStringToMinutes(b.offset);

    return ascending ? offsetA - offsetB : offsetB - offsetA;
  });
}

/**
 * 生成标准UTC时区列表 (UTC-12 到 UTC+12)
 * @returns 标准UTC时区选项数组
 */
export function getStandardUTCTimezones(): TimezoneOption[] {
  const standardTimezones: TimezoneOption[] = [];

  // 生成UTC-12到UTC+12的时区
  for (let offset = MIN_UTC_OFFSET; offset <= MAX_UTC_OFFSET; offset++) {
    const offsetStr = toUTCOffsetString(offset);
    const displayOffset = toUTCDisplayOffset(offset);
    const timezoneKey = toEtcTimezoneKey(offset);

    // 验证时区是否有效
    try {
      const dateTime = DateTime.now().setZone(timezoneKey);
      if (!dateTime.isValid) continue;

      standardTimezones.push({
        key: timezoneKey,
        label: `${displayOffset} (${offsetStr})`,
        name: `标准时区 ${displayOffset}`,
        offset: offsetStr,
        region: 'Etc', // 统一使用Etc分组，避免重复
        chineseName: `标准时区 ${displayOffset}`,
        englishName: displayOffset,
        country: '国际标准',
      });
    } catch (error) {
      // 如果时区无效，跳过
      console.warn(`Invalid timezone: ${timezoneKey}`, error);
      continue;
    }
  }

  return standardTimezones;
}

/**
 * 获取所有时区列表，包含标准UTC时区
 * @returns 包含标准UTC时区的完整时区选项数组
 */
export function getAllTimezonesWithUTC(): TimezoneOption[] {
  const allTimezones = getAllTimezones();
  const standardUTCTimezones = getStandardUTCTimezones();

  // 合并并去重（以key为准）
  const timezoneMap = new Map<string, TimezoneOption>();

  // 先添加标准UTC时区
  standardUTCTimezones.forEach(tz => {
    timezoneMap.set(tz.key, tz);
  });

  // 再添加其他时区，如果key已存在则跳过
  allTimezones.forEach(tz => {
    if (!timezoneMap.has(tz.key)) {
      timezoneMap.set(tz.key, tz);
    }
  });

  return Array.from(timezoneMap.values());
}

// searchTimezonesEnhanced 函数已合并到 searchTimezones 函数中

/**
 * 生成完整的24个标准UTC时区 (UTC-12 到 UTC+12)
 * 用于store的默认时区配置
 * @returns 完整标准UTC时区键值数组
 */
export function generateFullStandardUTCTimezones(): string[] {
  const timezones: string[] = [];

  // 生成UTC-12到UTC+12的时区
  for (let offset = MIN_UTC_OFFSET; offset <= MAX_UTC_OFFSET; offset++) {
    timezones.push(toEtcTimezoneKey(offset));
  }

  return timezones;
}

/**
 * 生成常用的8个标准UTC时区
 * 用于默认选择和清空时的恢复
 * @returns 常用标准UTC时区键值数组
 */
export function generateCommonUTCTimezones(): string[] {
  // 选择一些常用的UTC时区：UTC-8, UTC-5, UTC+0, UTC+3, UTC+8, UTC+9, UTC+10, UTC+12
  const commonOffsets = [-8, -5, 0, 3, 8, 9, 10, 12];

  return commonOffsets.map(toEtcTimezoneKey);
}
