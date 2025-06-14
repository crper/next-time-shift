/**
 * 日期时间格式化工具
 * 提供各种格式化和转换功能
 */

import { DateTime } from 'luxon';
import { normalizeTimestamp } from './core';
import { getTimeInfo } from './period';

export interface WeekInfo {
  weekOfYear: number;
  isoWeek: number;
  dayOfWeek: string;
  dayOfWeekShort: string;
  dayOfYear: number;
  quarter: number;
  isWeekend: boolean;
}

export interface RelativeTimeInfo {
  fromNow: string;
  toNow: string;
  calendar: string;
  isToday: boolean;
  isTomorrow: boolean;
  isYesterday: boolean;
}

/**
 * 格式化为标准日期字符串
 * @param ts 时间戳、日期字符串或 Date 对象
 * @param tz 目标时区，默认为 'UTC'
 * @returns 格式化后的日期字符串 (yyyy-MM-dd)
 * @example
 * formatDate(1640995200, 'Asia/Shanghai') // '2022-01-01'
 */
export function formatDate(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toFormat('yyyy-MM-dd');
  } catch (error) {
    console.error('格式化日期出错:', error);
    return '无效日期';
  }
}

/**
 * 格式化为仅时间
 * @param ts 时间戳、日期字符串或 Date 对象
 * @param tz 目标时区，默认为 'UTC'
 * @returns 格式化后的时间字符串 (HH:mm:ss)
 * @example
 * formatTime(1640995200, 'Asia/Shanghai') // '08:00:00'
 */
export function formatTime(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toFormat('HH:mm:ss');
  } catch (error) {
    console.error('格式化时间出错:', error);
    return '无效时间';
  }
}

/**
 * 格式化为带毫秒的时间
 * @param ts 时间戳、日期字符串或 Date 对象
 * @param tz 目标时区，默认为 'UTC'
 * @returns 格式化后的带毫秒时间字符串 (HH:mm:ss.SSS)
 * @example
 * formatTimeWithMillis(1640995200.123, 'Asia/Shanghai') // '08:00:00.123'
 */
export function formatTimeWithMillis(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toFormat('HH:mm:ss.SSS');
  } catch (error) {
    console.error('格式化带毫秒时间出错:', error);
    return '无效时间';
  }
}

/**
 * 格式化为标准日期时间字符串
 * @param ts 时间戳、日期字符串或 Date 对象
 * @param tz 目标时区，默认为 'UTC'
 * @returns 格式化后的日期时间字符串 (yyyy-MM-dd HH:mm:ss)
 * @example
 * formatDateTime(1640995200, 'Asia/Shanghai') // '2022-01-01 08:00:00'
 */
export function formatDateTime(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toFormat('yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    console.error('格式化日期时间出错:', error);
    return '无效日期时间';
  }
}

/**
 * 使用自定义格式格式化日期时间
 * @param ts 时间戳、日期字符串或 Date 对象
 * @param format Luxon 格式字符串
 * @param tz 目标时区，默认为 'UTC'
 * @returns 格式化后的日期时间字符串
 * @example
 * formatCustom(1640995200, 'yyyy年MM月dd日 HH:mm', 'Asia/Shanghai') // '2022年01月01日 08:00'
 */
export function formatCustom(
  ts: number | string | Date,
  format: string,
  tz: string = 'UTC'
): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toFormat(format);
  } catch (error) {
    console.error('自定义格式化出错:', error);
    return '无效日期格式';
  }
}

/**
 * 格式化为本地化显示格式 (例如：2023年1月1日 星期日)
 */
export function formatLocale(
  ts: number | string | Date,
  tz: string = 'UTC',
  locale: string = 'zh-CN'
): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp)
      .setZone(tz)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_FULL);
  } catch (error) {
    console.error('本地化格式化出错:', error);
    return '无效日期';
  }
}

/**
 * 格式化为相对时间 (例如：1小时前)
 */
