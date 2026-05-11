# MgEsign 组件

> 电子签名组件，用于手写签名

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <div>
    <MgEsign ref="esignRef" />
    <el-button @click="handleSave">保存签名</el-button>
    <el-button @click="handleClear">清空</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgEsign } from '@magustek/framework-ui'

const esignRef = ref()

const handleSave = () => {
  const signature = esignRef.value?.getSignature()
  console.log('签名数据:', signature)
}

const handleClear = () => {
  esignRef.value?.clear()
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| width | Number \| String | '100%' | 否 | 签名板宽度 |
| height | Number \| String | '300px' | 否 | 签名板高度 |
| lineWidth | Number | 2 | 否 | 笔画宽度 |
| lineColor | String | '#000' | 否 | 笔画颜色 |

## Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| getSignature | - | string | 获取签名数据 |
| clear | - | void | 清空签名 |
| undo | - | void | 撤销上一步 |

---

*最后更新: 2026-02-09*
