#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { runFrontendConventionChecks } from "./check-frontend-conventions.mjs";
import { runBackendConventionChecks } from "./check-backend-conventions.mjs";
import {
  collectHeadings,
  getBullet,
  orderedStages,
  parseBulletMap,
  parseImplementationLanes,
  parseTaskProgress,
  readFileSafe,
  toRepoPath,
} from "./workflow-support.mjs";

const defaultRepoRoot = process.cwd();

const requiredByStage = {
  proposal: ["Change ID", "Change Path", "Proposal Path"],
  specs: ["Change ID", "Change Path", "Proposal Path", "Specs Path"],
  design: ["Change ID", "Change Path", "Proposal Path", "Specs Path", "Design Path"],
  tasks: ["Change ID", "Change Path", "Proposal Path", "Specs Path", "Design Path", "Tasks Path"],
  "writing-plans": ["Change ID", "Change Path", "Proposal Path", "Specs Path", "Design Path", "Tasks Path", "Plan Path"],
  implementation: ["Change ID", "Change Path", "Proposal Path", "Specs Path", "Design Path", "Tasks Path", "Plan Path"],
  "code-review": ["Change ID", "Change Path", "Proposal Path", "Specs Path", "Design Path", "Tasks Path", "Plan Path", "Review Path"],
  verification: [
    "Change ID",
    "Change Path",
    "Proposal Path",
    "Specs Path",
    "Design Path",
    "Tasks Path",
    "Plan Path",
    "Review Path",
    "Verification Path",
  ],
  finish: [
    "Change ID",
    "Change Path",
    "Proposal Path",
    "Specs Path",
    "Design Path",
    "Tasks Path",
    "Plan Path",
    "Review Path",
    "Verification Path",
  ],
};

const readinessTitleAliases = new Set([
  "Feature Ready Record",
  "Implementation Readiness",
  "功能就绪记录",
  "实现就绪记录",
  "就绪记录",
]);

const readinessBaseSectionAliases = [
  ["工作区策略", "Workspace Strategy"],
  ["环境前置", "Environment Prerequisites"],
  ["人工确认与独立评审适配", "Human Confirmation and Independent Review Adapter"],
  ["需求-测试矩阵", "Requirements-Test Matrix"],
  ["确认结论", "Confirmation"],
];

const readinessOptionalCommonSectionAliases = [["通用实现约束", "Common Task Closure"]];

const readinessLaneSectionAliases = {
  frontend: [["前端实现约束", "Frontend Implementation Constraints", "前端任务收口", "Frontend Task Closure"]],
  "backend-java": [["后端 Java 实现约束", "Backend Java Implementation Constraints", "后端 Java 任务收口", "Backend Java Task Closure", "后端任务收口", "Backend Task Closure"]],
};

const workflowStateRequiredSectionAliases = [
  ["Current Stage", "当前阶段"],
  ["Loaded Workflow Rules", "已加载工作流规则"],
  ["OpenSpec Status", "OpenSpec 状态"],
  ["Delivery Status", "交付状态"],
  ["Test Budget", "测试预算"],
  ["Skill Evidence", "技能证据"],
  ["Coordination", "协调"],
];

const requiredReadinessFieldsForImplementation = [
  "Plan Review Mode",
  "Plan Review Evidence",
  "User Confirmed Implementation",
  "Independent Review Mode",
  "Reviewer / Verifier",
  "Review Evidence",
  "User Confirmation",
  "May Proceed",
  "TDD Exception",
  "OpenSpec 完整性",
  "正式计划状态",
  "门禁状态",
  "是否允许进入 `implementation`",
];

function getChangeWorkflowPaths(repoRoot = defaultRepoRoot, changeId) {
  const changeRoot = path.join(repoRoot, "openspec", "changes", changeId);
  return {
    mode: "change-scoped",
    changeRoot,
    workflowStatePath: path.join(changeRoot, "process", "workflow-state.md"),
    implementationReadinessPath: path.join(changeRoot, "process", "implementation-readiness.md"),
    npmrcPath: path.join(repoRoot, ".npmrc"),
    frontendConventionScriptPath: path.join(repoRoot, "scripts", "check-frontend-conventions.mjs"),
    backendConventionScriptPath: path.join(repoRoot, "scripts", "check-backend-conventions.mjs"),
  };
}

