# MgDatePicker 组件

> 日期选择器组件，用于选择日期

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgDatePicker
    v-model="date"
    type="date"
    placeholder="选择日期"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgDatePicker } from '@magustek/framework-ui'

const date = ref('')
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String \| Date | - | 否 | 选中的日期 |
| type | String | 'date' | 否 | 选择器类型（date/daterange/datetime/datetimerange） |
| placeholder | String | '选择日期' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |
| clearable | Boolean | true | 否 | 是否显示清空按钮 |
| format | String | 'YYYY-MM-DD' | 否 | 日期格式 |
| disabledDate | Function | - | 否 | 禁用日期函数 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string \| date | 日期改变时触发 |
| change | string \| date | 日期改变时触发 |
| blur | - | 失焦时触发 |
| focus | - | 获焦时触发 |

---

*最后更新: 2026-02-09*
