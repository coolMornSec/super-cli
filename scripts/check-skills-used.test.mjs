import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runSkillUsageChecks } from "./check-skills-used.mjs";

function createTempRepo(structure) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skill-check-"));
  for (const [relativePath, content] of Object.entries(structure)) {
    const targetPath = path.join(repoRoot, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf8");
  }
  return repoRoot;
}

function workflowState({ stage = "tasks" } = {}) {
  return `# Workflow State

- Stage: ${stage}
- Change ID: sample-change
- Change Path: openspec/changes/sample-change
- Required Skills: magus-pattern-guard, magus-workflow-orchestrator, magus-workflow-orchestrator/levels/L4-standard-dev.md, docs/process/l4-execution-adapter.md, magus-workflow-governance, magus-base-standards
- Required Skills Loaded: Yes - all loaded
- Scenario Skills: magus-workflow-governance, magus-base-standards
- Scenario Skills Loaded: Yes - loaded
- Skill Loading Evidence: process/skill-usage-log.md
- Review Path: pending
- Review Evidence: pending
- Verification Path: pending
- Verification Status: pending
`;
}

function completeSkillLog() {
  return `# Skill Usage Log

## 2026-05-08

### magus-pattern-guard
- Required By: AGENTS.md
- Read Evidence: read skill file
- Applied To: anti-pattern review
- Decision / Action: blocked fake completion
- Effect Evidence: recorded unverified items
- Evidence Path: process/workflow-state.md
- Status: applied
- Updated At: 2026-05-08

### magus-workflow-orchestrator
- Required By: AGENTS.md
- Read Evidence: read skill file
- Applied To: L4 routing
- Decision / Action: selected L4
- Effect Evidence: Stage recorded
- Evidence Path: process/workflow-state.md
- Status: applied
- Updated At: 2026-05-08

### magus-workflow-orchestrator/levels/L4-standard-dev.md
- Required By: L4
- Read Evidence: read L4 file
- Applied To: gate checks
- Decision / Action: required process files
- Effect Evidence: process files exist
- Evidence Path: process/workflow-state.md
- Status: applied
- Updated At: 2026-05-08

### docs/process/l4-execution-adapter.md
- Required By: L4
- Read Evidence: read adapter
- Applied To: independent review gate
- Decision / Action: kept implementation blocked
- Effect Evidence: May Proceed no
- Evidence Path: process/implementation-readiness.md
- Status: applied
- Updated At: 2026-05-08

### magus-workflow-governance
- Required By: OpenSpec
- Read Evidence: read governance
- Applied To: spec docs
- Decision / Action: aligned OpenSpec
- Effect Evidence: proposal/spec/design/tasks aligned
- Evidence Path: openspec/changes/sample-change
- Status: applied
- Updated At: 2026-05-08

### magus-base-standards
- Required By: quality
- Read Evidence: read base standards
- Applied To: acceptance criteria
- Decision / Action: added verification tasks
- Effect Evidence: tests planned
- Evidence Path: openspec/changes/sample-change/tasks.md
- Status: applied
- Updated At: 2026-05-08
`;
}

function createRepo({ includeSkillLog = true, stage = "tasks" } = {}) {
  const files = {
    "openspec/changes/sample-change/.openspec.yaml": "schema: spec-driven\ncreated: 2026-05-08\n",
    "openspec/changes/sample-change/process/workflow-state.md": workflowState({ stage }),
  };
  if (includeSkillLog) {
    files["openspec/changes/sample-change/process/skill-usage-log.md"] = completeSkillLog();
  }
  return createTempRepo(files);
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

runTest("single change passes when required skills have full evidence", () => {
  const repoRoot = createRepo();
  const stdout = [];
  const stderr = [];
  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    format: "text",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(result.passed, true);
  assert.equal(result.exitCode, 0);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /PASS: skill usage evidence satisfies current requirements/);
});

runTest("missing skill log blocks the check", () => {
  const repoRoot = createRepo({ includeSkillLog: false });
  const stderr = [];
  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    stderr: (message) => stderr.push(message),
    stdout: () => {},
  });

  assert.equal(result.passed, false);
  assert.equal(result.exitCode, 1);
  assert.match(stderr.join("\n"), /Missing skill usage log/);
});

runTest("present evidence with missing status is a non-blocking warning", () => {
  const repoRoot = createRepo();
  const skillLogPath = path.join(repoRoot, "openspec/changes/sample-change/process/skill-usage-log.md");
  const skillLog = fs.readFileSync(skillLogPath, "utf8").replace("- Status: applied\n", "");
  fs.writeFileSync(skillLogPath, skillLog, "utf8");

  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: () => {},
    stderr: () => {},
  });

  assert.equal(result.exitCode, 0);
  assert.equal(result.report.blocking, false);
  assert.equal(result.report.skills.find((skill) => skill.skillName === "magus-pattern-guard").status, "warn");
});

runTest("json output includes required top-level fields", () => {
  const repoRoot = createRepo();
  const stdout = [];
  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    format: "json",
    stdout: (message) => stdout.push(message),
    stderr: () => {},
  });

  assert.equal(result.exitCode, 0);
  const parsed = JSON.parse(stdout.join("\n"));
  assert.equal(parsed.status, "pass");
  assert.ok(Array.isArray(parsed.findings));
  assert.ok(Array.isArray(parsed.changes));
  assert.ok(Array.isArray(parsed.skills));
  assert.equal(parsed.blocking, false);
});

runTest("repository mode scans multiple changes", () => {
  const repoRoot = createRepo();
  fs.mkdirSync(path.join(repoRoot, "openspec/changes/second-change/process"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "openspec/changes/second-change/.openspec.yaml"), "schema: spec-driven\ncreated: 2026-05-08\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "openspec/changes/second-change/process/workflow-state.md"), workflowState(), "utf8");
  fs.writeFileSync(path.join(repoRoot, "openspec/changes/second-change/process/skill-usage-log.md"), completeSkillLog(), "utf8");

  const result = runSkillUsageChecks({
    repoRoot,
    format: "json",
    stdout: () => {},
    stderr: () => {},
  });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.report.changes.map((change) => change.changeId), ["sample-change", "second-change"]);
});

runTest("verification stage blocks when review record is missing", () => {
  const repoRoot = createRepo({ stage: "verification" });
  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: () => {},
    stderr: () => {},
  });

  assert.equal(result.exitCode, 1);
  assert.match(JSON.stringify(result.report.findings), /Missing review record/);
});

runTest("finish stage blocks when verification record is missing", () => {
  const repoRoot = createRepo({ stage: "finish" });
  fs.writeFileSync(path.join(repoRoot, "openspec/changes/sample-change/process/review.md"), "# Review Record\n\n- Decision: pass\n", "utf8");
  const result = runSkillUsageChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: () => {},
    stderr: () => {},
  });

  assert.equal(result.exitCode, 1);
  assert.match(JSON.stringify(result.report.findings), /Missing verification record/);
});
