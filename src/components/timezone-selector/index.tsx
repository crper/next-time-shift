'use client';

import { useStyles } from '@/hooks';
import { useTimezoneStore } from '@/store';
import { Card, Divider, Typography } from 'antd';
import { memo } from 'react';
import TimezoneSearch from './TimezoneSearch';
import TimezoneActions from './TimezoneActions';

const { Text } = Typography;

interface TimezoneSelectorProps {
  onChange?: (timezones: string[]) => void;
}

/**
 * 时区选择器组件
 * 支持搜索、按地区分组、快速操作等功能
 */
const TimezoneSelector = memo(({ onChange }: TimezoneSelectorProps) => {
  const { selectedTimezones } = useTimezoneStore();
  const { styles, isMobile } = useStyles();

  return (
    <Card className="shadow-sm" variant="outlined">
      <div className="space-y-4">
        {/* 状态信息 */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Text strong style={{ fontSize: styles.fontSize(isMobile ? 'md' : 'lg') }}>
              已选择 {selectedTimezones.length} 个时区
            </Text>
          </div>
        </div>

        {/* 快速操作按钮组 */}
        <TimezoneActions onChange={onChange} />

        <Divider />

        {/* 时区选择器 */}
        <TimezoneSearch onChange={onChange} />

        {/* 底部提示 */}
        <div style={{ textAlign: 'center', paddingTop: styles.spacing('xs') }}>
          <Text type="secondary" style={{ fontSize: styles.fontSize('xs') }}>
            💡 支持搜索时区名称、偏移量、地区等关键词
          </Text>
        </div>
      </div>
    </Card>
  );
});

TimezoneSelector.displayName = 'TimezoneSelector';

export default TimezoneSelector;