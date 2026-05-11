# MgSearch 组件

> 搜索框组件，用于输入搜索关键词

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgSearch
    v-model="searchText"
    placeholder="输入搜索关键词"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgSearch } from '@magustek/framework-ui'

const searchText = ref('')

const handleSearch = (text) => {
  console.log('搜索:', text)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String | '' | 否 | 搜索文本 |
| placeholder | String | '搜索' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |
| clearable | Boolean | true | 否 | 是否显示清空按钮 |
| searchButton | Boolean | true | 否 | 是否显示搜索按钮 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string | 文本改变时触发 |
| search | string | 点击搜索按钮时触发 |
| clear | - | 点击清空按钮时触发 |

---

*最后更新: 2026-02-09*
