# MgPageTable 组件

> 完整的分页表格组件，集成搜索、工具栏、表格、分页功能

## 基本介绍

`MgPageTable` 是一个功能完整的分页表格组件，提供以下核心功能：

- **集成搜索** - 内置搜索表单，支持自定义搜索字段
- **工具栏** - 集成操作工具栏，支持批量操作
- **分页表格** - 完整的表格和分页功能
- **加载状态** - 支持加载中状态显示
- **事件系统** - 完整的搜索、分页、选择事件
- **布局集成** - 基于 MgLayout 构建，自动处理布局

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| `gap` | `string` | `'16px'` | ❌ | 区域间距 |
| `showMore` | `boolean` | `false` | ❌ | 是否显示更多搜索选项 |
| `showSearchIcon` | `boolean` | `false` | ❌ | 是否显示搜索图标 |
| `labelWidth` | `number` | `100` | ❌ | 搜索表单标签宽度 |
| `showButtons` | `boolean` | `true` | ❌ | 是否显示搜索按钮 |
| `contentGrowth` | `boolean` | `false` | ❌ | 搜索表单是否自适应增长 |
| `isExpand` | `boolean` | `false` | ❌ | 搜索表单是否默认展开 |
| `pageSize` | `number` | `100` | ❌ | 每页条数 |
| `currentPage` | `number` | `1` | ❌ | 当前页码 |
| `loading` | `boolean` | `false` | ❌ | 是否加载中 |
| `data` | `Array<any>` | `[]` | ✅ | 表格数据 |
| `total` | `number` | `0` | ❌ | 数据总数 |
| `stripe` | `boolean` | `false` | ❌ | 是否显示斑马纹 |
| `highlightCurrentRow` | `boolean` | `false` | ❌ | 是否高亮当前行 |
| `hideBtn` | `boolean` | `false` | ❌ | 是否隐藏工具栏 |
| `hidePage` | `boolean` | `false` | ❌ | 是否隐藏分页 |
| `hideSearch` | `boolean` | `false` | ❌ | 是否隐藏搜索表单 |
| `rowKey` | `string` | `'id'` | ❌ | 行唯一标识字段 |
| `expandRowKeys` | `Array<string>` | `[]` | ❌ | 默认展开的行 |
| `showAddBtn` | `boolean` | `true` | ❌ | 是否显示新增按钮 |
| `showDeleteBtn` | `boolean` | `true` | ❌ | 是否显示删除按钮 |
| `addMethod` | `Function` | - | ❌ | 新增按钮点击回调 |
| `deleteMethod` | `Function` | - | ✅ | 删除按钮点击回调 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `search` | - | 搜索时触发 |
| `paging-change` | `(currentPage: number, pageSize: number)` | 分页变化时触发 |
| `selection-change` | `(selection: Array<any>)` | 表格选择变化时触发 |
| `row-click` | `(row: any)` | 行被点击时触发 |
| `update:pageSize` | `(pageSize: number)` | 每页条数变化时触发 |
| `update:currentPage` | `(currentPage: number)` | 当前页码变化时触发 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `search` | 搜索表单内容 |
| `more` | 更多搜索选项 |
| `buttons` | 工具栏按钮 |
| `table` | 表格列定义 |

## 暴露的方法

| 方法名 | 说明 |
|--------|------|
| `tableRef` | 获取内部 MgTable 组件的 ref |

## 代码示例

### 基础用法 - 用户管理

