import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { scaffoldChangeProcess } from "./scaffold-change-process.mjs";

function createTempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "change-process-scaffold-"));
}

function writeChangeRoot(repoRoot, changeId) {
  const changeRoot = path.join(repoRoot, "openspec", "changes", changeId);
  fs.mkdirSync(changeRoot, { recursive: true });
  fs.writeFileSync(path.join(changeRoot, ".openspec.yaml"), "schema: spec-driven\ncreated: 2026-04-07\n", "utf8");
  return changeRoot;
}

function writeTemplateFiles(repoRoot, overrides = {}) {
  const templatesRoot = path.join(repoRoot, "templates");
  const harnessTemplatesRoot = path.join(repoRoot, ".ai-harness", "templates");
  fs.mkdirSync(templatesRoot, { recursive: true });
  fs.mkdirSync(harnessTemplatesRoot, { recursive: true });

  const defaults = {
    "implementation-readiness.common.md": `# 功能就绪记录

- 功能名称: {{displayName}}
- 功能标识: {{changeId}}
- 记录日期: {{date}}
- 当前阶段: {{stage}}
- 实现 Lane: {{lanes}}

## 工作区策略

- 工作区类型：待补齐
- 选择原因：待补齐
- 风险控制：待补齐
- 回滚方案：待补齐
- 协作方式：待补齐

## 环境前置

- 依赖安装状态：待确认
- 命令口径：待确认
- 自动化检查：待确认

## 通用实现约束

- 当前 change 类型：待补齐
- 受影响能力：待补齐
- 受影响目录 / 模块 / 包边界：待补齐
- 允许修改范围：待补齐
- 禁止扩展范围：待补齐
- 契约落盘策略：待补齐
- 回滚触发条件：待补齐
- 风险接受前置条件：待补齐

{{laneSections}}

## 人工确认与独立评审适配

- Plan Review Mode: pending
- Plan Review Evidence: pending
- User Confirmed Implementation: no
- Independent Review Mode: pending
- Reviewer / Verifier: pending
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- TDD Exception: None

## 需求-测试矩阵

- 需求点：待补齐
- 最低证明层级：待补齐
- 测试文件或验证载体：待补齐
- 聚焦命令：待补齐
- 预算上限：待补齐
- 当前真实执行状态：待补齐
- 剩余缺口：待补齐

## 确认结论

- OpenSpec 完整性：待确认
- 正式计划状态：待确认
- 门禁状态：待审查
- 是否允许进入 \`implementation\`：否
- 记录人：MAGUS
`,
    "implementation-readiness.frontend.md": `## 前端实现约束

- 页面可见元素增量审查（结构）：待补齐
- 页面可见元素增量审查（交互）：待补齐
- 页面可见元素增量审查（文本）：待补齐
- 组件选型结论：待补齐
- 页面 / 路由 / 组件边界：待补齐
- 默认文案或默认交互处理方式：待补齐
- 前端测试矩阵补充说明：待补齐（最低证明层级由需求-测试矩阵中每个需求点的最低证明层级自动推导，保证适用准确）
`,
    "implementation-readiness.backend-java.md": `## 后端 Java 实现约束

- 受影响模块：待补齐
- 受影响包边界：待补齐
- API 资源路径：待补齐
- Controller / Service / Repository 分层结论：待补齐
- Req / Resp / DTO 设计结论：待补齐
- 统一响应体结论：待补齐
- 异常与错误语义：待补齐
- Header / 权限 / 公司或租户上下文要求：待补齐
- 契约文件位置：待补齐
- 持久化层约束与并发兜底说明：待补齐
- 后端测试矩阵补充说明：待补齐（最低证明层级由需求-测试矩阵中每个需求点的最低证明层级自动推导，保证适用准确）
`,
  };

  for (const [fileName, content] of Object.entries({ ...defaults, ...overrides })) {
    fs.writeFileSync(path.join(templatesRoot, fileName), content, "utf8");
  }

  fs.writeFileSync(
    path.join(harnessTemplatesRoot, "workflow-state.md"),
    `# Workflow State

- Name: {{displayName}}
- Slug: {{changeId}}
- Change ID: {{changeId}}
- Change Path: openspec/changes/{{changeId}}
- Owner: {{owner}}
- Date Opened: {{date}}

## Current Stage

- Stage: {{stage}}
- Why this stage is active: {{stageReason}}
- Required companion skills: \`magus-pattern-guard\`, \`magus-workflow-orchestrator\`, \`magus-workflow-orchestrator/levels/L4-standard-dev.md\`, \`docs/process/l4-execution-adapter.md\`, \`magus-workflow-governance\`, \`magus-base-standards\`
- Implementation Lanes: {{lanes}}

## Loaded Workflow Rules

- Required Skills: \`magus-pattern-guard\`, \`magus-workflow-orchestrator\`, \`magus-workflow-orchestrator/levels/L4-standard-dev.md\`, \`docs/process/l4-execution-adapter.md\`, \`magus-workflow-governance\`, \`magus-base-standards\`
- Required Skills Loaded: Yes - scaffolded after L4 entry requirements were evaluated
- Scenario Skills: {{scenarioSkills}}
- Scenario Skills Loaded: Pending - confirm and update before the first stage that depends on each scenario skill
- Skill Loading Evidence: Record skill paths, read timestamps, or review notes before each stage transition

## OpenSpec Status

- Proposal Path: openspec/changes/{{changeId}}/proposal.md
- Proposal Status: pending
- Specs Path: openspec/changes/{{changeId}}/specs
- Specs Status: pending
- Design Path: openspec/changes/{{changeId}}/design.md
- Design Status: pending
- Tasks Path: openspec/changes/{{changeId}}/tasks.md
- Tasks Status: pending

## Delivery Status

- Plan Path: pending
- Plan Status: pending
- Plan Review Mode: pending
- Plan Review Evidence: pending
- User Confirmed Implementation: no
- Code Status: pending
- Review Path: pending
- Review Status: pending
- Independent Review Mode: pending
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- Verification Path: pending
- Verification Status: pending

## Test Budget

- Unit/Integration Budget: pending
- E2E Budget: pending
- Current Unit Runs: 0
- Current E2E Runs: 0
- Stop Condition Triggered: No

## Skill Evidence

- Skill Log Path: openspec/changes/{{changeId}}/process/skill-usage-log.md
- Skill Evidence Status: pending
- Missing Evidence: pending

## Coordination

- Blockers: pending
- Next Action: pending

## Evidence Log

- {{date}}: Process files initialized from harness templates.
`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(harnessTemplatesRoot, "implementation-readiness.md"),
    `# 功能就绪记录

- 功能名称: {{displayName}}
- 功能标识: {{changeId}}
- 记录日期: {{date}}
- 当前阶段: {{stage}}
- 实现 Lane: {{lanes}}

## 工作区策略

- 工作区类型：pending
- 选择原因：pending

## 环境前置

- 命令口径：pending

## 通用实现约束

- 当前 change 类型：pending

{{laneSections}}

## 人工确认与独立评审适配

- Plan Review Mode: pending
- Plan Review Evidence: pending
- User Confirmed Implementation: no
- Independent Review Mode: pending
- Reviewer / Verifier: pending
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- TDD Exception: None

## 需求-测试矩阵

- 需求点：pending
- 当前真实执行状态：待补齐

## 确认结论

- 是否允许进入 \`implementation\`：否
`,
    "utf8",
  );
}

