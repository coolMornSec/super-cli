<template>
  <MgLayout>
    <template #header>
      <MgSearch @search="onSearch">
        <template #search>
          <el-form-item label="用户名">
            <el-input v-model.trim="search.username" clearable placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model.trim="search.email" clearable placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search.status" clearable placeholder="请选择状态">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </template>
      </MgSearch>
    </template>

    <template #main>
      <MgToolbar :select-length="multipleSelection.length">
        <MgButton type="primary" @click="goAdd">新增</MgButton>
        <MgButton type="danger" @click="() => { deleteRows(multipleSelection) }">批量删除</MgButton>
      </MgToolbar>

      <MgTable
        v-model:page-size="page.size"
        v-model:current-page="page.page"
        :data="tableData"
        :total="total"
        @paging-change="queryData"
        @select="handleSelectionChange"
        @select-all="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="username" label="用户名" min-width="120" show-overflow-tooltip />
        <el-table-column prop="nickname" label="昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <MgButton type="primary" link size="small" @click="goEdit(row)">编辑</MgButton>
            <MgButton type="danger" link size="small" @click="() => { deleteRows([row]) }">删除</MgButton>
          </template>
        </el-table-column>
      </MgTable>
    </template>
  </MgLayout>
</template>

<script setup lang="ts">
import type { UserItem } from '@/types/user'
import { useUserApi } from '@/api/useUserApi'

defineOptions({ name: 'UserManagement' })

const { fetchUserPage, deleteUser, batchDeleteUsers } = useUserApi()
const router = useRouter()

const search = reactive({
  username: '',
  email: '',
  status: undefined as 0 | 1 | undefined,
})

const page = reactive({
  page: 1,
  size: 10,
})

const tableData = ref<UserItem[]>([])
const total = ref(0)
const multipleSelection = ref<UserItem[]>([])

function getCurrentUserId(): string | null {
  return sessionStorage.getItem('currentUserId')
}

async function queryData() {
  try {
    const res = await fetchUserPage({
      username: search.username || undefined,
      email: search.email || undefined,
      status: search.status,
      page: page.page,
      size: page.size,
    })
    tableData.value = res.list
    total.value = res.totalNum
  } catch (e: unknown) {
    ElMessage.error((e as Error).message || '加载用户列表失败')
  }
}

async function onSearch() {
  page.page = 1
  await queryData()
}

function handleSelectionChange(rows: UserItem[]) {
  multipleSelection.value = rows
}

function goAdd() {
  void router.push({ path: '/system/user/add' })
}

function goEdit(row: UserItem) {
  void router.push({ path: `/system/user/edit/${row.id}` })
}

async function deleteRows(rows: UserItem[]) {
  if (rows.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }

  const currentUserId = getCurrentUserId()
  if (currentUserId && rows.some((r) => r.id === currentUserId)) {
    ElMessage.warning('不能删除当前登录用户')
    return
  }

  const names = rows.map((r) => r.username).join('、')
  try {
    await ElMessageBox.confirm(
      `确定删除以下用户吗？${names}`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
    )
    if (rows.length === 1) {
      await deleteUser(rows[0].id)
    } else {
      await batchDeleteUsers(rows.map((r) => r.id))
    }
    ElMessage.success('删除成功')
    await queryData()
  } catch (e: unknown) {
    if (e !== 'cancel' && e !== 'close') {
      ElMessage.error((e as Error).message || '删除失败')
    }
  }
}

onMounted(async () => {
  await queryData()
})
</script>
