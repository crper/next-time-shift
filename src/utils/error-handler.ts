/**
 * 全局错误处理工具
 * 用于统一管理应用程序中的错误处理逻辑
 */

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  type: ErrorType;
  status?: number;
  data?: unknown;
  code?: string;
  timestamp?: number;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    status?: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.status = status;
    this.data = data;
    this.code = type.toString();
    this.timestamp = Math.floor(Date.now() / 1000);
  }
}

/**
 * API 错误处理
 * @param response Fetch API 响应对象
 */
export async function handleApiError(response: Response): Promise<never> {
  let data: unknown;
  let message = '请求失败';

  try {
    data = await response.json();
    message = (data as { message?: string })?.message || `请求失败 (${response.status})`;
  } catch (_e) {
    message = `请求失败 (${response.status})`;
  }

  // 根据状态码判断错误类型
  let type = ErrorType.API;
  if (response.status === 401) {
    type = ErrorType.AUTHENTICATION;
  } else if (response.status === 403) {
    type = ErrorType.AUTHORIZATION;
  } else if (response.status === 404) {
    type = ErrorType.NOT_FOUND;
  } else if (response.status === 422) {
    type = ErrorType.VALIDATION;
  }

  throw new AppError(message, type, response.status, data);
}

/**
 * 全局错误日志记录
 * @param error 错误对象
 * @param context 上下文信息
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
  console.error('[错误]', error.message, {
    error,
    context,
    timestamp: new Date().toISOString(),
  });

  // 这里可以添加错误上报逻辑，如 Sentry 等
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
}

/**
 * 通用错误处理函数
 * 根据错误类型执行不同的处理逻辑
 */
export function handleError(error: Error | AppError, context?: Record<string, unknown>): void {
  // 记录错误日志
  logError(error, context);

  // 判断是否为 AppError
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.AUTHENTICATION:
        // 处理认证错误（如重定向到登录页）
        if (typeof window !== 'undefined') {
          // window.location.href = '/login';
        }
        break;

      case ErrorType.AUTHORIZATION:
        // 处理授权错误
        break;

      case ErrorType.NETWORK:
        // 处理网络错误
        break;

      default:
        // 处理其他类型错误
        break;
    }
  }
}
