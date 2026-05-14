# 开发工作流

---

## 核心原则

1. **先规划，后编码** — 在开始之前先弄清要做什么
2. **规范是注入的，不是记忆的** — 指南通过 hook/skill 注入，而不是靠记忆
3. **全部持久化** — 调研、决策和经验都写入文件；对话会被压缩，文件不会
4. **增量开发** — 一次只做一个任务
5. **记录收获** — 每个任务完成后，回顾并把新知识写回规范

---

## Trellis 系统

### 开发者身份

首次使用时，初始化你的身份：

```bash
python ./.trellis/scripts/init_developer.py <your-name>
```

会创建 `.trellis/.developer`（已加入 gitignore）和 `.trellis/workspace/<your-name>/`。

### 规范系统

`.trellis/spec/` 存放按 package 和 layer 组织的编码指南。

- `.trellis/spec/<package>/<layer>/index.md` — 入口文件，包含 **开发前检查清单** + **质量检查**。实际指南在它指向的 `.md` 文件里。
- `.trellis/spec/guides/index.md` — 跨 package 的思考指南。

```bash
python ./.trellis/scripts/get_context.py --mode packages   # 列出 package / layer
```

**什么时候更新规范**：发现新模式/约定 · 需要固化的 bug 修复预防 · 新的技术决策。

### 任务系统

每个任务在 `.trellis/tasks/{MM-DD-name}/` 下都有自己的目录，里面包含 `prd.md`、`implement.jsonl`、`check.jsonl`、`task.json`，以及可选的 `research/`、`info.md`。

```bash
# 任务生命周期
python ./.trellis/scripts/task.py create "<title>" [--slug <name>] [--parent <dir>]
python ./.trellis/scripts/task.py start <name>          # 设为当前激活任务（在可用时为 session 级别）
python ./.trellis/scripts/task.py current --source      # 显示当前激活任务及来源
python ./.trellis/scripts/task.py finish                # 清除当前激活任务（触发 after_finish hooks）
python ./.trellis/scripts/task.py archive <name>        # 移动到 archive/{year-month}/
python ./.trellis/scripts/task.py list [--mine] [--status <s>]
python ./.trellis/scripts/task.py list-archive

# 代码规范上下文（通过 JSONL 注入到 implement/check agents）。
# 在支持子代理的平台上，`implement.jsonl` / `check.jsonl` 会在 task create 时预置；
# AI 会在 Phase 1.3 中整理真正的规范 + 调研条目。
python ./.trellis/scripts/task.py add-context <name> <action> <file> <reason>
python ./.trellis/scripts/task.py list-context <name> [action]
python ./.trellis/scripts/task.py validate <name>

# 任务元数据
python ./.trellis/scripts/task.py set-branch <name> <branch>
python ./.trellis/scripts/task.py set-base-branch <name> <branch>    # PR 目标
python ./.trellis/scripts/task.py set-scope <name> <scope>

# 层级（父/子）
python ./.trellis/scripts/task.py add-subtask <parent> <child>
python ./.trellis/scripts/task.py remove-subtask <parent> <child>

# PR 创建
python ./.trellis/scripts/task.py create-pr [name] [--dry-run]
```

> 运行 `python ./.trellis/scripts/task.py --help` 查看权威、最新的命令列表。

**当前任务机制**：`task.py create` 会创建任务目录，并且（在 session identity 可用时）自动设置每个 session 的 active-task 指针，因此规划 breadcrumb 会立刻生效。`task.py start` 会写入同一个指针（如果已经设置则幂等），并把 `task.json.status` 从 `planning` 切换为 `in_progress`。状态保存在 `.trellis/.runtime/sessions/` 下。如果 hook 输入、`TRELLIS_CONTEXT_ID` 或平台原生 session 环境变量里都没有可用的 context key，就没有激活任务，而 `task.py start` 会因缺少 session identity 失败并给出提示。`task.py finish` 会删除当前 session 文件（状态不变）。`task.py archive <task>` 会写入 `status=completed`，把目录移动到 `archive/`，并删除任何仍指向已归档任务的 runtime session 文件。

### Workspace 系统

记录每一次 AI session，用于跨 session 跟踪，存放在 `.trellis/workspace/<developer>/` 下。

- `journal-N.md` — session 日志。**单个文件最多 2000 行**；超过后会自动创建新的 `journal-(N+1).md`。
- `index.md` — 个人索引（总 session 数、最后活跃时间）。

```bash
python ./.trellis/scripts/add_session.py --title "Title" --commit "hash" --summary "Summary"
```

### Context Script

