<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" :disabled="disabled" label-width="120px">
    <el-form-item label="xx 编码" prop="code">
      <el-input
        v-model="formData.code"
        placeholder="请输入 xx 编码"
        :disabled="isEdit"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="xx 名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入 xx 名称" maxlength="100" show-word-limit />
    </el-form-item>

    <el-form-item label="xx 描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="4"
        placeholder="请输入 xx 描述"
        maxlength="500"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="">
      <MgButton @click="onCancel">取消</MgButton>
      <MgButton type="primary" @click="onConfirm">保存</MgButton>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'RoleForm' })

interface Props {
  // 设置为可选属性，父组件可以选择是否使用 v-model 来绑定数据
  modelValue?: Partial<XxxDTO>
  disabled?: boolean
  isEdit?: boolean
}

// modelValue 需要需要设置默认值
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isEdit: false,
  modelValue: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [Partial<XxxDTO>]
  confirm: [Partial<XxxDTO>]
  cancel: []
}>()

// 使用 useVModel 的 passive: true 来处理 v-model 绑定的表单数据, 受控与非受控都支持，父组件可以选择是否使用 v-model 来绑定数据
const formData = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: { code: '', name: '', description: '' },
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单验证规则
const formRules = {
  code: [
    { required: true, message: '请输入 xx 编码', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
    {
      pattern: /^[A-Z_][A-Z0-9_]*$/,
      message: 'xx 编码只能包含大写字母、数字和下划线，且必须以字母或下划线开头',
      trigger: 'blur',
    },
  ],
  name: [
    { required: true, message: '请输入 xx 名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  description: [{ max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 提交表单
const onConfirm = async () => {
  await formRef.value
    ?.validate()
    .then(() => emit('confirm', formData.value))
    .catch(noop)
}

// 取消编辑
const onCancel = () => {
  emit('cancel')
}
</script>
