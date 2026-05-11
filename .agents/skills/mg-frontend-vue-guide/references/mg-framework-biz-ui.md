---
name: mg-framework-biz-ui
description: Guide for using @magustek/framework-biz-ui library. Provides business components like MgBackWrap, MgComplexSelect, MgResourceSelect, MgBpmnDesigner, MgUpload, MgDict. Use when developing business features with the Magus framework business UI library.
---

# framework-biz-ui

业务组件库，业务开发过程中，经常用到的组件库

## 安装

```bash
pnpm add @magustek/framework-biz-ui
```

## 使用

```ts
// main.ts
import MgBizUi from '@magustek/framework-biz-ui'

import '@magustek/framework-biz-ui/dist/style.css'

app.use(MgBizUi)
```

## MgBackWrap

返回页面容器

- 属性

| 属性名   | 类型    | 说明             | 默认值 |
| -------- | ------- | ---------------- | ------ |
| showBack | boolean | 是否显示返回按钮 | true   |
| title    | string  | 标题             |        |

- 插槽

| 插槽名  | 说明                 |
| ------- | -------------------- |
| default | 主体内容             |
| title   | 自定义标题内容       |
| header  | 自定义标题内容       |
| append  | 插槽，自定义附加内容 |

- 使用示例

```vue
<template>
  <MgBackWrap :show-back="false">
    <template #header>
      <div>头部</div>
    </template>
    <div>主体</div>
  </MgBackWrap>
</template>
```

## MgComplexSelect

用户部门选择器

- 属性

| 属性名          | 类型                | 说明                  | 默认值                              |
| --------------- | ------------------- | --------------------- | ----------------------------------- |
| title           | string              | 标题                  |                                     |
| placeholder     | string              | 占位符                |                                     |
| teleported      | boolean             | 弹出窗是否插入到 body | false                               |
| dialogWidth     | string              | 弹窗宽度              | 75%                                 |
| dialogVisible   | boolean             | 是否显示弹窗          | false                               |
| crossSelect     | boolean             | 允许跨类型选择        | false                               |
| selectTypes     | **SelectTypes**     | 选择类型              | [{ type: '$USER', multiple: true }] |
| defaultSelected | **DefaultSelected** | 默认选中的数据        | {}                                  |
| defaultTab      | **SelectTypeName**  | 默认的选择类型        |                                     |
| multiple        | boolean             | 是否多选              |                                     |
| compCode        | string              | 公司 code             |                                     |
| compId          | string              | 公司 id               |                                     |
| disabled        | boolean             | 是否禁用              |                                     |
| dataType        | **SelectTypeName**  | 数据类型              |                                     |
| defaultValue    | string              | 默认值                |                                     |
| defaultLabel    | string              | 默认标签值            |                                     |

- 事件

| 事件名                 | 事件说明               | 回调参数            |
| ---------------------- | ---------------------- | ------------------- |
| update:defaultSelected | 默认选中的数据发生变化 | **DefaultSelected** |
| update:dialogVisible   | 弹窗显示发生变化       | boolean             |
| update:defaultValue    | 默认值发生变化         | string              |
| update:defaultLabel    | 默认标签值发生变化     | string              |
| confirm                | 确认事件               | **DefaultSelected** |

- SelectTypeName

```ts
type SelectTypeName = '$USER' | '$ORG' | '$WORKGROUP' | '$DUTY' | '$RELATION'
```

- SelectTypes

```ts
type SelectTypes = Array<{
  type: SelectTypeName
  label?: string
  /**
   * 是否可多选（部门选择时，表示部门可多选）
   */
  multiple?: boolean
  /**
   * 多选限制数量
   */
  limit?: number
  /**
   * 是否显示职务选择
   */
  withDuty?: boolean
  /**
   * 职位是否必选
   */
  requireDuty?: boolean
  /**
   * 限制职位选择数量
   */
  limitDuty?: number
  /**
   * 是否显示树形选择框
   */
  showCheckbox?: boolean
  /**
   * 是否严格选择，父子不互相关联
   */
  checkStrictly?: boolean
}>
```

