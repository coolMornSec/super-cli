<template>
  <MgLayout aside-width="300px">
    <template #aside>
      <MgTree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :is-edit="false"
        :is-need-search="true"
        :is-need-reload="true"
        :highlight="true"
        :default-expanded-keys="defaultExpandedKeys"
        filter-placeholder="请输入菜单名称"
        @node-click="handleNodeClick"
        @reload-tree="loadTree"
      />
    </template>

    <template #header>
      <MgSearch @search="onSearch">
        <template #search>
          <el-form-item label="菜单名称">
            <el-input v-model.trim="search.name" clearable placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单编码">
            <el-input v-model.trim="search.code" clearable placeholder="请输入菜单编码" />
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
        <el-table-column prop="name" label="菜单名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="code" label="菜单编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="path" label="菜单路径" min-width="160" show-overflow-tooltip />
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
import type { MenuItem, MenuTreeNode } from '@/types/menu'
import { MENU_ROOT_ID, MENU_ROOT_NODE } from '@/types/menu'
import { useMenuApi } from '@/api/useMenuApi'

defineOptions({ name: 'MenuManagement' })

const { fetchMenuTree, fetchMenuChildren, deleteMenu, batchDeleteMenus } = useMenuApi()
const router = useRouter()

const treeData = ref<MenuTreeNode[]>([])
const treeProps = { children: 'children', label: 'name' }
const defaultExpandedKeys = [MENU_ROOT_ID]
const selectedNode = ref<MenuItem>({ ...MENU_ROOT_NODE })

const search = reactive({
  name: '',
  code: '',
})

const page = reactive({
  page: 1,
  size: 100,
})

const tableData = ref<MenuItem[]>([])
const total = ref(0)
const multipleSelection = ref<MenuItem[]>([])

async function loadTree() {
  try {
    const res = await fetchMenuTree()
    treeData.value = [{ ...MENU_ROOT_NODE, children: res.data }]
  } catch (e: unknown) {
    ElMessage.error((e as Error).message || '加载菜单树失败')
  }
}

async function queryData() {
  try {
    const parentId = selectedNode.value.id === MENU_ROOT_ID ? undefined : selectedNode.value.id
    const res = await fetchMenuChildren({
      parentId,
      name: search.name || undefined,
      code: search.code || undefined,
      page: page.page,
      size: page.size,
    })
    tableData.value = res.list
    total.value = res.totalNum
  } catch (e: unknown) {
    ElMessage.error((e as Error).message || '加载子菜单失败')
  }
}

async function handleNodeClick(data: MenuTreeNode) {
  selectedNode.value = data
  page.page = 1
  search.name = ''
  search.code = ''
  await queryData()
}

async function onSearch() {
  page.page = 1
  await queryData()
}

function handleSelectionChange(rows: MenuItem[]) {
  multipleSelection.value = rows
}

function goAdd() {
  const parentId = selectedNode.value.id === MENU_ROOT_ID ? '' : selectedNode.value.id
  void router.push({ path: '/system/menu/add', query: parentId ? { parentId } : {} })
}

function goEdit(row: MenuItem) {
  const parentId = selectedNode.value.id === MENU_ROOT_ID ? '' : selectedNode.value.id
  void router.push({ path: `/system/menu/edit/${row.id}`, query: parentId ? { parentId } : {} })
}

async function deleteRows(rows: MenuItem[]) {
  if (rows.length === 0) {
    ElMessage.warning('请先选择要删除的菜单')
    return
  }

  const names = rows.map((r) => r.name).join('、')
  try {
    await ElMessageBox.confirm(
      `确定删除以下菜单吗？${names}`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
    )
    if (rows.length === 1) {
      await deleteMenu(rows[0].id)
    } else {
      await batchDeleteMenus(rows.map((r) => r.id))
    }
    ElMessage.success('删除成功')
    await loadTree()
    await queryData()
  } catch (e: unknown) {
    if (e !== 'cancel' && e !== 'close') {
      ElMessage.error((e as Error).message || '删除失败')
    }
  }
}

onMounted(async () => {
  await loadTree()
  await queryData()
})
</script>