```bash
python ./.trellis/scripts/get_context.py                            # 完整 session runtime
python ./.trellis/scripts/get_context.py --mode packages            # 可用 package + spec layers
python ./.trellis/scripts/get_context.py --mode phase --step <X.Y>  # 工作流某一步的详细指南
```

---

<!--
  WORKFLOW-STATE-BREADCRUMB CONTRACT (编辑下面的 tag blocks 之前请先阅读)

  下方 ## Phase Index 中嵌入的 4 个 [workflow-state:STATUS] block 是每回合 `<workflow-state>` breadcrumb 的唯一真相源，
  所有受支持 AI 平台的 UserPromptSubmit hook 都会读取它们。inject-workflow-state.py（Python 平台）和
  inject-workflow-state.js（OpenCode 插件）只会解析这些 block——自 v0.5.0-rc.0 之后，脚本里不再有兜底字典。

  STATUS 字符集：[A-Za-z0-9_-]+。当 hook 找不到 tag 时，会退化为通用的
  “Refer to workflow.md for current step.” 提示——这是故意可见的，这样用户就能发现并修复损坏的 workflow.md。

  不变量（test/regression.test.ts）：
    每一个标记为 `[required · once]` 的 workflow-walkthrough 步骤，都必须在其 phase 的 [workflow-state:*] block 中有对应的 enforcement 行。
    breadcrumb 是唯一的逐回合通道；如果 mandatory 步骤没有在这里被提到，AI 就会静默跳过它（Phase 1.3 jsonl 整理跳过和 Phase 3.4 commit 跳过都曾因此出现）。

  TAG ↔ PHASE 范围：
    [workflow-state:no_task]      → 没有激活任务；在 Phase 1 之前
    [workflow-state:planning]     → Phase 1 全部内容（status='planning'）
    [workflow-state:in_progress]  → Phase 2 + Phase 3.1-3.4
                                    （从 task.py start 到 task.py archive 之间 status 一直保持 'in_progress'）
    [workflow-state:completed]    → 当前在正常流程中已失效：cmd_archive 会在同一次调用里
                                    同时把 status 改成 completed 并移动目录，因此 resolver 会丢失指针
                                    （保留这个 block 是为了未来支持显式的 in_progress→completed 转换）

  编辑检查清单：
    - 修改 [workflow-state:STATUS] block 时，也要检查该 phase 下匹配的 `[required · once]` 步骤是否同步
    - 编辑后运行 `trellis update`，把新内容推送到下游用户项目（block 级别托管替换）
    - 完整运行时契约：
      .trellis/spec/cli/backend/workflow-state-contract.md
-->

## Phase Index

```
Phase 1: Plan    → 搞清楚要做什么（头脑风暴 + 调研 → prd.md）
Phase 2: Execute → 编写代码并通过质量检查
Phase 3: Finish  → 提炼经验 + 收尾
```

<!-- 每回合 breadcrumb：在没有激活任务时显示（Phase 1 之前） -->

[workflow-state:no_task]
No active task. **A 直接回答** — 纯问答 / 解释 / 查询 / 聊天；不写文件 + 一行回答 + 仓库读取 ≤ 2 个文件 → 由 AI 自行判断，无需覆盖。
**B 创建任务** — 任何实现 / 代码变更 / 构建 / 重构工作。进入顺序：(1) `python ./.trellis/scripts/task.py create "<title>"` 创建任务（status=planning，breadcrumb 切换到 [workflow-state:planning]，进入 brainstorm + jsonl 阶段指引）→ (2) 加载 `trellis-brainstorm` skill，与用户讨论需求并迭代 prd.md → (3) 当 prd 完成且 jsonl 已整理好后，运行 `task.py start <task-dir>` 进入 [workflow-state:in_progress]，开始实现骨架。对于重调研型工作，派发 `trellis-research` 子代理——主代理**不要**做 3 次或以上的 inline WebFetch / WebSearch / `gh api` 调用。**“看起来很小” 不是把 B 降级成 A 或 C 的理由。**
**C 内联修改**（仅本回合的逃生口，供 B 使用）— 用户**当前**消息里必须包含以下之一："skip trellis" / "no task" / "just do it" / "don't create a task" / "跳过 trellis" / "别走流程" / "小修一下" / "直接改" / "先别建任务" → 简要确认（"ok, skipping trellis flow this turn"），然后直接内联处理。**没有看到这些短语，就绝对不能自己决定内联**；不要擅自发明用户没说过的覆盖指令。
[/workflow-state:no_task]

