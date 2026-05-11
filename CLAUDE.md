# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在本仓库中工作时提供指导。

## 仓库概述

`super-spec-cli`，一个由 Trellis 管理的 AI 驱动开发脚手架。项目强制结构化交付：正式规格在 `openspec/`，执行证据在 `docs/superpowers/`，运行时产物在 `.trellis/`。`AGENTS.md` 是仓库级宪法，定义了阶段顺序、技能调用和门禁规则。

## 工作目录

所有代码位于 `packages/frontend-vue/`。所有开发命令需在该目录下执行。当前仓库中没有后端代码。

```bash
cd packages/frontend-vue
```

## 常用命令

| 任务 | 命令 |
|------|------|
| 开发服务器 | `pnpm dev`（监听 `0.0.0.0:5173`，`/api` 代理到 `localhost:18031`） |
| 构建 | `pnpm build` |
| 类型检查 | `pnpm type-check` |
| 代码检查（含自动修复） | `pnpm lint` |
| 单元测试 | `pnpm test:unit` |
| 单元测试（监听模式） | `pnpm test:unit:watch` |
| E2E 测试 | `pnpm test:e2e` |
| 预览构建产物 | `pnpm preview` |

运行单个 Vitest 文件：`pnpm vitest run path/to/test.test.ts`
运行单个 Playwright 测试：`pnpm exec playwright test -g "测试名称模式"`

### Windows 环境

在 Windows 上首次运行 Vitest 或 Playwright 之前，需修复 esbuild 权限：
```bash
node scripts/fix-esbuild-permissions.mjs
```

## 技术栈

- **Vue 3.5**，使用 `<script setup lang="ts">` 组合式 API
- **Vite**，通过 `rolldown-vite`（npm 别名）
- **TypeScript 5.9**（strict 模式，项目引用）
- **Pinia 3** 状态管理
- **Vue Router 5**，基于文件自动路由（`unplugin-vue-router`）
- **Element Plus 2.13** UI 组件库
- **UnoCSS**（Wind4 预设 + attributify 模式）—— 无 Tailwind 配置，使用 UnoCSS 工具类
- **Vue I18n 11** 国际化
- **Sass**（SCSS）样式，自动注入 `@use "@/styles/theme.scss" as *;`
- **Vitest 3**（jsdom 环境）单元测试
- **Playwright 1.54**（MS Edge 通道）E2E 测试
- 包管理器：**pnpm >= 10**，Node >= 22

## 核心架构模式

### 基于文件的路由

`src/pages/` 中的页面由 `unplugin-vue-router` 自动发现，路由从目录结构生成，无需手动注册。生成的类型映射文件为 `router-map.d.ts`。

### 自动导入

以下内容全局自动可用（无需 import 语句）：
- `vue`（ref、computed、watch 等）
- `@vueuse/core` 工具函数
- `vue-router` 组合函数（useRouter、useRoute 等）
- `pinia`（defineStore、storeToRefs）
- `es-toolkit` 工具函数
- `@magustek/framework-core`、`@magustek/framework-utils`、`@magustek/framework-biz-utils`
- `src/api/**`、`src/utils/**`、`src/composable/**`、`src/layouts/composable/**` 中的所有内容

### 组件自动注册

`src/components/` 中的组件自动注册。Element Plus 组件、VueUse 组件、Magustek 框架组件和 Iconify 图标也通过解析器自动注册。

### 目录结构

```
src/
├── pages/          # 文件路由（自动发现）
├── api/            # API 函数（自动导入）
├── components/     # 公共组件（自动注册）
├── composable/     # Vue 组合函数（自动导入）
├── layouts/        # 布局组件，配合自动路由
│   ├── default.vue # 默认布局（NavBar + SideBar + 主内容区）
│   ├── empty.vue   # 空/最小化布局
│   ├── components/ # 布局专用组件（NavBar、SideBar 等）
│   └── composable/ # 布局组合函数（自动导入）
├── store/          # Pinia store
├── router/         # 路由配置（对自动路由的薄封装）
├── i18n/           # Vue I18n 配置
├── styles/         # 全局 SCSS（主题、变量、组件覆盖）
├── types/          # 公共 TypeScript 类型
└── mock/           # Mock API 数据（由 vite-plugin-mock 提供）
```

### 路径别名

`@/` 和 `~/` 均解析到 `src/`。

### 状态管理

使用 Pinia store（`defineStore`）。组件内部状态优先使用 composable；跨组件共享状态使用 Pinia。

## Magustek 框架组件

项目使用 `@magustek/framework-ui` 和 `@magustek/framework-biz-ui`，它们提供了标准页面骨架（布局、返回包裹、分页表格等）。实现页面时应遵循：

- 优先使用标准骨架组件（`MgBackWrap`、`MgLayout`、`MgPageTable`），而非手写 HTML
- 不得因担心默认标题或文案而放弃标准组件 —— 先核实组件的真实 props/slots 能力
- 不得新增需求文档中未明确的页面标题、标签或提示文案

## 测试策略

测试文件位于 `tests/unit/`（Vitest）和 `tests/e2e/`（Playwright）。

**分层优先级**（从低成本到高成本）：
1. 单元测试 —— 纯逻辑、数据转换、校验规则
2. 组件/集成测试 —— 真实 DOM、表单交互、组件联动
3. E2E —— 跨路由流程、浏览器行为、关键集成边界

业务逻辑必须遵循 TDD（先写失败测试）。结构/配置文件（布局、自动生成类型）可豁免。不得将能被更低层证明的逻辑错误推入 E2E。

## 代码质量

- ESLint flat config，搭配 `@vue/eslint-config-typescript`（推荐 type-checked 规则）
- Prettier 代码格式化
- Stylelint 检查 SCSS
- Husky + lint-staged 提交前检查
- Commitlint（约定式提交）+ Commitizen

## Trellis 工作流（背景参考）

本项目使用 Trellis 进行任务管理。关键路径：
- `.trellis/workflow.md` —— 完整开发工作流
- `.trellis/spec/` —— 各层编码规范（backend、frontend、guides）
- `.trellis/tasks/` —— 活跃和已归档任务及其 PRD
- `.trellis/workspace/` —— 每位开发者的工作日志

当前活跃任务在 `.trellis/tasks/` 中追踪。编写前端代码前应阅读 `.trellis/spec/frontend/` 中的规范约定。
