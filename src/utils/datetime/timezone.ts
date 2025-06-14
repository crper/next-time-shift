/**
 * 时区工具
 * 提供完整的时区处理功能
 */

import { DateTime } from 'luxon';
import { normalizeTimestamp } from './core';

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

/**
 * 时区名称映射，包含中英文名称、国家、缩写和描述信息
 */
const timezoneNameMapping: Record<
  string,
  {
    chinese: string;
    english: string;
    country?: string;
    abbreviation?: string;
    description?: string;
  }
> = {
  // 亚洲 - Asia
  'Asia/Shanghai': {
    chinese: '上海',
    english: 'Shanghai',
    country: '中国',
    abbreviation: 'CST',
    description: '中国标准时间，覆盖中国大陆地区',
  },
  'Asia/Beijing': {
    chinese: '北京',
    english: 'Beijing',
    country: '中国',
    abbreviation: 'CST',
    description: '中国首都时间，与上海时区相同',
  },
  'Asia/Hong_Kong': {
    chinese: '香港',
    english: 'Hong Kong',
    country: '中国',
    abbreviation: 'HKT',
    description: '香港时间，重要的国际金融中心',
  },
  'Asia/Macau': {
    chinese: '澳门',
    english: 'Macau',
    country: '中国',
    abbreviation: 'MOT',
    description: '澳门时间，与香港时间相同',
  },
  'Asia/Taipei': {
    chinese: '台北',
    english: 'Taipei',
    country: '中国台湾',
    abbreviation: 'CST',
    description: '台湾标准时间，科技产业重镇',
  },

  'Asia/Tokyo': {
    chinese: '东京',
    english: 'Tokyo',
    country: '日本',
    abbreviation: 'JST',
    description: '日本标准时间，亚洲重要经济中心',
  },
  'Asia/Seoul': {
    chinese: '首尔',
    english: 'Seoul',
    country: '韩国',
    abbreviation: 'KST',
    description: '韩国标准时间，K-POP和科技中心',
  },
  'Asia/Singapore': {
    chinese: '新加坡',
    english: 'Singapore',
    country: '新加坡',
    abbreviation: 'SGT',
    description: '新加坡标准时间，东南亚金融枢纽',
  },
  'Asia/Kuala_Lumpur': {
    chinese: '吉隆坡',
    english: 'Kuala Lumpur',
    country: '马来西亚',
    abbreviation: 'MYT',
    description: '马来西亚时间，东南亚商业中心',
  },
  'Asia/Bangkok': {
    chinese: '曼谷',
    english: 'Bangkok',
    country: '泰国',
    abbreviation: 'ICT',
    description: '印度支那时间，东南亚旅游胜地',
  },
  'Asia/Jakarta': {
    chinese: '雅加达',
    english: 'Jakarta',
    country: '印度尼西亚',
    abbreviation: 'WIB',
    description: '西印尼时间，东南亚最大城市',
  },
  'Asia/Manila': {
    chinese: '马尼拉',
    english: 'Manila',
    country: '菲律宾',
    abbreviation: 'PHT',
    description: '菲律宾标准时间，重要的航运中心',
  },

  'Asia/Ho_Chi_Minh': {
    chinese: '胡志明市',
    english: 'Ho Chi Minh City',
    country: '越南',
    abbreviation: 'ICT',
    description: '越南最大经济中心，高速发展城市',
  },
  'Asia/Hanoi': {
    chinese: '河内',
    english: 'Hanoi',
    country: '越南',
    abbreviation: 'ICT',
    description: '越南首都，政治文化中心',
  },

  'Asia/Dubai': {
    chinese: '迪拜',
    english: 'Dubai',
    country: '阿联酋',
    abbreviation: 'GST',
    description: '海湾标准时间，中东商业枢纽',
  },
  'Asia/Riyadh': {
    chinese: '利雅得',
    english: 'Riyadh',
    country: '沙特阿拉伯',
    abbreviation: 'AST',
    description: '阿拉伯标准时间，石油工业中心',
  },
  'Asia/Kuwait': {
    chinese: '科威特',
    english: 'Kuwait',
    country: '科威特',
    abbreviation: 'AST',
    description: '科威特标准时间，重要的石油出口国',
  },
  'Asia/Tehran': {
    chinese: '德黑兰',
    english: 'Tehran',
    country: '伊朗',
    abbreviation: 'IRST',
    description: '伊朗标准时间，古老的波斯文明',
  },

  'Asia/Kolkata': {
    chinese: '加尔各答',
    english: 'Kolkata',
    country: '印度',
    abbreviation: 'IST',
    description: '印度标准时间，IT服务业重镇',
  },
  'Asia/Mumbai': {
    chinese: '孟买',
    english: 'Mumbai',
    country: '印度',
    abbreviation: 'IST',
    description: '印度金融之都，宝莱坞中心',
  },
  'Asia/Delhi': {
    chinese: '德里',
    english: 'Delhi',
    country: '印度',
    abbreviation: 'IST',
    description: '印度首都新德里所在地',
  },

  // 欧洲 - Europe
  'Europe/London': {
    chinese: '伦敦',
    english: 'London',
    country: '英国',
    abbreviation: 'GMT',
    description: '格林威治标准时间，全球金融中心',
  },
  'Europe/Dublin': {
    chinese: '都柏林',
    english: 'Dublin',
    country: '爱尔兰',
    abbreviation: 'GMT',
    description: '爱尔兰标准时间，欧洲科技中心',
  },
  'Europe/Paris': {
    chinese: '巴黎',
    english: 'Paris',
    country: '法国',
    abbreviation: 'CET',
    description: '中欧时间，时尚和艺术之都',
  },
  'Europe/Berlin': {
    chinese: '柏林',
    english: 'Berlin',
    country: '德国',
    abbreviation: 'CET',
    description: '德国首都，欧洲经济引擎',
  },
  'Europe/Rome': {
    chinese: '罗马',
    english: 'Rome',
    country: '意大利',
    abbreviation: 'CET',
    description: '永恒之城，欧洲历史文化中心',
  },
  'Europe/Madrid': {
    chinese: '马德里',
    english: 'Madrid',
    country: '西班牙',
    abbreviation: 'CET',
    description: '西班牙首都，伊比利亚半岛中心',
  },
  'Europe/Amsterdam': {
    chinese: '阿姆斯特丹',
    english: 'Amsterdam',
    country: '荷兰',
    abbreviation: 'CET',
    description: '荷兰首都，欧洲重要港口城市',
  },
  'Europe/Zurich': {
    chinese: '苏黎世',
    english: 'Zurich',
    country: '瑞士',
    abbreviation: 'CET',
    description: '瑞士金融中心，私人银行业务',
  },
  'Europe/Vienna': {
    chinese: '维也纳',
    english: 'Vienna',
    country: '奥地利',
    abbreviation: 'CET',
    description: '音乐之都，欧洲文化中心',
  },
  'Europe/Stockholm': {
    chinese: '斯德哥尔摩',
    english: 'Stockholm',
    country: '瑞典',
    abbreviation: 'CET',
    description: '北欧设计和创新中心',
  },
  'Europe/Moscow': {
    chinese: '莫斯科',
    english: 'Moscow',
    country: '俄罗斯',
    abbreviation: 'MSK',
    description: '莫斯科标准时间，俄罗斯政治中心',
  },

  // 北美洲 - North America
  'America/New_York': {
    chinese: '纽约',
    english: 'New York',
    country: '美国',
    abbreviation: 'EST',
    description: '东部标准时间，全球金融中心',
  },
  'America/Chicago': {
    chinese: '芝加哥',
    english: 'Chicago',
    country: '美国',
    abbreviation: 'CST',
    description: '中部标准时间，美国中部商业中心',
  },
  'America/Denver': {
    chinese: '丹佛',
    english: 'Denver',
    country: '美国',
    abbreviation: 'MST',
    description: '山地标准时间，洛基山脉地区',
  },
  'America/Los_Angeles': {
    chinese: '洛杉矶',
    english: 'Los Angeles',
    country: '美国',
    abbreviation: 'PST',
    description: '太平洋标准时间，好莱坞所在地',
  },
  'America/Anchorage': {
    chinese: '安克雷奇',
    english: 'Anchorage',
    country: '美国',
    abbreviation: 'AKST',
    description: '阿拉斯加标准时间，北极地区',
  },
  'America/Honolulu': {
    chinese: '檀香山',
    english: 'Honolulu',
    country: '美国',
    abbreviation: 'HST',
    description: '夏威夷标准时间，太平洋度假胜地',
  },
  'America/Toronto': {
    chinese: '多伦多',
    english: 'Toronto',
    country: '加拿大',
    abbreviation: 'EST',
    description: '加拿大最大城市，金融中心',
  },
  'America/Vancouver': {
    chinese: '温哥华',
    english: 'Vancouver',
    country: '加拿大',
    abbreviation: 'PST',
    description: '加拿大西海岸，宜居城市',
  },

  // 南美洲 - South America
  'America/Sao_Paulo': {
    chinese: '圣保罗',
    english: 'São Paulo',
    country: '巴西',
    abbreviation: 'BRT',
    description: '巴西时间，南美最大经济中心',
  },
  'America/Argentina/Buenos_Aires': {
    chinese: '布宜诺斯艾利斯',
    english: 'Buenos Aires',
    country: '阿根廷',
    abbreviation: 'ART',
    description: '阿根廷标准时间，南美文化中心',
  },

  // 大洋洲 - Oceania
  'Australia/Sydney': {
    chinese: '悉尼',
    english: 'Sydney',
    country: '澳大利亚',
    abbreviation: 'AEST',
    description: '澳洲东部标准时间，著名港口城市',
  },
  'Australia/Melbourne': {
    chinese: '墨尔本',
    english: 'Melbourne',
    country: '澳大利亚',
    abbreviation: 'AEST',
    description: '澳洲文化之都，咖啡文化中心',
  },
  'Australia/Perth': {
    chinese: '珀斯',
    english: 'Perth',
    country: '澳大利亚',
    abbreviation: 'AWST',
    description: '澳洲西部标准时间，矿业中心',
  },
  'Pacific/Auckland': {
    chinese: '奥克兰',
    english: 'Auckland',
    country: '新西兰',
    abbreviation: 'NZST',
    description: '新西兰标准时间，帆船之都',
  },

  // 非洲 - Africa
  'Africa/Cairo': {
    chinese: '开罗',
    english: 'Cairo',
    country: '埃及',
    abbreviation: 'EET',
    description: '东欧时间，古埃及文明中心',
  },
  'Africa/Johannesburg': {
    chinese: '约翰内斯堡',
    english: 'Johannesburg',
    country: '南非',
    abbreviation: 'SAST',
    description: '南非标准时间，黄金之城',
  },
  'Africa/Lagos': {
    chinese: '拉各斯',
    english: 'Lagos',
    country: '尼日利亚',
    abbreviation: 'WAT',
    description: '西非时间，西非经济中心',
  },

  // 标准时区
  UTC: {
    chinese: '协调世界时',
    english: 'UTC',
    country: '国际标准',
    abbreviation: 'UTC',
    description: '国际标准时间，全球时间基准',
  },
  GMT: {
    chinese: '格林威治标准时间',
    english: 'GMT',
    country: '国际标准',
    abbreviation: 'GMT',
    description: '格林威治标准时间，历史时间基准',
  },
  'Etc/UTC': {
    chinese: '协调世界时',
    english: 'UTC',
    country: '国际标准',
    abbreviation: 'UTC',
    description: '国际标准时间，全球时间基准',
  },
  'Etc/GMT': {
    chinese: '格林威治标准时间',
    english: 'GMT',
    country: '国际标准',
    abbreviation: 'GMT',
    description: '格林威治标准时间，历史时间基准',
  },

  // 常用的 Etc/GMT 时区映射
  'Etc/GMT+12': {
    chinese: '标准时区 UTC-12',
    english: 'UTC-12',
    country: '国际标准',
    abbreviation: 'UTC-12',
    description: '国际日期变更线西侧时区',
  },
  'Etc/GMT+11': {
    chinese: '标准时区 UTC-11',
    english: 'UTC-11',
    country: '国际标准',
    abbreviation: 'UTC-11',
    description: '太平洋标准时区',
  },
  'Etc/GMT+10': {
    chinese: '标准时区 UTC-10',
    english: 'UTC-10',
    country: '国际标准',
    abbreviation: 'UTC-10',
    description: '夏威夷-阿留申标准时区',
  },
  'Etc/GMT+9': {
    chinese: '标准时区 UTC-9',
    english: 'UTC-9',
    country: '国际标准',
    abbreviation: 'UTC-9',
    description: '阿拉斯加标准时区',
  },
  'Etc/GMT+8': {
    chinese: '标准时区 UTC-8',
    english: 'UTC-8',
    country: '国际标准',
    abbreviation: 'UTC-8',
    description: '太平洋标准时区',
  },
  'Etc/GMT+7': {
    chinese: '标准时区 UTC-7',
    english: 'UTC-7',
    country: '国际标准',
    abbreviation: 'UTC-7',
    description: '山地标准时区',
  },
  'Etc/GMT+6': {
    chinese: '标准时区 UTC-6',
    english: 'UTC-6',
    country: '国际标准',
    abbreviation: 'UTC-6',
    description: '中部标准时区',
  },
  'Etc/GMT+5': {
    chinese: '标准时区 UTC-5',
    english: 'UTC-5',
    country: '国际标准',
    abbreviation: 'UTC-5',
    description: '东部标准时区',
  },
  'Etc/GMT+4': {
    chinese: '标准时区 UTC-4',
    english: 'UTC-4',
    country: '国际标准',
    abbreviation: 'UTC-4',
    description: '大西洋标准时区',
  },
  'Etc/GMT+3': {
    chinese: '标准时区 UTC-3',
    english: 'UTC-3',
    country: '国际标准',
    abbreviation: 'UTC-3',
    description: '巴西标准时区',
  },
  'Etc/GMT+2': {
    chinese: '标准时区 UTC-2',
    english: 'UTC-2',
    country: '国际标准',
    abbreviation: 'UTC-2',
    description: '大西洋中部时区',
  },
  'Etc/GMT+1': {
    chinese: '标准时区 UTC-1',
    english: 'UTC-1',
    country: '国际标准',
    abbreviation: 'UTC-1',
    description: '亚速尔群岛时区',
  },
  'Etc/GMT-1': {
    chinese: '标准时区 UTC+1',
    english: 'UTC+1',
    country: '国际标准',
    abbreviation: 'UTC+1',
    description: '中欧标准时区',
  },
  'Etc/GMT-2': {
    chinese: '标准时区 UTC+2',
    english: 'UTC+2',
    country: '国际标准',
    abbreviation: 'UTC+2',
    description: '东欧标准时区',
  },
  'Etc/GMT-3': {
    chinese: '标准时区 UTC+3',
    english: 'UTC+3',
    country: '国际标准',
    abbreviation: 'UTC+3',
    description: '莫斯科标准时区',
  },
  'Etc/GMT-4': {
    chinese: '标准时区 UTC+4',
    english: 'UTC+4',
    country: '国际标准',
    abbreviation: 'UTC+4',
    description: '海湾标准时区',
  },
  'Etc/GMT-5': {
    chinese: '标准时区 UTC+5',
    english: 'UTC+5',
    country: '国际标准',
    abbreviation: 'UTC+5',
    description: '巴基斯坦标准时区',
  },
  'Etc/GMT-6': {
    chinese: '标准时区 UTC+6',
    english: 'UTC+6',
    country: '国际标准',
    abbreviation: 'UTC+6',
    description: '中亚标准时区',
  },
  'Etc/GMT-7': {
    chinese: '标准时区 UTC+7',
    english: 'UTC+7',
    country: '国际标准',
    abbreviation: 'UTC+7',
    description: '印度支那标准时区',
  },
  'Etc/GMT-8': {
    chinese: '标准时区 UTC+8',
    english: 'UTC+8',
    country: '国际标准',
    abbreviation: 'UTC+8',
    description: '中国标准时区',
  },
  'Etc/GMT-9': {
    chinese: '标准时区 UTC+9',
    english: 'UTC+9',
    country: '国际标准',
    abbreviation: 'UTC+9',
    description: '日本标准时区',
  },
  'Etc/GMT-10': {
    chinese: '标准时区 UTC+10',
    english: 'UTC+10',
    country: '国际标准',
    abbreviation: 'UTC+10',
    description: '澳洲东部标准时区',
  },
  'Etc/GMT-11': {
    chinese: '标准时区 UTC+11',
    english: 'UTC+11',
    country: '国际标准',
    abbreviation: 'UTC+11',
    description: '太平洋标准时区',
  },
  'Etc/GMT-12': {
    chinese: '标准时区 UTC+12',
    english: 'UTC+12',
    country: '国际标准',
    abbreviation: 'UTC+12',
    description: '国际日期变更线东侧时区',
  },

  // ... 保留现有的其他时区映射，但需要添加abbreviation和description字段
  'Asia/Karachi': {
    chinese: '卡拉奇',
    english: 'Karachi',
    country: '巴基斯坦',
    abbreviation: 'PKT',
    description: '巴基斯坦标准时间',
  },
  'Asia/Dhaka': {
    chinese: '达卡',
    english: 'Dhaka',
    country: '孟加拉国',
    abbreviation: 'BST',
    description: '孟加拉国标准时间',
  },
  'Asia/Yangon': {
    chinese: '仰光',
    english: 'Yangon',
    country: '缅甸',
    abbreviation: 'MMT',
    description: '缅甸标准时间',
  },
  'Asia/Vladivostok': {
    chinese: '符拉迪沃斯托克',
    english: 'Vladivostok',
    country: '俄罗斯',
    abbreviation: 'VLAT',
    description: '符拉迪沃斯托克时间',
  },
  'Europe/Istanbul': {
    chinese: '伊斯坦布尔',
    english: 'Istanbul',
    country: '土耳其',
    abbreviation: 'TRT',
    description: '土耳其时间，欧亚文化交汇点',
  },
  'America/Mexico_City': {
    chinese: '墨西哥城',
    english: 'Mexico City',
    country: '墨西哥',
    abbreviation: 'CST',
    description: '墨西哥中部时间',
  },
  'Pacific/Honolulu': {
    chinese: '檀香山',
    english: 'Honolulu',
    country: '美国',
    abbreviation: 'HST',
    description: '夏威夷标准时间',
  },

  // ... existing code ...
};

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
    const ts = normalizeTimestamp(timestamp);
    const fromDateTime = DateTime.fromSeconds(ts).setZone(fromTimezone);
    const toDateTime = fromDateTime.setZone(toTimezone);
    return Math.floor(toDateTime.toSeconds());
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
    const englishName = mapping?.english || (info.name.includes('(') ? info.name.substring(info.name.indexOf('(') + 1, info.name.lastIndexOf(')')) : info.name);

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
/**
 * 搜索时区
 * @param query 搜索关键词
 * @returns 匹配的时区选项数组
 */
