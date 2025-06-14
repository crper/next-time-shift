'use client';

import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { create } from 'zustand';

// 创建一个占位符实现，避免服务器端渲染出错
const createEmptyMessage = (): MessageInstance =>
  ({
    success: () =>
      ({ then: () => ({}) }) as MessageInstance['success'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    error: () =>
      ({ then: () => ({}) }) as MessageInstance['error'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    info: () =>
      ({ then: () => ({}) }) as MessageInstance['info'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    warning: () =>
      ({ then: () => ({}) }) as MessageInstance['warning'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    loading: () =>
      ({ then: () => ({}) }) as MessageInstance['loading'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    open: () =>
      ({ then: () => ({}) }) as MessageInstance['open'] extends (...args: unknown[]) => infer R
        ? R
        : never,
    destroy: () => {},
  }) as unknown as MessageInstance;

const createEmptyNotification = (): NotificationInstance =>
  ({
    success: () => {},
    error: () => {},
    info: () => {},
    warning: () => {},
    open: () => {},
    destroy: () => {},
  }) as unknown as NotificationInstance;

const createEmptyModal = (): Omit<ModalStaticFunctions, 'warn'> =>
  ({
    info: () =>
      ({ destroy: () => {}, update: () => {} }) as ReturnType<ModalStaticFunctions['info']>,
    success: () =>
      ({ destroy: () => {}, update: () => {} }) as ReturnType<ModalStaticFunctions['success']>,
    error: () =>
      ({ destroy: () => {}, update: () => {} }) as ReturnType<ModalStaticFunctions['error']>,
    warning: () =>
      ({ destroy: () => {}, update: () => {} }) as ReturnType<ModalStaticFunctions['warning']>,
    confirm: () =>
      ({ destroy: () => {}, update: () => {} }) as ReturnType<ModalStaticFunctions['confirm']>,
    destroyAll: () => {},
  }) as unknown as Omit<ModalStaticFunctions, 'warn'>;

// 定义消息 store 接口
interface MessageStore {
  // 导出全局消息 API
  message: MessageInstance;
  modal: Omit<ModalStaticFunctions, 'warn'>;
  notification: NotificationInstance;
  setStaticMethods: (funcs: {
    message: MessageInstance;
    modal: Omit<ModalStaticFunctions, 'warn'>;
    notification: NotificationInstance;
  }) => void;
}

// 创建 message store
export const useMessageStore = create<MessageStore>(set => ({
  message: createEmptyMessage(),
  modal: createEmptyModal(),
  notification: createEmptyNotification(),
  setStaticMethods: funcs => {
    set({
      message: funcs.message,
      modal: funcs.modal,
      notification: funcs.notification,
    });
  },
}));
