---
name: mg-frontend-vue-guide
description: Magus 前端应用开发规范与最佳实践指南。
---

# 规范与最佳实践

必须遵循本文档的规范进行开发，不得已快速跑通 demo 的思想或将任何个人开发习惯凌驾于本技能规范之上。**任何违反以下规范的行为都将被视为任务执行失败，必须重新生成符合规范的版本**。

## 何时使用本技能

在以下场景中加载本技能:

- 📄 **页面与组件开发**: 在 `src/pages`、`src/components`、`src/layouts` 中创建或修改 Vue 组件
- 🔌 **API 调用**: 在 `src/api` 中抽象 API 调用逻辑
- 🎯 **路由与参数**: 处理文件式路由、路由参数获取/更新、路由监听
- 🛠️ **工具与组合函数**: 组织 `src/composable`、`src/utils` 中的逻辑复用
- 🎨 **样式与布局**: 使用 UnoCSS 属性模式编写样式、处理属性冲突
- 🧩 **组件库选择**: 在 framework-ui、framework-biz-ui 和 element-plus 之间选择
- 📦 **工具函数库选择**: 决定使用 VueUse 还是 es-toolkit
- ✅ **代码质量检查**: 在交付代码前按 Checklist 自检

## 核心概念速览

| 概念         | 说明                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| 自动导入     | 使用 `unplugin-auto-import` 和 `unplugin-vue-components` 实现自动导入  |
| 文件式路由   | `src/pages` 目录下的 `.vue` 文件自动生成路由                           |
| 组件优先级   | 被 framework-ui、framework-biz-ui 重写的 element-plus 组件需要优先使用 |
| 工具库优先级 | 优先使用 VueUse，其次选择 es-toolkit 的通用工具函数                    |
| 样式原则     | **必须**使用 UnoCSS 属性模式，冲突属性添加 `un-` 前缀。                |
| API 组织     | 组合式函数，以 `use` 开头，模块化目录结构。                            |
| 路由参数     | 使用 `useRouteParams`、`useRouteQuery`。                               |
| 删除确认     | 所有删除操作必须使用 `useConfirm` 确认。                               |
| 组件命名     | Vue 单文件组件需使用 `defineOptions` 定义 PascalCase 名称。            |
| 国际化       | 仅当需求明确要求国际化时启用，启用后必须统一遵循 i18n 规范与示例。     |

## 目录结构速查表

```txt
src/
├── api/                                ← 所有 API 调用组合式函数（useXxxApi）
├── composable/                         ← 可复用的逻辑函数
├── components/                         ← 项目级公共组件
├── pages/                              ← 文件式路由页面
│   └── [module]/
│       ├── components/                 ← 模块级组件
│       ├── composable/                 ← 模块级逻辑
│       ├── page.vue                    ← 列表页
│       ├── add.vue                     ← 新增页
│       └── edit/
│           └── [id].vue                ← 编辑页
├── store/                              ← Pinia store
├── utils/                              ← 通用工具函数
├── layouts/                            ← 布局组件
├── router/                             ← 路由配置（通常不需要手动配置，自动生成）
├── i18n/                               ← 国际化
├── assets/                             ← 静态资源
└── styles/                             ← 全局样式
```

## 自动导入

项目配置了 `unplugin-auto-import` 和 `unplugin-vue-components` 以下内容无需手动导入：

- **vue**、**pinia**、**vue-router**、**element-plus**、**vueuse**、**es-toolkit**、**magus 系列**: 无需手动导入，移除对应的 import 语句。
- **目录**: 以下目录下的文件无需手动导入
  - `src/api`
  - `src/utils`
  - `src/composable`
  - `src/components`
  - `src/layouts/composable`

## 文件式路由

页面组件位于 `src/pages` 目录下，路由配置请详细阅读参考文件 [file-based-routing.md](./references/file-based-routing.md)

## 开发规范

按以下规范进行开发，确保代码质量、可维护性和一致性。

### 🔵 路由规范

#### 目录结构

目录结构即路由地址，必须参考以下目录结构

```text
src/pages/
├── system/                        <-- 系统应用
│   ├── user/                      <-- 用户管理模块
│   │   ├── composable/            <-- 组合函数
│   │   │   ├── useUser.ts
│   │   ├── components/            <-- 公共组件
│   │   │   ├── UserForm.vue       <-- 用户表单组件
│   │   ├── page.vue               <-- 用户列表页面（默认使用 page.vue，而不是 index.vue）
│   │   ├── add.vue                <-- 添加用户页面
│   │   ├── xxx.vue                <-- 其他用户相关页面
│   │   └── edit/
│   │       └── [id].vue           <-- 编辑用户页面
│   ├── role/                      <-- 角色管理模块
├── message/                       <-- 消息应用
```

