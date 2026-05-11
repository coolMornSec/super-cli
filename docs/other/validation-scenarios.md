# 流程验证场景

使用这些场景验证仓库工作流不只是“写在文档里”，而是真的会被执行。

## 使用方式

对于每个场景：

1. 从 `AGENTS.md` 开始阅读约束。
2. 设置 `openspec/changes/<change-id>/process/workflow-state.md`。
3. 让 AI 继续推进当前任务。
4. 检查是否触发了预期的技能、文档产物与回滚行为。
5. 运行 `node scripts/check-workflow.mjs --change <change-id>`。

## 场景 1：新的前端功能

**目的：** 验证基于 Vue 和 Magustek UI 依赖的完整功能交付路径，且工作从官方 OpenSpec change 工作区开始。

**输入提示词：**

> 使用 `magus-workflow-orchestrator` 规划并实现后台系统中的“用户导入”页面。页面必须包含可搜索的导入历史表格、导入弹窗和下载模板动作。遵循 `mg-frontend-vue-guide` 与 `mg-framework-ui`。在当前 change 规格准备好之前，不得直接开始编码。

**预期技能路由：**

- `magus-workflow-orchestrator`
- `magus-workflow-governance`
- `magus-base-standards`
- `superpowers:brainstorming`
- `mg-frontend-vue-guide`
- `mg-framework-ui`
- `superpowers:writing-plans`
- `superpowers:test-driven-development`

**实现前必须存在的产物：**

- `openspec/changes/<change-id>/proposal.md`
- `openspec/changes/<change-id>/specs/...`
- `openspec/changes/<change-id>/design.md`
- `openspec/changes/<change-id>/tasks.md`
- 实现计划

**失败信号：**

- 在当前 change 文档未齐备前就开始编码
- 只用了通用 Vue 指南，没有调用 `mg-frontend-vue-guide`
- 未校验 `.npmrc` 就安装 `@magustek/*` 依赖

## 场景 2：实现中途需求漂移

**目的：** 验证当编码阶段暴露未决产品规则时，会回滚到本地 `brainstorming` 并更新当前 change。

**输入提示词：**

> 实现过程中，产品补充要求：若导入用户的手机号重复，不应直接拒绝，而应标记为人工处理。请正确更新当前工作。

**预期行为：**

- 停止直接编码
- 回到本地 `brainstorming`
- 更新当前 change 的 `design.md`
- 更新当前 change 的 `specs/...`
- 若范围变化则更新当前 change 的 `tasks.md`
- 必要时修订实现计划

**失败信号：**

- 直接改代码但没有同步当前 change 文档
- 把新的业务规则当成纯实现细节处理

## 场景 3：无产品歧义的明确缺陷修复

**目的：** 验证边界清晰的缺陷修复不必强制走完整新功能发现流程，但仍必须以已批准的 current change/spec 为依据。

**输入提示词：**

> 导入历史表格默认按升序排序，但已批准设计要求按最新优先。请在不改变范围的前提下修复。

**预期行为：**

- 如果现有 change/spec 已覆盖目标行为，可以不走完整新功能发现流程
- 仍然需要遵守仓库标准与实现纪律
- 完成前仍需请求评审与验证

**失败信号：**

- AI 开始虚构新的产品行为
- 在未更新当前 change/spec 的情况下改变流程或范围

## 场景 4：需求未写标题，但页面仍需复用标准骨架

**目的：** 验证 AI 能区分“禁止新增文本”与“允许复用标准结构组件”，避免因为过度收缩而绕开标准骨架。

**输入提示词：**

> 需求文档没有写“新增页标题”或“编辑页标题”，但页面仍然需要使用公司标准返回骨架组件。请严格按规范处理，不要手工拼页面头部。

**预期行为：**

- AI 先查真实组件文档、类型声明或实现，确认标准骨架组件的默认标题与返回行为。
- AI 在当前 change 的规格或 readiness 中补充“页面可见元素增量审查”，明确区分结构、交互、文本。
- AI 保留标准返回骨架，但关闭或不传需求未定义的标题文本。

**失败信号：**

- AI 因“不能加标题”而直接放弃标准返回骨架组件。
- AI 未核对组件真实默认行为，仅凭名字或经验猜测组件一定会渲染标题。
- AI 手工拼装返回区，替代已有标准骨架能力。

## 场景 5：复杂前端页面的测试分层

**目的：** 验证 AI 不会把大部分需求都压到 E2E，而是先完成需求到测试层的映射。

**输入提示词：**

> 为一个包含树、表单、列表、回流的管理页面写实现计划。要求 TDD，但不要让开发过程完全依赖长时间的 E2E 循环。

**预期行为：**

- AI 在当前 change 的计划或 readiness 中写出需求-测试矩阵，并标注最低可证明层级。
- 纯逻辑下沉到单测，页面局部联动下沉到组件/集成测试。
- E2E 只保留入口、回流、关键主链路和高风险交互。
- AI 提供聚焦快速命令与全量回归命令，而不是每轮都跑整套 E2E。

**失败信号：**

- AI 把表单校验、纯状态逻辑、参数拼装等全部放入 E2E。
- AI 的 TDD 主循环只能依赖整套 E2E。
- 计划中没有测试分层说明，只有单一的 Playwright 全量命令。

## 人工复核问题

- AI 是否选择了正确阶段？
- AI 是否选择了正确的仓库技能？
- AI 是否创建或更新了正确的 current change 文件？
- 遇到歧义时，AI 是否回滚而不是猜测？
- AI 是否保持了 OpenSpec 产物与实现计划之间的边界？
