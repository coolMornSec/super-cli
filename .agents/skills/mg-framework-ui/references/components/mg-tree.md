# MgTree 组件

> 树形结构展示和操作组件，基于 Element Plus 的 ElTree 增强

**版本**: 5.2.0 | **首次引入**: 5.2.0

## 目录

- [基本用法](#基本用法)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)
- [Methods](#methods)
- [示例](#示例)
- [类型定义](#类型定义)

## 基本用法

```vue
<template>
  <MgTree
    :data="treeData"
    :props="{ children: 'children', label: 'text' }"
    @node-click="handleNodeClick"
  />
</template>

<script setup lang="ts">
import { MgTree } from '@magustek/framework-ui'

const treeData = [
  {
    text: '一级 1',
    children: [
      {
        text: '二级 1-1',
        children: [
          { text: '三级 1-1-1' }
        ]
      }
    ]
  }
]

const handleNodeClick = (data) => {
  console.log('节点被点击:', data)
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| data | Array | [] | 是 | 树形数据源 |
| isEdit | Boolean | true | 否 | 是否启用编辑模式（显示添加、编辑、删除按钮） |
| isNeedReload | Boolean | true | 否 | 是否显示刷新按钮 |
| icon | String | '' | 否 | 自定义树节点图标 |
| iconSpin | Boolean | true | 否 | 节点伸缩时是否旋转图标 |
| iconList | Array | [] | 否 | 自定义树节点图标列表 |
| magusIconClass | Function | - | 否 | 自定义图标选择函数 |
| magusIconStyle | Function \| Object | - | 否 | 自定义图标样式 |
| nodeIsNeedAdd | Function \| Boolean | true | 否 | 节点是否显示添加按钮 |
| nodeIsNeedEdit | Function \| Boolean | true | 否 | 节点是否显示编辑按钮 |
| nodeIsNeedDelete | Function \| Boolean | true | 否 | 节点是否显示删除按钮 |
| isNeedSearch | Boolean | true | 否 | 是否显示搜索框 |
| highlight | Boolean | true | 否 | 是否高亮选中节点 |
| nodeKey | String | 'nodeId' | 否 | 树节点唯一标识字段名 |
| isNeedExpand | Boolean | true | 否 | 是否显示展开/收缩按钮 |
| defaultExpandAll | Boolean | false | 否 | 是否默认展开所有节点 |
| defaultExpandedKeys | Array | [] | 否 | 默认展开的节点 ID 列表 |
| showLine | Boolean | true | 否 | 是否显示树形连接线 |
| showLabelLine | Boolean | false | 否 | 树节点 label 是否显示连接线 |
| props | Object | { children: 'children', label: 'text', disabled: 'disabled' } | 否 | 树节点配置对象 |
| matchCase | Boolean | true | 否 | 搜索时是否区分大小写 |
| filterPlaceeHolder | String | '请输入节点名称' | 否 | 搜索框占位符 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| node-click | { ...data, node } | 节点被点击时触发 |
| reload-tree | {} | 点击刷新按钮时触发 |
| add-node | { ...data, node } | 点击添加按钮时触发 |
| edit-node | { ...data, node } | 点击编辑按钮时触发 |
| delete-node | { ...data, node } | 点击删除按钮时触发 |
| node-dbl-click | node | 节点被双击时触发 |

## Slots

| 插槽名 | Props | 说明 |
|--------|-------|------|
| default | { node, data } | 自定义树节点内容 |
| treeButton | - | 顶部工具栏右侧自定义按钮 |
| customButton | { data, node } | 节点右侧自定义按钮 |
| empty | - | 树为空时的提示内容 |
| treeFooter | - | 树底部自定义内容 |

## Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| goFilterText | val: string | void | 主动过滤树节点 |
| setCurrentKey | uids: string | void | 选中某个节点 |
| setCheckedKeys | checkedData: string[] | void | 设置 checkbox 选中的节点 |
| getCheckedNodes | leafOnly?: boolean, includeHalfChecked?: boolean | Array | 获取 checkbox 选中的节点 |

## 示例

### 基础用法

```vue
<template>
  <MgTree :data="treeData" />
</template>

<script setup lang="ts">
import { MgTree } from '@magustek/framework-ui'

const treeData = [
  {
    text: '一级 1',
    nodeId: '1',
    children: [
      { text: '二级 1-1', nodeId: '1-1' },
      { text: '二级 1-2', nodeId: '1-2' }
    ]
  },
  {
    text: '一级 2',
    nodeId: '2',
    children: [
      { text: '二级 2-1', nodeId: '2-1' }
    ]
  }
]
</script>
```

### 启用编辑功能

```vue
<template>
  <MgTree
    :data="treeData"
    :is-edit="true"
    @add-node="handleAddNode"
    @edit-node="handleEditNode"
    @delete-node="handleDeleteNode"
  />
</template>

<script setup lang="ts">
const handleAddNode = (data) => {
  console.log('添加节点:', data)
}

const handleEditNode = (data) => {
  console.log('编辑节点:', data)
}

const handleDeleteNode = (data) => {
  console.log('删除节点:', data)
}
</script>
```

### 自定义图标

```vue
<template>
  <MgTree
    :data="treeData"
    :icon-list="['folder', 'file']"
    :magus-icon-class="getIcon"
  />
</template>

<script setup lang="ts">
const getIcon = (node, data, list) => {
  return node.isLeaf ? 'file' : 'folder'
}
</script>
```

### 自定义节点内容

```vue
<template>
  <MgTree :data="treeData">
    <template #default="{ node, data }">
      <div class="custom-node">
        <span>{{ data.text }}</span>
        <span class="node-id">({{ data.nodeId }})</span>
      </div>
    </template>
  </MgTree>
</template>

<style scoped>
.custom-node {
  display: flex;
  gap: 8px;
}

.node-id {
  color: #999;
  font-size: 12px;
}
</style>
```

## 类型定义

```typescript
interface TreeData {
  text: string              // 节点显示文本
  nodeId: string           // 节点唯一标识
  children?: TreeData[]    // 子节点列表
  disabled?: boolean       // 是否禁用
  icon?: string           // 节点图标
}

interface TreeProps {
  children: string         // 子节点字段名
  label: string           // 显示文本字段名
  disabled: string        // 禁用字段名
}

interface NodeClickData {
  [key: string]: any      // 节点数据
  node: TreeNode          // 树节点对象
}
```

## 依赖

- element-plus (ElTree)
- @magustek/framework-ui (MgIcon)

---

*最后更新: 2026-02-09*
