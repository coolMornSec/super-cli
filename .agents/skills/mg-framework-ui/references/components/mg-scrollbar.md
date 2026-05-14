# MgScrollbar 组件

> 滚动条组件，用于自定义滚动条样式

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgScrollbar style="height: 400px">
    <div>
      <p v-for="i in 100" :key="i">第 {{ i }} 行内容</p>
    </div>
  </MgScrollbar>
</template>

<script setup lang="ts">
import { MgScrollbar } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| height | Number \| String | - | 否 | 滚动条高度 |
| maxHeight | Number \| String | - | 否 | 最大高度 |
| native | Boolean | false | 否 | 是否使用原生滚动条 |
| wrapStyle | Object | {} | 否 | 包装元素样式 |
| wrapClass | String | '' | 否 | 包装元素类名 |
| viewClass | String | '' | 否 | 视图元素类名 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 滚动内容 |

---

*最后更新: 2026-02-09*
