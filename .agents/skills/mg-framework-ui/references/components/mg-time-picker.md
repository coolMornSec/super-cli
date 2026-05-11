# MgTimePicker 组件

> 时间选择器组件，用于选择时间

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgTimePicker
    v-model="time"
    placeholder="选择时间"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTimePicker } from '@magustek/framework-ui'

const time = ref('')
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String | - | 否 | 选中的时间 |
| placeholder | String | '选择时间' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |
| clearable | Boolean | true | 否 | 是否显示清空按钮 |
| format | String | 'HH:mm:ss' | 否 | 时间格式 |
| isRange | Boolean | false | 否 | 是否为时间范围选择 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string | 时间改变时触发 |
| change | string | 时间改变时触发 |

---

*最后更新: 2026-02-09*
