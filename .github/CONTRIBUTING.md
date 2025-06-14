# 贡献指南

感谢您考虑为 Next Time Shift 项目做出贡献！这是一个多时区时间转换工具，旨在帮助用户轻松处理不同时区的时间换算问题。以下是一些指导原则，帮助您参与项目开发。

## 贡献流程

### 分支策略

- `main`: 主分支，包含稳定的代码
- `develop`: 开发分支，包含最新的功能
- `feature/*`: 特性分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复 Bug
- `release/*`: 发布分支，用于准备新版本发布

### 开发流程

1. Fork 本仓库到您的 GitHub 账户
2. 克隆您 fork 的仓库到本地
3. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
4. 开发您的功能并确保代码符合项目规范
5. 提交您的更改 (`git commit -m 'feat: 添加一些很棒的功能'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 创建一个 Pull Request 到原仓库的 `develop` 分支

### 代码审查

所有的 Pull Request 都会经过代码审查。请确保您的代码：

- 遵循项目的代码风格和最佳实践
- 包含必要的测试（如适用）
- 解决了相关的 Issue（如适用）
- 不引入新的 Bug 或性能问题

### 合并流程

1. 至少需要一位维护者的批准
2. 所有自动化测试必须通过
3. 代码审查中提出的问题必须解决

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范来标准化提交信息。

提交格式如下：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

常用的提交类型：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码风格或格式修改（不影响代码逻辑）
- `refactor`: 代码重构（既不是新增功能，也不是修复 Bug）
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

## 项目结构

```
src/
├── app/                  # Next.js App Router 目录
│   ├── about/            # 关于页面
│   ├── error.tsx         # 错误处理组件
│   ├── favicon.ico       # 网站图标
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局组件
│   ├── loading.tsx       # 加载状态组件
│   ├── not-found.tsx     # 404页面
│   └── page.tsx          # 首页组件
├── components/           # 可复用组件
│   ├── ThemeSwitcher.tsx # 主题切换组件
│   ├── NavMenu.tsx       # 导航菜单组件
│   └── ...               # 其他组件
├── hooks/                # 自定义钩子
│   ├── useResponsive.ts  # 响应式布局钩子
│   └── ...               # 其他钩子
├── store/                # 状态管理
│   └── ...               # 状态存储
├── types/                # 类型定义
│   └── index.ts          # 类型声明
└── utils/                # 工具函数
    └── ...               # 辅助函数
```

## 技术栈

本项目使用以下技术栈：

- **核心框架**：Next.js 15.3、React 19.1、TypeScript
- **UI 和样式**：Ant Design 5、Tailwind CSS
- **日期时间处理**：Luxon、@vvo/tzdb
- **状态管理**：Zustand
- **性能优化**：React Virtual (TanStack)

## 代码风格

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件和 React Hooks
- 使用 Tailwind CSS 和 Ant Design 进行样式设计
- 遵循 Next.js App Router 的最佳实践

## 开发环境要求

- Node.js 20.0.0+
- pnpm 9.0.0+

## 开发设置

1. 克隆仓库：

```bash
git clone https://github.com/crper/next-time-shift.git
cd next-time-shift
```

2. 安装依赖：

```bash
pnpm install
```

3. 启动开发服务器：

```bash
pnpm dev
```

4. 构建项目：
```bash
pnpm build
```

5. 代码检查：
```bash
pnpm lint
```

## 测试

目前项目正在建立测试框架。我们欢迎贡献者帮助完善测试：

- 单元测试：使用 Vitest 和 React Testing Library
- 组件测试：测试UI组件的渲染和交互
- 集成测试：测试多个组件或功能的协同工作

## 问题和功能请求

如果您发现了 Bug 或有功能建议，请创建一个 Issue。请尽可能详细地描述问题或建议，包括：

- 对于 Bug：
  - 复现步骤
  - 预期行为
  - 实际行为
  - 环境信息（浏览器、操作系统等）
  - 如可能，提供截图或录屏

- 对于功能请求：
  - 详细描述功能及其使用场景
  - 为什么这个功能对项目有价值
  - 可能的实现方式（如果有想法）

## 文档贡献

文档对于项目的成功至关重要。我们欢迎以下类型的文档贡献：

- 修复文档中的错误或不一致
- 添加缺失的文档或示例
- 改进现有文档的清晰度和可读性
- 翻译文档到其他语言

## 社区行为准则

我们希望 Next Time Shift 项目是一个友好、包容的社区。请遵循以下行为准则：

- 尊重所有贡献者，无论其经验水平、性别、性取向、残疾、种族或宗教
- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注社区的最佳利益

不可接受的行为包括：

- 使用性化语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经明确许可发布他人的私人信息
- 其他不道德或不专业的行为

## 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](../LICENSE) 下发布。
