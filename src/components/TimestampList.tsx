'use client';

import { useStyles } from '@/hooks';
import { TimestampItem } from '@/types';
import { ArrowRightOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Empty, Row, Tooltip, Typography } from 'antd';

const { Text } = Typography;

interface TimestampListProps {
  items: TimestampItem[];
  activeTimestamp: number | null;
  onSelect: (timestamp: number) => void;
  onDelete: (id: string) => void;
  size?: 'small' | 'middle' | 'large';
  /**
   * 布局方向，默认为垂直布局
   */
  direction?: 'horizontal' | 'vertical';
}

/**
 * 时间戳列表组件
 * 显示已添加的时间戳，支持选择和删除
 * 支持水平和垂直布局，响应式显示
 */
export default function TimestampList({
  items,
  activeTimestamp,
  onSelect,
  onDelete,
  size = 'middle',
  direction = 'vertical',
}: TimestampListProps) {
  // 使用样式hook
  const { componentStyles, styles, isMobile } = useStyles();

  return (
    <div>
      <div style={styles.merge(componentStyles.flexContainer, {
        marginBottom: styles.spacing('md'),
        paddingBottom: styles.spacing('sm'),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      })}>
        <HistoryOutlined style={{ marginRight: styles.spacing('xs') }} />
        <Text strong style={{ fontSize: styles.fontSize(isMobile ? 'md' : 'lg') }}>时间戳列表</Text>
      </div>

      {items.length === 0 ? (
        <Empty description="暂无时间戳" />
      ) : (
        <>
          {activeTimestamp && (
            <div
              style={styles.merge(
                {
                  marginBottom: styles.spacing('md'),
                  textAlign: 'center' as const,
                  padding: styles.spacing(isMobile ? 'xs' : 'sm'),
                  backgroundColor: 'rgba(24, 144, 255, 0.05)',
                  borderRadius: styles.spacing('xs'),
                },
                styles.transition(['background-color'])
              )}
            >
              <Text type="secondary" style={{ fontSize: styles.fontSize(isMobile ? 'sm' : 'md') }}>
                <ArrowRightOutlined style={{ marginRight: styles.spacing('xs') }} />
                {isMobile ? '已选中，用于时区计算' : '选中的时间戳将用于下方时区计算'}
              </Text>
            </div>
          )}
          <Row gutter={[16, 16]}>
            {items.map(item => {
              const isActive = item.timestamp === activeTimestamp;

              return (
                <Col
                  key={item.id}
                  xs={direction === 'horizontal' ? 24 : 24}
                  sm={direction === 'horizontal' ? 12 : 24}
                  md={direction === 'horizontal' ? 8 : 24}
                  lg={direction === 'horizontal' ? 6 : 24}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: styles.spacing('sm'),
                      borderRadius: styles.spacing('xs'),
                      backgroundColor: isActive ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(24, 144, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => onSelect(item.timestamp)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: styles.spacing('xs') }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {isActive && (
                            <Tooltip title="当前用于计算">
                              <Badge status="processing" style={{ marginRight: styles.spacing('xs') }} />
                            </Tooltip>
                          )}
                          <Text strong style={{ fontSize: styles.fontSize(isMobile ? 'sm' : 'md') }}>
                            {item.label}
                          </Text>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size={size}
                          onClick={e => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                        />
                      </div>
                      <Text
                        type="secondary"
                        style={{ fontSize: styles.fontSize(isMobile ? 'xs' : 'sm') }}
                      >
                        Unix: {item.timestamp}
                      </Text>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </div>
  );
}