export function formatRelative(
  ts: number | string | Date,
  tz: string = 'UTC',
  locale: string = 'zh-CN'
): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    const now = DateTime.now().setZone(tz);
    const dateTime = DateTime.fromSeconds(timestamp).setZone(tz).setLocale(locale);

    return dateTime.toRelative({ base: now }) || '未知时间';
  } catch (error) {
    console.error('相对时间格式化出错:', error);
    return '无效日期';
  }
}

/**
 * 获取完整的星期信息
 */
export function getWeekInfo(
  ts: number | string | Date,
  tz: string = 'UTC',
  locale: string = 'zh-CN'
): WeekInfo {
  try {
    const timestamp = normalizeTimestamp(ts);
    const dateTime = DateTime.fromSeconds(timestamp).setZone(tz).setLocale(locale);

    const isWeekend = dateTime.weekday === 6 || dateTime.weekday === 7;

    return {
      weekOfYear: dateTime.weekNumber,
      isoWeek: dateTime.weekYear,
      dayOfWeek: dateTime.weekdayLong || '未知',
      dayOfWeekShort: dateTime.weekdayShort || '未知',
      dayOfYear: dateTime.ordinal,
      quarter: Math.ceil(dateTime.month / 3),
      isWeekend,
    };
  } catch (error) {
    console.error('获取星期信息出错:', error);
    return {
      weekOfYear: 0,
      isoWeek: 0,
      dayOfWeek: '未知',
      dayOfWeekShort: '未知',
      dayOfYear: 0,
      quarter: 0,
      isWeekend: false,
    };
  }
}

/**
 * 获取相对时间信息
 */
export function getRelativeTimeInfo(
  ts: number | string | Date,
  tz: string = 'UTC'
): RelativeTimeInfo {
  try {
    const timestamp = normalizeTimestamp(ts);
    const now = DateTime.now().setZone(tz);
    const dateTime = DateTime.fromSeconds(timestamp).setZone(tz);

    const isToday = dateTime.hasSame(now, 'day');
    const isTomorrow = dateTime.hasSame(now.plus({ days: 1 }), 'day');
    const isYesterday = dateTime.hasSame(now.minus({ days: 1 }), 'day');

    let calendar = '';
    if (isToday) {
      calendar = `今天 ${dateTime.toFormat('HH:mm')}`;
    } else if (isTomorrow) {
      calendar = `明天 ${dateTime.toFormat('HH:mm')}`;
    } else if (isYesterday) {
      calendar = `昨天 ${dateTime.toFormat('HH:mm')}`;
    } else {
      calendar = dateTime.toFormat('MM-dd HH:mm');
    }

    return {
      fromNow: dateTime.toRelative({ base: now }) || '未知',
      toNow: now.toRelative({ base: dateTime }) || '未知',
      calendar,
      isToday,
      isTomorrow,
      isYesterday,
    };
  } catch (error) {
    console.error('获取相对时间信息出错:', error);
    return {
      fromNow: '未知',
      toNow: '未知',
      calendar: '未知',
      isToday: false,
      isTomorrow: false,
      isYesterday: false,
    };
  }
}

/**
 * 格式化为带时间段的完整时间 (例如：早晨 07:30)
 */
export function formatTimeWithPeriod(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    const dateTime = DateTime.fromSeconds(timestamp).setZone(tz);
    const timeInfo = getTimeInfo(timestamp, tz);

    return `${timeInfo.period} ${dateTime.toFormat('HH:mm')}`;
  } catch (error) {
    console.error('带时间段格式化出错:', error);
    return '无效时间';
  }
}

/**
 * 将日期时间格式化为 ISO 字符串
 */
export function formatISO(ts: number | string | Date, tz: string = 'UTC'): string {
  try {
    const timestamp = normalizeTimestamp(ts);
    return DateTime.fromSeconds(timestamp).setZone(tz).toISO() || '';
  } catch (error) {
    console.error('ISO格式化出错:', error);
    return '';
  }
}
