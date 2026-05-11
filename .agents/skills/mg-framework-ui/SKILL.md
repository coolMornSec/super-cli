---
name: mg-framework-ui
description: "`@magustek/framework-ui` 基于 Vue 3 和 Element Plus 封装的企业级 UI 组件库，提供 26 个高质量业务组件。在生成、完善企业Vue3 项目/功能页面时使用。"
---

# mg-framework-ui

## 组件

组件基于ElementPlus库封装，包含 26 个高质量的 Vue 3 组件。
组件/函数/类型的清单说明参见 [references/ui-manifest.md](references/ui-manifest.md) 文档。

## 核心约束（强制）

- 组件能力：当使用组件时，必须读取组件全部能力包括引用文件，否则视为失败
- **Composition API**：默认使用Vue 3 Composition API和`<script setup>`语法
- **类型安全**：使用组件的完整类型提示，如未提供则告知用户

## 组件分类口径

本技能中的组件索引按以下规则划分：

- **通用组件**：仅指可以直接对应 Element Plus 基础控件、可作为一对一替换候选的 `Mg*` 组件。
- **业务组件**：指不适合做一对一基础控件替换、而是承载页面骨架、业务语义或高阶场景封装的组件。
- **组合式函数 / 类型**：不参与“通用组件 / 业务组件”的替换索引，但仍应按需优先复用已有实现。

## 通用组件索引

以下组件是通用基础控件的优先替换索引：

| Mg 组件 | 替代 | 使用建议 | 参考 |
| --- | --- | --- | --- |
| `MgButton` | `ElButton` | 页面主操作、次操作、表格操作按钮统一优先使用 | [references/components/mg-button.md](references/components/mg-button.md) |
| `MgCascader` | `ElCascader` | 多级分类、组织层级、区域级联选择 | [references/components/mg-cascader.md](references/components/mg-cascader.md) |
| `MgDatePicker` | `ElDatePicker` | 日期、日期范围、日期时间选择 | [references/components/mg-date-picker.md](references/components/mg-date-picker.md) |
| `MgDialog` | `ElDialog` | 弹窗、表单对话框、明细查看弹层 | [references/components/mg-dialog.md](references/components/mg-dialog.md) |
| `MgPaging` | `ElPagination` | 独立分页器场景 | [references/components/mg-paging.md](references/components/mg-paging.md) |
| `MgScrollbar` | `ElScrollbar` | 自定义滚动区域 | [references/components/mg-scrollbar.md](references/components/mg-scrollbar.md) |
| `MgTable` | `ElTable` | 数据列表、详情列表、选择表格；列定义仍使用 `el-table-column` | [references/components/mg-table.md](references/components/mg-table.md) |
| `MgTabs` | `ElTabs` | 标签切换 | [references/components/mg-tabs.md](references/components/mg-tabs.md) |
| `MgTabPane` | `ElTabPane` | 标签内容区域 | [references/components/mg-tab-pane.md](references/components/mg-tab-pane.md) |
| `MgTimePicker` | `ElTimePicker` | 时间、时间范围选择 | [references/components/mg-time-picker.md](references/components/mg-time-picker.md) |
| `MgTree` | `ElTree` | 树形展示、节点编辑、树检索 | [references/components/mg-tree.md](references/components/mg-tree.md) |

## 业务组件索引

以下组件在对应场景应优先复用：

| Mg 组件 | 业务定位 | 适用场景 | 参考 |
| --- | --- | --- | --- |
| `MgAddTemplate` | 模板维护对话框 | 新增模板、模板配置录入 | [references/components/mg-add-template.md](references/components/mg-add-template.md) |
| `MgBackWrap` | 返回区包装 | 详情页、编辑页、带返回按钮的页面头部 | [references/components/mg-back-wrap.md](references/components/mg-back-wrap.md) |
| `MgBpmnViewer` | BPMN 可视化查看器 | 流程图查看、审批流展示 | [references/components/mg-bpmn-viewer.md](references/components/mg-bpmn-viewer.md) |
| `MgCropper` | 图片裁剪工作区 | 头像裁剪、图片区域编辑 | [references/components/mg-cropper.md](references/components/mg-cropper.md) |
| `MgEsign` | 电子签名 | 手写签名、签章确认 | [references/components/mg-esign.md](references/components/mg-esign.md) |
| `MgIconPicker` | 图标选择器 | 菜单图标、业务图标配置 | [references/components/mg-icon-picker.md](references/components/mg-icon-picker.md) |
| `MgIconRender` | 图标渲染器 | 统一图标渲染、图标动态展示 | [references/components/mg-icon-render.md](references/components/mg-icon-render.md) |
| `MgLayout` | 页面骨架布局 | 后台主布局、内容区布局框架 | [references/components/mg-layout.md](references/components/mg-layout.md) |
| `MgPageTable` | 搜索 + 工具栏 + 表格 + 分页一体化 | 典型后台列表页、管理页 | [references/components/mg-page-table.md](references/components/mg-page-table.md) |
| `MgSearch` | 轻量搜索输入封装 | 单关键字搜索框、列表顶部快速检索 | [references/components/mg-search.md](references/components/mg-search.md) |
| `MgSplit` + `MgSplitPanel` | 分栏工作区 | 左树右表、双栏比较、可拖拽分割布局 | [references/components/mg-split.md](references/components/mg-split.md) / [references/components/mg-split-panel.md](references/components/mg-split-panel.md) |
| `MgSrc` | 资源加载展示 | 媒体、资源内容展示或预览 | [references/components/mg-src.md](references/components/mg-src.md) |
| `MgTabButton` + `MgTabButtonItem` | 按钮式标签切换 | 状态筛选、视图切换、分段操作 | [references/components/mg-tab-button.md](references/components/mg-tab-button.md) / [references/components/mg-tab-button-item.md](references/components/mg-tab-button-item.md) |
| `MgToolbar` | 工具栏封装 | 列表页批量操作、工具按钮区 | [references/components/mg-toolbar.md](references/components/mg-toolbar.md) |

