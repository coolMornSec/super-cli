---
name: magus-workflow-governance
description: 用于在功能或变更中创建、评审或更新官方 OpenSpec change/workspace 产物与 capability specs。
---

# OpenSpec 治理

## 概述

该技能用于确保官方 OpenSpec 产物保持完整、最新，并且各自职责边界清晰，防止实现计划越权替代产品决策。

## 产物职责

- `openspec/changes/<change-id>/proposal.md`：说明为什么要做这项变更、成功标准是什么、哪些内容明确不在范围内
- `openspec/changes/<change-id>/design.md`：说明当前 change 的技术方案、流程、数据流、状态处理方式以及边界情况
- `openspec/changes/<change-id>/tasks.md`：说明当前 change 的里程碑、工作项、依赖关系和验收标准
- `openspec/changes/<change-id>/specs/...`：说明当前 change 对能力规格带来的新增或修改要求
- `openspec/changes/<change-id>/contracts/`：说明当前 change 的跨边界契约、请求示例、响应示例、错误语义、页面回流、接口资源或占位说明
- `openspec/specs/...`：说明已经归档生效的长期能力规格

## 质量门禁

如果缺少以下任一项，就应视为规格仍不完整：

- 明确的目标与非目标
- 清晰的范围边界
- 用户可见流程
- 边界情况与兼容性影响
- 验收标准或里程碑
- 当前 change 对应的能力规格差异
- 规格与设计阶段的 `contracts/` 产物

## 更新规则

只要实现改变了行为、契约或流程路径，就必须同步更新当前 change 的 `design.md` 与 `specs/...`。

只要交付范围或依赖顺序发生变化，就必须同步更新当前 change 的 `tasks.md`。

规格与设计阶段必须维护 `contracts/`；契约范围与结构应写入具体契约文件或 `design.md`。

新功能或新流程变更开始时，必须先创建当前 `change-id` 的官方 OpenSpec 工作区，再进入计划与实现。

## 分层规则

- OpenSpec 产物定义“必须构建什么”和“必须改变什么”。
- `superpowers:writing-plans` 定义“如何实现”。
- 绝不能让实现说明替代本应补齐的规格决策。
- `docs/requirements/*` 与 `docs/superpowers/specs/*` 仅可作为背景输入或辅助说明，不得作为新工作的正式规格写入目标。
- 测试分层、评审标准与验证结论格式不属于本技能职责范围。
