<template>
  <div v-loading="loading" h-full>
    <MgBackWrap @back="goBack">
      <UserForm v-if="!loading" :is-edit="true" :model-value="formData" @confirm="onConfirm" @cancel="goBack" />
    </MgBackWrap>
  </div>
</template>

<script setup lang="ts">
import UserForm from '../components/UserForm.vue'
import { useUserApi } from '@/api/useUserApi'

defineOptions({ name: 'UserEdit' })

const { fetchUserById, updateUser } = useUserApi()
const route = useRoute()
const router = useRouter()
const userId = (route.params as Record<string, string>).id

const loading = ref(true)
const formData = ref<Record<string, unknown>>({})

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
  await updateUser(userId, { ...data, id: userId } as Parameters<typeof updateUser>[1])
  ElMessage.success('编辑成功')
  router.back()
}

onMounted(async () => {
  try {
    const res = await fetchUserById(userId)
    formData.value = { ...res.data }
  } catch (e: unknown) {
    ElMessage.error((e as Error).message || '加载用户信息失败')
    router.back()
  } finally {
    loading.value = false
  }
})
</script>