## 替换规则

### 1. 通用组件替换规则

- 如果 Element Plus 基础控件存在对应的 `Mg*` 组件，必须优先替换为 `Mg*` 组件。
- 通用基础控件的具体映射，以“通用组件索引”表为唯一事实源。
- 遇到标签页场景时，应将 `MgTabs` 与 `MgTabPane` 作为一组替换 `ElTabs` 与 `ElTabPane`，避免单独维护两套标签容器写法。
- `MgTable` 替换的是表格容器能力；列定义继续沿用 `el-table-column`，不需要额外发明 `Mg` 列组件。

### 2. 业务组件替换规则

- 当页面需求已经落在业务组件的覆盖范围内时，优先使用对应业务组件，而不是手工拼装多个基础控件。
- 典型替换策略如下：

| 场景 | 优先使用 | 不推荐做法 |
| --- | --- | --- |
| 后台典型列表页（搜索区 + 工具栏 + 表格 + 分页） | `MgPageTable` | 手工用 `el-form` + `MgToolbar`/`div` + `MgTable` + `MgPaging` 重复拼装同构页面 |
| 带返回按钮和标题的详情/编辑页头部 | `MgBackWrap` | 自己写返回按钮、标题和间距结构 |
| 左右分栏、树表联动、拖拽分隔场景 | `MgSplit` + `MgSplitPanel` | 用原生 `div` 或栅格系统临时拼接可拖拽布局 |
| 按钮式标签切换、状态视图切换 | `MgTabButton` + `MgTabButtonItem` | 用普通按钮组自行维护选中态和样式 |
| 模板新增或模板配置场景 | `MgAddTemplate` | 自行重写相似的模板录入弹窗 |
| BPMN 流程查看 | `MgBpmnViewer` | 直接嵌第三方查看器并重复封装页面逻辑 |
| 电子签名 | `MgEsign` | 自行寻找或临时封装签名画板 |
| 图片裁剪 | `MgCropper` | 自行拼接裁剪库和交互面板 |
| 图标选择或图标统一渲染 | `MgIconPicker` / `MgIconRender` | 自行维护图标清单和渲染逻辑 |
| 页面主骨架布局 | `MgLayout` | 每个模块单独重复实现后台布局容器 |
| 工具栏按钮区 | `MgToolbar` | 用普通容器反复手写同构工具栏 |
| 单关键字搜索条 | `MgSearch` | 单独用输入框 + 按钮临时拼接轻量搜索条 |

### 3. 回退与禁用规则

- 如果 `@magustek/framework-ui` 已覆盖该场景，禁止回退到原生 HTML 控件。
- 如果 `@magustek/framework-ui` 已提供通用替代组件，禁止继续直接使用对应 Element Plus 基础控件。
- 如果 `@magustek/framework-ui` 没有覆盖该能力，可回退到 Element Plus，并需要在方案说明中明确告知用户。
- 对当前没有明确 `Mg*` 对应物的基础输入控件，例如 `ElInput`、`ElSelect`、`ElForm`、`ElFormItem`、`ElOption`、`ElCheckbox`、`ElRadio`、`ElTag`、`ElMessage`、`ElMessageBox` 等，可继续使用 Element Plus。
- 禁止为了让测试、构建或演示通过，把本应使用的 `Mg*` 组件替换成原生 HTML、临时组件或“轻量实现”。

## 快速开始

### 环境配置

