'use client';

import { Spin } from 'antd';

/**
 * 全局加载状态页面
 * 当页面正在加载时显示
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin size="large" tip="加载中..." fullscreen />
    </div>
  );
}
