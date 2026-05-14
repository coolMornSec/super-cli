# MgCropper 组件

> 图片裁剪组件，用于裁剪和编辑图片

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgCropper
    :src="imageSrc"
    :config="cropperConfig"
    @crop="handleCrop"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgCropper } from '@magustek/framework-ui'

const imageSrc = ref('/path/to/image.jpg')
const cropperConfig = {
  aspectRatio: 16 / 9,
  autoCropArea: 0.8
}

const handleCrop = (data) => {
  console.log('裁剪数据:', data)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| src | String | '' | 是 | 图片源地址 |
| config | Object | {} | 否 | 裁剪配置 |
| width | Number \| String | '100%' | 否 | 容器宽度 |
| height | Number \| String | '400px' | 否 | 容器高度 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| crop | object | 裁剪时触发 |
| ready | - | 裁剪器准备就绪时触发 |

---

*最后更新: 2026-02-09*
