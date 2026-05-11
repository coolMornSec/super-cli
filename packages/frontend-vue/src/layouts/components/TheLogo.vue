<template>
  <div flex h-full overflow-hidden max-w="240px" bg="#2d3647">
    <slot>
      <img :src="defaultLogo" h-full w-full inline-block object-scale-down alt="" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import defaultLogo from '@/assets/images/logo.png'

defineOptions({ name: 'TheLogo' })
</script>