```vue
<template>
  <MgPageTable
    :data="tableData"
    :total="totalCount"
    :loading="loading"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :show-add-btn="true"
    :show-delete-btn="true"
    @search="handleSearch"
    @paging-change="handlePagingChange"
    @selection-change="handleSelectionChange"
    :add-method="handleAdd"
    :delete-method="handleDelete"
  >
    <!-- 搜索表单 -->
    <template #search>
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态">
          <el-option label="激活" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
    </template>

    <!-- 表格列 -->
    <template #table>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" min-width="80" />
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '激活' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <MgButton type="primary" size="small" @click="handleEdit(row)">编辑</MgButton>
          <MgButton type="danger" size="small" @click="handleRowDelete(row)">删除</MgButton>
        </template>
      </el-table-column>
    </template>
  </MgPageTable>
</template>

<script setup lang="ts">
import { MgButton, MgPageTable } from '@magustek/framework-ui'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(100)
const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  username: '',
  email: '',
  status: '',
})

// 模拟假数据 - 实际使用时替换为真实 API 调用
const mockUsers = [
  { id: 1, username: '张三', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, username: '李四', email: 'lisi@example.com', status: 'active' },
  { id: 3, username: '王五', email: 'wangwu@example.com', status: 'inactive' },
  { id: 4, username: '赵六', email: 'zhaoliu@example.com', status: 'active' },
  { id: 5, username: '孙七', email: 'sunqi@example.com', status: 'active' },
  { id: 6, username: '周八', email: 'zhouba@example.com', status: 'inactive' },
  { id: 7, username: '吴九', email: 'wujiu@example.com', status: 'active' },
  { id: 8, username: '郑十', email: 'zhengshi@example.com', status: 'active' }
]

const handleSearch = async () => {
  loading.value = true
  try {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟后端 API 返回数据
    let filteredData = mockUsers

    // 根据搜索条件过滤
    if (searchForm.username) {
      filteredData = filteredData.filter(user =>
        user.username.includes(searchForm.username),
      )
    }
    if (searchForm.email) {
      filteredData = filteredData.filter(user =>
        user.email.includes(searchForm.email),
      )
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(user =>
        user.status === searchForm.status,
      )
    }

    // 模拟分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    const paginatedData = filteredData.slice(start, end)

    tableData.value = paginatedData
    totalCount.value = filteredData.length

    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handlePagingChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  console.log('选中行:', selection)
}

const handleAdd = () => {
  ElMessage.info('打开新增用户对话框')
  // 打开新增用户对话框
}

const handleDelete = () => {
  ElMessageBox.confirm('确定删除选中的用户吗？', '删除确认', {
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
    handleSearch()
  })
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户: ${row.username}`)
  // 打开编辑对话框
}

const handleRowDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除用户 ${row.username} 吗？`, '删除确认', {
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
    handleSearch()
  })
}

// 初始加载
handleSearch()
</script>
```

### 高级用法 - 订单管理

