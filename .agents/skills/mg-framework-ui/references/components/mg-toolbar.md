# MgToolbar 组件

> 工具栏组件，用于显示操作按钮和工具

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgToolbar>
    <el-button type="primary">新增</el-button>
    <el-button>编辑</el-button>
    <el-button type="danger">删除</el-button>
  </MgToolbar>
</template>

<script setup lang="ts">
import { MgToolbar } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| background | String | '#f5f7fa' | 否 | 背景颜色 |
| padding | String | '10px' | 否 | 内边距 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 工具栏内容 |
| left | - | 左侧内容 |
| right | - | 右侧内容 |

---

*最后更新: 2026-02-09*
