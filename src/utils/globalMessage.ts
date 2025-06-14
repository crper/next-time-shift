'use client';

import { useMessageStore } from '@/store/messageStore';
import { App } from 'antd';
import { useEffect } from 'react';

// 全局静态方法初始化组件
// 在应用根组件中渲染这个组件，用于初始化全局静态方法
export default function GlobalStaticMethods() {
  const staticFunctions = App.useApp();
  const setStaticMethods = useMessageStore(state => state.setStaticMethods);

  // 初始化静态方法，只在客户端执行
  useEffect(() => {
    setStaticMethods({
      message: staticFunctions.message,
      modal: staticFunctions.modal,
      notification: staticFunctions.notification,
    });
  }, [staticFunctions, setStaticMethods]);

  return null;
}
