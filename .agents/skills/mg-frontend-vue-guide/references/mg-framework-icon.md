# @magustek/icon-svg 使用文档

## 📦 包信息

- **包名:** `@magustek/icon-svg`
- **当前版本:** 6.0.1
- **发布地址:** https://nexus.magustek.com/repository/npm-magus/
- **类型:** Vue 3 SVG Icon 组件库
- **总 Icon 数量:** 347 个

---

## 🎯 功能特性

✅ **Vue 3 原生支持** - 完全基于 Vue 3 Composition API  
✅ **SVG 格式** - 矢量图标，无损缩放  
✅ **自动生成** - 从 SVG 文件自动生成 Vue 组件  
✅ **按需导入** - 支持 Tree-shaking，减少包体积  
✅ **全局注册** - 支持作为 Vue 插件全局注册  
✅ **自定义前缀** - 支持自定义组件名前缀  
✅ **样式可定制** - 支持 CSS 样式定制（颜色、大小等）  
✅ **TypeScript 支持** - 完整的类型定义  

---

## 📥 安装

### 方式 1: 使用 pnpm（推荐）

```bash
pnpm add @magustek/icon-svg
```

### 方式 2: 使用 npm

```bash
npm install @magustek/icon-svg
```

### 方式 3: 使用 yarn

```bash
yarn add @magustek/icon-svg
```

---

## 🚀 使用方法

### 方式 1: 全局注册（推荐）

在 `main.ts` 中注册为 Vue 插件：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import IconSvgPlugin from '@magustek/icon-svg'

const app = createApp(App)

// 不添加前缀
app.use(IconSvgPlugin)

// 自定义前缀
app.use(IconSvgPlugin, { prefix: 'Icon' })

app.mount('#app')
```

**重要:** 需要导入默认导出（install 方法），使用 `import IconSvgPlugin from '@magustek/icon-svg'`

然后在模板中使用：

```vue
<template>
  <!-- 默认-->
  <AddLocation />
  <Delete />
  <Search />
  
  <!-- 如果自定义前缀为 'Icon' -->
  <IconAddLocation />
  <IconDelete />
  <IconSearch />
</template>
```

### 方式 2: 按需导入

```vue
<template>
  <div>
    <AddLocation />
    <Delete />
    <Search />
  </div>
</template>

<script setup lang="ts">
import { AddLocation, Delete, Search } from '@magustek/icon-svg'
</script>
```
---

## 🏗️ 组件架构

### 核心文件结构

```
packages/framework-svg/
├── src/
│   ├── index.ts          # 主入口文件
│   ├── global.ts         # 全局注册插件
│   └── components/       # 自动生成的 Vue 组件（由构建脚本生成）
├── svg/                  # 源 SVG 文件（347 个）
├── build/
│   ├── generate.ts       # 组件生成脚本
│   ├── build.ts          # 构建脚本
│   └── paths.ts          # 路径配置
└── types/                # TypeScript 类型定义
    ├── index.d.ts
    ├── global.d.ts
    └── components/       # 组件类型定义
```

### 构建流程

1. **SVG 收集**: 从 `svg/` 目录读取所有 `.svg` 文件
2. **组件生成**: 将每个 SVG 转换为 Vue 3 单文件组件（SFC）
3. **入口生成**: 自动生成 `components/index.ts` 导出所有组件
4. **类型生成**: 生成 TypeScript 类型定义文件

---

## 📘 类型定义

### InstallOptions

插件安装选项接口：

```typescript
interface InstallOptions {
  /** 组件名前缀，默认为空字符串 */
  prefix?: string
}
```

### 使用示例

```typescript
import { type App } from 'vue'
import IconSvgPlugin, { type InstallOptions } from '@magustek/icon-svg'

const app: App = createApp(App)

// 使用默认配置
app.use(IconSvgPlugin)

