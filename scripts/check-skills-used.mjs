#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getBullet, orderedStages, parseBulletMap, readFileSafe } from "./workflow-support.mjs";

const requiredSkillNames = [
  "magus-pattern-guard",
  "magus-workflow-orchestrator",
  "magus-workflow-orchestrator/levels/L4-standard-dev.md",
  "docs/process/l4-execution-adapter.md",
  "magus-workflow-governance",
  "magus-base-standards",
];

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    repoRoot: process.cwd(),
    changeId: null,
    format: "text",
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
    if (arg === "--format") {
      options.format = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!["text", "json"].includes(options.format)) {
    throw new Error(`Invalid format: ${options.format}`);
  }
  return options;
}

function listChangeIds(repoRoot) {
  const changesRoot = path.join(repoRoot, "openspec", "changes");
  if (!fs.existsSync(changesRoot)) return [];
  return fs
    .readdirSync(changesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function hasUsefulValue(value) {
  return Boolean(value && value.trim() && !/^(pending|none|no|false|待|未|否)/i.test(value.trim()));
}

function findSkillSection(log, skillName) {
  const escaped = skillName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return log.match(new RegExp(`###\\s+${escaped}[\\s\\S]*?(?=\\n###\\s+|\\n##\\s+|$)`))?.[0] ?? "";
}

function includesEvidence(log, skillName, fieldName) {
  const section = findSkillSection(log, skillName);
  if (!section) return false;
  const field = section.match(new RegExp(`- ${fieldName}:\\s*(.+)`));
  return Boolean(field && hasUsefulValue(field[1]));
}

function decisionPasses(markdown) {
  return /- Decision:\s*(pass|conditional-pass)/i.test(markdown);
}

function addStageGateFindings({ changeRoot, stage, findings }) {
  const stageIndex = orderedStages.indexOf(stage);
  if (stageIndex >= orderedStages.indexOf("verification")) {
    const reviewPath = path.join(changeRoot, "process", "review.md");
    const review = readFileSafe(reviewPath);
    if (!review) {
      findings.push({ severity: "fail", blocking: true, message: `Missing review record: ${reviewPath}` });
    } else if (!decisionPasses(review)) {
      findings.push({ severity: "fail", blocking: true, message: `Review decision does not allow progress: ${reviewPath}` });
    }
  }

  if (stageIndex >= orderedStages.indexOf("finish")) {
    const verificationPath = path.join(changeRoot, "process", "verification.md");
    const verification = readFileSafe(verificationPath);
    if (!verification) {
      findings.push({ severity: "fail", blocking: true, message: `Missing verification record: ${verificationPath}` });
    } else if (!decisionPasses(verification)) {
      findings.push({ severity: "fail", blocking: true, message: `Verification decision does not allow finish: ${verificationPath}` });
    }
  }
}

function checkOneChange(repoRoot, changeId) {
  const changeRoot = path.join(repoRoot, "openspec", "changes", changeId);
  const workflowPath = path.join(changeRoot, "process", "workflow-state.md");
  const skillLogPath = path.join(changeRoot, "process", "skill-usage-log.md");
  const findings = [];
  const skills = [];

  const workflowState = readFileSafe(workflowPath);
  if (!workflowState) {
    findings.push({ severity: "fail", blocking: true, message: `Missing workflow-state: ${workflowPath}` });
    return { changeId, status: "fail", blocking: true, findings, skills };
  }

  const bullets = parseBulletMap(workflowState);
  const stage = getBullet(bullets, "Stage");
  if (!stage || !orderedStages.includes(stage)) {
    findings.push({ severity: "fail", blocking: true, message: `Invalid or missing Stage in ${workflowPath}` });
  }

  const requiredSkills = getBullet(bullets, "Required Skills") || "";
  const skillLog = readFileSafe(skillLogPath);
  if (!skillLog) {
    findings.push({ severity: "fail", blocking: true, message: `Missing skill usage log: ${skillLogPath}` });
  }

  for (const skillName of requiredSkillNames) {
    const declared = requiredSkills.includes(skillName);
    const readEvidence = skillLog ? includesEvidence(skillLog, skillName, "Read Evidence") : false;
    const appliedEvidence = skillLog
      ? includesEvidence(skillLog, skillName, "Applied To") && includesEvidence(skillLog, skillName, "Decision / Action")
      : false;
    const effectEvidence = skillLog ? includesEvidence(skillLog, skillName, "Effect Evidence") : false;
    const statusEvidence = skillLog ? includesEvidence(skillLog, skillName, "Status") : false;
    const status = declared && readEvidence && appliedEvidence && effectEvidence ? (statusEvidence ? "pass" : "warn") : "fail";

    skills.push({ skillName, declared, readEvidence, appliedEvidence, effectEvidence, statusEvidence, status });

    if (!declared) findings.push({ severity: "fail", blocking: true, skillName, message: `Required Skills missing ${skillName}` });
    if (skillLog && !readEvidence) findings.push({ severity: "fail", blocking: true, skillName, message: `Missing read evidence for ${skillName}` });
    if (skillLog && !appliedEvidence) {
      findings.push({ severity: "fail", blocking: true, skillName, message: `Missing applied evidence for ${skillName}` });
    }
    if (skillLog && !effectEvidence) {
      findings.push({ severity: "fail", blocking: true, skillName, message: `Missing effect evidence for ${skillName}` });
    }
    if (skillLog && declared && readEvidence && appliedEvidence && effectEvidence && !statusEvidence) {
      findings.push({ severity: "warn", blocking: false, skillName, message: `Missing status evidence for ${skillName}` });
    }
  }

  if (stage && orderedStages.includes(stage)) {
    addStageGateFindings({ changeRoot, stage, findings });
  }

  const blocking = findings.some((finding) => finding.blocking);
  return { changeId, status: blocking ? "fail" : "pass", blocking, findings, skills };
}

function renderText(report, stdout, stderr) {
  for (const change of report.changes) {
    stdout(`Change: ${change.changeId}`);
    stdout(`Status: ${change.status}`);
    for (const skill of change.skills) {
      stdout(`- ${skill.skillName}: ${skill.status}`);
    }
    for (const finding of change.findings) {
      const write = finding.severity === "fail" ? stderr : stdout;
      write(`${finding.severity.toUpperCase()}: ${finding.message}`);
    }
  }
  if (report.status === "pass") stdout("PASS: skill usage evidence satisfies current requirements");
}

export function runSkillUsageChecks({
  repoRoot = process.cwd(),
  changeId = null,
  format = "text",
  stdout = console.log,
  stderr = console.error,
} = {}) {
  if (!["text", "json"].includes(format)) throw new Error(`Invalid format: ${format}`);

  const changeIds = changeId ? [changeId] : listChangeIds(repoRoot);
  const changes = changeIds.map((id) => checkOneChange(repoRoot, id));
  const findings = changes.flatMap((change) => change.findings.map((finding) => ({ changeId: change.changeId, ...finding })));
  const blocking = findings.some((finding) => finding.blocking);
  const report = {
    status: blocking ? "fail" : "pass",
    findings,
    changes,
    skills: changes.flatMap((change) => change.skills.map((skill) => ({ changeId: change.changeId, ...skill }))),
    blocking,
  };

  if (format === "json") {
    stdout(JSON.stringify(report, null, 2));
  } else {
    renderText(report, stdout, stderr);
  }

  return { passed: !blocking, exitCode: blocking ? 1 : 0, report };
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    const options = parseArgs();
    if (options.help) {
      console.log("Usage: node scripts/check-skills-used.mjs [--change <change-id>] [--repo-root <path>] [--format text|json]");
      process.exitCode = 0;
    } else {
      process.exitCode = runSkillUsageChecks(options).exitCode;
    }
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 2;
  }
}