function read(relativePath, repoRoot) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest("scaffoldChangeProcess creates both process templates for a new change", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);

  const result = scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
    displayName: "Sample Change",
  });

  assert.equal(result.workflowWritten, true);
  assert.equal(result.readinessWritten, true);

  const workflow = read("openspec/changes/sample-change/process/workflow-state.md", repoRoot);
  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);

  assert.match(workflow, /- Stage: proposal/);
  assert.match(workflow, /- Change ID: sample-change/);
  assert.match(workflow, /## Loaded Workflow Rules/);
  assert.match(workflow, /Required Skills Loaded: Yes/);
  assert.match(workflow, /Scenario Skills Loaded: Pending/);
  assert.match(workflow, /magus-workflow-orchestrator\/levels\/L4-standard-dev\.md/);
  assert.match(workflow, /docs\/process\/l4-execution-adapter\.md/);
  assert.match(workflow, /User Confirmed Implementation: no/);
  assert.match(workflow, /Proposal Path: openspec\/changes\/sample-change\/proposal\.md/);
  assert.match(readiness, /# 功能就绪记录/);
  assert.match(readiness, /## 工作区策略/);
  assert.match(readiness, /## 人工确认与独立评审适配/);
  assert.match(readiness, /## 前端实现约束/);
  assert.match(readiness, /当前真实执行状态：待补齐/);
  assert.match(readiness, /是否允许进入 `implementation`：否/);
});

runTest("scaffoldChangeProcess keeps existing files by default", () => {
  const repoRoot = createTempRepo();
  const changeRoot = writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);
  const processRoot = path.join(changeRoot, "process");
  fs.mkdirSync(processRoot, { recursive: true });
  fs.writeFileSync(path.join(processRoot, "workflow-state.md"), "original workflow", "utf8");
  fs.writeFileSync(path.join(processRoot, "implementation-readiness.md"), "original readiness", "utf8");

  const result = scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
  });

  assert.equal(result.workflowWritten, false);
  assert.equal(result.readinessWritten, false);
  assert.equal(read("openspec/changes/sample-change/process/workflow-state.md", repoRoot), "original workflow");
  assert.equal(read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot), "original readiness");
});

