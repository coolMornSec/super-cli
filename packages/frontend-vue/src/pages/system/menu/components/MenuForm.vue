<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
    <el-form-item label="菜单名称" prop="name">
      <el-input
        v-model="formData.name"
        placeholder="请输入菜单名称"
        maxlength="50"
        show-word-limit
        @input="onNameChange"
      />
    </el-form-item>
    <el-form-item label="菜单编码" prop="code">
      <el-input v-model="formData.code" placeholder="自动生成" disabled />
    </el-form-item>
    <el-form-item label="菜单路径" prop="path">
      <el-input v-model="formData.path" placeholder="请输入菜单路径" maxlength="200" show-word-limit />
    </el-form-item>
    <el-form-item label="访问类型" prop="accessType">
      <el-select v-model="formData.accessType" placeholder="请选择访问类型">
        <el-option label="本地" value="LOCAL" />
        <el-option label="远程" value="REMOTE" />
      </el-select>
    </el-form-item>
    <el-form-item label="排序值" prop="sort">
      <el-input-number v-model="formData.sort" :min="0" :max="9999" placeholder="请输入排序值" />
    </el-form-item>
    <el-form-item label="">
      <MgButton v-if="isAdd" @click="onCancel">重置</MgButton>
      <MgButton type="primary" @click="onConfirm">保存</MgButton>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { pinyin } from 'pinyin-pro'

defineOptions({ name: 'MenuForm' })

interface Props {
  modelValue?: Partial<{
    name: string
    code: string
    path: string
    accessType: 'LOCAL' | 'REMOTE'
    sort: number
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
  defaultValue: { name: '', code: '', path: '', accessType: 'LOCAL' as const, sort: 0 },
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
}

function generateCode(name: string): string {
  if (!name) return ''
  const arr = pinyin(name, { toneType: 'none', type: 'array' })
  const ts = String(Date.now()).slice(-6)
  return [...arr, ts].join('_')
}

function onNameChange() {
  if (isAdd.value) {
    formData.value.code = generateCode(formData.value.name || '')
  }
}

function onConfirm() {
  formRef.value
    ?.validate()
    .then(() => emit('confirm', formData.value))
    .catch(noop)
}

function onCancel() {
  if (isAdd.value) {
    formData.value = { name: '', code: '', path: '', accessType: 'LOCAL', sort: 0 }
    formRef.value?.resetFields()
  }
  emit('cancel')
}
</script>
