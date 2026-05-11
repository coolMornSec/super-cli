# MgBpmnViewer 组件

> BPMN 流程图查看器组件，用于显示和交互 BPMN 流程图

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```vue
<template>
  <MgBpmnViewer
    :xml="bpmnXml"
    style="height: 600px"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MgBpmnViewer } from '@magustek/framework-ui'

const bpmnXml = ref(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <!-- BPMN 内容 -->
</bpmn:definitions>`)
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| xml | String | '' | 是 | BPMN XML 内容 |
| url | String | '' | 否 | BPMN 文件 URL |
| width | Number \| String | '100%' | 否 | 容器宽度 |
| height | Number \| String | '600px' | 否 | 容器高度 |
| zoom | Number | 1 | 否 | 缩放比例 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| ready | - | 查看器准备就绪时触发 |
| elementClick | object | 点击流程元素时触发 |

## Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| zoomIn | - | void | 放大 |
| zoomOut | - | void | 缩小 |
| resetZoom | - | void | 重置缩放 |
| fitToScreen | - | void | 适应屏幕 |

---

*最后更新: 2026-02-09*
