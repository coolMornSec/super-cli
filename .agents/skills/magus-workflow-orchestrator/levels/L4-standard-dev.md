# L4 - Standard Development

## 定位

L4 是基于 L3 需求进入标准开发准备、规格、计划、实施、评审、验证和交付的权威工作流规范。

本文件定义 L4 的阶段、产物、门禁、流转、回滚和完成规则。仓库级 `AGENTS.md` 只负责启动约束；一旦路由进入 L4，必须以本文件为准。

## 进入条件

满足以下任一情况，即进入 L4：

- 用户明确要根据 L3 需求开始开发或开发准备。
- 需要生成规格说明、设计、计划、任务拆解、测试计划、验证步骤或交付说明。
- 需要创建或更新 OpenSpec change 工作区。
- L4 执行中发现需求缺失、边界不清或实现偏移，需要同步规格、偏移清单或验收影响。

## L4 加载证明

进入 L4 前必须加载并在 `process/workflow-state.md` 记录以下内容：

- 必要技能：`magus-pattern-guard`、`magus-workflow-orchestrator`、`magus-workflow-orchestrator/levels/L4-standard-dev.md`、`magus-workflow-governance`、`magus-base-standards`
- 场景技能：按当前 lane 和变更内容加载，例如 `mg-frontend-vue-guide`、`mg-framework-ui`、`magus-framework-conventions`、`docs/agents/frontend/AGENTS.md`、`docs/agents/backend/AGENTS.md`、`docs/agents/test/AGENTS.md`
- 加载证据：技能路径、读取时间、阶段记录或可追踪的执行说明
- Lane 类型：
  - `frontend`：面向 Web/前端界面、组件、页面交互、前端状态与前端测试的实现或治理。
  - `backend-java`：面向 Java/Spring 业务服务、接口、持久化、后端契约与后端测试的实现或治理。
  - `platform-docs`：面向平台级流程、规范、OpenSpec 工作流、模板、门禁、脚本和治理文档，不以业务前后端实现为主。
  - `no-code`：面向纯文档、纯配置、模板初始化、流程资产和检查脚本，不要求业务代码实现。
  - `cross-platform`：同时涉及前端与后端，或需要跨端契约、共享状态流、联动验证的变更。
- Lane 选择规则：
  - 必须根据当前 change 的实际产物与验证目标显式选择 lane
  - 若变更只涉及平台流程、规范、模板或检查脚本，应优先标记为 `platform-docs` 或 `no-code`。
  - 若变更涉及多端协同、共享契约或跨边界状态流，应使用 `cross-platform`，并同时加载对应的前端与后端场景技能。
  - 若发现现有 lane 无法准确描述变更，必须在 `workflow-state.md` 和 OpenSpec 文档中显式补充，不得静默复用最近似 lane。

若 L4 加载证据缺失，必须停止，不得生成计划、代码、评审或验证结论。

## 阶段顺序

L4 功能类工作必须按以下 10 个阶段推进，不得跳步：

1. `brainstorming`
2. `proposal`
3. `specs`
4. `design`
5. `tasks`
6. `writing-plans`
7. `implementation`
8. `code-review`
9. `verification`
10. `finish`

阶段切换前，必须同步 `process/workflow-state.md` 的 `Stage`、`Blockers`、`Next Action`、加载证据和关联产物状态。

## 仓库级技能适配

进入 L4 后，必须同时读取并遵循 `docs/process/l4-execution-adapter.md`。

当 `superpowers:*`、`magus-*` 或其他通用技能与本文件或 `docs/process/l4-execution-adapter.md` 冲突时，以本文件和适配规范为准。

适配规范必须覆盖以下高风险冲突：

- 独立 sub-agent 不可用时不得由主实现者替代评审或验证。
- `brainstorming` 产物不得替代 OpenSpec；正式事实源仍为当前 change。
- `writing-plans` 不得自动 commit、不得绕过独立 plan review 与用户确认。
- `AskUserQuestion` 不可用时必须使用聊天确认桥接，不得自动采用默认值。
- TDD 只对行为代码强制红绿循环；结构/配置产物必须记录 TDD 例外与验证命令。

## 阶段定义与门禁

### 1. brainstorming

**目标**

- 澄清执行意图、范围、约束、用户可见流程和关键分歧。
- 判断是否存在新行为、行为歧义或非微小变更。

**必须调用**

- `superpowers:brainstorming`
- `magus-workflow-governance`
- `magus-pattern-guard`

**产物**

