# L4 技能执行适配规范

## 定位

本文档是本仓库对通用技能的仓库级适配层。凡是 L4 工作流中使用 `superpowers:*`、`magus-*` 或其他外部技能时，若通用技能规则与本仓库 L4 规范冲突，以本文档和 `magus-workflow-orchestrator/levels/L4-standard-dev.md` 为准。

本适配层的目标不是降低门禁，而是把不可执行、互相冲突或容易被静默跳过的规则改写为可审计、可阻塞、可人工确认的规则。

## 1. 独立评审与验证能力适配

### 规则

- 若当前宿主允许调用独立 sub-agent，必须按 L4 使用独立 `Plan/Review Agent`、`Code Review Agent` 与 `Verification Agent`。
- 若当前宿主不允许主动调用 sub-agent，不得由主实现者替代独立评审或独立验证。
- sub-agent 不可用时，必须立即把当前阶段状态记为 `blocked: independent-agent-unavailable`，并等待用户选择后续处理方式。

### 允许的处理方式

仅允许以下三种：

1. 用户显式授权使用 sub-agent。
2. 用户指定外部人工 reviewer / verifier，并要求其结论落盘。
3. 停止在当前门禁，不进入下一阶段。

### 必填记录

`workflow-state.md` 与 `implementation-readiness.md` 必须记录：

```md
- Independent Review Mode: subagent | human | blocked
- Reviewer / Verifier:
- Review Evidence:
- User Confirmation:
- May Proceed: yes | no
```

`May Proceed` 不是 `yes` 时，不得进入后续阶段。

## 2. Brainstorming 与 OpenSpec 单一事实源

### 规则

- 本仓库中，正式规格事实源只能是 `openspec/changes/<change-id>/`。
- `superpowers:brainstorming` 产出的内容只允许作为阶段记录，默认落在 `openspec/changes/<change-id>/process/brainstorming-notes.md`。
- `docs/superpowers/specs/*` 只能作为辅助背景，不得替代 `proposal.md`、`specs/.../spec.md`、`design.md` 或 `contracts/`。
- 设计批准必须绑定当前 change 的 `design.md` 或明确的设计摘要，并写入 `workflow-state.md`。

### 禁止

- 禁止先写 `docs/superpowers/specs/*` 再反向补 OpenSpec。
- 禁止把聊天中的口头设计批准视为 OpenSpec `design` 阶段完成。

## 3. Writing Plans 仓库适配

### 规则

- `superpowers:writing-plans` 在本仓库只负责生成 `docs/superpowers/plans/<plan>.md`。
- 不得自动 commit，除非用户明确要求。
- 不得强制 dedicated worktree，除非用户或仓库级策略明确要求。
- 计划生成后必须进入 Plan/Review 门禁；未完成独立审查与用户确认前，不得进入 `implementation`。
- 若 sub-agent 不可用，不得展示或默认选择 “Subagent-Driven recommended”，而是进入独立评审能力适配流程。

### 必填记录

计划完成后必须在 `workflow-state.md` 记录：

```md
- Plan Path:
- Plan Review Mode: subagent | human | blocked
- Plan Review Evidence:
- User Confirmed Implementation: yes | no
```

`User Confirmed Implementation` 不是 `yes` 时，不得写实现代码。

## 4. AskUserQuestion / Question 适配

### 规则

当技能要求 `AskUserQuestion`、`Question` 或类似交互工具，但当前宿主不可用时，必须使用聊天确认桥接，不得自动采用默认值。

### 聊天确认桥接格式

```md
需要确认以下配置。回复“使用默认”或逐项修改：

1. 配置项 A：默认值
2. 配置项 B：默认值
3. 配置项 C：默认值

等待确认后继续。
```

### 禁止

- 禁止把“批准进行”解释为批准所有隐含配置。
- 禁止因为存在默认值就跳过确认。
- 禁止在未确认版本、端口、数据源、注册中心等关键工程配置时生成正式骨架。

确认结果必须写入 `implementation-readiness.md`。

## 5. TDD 行为代码与结构产物分层

### 行为代码必须 TDD

以下内容必须先写失败测试，再写实现：

- 业务规则
- 领域服务
- 状态流转
- API payload 映射
- 表单校验
- 删除、保存、批量操作等用户可见行为
- 数据转换、编码生成、权限判断等纯逻辑

### 结构产物允许验证优先

以下内容不强制红绿 TDD，但必须有明确验证命令：

- Maven / Gradle POM
- Dockerfile
- Spring Boot Application 启动类
- 配置文件
- i18n resource
- Vue 文件式路由装配页
- 自动生成类型声明
- 无业务逻辑的模块骨架

### 必填记录

使用 TDD 例外时，必须在 `implementation-readiness.md` 或计划中记录：

```md
TDD Exception:
- File:
- Reason: structural/configuration artifact
- Verification command:
- Risk:
```

### 禁止

- 禁止用“结构产物例外”绕开业务规则测试。
- 禁止把没有测试的业务逻辑包装成配置或骨架。
- 禁止用手工检查替代可自动执行的验证命令。

## 6. 完成状态口径

L4 必须明确区分：

- `implementation complete`：实现代码和开发期验证完成。
- `review complete`：独立 code review 完成并记录结论。
- `verification complete`：独立 verification 执行真实命令并记录结论。
- `finish complete`：用户确认剩余风险，所有完成门禁闭合。

主实现者只能声明自己完成的阶段，不得把 `implementation complete` 说成 L4 完成。
