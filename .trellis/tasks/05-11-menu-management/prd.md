# 菜单管理功能开发

## Goal

基于菜单管理需求文档（`docs/requirements/菜单管理.md`），在 `packages/frontend-vue` 中实现完整的菜单管理功能，包括菜单树展示、搜索过滤、子菜单列表（CRUD）、新增/编辑菜单页面。

## Requirements

### 主页面：左右分栏布局
- **左侧菜单树**：使用 MgTree 展示完整菜单层级，支持关键字前端过滤搜索、展开/收起、节点选中高亮、手动刷新；树节点不显示编辑/删除按钮（行操作在右侧表格中）；加载时显示 loading 状态
- **右侧编辑区**：使用 MgPageTable 展示当前选中节点的直接子菜单（查询、新增、批量删除、编辑、删除）；批量删除按钮在无勾选时禁用
- 虚拟根节点（`__ROOT__`）内嵌到 MgTree 数据中，默认选中，展示一级菜单；不参与编辑/删除/批量删除

### 新增菜单页面
- 路由 `/system/menu/add?parentId=xxx`，使用 MgBackWrap
- 表单字段：菜单名称（必填）、菜单编码（拼音+6位时间戳自动生成，只读）、菜单路径、访问类型、排序值
- 包含"重置"按钮清空表单、"确认"按钮保存数据
- 确认后返回主页面，刷新树和列表

### 编辑菜单页面
- 路由 `/system/menu/edit/:id?parentId=xxx`，使用 MgBackWrap
- 与新增共用 MenuForm.vue 组件，菜单编码不可修改
- 确认后返回主页面，刷新树和列表

### 业务规则
- 菜单名称必填；编码全局唯一，由名称拼音+6位时间戳自动生成（编辑时不可修改）
- 删除为物理删除，需二次确认（ElMessageBox）；存在子菜单时不允许删除
- 批量删除仅对已勾选项生效，任一存在子菜单则整体失败
- 排序值越小越靠前；子菜单列表仅显示当前节点的直接子菜单

## Acceptance Criteria

- [ ] 左侧菜单树可通过关键字过滤，展示层级结构清晰
- [ ] 默认选中虚拟根节点，右侧展示一级菜单
- [ ] 点击树节点后，右侧加载该节点的直接子菜单
- [ ] 子菜单列表支持菜单名称、菜单编码查询
- [ ] 可完成子菜单新增、编辑、删除、批量删除闭环
- [ ] 新增时根据菜单名称自动生成全局唯一编码（拼音+6位时间戳）
- [ ] 删除/编辑/新增后刷新树和列表
- [ ] 删除有二次确认；有子菜单时不允许删除并提示
- [ ] 批量删除遇任一有子菜单时整体失败
- [ ] 表单校验与提示清晰友好

## Decision (ADR-lite)

| 决策点 | 选择 | 理由 |
|--------|------|------|
| Mock 策略 | vite-plugin-mock | 拦截真实 HTTP 请求，后续切换后端只需移除 mock 配置 |
| 布局 | MgLayout（aside+main） | 天然支持左右分栏，不引入额外容器嵌套 |
| API 风格 | 扁平端点 | 端点语义清晰，与 REST 惯例一致 |
| 虚拟根节点 | 内嵌到 MgTree 数据 | 统一树交互，MgTree `isEdit=false` 关闭节点操作按钮 |
| 表单组织 | 共享 MenuForm.vue | add.vue/edit.vue 引用同一组件，逻辑各自处理 |
| 编码生成 | 拼音 + 6位时间戳 | 确保全局唯一且有可读性 |
| 树搜索 | 前端过滤 | MgTree 内置搜索（`isNeedSearch=true`），实时过滤 |
| 分页 | pageSize=100 | 跟随 MgPageTable 组件默认值 |
| 树刷新 | 手动刷新按钮 | MgTree `isNeedReload=true`，触发 reload-tree 事件 |

### API 端点

```
GET    /api/menu/tree                          # 完整菜单树
GET    /api/menu/children?parentId=&name=&code=&page=&size=  # 子菜单分页
POST   /api/menu                               # 新增
PUT    /api/menu/:id                           # 编辑
DELETE /api/menu/:id                           # 删除（校验子菜单）
DELETE /api/menu/batch?ids=1,2,3               # 批量删除（校验子菜单）
```

## Out of Scope

- 角色授权、按钮权限
- 菜单图标、菜单显隐控制
- 拖拽排序
- 动态路由生成规则

## Technical Approach

### 技术栈
- Vue 3 Composition API + `<script setup lang="ts">`
- MgLayout（aside=树 + main=列表）— 左右分栏，支持侧边栏折叠
- MgTree（左侧菜单树，内嵌虚拟根节点）
- MgPageTable（右侧列表，搜索+工具栏+表格+分页）
- MgBackWrap（新增/编辑页返回包装）
- Element Plus（el-form, el-input, el-select, el-form-item, ElMessage, ElMessageBox）
- 使用现有 `src/types/menu.ts` 类型定义
- 拼音库：`pinyin-pro`，TypeScript 原生支持，用于编码自动生成

### 文件结构

```
src/pages/system/menu/
├── index.vue              # 主页面，MgLayout(aside=MgTree + main=MgPageTable)
├── add.vue                # 新增页面，MgBackWrap + MenuForm
├── edit.vue               # 编辑页面，MgBackWrap + MenuForm
└── components/
    └── MenuForm.vue       # 共享表单组件
mock/
└── menu.ts                # vite-plugin-mock handler
```

### 数据流
- 树数据：GET /api/menu/tree → 前置 MENU_ROOT_NODE → MgTree 渲染
- 列表数据：选中节点 parentId → GET /api/menu/children → MgPageTable 渲染
- 新增/编辑：路由传参 → MenuForm 填充 → POST/PUT → 返回主页
- 删除/批量删除：ElMessageBox 确认 → DELETE → 刷新树和列表

### MgTree 关键配置
- `nodeKey="id"`, `props="{ label: 'name', children: 'children' }"`
- `isEdit=false`（树节点无编辑/删除按钮，行操作在右侧表格中）
- `isNeedSearch=true`（客户端关键字过滤）
- `isNeedReload=true`（手动刷新按钮，触发 `reload-tree` 事件）
- `defaultExpandedKeys: [MENU_ROOT_ID]`，默认选中虚拟根节点

## Technical Notes

- 类型定义：`src/types/menu.ts` 已定义 MenuItem, MenuTreeNode, MenuFormModel, MenuSearchForm, MENU_ROOT_ID, MENU_ROOT_NODE
- 路由：基于文件自动路由（unplugin-vue-router），页面放在 `src/pages/system/menu/` 自动注册
- 框架组件：MgLayout, MgTree, MgPageTable, MgBackWrap 从 `@magustek/framework-ui` 导入，全局自动注册
- 自动导入：vue, vue-router, pinia, es-toolkit, Element Plus 组件均全局可用
- vite-plugin-mock：已在 package.json，需在 vite.config.ts 中添加插件配置
