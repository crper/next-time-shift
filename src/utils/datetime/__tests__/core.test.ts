import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { toValidDateTime, tryNormalizeTimestamp } from '../core';

describe('datetime/core', () => {
  it('应正确标准化秒与毫秒时间戳', () => {
    expect(tryNormalizeTimestamp(1710000000)).toBe(1710000000);
    expect(tryNormalizeTimestamp(1710000000123)).toBe(1710000000);
    expect(tryNormalizeTimestamp('1710000000123')).toBe(1710000000);
  });

  it('应正确解析 ISO 字符串', () => {
    const isoString = '2026-03-11T09:00:00+08:00';
    const expected = Math.floor(DateTime.fromISO(isoString).toSeconds());
    expect(tryNormalizeTimestamp(isoString)).toBe(expected);
  });

  it('非法输入应返回 null', () => {
    expect(tryNormalizeTimestamp('')).toBeNull();
    expect(tryNormalizeTimestamp('not-a-date')).toBeNull();
    expect(tryNormalizeTimestamp(Number.NaN)).toBeNull();
    expect(tryNormalizeTimestamp(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it('toValidDateTime 对合法输入返回有效 DateTime', () => {
    const dateTime = toValidDateTime(0, 'UTC');
    expect(dateTime).not.toBeNull();
    expect(dateTime?.isValid).toBe(true);
    expect(Math.floor(dateTime?.toSeconds() ?? -1)).toBe(0);
  });

  it('toValidDateTime 对非法时区或非法时间应返回 null', () => {
    expect(toValidDateTime(0, 'Invalid/Timezone')).toBeNull();
    expect(toValidDateTime('invalid', 'UTC')).toBeNull();
  });
});
