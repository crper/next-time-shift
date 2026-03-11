import { describe, expect, it } from 'vitest';
import {
  getDayPeriod,
  getSimpleTimeInfo,
  getTimeColor,
  getTimeIconType,
  getTimeInfo,
} from '../period';

describe('datetime/period', () => {
  it('合法输入应返回有效时间段信息', () => {
    const info = getTimeInfo(0, 'UTC');
    expect(info.period).not.toBe('未知');
    expect(info.icon.length).toBeGreaterThan(0);
  });

  it('非法时区或时间戳应返回统一回退值', () => {
    const invalidInfo = getTimeInfo('invalid', 'UTC');
    expect(invalidInfo.period).toBe('未知');
    expect(invalidInfo.description).toBe('时间信息获取失败');

    const invalidTimezoneInfo = getTimeInfo(0, 'Invalid/Timezone');
    expect(invalidTimezoneInfo.period).toBe('未知');

    const simple = getSimpleTimeInfo('invalid', 'UTC');
    expect(simple).toEqual({
      dayPeriod: '未知',
      time: '--:--',
      date: '----/--/--',
    });
  });

  it('辅助接口在非法输入下应稳定返回默认值', () => {
    expect(getDayPeriod('invalid', 'UTC')).toBe('未知');
    expect(getTimeIconType('invalid', 'UTC')).toBe('default');
    expect(getTimeColor('invalid', 'UTC')).toBe('#1890ff');
  });
});
