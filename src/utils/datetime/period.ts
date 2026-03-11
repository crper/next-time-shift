/**
 * 时间段信息处理工具
 * 提供时间段判断、描述和视觉效果
 */

import { toValidDateTime } from './core';

/**
 * 时间信息接口
 */
export interface TimeInfo {
  period: string;
  description: string;
  color: string;
  icon: string;
  amPm?: string; // 添加上午/下午标识
  dayPeriodEmoji?: string; // 添加对应的时间emoji
}

/**
 * 简化的时间信息接口
 */
export interface SimpleTimeInfo {
  dayPeriod: string;
  time: string;
  date: string;
}

const FALLBACK_TIME_INFO: TimeInfo = {
  period: '未知',
  description: '时间信息获取失败',
  color: '#1890ff',
  icon: '🕒',
  amPm: '未知',
  dayPeriodEmoji: '❓',
};

const FALLBACK_SIMPLE_TIME_INFO: SimpleTimeInfo = {
  dayPeriod: '未知',
  time: '--:--',
  date: '----/--/--',
};

/**
 * 获取时间图标类型
 * @param timestamp Unix 时间戳（秒）
 * @param timezone 时区
 * @returns 时间图标类型
 */
export function getTimeIconType(timestamp: number | string | Date, timezone: string): string {
  try {
    const date = toValidDateTime(timestamp, timezone);
    if (!date) return 'default';
    const hour = date.hour;

    if (hour >= 0 && hour < 5) {
      return 'night';
    } else if (hour >= 5 && hour < 7) {
      return 'dawn';
    } else if (hour >= 7 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 14) {
      return 'noon';
    } else if (hour >= 14 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 19) {
      return 'dusk';
    } else if (hour >= 19 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  } catch (error) {
    console.error('获取时间图标类型失败:', error);
    return 'default';
  }
}

/**
 * 获取时间颜色
 * @param timestamp Unix 时间戳（秒）
 * @param timezone 时区
 * @returns 时间颜色
 */
export function getTimeColor(timestamp: number | string | Date, timezone: string): string {
  try {
    const date = toValidDateTime(timestamp, timezone);
    if (!date) return '#1890ff';
    const hour = date.hour;

    if (hour >= 0 && hour < 5) {
      return 'var(--time-deep-night, #1f1f1f)';
    } else if (hour >= 5 && hour < 7) {
      return 'var(--time-dawn, #ff7875)';
    } else if (hour >= 7 && hour < 10) {
      return 'var(--time-morning, #ffa940)';
    } else if (hour >= 10 && hour < 12) {
      return 'var(--time-forenoon, #fadb14)';
    } else if (hour >= 12 && hour < 14) {
      return 'var(--time-noon, #ff9c6e)';
    } else if (hour >= 14 && hour < 17) {
      return 'var(--time-afternoon, #40a9ff)';
    } else if (hour >= 17 && hour < 19) {
      return 'var(--time-dusk, #ff85c0)';
    } else if (hour >= 19 && hour < 22) {
      return 'var(--time-evening, #b37feb)';
    } else {
      return 'var(--time-night, #595959)';
    }
  } catch (error) {
    console.error('获取时间颜色失败:', error);
    return '#1890ff';
  }
}

/**
 * 获取时间信息
 * @param timestamp 时间戳
 * @param timezone 时区字符串
 * @returns 详细时间信息
 */
export function getTimeInfo(timestamp: number | string | Date, timezone: string): TimeInfo {
  if (!timezone || typeof timezone !== 'string') {
    console.error('Invalid timezone parameter for getTimeInfo', { timestamp, timezone });
    return FALLBACK_TIME_INFO;
  }

  try {
    const date = toValidDateTime(timestamp, timezone);
    if (!date) {
      return FALLBACK_TIME_INFO;
    }

    const hour = date.hour;

    let period = '';
    let description = '';
    let color = '';
    let icon = '';
    let amPm = '';
    let dayPeriodEmoji = '';

    if (hour >= 0 && hour < 5) {
      period = '深夜';
      description = '万籁俱寂，夜深人静';
      color = 'var(--time-deep-night, #1f1f1f)';
      icon = '🌃';
      amPm = '凌晨';
      dayPeriodEmoji = '🌃';
    } else if (hour >= 5 && hour < 7) {
      period = '黎明';
      description = '日出东方，万物初醒';
      color = 'var(--time-dawn, #ff7875)';
      icon = '🌅';
      amPm = '凌晨';
      dayPeriodEmoji = '🌅';
    } else if (hour >= 7 && hour < 10) {
      period = '早晨';
      description = '朝气蓬勃，一日之计';
      color = 'var(--time-morning, #ffa940)';
      icon = '🌞';
      amPm = '上午';
      dayPeriodEmoji = '🌄';
    } else if (hour >= 10 && hour < 12) {
      period = '上午';
      description = '日上三竿，精神焕发';
      color = 'var(--time-forenoon, #fadb14)';
      icon = '☀️';
      amPm = '上午';
      dayPeriodEmoji = '☀️';
    } else if (hour >= 12 && hour < 14) {
      period = '中午';
      description = '当午时分，阳光正好';
      color = 'var(--time-noon, #ff9c6e)';
      icon = '🌞';
      amPm = '中午';
      dayPeriodEmoji = '🌞';
    } else if (hour >= 14 && hour < 17) {
      period = '下午';
      description = '日渐西斜，余晖灿烂';
      color = 'var(--time-afternoon, #40a9ff)';
      icon = '⛅';
      amPm = '下午';
      dayPeriodEmoji = '⛅';
    } else if (hour >= 17 && hour < 19) {
      period = '傍晚';
      description = '夕阳西下，华灯初上';
      color = 'var(--time-dusk, #ff85c0)';
      icon = '🌇';
      amPm = '傍晚';
      dayPeriodEmoji = '🌇';
    } else if (hour >= 19 && hour < 22) {
      period = '晚上';
      description = '夜幕降临，繁星点点';
      color = 'var(--time-evening, #b37feb)';
      icon = '🌆';
      amPm = '晚上';
      dayPeriodEmoji = '🌙';
    } else {
      period = '深夜';
      description = '夜深人静，繁星满天';
      color = 'var(--time-night, #595959)';
      icon = '🌃';
      amPm = '深夜';
      dayPeriodEmoji = '🌌';
    }

    return {
      period,
      description,
      color,
      icon,
      amPm,
      dayPeriodEmoji,
    };
  } catch (error) {
    console.error('获取时间信息失败:', error);
    return FALLBACK_TIME_INFO;
  }
}

/**
 * 获取简化的时间信息
 * @param timestamp 时间戳
 * @param timezone 时区
 * @returns 简化的时间信息
 */
export function getSimpleTimeInfo(
  timestamp: number | string | Date,
  timezone: string
): SimpleTimeInfo {
  try {
    const dateTime = toValidDateTime(timestamp, timezone);
    if (!dateTime) {
      return FALLBACK_SIMPLE_TIME_INFO;
    }

    const timeInfo = getTimeInfo(Math.floor(dateTime.toSeconds()), timezone);

    return {
      dayPeriod: timeInfo.period,
      time: dateTime.toFormat('HH:mm'),
      date: dateTime.toFormat('yyyy-MM-dd'),
    };
  } catch (error) {
    console.error('获取简化时间信息失败:', error);
    return FALLBACK_SIMPLE_TIME_INFO;
  }
}

/**
 * 获取时间段名称
 * @param hour 小时 (0-23)
 * @returns 时间段名称
 */
export function getPeriodName(hour: number): string {
  if (hour >= 0 && hour < 5) return '深夜';
  if (hour >= 5 && hour < 7) return '黎明';
  if (hour >= 7 && hour < 10) return '早晨';
  if (hour >= 10 && hour < 12) return '上午';
  if (hour >= 12 && hour < 14) return '中午';
  if (hour >= 14 && hour < 17) return '下午';
  if (hour >= 17 && hour < 19) return '傍晚';
  if (hour >= 19 && hour < 22) return '晚上';
  return '深夜';
}

/**
 * 获取一天中的时间段
 * @param timestamp 时间戳
 * @param timezone 时区
 * @returns 时间段名称（早晨、中午、下午等）
 */
export function getDayPeriod(timestamp: number | string | Date, timezone: string): string {
  try {
    const date = toValidDateTime(timestamp, timezone);
    if (!date) return '未知';
    return getPeriodName(date.hour);
  } catch (error) {
    console.error('获取时间段失败:', error);
    return '未知';
  }
}