// 使用自定义前缀
const options: InstallOptions = { prefix: 'Icon' }
app.use(IconSvgPlugin, options)
```

---

## 🎨 样式定制

### 基础样式

所有图标组件都是标准的 SVG 元素，可以通过 CSS 进行样式定制：

```vue
<template>
  <div class="icon-container">
    <Search class="custom-icon" />
    <Delete class="danger-icon" />
  </div>
</template>

<style scoped>
.custom-icon {
  width: 24px;
  height: 24px;
  color: #409eff;
  cursor: pointer;
}

.danger-icon {
  width: 20px;
  height: 20px;
  color: #f56c6c;
}

.custom-icon:hover {
  color: #66b1ff;
}
</style>
```

### 动态样式

```vue
<template>
  <Search :style="iconStyle" />
</template>

<script setup lang="ts">
import { Search } from '@magustek/icon-svg'
import { computed } from 'vue'

const iconStyle = computed(() => ({
  width: '32px',
  height: '32px',
  color: '#409eff',
  transition: 'all 0.3s'
}))
</script>
```

---

## 📦 组件列表

### 常用图标（部分示例）

| 组件名 | 说明 | 组件名 | 说明 |
|--------|------|--------|------|
| `AddLocation` | 添加位置 | `Delete` | 删除 |
| `Search` | 搜索 | `Edit` | 编辑 |
| `Home` | 首页 | `User` | 用户 |
| `Setting` | 设置 | `Bell` | 通知 |
| `Calendar` | 日历 | `Clock` | 时钟 |
| `Download` | 下载 | `Upload` | 上传 |
| `Folder` | 文件夹 | `Document` | 文档 |
| `Camera` | 相机 | `Picture` | 图片 |
| `Lock` | 锁定 | `Unlock` | 解锁 |
| `Refresh` | 刷新 | `Loading` | 加载中 |

### 箭头图标

- `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
- `ArrowUpBold`, `ArrowDownBold`, `ArrowLeftBold`, `ArrowRightBold`
- `CaretTop`, `CaretBottom`, `CaretLeft`, `CaretRight`
- `DArrowLeft`, `DArrowRight`

### 状态图标

- `CircleCheck`, `CircleCheckFilled` - 成功
- `CircleClose`, `CircleCloseFilled` - 关闭
- `CirclePlus`, `CirclePlusFilled` - 添加
- `SuccessFilled` - 成功（填充）
- `WarningFilled`, `Warning` - 警告
- `InfoFilled` - 信息

### 数据相关图标

- `DataAnalysis` - 数据分析
- `DataBoard` - 数据看板
- `DataEngineering` - 数据工程
- `DataGovernance` - 数据治理
- `DataQuality` - 数据质量
- `DataResources` - 数据资源
- `DataStandards` - 数据标准
- `DataStorage` - 数据存储

### 业务图标

- `AppManage` - 应用管理
- `AuthManage` - 权限管理
- `UserManage` - 用户管理
- `MenuManage` - 菜单管理
- `LogManage` - 日志管理
- `ConfigManage` - 配置管理

> 完整的 347 个图标列表请查看 `packages/framework-svg/svg/` 目录

---

## 🔧 高级用法

### 按需导入多个图标

```vue
<script setup lang="ts">
import { 
  Search, 
  Edit, 
  Delete, 
  Plus,
  Refresh 
} from '@magustek/icon-svg'
</script>

<template>
  <div class="toolbar">
    <Search />
    <Edit />
    <Delete />
    <Plus />
    <Refresh />
  </div>
</template>
```

### 导入所有图标

```typescript
import { icons } from '@magustek/icon-svg'

// icons 是一个对象，包含所有图标组件
console.log(Object.keys(icons)) // ['AddLocation', 'Delete', 'Search', ...]
```

### 动态组件使用

```vue
<template>
  <component :is="currentIcon" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Edit, Delete } from '@magustek/icon-svg'

const iconMap = {
  search: Search,
  edit: Edit,
  delete: Delete
}

const currentIcon = ref(iconMap.search)
</script>
```

