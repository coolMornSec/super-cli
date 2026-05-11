# MgSplitPanel 组件

> 分割面板项组件，与 MgSplit 组件配合使用

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgSplit style="height: 400px">
    <MgSplitPanel>
      <div>左侧面板</div>
    </MgSplitPanel>
    <MgSplitPanel>
      <div>右侧面板</div>
    </MgSplitPanel>
  </MgSplit>
</template>

<script setup lang="ts">
import { MgSplit, MgSplitPanel } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| size | Number \| String | '50%' | 否 | 面板大小 |
| min | Number \| String | '10%' | 否 | 最小尺寸 |
| max | Number \| String | '90%' | 否 | 最大尺寸 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 面板内容 |

---

*最后更新: 2026-02-09*