function getWorkflowPaths(repoRoot = defaultRepoRoot, changeId = null) {
  if (!changeId) {
    throw new Error("Missing required argument: --change <change-id>");
  }
  return getChangeWorkflowPaths(repoRoot, changeId);
}

function parseCliArgs(argv = process.argv.slice(2)) {
  const options = {
    repoRoot: process.cwd(),
    changeId: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--change") {
      options.changeId = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--repo-root") {
      options.repoRoot = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function isBlank(value) {
  return !value || value === "Pending" || value === "None" || value === "pending" || value === "待确认" || value === "待补齐";
}

function isPendingOrNegative(value) {
  if (isBlank(value)) return true;
  return /^(pending|no|false|否|待|未)/i.test(value.trim());
}

function isAffirmativeLoaded(value) {
  if (isPendingOrNegative(value)) return false;
  return /^(yes|loaded|true|是|已加载)/i.test(value.trim());
}

function findHeadingIndex(headings, aliases) {
  return headings.find((heading) => heading.level === 2 && aliases.includes(heading.text))?.index;
}

function validateImplementationReadinessFields(readiness, reportFail) {
  const fields = parseBulletMap(readiness);
  let valid = true;

  for (const fieldName of requiredReadinessFieldsForImplementation) {
    const value = fields.get(fieldName);
    const blank = fieldName === "TDD Exception" ? !value : isBlank(value);
    if (!fields.has(fieldName) || blank) {
      reportFail(`implementation-readiness.md 缺少必填字段：${fieldName}`);
      valid = false;
    }
  }

  return valid;
}

function validateImplementationReadinessTemplate(
  filePath,
  { lanes = ["frontend"], ok: reportOk = console.log, fail: reportFail = console.error } = {},
) {
  const readiness = readFileSafe(filePath);
  if (!readiness) {
    reportFail(`缺少 implementation-readiness 记录：${filePath}`);
    return false;
  }

  const headings = collectHeadings(readiness);
  const topLevelHeading = headings.find((heading) => heading.level === 1);
  if (!topLevelHeading) {
    reportFail("implementation-readiness.md must include a level-1 heading");
    return false;
  }

  if (!readinessTitleAliases.has(topLevelHeading.text)) {
    reportFail("implementation-readiness.md must use an accepted readiness title");
    return false;
  }

  const expectedSequence = [
    readinessBaseSectionAliases[0],
    readinessBaseSectionAliases[1],
    ...readinessOptionalCommonSectionAliases.filter((aliases) => findHeadingIndex(headings, aliases) !== undefined),
    ...lanes.flatMap((lane) => readinessLaneSectionAliases[lane] ?? []),
    readinessBaseSectionAliases[2],
    readinessBaseSectionAliases[3],
  ];

  let previousIndex = topLevelHeading.index;
  for (const aliases of expectedSequence) {
    const sectionIndex = findHeadingIndex(headings, aliases);
    if (sectionIndex === undefined) {
      reportFail(`implementation-readiness.md is missing required section: ${aliases.join(" / ")}`);
      return false;
    }
    if (sectionIndex < previousIndex) {
      reportFail(`implementation-readiness.md section order is invalid near: ${aliases[0]}`);
      return false;
    }
    previousIndex = sectionIndex;
  }

  if (!validateImplementationReadinessFields(readiness, reportFail)) {
    return false;
  }

  reportOk("implementation-readiness.md 模板结构检查通过");
  return true;
}

function validateChangePath(repoRoot, changePath, { ok, fail }) {
  const resolvedPath = toRepoPath(repoRoot, changePath);
  if (!fs.existsSync(resolvedPath)) {
    fail(`当前 Change 路径不存在：${changePath}`);
    return null;
  }

  if (!fs.statSync(resolvedPath).isDirectory()) {
    fail(`当前 Change 路径必须是目录：${changePath}`);
    return null;
  }

  const metadataPath = path.join(resolvedPath, ".openspec.yaml");
  if (!fs.existsSync(metadataPath)) {
    fail(`当前 Change 路径缺少 .openspec.yaml：${changePath}`);
    return null;
  }

  ok("当前 Change 路径存在且包含 .openspec.yaml");
  return resolvedPath;
}

function ensurePathInsideChange(changeRoot, targetPath, label, { ok, fail }) {
  const relative = path.relative(changeRoot, targetPath);
  const outside = relative.startsWith("..") || path.isAbsolute(relative);
  if (outside) {
    fail(`${label} 必须位于当前 Change 路径中`);
    return false;
  }
  ok(`${label} 位于当前 Change 路径中`);
  return true;
}

function validateSpecsPath(repoRoot, specsPath, changeRoot, { ok, fail }) {
  const resolvedPath = toRepoPath(repoRoot, specsPath);
  if (!fs.existsSync(resolvedPath)) {
    fail(`Specs Path 指向的目录不存在：${specsPath}`);
    return false;
  }

  if (!fs.statSync(resolvedPath).isDirectory()) {
    fail(`Specs Path 必须是目录：${specsPath}`);
    return false;
  }

  ensurePathInsideChange(changeRoot, resolvedPath, "Specs Path", { ok, fail });

  const collected = [];
  const stack = [resolvedPath];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const nextPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(nextPath);
        continue;
      }
      if (entry.isFile() && entry.name === "spec.md") {
        collected.push(nextPath);
      }
    }
  }

  if (collected.length === 0) {
    fail(`Specs Path 下至少需要一个 spec.md：${specsPath}`);
    return false;
  }

  ok(`Specs Path 下已找到 ${collected.length} 个 spec.md`);
  return true;
}

