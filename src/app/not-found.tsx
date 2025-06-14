'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';

/**
 * 404 页面 - 找不到页面
 * 当用户访问不存在的页面时显示
 */
export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Button type="primary">
            <Link href="/">返回首页</Link>
          </Button>
        }
      />
    </div>
  );
}
