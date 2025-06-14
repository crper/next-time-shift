'use client';

import { useStyles } from '@/hooks';
import { TimezoneOption } from '@/utils/datetime';
import { Select, Typography } from 'antd';
import { memo } from 'react';

const { Text } = Typography;
const { Option } = Select;

interface TimezoneGroupProps {
  timezones: TimezoneOption[];
}

/**
 * 时区分组组件
 * 渲染一组时区选项
 */
const TimezoneGroup = memo(({ timezones }: TimezoneGroupProps) => {
  const { componentStyles, styles } = useStyles();

  return (
    <>
      {timezones.map(tz => (
        <Option key={tz.key} value={tz.key}>
          <div style={componentStyles.flexContainer}>
            <span>
              {tz.name}
            </span>
            <Text type="secondary" style={{ fontSize: styles.fontSize('xs') }}>
              {tz.offset}
            </Text>
          </div>
        </Option>
      ))}
    </>
  );
});

TimezoneGroup.displayName = 'TimezoneGroup';

export default TimezoneGroup;