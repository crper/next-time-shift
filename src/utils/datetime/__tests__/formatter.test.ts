import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatISO,
  formatRelative,
  formatTimeWithPeriod,
} from '../formatter';

describe('datetime/formatter', () => {
  it('合法输入应正常格式化', () => {
    expect(formatDate(0, 'UTC')).toBe('1970-01-01');
    expect(formatDateTime(0, 'UTC')).toBe('1970-01-01 00:00:00');
    expect(formatISO(0, 'UTC').startsWith('1970-01-01T00:00:00')).toBe(true);
  });

  it('非法时间戳输入应返回可预期的降级结果', () => {
    expect(formatDate('invalid', 'UTC')).toBe('无效日期');
    expect(formatDateTime('invalid', 'UTC')).toBe('无效日期时间');
    expect(formatISO('invalid', 'UTC')).toBe('');
    expect(formatRelative('invalid', 'UTC')).toBe('无效日期');
    expect(formatTimeWithPeriod('invalid', 'UTC')).toBe('无效时间');
  });

  it('非法时区输入应返回可预期的降级结果', () => {
    expect(formatDate(0, 'Invalid/Timezone')).toBe('无效日期');
    expect(formatDateTime(0, 'Invalid/Timezone')).toBe('无效日期时间');
    expect(formatISO(0, 'Invalid/Timezone')).toBe('');
    expect(formatRelative(0, 'Invalid/Timezone')).toBe('无效日期');
    expect(formatTimeWithPeriod(0, 'Invalid/Timezone')).toBe('无效时间');
  });
});
