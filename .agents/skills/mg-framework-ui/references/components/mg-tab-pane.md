# MgTabPane 组件

> 标签页项组件，与 MgTabs 组件配合使用

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgTabs>
    <MgTabPane label="标签 1" name="tab1">
      <div>标签 1 的内容</div>
    </MgTabPane>
    <MgTabPane label="标签 2" name="tab2">
      <div>标签 2 的内容</div>
    </MgTabPane>
  </MgTabs>
</template>

<script setup lang="ts">
import { MgTabs, MgTabPane } from '@magustek/framework-ui'
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| label | String | '' | 是 | 标签页标题 |
| name | String | '' | 是 | 标签页名称 |
| disabled | Boolean | false | 否 | 是否禁用 |
| closable | Boolean | false | 否 | 是否可关闭 |
| lazy | Boolean | false | 否 | 是否延迟加载 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 标签页内容 |
| label | - | 标签页标题 |

---

*最后更新: 2026-02-09*
