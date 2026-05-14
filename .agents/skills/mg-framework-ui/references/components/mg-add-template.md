# MgAddTemplate 组件

> 添加模板对话框组件，用于添加新的模板

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <div>
    <el-button @click="visible = true">添加模板</el-button>
    <MgAddTemplate
      v-model="visible"
      :templates="templates"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgAddTemplate } from '@magustek/framework-ui'

const visible = ref(false)
const templates = [
  { id: 1, name: '模板1', description: '描述1' },
  { id: 2, name: '模板2', description: '描述2' }
]

const handleSelect = (template) => {
  console.log('选择模板:', template)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | Boolean | false | 否 | 对话框是否显示 |
| templates | Array | [] | 是 | 模板列表 |
| title | String | '添加模板' | 否 | 对话框标题 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | boolean | 对话框显示/隐藏状态改变时触发 |
| select | object | 选择模板时触发 |

---

*最后更新: 2026-02-09*
