'use client';

import NavMenu from '@/components/NavMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useResponsive } from '@/hooks';
import { staticPath } from '@/utils/path-utils';
import {
  ClockCircleOutlined,
  GithubOutlined,
  GlobalOutlined,
  HeartOutlined,
  MobileOutlined,
  RocketOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Divider,
  FloatButton,
  Image,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from 'antd';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

/**
 * 关于页面
 * 突出时区转换工具的专业性和实用性
 */
export default function AboutPage() {
  const { token } = theme.useToken();
  const { isMobile } = useResponsive();

  const features = [
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />,
      title: '精确时间转换',
      description: '支持Unix时间戳与多时区时间的精确转换，包含夏令时自动识别',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '24px', color: token.colorSuccess }} />,
      title: '全球时区支持',
      description: '覆盖全球400+个时区，包含主要城市和地区的中英文对照',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: token.colorWarning }} />,
      title: '高性能体验',
      description: '虚拟滚动技术，毫秒级响应，支持大量时区同时显示',
    },
    {
      icon: <MobileOutlined style={{ fontSize: '24px', color: token.colorInfo }} />,
      title: '响应式设计',
      description: '完美适配手机、平板、桌面端，随时随地进行时区转换',
    },
  ];

  const useCases = [
    {
      icon: '🌐',
      title: '跨国远程协作',
      description: '协调不同时区团队的工作时间，安排国际会议',
    },
    {
      icon: '✈️',
      title: '国际旅行规划',
      description: '航班时间转换，旅行日程安排，时差计算',
    },
    {
      icon: '📊',
      title: '系统开发调试',
      description: '处理服务器日志时间戳，调试分布式系统时间问题',
    },
    {
      icon: '📺',
      title: '全球活动直播',
      description: '安排多时区直播时间，活动发布时间协调',
    },
  ];

  const techStack = [
    { name: 'Next.js 15.3', color: 'blue', description: '现代化 React 框架' },
    { name: 'React 19.1', color: 'green', description: '用户界面构建库' },
    { name: 'TypeScript', color: 'cyan', description: '类型安全开发' },
    { name: 'Ant Design 5', color: 'geekblue', description: '企业级 UI 组件' },
    { name: 'Luxon', color: 'purple', description: '先进日期时间处理' },
    { name: 'Zustand', color: 'magenta', description: '轻量级状态管理' },
    { name: 'Virtual Scroll', color: 'orange', description: '高性能列表渲染' },
  ];

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
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(8px)',
          backgroundColor: `${token.colorBgContainer}95`,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            🌍 Next Time Shift
          </Link>
        </Title>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile ? (
            <Space size="large">
              <NavMenu activeKey="2" />
              <ThemeSwitcher />
            </Space>
          ) : (
            <Space>
              <ThemeSwitcher />
              <NavMenu activeKey="2" />
            </Space>
          )}
        </div>
      </Header>

      <Content
        style={{
          padding: isMobile ? '16px 12px' : '24px',
          margin: 0,
          minHeight: 280,
          background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorFillAlter} 100%)`,
        }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={20} lg={18} xl={16}>
            {/* 主要介绍 */}
            <Card
              variant="outlined"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                marginBottom: '24px',
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              styles={{
                body: {
                  padding: isMobile ? '20px' : '32px',
                },
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
                <Title level={2} style={{ marginBottom: '8px' }}>
                  Next Time Shift
                </Title>
                <Title level={4} style={{ color: token.colorTextSecondary, fontWeight: 400 }}>
                  专业的多时区时间转换工具
                </Title>
                <Paragraph style={{ fontSize: '16px', marginTop: '16px' }}>
                  为全球化团队和个人提供精确、快速、易用的时区转换服务。
                  支持400+个全球时区，包含夏令时自动识别，让跨时区协作变得简单高效。
                </Paragraph>
              </div>

              {/* 核心特性 */}
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                <RocketOutlined style={{ marginRight: '8px' }} />
                核心特性
              </Title>
              <Row gutter={[16, 16]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card
                      size="small"
                      variant="outlined"
                      style={{
                        height: '100%',
                        borderRadius: '12px',
                        border: `1px solid ${token.colorBorder}`,
                      }}
                      styles={{
                        body: {
                          padding: '16px',
                        },
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flexShrink: 0 }}>{feature.icon}</div>
                        <div>
                          <Title level={5} style={{ margin: '0 0 8px 0' }}>
                            {feature.title}
                          </Title>
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {feature.description}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 使用场景 */}
            <Card
              variant="outlined"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                marginBottom: '24px',
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              styles={{
                body: {
                  padding: isMobile ? '20px' : '32px',
                },
              }}
            >
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                <TeamOutlined style={{ marginRight: '8px' }} />
                适用场景
              </Title>
              <Row gutter={[16, 16]}>
                {useCases.map((useCase, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                      size="small"
                      variant="outlined"
                      style={{
                        height: '100%',
                        textAlign: 'center',
                        borderRadius: '12px',
                        border: `1px solid ${token.colorBorder}`,
                        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillAlter} 100%)`,
                      }}
                      styles={{
                        body: {
                          padding: '20px 16px',
                        },
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{useCase.icon}</div>
                      <Title level={5} style={{ margin: '0 0 8px 0' }}>
                        {useCase.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {useCase.description}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 技术栈 */}
            <Card
              variant="outlined"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                marginBottom: '24px',
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              styles={{
                body: {
                  padding: isMobile ? '20px' : '32px',
                },
              }}
            >
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                ⚡ 技术栈
              </Title>
              <div style={{ textAlign: 'center' }}>
                <Space wrap size={[8, 8]}>
                  {techStack.map((tech, index) => (
                    <Tag
                      key={index}
                      color={tech.color}
                      style={{
                        padding: '4px 12px',
                        fontSize: '13px',
                        borderRadius: '16px',
                        border: 'none',
                      }}
                    >
                      {tech.name}
                    </Tag>
                  ))}
                </Space>
                <Paragraph style={{ marginTop: '16px', fontSize: '14px' }}>
                  采用现代化技术栈，确保工具的性能、稳定性和用户体验
                </Paragraph>
              </div>

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Link
                  href="https://github.com/crper/next-time-shift"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: token.colorPrimary,
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <GithubOutlined style={{ marginRight: 8 }} />
                  查看源码
                </Link>
              </div>
            </Card>

            {/* 支持项目 */}
            <Card
              variant="outlined"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                border: `1px solid ${token.colorBorderSecondary}`,
                background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillAlter} 100%)`,
              }}
              styles={{
                body: {
                  padding: isMobile ? '20px' : '32px',
                },
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <HeartOutlined style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 16 }} />
                <Title level={3} style={{ marginBottom: '16px' }}>
                  支持项目发展
                </Title>
                <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                  如果这个工具对您有所帮助，欢迎请我喝杯咖啡 ☕
                  <br />
                  您的支持是项目持续改进的动力！
                </Paragraph>

                <div style={{ marginTop: 24 }}>
                  <Row gutter={[24, 24]} justify="center" align="middle">
                    <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                      <Card
                        size="small"
                        variant="outlined"
                        style={{
                          borderRadius: '12px',
                          border: `1px solid ${token.colorBorder}`,
                          backgroundColor: '#f0f9eb',
                          padding: '8px',
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>推荐使用微信支付</Text>
                        </div>
                        <Image
                          src={staticPath('/images/sponsor/sponsor_wechat.jpg')}
                          alt="微信支付"
                          width={240}
                          style={{ borderRadius: '8px', cursor: 'pointer' }}
                          preview={{ mask: '点击查看大图' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                      <Card
                        size="small"
                        variant="outlined"
                        style={{
                          borderRadius: '12px',
                          border: `1px solid ${token.colorBorder}`,
                          backgroundColor: '#e6f7ff',
                          padding: '8px',
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>推荐使用支付宝</Text>
                        </div>
                        <Image
                          src={staticPath('/images/sponsor/sponsor_alipay.jpg')}
                          alt="支付宝"
                          width={220}
                          style={{ borderRadius: '8px', cursor: 'pointer' }}
                          preview={{ mask: '点击查看大图' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>

                <Paragraph style={{ marginTop: 24, fontSize: '14px' }}>
                  <Text type="secondary">💡 该项目完全开源免费，打赏纯属自愿，感谢您的支持！</Text>
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      <FloatButton.BackTop
        visibilityHeight={100}
        style={{
          right: isMobile ? 16 : 24,
          bottom: isMobile ? 16 : 24,
        }}
      />
    </Layout>
  );
}
