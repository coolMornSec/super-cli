# MgIconRender 组件

> 图标渲染组件，用于显示图标

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgIconRender name="search" size="24" color="#409eff" />
</template>

<script setup lang="ts">
import { MgIconRender } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| name | String | '' | 是 | 图标名称 |
| size | Number \| String | '1em' | 否 | 图标大小 |
| color | String | 'currentColor' | 否 | 图标颜色 |
| icon | String | '' | 否 | 图标标识 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 自定义内容 |

---

*最后更新: 2026-02-09*
