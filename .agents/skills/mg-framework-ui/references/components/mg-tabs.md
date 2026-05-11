# MgTabs 组件

> 标签页组件，用于显示多个标签页

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgTabs v-model="activeTab">
    <MgTabPane label="标签 1" name="tab1">
      <div>标签 1 的内容</div>
    </MgTabPane>
    <MgTabPane label="标签 2" name="tab2">
      <div>标签 2 的内容</div>
    </MgTabPane>
  </MgTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgTabs, MgTabPane } from '@magustek/framework-ui'

const activeTab = ref('tab1')
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | String | '' | 否 | 活跃标签名 |
| type | String | 'card' | 否 | 标签页类型 |
| closable | Boolean | false | 否 | 标签页是否可关闭 |
| addable | Boolean | false | 否 | 是否可添加标签页 |
| editable | Boolean | false | 否 | 标签页是否可编辑 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string | 活跃标签改变时触发 |
| tab-change | string | 标签改变时触发 |
| tab-add | - | 添加标签页时触发 |
| tab-remove | string | 移除标签页时触发 |

---

*最后更新: 2026-02-09*
