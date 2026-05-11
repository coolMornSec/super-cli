<template>
  <div layout-empty flex flex-col h-full w-full overflow-hidden>
    <mg-scrollbar :padding="0" mg-scrollbar>
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </mg-scrollbar>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmptyLayout' })
</script>

<style lang="scss">
[mg-scrollbar] {
  .el-scrollbar__view {
    min-height: 0;
  }
}
</style>
