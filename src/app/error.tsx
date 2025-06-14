'use client';

import { Button, Result } from 'antd';
import { useEffect } from 'react';

/**
 * 全局错误页面
 * 当应用程序出现未处理的错误时显示
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里添加错误日志上报
    console.error('应用程序错误:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Result
        status="error"
        title="出错了"
        subTitle="抱歉，应用程序发生了错误。"
        extra={[
          <Button key="retry" type="primary" onClick={reset}>
            重试
          </Button>,
          <Button key="home" onClick={() => (window.location.href = '/')}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
}
