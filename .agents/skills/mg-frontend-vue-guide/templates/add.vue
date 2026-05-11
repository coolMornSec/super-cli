<template>
  <div h-full>
    <mg-back-wrap>
      <RoleForm @confirm="onConfirm" />
    </mg-back-wrap>
  </div>
</template>

<script setup lang="ts">
import RoleForm from './components/RoleForm.vue'

defineOptions({ name: 'XxxAdd' })

const { saveXxx } = useXxxApi()

const onConfirm = async (data: Partial<XxxDTO>) => {
  await saveXxx(data)
  ElMessage.success('保存成功')
}
</script>
