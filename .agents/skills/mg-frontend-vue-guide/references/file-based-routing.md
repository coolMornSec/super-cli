# 基于文件系统的路由

项目使用 Vue Router 5，并通过 `vue-router/vite` 集成文件式路由与自动生成。页面组件位于 `src/pages`。

## 基本路由

- `src/pages/index.vue` -> `/`
- `src/pages/about.vue` -> `/about`
- `src/pages/users/index.vue` -> `/users`

## 动态路由

- 参数：`src/pages/users/[id].vue` -> `/users/:id`
- 可选参数：`src/pages/users/[[id]].vue` -> `/users/:id?`
- 捕获所有：`src/pages/[...path].vue` -> `/:path(.*)`

## 嵌套路由

通过定义一个与目录同名的 `.vue` 单文件，实现嵌套路由。

如果同时创建了 `src/pages/users/index.vue` 和 `src/pages/users.vue` 两个文件，`src/pages/users/index.vue` 会被渲染在 `src/pages/users.vue` 的 `<RouterView>` 中。

以下目录结构

```text
src/pages/
├── users/
│   └── index.vue
└── users.vue
```

对应路由配置为：

```json
const routes = [
  {
    path: '/users',
    component: () => import('src/pages/users.vue'),
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
    ],
  },
]
```

## 路由分组

有时候，你可能希望将某些路由放在一起，但又不想改变路由的 URL。这时候可以使用路由分组。

以下目录结构

```text
src/pages/
├── (admin)/
│   ├── dashboard.vue
│   └── settings.vue
└── (user)/
    ├── profile.vue
    └── order.vue
```

对应路由为：

```text
- `/dashboard` -> 渲染 `src/pages/(admin)/dashboard.vue`
- `/settings` -> 渲染 `src/pages/(admin)/settings.vue`
- `/profile` -> 渲染 `src/pages/(user)/profile.vue`
- `/order` -> 渲染 `src/pages/(user)/order.vue`
```

## 命名视图

文件 `src/pages/index@aux.vue` 对应路由配置为

```json
{
  "path": "/",
  "components": {
    aux: () => import("src/pages/index@aux.vue")
  }
}
```

## 组件命名

页面组件内部**必须**使用 `defineOptions` 定义 **PascalCase** 名称（即使是 `index.vue`）。

```vue
<script setup lang="ts">
defineOptions({ name: 'UserIndex' })
</script>
```

## 路由元信息

页面内可以使用 `definePage` 设置路由的 `name`、`alias`、`redirect`、`meta` 等。

```vue
<script setup lang="ts">
defineOptions({ name: 'PascalCaseName' })
// 页面布局默认值为 'default'，设置为 'empty' 时，页面内容会渲染在 empty.vue 布局组件的 <RouterView> 中。
definePage({ name: 'PascalCaseName', meta: { layout: 'empty' } })
</script>
```

> **❗️注意：**
> pages 目录下所有页面默认布局为 'default'，禁止在页面内重复使用 `definePage` 设置 `meta` 与 `layout`。
> 如果需要改变布局，pages 目录下的一级页面直接使用 `definePage` 设置 `meta` 与 `layout`，多级目录下的页面，创建与文件夹同名的 `.vue` 文件，使用 `definePage` 设置 `meta` 与 `layout`。

## 页面级公共目录

位于 `src/pages` 下的（包括深层次目录下的） `components`、`utils`、`composable` 目录下的文件不生成路由，用于编写页面级公共组件、工具函数、组合式函数等。

全局通用组件、工具函数、组合式函数等请放在 `src/components`、`src/utils`、`src/composable` 目录下。