---

## 🛠️ 开发指南

### 添加新图标

1. 将 SVG 文件放入 `packages/framework-svg/svg/` 目录
2. 文件命名使用 kebab-case（如 `my-icon.svg`）
3. 运行构建命令：

```bash
cd packages/framework-svg
pnpm run build:generate
```

4. 组件会自动生成为 PascalCase 命名（如 `MyIcon`）

### 构建命令

```bash
# 生成组件
pnpm run build:generate

# 完整构建
pnpm run build

# 生成类型定义
pnpm run build:types

# 发布到私有仓库
pnpm run release
```

---

## 📝 版本历史

| 版本 | 发布日期 | 说明 |
|------|---------|------|
| 6.0.0 | 2026-03-06 | 当前版本，347 个 Icon |
| 5.2.0 | 2025及更早 | 之前版本 |

---

---

## 🔍 组件命名规则

### SVG 文件名 → 组件名转换

框架使用 `camelcase` 库将 SVG 文件名转换为 PascalCase 组件名：

| SVG 文件名 | 组件名 |
|-----------|--------|
| `add-location.svg` | `AddLocation` |
| `arrow-down-bold.svg` | `ArrowDownBold` |
| `circle-check-filled.svg` | `CircleCheckFilled` |
| `data-analysis.svg` | `DataAnalysis` |
| `user-manage.svg` | `UserManage` |

### 命名约定

- 使用 kebab-case 命名 SVG 文件
- 组件自动转换为 PascalCase
- 支持多级连字符（如 `circle-check-filled` → `CircleCheckFilled`）

---

## 💡 最佳实践

### 1. 性能优化

```vue
<script setup lang="ts">
// ✅ 推荐：按需导入
import { Search, Edit } from '@magustek/icon-svg'

// ❌ 不推荐：导入所有图标
import * as icons from '@magustek/icon-svg'
</script>
```

### 2. 类型安全

```typescript
import type { DefineComponent } from 'vue'
import { Search } from '@magustek/icon-svg'

// 图标组件类型
const iconComponent: DefineComponent = Search
```

### 3. 全局注册建议

```typescript
// 如果项目中大量使用图标，推荐全局注册
app.use(IconSvgPlugin)

// 如果只使用少量图标，推荐按需导入
import { Search, Edit } from '@magustek/icon-svg'
```

### 4. 样式封装

```vue
<!-- IconWrapper.vue -->
<template>
  <span class="icon-wrapper" :class="sizeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large'
}>()

const sizeClass = computed(() => `icon-${size || 'medium'}`)
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-small { width: 16px; height: 16px; }
.icon-medium { width: 24px; height: 24px; }
.icon-large { width: 32px; height: 32px; }
</style>
```

---

## 🐛 常见问题

### Q: 为什么导入后组件未定义？

A: 确保使用正确的导入方式：

```typescript
// ✅ 正确
import IconSvgPlugin from '@magustek/icon-svg'
app.use(IconSvgPlugin)

// ❌ 错误
import { default as IconSvgPlugin } from '@magustek/icon-svg'
```

### Q: 如何修改图标颜色？

A: SVG 图标继承父元素的 `color` 属性：

```vue
<template>
  <Search style="color: red" />
  <!-- 或使用 class -->
  <Search class="text-blue" />
</template>
```

### Q: 图标不显示或显示异常？

A: 检查以下几点：
1. 确保正确安装了包
2. 检查组件名是否正确（PascalCase）
3. 确认 SVG 文件存在于 `svg/` 目录
4. 重新运行 `pnpm run build:generate`

### Q: 如何在 TypeScript 中获得类型提示？

A: 确保项目中包含类型定义：

```typescript
import type { InstallOptions } from '@magustek/icon-svg'
import { Search } from '@magustek/icon-svg'

// 类型会自动推断
const icon = Search // DefineComponent
```

---

**最后更新:** 2026-03-16  
**文档版本:** 2.0.0
