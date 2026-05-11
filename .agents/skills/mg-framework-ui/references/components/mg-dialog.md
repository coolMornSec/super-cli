# MgDialog 组件

> 对话框组件，用于显示模态或非模态的对话框内容

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 目录

- [基本用法](#基本用法)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)
- [示例](#示例)

## 基本用法

```vue
<template>
  <div>
    <el-button @click="dialogVisible = true">打开对话框</el-button>
    <MgDialog v-model="dialogVisible" title="示例对话框">
      <p>这是对话框的内容</p>
    </MgDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgDialog } from '@magustek/framework-ui'

const dialogVisible = ref(false)
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | Boolean | false | 否 | 对话框是否显示 |
| title | String | '' | 否 | 对话框标题 |
| width | String \| Number | '50%' | 否 | 对话框宽度 |
| fullscreen | Boolean | false | 否 | 是否全屏显示 |
| modal | Boolean | true | 否 | 是否显示遮罩层 |
| closeOnClickModal | Boolean | true | 否 | 点击遮罩层是否关闭对话框 |
| closeOnPressEscape | Boolean | true | 否 | 按 ESC 键是否关闭对话框 |
| showClose | Boolean | true | 否 | 是否显示关闭按钮 |
| draggable | Boolean | false | 否 | 对话框是否可拖动 |
| center | Boolean | false | 否 | 对话框是否居中显示 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | boolean | 对话框显示/隐藏状态改变时触发 |
| open | - | 对话框打开时触发 |
| close | - | 对话框关闭时触发 |
| opened | - | 对话框打开动画完成时触发 |
| closed | - | 对话框关闭动画完成时触发 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 对话框主体内容 |
| header | - | 对话框头部内容 |
| footer | - | 对话框底部内容 |

## 示例

### 基础对话框

```vue
<template>
  <div>
    <el-button @click="visible = true">打开对话框</el-button>
    <MgDialog v-model="visible" title="基础对话框">
      <p>这是一个基础对话框</p>
    </MgDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgDialog } from '@magustek/framework-ui'

const visible = ref(false)
</script>
```

### 带表单的对话框

```vue
<template>
  <div>
    <el-button @click="visible = true">打开表单对话框</el-button>
    <MgDialog v-model="visible" title="用户信息" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </MgDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MgDialog } from '@magustek/framework-ui'

const visible = ref(false)
const form = reactive({
  name: '',
  email: ''
})

const handleSubmit = () => {
  console.log('提交表单:', form)
  visible.value = false
}
</script>
```

---

*最后更新: 2026-02-09*
