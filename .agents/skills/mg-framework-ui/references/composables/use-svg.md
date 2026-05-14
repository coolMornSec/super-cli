# useSvg 组合式函数

> SVG 资源管理函数，用于加载、注册并在组件中便捷使用 SVG 图标资源。

**版本**: 1.0.0 | **首次引入**: 1.0.0

## 基本用法

```ts
import { useSvg } from '@magustek/framework-ui'

const { getSvgUrl, hasSvg } = useSvg()

const url = getSvgUrl('user')
if (hasSvg('user')) {
  // ...
}
```

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| getSvgUrl | `(name: string) => string` | 获取图标资源地址 |
| hasSvg | `(name: string) => boolean` | 判断图标是否存在 |

## 相关函数

- [useMgIcon](./use-mg-icon.md) - 框架内置图标管理函数
- [useMgUiMsg](./use-mg-ui-msg.md) - 国际化消息管理函数

## 相关组件

- [MgIconRender](../components/mg-icon-render.md) - 图标渲染组件
- [MgIconPicker](../components/mg-icon-picker.md) - 图标选择器

---

*最后更新: 2026-02-09*