### Phase 1: Plan
- 1.0 创建任务 `[required · once]`（只执行 `task.py create`；状态进入 planning）
- 1.1 需求探索 `[required · repeatable]`
- 1.2 调研 `[optional · repeatable]`
- 1.3 配置上下文 `[required · once]` — Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi
- 1.4 激活任务 `[required · once]`（运行 `task.py start`；status → in_progress）
- 1.5 完成条件

<!-- 每回合 breadcrumb：在 Phase 1 期间显示（status='planning'） -->

[workflow-state:planning]
加载 `trellis-brainstorm` skill，并与用户一起迭代 prd.md。
Phase 1.3（required, once）：在运行 `task.py start` 之前，你**必须**整理 `implement.jsonl` 和 `check.jsonl`——把子代理需要的规范 / 调研文件列进去，确保它们拿到正确的上下文注入。只有当 jsonl 里已经有 AI 整理过的条目时才可以跳过（仅有 seed `_example` 行不算）。
然后运行 `task.py start <task-dir>`，把状态切换为 in_progress。
调研输出**必须**写到 `{task_dir}/research/*.md`，由 `trellis-research` 子代理生成。主代理不应内联 WebFetch / WebSearch——PRD 只链接调研文件。
[/workflow-state:planning]

<!-- 每回合 breadcrumb：在 codex.dispatch_mode=inline 的 Phase 1 期间显示。-->
<!-- Codex 专用的可选替代方案，替代 [workflow-state:planning]。主代理在 Phase 2 中直接编辑代码，因此 Phase 1.3 jsonl 整理会被跳过——inline 工作流会在 Phase 2 加载 `trellis-before-dev`，而不是把 JSONL 注入到子代理。 -->

[workflow-state:planning-inline]
加载 `trellis-brainstorm` skill，并与用户一起迭代 prd.md。
Phase 1.3 jsonl 整理在 inline dispatch mode 中会被**跳过**——主 session 会在 Phase 2 直接加载 `trellis-before-dev` 并自行读取规范上下文，所以没有子代理可供注入 jsonl。
然后运行 `task.py start <task-dir>`，把状态切换为 in_progress。
调研输出**必须**写到 `{task_dir}/research/*.md`。在 inline mode 中，主 session 可以自己做调研，也可以派发 `trellis-research` 子代理。
[/workflow-state:planning-inline]

### Phase 2: Execute
- 2.1 实现 `[required · repeatable]`
- 2.2 质量检查 `[required · repeatable]`
- 2.3 回滚 `[on demand]`

<!-- 每回合 breadcrumb：在 status='in_progress' 时显示。
     范围：Phase 2 全部 + Phase 3.1-3.4（从 task.py start 到 task.py archive 之间 status 一直保持 'in_progress'；只有 archive 才会改变它）。
     因此该内容必须覆盖从实现到提交的每一个必需步骤，包括 Phase 3.3 spec update 和 Phase 3.4 commit。 -->

[workflow-state:in_progress]
**流程**：trellis-implement → trellis-check → trellis-update-spec → commit（Phase 3.4）→ `/trellis:finish-work`。
**主 session 默认（无覆盖）**：派发 `trellis-implement` / `trellis-check` 子代理——主代理默认**不**直接改代码。Phase 3.4 commit（required, once）：在 trellis-update-spec 之后，或者当实现已可验证完成时，主代理**负责推动提交**——先在面向用户的文本里说明提交计划，然后运行 `git commit`——再建议 `/trellis:finish-work`。`/finish-work` 在工作树脏（`.trellis/workspace/` 和 `.trellis/tasks/` 之外有未清理路径）时会拒绝运行。
**子代理自豁免**：如果你本身就在运行 `trellis-implement`，就从已加载的任务上下文直接实现，不要再派发另一个 `trellis-implement`；如果你本身就在运行 `trellis-check`，就直接审查/修复，不要再派发另一个 `trellis-check`。默认派发规则只适用于主 session。
**子代理派发协议（所有平台，所有 sub-agents，除了 trellis-research）**：当你派发 `trellis-implement` / `trellis-check` 时，你的派发提示**必须**第一行就写：`Active task: <task path from \`task.py current\`>`。没有例外。在 class-2 平台（codex / copilot / gemini / qoder）上，子代理依赖这行，因为那里没有 hook 可以注入任务上下文。在 class-1 平台（claude / cursor / opencode / kiro / codebuddy / droid）上，这行通常是冗余的——hook 会直接注入上下文——但在 hook 失效时（Windows + Claude Code PreToolUse 静默跳过、`--continue` 恢复、fork 分发、hooks 关闭等）它仍是关键回退。`trellis-research` 不需要这行，因为它不绑定具体任务。
**内联覆盖**（仅本回合的逃生口，供子代理派发使用）：用户**当前**消息里必须明确包含以下之一："do it inline" / "no sub-agent" / "你直接改" / "别派 sub-agent" / "main session 写就行" / "不用 sub-agent"。**没有看到这些短语，你就绝对不能自己决定内联**；不要擅自发明用户没说过的覆盖指令。
[/workflow-state:in_progress]