runTest("scaffoldChangeProcess can overwrite existing process templates", () => {
  const repoRoot = createTempRepo();
  const changeRoot = writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);
  const processRoot = path.join(changeRoot, "process");
  fs.mkdirSync(processRoot, { recursive: true });
  fs.writeFileSync(path.join(processRoot, "workflow-state.md"), "original workflow", "utf8");
  fs.writeFileSync(path.join(processRoot, "implementation-readiness.md"), "original readiness", "utf8");

  const result = scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
    stage: "tasks",
    overwrite: true,
  });

  assert.equal(result.workflowWritten, true);
  assert.equal(result.readinessWritten, true);

  const workflow = read("openspec/changes/sample-change/process/workflow-state.md", repoRoot);
  assert.match(workflow, /- Stage: tasks/);
  assert.match(workflow, /正在拆分任务与验收项/);
});

runTest("scaffoldChangeProcess reads readiness content from template files", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);
  fs.writeFileSync(
    path.join(repoRoot, ".ai-harness", "templates", "implementation-readiness.md"),
    `# 功能就绪记录

- 功能名称: {{displayName}}
- 功能标识: {{changeId}}
- 记录日期: {{date}}
- 当前阶段: {{stage}}
- 实现 Lane: {{lanes}}

## 工作区策略

- 工作区类型：来自模板文件

## 环境前置

- 命令口径：来自模板文件

## 通用实现约束

- 当前 change 类型：来自模板文件

{{laneSections}}

## 人工确认与独立评审适配

- Plan Review Mode: pending
- Plan Review Evidence: pending
- User Confirmed Implementation: no
- Independent Review Mode: pending
- Reviewer / Verifier: pending
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- TDD Exception: None

## 需求-测试矩阵

- 需求点：来自模板文件

## 确认结论

- 是否允许进入 \`implementation\`：否
`,
    "utf8",
  );

  scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
  });

  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);
  assert.match(readiness, /工作区类型：来自模板文件/);
});