- DefaultSelected

```ts
type DefaultSelected = {
  [key: SelectTypeName]: Array<{
    id: string
    name: string
    duty?: Array<{
      id: string
      name: string
    }>
  }>
}
```

- 使用示例

```vue
<template>
  <MgComplexSelect
    :selectTypes="selectTypes"
    :default-selected="modelValue"
    @confirm="onConfirmSelect"
  ></MgComplexSelect>
</template>

<script lang="ts" setup>
const selectTypes = ref<SelectTypes>([
  { type: '$USER', multiple: false },
  { type: '$ORG', multiple: false, withDuty: true },
  { type: '$WORKGROUP', multiple: false, withDuty: false },
  { type: '$DUTY', multiple: true },
  { type: '$RELATION', multiple: false, withDuty: true },
])

const modelValue = ref({})

const onConfirmSelect = (data) => {
  console.log(data)
}
</script>
```

## MgResourceSelect

资源选择器

- 属性

| 属性名          | 类型    | 说明                  | 默认值 |
| --------------- | ------- | --------------------- | ------ |
| title           | string  | 标题                  |        |
| placeholder     | string  | 占位符                |        |
| teleported      | boolean | 弹出窗是否插入到 body | false  |
| dialogWidth     | string  | 弹窗宽度              | 75%    |
| dialogVisible   | boolean | 是否显示弹窗          | false  |
| defaultSelected |         | 默认选中的数据        |        |
| resourceCode    | string  | 资源编码              |        |
| multiple        | boolean | 是否多选              |        |
| disabled        | boolean | 是否禁用              |        |

- 事件

| 事件名                 | 事件说明               | 回调参数 |
| ---------------------- | ---------------------- | -------- |
| update:defaultSelected | 默认选中的数据发生变化 |          |
| update:dialogVisible   | 弹窗显示发生变化       | boolean  |
| confirm                | 确认事件               |          |

## MgBpmnDesigner

流程设计器

- 属性

| 属性名             | 类型    | 说明             | 默认值 |
| ------------------ | ------- | ---------------- | ------ |
| modelValue/v-model | string  | 流程图 xml 内容  |        |
| showGrid           | boolean | 是否显示背景网格 | false  |

- 方法

| 方法名        | 说明               | 参数 |
| ------------- | ------------------ | ---- |
| validate      | 验证流程图是否正确 |      |
| getProcessKey | 获取流程图的 Key   |      |

- 使用示例

```vue
<template>
  <MgBpmnDesigner v-model="modelValue"> </MgBpmnDesigner>
</template>

<script lang="ts" setup>
const modelValue = ref('')
</script>
```

## MgUpload

文件上传

- 属性

支持 el-upload 原生属性

扩展属性

| 属性名             | 类型     | 说明         | 默认值 |
| ------------------ | -------- | ------------ | ------ |
| modelValue/v-model | string[] | 文件 id 数组 | []     |
| useDefault         | boolean  | 使用默认上传 | true   |

- 使用示例

```vue
<template>
  <MgDict v-model="modelValue"> </MgDict>
</template>

<script lang="ts" setup>
const modelValue = ref(['文件 id'])
</script>
```

## MgDict

字典组件, 根据字典 code 渲染对应字典项，或者级联选择字典

- 属性

支持 el-select/el-cascader 原生属性

扩展属性

| 属性名   | 类型               | 说明                       | 默认值 |
| -------- | ------------------ | -------------------------- | ------ |
| dictCode | string             | 字典 code                  |        |
| dictType | select \| cascader | 下拉选择字典、级联选择字典 | select |

- 使用示例

```vue
<template>
  <MgDict v-model="modelValue" dict-code="code"> </MgDict>
</template>

<script lang="ts" setup>
const modelValue = ref('')
</script>
```
