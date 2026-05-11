import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runWorkflowChecks } from "./check-workflow.mjs";

function createTempRepo(structure) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-check-"));

  for (const [relativePath, content] of Object.entries(structure)) {
    const targetPath = path.join(repoRoot, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf8");
  }

  return repoRoot;
}

function createWorkflowState({
  stage = "implementation",
  planStatus = "completed",
  codeStatus = "in_progress",
  implementationLanes = "frontend",
  requiredCompanionSkills = "mg-frontend-vue-guide, mg-framework-ui",
  scenarioSkills = "docs/agents/frontend/AGENTS.md, mg-frontend-vue-guide, mg-framework-ui, docs/agents/test/AGENTS.md",
  scenarioSkillsLoaded = "Yes - frontend and UI skills loaded for implementation",
} = {}) {
  return `# Workflow State

- Name: Sample Feature
- Slug: sample-feature
- Change ID: sample-change
- Change Path: openspec/changes/sample-change
- Owner: Test Owner
- Date Opened: 2026-04-01

## Current Stage

- Stage: ${stage}
- Why this stage is active: Ready for workflow gate validation
- Required companion skills: ${requiredCompanionSkills}
- Implementation Lanes: ${implementationLanes}

## Loaded Workflow Rules

- Required Skills: magus-pattern-guard, magus-workflow-orchestrator, magus-workflow-orchestrator/levels/L4-standard-dev.md, docs/process/l4-execution-adapter.md, magus-workflow-governance, magus-base-standards
- Required Skills Loaded: Yes - all required L4 skills loaded
- Scenario Skills: ${scenarioSkills}
- Scenario Skills Loaded: ${scenarioSkillsLoaded}
- Skill Loading Evidence: test fixture records required and scenario skill loading

## OpenSpec Status

- Proposal Path: openspec/changes/sample-change/proposal.md
- Proposal Status: completed
- Specs Path: openspec/changes/sample-change/specs
- Specs Status: completed
- Design Path: openspec/changes/sample-change/design.md
- Design Status: completed
- Tasks Path: openspec/changes/sample-change/tasks.md
- Tasks Status: completed

## Delivery Status

- Plan Path: docs/superpowers/plans/sample-change.md
- Plan Status: ${planStatus}
- Plan Review Mode: human
- Plan Review Evidence: docs/superpowers/reviews/sample-change-plan-review.md
- User Confirmed Implementation: yes
- Code Status: ${codeStatus}
- Review Path: pending
- Review Status: pending
- Independent Review Mode: human
- Review Evidence: pending
- User Confirmation: pending
- May Proceed: no
- Verification Path: pending
- Verification Status: pending

## Test Budget

- Unit/Integration Budget: test fixture
- E2E Budget: test fixture
- Current Unit Runs: 0
- Current E2E Runs: 0
- Stop Condition Triggered: No

## Skill Evidence

- Skill Log Path: openspec/changes/sample-change/process/skill-usage-log.md
- Skill Evidence Status: test fixture
- Missing Evidence: none

## Coordination

- Blockers: None
- Next Action: Continue implementation

## Evidence Log

- 2026-04-01: Test fixture initialized.
`;
}

function createReadinessDoc({ title = "Feature Ready Record", includeAllSections = true, readinessLane = "frontend" } = {}) {
  const laneSections = [];
  if (readinessLane === "frontend") {
    laneSections.push(
      "## 前端实现约束\n- 页面可见元素增量审查（结构）：已收口\n- 页面可见元素增量审查（交互）：已收口\n- 页面可见元素增量审查（文本）：已收口\n- 前端测试矩阵补充说明：已定义（最低证明层级由需求-测试矩阵中每个需求点的最低证明层级自动推导，保证适用准确）",
    );
  }
  if (readinessLane === "backend-java") {
    laneSections.push("## 后端 Java 实现约束\n- 后端测试矩阵补充说明：已定义");
  }

  const sections = [
    "## 工作区策略\n- 工作区类型：主工作区\n- 选择原因：验证模板结构",
    "## 环境前置\n- 依赖安装状态：已确认\n- 关键脚本可运行性：已确认\n- OpenSpec 工具可用性：已确认",
    ...laneSections,
    "## 人工确认与独立评审适配\n- Plan Review Mode: human\n- Plan Review Evidence: docs/superpowers/reviews/sample-change-plan-review.md\n- User Confirmed Implementation: yes\n- Independent Review Mode: human\n- Reviewer / Verifier: Test Reviewer\n- Review Evidence: docs/superpowers/reviews/sample-change-plan-review.md\n- User Confirmation: yes - user confirmed implementation\n- May Proceed: yes\n- TDD Exception: None",
    "## 需求-测试矩阵\n- 需求点：已覆盖\n- 对应测试类型：单元 + 集成\n- 主链路覆盖情况：已覆盖\n- 关键异常覆盖情况：已覆盖\n- 状态一致性覆盖情况：已覆盖\n- 备注：无",
    "## 确认结论\n- OpenSpec 完整性：已确认\n- 正式计划状态：completed\n- 门禁状态：implementation\n- 是否允许进入 `implementation`：是\n- 确认人：Test Owner\n- 确认时间：2026-04-01\n- 备注：无",
  ];

  const body = includeAllSections ? sections.join("\n\n") : sections.filter((section) => !section.startsWith("## 前端实现约束")).join("\n\n");
  return `# ${title}\n\n${body}\n`;
}

