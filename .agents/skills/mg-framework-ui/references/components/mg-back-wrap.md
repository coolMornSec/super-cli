# MgBackWrap 组件

> 返回包装组件，用于显示返回按钮和标题

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgBackWrap title="返回页面">
    <div>页面内容</div>
  </MgBackWrap>
</template>

<script setup lang="ts">
import { MgBackWrap } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| title | String | '' | 否 | 标题文本 |
| showBack | Boolean | true | 否 | 是否显示返回按钮 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| back | - | 点击返回按钮时触发 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 内容区域 |
| title | - | 标题区域 |

---

*最后更新: 2026-02-09*
