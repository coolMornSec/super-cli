<template>
  <div h-full>
    <mg-back-wrap>
      <RoleForm @confirm="onConfirm" />
    </mg-back-wrap>
  </div>
</template>

<script setup lang="ts">
import RoleForm from '../components/RoleForm.vue'

defineOptions({ name: 'XxxEdit' })

const { saveXxx } = useXxxApi()

const onConfirm = async (data: Partial<XxxDTO>) => {
  await saveXxx(data)
  ElMessage.success('编辑成功')
}
</script>
