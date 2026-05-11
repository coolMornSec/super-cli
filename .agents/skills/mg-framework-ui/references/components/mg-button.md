# MgButton 组件

> 按钮组件，用于触发操作（基于 Element Plus Button 封装）

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <div>
    <MgButton>默认按钮</MgButton>
    <MgButton type="primary">主要按钮</MgButton>
    <MgButton type="success">成功按钮</MgButton>
    <MgButton type="warning">警告按钮</MgButton>
    <MgButton type="danger">危险按钮</MgButton>
  </div>
</template>

<script setup lang="ts">
import { MgButton } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| type | String | 'default' | 否 | 按钮类型 |
| size | String | 'default' | 否 | 按钮大小 |
| disabled | Boolean | false | 否 | 是否禁用 |
| loading | Boolean | false | 否 | 是否加载中 |
| icon | String | '' | 否 | 图标 |
| round | Boolean | false | 否 | 是否圆形 |
| circle | Boolean | false | 否 | 是否圆形按钮 |
| plain | Boolean | false | 否 | 是否朴素按钮 |
| text | Boolean | false | 否 | 是否文本按钮 |
| link | Boolean | false | 否 | 是否链接按钮 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | - | 点击按钮时触发 |

---

*最后更新: 2026-02-09*
