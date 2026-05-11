# 仓库路径索引

本文档提供仓库中所有关键文件和目录的快速索引,帮助 AI 和开发者快速定位正确的文件路径。

## 治理层

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 工作流治理规则 | `AGENTS.md` | 活跃 | 仓库级工作流契约,定义阶段顺序、门禁、回滚规则 |
| 技能定义目录 | `.agents/skills/` | 活跃 | 所有仓库技能的定义目录 |
| 编排技能 | `.agents/skills/magus-workflow-orchestrator/SKILL.md` | 活跃 | 总路由器,决定当前阶段 |
| 治理技能 | `.agents/skills/magus-workflow-governance/SKILL.md` | 活跃 | 保证 OpenSpec 产物职责分离 |
| 标准技能 | `.agents/skills/magus-base-standards/SKILL.md` | 活跃 | 工程、文档、评审规范 |
| Vue 前端技能 | `.agents/skills/mg-frontend-vue-guide/SKILL.md` | 活跃 | Vue 前端开发规范 |
| UI 组件技能 | `.agents/skills/mg-framework-ui/SKILL.md` | 活跃 | Magustek 企业级 UI 组件规范 |
| 前端执行规范 | `docs/agents/frontend/AGENTS.md` | 活跃 | 处理前端任务前必须先读取的执行规范 |
| 前端测试执行规范 | `docs/agents/test/AGENTS.md` | 活跃 | 处理前端测试任务前必须先读取的执行规范 |

## 规格层

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 变更工作区 | `openspec/changes/<change-id>/` | 活跃 | 单次变更的正式工作区 |
| 变更提案 | `openspec/changes/<change-id>/proposal.md` | 活跃 | 为什么做、目标、非目标 |
| 变更设计 | `openspec/changes/<change-id>/design.md` | 活跃 | 技术方案、边界处理、风险 |
| 变更任务 | `openspec/changes/<change-id>/tasks.md` | 活跃 | 任务拆分、依赖、验收标准 |
| 变更规格 | `openspec/changes/<change-id>/specs/` | 活跃 | 规格差异文档 |
| 长期能力规格 | `openspec/specs/` | 活跃 | 归档后的长期能力规格库 |
| OpenSpec 配置 | `openspec/config.yaml` | 活跃 | OpenSpec 工具配置 |

## 执行层

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 实现计划 | `docs/superpowers/plans/` | 活跃 | 如何实现的详细计划 |
| 评审记录 | `docs/superpowers/reviews/` | 活跃 | 独立评审与验证记录 |
| 可视化材料 | `docs/superpowers/visuals/` | 活跃 | 辅助决策的可视化材料 |

## 流程定义与运行态

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 当前 change 工作流状态 | `openspec/changes/<change-id>/process/workflow-state.md` | 活跃 | 当前阶段、阻塞项、下一步动作 |
| 当前 change 实现就绪记录 | `openspec/changes/<change-id>/process/implementation-readiness.md` | 活跃 | 进入 implementation 前的门禁记录 |
| 子 Agent 调用指南 | `docs/process/subagents/subagent-invocation-guide.md` | 活跃 | 独立子 Agent 的调用约束与模板 |
| Plan/Review Agent 角色 | `docs/process/subagents/plan-review-agent-role.md` | 活跃 | 独立审查者角色定义 |
| Verification Agent 角色 | `docs/process/subagents/verification-agent-role.md` | 活跃 | 独立验证者角色定义 |
| Explore Agent 角色 | `docs/process/subagents/explore-agent-role.md` | 活跃 | 事实收集者角色定义 |
| 阶段检查清单 | `docs/process/stage-checklists/` | 活跃 | AGENTS 的派生 checklist |
| 验证场景 | `docs/other/validation-scenarios.md` | 辅助 | 流程演练场景与测试用例 |

## 校验层

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 工作流门禁脚本 | `scripts/check-workflow.mjs` | 活跃 | 校验阶段、文档完整性、任务进度 |
| 工作流门禁测试 | `scripts/check-workflow.test.mjs` | 活跃 | 工作流门禁的回归测试 |
| 前端规范脚本 | `scripts/check-frontend-conventions.mjs` | 活跃 | 校验前端组件规范、禁用降级 |
| 前端规范测试 | `scripts/check-frontend-conventions.test.mjs` | 活跃 | 前端规范的回归测试 |

## 代码工作区

| 文件/目录 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| Vue 前端工作区 | `packages/frontend-vue/` | 活跃 | Vue 3 前端代码 |
| Node 后端工作区 | `packages/backend-node/` | 活跃 | Node 后端代码 |
| 前端单元测试 | `packages/frontend-vue/tests/unit/` | 活跃 | Vitest 单元测试 |
| 前端 E2E 测试 | `packages/frontend-vue/tests/e2e/` | 活跃 | Playwright E2E 测试 |

## 环境配置

| 文件 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| NPM 配置 | `.npmrc` | 活跃 | 公共源与 Magustek 私有源映射 |
| Git 忽略 | `.gitignore` | 活跃 | Git 忽略规则 |

## 快速查找规则

### 我需要找技能定义
→ `.agents/skills/<skill-name>/SKILL.md`

### 我需要找当前 change 的规格
→ `openspec/changes/<change-id>/`

### 我需要找实现计划
→ `docs/superpowers/plans/`

### 我需要找评审记录
→ `docs/superpowers/reviews/`

### 我需要找当前阶段
→ `openspec/changes/<change-id>/process/workflow-state.md`

### 我需要找门禁脚本
→ `scripts/check-workflow.mjs` 或 `scripts/check-frontend-conventions.mjs`

### 我需要找独立 Agent 角色定义
→ `docs/process/subagents/*-agent-role.md`

## 常见错误路径

以下路径已废弃或不存在,请使用正确路径:

| ❌ 错误路径 | ✅ 正确路径 | 说明 |
| --- | --- | --- |
| `.agents/skills/<skill-name>/skill.md` | `.agents/skills/<skill-name>/SKILL.md` | 文件名是大写 `SKILL.md` |

## 路径命名约定

- 技能目录: `<skill-name>` (kebab-case)
- 技能文件: `SKILL.md` (大写)
- Change ID: `<change-id>` (kebab-case)
- 计划文件: `YYYY-MM-DD-<change-id>.md`
- 评审文件: `YYYY-MM-DD-<change-id>-review.md`
- 验证文件: `YYYY-MM-DD-<change-id>-verification.md`
