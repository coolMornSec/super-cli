<template>
  <template v-if="menu.children?.length">
    <el-sub-menu :index="menu.nodeId">
      <template #title>
        <slot name="title" :menu="menu">
          <el-icon><Document /></el-icon>
          <span :title="menu.text">{{ menu.text }}</span>
        </slot>
      </template>
      <template v-for="item in menu.children" :key="item.nodeId">
        <MenuItem :menu="item">
          <template #title>
            <el-icon><Document /></el-icon>
            <span :title="item.text">{{ item.text }}</span>
          </template>
        </MenuItem>
      </template>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="menu.nodeId" @click.self="onClickMenuItem(menu)">
      <template #default>
        <slot name="title" :menu="menu">
          <el-icon><Document /></el-icon>
          <span :title="menu.text">{{ menu.text }}</span>
        </slot>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { MenuNode } from '@/layouts/composable/useMenuClick'

import Document from '~icons/ep/document'

defineOptions({ name: 'MenuItem' })

defineProps<{ menu: MenuNode }>()

const { triggerMenuItemClick } = useMenuClick()

const onClickMenuItem = (node: MenuNode) => {
  triggerMenuItemClick(node)
}
</script>
