<template>
  <header flex h-48px w-full bg="#fff">
    <TheLogo />
    <nav px-4 b-b flex flex-1 items-center>
      <div flex-1 />
      <el-dropdown h-full min-w-fit trigger="click">
        <div text-black flex h-full cursor-pointer items-center>
          magus
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </nav>
  </header>
</template>

<script setup lang="ts">
import TheLogo from './TheLogo.vue'

defineOptions({ name: 'NavBar' })
</script>
