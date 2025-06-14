'use client';

import { TimezoneState, TimezoneString, TimestampItem } from '@/types';
import { 
  formatCustom,
  generateFullStandardUTCTimezones,
  getCurrentTimestamp,
  timestampToDateTime 
} from '@/utils/datetime';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      setSelectedTimezones: (timezones: TimezoneString[]) => set({ selectedTimezones: timezones }),

      addTimezone: (timezone: TimezoneString) =>
        set(state => {
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
      setDefaultTimezones: (timezones: TimezoneString[]) => set({ defaultTimezones: timezones }),
      setDateFormat: (format: string) => set({ dateFormat: format }),
      setTimeFormat: (format: string) => set({ timeFormat: format }),
      
      // 时间戳相关方法
      addTimestamp: (timestamp: number) => 
        set(state => {
          // 验证时间戳是否在合理范围内
          const currentYear = timestampToDateTime(getCurrentTimestamp(), 'UTC').year;
          const timestampYear = timestampToDateTime(timestamp, 'UTC').year;

          // 检查时间戳是否在1970年到当前年份+100年的范围内
          if (timestampYear < 1970 || timestampYear > currentYear + 100) {
            // 如果时间戳不合理，不添加并返回当前状态
            return state;
          }

          // 检查是否已存在相同的时间戳，避免重复添加
          const isDuplicate = state.timestampItems.some(item => item.timestamp === timestamp);
          if (isDuplicate) {
            // 如果已存在相同时间戳，只更新激活的时间戳，不添加新项
            return {
              ...state,
              activeTimestamp: timestamp,
            };
          }

          // 创建新的时间戳项
          const newItem: TimestampItem = {
            id: getCurrentTimestamp().toString(),
            timestamp,
            label: formatCustom(timestamp, 'yyyy年MM月dd日 HH:mm:ss', 'Asia/Shanghai'),
          };

          // 如果没有选择时区，自动添加标准UTC时区
          const newState: Partial<TimezoneState> = {
            timestampItems: [...state.timestampItems, newItem],
            activeTimestamp: timestamp,
          };

          // 如果没有选择时区，自动添加标准UTC时区
          if (state.selectedTimezones.length === 0) {
            newState.selectedTimezones = generateFullStandardUTCTimezones();
          }

          return newState as TimezoneState;
        }),
        
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
    }
  )
);
