/**
 * 全局类型定义
 */

// 基础类型
export type Timestamp = number;
export type TimezoneString = string;
export type ComponentSize = 'small' | 'middle' | 'large';

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';
export type ActualTheme = 'light' | 'dark';

// 时间戳项目类型
export interface TimestampItem {
  id: string;
  timestamp: Timestamp;
  label: string;
  description?: string;
  createdAt?: Timestamp;
}

// 时区信息类型
export interface TimezoneInfo {
  name: string;
  abbreviation: string;
  description?: string;
  offset: number;
  offsetString: string;
  isDST: boolean;
  country?: string;
  region?: string;
}

// 时间信息类型
export interface TimeInfo {
  period: string;
  description: string;
  color: string;
  icon: string;
  amPm?: string;
  dayPeriodEmoji?: string;
}

// 响应式断点类型
export interface BreakpointMap {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
}

// 模态框配置类型
export interface ModalConfig {
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

// 通知配置类型
export interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

// 消息类型
export interface MessageInstance {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
  info: (content: string) => void;
  loading: (content: string) => void;
}

// 模态框类型
export interface ModalInstance {
  confirm: (config: ModalConfig) => void;
  info: (config: ModalConfig) => void;
  success: (config: ModalConfig) => void;
  error: (config: ModalConfig) => void;
  warning: (config: ModalConfig) => void;
}

// 通知类型
export interface NotificationInstance {
  success: (config: NotificationConfig) => void;
  error: (config: NotificationConfig) => void;
  warning: (config: NotificationConfig) => void;
  info: (config: NotificationConfig) => void;
}

// 静态方法类型
export interface StaticMethods {
  message: MessageInstance;
  modal: ModalInstance;
  notification: NotificationInstance;
}

// 时区状态类型
export interface TimezoneState {
  // 时区相关状态
  selectedTimezones: TimezoneString[];
  defaultTimezones: TimezoneString[];
  dateFormat: string;
  timeFormat: string;
  
  // 时间戳相关状态
  timestampItems: TimestampItem[];
  activeTimestamp: number | null;
  
  // 时区相关方法
  setSelectedTimezones: (timezones: TimezoneString[]) => void;
  addTimezone: (timezone: TimezoneString) => void;
  removeTimezone: (timezone: TimezoneString) => void;
  clearTimezones: () => void;
  toggleTimezone: (timezone: TimezoneString) => void;
  setDefaultTimezones: (timezones: TimezoneString[]) => void;
  setDateFormat: (format: string) => void;
  setTimeFormat: (format: string) => void;
  
  // 时间戳相关方法
  addTimestamp: (timestamp: number) => void;
  removeTimestamp: (id: string) => void;
  setActiveTimestamp: (timestamp: number | null) => void;
  clearTimestamps: () => void;
}

// 主题状态类型
export interface ThemeState {
  themeMode: ThemeMode;
  actualTheme: ActualTheme;
  setThemeMode: (mode: ThemeMode) => void;
}

// 消息状态类型
export interface MessageState {
  message: MessageInstance | null;
  modal: ModalInstance | null;
  notification: NotificationInstance | null;
  setStaticMethods: (methods: StaticMethods) => void;
}

// 错误类型已移至 utils/error-handler.ts
import { AppError } from '@/utils/error-handler';
export type { AppError };

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

// 分页类型
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

// 排序类型
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

// 筛选类型
export interface FilterConfig {
  field: string;
  value: unknown;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
}

// 表格列配置类型
export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: Record<string, unknown>, index: number) => React.ReactNode;
}

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'number' | 'textarea' | 'switch' | 'radio' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: unknown }>;
  rules?: Array<Record<string, unknown>>;
  dependencies?: string[];
}

// 导出功能类型
export interface ExportConfig {
  format: 'csv' | 'xlsx' | 'json';
  filename?: string;
  columns?: string[];
  data: Array<Record<string, unknown>>;
}

// 性能监控类型
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  timestamp: Timestamp;
}

// 用户偏好设置类型
export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  timezone: TimezoneString;
  dateFormat: string;
  timeFormat: string;
  autoSave: boolean;
  notifications: boolean;
}