runTest("scaffoldChangeProcess includes frontend and backend template sections for dual-lane changes", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);

  scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
    lanes: ["frontend", "backend-java"],
  });

  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);
  assert.match(readiness, /## 前端实现约束/);
  assert.match(readiness, /后端测试矩阵补充说明：pending/);
});

runTest("scaffoldChangeProcess preserves platform-docs lane without frontend or backend sections", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);

  scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
    lanes: "platform-docs",
  });

  const workflow = read("openspec/changes/sample-change/process/workflow-state.md", repoRoot);
  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);
  assert.match(workflow, /Implementation Lanes: platform-docs/);
  assert.match(readiness, /实现 Lane: platform-docs/);
  assert.doesNotMatch(readiness, /## 前端实现约束/);
  assert.doesNotMatch(readiness, /## 后端 Java 实现约束/);
});

runTest("scaffoldChangeProcess preserves no-code lane without frontend or backend sections", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);

  scaffoldChangeProcess({
    repoRoot,
    changeId: "sample-change",
    lanes: "no-code",
  });

  const workflow = read("openspec/changes/sample-change/process/workflow-state.md", repoRoot);
  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);
  assert.match(workflow, /Implementation Lanes: no-code/);
  assert.match(readiness, /实现 Lane: no-code/);
  assert.doesNotMatch(readiness, /## 前端实现约束/);
  assert.doesNotMatch(readiness, /## 后端 Java 实现约束/);
});

runTest("scaffoldChangeProcess fails for unknown implementation lane", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);

  assert.throws(
    () => scaffoldChangeProcess({ repoRoot, changeId: "sample-change", lanes: "ghost-lane" }),
    /Unknown implementation lane: ghost-lane/,
  );
});

runTest("scaffoldChangeProcess prefers .ai-harness implementation-readiness template when present", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  writeTemplateFiles(repoRoot);
  const harnessTemplates = path.join(repoRoot, ".ai-harness", "templates");
  fs.mkdirSync(harnessTemplates, { recursive: true });
  fs.writeFileSync(
    path.join(harnessTemplates, "implementation-readiness.md"),
    `# 功能就绪记录

- 功能名称: {{displayName}}
- 功能标识: {{changeId}}
- 记录日期: {{date}}
- 当前阶段: {{stage}}
- 实现 Lane: {{lanes}}

## 工作区策略

- 工作区类型：harness-template

## 环境前置

- 命令口径：harness-template

## 通用实现约束

- 当前 change 类型：harness-template

## 人工确认与独立评审适配

- Plan Review Mode: pending
- Plan Review Evidence: pending
- User Confirmed Implementation: no
- Independent Review Mode: pending
- Reviewer / Verifier: pending
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- TDD Exception: None

## 需求-测试矩阵

- 需求点：harness-template

## 确认结论

- 是否允许进入 \`implementation\`：否
`,
    "utf8",
  );

  scaffoldChangeProcess({ repoRoot, changeId: "sample-change", lanes: "platform-docs" });

  const readiness = read("openspec/changes/sample-change/process/implementation-readiness.md", repoRoot);
  assert.match(readiness, /工作区类型：harness-template/);
  assert.match(readiness, /实现 Lane: platform-docs/);
});

runTest("scaffoldChangeProcess fails when readiness templates are missing", () => {
  const repoRoot = createTempRepo();
  writeChangeRoot(repoRoot, "sample-change");
  const harnessTemplatesRoot = path.join(repoRoot, ".ai-harness", "templates");
  fs.mkdirSync(harnessTemplatesRoot, { recursive: true });
  fs.writeFileSync(path.join(harnessTemplatesRoot, "workflow-state.md"), "# Workflow State\n", "utf8");

  assert.throws(
    () => scaffoldChangeProcess({ repoRoot, changeId: "sample-change" }),
    /Missing harness readiness template/,
  );
});