export function runWorkflowChecks({
  repoRoot = process.cwd(),
  changeId = null,
  stdout = console.log,
  stderr = console.error,
} = {}) {
  const {
    mode,
    changeRoot: scopedChangeRoot,
    workflowStatePath,
    implementationReadinessPath,
    npmrcPath,
    frontendConventionScriptPath,
    backendConventionScriptPath,
  } = getWorkflowPaths(repoRoot, changeId);

  let hasFailures = false;
  const ok = (message) => stdout(`OK: ${message}`);
  const fail = (message) => {
    hasFailures = true;
    stderr(`FAIL: ${message}`);
  };

  const workflowState = readFileSafe(workflowStatePath);
  if (!workflowState) {
    fail(`缺少 workflow-state：${workflowStatePath}`);
    return false;
  }

  const bullets = parseBulletMap(workflowState);
  const stage = getBullet(bullets, "Stage");
  if (!stage) {
    fail("workflow-state.md 缺少 Stage 字段");
    return false;
  }
  if (!orderedStages.includes(stage)) {
    fail(`Stage 必须是以下值之一：${orderedStages.join(", ")}`);
    return false;
  }
  ok(`当前阶段为 '${stage}'`);

  const implementationLanes = parseImplementationLanes(getBullet(bullets, "Implementation Lanes"));
  ok(`当前实现 lane：${implementationLanes.join(", ")}`);

  const stageIndex = orderedStages.indexOf(stage);
  const implementationStageIndex = orderedStages.indexOf("implementation");
  const verificationStageIndex = orderedStages.indexOf("verification");

  const headings = collectHeadings(workflowState);
  const workflowSectionAliases = workflowStateRequiredSectionAliases.filter((aliases) => aliases.length > 0);
  let previousSectionIndex = headings.find((heading) => heading.level === 1)?.index ?? -1;
  for (const aliases of workflowSectionAliases) {
    const sectionIndex = findHeadingIndex(headings, aliases);
    if (sectionIndex === undefined) {
      fail(`workflow-state.md is missing required section: ${aliases.join(" / ")}`);
      continue;
    }
    if (sectionIndex < previousSectionIndex) {
      fail(`workflow-state.md section order is invalid near: ${aliases[0]}`);
    }
    previousSectionIndex = sectionIndex;
  }

  const name = getBullet(bullets, "Name");
  const slug = getBullet(bullets, "Slug");
  const stateChangeId = getBullet(bullets, "Change ID");
  const changePath = getBullet(bullets, "Change Path");

  if (isBlank(name)) fail("功能名称缺失");
  else ok("功能名称已填写");
  if (isBlank(slug)) fail("功能标识缺失");
  else ok("功能标识已填写");
  if (isBlank(stateChangeId)) fail("当前 Change ID 缺失");
  else ok("当前 Change ID 已填写");
  if (isBlank(changePath)) fail("当前 Change 路径缺失");
  else ok("当前 Change 路径已填写");

  for (const field of ["Required companion skills", "Why this stage is active"]) {
    const value = getBullet(bullets, field);
    if (isBlank(value)) {
      fail(`${field} 必须填写`);
    } else {
      ok(`${field} 已填写`);
    }
  }

  const requiredSkillNames = [
    "magus-pattern-guard",
    "magus-workflow-orchestrator",
    "L4-standard-dev",
    "l4-execution-adapter",
    "magus-workflow-governance",
    "magus-base-standards",
  ];
  const requiredSkillsValue = getBullet(bullets, "Required Skills");
  if (isBlank(requiredSkillsValue)) {
    fail("workflow-state.md 必须记录 Required Skills");
  } else {
    for (const skillName of requiredSkillNames) {
      if (!requiredSkillsValue.includes(skillName)) {
        fail(`Required Skills 缺少必要技能：${skillName}`);
      }
    }
    ok("Required Skills 已记录必要 L4 技能");
  }

  const requiredSkillsLoaded = getBullet(bullets, "Required Skills Loaded");
  if (!isAffirmativeLoaded(requiredSkillsLoaded)) {
    fail("Required Skills Loaded 必须明确记录为已加载");
  } else {
    ok("Required Skills Loaded 已确认");
  }

  const scenarioSkillsValue = getBullet(bullets, "Scenario Skills");
  if (isBlank(scenarioSkillsValue)) {
    fail("workflow-state.md 必须记录 Scenario Skills");
  } else {
    ok("Scenario Skills 已记录");
  }

  const scenarioSkillsLoaded = getBullet(bullets, "Scenario Skills Loaded");
  if (isBlank(scenarioSkillsLoaded)) {
    fail("Scenario Skills Loaded 必须填写");
  } else if (stageIndex >= implementationStageIndex && !isAffirmativeLoaded(scenarioSkillsLoaded) && !/^(not applicable|n\/a|不适用)/i.test(scenarioSkillsLoaded)) {
    fail("进入 implementation 或后续阶段前，Scenario Skills Loaded 必须明确记录为已加载或不适用");
  } else {
    ok("Scenario Skills Loaded 已记录");
  }

  const skillLoadingEvidence = getBullet(bullets, "Skill Loading Evidence");
  if (isBlank(skillLoadingEvidence)) {
    fail("Skill Loading Evidence 必须填写");
  } else {
    ok("Skill Loading Evidence 已记录");
  }

  const evidenceLogHeading = findHeadingIndex(headings, ["Evidence Log", "证据日志"]);
  if (evidenceLogHeading === undefined) {
    fail("workflow-state.md 缺少 Evidence Log 章节");
  } else {
    ok("Evidence Log 章节已存在");
  }

  let resolvedChangeRoot = null;
  if (!isBlank(changePath)) {
    resolvedChangeRoot = validateChangePath(repoRoot, changePath, { ok, fail });
  }

  if (changeId && !isBlank(stateChangeId) && stateChangeId !== changeId) {
    fail(`CLI 传入的 change-id 与 workflow-state.md 记录的 Change ID 不一致：${changeId} !== ${stateChangeId}`);
  }

  if (mode === "change-scoped") {
    if (!fs.existsSync(scopedChangeRoot)) {
      fail(`当前 change 工作区不存在：${path.relative(repoRoot, scopedChangeRoot)}`);
    } else {
      ok("当前 change 工作区存在");
      if (resolvedChangeRoot && path.resolve(resolvedChangeRoot) !== path.resolve(scopedChangeRoot)) {
        fail(`workflow-state.md 记录的 Change Path 与 --change ${changeId} 不一致：${changePath}`);
      }
      ensurePathInsideChange(scopedChangeRoot, workflowStatePath, "workflow-state.md", { ok, fail });
    }
  }

  if (fs.existsSync(implementationReadinessPath)) {
    validateImplementationReadinessTemplate(implementationReadinessPath, {
      lanes: implementationLanes,
      ok,
      fail,
    });
    if (mode === "change-scoped" && fs.existsSync(scopedChangeRoot)) {
      ensurePathInsideChange(scopedChangeRoot, implementationReadinessPath, "implementation-readiness.md", { ok, fail });
    }
  } else if (stageIndex >= implementationStageIndex) {
    fail(`缺少 implementation-readiness：${implementationReadinessPath}`);
  }

  let resolvedTasksPath = null;
  for (const [requiredStage, fields] of Object.entries(requiredByStage)) {
    const requiredStageIndex = orderedStages.indexOf(requiredStage);
    if (stageIndex < requiredStageIndex) continue;

    for (const field of fields) {
      const value = getBullet(bullets, field);
      if (isBlank(value)) {
        fail(`进入 '${requiredStage}' 阶段后必须填写 ${field}`);
        continue;
      }

      if (field === "Change ID" || field === "Change Path") {
        continue;
      }

      if (field === "Specs Path") {
        if (resolvedChangeRoot) {
          validateSpecsPath(repoRoot, value, resolvedChangeRoot, { ok, fail });
        }
        continue;
      }

      const resolvedPath = toRepoPath(repoRoot, value);
      if (!fs.existsSync(resolvedPath)) {
        fail(`${field} 指向的文件不存在：${value}`);
      } else {
        ok(`${field} 对应文件存在`);
        if (field === "Tasks Path") {
          resolvedTasksPath = resolvedPath;
        }
        if (resolvedChangeRoot && ["Proposal Path", "Design Path", "Tasks Path"].includes(field)) {
          ensurePathInsideChange(resolvedChangeRoot, resolvedPath, field, { ok, fail });
        }
      }
    }
  }

  const planStatus = getBullet(bullets, "Plan Status");
  if (stageIndex >= implementationStageIndex) {
    const planReviewMode = getBullet(bullets, "Plan Review Mode");
    const planReviewEvidence = getBullet(bullets, "Plan Review Evidence");
    const userConfirmedImplementation = getBullet(bullets, "User Confirmed Implementation");

    if (isBlank(planReviewMode)) {
      fail("进入 implementation 前必须记录 Plan Review Mode");
    } else if (!/^(subagent|human|人工|外部|独立)/i.test(planReviewMode.trim())) {
      fail("Plan Review Mode 必须是 subagent 或 human；blocked 状态不得进入 implementation");
    } else {
      ok("Plan Review Mode 已记录");
    }

    if (isBlank(planReviewEvidence)) {
      fail("进入 implementation 前必须记录 Plan Review Evidence");
    } else {
      ok("Plan Review Evidence 已记录");
    }

    if (!isAffirmativeLoaded(userConfirmedImplementation)) {
      fail("进入 implementation 前必须记录 User Confirmed Implementation: yes");
    } else {
      ok("User Confirmed Implementation 已确认");
    }
  }

  if (stageIndex >= orderedStages.indexOf("code-review")) {
    const independentReviewMode = getBullet(bullets, "Independent Review Mode");
    if (isBlank(independentReviewMode)) {
      fail("进入 code-review 前必须记录 Independent Review Mode");
    } else if (!/^(subagent|human|blocked|人工|外部|独立)/i.test(independentReviewMode.trim())) {
      fail("Independent Review Mode 必须是 subagent、human 或 blocked");
    } else {
      ok("Independent Review Mode 已记录");
    }
  }

  if (stageIndex >= verificationStageIndex) {
    const reviewEvidence = getBullet(bullets, "Review Evidence");
    const mayProceed = getBullet(bullets, "May Proceed");

    if (isBlank(reviewEvidence)) {
      fail("进入 verification 前必须记录 Review Evidence");
    } else {
      ok("Review Evidence 已记录");
    }

    if (!isAffirmativeLoaded(mayProceed)) {
      fail("进入 verification 前必须记录 May Proceed: yes");
    } else {
      ok("May Proceed 已确认");
    }
  }

  if (resolvedTasksPath) {
    const taskProgress = parseTaskProgress(readFileSafe(resolvedTasksPath) ?? "");
    if (taskProgress.total === 0) {
      fail(`当前 change 的 tasks.md 缺少可追踪任务项：${getBullet(bullets, "Tasks Path")}`);
    } else {
      ok(`当前 change tasks.md 已解析：${taskProgress.completed}/${taskProgress.total} 完成`);
    }

    if (planStatus === "completed" && taskProgress.completed === 0) {
      fail("Plan Status 已完成，但当前 change tasks.md 仍为 0 项完成");
    }

    if (stageIndex >= implementationStageIndex && taskProgress.completed === 0) {
      fail(`进入 '${stage}' 阶段前，当前 change tasks.md 至少需要 1 项已完成任务`);
    }
  }

  const codeStatus = getBullet(bullets, "Code Status");
  if (stageIndex >= orderedStages.indexOf("code-review") && (!codeStatus || codeStatus === "pending")) {
    fail(`进入 '${stage}' 阶段后 Code Status 不能仍为 pending`);
  }

  const requiredSkills = getBullet(bullets, "Required companion skills") || "";
  const mentionsFrontend = implementationLanes.includes("frontend") || /mg-frontend-vue-guide|mg-framework-ui/.test(requiredSkills);
  const mentionsBackend = implementationLanes.includes("backend-java");
  const includesCrossPlatformLane = implementationLanes.includes("cross-platform");
  const includesPlatformDocsLane = implementationLanes.includes("platform-docs");
  const includesNoCodeLane = implementationLanes.includes("no-code");
  const requiresFrontendRuntimeChecks =
    (mentionsFrontend || includesCrossPlatformLane) && !includesPlatformDocsLane && !includesNoCodeLane;
  const requiresBackendRuntimeChecks = mentionsBackend || includesCrossPlatformLane;

  if (requiresFrontendRuntimeChecks) {
    const npmrc = readFileSafe(npmrcPath);
    if (!npmrc) {
      fail("检测到前端 lane，但根目录缺少 .npmrc");
    } else {
      const hasPublic = npmrc.includes("registry=https://registry.npmmirror.com/");
      const hasPrivate = npmrc.includes("@magustek:registry=https://nexus.magustek.com/repository/npm-magus/");
      if (!hasPublic || !hasPrivate) {
        fail(".npmrc 存在，但缺少必需的 Magustek registry 配置");
      } else {
        ok(".npmrc 已包含必需的 Magustek registry 配置");
      }
    }
  } else if (includesPlatformDocsLane || includesNoCodeLane) {
    ok("当前为 platform-docs / no-code lane，跳过前端运行时环境检查");
  }

  if (stageIndex >= verificationStageIndex) {
    if (requiresFrontendRuntimeChecks) {
      if (!fs.existsSync(frontendConventionScriptPath)) {
        fail(`缺少前端规范检查脚本：${frontendConventionScriptPath}`);
      } else {
        ok("前端规范检查脚本存在");
        const passed = runFrontendConventionChecks({ repoRoot, stdout, stderr });
        if (!passed) {
          fail("前端规范检查未通过");
        } else {
          ok("前端规范检查已通过");
        }
      }
    }

    if (requiresBackendRuntimeChecks) {
      if (!fs.existsSync(backendConventionScriptPath)) {
        fail(`缺少后端规范检查脚本：${backendConventionScriptPath}`);
      } else {
        ok("后端规范检查脚本存在");
        const passed = runBackendConventionChecks({ repoRoot, changeId, stdout, stderr });
        if (!passed) {
          fail("后端规范检查未通过");
        } else {
          ok("后端规范检查已通过");
        }
      }
    }

    if (includesPlatformDocsLane || includesNoCodeLane) {
      ok("当前为 platform-docs / no-code lane，verification 阶段不要求前后端规范检查");
    }
    if (includesCrossPlatformLane) {
      ok("当前为 cross-platform lane，verification 阶段会按前后端共同约束检查");
    }
  }

  if (!hasFailures) {
    stdout("PASS: 工作流状态满足当前阶段要求");
  }
  return !hasFailures;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    const options = parseCliArgs();
    if (options.help) {
      console.log("Usage: node scripts/check-workflow.mjs --change <change-id> [--repo-root <path>]");
      process.exitCode = 0;
    } else {
      process.exitCode = runWorkflowChecks(options) ? 0 : 1;
    }
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