<!-- 每回合 breadcrumb：在 status='in_progress' 且 codex.dispatch_mode=inline 时显示。
     Codex 专用可选替代方案，替代 [workflow-state:in_progress]。主 session 直接编辑代码，而不是派发子代理。 -->

[workflow-state:in_progress-inline]
**流程**（inline mode）：主 session 加载 `trellis-before-dev` → 主 session 编辑代码 → 主 session 加载 `trellis-check` → 运行 lint / type-check / tests → 修复 → `trellis-update-spec` → commit（Phase 3.4）→ `/trellis:finish-work`。
**主 session 默认（inline dispatch_mode）**：主代理直接编辑代码。不要派发 `trellis-implement` / `trellis-check` 子代理。在写代码前先加载 `trellis-before-dev` skill；在报告完成前先加载 `trellis-check` skill。
Phase 3.4 commit（required, once）：在 trellis-update-spec 之后，或者当实现已可验证完成时，主代理**负责推动提交**——先在面向用户的文本里说明提交计划，然后运行 `git commit`——再建议 `/trellis:finish-work`。`/finish-work` 在工作树脏（`.trellis/workspace/` 和 `.trellis/tasks/` 之外有未清理路径）时会拒绝运行。
[/workflow-state:in_progress-inline]

### Phase 3: Finish
- 3.1 质量验证 `[required · repeatable]`
- 3.2 调试复盘 `[on demand]`
- 3.3 规范更新 `[required · once]`
- 3.4 提交更改 `[required · once]`
- 3.5 收尾提醒

<!-- 每回合 breadcrumb：在 status='completed' 时显示。
     目前在正常流程中已失效：cmd_archive 会在同一次调用里把 status 改成 'completed'，同时把 task 目录移动到 archive/，
     因而 active-task resolver 会丢失指针，hook 也不会在归档任务上触发。
     保留该 block 是为了未来的 status-transition 重构（例如显式的 in_progress→completed 命令）。修改时请通过同一个规范通道操作活态 block。 -->

[workflow-state:completed]
代码已通过 Phase 3.4 提交；运行 `/trellis:finish-work` 完成收尾（归档任务 + 记录 session）。
如果你到了这个状态但代码还没提交，请先回到 Phase 3.4——`/finish-work` 在脏工作树上不会运行。
`task.py archive` 会删除任何仍指向已归档任务的 runtime session 文件。
[/workflow-state:completed]

### 规则

1. 先确定你处于哪个 Phase，然后继续执行该阶段的下一步
2. 每个 Phase 内都要按顺序执行；标记为 `[required]` 的步骤不能跳过
3. Phase 可以回滚（例如：Execute 发现 prd 缺陷 → 回到 Plan 修复，然后再进入 Execute）
4. 标记为 `[once]` 的步骤如果输出已经存在就跳过；不要重复执行

### Skill 路由

当用户请求匹配下面任一意图时，先加载对应 skill（或派发对应子代理）——不要跳过 skills。

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

| 用户意图 | 路由 |
|---|---|
| 想要新功能 / 需求不清晰 | `trellis-brainstorm` |
| 即将写代码 / 开始实现 | 按 Phase 2.1 派发 `trellis-implement` 子代理 |
| 已完成编写 / 想验证 | 按 Phase 2.2 派发 `trellis-check` 子代理 |
| 卡住 / 同一个 bug 修了很多次 | `trellis-break-loop` |
| 需要更新规范 | `trellis-update-spec` |

**为什么 `trellis-before-dev` 不在这个表里**：你不是写代码的人——写代码的是 `trellis-implement` 子代理。子代理平台通过 `implement.jsonl` 注入 / prelude 获取规范上下文，而不是让主线程加载 `trellis-before-dev`。

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Kilo, Antigravity, Windsurf]

| 用户意图 | Skill |
|---|---|
| 想要新功能 / 需求不清晰 | `trellis-brainstorm` |
| 即将写代码 / 开始实现 | `trellis-before-dev`（然后在主 session 直接实现） |
| 已完成编写 / 想验证 | `trellis-check` |
| 卡住 / 同一个 bug 修了很多次 | `trellis-break-loop` |
| 需要更新规范 | `trellis-update-spec` |

