# Next Time Shift

Next Time Shift 是一个简洁而强大的多时区时间转换工具，帮助用户轻松处理不同时区的时间换算问题。

## 功能特性

- 🕒 **时间戳转换**：将Unix时间戳转换为多个时区的可读时间
- 🌍 **多时区支持**：支持全球各地时区，包括夏令时自动调整
- 📅 **双向转换**：支持直接输入时间戳或通过日期选择器选择时间
- ⚡ **快捷操作**：提供快捷按钮快速添加当前时间以及常用时间点
- 🔄 **多时区比较**：同时查看多个时区的时间对比
- 🌓 **主题切换**：支持深色/浅色主题切换和自适应系统主题
- 📱 **响应式设计**：完美适配移动端和桌面端

## 录屏演示

https://github.com/user-attachments/assets/5fbc89bf-b962-4f4b-80f5-8ac80932ec7c

## 在线访问

https://crper.github.io/next-time-shift/

## 技术栈

### 核心框架

- 🔥 [Next.js 15.3](https://nextjs.org/) - React框架，使用App Router
- 🔷 [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript超集
- ⚛️ [React 19.1](https://react.dev/) - 用户界面构建库

### UI 和样式

- 🐜 [Ant Design 5](https://ant.design/) - 企业级UI组件库
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- 🎭 [Ant Design Icons](https://ant.design/components/icon/) - 丰富的图标库

### 日期时间处理

- ⏰ [Luxon](https://moment.github.io/luxon/) - 现代JavaScript日期时间处理库
- 🌍 [@vvo/tzdb](https://github.com/vvo/tzdb) - 时区数据库

### 状态管理和工具

- 🔄 [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- 🛠️ [es-toolkit](https://es-toolkit.slash.page/) - 现代JavaScript工具库
- 📋 [copy-to-clipboard](https://github.com/sudodoki/copy-to-clipboard) - 剪贴板操作

### 性能优化

- 🚀 [React Virtual](https://tanstack.com/virtual/latest) - 虚拟滚动优化

## 在线体验

github pages: [https://crper.github.io/next-time-shift/](https://crper.github.io/next-time-shift/)

## 本地开发

### 前置条件

- Node.js 20.0.0 或更高版本（推荐使用最新的 LTS 版本）
- pnpm 9.0.0 或更高版本

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

### 代码检查和格式化

```bash
# ESLint 检查
pnpm lint

# 代码格式化（使用 Prettier）
# 注意：项目使用 Prettier 进行代码格式化，但需要手动运行或通过编辑器插件执行
```

## 项目结构

```
next-time-shift/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── about/             # 关于页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   ├── error.tsx          # 错误处理页面
│   │   ├── loading.tsx        # 加载状态页面
│   │   ├── not-found.tsx      # 404页面
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── ErrorBoundary.tsx  # 错误边界组件
│   │   ├── LoadingStates.tsx  # 加载状态组件
│   │   ├── NavMenu.tsx        # 导航菜单组件
│   │   ├── ThemeProvider.tsx  # 主题提供者组件
│   │   ├── ThemeSwitcher.tsx  # 主题切换组件
│   │   ├── TimestampConverter.tsx # 时间戳转换组件
│   │   ├── TimestampInput.tsx # 时间戳输入组件
│   │   ├── TimestampList.tsx  # 时间戳列表组件
│   │   ├── TimezoneResults.tsx # 时区结果组件
│   │   ├── TimezoneSelector.tsx # 时区选择器组件
│   │   ├── timestamp-converter/ # 时间戳转换子组件
│   │   ├── timezone-card/     # 时区卡片组件
│   │   ├── timezone-results/  # 时区结果子组件
│   │   └── timezone-selector/ # 时区选择器子组件
│   ├── config/               # 配置文件
│   │   ├── responsive.ts     # 响应式配置
│   │   └── styles.ts         # 样式配置
│   ├── hooks/                # 自定义 React Hooks
│   │   ├── useErrorHandler.ts # 错误处理Hook
│   │   ├── useResponsive.ts  # 响应式Hook
│   │   ├── useStyles.ts      # 样式Hook
│   │   ├── useSystemTheme.ts # 系统主题Hook
│   │   └── index.ts          # Hooks导出
│   ├── store/                # Zustand 状态管理
│   │   ├── messageStore.ts   # 消息状态管理
│   │   ├── themeStore.ts     # 主题状态管理
│   │   ├── timezoneStore.ts  # 时区状态管理
│   │   └── index.ts          # 状态管理导出
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # 全局类型定义
│   └── utils/                # 工具函数
│       ├── datetime/         # 日期时间处理工具
│       ├── error-handler.ts  # 错误处理工具
│       ├── globalMessage.ts  # 全局消息工具
│       └── path-utils.ts     # 路径处理工具
├── public/                   # 静态资源
│   ├── images/              # 图片资源
│   ├── file.svg             # 文件图标
│   ├── globe.svg            # 地球图标
│   ├── next.svg             # Next.js图标
│   ├── vercel.svg           # Vercel图标
│   └── window.svg           # 窗口图标
├── .github/                 # GitHub 配置
│   └── workflows/           # GitHub Actions
└── ...                      # 配置文件
```

## 部署

### GitHub Pages 部署

项目已配置自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
   - 使用 Next.js 的静态导出功能（`output: 'export'`）
   - 自动设置基本路径（`basePath: '/next-time-shift'`）
   - 创建 `.nojekyll` 文件以确保正确处理下划线文件
3. 访问 `https://crper.github.io/next-time-shift/`

### 手动部署

```bash
# 构建静态文件
pnpm build

# 部署 out 目录到你的静态文件服务器
# 注意：如果不部署到 /next-time-shift 路径下，需要修改 next.config.ts 中的 basePath 配置
```

## 许可证

MIT
