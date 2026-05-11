#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { normalizeLanes, orderedStages } from "./workflow-support.mjs";

const allowedStages = new Set(orderedStages);

function fail(message) {
  throw new Error(message);
}

function normalizeDisplayName(name, changeId) {
  if (name && name.trim()) return name.trim();
  return changeId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

const stageReasons = {
  brainstorming: "正在澄清执行意图、范围、约束和关键分歧",
  proposal: "正在创建或对齐 OpenSpec proposal",
  specs: "正在对齐能力规格与验收口径",
  design: "正在对齐技术方案、契约和边界情况",
  tasks: "正在拆分任务与验收项",
  "writing-plans": "正在生成实现计划并等待独立审查",
  implementation: "正在按已审查计划执行实现",
  "code-review": "正在等待独立 code review",
  verification: "正在等待独立 verification",
  finish: "正在收口交付状态、剩余风险和完成门禁",
};

function createLaneSections(lanes) {
  const sections = [];
  if (lanes.includes("frontend")) {
    sections.push(`## 前端实现约束

- 页面可见元素增量审查（结构）：pending
- 页面可见元素增量审查（交互）：pending
- 页面可见元素增量审查（文本）：pending
- 组件选型结论：pending
- 页面 / 路由 / 组件边界：pending
- 前端测试矩阵补充说明：pending`);
  }

  if (lanes.includes("backend-java")) {
    sections.push(`## 后端 Java 实现约束

- 受影响模块：pending
- 受影响包边界：pending
- API 资源路径：pending
- Controller / Service / Repository 分层结论：pending
- Req / Resp / DTO 设计结论：pending
- 异常与错误语义：pending
- 后端测试矩阵补充说明：pending`);
  }

  return sections.length > 0 ? `\n${sections.join("\n\n")}\n` : "";
}

function createWorkflowStateContent({
  repoRoot,
  displayName,
  changeId,
  stage = "proposal",
  owner = "codex",
  date = todayString(),
  lanes = ["frontend"],
}) {
  const harnessTemplate = readHarnessTemplate(repoRoot, "workflow-state.md");
  if (!harnessTemplate) {
    fail(`Missing harness workflow template: ${path.join(repoRoot, ".ai-harness", "templates", "workflow-state.md")}`);
  }

  return applyTemplateTokens(harnessTemplate, {
    displayName,
    changeId,
    owner,
    date,
    stage,
    stageReason: stageReasons[stage] ?? stage,
    lanes: lanes.join(", "),
    scenarioSkills: lanes.join(", "),
  });
}

function readHarnessTemplate(repoRoot, fileName) {
  const templatePath = path.join(repoRoot, ".ai-harness", "templates", fileName);
  if (!fs.existsSync(templatePath)) return null;
  return fs.readFileSync(templatePath, "utf8").replace(/^\uFEFF/, "").trim();
}

function applyTemplateTokens(template, values) {
  return Object.entries(values).reduce((current, [key, value]) => {
    return current.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

function createImplementationReadinessContent({
  repoRoot,
  displayName,
  changeId,
  stage = "proposal",
  date = todayString(),
  lanes = ["frontend"],
}) {
  const harnessTemplate = readHarnessTemplate(repoRoot, "implementation-readiness.md");
  if (!harnessTemplate) {
    fail(`Missing harness readiness template: ${path.join(repoRoot, ".ai-harness", "templates", "implementation-readiness.md")}`);
  }

  return applyTemplateTokens(harnessTemplate, {
    displayName,
    changeId,
    stage,
    date,
    lanes: lanes.join(", "),
    laneSections: createLaneSections(lanes),
  });
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function writeIfMissing(filePath, content, { overwrite = false } = {}) {
  if (!overwrite && fs.existsSync(filePath)) {
    return false;
  }
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

export function scaffoldChangeProcess({
  repoRoot = process.cwd(),
  changeId,
  displayName,
  stage = "proposal",
  overwrite = false,
  owner = "codex",
  lanes = ["frontend"],
} = {}) {
  if (!changeId) fail("Missing required option: changeId");
  if (!allowedStages.has(stage)) fail(`Invalid stage: ${stage}`);

  const normalizedLanes = normalizeLanes(lanes);
  const changeRoot = path.join(repoRoot, "openspec", "changes", changeId);
  if (!fs.existsSync(changeRoot) || !fs.statSync(changeRoot).isDirectory()) {
    fail(`Change directory does not exist: ${changeRoot}`);
  }

  const metadataPath = path.join(changeRoot, ".openspec.yaml");
  if (!fs.existsSync(metadataPath)) {
    fail(`Missing .openspec.yaml in change directory: ${changeRoot}`);
  }

  const processRoot = path.join(changeRoot, "process");
  ensureDirectory(processRoot);

  const resolvedName = normalizeDisplayName(displayName, changeId);
  const date = todayString();
  const workflowStatePath = path.join(processRoot, "workflow-state.md");
  const implementationReadinessPath = path.join(processRoot, "implementation-readiness.md");

  const workflowWritten = writeIfMissing(
    workflowStatePath,
    createWorkflowStateContent({
      repoRoot,
      displayName: resolvedName,
      changeId,
      stage,
      owner,
      date,
      lanes: normalizedLanes,
    }),
    { overwrite },
  );

  const readinessWritten = writeIfMissing(
    implementationReadinessPath,
    createImplementationReadinessContent({
      repoRoot,
      displayName: resolvedName,
      changeId,
      stage,
      date,
      lanes: normalizedLanes,
    }),
    { overwrite },
  );

  return {
    workflowStatePath,
    implementationReadinessPath,
    workflowWritten,
    readinessWritten,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    repoRoot: process.cwd(),
    changeId: null,
    displayName: null,
    stage: "proposal",
    overwrite: false,
    owner: "codex",
    lanes: ["frontend"],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--repo-root":
        options.repoRoot = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--change":
        options.changeId = argv[index + 1];
        index += 1;
        break;
      case "--name":
        options.displayName = argv[index + 1];
        index += 1;
        break;
      case "--stage":
        options.stage = argv[index + 1];
        index += 1;
        break;
      case "--owner":
        options.owner = argv[index + 1];
        index += 1;
        break;
      case "--lanes":
        options.lanes = normalizeLanes(argv[index + 1]);
        index += 1;
        break;
      case "--lane":
        options.lanes = normalizeLanes(argv[index + 1]);
        index += 1;
        break;
      case "--overwrite":
        options.overwrite = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        fail(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    const options = parseArgs();
    if (options.help) {
      console.log(
        "Usage: node scripts/scaffold-change-process.mjs --change <change-id> [--name <display-name>] [--stage <stage>] [--owner <owner>] [--lanes <frontend,backend-java,platform-docs,no-code,cross-platform>] [--overwrite] [--repo-root <path>]",
      );
      process.exit(0);
    }

    const result = scaffoldChangeProcess(options);
    console.log(`OK: ${result.workflowWritten ? "created" : "kept"} ${path.relative(options.repoRoot, result.workflowStatePath)}`);
    console.log(
      `OK: ${result.readinessWritten ? "created" : "kept"} ${path.relative(options.repoRoot, result.implementationReadinessPath)}`,
    );
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exit(1);
  }
}
