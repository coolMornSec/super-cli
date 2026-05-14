# MgCascader 组件

> 级联选择器组件，用于选择多级分类数据

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgCascader
    v-model="selectedValue"
    :options="options"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgCascader } from '@magustek/framework-ui'

const selectedValue = ref([])
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' }
        ]
      }
    ]
  }
]

const handleChange = (value) => {
  console.log('选择值:', value)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| modelValue | Array | [] | 否 | 选中的值 |
| options | Array | [] | 是 | 级联数据源 |
| props | Object | - | 否 | 配置对象 |
| placeholder | String | '请选择' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |
| clearable | Boolean | true | 否 | 是否显示清空按钮 |
| filterable | Boolean | false | 否 | 是否可搜索 |
| multiple | Boolean | false | 否 | 是否多选 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | array | 选中值改变时触发 |
| change | array | 选中值改变时触发 |
| blur | - | 失焦时触发 |
| focus | - | 获焦时触发 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | - | 自定义内容 |

---

*最后更新: 2026-02-09*
