# Next Time Shift

Next Time Shift 是一个多时区时间转换工具，支持 Unix 时间戳输入、日期时间选择、跨时区对比展示，面向跨国协作、国际会议和时区排障场景。

## 功能特性

- 🕒 时间戳与本地时间互转
- 🌍 全球时区展示（含标准 UTC 时区组）
- 📅 日期时间选择器与快捷时间点
- 🔄 多时区并排对比
- ⚡ 虚拟滚动优化大量时区卡片渲染
- 🌓 深色 / 浅色 / 跟随系统主题
- 📱 响应式布局（移动端与桌面端）

## 录屏演示

https://github.com/user-attachments/assets/5fbc89bf-b962-4f4b-80f5-8ac80932ec7c

## 在线访问

- GitHub Pages: https://crper.github.io/next-time-shift/

## 技术栈

- [Next.js 16](https://nextjs.org/)（App Router）
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Ant Design 6](https://ant.design/) + [Ant Design Icons](https://ant.design/components/icon/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Luxon](https://moment.github.io/luxon/) + [@vvo/tzdb](https://github.com/vvo/tzdb)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Vitest](https://vitest.dev/)（单元测试）

## 本地开发

### 前置条件

- Node.js 20+
- pnpm 10+

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 常用脚本

```bash
# 代码检查
pnpm lint

# 单元测试
pnpm test
pnpm test:watch

# 类型检查
pnpm type-check

# 生产构建
pnpm build
pnpm start

# 一键全量校验（lint + test + type-check + build）
pnpm check
```

## 项目结构

```text
next-time-shift/
├── src/
│   ├── app/                         # Next.js App Router 页面
│   │   ├── about/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── TimestampConverter.tsx
│   │   ├── TimestampInput.tsx
│   │   ├── TimestampList.tsx
│   │   ├── TimezoneSelector.tsx
│   │   ├── TimezoneResults.tsx
│   │   ├── LoadingStates.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── NavMenu.tsx
│   │   ├── timestamp-converter/
│   │   └── timezone-card/
│   ├── hooks/
│   │   ├── useErrorHandler.ts
│   │   ├── useResponsive.ts
│   │   ├── useStyles.ts
│   │   └── useSystemTheme.ts
│   ├── store/
│   │   ├── themeStore.ts
│   │   ├── timezoneStore.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── datetime/
│   │   │   ├── core.ts
│   │   │   ├── formatter.ts
│   │   │   ├── period.ts
│   │   │   ├── timezone.ts
│   │   │   ├── timezone-data.ts
│   │   │   └── __tests__/
│   │   ├── error-handler.ts
│   │   └── path-utils.ts
│   └── types/
├── public/
├── .github/workflows/
└── ...
```

## 部署

项目已配置 GitHub Pages 自动部署。

- 推送 `main` 分支后由 GitHub Actions 自动构建并发布
- 使用 Next.js 静态导出（`output: 'export'`）
- 默认部署路径为 `/next-time-shift`

## 许可证

MIT
