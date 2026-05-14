# MgIconPicker 组件

> 图标选择器组件，用于选择图标

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgIconPicker
    v-model="selectedIcon"
    @change="handleIconChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgIconPicker } from '@magustek/framework-ui'

const selectedIcon = ref('')

const handleIconChange = (icon) => {
  console.log('选择的图标:', icon)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String | '' | 否 | 选中的图标 |
| icons | Array | [] | 否 | 图标列表 |
| placeholder | String | '选择图标' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string | 图标改变时触发 |
| change | string | 图标改变时触发 |

---

*最后更新: 2026-02-09*
