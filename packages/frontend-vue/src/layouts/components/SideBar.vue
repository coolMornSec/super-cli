<template>
  <aside h-full min-w-240px>
    <MgScrollbar :padding="0">
      <SideMenu />
    </MgScrollbar>
  </aside>
</template>

<script setup lang="ts">
import SideMenu from './menu/SideMenu.vue'

defineOptions({ name: 'SideBar' })
</script>