[/Kilo, Antigravity, Windsurf]

### 不要跳过 skills

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

| 你在想什么 | 为什么这是错的 |
|---|---|
| “这个太简单了，我直接在主线程里写代码就好” | 派发 `trellis-implement` 才是省力路径；跳过它会让你在主线程里写代码并丢失规范上下文——子代理会拿到 `implement.jsonl` 注入，你不会 |
| “我在 plan 模式里已经想清楚了” | plan 模式的输出只存在于内存里——子代理看不到；必须写入 prd.md |
| “我已经知道规范了” | 规范可能自你上次查看后已经更新；子代理会拿到最新副本，而你可能不会 |
| “先写代码，后检查” | `trellis-check` 会发现你自己未必注意到的问题；越早做越省成本 |

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Kilo, Antigravity, Windsurf]

| 你在想什么 | 为什么这是错的 |
|---|---|
| “这个很简单，直接写就行” | 简单任务也常会变复杂；`trellis-before-dev` 不到一分钟就能跑完，还会加载你需要的规范上下文 |
| “我在 plan 模式里已经想清楚了” | plan 模式的输出只存在于内存里——在写代码前必须先写入 prd.md |
| “我已经知道规范了” | 规范可能自你上次查看后已经更新；请再读一遍 |
| “先写代码，后检查” | `trellis-check` 会发现你自己未必注意到的问题；越早做越省成本 |

[/Kilo, Antigravity, Windsurf]

### 加载步骤详情

在每个步骤开始时，运行下面的命令获取详细指引：

```bash
python ./.trellis/scripts/get_context.py --mode phase --step <step>
# 例如 python ./.trellis/scripts/get_context.py --mode phase --step 1.1
```

---

## Phase 1：计划

目标：弄清楚要构建什么，产出一份清晰的需求文档，以及实现它所需的上下文。

#### 1.0 创建任务 `[required · once]`

创建任务目录（状态进入 planning，在 session identity 可用时，当前激活任务指针会自动指向新任务）：

```bash
python ./.trellis/scripts/task.py create "<task title>" --slug <name>
```

`--slug` 只是人类可读名称。不要包含 `MM-DD-` 日期前缀；`task.py create` 会自动加上这个前缀。

这个命令成功后，每回合 breadcrumb 会自动切换到 `[workflow-state:planning]`，提示 AI 进入 brainstorm + jsonl 整理阶段。

⚠️ **这里只运行 `create` —— 不要同时运行 `start`**。`start` 会把状态切换为 `in_progress`，这会让 breadcrumb 在 brainstorm + jsonl 完成前就切到实现阶段——AI 会静默跳过它们。请把 `start` 留到第 1.4 步，在 jsonl 整理完成之后再执行。

如果 `python ./.trellis/scripts/task.py current --source` 已经指向某个任务，就跳过这一步。

#### 1.1 需求探索 `[required · repeatable]`

加载 `trellis-brainstorm` skill，并按照其指引与用户交互式探索需求。

brainstorm skill 会引导你：
- 一次只问一个问题
- 优先调研，而不是反问用户
- 优先提供选项，而不是开放式问题
- 需求明确后立刻更新 `prd.md`

当需求发生变化时，回到这一步并更新 `prd.md`。

#### 1.2 调研 `[optional · repeatable]`

调研可以在需求探索的任何时候进行。它不局限于本地代码——你可以使用任何可用工具（MCP servers、skills、web search 等）去查找外部信息，包括第三方库文档、行业实践、API 参考等。

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

派发 research 子代理：

- **Agent type**：`trellis-research`
- **Task description**：Research <specific question>
- **关键要求**：调研输出**必须**持久化到 `{TASK_DIR}/research/`

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Kilo, Antigravity, Windsurf]

直接在主 session 中做调研，并把结果写入 `{TASK_DIR}/research/`。

[/Kilo, Antigravity, Windsurf]

**调研产物约定**：
- 每个调研主题一个文件（例如 `research/auth-library-comparison.md`）
- 记录第三方库用法示例、API 参考、版本约束
- 标注你发现的相关规范文件路径，供后续引用

brainstorm 和 research 可以自由交错——可以先停下来调研一个技术问题，再回到和用户的对话。

**关键原则**：调研结果必须写入文件，而不是只留在聊天里。对话会被压缩，文件不会。

#### 1.3 配置上下文 `[required · once]`

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

