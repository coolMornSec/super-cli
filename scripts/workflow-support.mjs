import fs from "node:fs";
import path from "node:path";

export const orderedStages = [
  "brainstorming",
  "proposal",
  "specs",
  "design",
  "tasks",
  "writing-plans",
  "implementation",
  "code-review",
  "verification",
  "finish",
];

export const knownImplementationLanes = new Set(["frontend", "backend-java", "platform-docs", "no-code", "cross-platform"]);

export const fieldAliases = {
  Stage: ["Stage", "当前阶段"],
  Name: ["Name", "功能名称"],
  Slug: ["Slug", "功能标识"],
  "Change ID": ["Change ID", "当前 Change ID"],
  "Change Path": ["Change Path", "当前 Change 路径"],
  Owner: ["Owner", "负责人"],
  "Date Opened": ["Date Opened", "开始日期"],
  "Why this stage is active": ["Why this stage is active", "当前阶段原因"],
  "Required companion skills": ["Required companion skills", "必需协同技能"],
  "Implementation Lanes": ["Implementation Lanes", "实现 Lane", "Implementation Lane"],
  "Required Skills": ["Required Skills", "必要技能"],
  "Required Skills Loaded": ["Required Skills Loaded", "必要技能加载状态"],
  "Scenario Skills": ["Scenario Skills", "场景技能"],
  "Scenario Skills Loaded": ["Scenario Skills Loaded", "场景技能加载状态"],
  "Skill Loading Evidence": ["Skill Loading Evidence", "技能加载证据"],
  "Proposal Path": ["Proposal Path", "提案路径"],
  "Proposal Status": ["Proposal Status", "提案状态"],
  "Specs Path": ["Specs Path", "规格路径"],
  "Specs Status": ["Specs Status", "规格状态"],
  "Design Path": ["Design Path", "设计路径"],
  "Design Status": ["Design Status", "设计状态"],
  "Tasks Path": ["Tasks Path", "任务路径"],
  "Tasks Status": ["Tasks Status", "任务状态"],
  "Plan Path": ["Plan Path", "计划路径"],
  "Plan Status": ["Plan Status", "计划状态"],
  "Plan Review Mode": ["Plan Review Mode", "计划评审模式"],
  "Plan Review Evidence": ["Plan Review Evidence", "计划评审证据"],
  "User Confirmed Implementation": ["User Confirmed Implementation", "用户确认进入实现"],
  "Code Status": ["Code Status", "代码状态"],
  "Review Path": ["Review Path", "评审路径"],
  "Review Status": ["Review Status", "评审状态"],
  "Independent Review Mode": ["Independent Review Mode", "独立评审模式"],
  "Review Evidence": ["Review Evidence", "评审证据"],
  "User Confirmation": ["User Confirmation", "用户确认"],
  "May Proceed": ["May Proceed", "是否允许推进"],
  "Verification Path": ["Verification Path", "验证路径"],
  "Verification Status": ["Verification Status", "验证状态"],
  Blockers: ["Blockers", "阻塞项"],
  "Next Action": ["Next Action", "下一步动作"],
};

export function normalizeLanes(rawLanes) {
  if (!rawLanes) return ["frontend"];

  const values = Array.isArray(rawLanes) ? rawLanes : String(rawLanes).split(/[,\uFF0C]/);
  const lanes = [];
  for (const value of values) {
    const lane = value.trim();
    if (!lane) continue;
    if (!knownImplementationLanes.has(lane)) {
      throw new Error(`Unknown implementation lane: ${lane}`);
    }
    if (!lanes.includes(lane)) lanes.push(lane);
  }

  return lanes.length > 0 ? lanes : ["frontend"];
}

export function parseImplementationLanes(rawValue) {
  return normalizeLanes(rawValue);
}

export function parseBulletMap(markdown) {
  const result = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^- ([^:：]+)[：:]\s*(.*)$/);
    if (!match) continue;
    result.set(match[1].trim(), match[2].trim());
  }
  return result;
}

export function getBullet(bullets, fieldName) {
  const aliases = fieldAliases[fieldName] || [fieldName];
  for (const alias of aliases) {
    const value = bullets.get(alias);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

export function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

export function normalizeHeadingText(value) {
  return stripBom(value).trim().replace(/\s+/g, " ");
}

export function collectHeadings(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line, index) => {
      const match = stripBom(line).match(/^(#{1,6})\s+(.+?)\s*$/);
      if (!match) return null;
      return {
        level: match[1].length,
        text: normalizeHeadingText(match[2]),
        index,
      };
    })
    .filter(Boolean);
}

export function parseTaskProgress(markdown) {
  const matches = markdown.match(/^- \[( |x|X)\] .+$/gm) ?? [];
  const completed = matches.filter((line) => /^- \[(x|X)\] /.test(line)).length;
  return {
    total: matches.length,
    completed,
  };
}

export function toRepoPath(repoRoot, value) {
  return path.resolve(repoRoot, value);
}
