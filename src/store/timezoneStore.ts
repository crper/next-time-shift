'use client';

import { AddTimestampResult, TimestampItem, TimezoneState, TimezoneString } from '@/types';
import {
  formatCustom,
  generateFullStandardUTCTimezones,
  getCurrentTimestamp,
  isValidTimezone,
  timestampToDateTime,
  tryNormalizeTimestamp,
} from '@/utils/datetime';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MIN_VALID_YEAR = 1970;
const MAX_YEAR_OFFSET = 100;

const sanitizeTimezones = (timezones: TimezoneString[]): TimezoneString[] => {
  return Array.from(new Set(timezones.filter(timezone => isValidTimezone(timezone))));
};

const createTimestampItemId = (timestamp: number): string => {
  return `${timestamp}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * 时区状态管理 Hook
 * 用于在应用中统一管理时区选择状态、时区相关配置以及时间戳数据
 */
export const useTimezoneStore = create<TimezoneState>()(
  persist(
    set => ({
      // 时区相关状态 - 初始状态：无选中时区
      selectedTimezones: [],

      // 默认配置 - 初始为空数组，不再使用预设的标准UTC时区
      defaultTimezones: [],
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',

      // 时间戳相关状态
      timestampItems: [],
      activeTimestamp: null,

      // 时区操作方法
      setSelectedTimezones: (timezones: TimezoneString[]) =>
        set({ selectedTimezones: sanitizeTimezones(timezones) }),

      addTimezone: (timezone: TimezoneString) =>
        set(state => {
          if (!isValidTimezone(timezone)) {
            return state;
          }

          // 如果已包含该时区，不做改变
          if (state.selectedTimezones.includes(timezone)) {
            return state;
          }

          return {
            selectedTimezones: [...state.selectedTimezones, timezone],
          };
        }),

      removeTimezone: (timezone: TimezoneString) =>
        set(state => ({
          selectedTimezones: state.selectedTimezones.filter(tz => tz !== timezone),
        })),

      toggleTimezone: (timezone: TimezoneString) =>
        set(state => {
          if (!isValidTimezone(timezone)) {
            return state;
          }

          const isSelected = state.selectedTimezones.includes(timezone);
          if (isSelected) {
            return {
              selectedTimezones: state.selectedTimezones.filter(tz => tz !== timezone),
            };
          } else {
            return {
              selectedTimezones: [...state.selectedTimezones, timezone],
            };
          }
        }),

      clearTimezones: () => {
        // 完全清空所有选择的时区
        set({ selectedTimezones: [] });
      },

      // 配置操作方法
      setDefaultTimezones: (timezones: TimezoneString[]) =>
        set({ defaultTimezones: sanitizeTimezones(timezones) }),
      setDateFormat: (format: string) => set({ dateFormat: format }),
      setTimeFormat: (format: string) => set({ timeFormat: format }),

      // 时间戳相关方法
      addTimestamp: (timestamp: number) => {
        let result: AddTimestampResult = 'invalid';

        set(state => {
          const normalizedTimestamp = tryNormalizeTimestamp(timestamp);
          if (normalizedTimestamp === null) {
            result = 'invalid';
            return state;
          }

          // 验证时间戳是否在合理范围内
          const currentYear = timestampToDateTime(getCurrentTimestamp(), 'UTC').year;
          const timestampYear = timestampToDateTime(normalizedTimestamp, 'UTC').year;

          // 检查时间戳是否在1970年到当前年份+100年的范围内
          if (
            !Number.isFinite(timestampYear) ||
            timestampYear < MIN_VALID_YEAR ||
            timestampYear > currentYear + MAX_YEAR_OFFSET
          ) {
            result = 'invalid';
            return state;
          }

          // 检查是否已存在相同的时间戳，避免重复添加
          const isDuplicate = state.timestampItems.some(
            item => item.timestamp === normalizedTimestamp
          );
          if (isDuplicate) {
            result = 'duplicate';
            return {
              ...state,
              activeTimestamp: normalizedTimestamp,
            };
          }

          // 创建新的时间戳项
          const newItem: TimestampItem = {
            id: createTimestampItemId(normalizedTimestamp),
            timestamp: normalizedTimestamp,
            label: formatCustom(normalizedTimestamp, 'yyyy年MM月dd日 HH:mm:ss', 'Asia/Shanghai'),
          };

          result = 'added';
          return {
            ...state,
            timestampItems: [...state.timestampItems, newItem],
            activeTimestamp: normalizedTimestamp,
            selectedTimezones:
              state.selectedTimezones.length > 0
                ? state.selectedTimezones
                : generateFullStandardUTCTimezones(),
          };
        });

        return result;
      },

      removeTimestamp: (id: string) =>
        set(state => {
          const filtered = state.timestampItems.filter(item => item.id !== id);

          // 如果删除的是当前选中的时间戳，则选择列表中的第一个时间戳
          const deletedItem = state.timestampItems.find(item => item.id === id);
          let newActiveTimestamp = state.activeTimestamp;

          if (deletedItem && deletedItem.timestamp === state.activeTimestamp) {
            newActiveTimestamp = filtered.length > 0 ? filtered[0].timestamp : null;
          }

          return {
            timestampItems: filtered,
            activeTimestamp: newActiveTimestamp,
          };
        }),

      setActiveTimestamp: (timestamp: number | null) => set({ activeTimestamp: timestamp }),

      clearTimestamps: () => set({ timestampItems: [], activeTimestamp: null }),
    }),
    {
      name: 'timezone-storage',
      onRehydrateStorage: () => state => {
        if (!state) return;

        const sanitizedTimezones = sanitizeTimezones(state.selectedTimezones);
        if (sanitizedTimezones.length !== state.selectedTimezones.length) {
          state.setSelectedTimezones(sanitizedTimezones);
        }
      },
    }
  )
);
