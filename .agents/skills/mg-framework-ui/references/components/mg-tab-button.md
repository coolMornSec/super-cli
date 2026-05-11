# MgTabButton 组件

> 标签按钮组件，用于显示多个标签按钮

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgTabButton
    v-model="activeTab"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTabButton } from '@magustek/framework-ui'

const activeTab = ref('tab1')
const tabs = [
  { id: 'tab1', label: '标签 1' },
  { id: 'tab2', label: '标签 2' }
]
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String | '' | 否 | 活跃标签 ID |
| tabs | Array | [] | 是 | 标签列表 |
| type | String | 'button' | 否 | 按钮类型 |
| size | String | 'default' | 否 | 按钮大小 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string | 活跃标签改变时触发 |
| tab-change | string | 标签改变时触发 |

---

*最后更新: 2026-02-09*