```vue
<template>
  <MgPageTable
    :data="orders"
    :total="totalCount"
    :loading="loading"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :show-more="true"
    :show-search-icon="true"
    :label-width="120"
    :show-add-btn="true"
    :show-delete-btn="true"
    stripe
    @search="loadOrders"
    @paging-change="loadOrders"
    @selection-change="handleSelectionChange"
    :add-method="handleAddOrder"
    :delete-method="handleBatchDelete"
  >
    <!-- 搜索表单 -->
    <template #search>
      <el-form-item label="订单号">
        <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="searchForm.customerName" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.status" placeholder="请选择订单状态">
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已发货" value="shipped" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>
    </template>

    <!-- 更多搜索选项 -->
    <template #more>
      <el-form-item label="订单日期">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="金额范围">
        <el-input-number v-model="searchForm.minAmount" placeholder="最小金额" />
        <span style="margin: 0 8px">-</span>
        <el-input-number v-model="searchForm.maxAmount" placeholder="最大金额" />
      </el-form-item>
    </template>

    <!-- 自定义工具栏按钮 -->
    <template #buttons>
      <MgButton @click="handleExport">导出</MgButton>
      <MgButton @click="handlePrint">打印</MgButton>
    </template>

    <!-- 表格列 -->
    <template #table>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNo" label="订单号" min-width="150" />
      <el-table-column prop="customerName" label="客户名称" min-width="120" />
      <el-table-column prop="amount" label="订单金额" min-width="120">
        <template #default="{ row }"> ¥{{ row.amount.toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <MgButton type="primary" size="small" @click="handleViewOrder(row)">查看</MgButton>
          <MgButton v-if="row.status === 'pending'" type="success" size="small" @click="handlePayOrder(row)">
            支付
          </MgButton>
          <MgButton type="danger" size="small" @click="handleCancelOrder(row)">取消</MgButton>
        </template>
      </el-table-column>
    </template>
  </MgPageTable>
</template>

<script setup lang="ts">
import { MgButton, MgPageTable } from '@magustek/framework-ui'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(50)
const loading = ref(false)
const orders = ref([])

const searchForm = reactive({
  orderNo: '',
  customerName: '',
  status: '',
  dateRange: [],
  minAmount: 0,
  maxAmount: 0,
})

// 模拟假数据 - 实际使用时替换为真实 API 调用
const mockOrders = [
  {
    id: 1,
    orderNo: 'ORD-2026-001',
    customerName: '张三',
    amount: 1299.99,
    status: 'completed',
    createTime: '2026-03-01 10:30:00',
  },
  {
    id: 2,
    orderNo: 'ORD-2026-002',
    customerName: '李四',
    amount: 2599.99,
    status: 'shipped',
    createTime: '2026-03-02 14:15:00',
  },
  {
    id: 3,
    orderNo: 'ORD-2026-003',
    customerName: '王五',
    amount: 899.99,
    status: 'paid',
    createTime: '2026-03-03 09:45:00',
  },
  {
    id: 4,
    orderNo: 'ORD-2026-004',
    customerName: '赵六',
    amount: 3999.99,
    status: 'pending',
    createTime: '2026-03-04 16:20:00',
  },
  {
    id: 5,
    orderNo: 'ORD-2026-005',
    customerName: '孙七',
    amount: 1599.99,
    status: 'completed',
    createTime: '2026-03-05 11:00:00',
  },
  {
    id: 6,
    orderNo: 'ORD-2026-006',
    customerName: '周八',
    amount: 2299.99,
    status: 'cancelled',
    createTime: '2026-03-05 13:30:00',
  },
  {
    id: 7,
    orderNo: 'ORD-2026-007',
    customerName: '吴九',
    amount: 799.99,
    status: 'paid',
    createTime: '2026-03-05 15:45:00',
  },
  {
    id: 8,
    orderNo: 'ORD-2026-008',
    customerName: '郑十',
    amount: 4599.99,
    status: 'shipped',
    createTime: '2026-03-05 17:20:00',
  }
]

const loadOrders = async () => {
  loading.value = true
  try {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟后端 API 返回数据
    let filteredData = mockOrders

    // 根据搜索条件过滤
    if (searchForm.orderNo) {
      filteredData = filteredData.filter(order =>
        order.orderNo.includes(searchForm.orderNo),
      )
    }
    if (searchForm.customerName) {
      filteredData = filteredData.filter(order =>
        order.customerName.includes(searchForm.customerName),
      )
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(order =>
        order.status === searchForm.status,
      )
    }
    if (searchForm.minAmount > 0) {
      filteredData = filteredData.filter(order =>
        order.amount >= searchForm.minAmount,
      )
    }
    if (searchForm.maxAmount > 0) {
      filteredData = filteredData.filter(order =>
        order.amount <= searchForm.maxAmount,
      )
    }

    // 模拟分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    const paginatedData = filteredData.slice(start, end)

    orders.value = paginatedData
    totalCount.value = filteredData.length

    ElMessage.success('订单加载成功')
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection: any[]) => {
  console.log('选中订单:', selection)
}

const handleAddOrder = () => {
  ElMessage.info('打开新增订单对话框')
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定删除选中的订单吗？', '删除确认', {
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
    loadOrders()
  })
}

const handleViewOrder = (row: any) => {
  ElMessage.info(`查看订单: ${row.orderNo}`)
}

const handlePayOrder = (row: any) => {
  ElMessageBox.confirm(`确定支付订单 ${row.orderNo} 吗？`, '支付确认', {
    type: 'warning',
  }).then(() => {
    ElMessage.success(`订单 ${row.orderNo} 支付成功`)
    loadOrders()
  })
}

const handleCancelOrder = (row: any) => {
  ElMessageBox.confirm(`确定取消订单 ${row.orderNo} 吗？`, '取消确认', {
    type: 'warning',
  }).then(() => {
    ElMessage.success('订单已取消')
    loadOrders()
  })
}

const handleExport = () => {
  ElMessage.success('订单已导出为 Excel 文件')
}

const handlePrint = () => {
  window.print()
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger',
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return labelMap[status] || status
}

// 初始加载
loadOrders()
</script>

```