- 需求澄清结论
- 方案发散记录
- 关键分歧与待确认项
- 初步偏移判断
- `process/brainstorming-notes.md`（需要落盘时使用；不得替代正式 OpenSpec）

**门禁**

- 若用户可见交互、模块边界、接口语义或业务规则不明确，不得进入后续阶段。
- 设计方向必须获得用户明确确认，并在 `workflow-state.md` 记录确认内容、确认时间和下一阶段。
- `docs/superpowers/specs/*` 仅可作为辅助背景，不得替代 `proposal.md`、`specs/.../spec.md`、`design.md` 或 `contracts/`。

### 2. proposal

**目标**

- 创建当前 change 的正式 OpenSpec 工作区。
- 明确变更原因、成功标准、非目标和范围边界。

**必须执行**

- 创建 `openspec/changes/<change-id>/`
- 创建 `.openspec.yaml`
- 执行 `node scripts/scaffold-change-process.mjs --change "<change-id>" --stage proposal`
- 必须显式传入 `--lanes`，例如 `--lanes cross-platform`

**必须调用**

- `magus-workflow-governance`
- `magus-pattern-guard`

**产物**

- `proposal.md`
- `process/workflow-state.md`
- `process/implementation-readiness.md`

**门禁**

- `proposal.md` 必须说明为什么做、成功标准是什么、哪些内容明确不在范围内。
- `workflow-state.md` 必须记录必要技能和场景技能是否加载。

### 3. specs

**目标**

- 说明当前 change 对能力规格的新增或修改。
- 建立验收口径与规格差异。

**必须调用**

- `magus-workflow-governance`
- `magus-base-standards`
- `magus-pattern-guard`

**产物**

- `specs/.../spec.md`
- 需求 / 规格一致性记录

**门禁**

- `specs/...` 必须覆盖当前 change 的能力差异。
- 新增约束、边界、例外、验收项必须可回指到 L3 需求或偏移记录。

### 4. design

**目标**

- 明确技术方案、流程、数据流、状态处理、边界情况、兼容性影响。
- 明确接口、DTO、错误语义、权限、页面回流或跨端契约。

**必须调用**

- `magus-workflow-governance`
- `magus-base-standards`
- `magus-pattern-guard`
- 按场景加载前端、UI、后端或测试专项规范

**产物**

- `design.md`
- `contracts/`

**Contracts 规则**

- 规格与设计阶段必须有 `contracts/` 产物。
- `contracts/` 用于存放请求示例、响应示例、错误语义、接口资源、页面回流、跨边界约束或占位说明。
- 契约范围与文件结构应写入具体契约文件或 `design.md`。

**门禁**

- 缺少 `design.md` 或 `contracts/` 时，规格与设计阶段不完整。
- 若行为、契约或流程变化，必须同步 `design.md` 与 `specs/...`。

### 5. tasks

**目标**

- 将规格与设计拆为可追踪、可验证的工作项。
- 明确里程碑、依赖顺序和验收标准。

**必须调用**

- `magus-workflow-governance`
- `magus-base-standards`
- `magus-pattern-guard`

**产物**

- `tasks.md`

**门禁**

- `tasks.md` 必须包含可追踪复选框任务。
- 交付范围或依赖顺序变化时，必须同步 `tasks.md`。

### 6. writing-plans

**目标**

- 在正式规格齐备后，生成实现计划。
- 明确实现顺序、文件边界、测试矩阵、验证命令和风险控制。

**必须调用**

- `superpowers:writing-plans`
- `magus-base-standards`
- `magus-pattern-guard`

**前置条件**

- `proposal.md`、`specs/...`、`design.md`、`tasks.md`、`contracts/` 完整且可执行。
- 已经完成独立 `Plan/Review Agent` 审查并等待用户确认。
- 若当前宿主不能调用独立 `Plan/Review Agent`，必须按 `docs/process/l4-execution-adapter.md` 记录 `blocked: independent-agent-unavailable`，不得由主实现者替代审查。

**产物**

- `docs/superpowers/plans/<plan>.md`
- 更新后的 `workflow-state.md`
- 更新后的 `implementation-readiness.md`

**门禁**

- 计划不得替代 OpenSpec 规格决策。
- 计划不得引入未写入 `design.md`、`specs/...` 或 `contracts/` 的行为、接口或流程。
- 计划生成后不得自动 commit，除非用户明确要求。
- 计划生成后必须记录 `Plan Review Mode`、`Plan Review Evidence` 与 `User Confirmed Implementation`；用户未确认前不得进入 `implementation`。

