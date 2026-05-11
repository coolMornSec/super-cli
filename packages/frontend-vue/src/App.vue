<template>
  <ElConfigProvider :locale="elLocale">
    <router-view />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

defineOptions({ name: 'AppRoot' })

const { locale } = useLocale()

locale.value = 'cn'

const elLocale = computed(() => {
  return locale.value === 'cn' ? zhCn : en
})
</script>