### 简化用法 - 隐藏搜索和工具栏

```vue
<template>
  <MgPageTable
    :data="items"
    :total="totalCount"
    :loading="loading"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    hide-search
    hide-btn
    @paging-change="loadItems"
  >
    <template #table>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
    </template>
  </MgPageTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgPageTable } from '@magustek/framework-ui'

const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const loading = ref(false)
const items = ref([])

const loadItems = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/items?page=${currentPage.value}&pageSize=${pageSize.value}`)
    const result = await response.json()
    items.value = result.data
    totalCount.value = result.total
  } finally {
    loading.value = false
  }
}

loadItems()
</script>
```

## 类型定义

```typescript
interface MgPageTableProps {
  gap?: string
  showMore?: boolean
  showSearchIcon?: boolean
  labelWidth?: number
  showButtons?: boolean
  contentGrowth?: boolean
  isExpand?: boolean
  pageSize?: number
  currentPage?: number
  loading?: boolean
  data: Array<any>
  total?: number
  stripe?: boolean
  highlightCurrentRow?: boolean
  hideBtn?: boolean
  hidePage?: boolean
  hideSearch?: boolean
  rowKey?: string
  expandRowKeys?: Array<string>
  showAddBtn?: boolean
  showDeleteBtn?: boolean
  addMethod?: () => void
  deleteMethod: () => void
}

interface MgPageTableEmits {
  search: []
  pagingChange: [currentPage: number, pageSize: number]
  selectionChange: [selection: Array<any>]
  rowClick: [row: any]
  'update:pageSize': [pageSize: number]
  'update:currentPage': [currentPage: number]
}
```

## 相关资源

- [MgLayout 组件](./mg-layout.md)
- [MgTable 组件](./mg-table.md)
- [MgSearch 组件](./mg-search.md)
- [MgToolbar 组件](./mg-toolbar.md)

## 注意事项

1. **搜索表单** - 搜索表单内容通过 `search` 插槽自定义，搜索时会重置当前页为 1
2. **分页事件** - 分页变化时会自动触发搜索，无需手动调用
3. **工具栏按钮** - 新增和删除按钮的回调函数必须提供
4. **表格列** - 表格列定义通过 `table` 插槽提供，使用 Element Plus 的 `el-table-column`
5. **加载状态** - 通过 `loading` prop 控制加载状态，会显示在整个组件上
6. **行选择** - 通过 `selection-change` 事件获取选中的行数据

## 最佳实践

### 1. 搜索表单设计

- 常用搜索字段放在主搜索区域
- 不常用字段放在"更多"区域
- 提供清晰的字段标签和占位符

### 2. 工具栏操作

- 新增按钮用于创建新记录
- 删除按钮用于批量删除
- 自定义按钮用于其他操作（导出、打印等）

### 3. 表格列设计

- 设置合理的列宽
- 使用 `fixed="right"` 固定操作列
- 为重要字段添加格式化显示

### 4. 事件处理

- 搜索时重置分页
- 分页变化时重新加载数据
- 提供清晰的加载和错误提示

---

**最后更新**: 2026-03-06
