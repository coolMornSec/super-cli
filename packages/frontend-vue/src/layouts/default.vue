<template>
  <DefineTemplate v-slot="{ padding }">
    <mg-scrollbar :padding="padding" mg-scrollbar>
      <RouterView v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.fullPath"></component>
        </keep-alive>
      </RouterView>
    </mg-scrollbar>
  </DefineTemplate>
  <div layout-default h-screen w-screen>
    <div flex flex-col h-full w-full overflow-hidden>
      <template v-if="inWujie">
        <UseTemplate :padding="0"></UseTemplate>
      </template>
      <template v-else>
        <slot name="header">
          <NavBar />
        </slot>
        <section bg="#f5f7fa" flex flex-1 min-h-0>
          <slot name="aside">
            <SideBar />
          </slot>
          <div flex flex-1 flex-col>
            <main flex-1 min-h-0>
              <slot name="main">
                <UseTemplate></UseTemplate>
              </slot>
            </main>
            <footer>
              <slot name="footer"></slot>
            </footer>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'

defineOptions({ name: 'DefaultLayout' })

const [DefineTemplate, UseTemplate] = createReusableTemplate<{ padding?: number }>()

const inWujie = ref(window.__POWERED_BY_WUJIE__)
</script>

<style lang="scss">
[mg-scrollbar] {
  .el-scrollbar__view {
    @apply min-h-0;
  }
}
</style>