export function searchTimezones(query: string): TimezoneOption[] {
  if (!query || query.trim() === '') {
    return getCommonTimezones();
  }

  const normalizedQuery = query.toLowerCase().trim();
  // 使用包含标准UTC时区的完整时区列表进行搜索
  const allTimezones = getAllTimezonesWithUTC();

  return allTimezones.filter(tz => {
    return (
      tz.key.toLowerCase().includes(normalizedQuery) ||
      tz.name.toLowerCase().includes(normalizedQuery) ||
      tz.offset.includes(normalizedQuery) ||
      tz.region?.toLowerCase().includes(normalizedQuery) ||
      tz.chineseName?.toLowerCase().includes(normalizedQuery) ||
      tz.englishName?.toLowerCase().includes(normalizedQuery) ||
      tz.country?.toLowerCase().includes(normalizedQuery) ||
      // 增强UTC搜索支持
      (normalizedQuery === 'utc' &&
        (tz.key === 'UTC' ||
          tz.key.startsWith('Etc/GMT') ||
          tz.englishName?.toLowerCase().includes('utc') ||
          tz.name.toLowerCase().includes('utc')))
    );
  });
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
    // 解析偏移字符串为分钟数以便比较
    const offsetToMinutes = (offset: string): number => {
      const match = offset.match(/([+-])(\d{2}):(\d{2})/);
      if (!match) return 0;

      const [, sign, hours, minutes] = match;
      const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      return sign === '-' ? -totalMinutes : totalMinutes;
    };

    const offsetA = offsetToMinutes(a.offset);
    const offsetB = offsetToMinutes(b.offset);

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
  for (let offset = -12; offset <= 12; offset++) {
    const offsetStr =
      offset >= 0
        ? `+${offset.toString().padStart(2, '0')}:00`
        : `${offset.toString().padStart(3, '0')}:00`;
    const displayOffset = offset >= 0 ? `UTC+${Math.abs(offset)}` : `UTC${offset}`;

    // 生成时区键值
    let timezoneKey: string;
    if (offset === 0) {
      timezoneKey = 'UTC';
    } else {
      // 使用Etc/GMT格式，注意IANA约定：符号相反
      // UTC+8 对应 Etc/GMT-8，UTC-8 对应 Etc/GMT+8
      timezoneKey = `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`;
    }

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
  for (let offset = -12; offset <= 12; offset++) {
    if (offset === 0) {
      timezones.push('UTC');
    } else {
      // 使用Etc/GMT格式，注意IANA约定：符号相反
      // UTC+8 对应 Etc/GMT-8，UTC-8 对应 Etc/GMT+8
      timezones.push(`Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`);
    }
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

  return commonOffsets.map(offset => {
    if (offset === 0) {
      return 'UTC';
    } else {
      // 使用Etc/GMT格式，注意IANA约定：符号相反
      // UTC+8 对应 Etc/GMT-8，UTC-8 对应 Etc/GMT+8
      return `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`;
    }
  });
}
