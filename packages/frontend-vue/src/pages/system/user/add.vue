<template>
  <MgBackWrap title="新增用户" @back="goBack">
    <UserForm @confirm="onConfirm" @cancel="goBack" />
  </MgBackWrap>
</template>

<script setup lang="ts">
import UserForm from './components/UserForm.vue'
import { useUserApi } from '@/api/useUserApi'

defineOptions({ name: 'UserAdd' })

const { createUser } = useUserApi()
const router = useRouter()

function goBack() {
  router.back()
}

async function onConfirm(
  data?: Partial<{
    username: string
    nickname: string
    email: string
    status: 0 | 1
  }>,
) {
  if (!data) return
  await createUser(data as Parameters<typeof createUser>[0])
  ElMessage.success('新增成功')
  router.back()
}
</script>
