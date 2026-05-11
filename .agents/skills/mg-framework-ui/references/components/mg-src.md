# MgSrc 组件

> 资源加载组件，用于加载和显示资源

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgSrc
    src="/path/to/resource"
    type="image"
  />
</template>

<script setup lang="ts">
import { MgSrc } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| src | String | '' | 是 | 资源地址 |
| type | String | 'image' | 否 | 资源类型（image/video/iframe） |
| width | Number \| String | '100%' | 否 | 宽度 |
| height | Number \| String | 'auto' | 否 | 高度 |
| alt | String | '' | 否 | 替代文本 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| load | - | 资源加载完成时触发 |
| error | error | 资源加载失败时触发 |

---

*最后更新: 2026-02-09*