### 7. implementation

**目标**

- 按规格、contracts、readiness 和实现计划落地代码。
- 每完成一个可独立验证单元，都同步运行态记录。

**必须调用**

- `magus-argus-gate`
- `superpowers:test-driven-development`
- `magus-pattern-guard`
- 前端场景：`mg-frontend-vue-guide`，必要时 `mg-framework-ui`
- Java/Spring 场景：`magus-framework-conventions`
- 测试设计或测试补强场景：`docs/agents/test/AGENTS.md`

**前置条件**

- `implementation-readiness.md` 已完成。
- 独立 `Plan/Review Agent` 已审查 implementation readiness。
- 用户已确认允许进入 implementation。
- `workflow-state.md` 已将必要技能和场景技能加载状态更新为已加载或明确说明不适用。
- 若采用 TDD 例外，必须已在 `implementation-readiness.md` 或实现计划中记录例外文件、原因、验证命令和风险。

**产物**

- 实现代码
- 测试代码
- 同步后的 `workflow-state.md`
- 必要时同步 `implementation-readiness.md`、`design.md`、`specs/...`、`tasks.md`、`contracts/`

**门禁**

- 只有已有书面计划，或问题属于已批准规格覆盖的边界明确缺陷，才能进入实现。
- 每完成一个可独立验证单元，必须同步 `workflow-state.md` 的 `Code Status`、`Blockers` 和 `Next Action`。
- 若实现需要临时发明业务规则、接口语义、用户交互或状态流，必须停止并回到 `brainstorming` 或对应 OpenSpec 阶段。

### 8. code-review

**目标**

- 对代码、测试、contracts 和相关文档进行独立审查。

**必须调用**

- `superpowers:requesting-code-review`
- `magus-base-standards`
- `magus-pattern-guard`

**产物**

- `docs/superpowers/reviews/<review>.md`
- 更新后的 `workflow-state.md`

**门禁**

- 代码、测试和相关文档变更完成后，才能进入 `code-review`。
- 主实现者不得自证 `code-review` 通过。
- Review 结论必须记录需求漂移、测试缺口、回归风险和建议动作。

### 9. verification

**目标**

- 执行真实验证命令或真实行为验证。
- 确认交付结果、剩余风险和用户确认状态。

**必须调用**

- `superpowers:verification-before-completion`
- `magus-pattern-guard`

**产物**

- `docs/superpowers/reviews/<verification>.md`
- 更新后的 `workflow-state.md`

**门禁**

- 形成独立 review 记录后，才能进入 `verification`。
- 独立 `Verification Agent` 必须执行真实命令、记录真实输出并给出结构化结论。
- 主实现者不得自证 `verification` 通过。

### 10. finish

**目标**

- 收口 OpenSpec、实现、评审、验证和剩余风险。

**必须调用**

- `magus-pattern-guard`

**产物**

- 最终状态同步后的 `workflow-state.md`
- 最终状态同步后的 `implementation-readiness.md`
- 剩余风险或缺口记录

**门禁**

- 独立 Verification Agent 已完成真实验证。
- 用户已确认剩余风险。
- 相关自动化规范检查已通过。
- 没有降级实现、最小实现或待后补规范残留项。

## OpenSpec 与 change 工作区

- 任一新功能、新流程或行为变更前，必须创建 `openspec/changes/<change-id>/`。
- 当前 change 运行态文件必须落在 `openspec/changes/<change-id>/process/` 下。
- `proposal.md` 说明变更原因、成功标准和非目标。
- `specs/...` 说明当前 change 对能力规格的新增或修改。
- `design.md` 说明技术方案、流程、数据流、状态处理和边界情况。
- `contracts/` 说明跨边界契约、接口示例、错误语义、请求响应、页面回流或占位说明；不生成 `contracts/README.md`。
- `tasks.md` 说明里程碑、工作项、依赖关系和验收标准。
- `openspec/specs/...` 是归档后的长期能力规格。
- `docs/requirements/*` 与 `docs/superpowers/specs/*` 仅可作为背景输入或辅助说明，不得作为新工作的正式规格写入目标。

## Micro-task 快速通道

- Micro-task 仅限无业务逻辑、无接口契约、无状态流、无用户流程变化的独立小修改，例如拼写、纯文案、基础样式微调。
- Micro-task 可不进入完整 OpenSpec 阶段，但必须说明修改范围、防回归验证点和实际验证结果。
- 若修改引入行为、流程、状态、契约、测试策略或兼容性变化，不得按 Micro-task 处理。