> 新增编辑必须优先使用路由页面 add.vue、edit/[id].vue，而不是使用弹窗形式，提取公共表单组件到 `components/` 目录下，提取公共逻辑到 `composable/` 目录下。

#### 获取、更新、监听路由参数

在页面组件中使用 `useRouteParams` 获取 params 参数，使用 `useRouteQuery` 获取 query 参数。

`useRouteParams` 和 `useRouteQuery` 无需手动导入，使用方式如下：

```vue
<script setup lang="ts">
// 获取路由 params 参数 foo
const foo = useRouteParams<string>("foo");
// 获取路由 query 参数 bar
const bar = useRouteQuery<string>("bar");

// 更新路由参数
foo.value = "new foo"; // router.replace({ params: { id: 'new foo' } })
bar.value = "new bar"; // router.replace({ query: { query: 'new bar' } })

// 使用 watchEffectInComponent 监听路由变化
watchEffectInComponent(() => {
  console.log(foo.value, bar.value);
});
</script>
```

### 🟣 组件规范

- **组件命名**：所有 Vue 单文件组件必须使用 `defineOptions` 定义 PascalCase 名称，如 `defineOptions({ name: 'UserForm' })`。
- **目录组织**：组件应根据功能和复用程度组织在 `src/components`（项目级公共组件）或 `src/pages/[module]/components`（模块级组件）目录下。
- **逻辑复用**：相同逻辑应提取为组合式函数（`src/composable`）或工具函数（`src/utils`），避免代码重复。
- **表单设计**：新增和编辑表单应提取为公共组件，放在模块的 `components/` 目录下，供编辑页、新增页复用。
- **自动导入**：`src/components`（项目级公共组件）可自动导入，移除显式 import 语句。
- **组件结构**：组件应遵循结构：`<template>` => `<script>` => `<style>`。

### 📦 组件库的使用

默认使用 element-plus， 其中以下组件被 framework-ui 和 framework-biz-ui 重写，必须使用重写后的版本：

| element-plus   | framework-ui/framework-biz-ui |
| :------------- | :---------------------------- |
| el-button      | MgButton                      |
| el-table       | MgTable                       |
| el-tree        | MgTree                        |
| el-pagination  | MgPaging                      |
| el-cascader    | MgCascader                    |
| el-time-picker | MgTimePicker                  |
| el-date-picker | MgDatePicker                  |
| el-dialog      | MgDialog                      |

framework-ui 和 framework-biz-ui 的其他组件请参考技能 `mg-framework-ui` 和文档 [mg-framework-biz-ui.md](./references/mg-framework-biz-ui.md)

### 🔧 工具库规范

优先使用 VueUse 组合式函数实现功能需求，避免重复造轮子。**任何已存在于 VueUse 中的函数都必须优先使用，除非该函数无法满足需求**。

1. 务必先查阅技能 `vueuse-functions` 了解所有 VueUse 组合式函数，将需求映射到最合适的函数，并遵循该函数的用法详情来实现需求。
2. 仅当 VueUse 中没有对应函数时，加载技能 `es-toolkit-guide` 阅读 es-toolkit 的通用工具函数，如 `chunk`, `omit`, `pick` 等。

### 🎨 样式规范

1. 在 template 中
   - 能用 UnoCSS **属性模式** 时必须使用，比如：`<div flex items-center />`，而不是：`<div class="flex items-center" />`。
   - 当组件的属性与 UnoCSS 冲突时，必须添加 `un-` 前缀, 比如组件已经定义了 `flex` 属性，但又需要给组件加 `flex` 样式时，请使用 `<SomeComponent un-flex />`。
2. 在 style 或者 scss/css 文件中
   - 能使用 @apply 实现时必须使用 `@apply`, 比如：`@apply flex;`，而不是直接写编写 css, `display: flex;`。

### 📡 API 规范

API 组织规则：

- 每个模块下的 API 调用都必须在 `src/api/[module]/useXxxApi.ts` 目录下定义组合式函数
- 函数名必须以 `use` 开头（如 `useUserApi`）
- 函数已自动注册，页面组件中无需手动导入
- 参考示例代码：[useXxxApi.ts](./templates/api/useXxxApi.ts)

