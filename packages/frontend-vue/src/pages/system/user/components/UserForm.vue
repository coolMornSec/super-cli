<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="formData.username"
        placeholder="请输入用户名"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input
        v-model="formData.nickname"
        placeholder="请输入昵称"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="formData.email"
        placeholder="请输入邮箱"
        maxlength="100"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态">
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <MgButton v-if="isAdd" @click="onCancel">重置</MgButton>
      <MgButton type="primary" @click="onConfirm">保存</MgButton>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'UserForm' })

interface Props {
  modelValue?: Partial<{
    username: string
    nickname: string
    email: string
    status: 0 | 1
  }>
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  modelValue: () => ({}),
})

const isAdd = computed(() => !props.isEdit)

const emit = defineEmits<{
  'update:modelValue': [Partial<Props['modelValue']>]
  confirm: [Props['modelValue']]
  cancel: []
}>()

const formData = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: { username: '', nickname: '', email: '', status: 1 as const },
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function onConfirm() {
  formRef.value
    ?.validate()
    .then(() => emit('confirm', formData.value))
    .catch(noop)
}

function onCancel() {
  if (isAdd.value) {
    formData.value = { username: '', nickname: '', email: '', status: 1 }
    formRef.value?.resetFields()
  }
  emit('cancel')
}
</script>