function createRepoForWorkflow({
  stage = "implementation",
  planStatus = "completed",
  codeStatus = "in_progress",
  implementationLanes = "frontend",
  requiredCompanionSkills = "mg-frontend-vue-guide, mg-framework-ui",
  scenarioSkills = "docs/agents/frontend/AGENTS.md, mg-frontend-vue-guide, mg-framework-ui, docs/agents/test/AGENTS.md",
  scenarioSkillsLoaded = "Yes - frontend and UI skills loaded for implementation",
  tasksContent = "## 0. Gate\n\n- [x] 0.1 Ready\n\n## 1. Work\n\n- [ ] 1.1 Pending\n",
  readinessTitle = "Feature Ready Record",
  includeAllReadinessSections = true,
  readinessLane = "frontend",
} = {}) {
  return createTempRepo({
    ".npmrc": "registry=https://registry.npmmirror.com/\n@magustek:registry=https://nexus.magustek.com/repository/npm-magus/\n",
    "openspec/changes/sample-change/process/workflow-state.md": createWorkflowState({
      stage,
      planStatus,
      codeStatus,
      implementationLanes,
      requiredCompanionSkills,
      scenarioSkills,
      scenarioSkillsLoaded,
    }),
    "openspec/changes/sample-change/process/implementation-readiness.md": `\uFEFF${createReadinessDoc({
      title: readinessTitle,
      includeAllSections: includeAllReadinessSections,
      readinessLane,
    })}`,
    "openspec/changes/sample-change/.openspec.yaml": "schema: spec-driven\ncreated: 2026-04-03\n",
    "openspec/changes/sample-change/proposal.md": "# Proposal",
    "openspec/changes/sample-change/design.md": "# Design",
    "openspec/changes/sample-change/tasks.md": tasksContent,
    "openspec/changes/sample-change/specs/workflow-gate-enforcement/spec.md": `## ADDED Requirements

### Requirement: Sample workflow gate
The workflow gate MUST validate the active change.

#### Scenario: Active change exists
- **WHEN** workflow validation runs
- **THEN** it succeeds when required artifacts exist
`,
    "docs/superpowers/plans/sample-change.md": "# Plan",
  });
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

function withResetExitCode(fn) {
  const previous = process.exitCode;
  process.exitCode = undefined;
  try {
    return fn();
  } finally {
    process.exitCode = previous;
  }
}

runTest("implementation stage accepts official change workspace and readiness template aliases", () => {
  const repoRoot = createRepoForWorkflow({
    readinessTitle: "功能就绪记录",
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /implementation-readiness\.md 模板结构检查通过/);
  assert.match(stdout.join("\n"), /当前 Change 路径存在且包含 \.openspec\.yaml/);
});

runTest("implementation stage accepts platform-docs without frontend readiness section", () => {
  const repoRoot = createRepoForWorkflow({
    implementationLanes: "platform-docs",
    requiredCompanionSkills: "magus-workflow-governance, magus-base-standards",
    scenarioSkills: "magus-workflow-governance, magus-base-standards",
    scenarioSkillsLoaded: "Yes - platform workflow documentation skills loaded",
    readinessLane: "platform-docs",
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /当前实现 lane：platform-docs/);
  assert.doesNotMatch(stderr.join("\n"), /前端实现约束/);
});

runTest("implementation stage accepts no-code without frontend readiness section", () => {
  const repoRoot = createRepoForWorkflow({
    implementationLanes: "no-code",
    requiredCompanionSkills: "magus-workflow-governance",
    scenarioSkills: "not applicable",
    scenarioSkillsLoaded: "not applicable",
    readinessLane: "no-code",
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /当前实现 lane：no-code/);
});

runTest("implementation stage fails loudly for unknown implementation lane", () => {
  const repoRoot = createRepoForWorkflow({
    implementationLanes: "ghost-lane",
    readinessLane: "platform-docs",
  });

  assert.throws(
    () =>
      runWorkflowChecks({
        repoRoot,
        changeId: "sample-change",
        stdout: () => {},
        stderr: () => {},
      }),
    /Unknown implementation lane: ghost-lane/,
  );
});

runTest("implementation stage fails when Plan Review Evidence is missing from readiness", () => {
  const repoRoot = createRepoForWorkflow({ implementationLanes: "platform-docs", readinessLane: "platform-docs" });
  const readinessPath = path.join(repoRoot, "openspec/changes/sample-change/process/implementation-readiness.md");
  const readiness = fs.readFileSync(readinessPath, "utf8");
  fs.writeFileSync(readinessPath, readiness.replace(/- Plan Review Evidence: .+\n/, ""), "utf8");

  const stdout = [];
  const stderr = [];
  const passed = runWorkflowChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /implementation-readiness\.md 缺少必填字段：Plan Review Evidence/);
});

runTest("implementation stage fails when May Proceed is missing from readiness", () => {
  const repoRoot = createRepoForWorkflow({ implementationLanes: "platform-docs", readinessLane: "platform-docs" });
  const readinessPath = path.join(repoRoot, "openspec/changes/sample-change/process/implementation-readiness.md");
  const readiness = fs.readFileSync(readinessPath, "utf8");
  fs.writeFileSync(readinessPath, readiness.replace(/- May Proceed: .+\n/, ""), "utf8");

  const stdout = [];
  const stderr = [];
  const passed = runWorkflowChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /implementation-readiness\.md 缺少必填字段：May Proceed/);
});

runTest("implementation stage fails when final implementation permission conclusion is missing", () => {
  const repoRoot = createRepoForWorkflow({ implementationLanes: "platform-docs", readinessLane: "platform-docs" });
  const readinessPath = path.join(repoRoot, "openspec/changes/sample-change/process/implementation-readiness.md");
  const readiness = fs.readFileSync(readinessPath, "utf8");
  fs.writeFileSync(readinessPath, readiness.replace(/- 是否允许进入 `implementation`：.+\n/, ""), "utf8");

  const stdout = [];
  const stderr = [];
  const passed = runWorkflowChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /implementation-readiness\.md 缺少必填字段：是否允许进入 `implementation`/);
});

runTest("fails when a required readiness section is missing", () => {
  const repoRoot = createRepoForWorkflow({
    includeAllReadinessSections: false,
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /missing required section/);
});

runTest("fails when tasks.md has no trackable checkboxes", () => {
  const repoRoot = createRepoForWorkflow({
    tasksContent: "## 1. Sample\n\n- pending task without checkbox\n",
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /缺少可追踪任务项/);
});

runTest("fails when plan is completed but no task has started", () => {
  const repoRoot = createRepoForWorkflow({
    stage: "writing-plans",
    planStatus: "completed",
    tasksContent: "## 0. Gate\n\n- [ ] 0.1 Ready\n- [ ] 0.2 Confirmed\n",
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /Plan Status 已完成，但当前 change tasks\.md 仍为 0 项完成/);
});

runTest("runWorkflowChecks can be called repeatedly without leaking failure state", () => {
  const failingRepo = createRepoForWorkflow({
    tasksContent: "## 1. Sample\n\n- pending task without checkbox\n",
  });

  const passingRepo = createRepoForWorkflow();

  const firstOutput = [];
  const firstError = [];
  const firstPassed = runWorkflowChecks({
    repoRoot: failingRepo,
    changeId: "sample-change",
    stdout: (message) => firstOutput.push(message),
    stderr: (message) => firstError.push(message),
  });

  const secondOutput = [];
  const secondError = [];
  const secondPassed = runWorkflowChecks({
    repoRoot: passingRepo,
    changeId: "sample-change",
    stdout: (message) => secondOutput.push(message),
    stderr: (message) => secondError.push(message),
  });

  assert.equal(firstPassed, false);
  assert.equal(secondPassed, true);
  assert.match(firstError.join("\n"), /缺少可追踪任务项/);
  assert.equal(secondError.length, 0);
  assert.match(secondOutput.join("\n"), /PASS: 工作流状态满足当前阶段要求/);
});

runTest("fails when code-review stage but Code Status is still pending", () => {
  const repoRoot = createRepoForWorkflow({ 
    stage: "code-review",
    codeStatus: "pending" 
  });

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /Code Status 不能仍为 pending/);
});

runTest("fails when implementation starts before scenario skills are loaded", () => {
  const repoRoot = createRepoForWorkflow();
  const workflowPath = path.join(repoRoot, "openspec/changes/sample-change/process/workflow-state.md");
  const workflow = fs.readFileSync(workflowPath, "utf8").replace(
    "- Scenario Skills Loaded: Yes - frontend and UI skills loaded for implementation",
    "- Scenario Skills Loaded: Pending - not confirmed yet",
  );
  fs.writeFileSync(workflowPath, workflow, "utf8");

  const stdout = [];
  const stderr = [];
  const passed = withResetExitCode(() =>
    runWorkflowChecks({
      repoRoot,
      changeId: "sample-change",
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    }),
  );

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /Scenario Skills Loaded 必须明确记录为已加载或不适用/);
});

runTest("requires changeId and no longer supports legacy mode", () => {
  const repoRoot = createRepoForWorkflow();

  assert.throws(
    () => runWorkflowChecks({
      repoRoot,
      stdout: () => {},
      stderr: () => {},
    }),
    /Missing required argument: --change <change-id>/,
  );
});
