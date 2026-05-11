<template>
  <div h-full>
    <MgBackWrap @back="goBack">
      <MenuForm @confirm="onConfirm" @cancel="goBack" />
    </MgBackWrap>
  </div>
</template>

<script setup lang="ts">
import MenuForm from './components/MenuForm.vue'
import { useMenuApi } from '@/api/useMenuApi'

defineOptions({ name: 'MenuAdd' })

const { createMenu } = useMenuApi()
const route = useRoute()
const router = useRouter()
const parentId = (route.query.parentId as string) || undefined

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
  await createMenu({ ...data, parentId } as Parameters<typeof createMenu>[0])
  ElMessage.success('新增成功')
  router.back()
}
</script>