整理 `implement.jsonl` 和 `check.jsonl`，让 Phase 2 的子代理拿到正确的规范上下文。这些文件在 `task create` 时已经预置了一个单条自描述 `_example` 行；这里你的工作是补充真正的条目。

**位置**：`{TASK_DIR}/implement.jsonl` 和 `{TASK_DIR}/check.jsonl`（已经存在）。

**格式**：每行一个 JSON 对象 — `{"file": "<path>", "reason": "<why>"}`。路径以 repo 根目录为基准。

**应该填写什么**：
- **规范文件** — `.trellis/spec/<package>/<layer>/index.md` 以及和本任务相关的特定指南文件（`error-handling.md`、`conventions.md` 等）
- **调研文件** — `{TASK_DIR}/research/*.md`，供子代理查阅

**不应该填写什么**：
- 代码文件（`src/**`、`packages/**/*.ts` 等）——子代理在实现时会自己读取，这里不要预先登记
- 你即将修改的文件——原因同上

**两个文件的分工**：
- `implement.jsonl` → 实现子代理需要的规范 + 调研，以便正确写代码
- `check.jsonl` → 检查子代理需要的规范（质量指南、检查约定，如需要也包括同样的调研）

**如何发现相关规范**：

```bash
python ./.trellis/scripts/get_context.py --mode packages
```

会列出每个 package 以及它的 spec layers 和路径。根据任务领域挑选对应条目。

**如何追加条目**：

你可以直接在编辑器里修改 jsonl 文件，也可以使用：

```bash
python ./.trellis/scripts/task.py add-context "$TASK_DIR" implement "<path>" "<reason>"
python ./.trellis/scripts/task.py add-context "$TASK_DIR" check "<path>" "<reason>"
```

当真正的条目存在后，可以删除 seed `_example` 行（可选——消费者会自动跳过它）。

如果 `implement.jsonl` 已经有 AI 整理过的条目，就跳过此步骤（仅有 seed 行不算）。

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Kilo, Antigravity, Windsurf]

跳过此步骤。上下文会在 Phase 2 中由 `trellis-before-dev` skill 直接加载。

[/Kilo, Antigravity, Windsurf]

#### 1.4 激活任务 `[required · once]`

当 prd.md 完成且 1.3 的 jsonl 整理完成后，把任务状态切换为 `in_progress`：

```bash
python ./.trellis/scripts/task.py start <task-dir>
```

这个命令成功后，breadcrumb 会自动切换到 `[workflow-state:in_progress]`，后续 Phase 2 / 3 会按此继续。

如果 `task.py start` 报 session-identity 错误（hook 输入、`TRELLIS_CONTEXT_ID` 或平台原生 session env 中都没有 context key），请按错误提示配置 session identity，然后重试。

#### 1.5 完成条件

| 条件 | 必需 |
|------|:---:|
| `prd.md` 已存在 | ✅ |
| 用户确认需求 | ✅ |
| 已运行 `task.py start`（status = in_progress） | ✅ |
| `research/` 有产物（复杂任务） | 推荐 |
| `info.md` 技术设计（复杂任务） | 可选 |

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

| `implement.jsonl` 有 AI 整理过的条目（不只是 seed 行） | ✅ |

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

---

## Phase 2：执行

目标：把 prd 变成能通过质量检查的代码。

#### 2.1 实现 `[required · repeatable]`