1. 检查.npmrc配置，未配置和配置错误需添加或修改配置文件，如下：

   ```
   registry=https://registry.npmmirror.com/
   @magustek:registry=https://nexus.magustek.com/repository/npm-magus/
   ```

### 快速安装

默认安装最新稳定版本。根据项目需求选择安装方式（推荐使用pnpm）：

```bash
# 方式1：使用 pnpm（推荐）
pnpm add @magustek/framework-ui element-plus @element-plus/icons-vue

# 安装特定版本
pnpm add @magustek/framework-ui@1.0.0

# 安装最新版本（包括alpha/beta）
pnpm add @magustek/framework-ui@latest
```

### 全局引入

在项目的主入口文件（通常是 `main.ts` 或 `main.js`）中进行全局注册：

```typescript
import { createApp } from "vue";
import FrameworkUI from "@magustek/framework-ui";

import "@magustek/framework-ui/dist/style.css";
import App from "./App.vue";

const app = createApp(App);

// 全局注册所有组件
app.use(FrameworkUI);

app.mount("#app");
```

### 按需引入

在需要使用组件的文件中按需导入（推荐用于生产环境以减少包体积），如项目已经配置了动态引入：

```typescript
import { MgDialog, MgTable, MgTree } from "@magustek/framework-ui";

import "@magustek/framework-ui/dist/style.css";
```

### 特殊引入

在项目配置了动态引入组件库和Vue，无需手动引入组件时，不再进行重复引入。

## 主题定制

所有组件都支持 Element Plus 的主题定制。可以通过 CSS 变量自定义组件样式，如：

```css
:root {
  --itp-color-primary: #30429b;
  --itp-color-primary-hover: #2a3a87;
  --itp-color-primary-active: #243274;

  --el-color-primary: var(--itp-color-primary);
  --el-color-primary-light-3: rgba(48, 66, 155, 0.7);
  --el-color-primary-light-5: rgba(48, 66, 155, 0.5);
  --el-color-primary-light-7: rgba(48, 66, 155, 0.3);
  --el-color-primary-light-8: rgba(48, 66, 155, 0.2);
  --el-color-primary-light-9: rgba(48, 66, 155, 0.1);
}
```

## 最佳实践

### 1. 组件导入规范

```typescript
// 正确：从内部组件库导入
import { MgButton, MgDialog, MgTable } from "@magustek/framework-ui";
// 正确：内部组件库没有的组件，从Element Plus导入
import { ElInput, ElSelect } from "element-plus";
```

### 2. 组件命名规范

- 内部组件：使用`Mg`前缀，如`MgTable`
- Element Plus组件：使用`El`前缀或`el-`前缀，如`ElInput`或`el-input`

### 3. 类型安全

- 引用组件库导出的type类型，部分配置参见types

### 4. 布局实践

- 通常来说，只有在信息展示和手动指定等场景下才会使用卡片，否则不能使用
- 当页面由表格和其他元素（标题/搜索表单/工具栏）组成时，必须保证容器填满主内容区，且表格能够自动撑满剩余垂直空间

具体实现参考最佳实践：[best-practices.md](./references/best-practices.md)

## 常见场景代码示例

### 用户管理表格

参见模板`./assets/user-management.vue`

## 资源

### 参考资料

- [references/ui-manifest.md](references/ui-manifest.md) - 组件完整索引
- [references/best-practices.md](references/best-practices.md) - 详细最佳实践指南

### 资源文件

- `assets/user-management.vue` - 用户管理示例

## 故障排除

### 组件不显示

1. 检查是否正确导入组件
2. 确认样式文件已引入
3. 查看浏览器控制台错误信息

### 类型错误

1. 检查TypeScript配置
2. 确认已安装`@magustek/framework-ui`的类型定义
3. 检查导入语句是否正确

### 样式问题

1. 确认CSS文件已正确引入
2. 检查样式冲突
3. 查看组件库版本兼容性

### 性能问题

1. 检查是否使用了全局注册（应使用按需引入）
2. 确认大型列表是否启用了虚拟滚动
3. 检查是否有不必要的重新渲染

### 事件处理问题

1. 检查事件名称是否正确（使用kebab-case）
2. 确认事件处理函数是否正确绑定
3. 检查事件参数是否正确使用

## 硬性限制

- 如果某个 Element Plus 组件存在对应的 `Mg*` 替代组件，必须使用 `Mg*` 组件。
- 当公司组件已经覆盖该场景时，禁止回退到原生 HTML 控件或布局组件。
- 禁止为了让测试或构建通过，就把必须使用的 `Mg*` 组件替换成简化版或临时实现。
- 如果某个必须使用的 `Mg*` 组件不好测试，应修复测试基建或桩，而不是降级实现。
