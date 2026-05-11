<template>
  <div v-loading="loading" h-full>
    <MgBackWrap @back="goBack">
      <MenuForm v-if="!loading" :is-edit="true" :model-value="formData" @confirm="onConfirm" @cancel="goBack" />
    </MgBackWrap>
  </div>
</template>

<script setup lang="ts">
import MenuForm from '../components/MenuForm.vue'
import { useMenuApi } from '@/api/useMenuApi'

defineOptions({ name: 'MenuEdit' })

const { fetchMenuById, updateMenu } = useMenuApi()
const route = useRoute()
const router = useRouter()
const menuId = (route.params as Record<string, string>).id

const loading = ref(true)
const formData = ref<Record<string, unknown>>({})

function goBack() {
  router.back()
}

async function onConfirm(data?: Partial<{
  name: string
  code: string
  path: string
  accessType: 'LOCAL' | 'REMOTE'
  sort: number
}>) {
  if (!data) return
  await updateMenu(menuId, { ...data, id: menuId } as Parameters<typeof updateMenu>[1])
  ElMessage.success('编辑成功')
  router.back()
}

onMounted(async () => {
  try {
    const res = await fetchMenuById(menuId)
    formData.value = { ...res.data }
  } catch (e: unknown) {
    ElMessage.error((e as Error).message || '加载菜单信息失败')
    router.back()
  } finally {
    loading.value = false
  }
})
</script>