[Claude Code, Cursor, OpenCode, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

派发 implement 子代理：

- **Agent type**：`trellis-implement`
- **Task description**：根据 prd.md 实现需求，并参考 `{TASK_DIR}/research/` 下的材料；最后运行项目 lint 和 type-check
- **派发提示保护**：告诉派发出去的 agent，它已经是 `trellis-implement` 子代理了，必须直接实现，不能再派发另一个 `trellis-implement` / `trellis-check`。

平台 hook/plugin 会自动处理：
- 读取 `implement.jsonl`，把引用的规范文件注入到 agent prompt
- 注入 prd.md 内容

[/Claude Code, Cursor, OpenCode, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Codex]

派发 implement 子代理：

- **Agent type**：`trellis-implement`
- **Task description**：根据 prd.md 实现需求，并参考 `{TASK_DIR}/research/` 下的材料；最后运行项目 lint 和 type-check
- **派发提示保护**：prompt **必须**以 `Active task: <task path>` 开头，然后明确说明该 agent 已经是 `trellis-implement` 子代理，必须直接实现，不能再派发另一个 `trellis-implement` / `trellis-check`。

Codex 子代理定义会自动处理上下文加载要求：
- 通过 `task.py current --source` 解析当前激活任务，然后读取 `prd.md`，如果存在也读取 `info.md`
- 读取 `implement.jsonl`，并要求 agent 在编码前加载其中引用的每个规范文件

[/Codex]

[Kiro]

派发 implement 子代理：

- **Agent type**：`trellis-implement`
- **Task description**：根据 prd.md 实现需求，并参考 `{TASK_DIR}/research/` 下的材料；最后运行项目 lint 和 type-check
- **派发提示保护**：告诉派发出去的 agent，它已经是 `trellis-implement` 子代理了，必须直接实现，不能再派发另一个 `trellis-implement` / `trellis-check`。

平台 prelude 会自动处理上下文加载要求：
- 读取 `implement.jsonl`，把引用的规范文件注入到 agent prompt
- 注入 prd.md 内容

[/Kiro]

[Kilo, Antigravity, Windsurf]

1. 加载 `trellis-before-dev` skill 读取项目指南
2. 读取 `{TASK_DIR}/prd.md` 获取需求
3. 查阅 `{TASK_DIR}/research/` 下的材料
4. 按需求实现代码
5. 运行项目 lint 和 type-check

[/Kilo, Antigravity, Windsurf]

#### 2.2 质量检查 `[required · repeatable]`

[Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

派发 check 子代理：

- **Agent type**：`trellis-check`
- **Task description**：根据规范和 prd 审查所有代码变更；如发现问题直接修复；确保 lint 和 type-check 通过
- **派发提示保护**：告诉派发出去的 agent，它已经是 `trellis-check` 子代理了，必须直接审查/修复，不能再派发另一个 `trellis-check` / `trellis-implement`。

检查 agent 的职责：
- 根据规范审查代码变更
- 自动修复发现的问题
- 运行 lint 和 typecheck 进行验证

[/Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[Kilo, Antigravity, Windsurf]

加载 `trellis-check` skill，并按其指引验证代码：
- 规范符合性
- lint / type-check / tests
- 跨层一致性（当变更跨越多个层时）

如果发现问题 → 修复 → 重新检查，直到全部通过。

[/Kilo, Antigravity, Windsurf]

#### 2.3 回滚 `[on demand]`

- `check` 发现 prd 有缺陷 → 回到 Phase 1，修复 `prd.md`，然后重新执行 2.1
- 实现出错 → 回滚代码，重新执行 2.1
- 需要更多调研 → 继续调研（同 Phase 1.2），把结果写入 `research/`

---

## Phase 3：收尾

目标：保证代码质量、记录经验、归档工作。

#### 3.1 质量验证 `[required · repeatable]`

加载 `trellis-check` skill，做最终验证：
- 规范符合性
- lint / type-check / tests
- 跨层一致性（当变更跨越多个层时）

如果发现问题 → 修复 → 重新检查，直到全部通过。

#### 3.2 调试复盘 `[on demand]`

如果这个任务经历了反复调试（同一个问题被修了多次），加载 `trellis-break-loop` skill 来：
- 分类根因
- 解释为什么早期修复失败
- 提出预防措施

目标是记录调试经验，避免同类问题再次出现。

#### 3.3 规范更新 `[required · once]`

加载 `trellis-update-spec` skill，审视这个任务是否产生了值得记录的新知识：
- 新发现的模式或约定
- 遇到的坑
- 新的技术决策

相应地更新 `.trellis/spec/` 下的文档。即使结论是“无需更新”，也要完成一次判断流程。

#### 3.4 提交更改 `[required · once]`

AI 负责对本任务的代码变更做一次批量提交，这样 `/finish-work` 之后才能顺利收尾。目标是：先产出工作提交，再产出 bookkeeping（归档 + 日志）提交——绝不要交错进行。

**步骤**：

1. **检查脏状态**：
   ```bash
   git status --porcelain
   ```
   记录所有脏路径。如果工作树是干净的，跳到 3.5。

2. **从最近历史学习提交风格**（这样起草的消息更一致）：
   ```bash
   git log --oneline -5
   ```
   观察前缀约定（`feat:` / `fix:` / `chore:` / `docs:` ...）、语言（中文/英文）以及长度风格。

3. **把脏文件分成两组**：
   - **本 session 由 AI 编辑** —— 这个 session 里你通过 Edit/Write/Bash 工具调用写过/改过的文件。你知道它们改了什么，也知道为什么。
   - **无法识别** —— 这个 session 里你没有动过的脏文件（可能是用户手动编辑、上个 session 遗留的 WIP，或者无关工作）。不要悄悄把它们加进去。

4. **起草提交计划**。把 AI 编辑过的文件按逻辑分组提交（每个提交对应一个连贯的变更单元，而不是一个文件一个提交）。每个条目都要写：`<commit message>` + 文件列表。把无法识别的文件单独列在底部。

5. **一次性把计划展示给用户，并请求一次性确认**。格式：
   ```
   Proposed commits (in order):
     1. <message>
        - <file>
        - <file>
     2. <message>
        - <file>

   Unrecognized dirty files (NOT in any commit — confirm include/exclude):
     - <file>
     - <file>

   Reply 'ok' / '行' to execute. Reply with edits, or '我自己来' / 'manual' to abort.
   ```

6. **获得确认后**：按顺序对每个批次执行 `git add <files>` + `git commit -m "<msg>"`。不要 amend。不要 push。

7. **如果用户拒绝**（回复“不行” / “我自己来” / “manual” / 或对计划有任何反对）：停止。不要尝试第二版计划。用户会手动提交；你之后直接跳到 3.5。

**规则**：
- 绝对不要在任何地方使用 `git commit --amend`——三阶段三提交流程（工作提交 → 归档提交 → 日志提交）。
- 绝对不要在这一步 push 到远程。
- 如果用户只是想改消息措辞但接受文件分组，可以修改消息后再确认一次——但如果用户拒绝分组，就退出到手动模式。
- 批量计划只能发一次；不要为每个提交分别追问。

#### 3.5 收尾提醒

完成上述步骤后，提醒用户可以运行 `/finish-work` 来完成收尾（归档任务、记录 session）。

---

## 为 Trellis 做定制（fork 用）

这一节是给想要修改 Trellis 工作流本身的开发者看的。所有定制都通过编辑这个文件完成；脚本只是解析器。

### 改变某一步的含义

编辑上面 Phase 1 / 2 / 3 里对应步骤的 walkthrough 正文。**关键约束**：如果你修改了某个步骤的 `[required · once]` 标记，或者新增了一个 `[required · once]` 步骤，你**必须**同时在该 phase 对应的 `[workflow-state:STATUS]` tag block 里添加一条匹配的 enforcement 行——否则每回合 breadcrumb 不会包含这个强化提示，AI 就会静默跳过该步骤。回归测试会检查这一点。

上面 4 个 tag block 都位于 `## Phase Index` 区块中，紧跟着每个 phase summary：

| 范围 | 对应 tag |
|---|---|
| 无激活任务（Phase 1 之前） | `[workflow-state:no_task]`（在 Phase Index ASCII 图后面） |
| Phase 1 全部内容（任务创建 → 准备进入实现） | `[workflow-state:planning]`（在 Phase 1 summary 后面） |
| Phase 2 + Phase 3.1–3.4（实现 + 检查 + 收尾） | `[workflow-state:in_progress]`（在 Phase 2 summary 后面） |
| Phase 3.5 之后（已归档） | `[workflow-state:completed]`（在 Phase 3 summary 后面；**当前已失效**） |

### 改变每回合提示文本

直接编辑对应 `[workflow-state:STATUS]` block 的正文。编辑后，运行 `trellis update`（如果你是模板维护者）或者重启 AI session（如果你是在自己的项目里自定义）——不需要改脚本。

### 添加自定义状态

添加一个新的 block：

```
[workflow-state:my-status]
your per-turn prompt text
[/workflow-state:my-status]
```

约束：
- STATUS 字符集：`[A-Za-z0-9_-]+`（允许下划线和连字符，例如 `in-review`、`blocked-by-team`）
- 必须有一个生命周期 hook 将 `task.json.status` 写成你的自定义值，否则这个 tag 永远不会被读取
- 生命周期 hooks 位于 `task.json.hooks.after_*`，并绑定到 `after_create / after_start / after_finish / after_archive` 之一

### 添加生命周期 hook

在 `task.json` 里添加一个 `hooks` 字段：

```json
{
  "hooks": {
    "after_finish": [
      "your-script-or-command-here"
    ]
  }
}
```

支持的事件：`after_create / after_start / after_finish / after_archive`。注意 `after_finish` ≠ 状态变化（它只会清除 active-task 指针）；“任务已完成”通知应该使用 `after_archive`。

### 完整契约

关于工作流状态机的运行时契约、所有状态写入器的位置、伪状态（`no_task` / `stale_<source_type>`）、hook 可达性矩阵以及其他深层细节，请查看：

- `.trellis/spec/cli/backend/workflow-state-contract.md` — 运行时契约 + writer 表 + 测试不变量
- `.trellis/scripts/inject-workflow-state.py` — 实际 parser（只读取 workflow.md，不包含嵌入文本）
