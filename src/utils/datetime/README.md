# DateTime 日期时间工具库

这个工具库提供了全面的日期、时间和时区处理功能，是对原有 date-tools 的重构和增强版本。

## 功能特性

- 核心日期时间处理 (core.ts)
- 时间段和时间状态处理 (period.ts)
- 日期时间格式化工具 (formatter.ts)
- 时区处理和转换工具 (timezone.ts)

## 使用指南

### 导入方式

```typescript
// 导入所有功能
import * as DateTime from '@/utils/datetime';

// 按需导入特定功能
import { formatDateTime, getTimeInfo } from '@/utils/datetime';
```

### 核心功能 (core.ts)

处理时间戳、日期转换和基础日期运算：

```typescript
// 标准化时间戳
const timestamp = normalizeTimestamp('2023-01-01 12:00:00'); // 秒级时间戳

// 转换为 DateTime 对象
const dateTime = timestampToDateTime(timestamp, 'Asia/Shanghai');

// 计算时间差
const duration = calculateDuration(startTime, endTime);

// 日期判断
const today = isToday(timestamp, 'Asia/Shanghai');
```

### 时间段功能 (period.ts)

获取时间段信息和状态：

```typescript
// 获取时间段信息
const timeInfo = getTimeInfo(timestamp, 'Asia/Shanghai');
// 结果: { period: '下午', description: '日渐西斜，余晖灿烂', color: '...', icon: '⛅', ... }

// 获取简化的时间信息
const simpleInfo = getSimpleTimeInfo(timestamp, 'Asia/Shanghai');
// 结果: { dayPeriod: '下午', time: '15:30', date: '2023-01-01' }

// 获取时间段
const period = getDayPeriod(timestamp, 'Asia/Shanghai'); // '下午'
```

### 格式化功能 (formatter.ts)

格式化日期时间为各种格式：

```typescript
// 基础格式化
const date = formatDate(timestamp, 'Asia/Shanghai'); // '2023-01-01'
const time = formatTime(timestamp, 'Asia/Shanghai'); // '15:30:00'
const dateTime = formatDateTime(timestamp, 'Asia/Shanghai'); // '2023-01-01 15:30:00'

// 自定义格式
const custom = formatCustom(timestamp, 'yyyy年MM月dd日 HH:mm', 'Asia/Shanghai');

// 相对时间
const relative = formatRelative(timestamp); // '3小时前'

// 带时间段的格式化
const withPeriod = formatTimeWithPeriod(timestamp, 'Asia/Shanghai'); // '下午 15:30'
```

### 时区功能 (timezone.ts)

处理时区信息和转换：

```typescript
// 验证时区
const isValid = isValidTimezone('Asia/Shanghai'); // true

// 获取时区信息
const tzInfo = getTimezoneInfo('Asia/Shanghai');

// 时区转换
const convertedTime = convertTimezone(timestamp, 'Asia/Shanghai', 'America/New_York');

// 获取时区列表
const allTimezones = getAllTimezones();
const commonTimezones = getCommonTimezones();

// 搜索时区
const searchResults = searchTimezones('new york');
```

## 与原 date-tools 的区别

1. 更清晰的模块化分组，按功能职责划分
2. 统一的参数顺序和命名约定
3. 增强的类型安全性和错误处理
4. 新增多项实用功能，如更全面的格式化选项等
5. 更好的文档和示例

## 注意事项

- 所有时间戳都使用秒级时间戳（Unix timestamp）
- 时区必须是有效的 IANA 时区名称（如 'Asia/Shanghai'）
- 不同模块的函数可能有参数顺序差异，请参考函数文档