### 🌐 国际化规则

- **明确要求时启用**：当需求或任务说明中明确要求国际化时，启用 `i18n`否则禁止使用，并统一按照 `framework-core` 中 `createI18n`、`useLocale`、`mergeLocalMessages` 的规范和示例代码实现。
- **启用后必须统一**：一旦页面或模块被定义为需要国际化，则页面标题、按钮文案、表单标签、placeholder、表格列名、消息提示等用户可见文案必须统一接入 i18n，不得混用硬编码文案。
- **实现前确认来源**：国际化文案的 key、语言包位置和合并方式必须参照 `./references/mg-framework-core.md` 中的国际化示例。
- **禁止选择性国际化**：开启国际化时，禁止只对部分按钮或提示语做国际化

### TS 类型规范

1. 禁止无差别使用 `any` 和 `unknown` 类型。
2. API 接口应定义参数类型，响应需定义 interfave XxxDTO 与后端保持一致。
3. useAxios 的类型标注用法，参考文档 [mg-framework-core](./references/mg-framework-core.md)。
4. vue 组件内的变量、函数参数、ref、reactive 等都应该有明确标注类型。

### ⚠️ 删除确认

所有删除操作都必须使用 `useConfirm` 确认，防止误操作，使用方式参考以下代码

```vue
<script setup lang="ts">
const confirmDelete = useConfirm("是否确认删除？", "提示");
const { deleteUser } = useUserApi();
const id = useRouteParams<string>("id");

const deleteItem = async () => {
  await confirmDelete("删除成功！", async () => {
    // 用户确认删除后执行的操作
    await deleteUser([id.value]);
  });
};
</script>
```

### 🖇 参考页面

编写代码时，务必参考下列模版

- 列表页面模版：`./templates/page.vue`
- 编辑页面模版：`./templates/edit/[id].vue`
- 新增页面模版：`./templates/add.vue`
- 公共表单组件模版：`./templates/components/XxxForm.vue`
- 公共组合函数模版：`./templates/composable/useXxx.ts`

---

## 开发质量检查清单

在交付代码前，必须对照以下清单逐项检查

- [ ] **组件库遵循度** 是否遵循 `framework-ui/framework-biz-ui` > `element-plus` 的优先级？
- [ ] **工具库遵循度**：是否遵循 `VueUse` > `es-toolkit` 的优先级？有哪些自定义工具函数其实在 VueUse 中已存在？
- [ ] **API组织遵循度**：是否所有API都按组合式函数组织，以 `use`开头？是否在模块目录下？
- [ ] **路由参数遵循度**：是否使用 `useRouteParams`、`useRouteQuery`？
- [ ] **删除确认遵循度**：所有删除操作都使用了 `useConfirm`？
- [ ] **国际化遵循度**：需求未要求，是否避免无效 i18n 引入；若需求要求，是否对所有用户可见文案统一接入 i18n？
- [ ] **UnoCSS属性模式优先**：是否优先使用UnoCSS属性模式？
  - [ ] **冲突属性处理**：是否所有冲突属性都已添加 `un-` 前缀？
- [ ] **组件名称定义**：组件是否使用 `defineOptions` 定义了 PascalCase 名称？
- [ ] **代码组织**：是否正确组织了目录结构？
  - [ ] 项目级公共组件在 `src/components`？
  - [ ] 页面模块组件在 `src/pages/[module]/components`？
  - [ ] API 调用在 `src/api` 并以 `use` 开头命名？
  - [ ] 复用逻辑在 `src/composable`？
- [ ] **逻辑复用**：相同逻辑是否已提取为组合式函数或工具函数？
- [ ] **表单设计**：新增和编辑表单是否已提取为公共组件？
- [ ] **自动导入验证**：是否移除了所有可自动导入的显式 import（vue、pinia、element-plus 等）？

## 硬性限制

- 在 Vue 页面或页面级组件中，业务数据表格禁止使用原生 `<table>`，必须使用 `MgTable`。
- 当场景应使用批准的 `Mg*` 或 Element Plus 组件时，禁止使用原生 `<input>`、`<select>`、`<textarea>` 或 `<button>`。
- 原生控件的例外必须被显式记录且范围严格受限，例如在没有可用上传组件时使用 `input[type=file]`。
- 禁止为了通过测试而把必须实现的能力降级成“最小版”“轻量版”或占位实现。
- 禁止通过缩小断言或重写测试来让不合规实现看起来像是正确的。
