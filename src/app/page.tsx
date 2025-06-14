'use client';

import NavMenu from '@/components/NavMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import TimestampConverter from '@/components/TimestampConverter';
import { useResponsive } from '@/hooks';
import { FloatButton, Layout, Space, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const { isMobile } = useResponsive();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
        🌍 Next Time Shift
        </Title>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile ? (
            <Space size="large">
              <NavMenu activeKey="1" />
              <ThemeSwitcher />
            </Space>
          ) : (
            <Space>
              <ThemeSwitcher />
              <NavMenu activeKey="1" />
            </Space>
          )}
        </div>
      </Header>

      <Content
        style={{
          padding: isMobile ? '8px 12px' : '12px 24px',
          margin: 0,
          minHeight: 280,
        }}
      >
        <TimestampConverter />
      </Content>

      <FloatButton.BackTop visibilityHeight={100} />
    </Layout>
  );
}
