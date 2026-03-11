/**
 * 日期时间核心工具
 * 提供基础的日期时间处理功能
 */

import { isString } from 'es-toolkit';
import { DateTime, Duration, Info, Interval, Settings } from 'luxon';

// 导出 luxon 核心功能
export { DateTime, Duration, Info, Interval, Settings };

const MILLISECOND_TIMESTAMP_THRESHOLD = 9999999999;

function normalizeNumericTimestamp(value: number): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized =
    Math.abs(value) > MILLISECOND_TIMESTAMP_THRESHOLD
      ? Math.floor(value / 1000)
      : Math.floor(value);
  return Number.isFinite(normalized) ? normalized : null;
}

/**
 * 获取当前时间戳(秒)
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 严格标准化时间戳
 * 接受多种格式输入，无法解析时返回 null
 *
 * @param input 输入时间（时间戳/日期字符串/Date对象）
 * @returns 标准化后的秒级时间戳，失败时返回 null
 */
export function tryNormalizeTimestamp(input: number | string | Date): number | null {
  if (input instanceof Date) {
    return normalizeNumericTimestamp(input.getTime());
  }

  if (isString(input)) {
    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }

    // 尝试用 luxon 解析
    let parsed = DateTime.fromISO(trimmed);
    if (!parsed.isValid) {
      parsed = DateTime.fromRFC2822(trimmed);
    }
    if (!parsed.isValid) {
      parsed = DateTime.fromFormat(trimmed, 'yyyy-MM-dd HH:mm:ss');
    }
    if (parsed.isValid) {
      return normalizeNumericTimestamp(parsed.toSeconds());
    }

    // 尝试解析 Unix 时间戳字符串
    if (/^-?\d+$/.test(trimmed)) {
      const parsedNumber = Number.parseInt(trimmed, 10);
      return normalizeNumericTimestamp(parsedNumber);
    }

    return null;
  }

  if (typeof input === 'number') {
    return normalizeNumericTimestamp(input);
  }

  return null;
}

/**
 * 标准化时间戳
 * 接受多种格式的输入，并返回秒级的时间戳
 *
 * @param input 输入时间（时间戳/日期字符串/Date对象）
 * @returns 标准化的时间戳(秒)
 */
export function normalizeTimestamp(input: number | string | Date): number {
  const parsed = tryNormalizeTimestamp(input);
  if (parsed === null) {
    console.error('无法解析的日期字符串:', input);
    return getCurrentTimestamp();
  }

  return parsed;
}

/**
 * 安全地转换为 DateTime
 * 无法解析时间戳或时区无效时返回 null
 */
export function toValidDateTime(
  timestamp: number | string | Date,
  timezone: string = 'UTC'
): DateTime | null {
  const normalizedTimestamp = tryNormalizeTimestamp(timestamp);
  if (normalizedTimestamp === null) {
    return null;
  }

  const dateTime = DateTime.fromSeconds(normalizedTimestamp).setZone(timezone);
  return dateTime.isValid ? dateTime : null;
}

/**
 * 将秒级时间戳转换为 Luxon DateTime 对象
 *
 * @param timestamp 秒级时间戳
 * @param timezone 时区
 * @returns Luxon DateTime 对象
 */
export function timestampToDateTime(
  timestamp: number | string | Date,
  timezone: string = 'UTC'
): DateTime {
  const ts = normalizeTimestamp(timestamp);
  return DateTime.fromSeconds(ts).setZone(timezone);
}

/**
 * 计算两个时间戳之间的差异
 *
 * @param start 开始时间戳
 * @param end 结束时间戳
 * @returns Duration 对象
 */
export function calculateDuration(
  start: number | string | Date,
  end: number | string | Date
): Duration {
  const startTs = normalizeTimestamp(start);
  const endTs = normalizeTimestamp(end);

  return Duration.fromObject({
    seconds: endTs - startTs,
  });
}

/**
 * 日期是否是今天
 *
 * @param timestamp 时间戳
 * @param timezone 时区
 * @returns 是否为今天
 */
export function isToday(timestamp: number | string | Date, timezone: string = 'UTC'): boolean {
  const ts = normalizeTimestamp(timestamp);
  const date = DateTime.fromSeconds(ts).setZone(timezone);
  const today = DateTime.now().setZone(timezone);

  return date.hasSame(today, 'day');
}

/**
 * 日期是否是昨天
 *
 * @param timestamp 时间戳
 * @param timezone 时区
 * @returns 是否为昨天
 */
export function isYesterday(timestamp: number | string | Date, timezone: string = 'UTC'): boolean {
  const ts = normalizeTimestamp(timestamp);
  const date = DateTime.fromSeconds(ts).setZone(timezone);
  const yesterday = DateTime.now().setZone(timezone).minus({ days: 1 });

  return date.hasSame(yesterday, 'day');
}

/**
 * 日期是否是明天
 *
 * @param timestamp 时间戳
 * @param timezone 时区
 * @returns 是否为明天
 */
export function isTomorrow(timestamp: number | string | Date, timezone: string = 'UTC'): boolean {
  const ts = normalizeTimestamp(timestamp);
  const date = DateTime.fromSeconds(ts).setZone(timezone);
  const tomorrow = DateTime.now().setZone(timezone).plus({ days: 1 });

  return date.hasSame(tomorrow, 'day');
}

/**
 * 获取当前的本地化时区
 *
 * @returns 本地时区
 */
export function getLocalTimezone(): string {
  return DateTime.local().zoneName || 'UTC';
}

/**
 * 判断两个时间戳是否是同一天
 *
 * @param timestamp1 第一个时间戳
 * @param timestamp2 第二个时间戳
 * @param timezone 时区
 * @returns 是否是同一天
 */
export function isSameDay(
  timestamp1: number | string | Date,
  timestamp2: number | string | Date,
  timezone: string = 'UTC'
): boolean {
  const ts1 = normalizeTimestamp(timestamp1);
  const ts2 = normalizeTimestamp(timestamp2);

  const date1 = DateTime.fromSeconds(ts1).setZone(timezone);
  const date2 = DateTime.fromSeconds(ts2).setZone(timezone);

  return date1.hasSame(date2, 'day');
}
