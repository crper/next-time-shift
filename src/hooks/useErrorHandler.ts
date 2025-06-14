import { useMessageStore } from '@/store';
import { AppError, ErrorType } from '@/utils/error-handler';
import { useCallback } from 'react';

/**
 * 统一错误处理 Hook
 * 提供统一的错误处理和用户反馈机制
 */
export function useErrorHandler() {
  const message = useMessageStore(state => state.message);
  const modal = useMessageStore(state => state.modal);

  // 处理一般错误
  const handleError = useCallback(
    (error: Error | AppError | string, context?: string) => {
      console.error('Error occurred:', error, context ? `Context: ${context}` : '');

      let errorMessage = '发生未知错误';
      let errorCode = '';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
        if ('code' in error) {
          errorCode = (error as AppError).code || '';
        }
      }

      // 根据错误类型显示不同的消息
      if (errorCode) {
        errorMessage = `${errorMessage} (错误代码: ${errorCode})`;
      }

      if (context) {
        errorMessage = `${context}: ${errorMessage}`;
      }

      message?.error(errorMessage);
    },
    [message]
  );

  // 处理网络错误
  const handleNetworkError = useCallback(
    (error: Error | AppError, context?: string) => {
      console.error('Network error:', error, context ? `Context: ${context}` : '');

      let errorMessage = '网络连接失败，请检查网络设置';

      if ('status' in error) {
        const status = (error as AppError).status;
        switch (status) {
          case 400:
            errorMessage = '请求参数错误';
            break;
          case 401:
            errorMessage = '未授权访问';
            break;
          case 403:
            errorMessage = '访问被拒绝';
            break;
          case 404:
            errorMessage = '请求的资源不存在';
            break;
          case 500:
            errorMessage = '服务器内部错误';
            break;
          case 502:
            errorMessage = '网关错误';
            break;
          case 503:
            errorMessage = '服务暂时不可用';
            break;
          default:
            errorMessage = `网络错误 (${status})`;
        }
      }

      if (context) {
        errorMessage = `${context}: ${errorMessage}`;
      }

      message?.error(errorMessage);
    },
    [message]
  );

  // 处理验证错误
  const handleValidationError = useCallback(
    (error: string | string[], context?: string) => {
      const errors = Array.isArray(error) ? error : [error];
      const errorMessage = errors.join(', ');

      const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;

      message?.warning(fullMessage);
    },
    [message]
  );

  // 显示确认对话框
  const showConfirmDialog = useCallback(
    (
      title: string,
      content: string,
      onConfirm: () => void,
      onCancel?: () => void,
      options?: {
        okText?: string;
        cancelText?: string;
        type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
      }
    ) => {
      const { okText = '确定', cancelText = '取消', type = 'confirm' } = options || {};

      modal?.[type]({
        title,
        content,
        okText,
        cancelText,
        onOk: onConfirm,
        onCancel,
      });
    },
    [modal]
  );

  // 显示成功消息
  const showSuccess = useCallback(
    (msg: string) => {
      message?.success(msg);
    },
    [message]
  );

  // 显示警告消息
  const showWarning = useCallback(
    (msg: string) => {
      message?.warning(msg);
    },
    [message]
  );

  // 显示信息消息
  const showInfo = useCallback(
    (msg: string) => {
      message?.info(msg);
    },
    [message]
  );

  // 创建错误对象
  const createError = useCallback(
    (message: string, code?: string, status?: number, data?: unknown): AppError => {
      // 使用 AppError 类创建错误对象
      const type = code ? ErrorType[code.toUpperCase() as keyof typeof ErrorType] || ErrorType.UNKNOWN : ErrorType.UNKNOWN;
      const error = new AppError(message, type, status, data);
      return error;
    },
    []
  );

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
    showConfirmDialog,
    showSuccess,
    showWarning,
    showInfo,
    createError,
  };
}
