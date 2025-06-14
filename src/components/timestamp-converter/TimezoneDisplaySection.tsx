'use client';

import { useResponsive } from '@/hooks';
import { GlobalOutlined } from '@ant-design/icons';
import { Card, Divider, Typography } from 'antd';
import TimezoneResults from '../TimezoneResults';
import TimezoneSelector from '../TimezoneSelector';

const { Title } = Typography;

interface TimezoneDisplaySectionProps {
  timestamp: number | null;
  selectedTimezones: string[];
  onTimezoneChange: (timezones: string[]) => void;
}

/**
 * 时区显示区域组件
 * 包含时区选择器和时区结果显示
 */
export default function TimezoneDisplaySection({
  timestamp,
  selectedTimezones,
  onTimezoneChange,
}: TimezoneDisplaySectionProps) {
  const { isMobile } = useResponsive();

  return (
    <Card size="small" variant="outlined">
      <Card
        size="small"
        title={
          <Title level={5} style={{ margin: 0 }}>
            <GlobalOutlined style={{ marginRight: 8 }} />
            时区时间
          </Title>
        }
        variant="borderless"
        styles={{
          body: { padding: isMobile ? 12 : 16 },
        }}
      >
        <TimezoneSelector onChange={onTimezoneChange} />
      </Card>

      <Divider style={{ margin: '16px 0' }} />

      <TimezoneResults timestamp={timestamp} timezones={selectedTimezones} />
    </Card>
  );
}
