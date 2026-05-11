# 功能生命周期检查清单

本文档是 `AGENTS.md` 的派生检查清单。若与 `AGENTS.md` 冲突，以 `AGENTS.md` 为准。

当前 change 的运行态文件默认指向 `openspec/changes/<change-id>/process/workflow-state.md` 与 `openspec/changes/<change-id>/process/implementation-readiness.md`。

## Brainstorming

- 目标、范围、约束与成功标准已经明确
- 不存在需要编码时临时发明的业务规则
- 用户可见交互已讨论清楚

## Proposal / Design / Tasks / Spec

- 四份 OpenSpec 文档职责清晰，没有互相替代
- 规格描述的是“要做什么”，不是“怎么实现”
- 设计、任务和规格增量与当前需求一致

## Writing Plans

- 实现计划已经列出具体文件、测试与验证命令
- 计划没有替代规格决策
- 计划明确禁止降级实现、最小实现和临时占位实现
- 若涉及前端页面，计划已按 `docs/agents/frontend/AGENTS.md` 明确页面可见元素增量审查与组件选型边界
- 若涉及前端测试，计划已按 `docs/agents/test/AGENTS.md` 给出测试分层方案与需求-测试矩阵

## Implementation

- 先有失败用例，再写正式实现
- 没有为了通过测试而改弱实现
- 进入 implementation 前必须先完成当前 change 的 `implementation-readiness.md`，并把它作为门禁记录而不是计划产物
- implementation 开始前，所有 readiness 条目都已确认完成
- 若涉及前端实现，已按 `docs/agents/frontend/AGENTS.md` 完成页面可见元素审查，并核对标准结构组件真实能力
- 若涉及前端测试，日常红绿循环优先使用最低成本测试层，不依赖整套 E2E 作为唯一反馈路径
- 与本次变更相关的自动化规范检查已经通过
- 不存在任何残留的占位实现或轻量实现

## Code Review

- 评审先关注规范偏差、风险、回归和缺失验证
- 评审明确检查公司规范是否被遵守，而不只检查功能是否可运行
- 若发现实现降级、测试规避或跳流程，必须判为不合格
- 关键需求点或关键异常路径未覆盖时，不得给出通过结论
- 若涉及前端页面，发现需求未定义文本被擅自新增，或因过度收缩绕开标准骨架组件，必须判为不合格
- 若涉及前端测试，发现可由低层测试证明的需求被整体压入 E2E，导致反馈链过慢，必须要求补足测试分层

## Review And Verification

- `node scripts/check-workflow.mjs --change <change-id>` 通过
- 若涉及前端变更，`node scripts/check-frontend-conventions.mjs` 通过
- 聚焦测试、类型检查和构建都已完成
- 评审和验证记录已补齐
- 评审结论明确区分已覆盖、未覆盖与是否允许进入下一阶段
- 对于 `implementation-readiness.md` 未覆盖的条目，评审只能给出阻塞或有条件结论，不能直接放行
- 进入 `finish` 前没有任何待补规范项