## 专项规则入口

- 前端页面、布局、组件选型、页面文案、页面骨架、前端评审或前端验证：先读取 `docs/agents/frontend/AGENTS.md`。
- 已有 `Java/Spring` 业务模块的设计、实现、契约、评审或验证：先读取 `docs/agents/backend/AGENTS.md`。
- 前端测试设计、TDD、测试实现、测试补强、测试评审或验证：先读取 `docs/agents/test/AGENTS.md`。

## 独立子 Agent

- 复杂变更在正式评审前需要补充事实收集时，必须启用独立 `Explore Agent`。
- 审查当前 change、实现计划或需求覆盖范围时，必须启用独立 `Plan/Review Agent`。
- 进入 `verification` 前，必须启用独立 `Verification Agent`。
- 独立子 Agent 必须通过 Codex subagents、`invokeSubAgent` 工具或独立会话调用，不得由主实现者扮演。
- Plan/Review 和 Verification 结论必须落盘到 `docs/superpowers/reviews/`，并等待用户确认后才能推进。
- 若宿主能力或上层工具规则不允许主动调用 sub-agent，必须停止在当前门禁，记录 `Independent Review Mode: blocked`，并等待用户授权 sub-agent、指定外部人工 reviewer，或确认停止推进。
- 禁止把主实现者自查、普通测试通过或口头说明当作独立 review / verification。

## 环境与目录边界

- 安装任何依赖 `@magustek/*` 的包之前，必须确认仓库根目录存在 `.npmrc`，且同时包含公共源与 `@magustek` 私有源映射。
- `docs/process/` 用于稳定流程定义、子 Agent 指南、角色说明、检查清单与模板。
- `docs/agents/backend/` 用于 `backend-java` lane 的执行规范与入口说明。
- `docs/superpowers/reviews/` 用于独立评审与验证记录。
- `docs/superpowers/plans/` 用于实现计划。
- `docs/superpowers/visuals/` 用于可视化辅助材料。
- `templates/` 用于分层 `implementation-readiness` 模板，按 `common`、`frontend`、`backend-java` 组合使用。
- `scripts/README.md` 用于说明仓库级脚本职责、入口和限制。

## 禁止事项

- 禁止先生成计划、代码、评审或验证文档，再反向补 current change 的正式 OpenSpec 文档。
- 禁止主实现者直接宣布 `code-review` 通过、`verification` 通过或允许进入 `finish`。
- 禁止独立子 Agent 在未等待用户确认的情况下自动切换到下一阶段。
- 禁止 Verification Agent 在未执行真实命令、未记录真实输出时给出通过结论。
- 禁止将解释、计划、代码阅读、服务启动或测试通过等同于真实完成。
- 禁止在缺少新证据时因为用户推动而改变正确的风险判断；若用户坚持高风险方向，必须记录风险与影响。

## 回滚规则

若出现以下任一情况，必须停止实现并回到本地 `brainstorming`：

- 编码过程中需要临时发明业务规则。
- 用户可见交互不明确。
- 模块、页面或服务接口需要临时拍板。
- 现有 `design` 无法支撑当前技术决策。
- 当前修改影响了当前 change `specs/...` 未覆盖的既有行为。
- 为了让实现通过而准备弱化已批准约束。

回滚后，必须先更新受影响的当前 change OpenSpec 文档，再恢复 `writing-plans` 或实现。

## 完成门禁

只有在以下条件全部满足后，才能声称 L4 工作完成：

- 当前 change 必需的 OpenSpec 文档都已更新并获批准。
- `contracts/` 已按设计阶段要求落盘
- 实现与已批准计划一致，或计划已同步修订。
- 已请求代码评审并完成验证。
- 已通过 `magus-pattern-guard` 最终审查，并区分已验证、部分验证、未验证与待用户确认事项。
- 已记录剩余风险或缺口；未验证事项已说明关闭条件和交付影响。
- 与本次变更相关的自动化规范检查已经通过。
- 没有降级实现、最小实现或待后补规范残留项。
- 当前 change 已存在独立 review / verification 记录，并记录需求漂移判断和用户确认结果。
- `workflow-state.md` 已记录必要技能和场景技能加载状态，并与实际阶段、计划、评审、验证结论保持一致。
- `implementation-readiness.md` 已与实际阶段、计划、评审、验证结论保持一致。
- 已明确区分 `implementation complete`、`review complete`、`verification complete` 与 `finish complete`；不得将实现完成等同于 L4 完成。
