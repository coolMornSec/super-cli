# MgTabButtonItem 组件

> 标签按钮项组件，与标签按钮组件配合使用

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <div class="tabs">
    <MgTabButtonItem
      v-for="tab in tabs"
      :key="tab.id"
      :tab-id="tab.id"
      :label="tab.label"
    />
  </div>
</template>

<script setup lang="ts">
import { MgTabButtonItem } from '@magustek/framework-ui'

const tabs = [
  { id: 'tab1', label: '标签 1' },
  { id: 'tab2', label: '标签 2' }
]
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| tabId | String | '' | 是 | 标签 ID |
| label | String | '' | 是 | 标签文本 |
| disabled | Boolean | false | 否 | 是否禁用 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | string | 点击标签时触发 |

---

*最后更新: 2026-02-09*
