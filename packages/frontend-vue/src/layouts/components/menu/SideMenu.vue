<template>
  <el-menu mode="vertical" active-text-color="#fff" background-color="#2d3647" text-color="#fff" b-r="!0" h-full>
    <MenuItem v-for="menuItem in menus" :key="menuItem.nodeId" :menu="menuItem" />
  </el-menu>
</template>

<script setup lang="ts">
import type { MenuNode } from '@/layouts/composable/useMenuClick'

import MenuItem from './MenuItem.vue'

defineOptions({ name: 'SideMenu' })

const { onMenuItemClick } = useMenuClick()

const menus = ref<MenuNode[]>([
  { nodeId: '1', text: '首页', path: '/' },
  { nodeId: 'menu', text: '菜单管理', path: '/system/menu/page' },
  { nodeId: 'user', text: '用户管理', path: '/system/user/page' },
  { nodeId: 'point-monitor', text: '点位监控', path: '/system/point-monitor/page' },
  { nodeId: 'alarm-page', text: '报警页面', path: '/system/alarm/page' },
])

const router = useRouter()

onMenuItemClick((node: MenuNode) => {
  void router.push(node.path)
})
</script>
