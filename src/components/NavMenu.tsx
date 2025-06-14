'use client';

import { ClockCircleOutlined, InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Drawer, Grid, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { useBreakpoint } = Grid;

interface NavMenuProps {
  activeKey?: string;
  onSelect?: (key: string) => void;
}

/**
 * 顶部导航菜单组件
 * 响应式设计：PC端平铺，移动端抽屉式
 */
export default function NavMenu({ activeKey = '1', onSelect }: NavMenuProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  // 使用antd的断点hook
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 菜单项配置
  const menuItems = [
    {
      key: '1',
      icon: <ClockCircleOutlined />,
      label: '首页',
      path: '/',
    },
    {
      key: '2',
      icon: <InfoCircleOutlined />,
      label: '关于',
      path: '/about',
    },
  ];

  const items: MenuProps['items'] = menuItems.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    // 调用外部传入的选择回调
    onSelect?.(key);

    // 找到对应的路径并导航
    const selectedItem = menuItems.find(item => item.key === key);
    if (selectedItem?.path) {
      router.push(selectedItem.path);
    }

    // 如果是移动端，关闭抽屉
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // 移动端显示抽屉菜单
  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="菜单"
        />

        <Drawer
          title="菜单"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={200}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={items}
            onSelect={handleSelect}
            style={{
              borderRight: 'none',
            }}
          />
        </Drawer>
      </>
    );
  }

  // PC端显示水平菜单
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[activeKey]}
      items={items}
      onSelect={handleSelect}
      style={{
        background: 'transparent',
        borderBottom: 'none',
        minWidth: 150,
      }}
    />
  );
}
