import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import {
  convertTimezone,
  filterTimezonesByQuery,
  generateCommonUTCTimezones,
  generateFullStandardUTCTimezones,
  getAllTimezonesWithUTC,
  sortTimezonesByOffset,
  type TimezoneOption,
} from '../timezone';

describe('datetime/timezone', () => {
  it('应生成完整标准 UTC 时区列表（UTC-12 到 UTC+12）', () => {
    const zones = generateFullStandardUTCTimezones();
    expect(zones).toHaveLength(25);
    expect(zones).toContain('UTC');
    expect(zones).toContain('Etc/GMT+12');
    expect(zones).toContain('Etc/GMT-12');
  });

  it('应生成约定的常用 UTC 时区列表', () => {
    const zones = generateCommonUTCTimezones();
    expect(zones).toEqual([
      'Etc/GMT+8',
      'Etc/GMT+5',
      'UTC',
      'Etc/GMT-3',
      'Etc/GMT-8',
      'Etc/GMT-9',
      'Etc/GMT-10',
      'Etc/GMT-12',
    ]);
  });

  it('应按偏移量进行数值排序（非字符串排序）', () => {
    const input: TimezoneOption[] = [
      { key: 'C', label: 'C', name: 'C', offset: '+10:00' },
      { key: 'A', label: 'A', name: 'A', offset: '-08:00' },
      { key: 'B', label: 'B', name: 'B', offset: '+02:00' },
    ];

    const sorted = sortTimezonesByOffset(input);
    expect(sorted.map(item => item.key)).toEqual(['A', 'B', 'C']);
  });

  it('convertTimezone 应保持本地表盘时间不变，仅切换时区解释', () => {
    const localTime = {
      year: 2026,
      month: 3,
      day: 11,
      hour: 9,
      minute: 0,
      second: 0,
    };

    const sourceTimestamp = Math.floor(
      DateTime.fromObject(localTime, { zone: 'Asia/Shanghai' }).toSeconds()
    );
    const expectedTimestamp = Math.floor(
      DateTime.fromObject(localTime, { zone: 'America/New_York' }).toSeconds()
    );

    const converted = convertTimezone(sourceTimestamp, 'Asia/Shanghai', 'America/New_York');
    expect(converted).toBe(expectedTimestamp);
    expect(converted).not.toBe(sourceTimestamp);
  });

  it('搜索 utc 时应包含 UTC 本身', () => {
    const allTimezones = getAllTimezonesWithUTC();
    const matched = filterTimezonesByQuery(allTimezones, 'utc');
    expect(matched.some(item => item.key === 'UTC')).toBe(true);
  });
});
