# MgPaging 组件

> 分页器组件，用于分页导航

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgPaging
    :total="100"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgPaging } from '@magustek/framework-ui'

const currentPage = ref(1)
const pageSize = ref(20)

const handleChange = (page, size) => {
  console.log('分页改变:', page, size)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| total | Number | 0 | 是 | 数据总数 |
| currentPage | Number | 1 | 否 | 当前页码 |
| pageSize | Number | 20 | 否 | 每页条数 |
| pageSizes | Array | [20, 50, 100, 200] | 否 | 每页条数选项 |
| layout | String | 'sizes, prev, pager, next, jumper' | 否 | 分页器布局 |
| showTip | Boolean | true | 否 | 是否显示提示信息 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:currentPage | number | 当前页码改变时触发 |
| update:pageSize | number | 每页条数改变时触发 |
| change | (page, size) | 分页改变时触发 |

---

*最后更新: 2026-02-09*
