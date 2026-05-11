# MgTable 组件

> 数据表格展示组件，集成分页功能的 Element Plus Table 增强版本

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 目录

- [基本用法](#基本用法)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)
- [Methods](#methods)
- [示例](#示例)
- [类型定义](#类型定义)

## 基本用法

```vue
<template>
  <MgTable
    :data="tableData"
    :total="total"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="status" label="状态" />
  </MgTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTable } from '@magustek/framework-ui'

const tableData = ref([
  { id: 1, name: '张三', status: '正常' },
  { id: 2, name: '李四', status: '正常' }
])
const total = ref(100)
const currentPage = ref(1)
const pageSize = ref(20)
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| data | Array | [] | 是 | 表格数据源 |
| total | Number | 0 | 否 | 数据总数（用于分页） |
| currentPage | Number | 1 | 否 | 当前页码 |
| pageSize | Number | 20 | 否 | 每页显示条数 |
| height | Number \| String | - | 否 | 表格高度，不设置则自适应 |
| hidePage | Boolean | false | 否 | 是否隐藏分页器 |
| layout | String | 'sizes, prev, pager, next, jumper' | 否 | 分页器布局 |
| showTip | Boolean | true | 否 | 是否显示分页提示信息 |
| pageSizes | Array | [20, 50, 100, 200, 500] | 否 | 每页显示条数选项 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| paging-change | (currentPage: number, pageSize: number) | 分页改变时触发 |
| update:currentPage | number | 当前页码改变时触发 |
| update:pageSize | number | 每页条数改变时触发 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 表格列定义插槽 |

## Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| clearSelection | - | void | 清空表格选择 |
| getSelectionRows | - | Array | 获取选中的行 |
| toggleRowSelection | row: any, selected: boolean | void | 切换行选择状态 |
| toggleAllSelection | - | void | 切换全选状态 |
| toggleRowExpansion | row: any, expanded?: boolean | void | 切换行展开状态 |
| setCurrentRow | row: any | void | 设置当前行 |
| clearSort | - | void | 清空排序 |
| clearFilter | columnKeys?: string[] | void | 清空过滤 |
| sort | prop: string, order: string | void | 排序表格 |
| scrollTo | options: number \| any, yCoord?: number | void | 滚动到指定位置 |
| setScrollTop | top?: number | void | 设置垂直滚动位置 |
| setScrollLeft | left?: number | void | 设置水平滚动位置 |

## 示例

### 基础表格

```vue
<template>
  <MgTable :data="tableData">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column prop="status" label="状态" />
  </MgTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTable } from '@magustek/framework-ui'

const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: '正常' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: '正常' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: '禁用' }
])
</script>
```

### 带分页的表格

```vue
<template>
  <MgTable
    :data="pageData"
    :total="total"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    @paging-change="handlePagingChange"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="status" label="状态" />
  </MgTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MgTable } from '@magustek/framework-ui'

const allData = ref(Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  status: i % 2 === 0 ? '正常' : '禁用'
})))

const currentPage = ref(1)
const pageSize = ref(20)
const total = computed(() => allData.value.length)

const pageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allData.value.slice(start, start + pageSize.value)
})

const handlePagingChange = (page, size) => {
  console.log(`切换到第 ${page} 页，每页 ${size} 条`)
}
</script>
```

### 固定高度表格

```vue
<template>
  <MgTable
    :data="tableData"
    height="400"
    :hide-page="true"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="status" label="状态" />
  </MgTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTable } from '@magustek/framework-ui'

const tableData = ref([
  { id: 1, name: '张三', status: '正常' },
  { id: 2, name: '李四', status: '正常' },
  // ... 更多数据
])
</script>
```

### 表格操作

```vue
<template>
  <div>
    <div class="toolbar">
      <el-button @click="handleClearSelection">清空选择</el-button>
      <el-button @click="handleGetSelection">获取选中行</el-button>
    </div>
    <MgTable ref="tableRef" :data="tableData">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
    </MgTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTable } from '@magustek/framework-ui'

const tableRef = ref()
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
])

const handleClearSelection = () => {
  tableRef.value?.clearSelection()
}

const handleGetSelection = () => {
  const rows = tableRef.value?.getSelectionRows()
  console.log('选中的行:', rows)
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
```

## 类型定义

```typescript
interface TableData {
  [key: string]: any
}

interface MgTableProps {
  data: TableData[]
  total?: number
  currentPage?: number
  pageSize?: number
  height?: number | string
  hidePage?: boolean
  layout?: string
  showTip?: boolean
  pageSizes?: number[]
}

interface PagingChangeEvent {
  currentPage: number
  pageSize: number
}
```

## 依赖

- element-plus (ElTable, ElTableColumn)
- @magustek/framework-ui (MgPaging)

---

*最后更新: 2026-02-09*
