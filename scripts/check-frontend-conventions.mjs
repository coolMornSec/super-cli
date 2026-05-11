#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function walkVueFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkVueFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".vue")) {
      results.push(fullPath);
    }
  }
  return results;
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toRelative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

function collectMatches(regex, text) {
  const matches = [];
  for (const match of text.matchAll(regex)) {
    matches.push(match);
  }
  return matches;
}

function toKebabCaseTag(componentName) {
  return componentName
    .replace(/^Mg/, "mg-")
    .replace(/^El/, "el-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function extractMarkdownSection(text, headingAliases) {
  const aliases = new Set(headingAliases);
  const lines = text.split(/\r?\n/);
  const buffer = [];
  let collecting = false;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      if (collecting) {
        break;
      }
      if (aliases.has(headingMatch[1])) {
        collecting = true;
      }
      continue;
    }

    if (collecting) {
      buffer.push(line);
    }
  }

  return collecting ? buffer.join("\n") : null;
}

function parseMarkdownTableRows(sectionText) {
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .filter((line) => !/^\|\s*-/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

function loadFrameworkUiSkillText(repoRoot) {
  const skillPath = path.join(repoRoot, ".agents", "skills", "mg-framework-ui", "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    return null;
  }

  return read(skillPath);
}

function loadFrameworkUiReplacementRules(repoRoot) {
  const skillText = loadFrameworkUiSkillText(repoRoot);
  if (!skillText) {
    return [];
  }

  const sectionText = extractMarkdownSection(skillText, ["通用组件索引"]);
  if (!sectionText) {
    return [];
  }

  return parseMarkdownTableRows(sectionText)
    .map((cells) => {
      const mgComponent = cells[0]?.match(/`([^`]+)`/)?.[1];
      const elementComponent = cells[1]?.match(/`([^`]+)`/)?.[1];
      if (!mgComponent || !elementComponent || !elementComponent.startsWith("El")) {
        return null;
      }

      return {
        elementComponent,
        expected: mgComponent,
      };
    })
    .filter(Boolean);
}

function hasComponentTag(text, componentName) {
  const pascalTag = componentName;
  const kebabTag = toKebabCaseTag(componentName);
  return new RegExp(`<${escapeRegExp(pascalTag)}(?=[\\s>/])`, "i").test(text)
    || new RegExp(`<${escapeRegExp(kebabTag)}(?=[\\s>/])`, "i").test(text);
}

function hasMgTableContainer(text) {
  return /<(?:Mg[A-Za-z0-9-]*Table|mg-[a-z0-9-]*table)(?=[\s>/])/i.test(text);
}

export function runFrontendConventionChecks({
  repoRoot = process.cwd(),
  stdout = console.log,
  stderr = console.error,
} = {}) {
  const frontendSrcRoot = path.join(repoRoot, "packages", "frontend-vue", "src");
  let hasFailures = false;
  const pass = (message) => stdout(`OK: ${message}`);
  const warn = (message) => stdout(`WARN: ${message}`);
  const failCheck = (message) => {
    hasFailures = true;
    stderr(`FAIL: ${message}`);
  };

  if (!fs.existsSync(frontendSrcRoot)) {
    pass("packages/frontend-vue/src not present, skipping frontend convention checks");
    return true;
  }

  const vueFiles = walkVueFiles(frontendSrcRoot);
  if (vueFiles.length === 0) {
    pass("No Vue SFC files found, skipping frontend convention checks");
    return true;
  }

  const forbiddenElementPlusOverrides = loadFrameworkUiReplacementRules(repoRoot);
  const frameworkUiSkillText = loadFrameworkUiSkillText(repoRoot);
  const degradedImplementationHints =
    /\b(lightweight|minimal(?:\s+implementation)?|placeholder\s+ui|temporary\s+table|just\s+to\s+pass)\b/i;

  for (const filePath of vueFiles) {
    const relativePath = toRelative(repoRoot, filePath);
    const text = read(filePath);
    const isPageOrComponent =
      relativePath.includes("/src/pages/") || relativePath.includes("/src/components/");

    if (/<table\b/i.test(text)) {
      failCheck(`${relativePath} uses native <table>; business data tables must use MgTable`);
    } else {
      pass(`${relativePath} does not use native <table>`);
    }

    if (isPageOrComponent) {
      for (const match of collectMatches(/<input\b([^>]*)>/gi, text)) {
        const attrs = match[1] || "";
        const typeMatch = attrs.match(/type\s*=\s*["']([^"']+)["']/i);
        const inputType = (typeMatch?.[1] || "text").toLowerCase();
        const allowedNativeInputTypes = new Set(["file", "hidden"]);
        if (!allowedNativeInputTypes.has(inputType)) {
          failCheck(
            `${relativePath} uses native <input type="${inputType}">; use Mg* or Element Plus controls instead`,
          );
        }
      }

      if (/<select\b/i.test(text)) {
        failCheck(`${relativePath} uses native <select>; use Mg* or Element Plus selects instead`);
      }
      if (/<textarea\b/i.test(text)) {
        failCheck(`${relativePath} uses native <textarea>; use Mg* or Element Plus textareas instead`);
      }
      if (/<button\b/i.test(text)) {
        failCheck(`${relativePath} uses native <button>; use MgButton instead`);
      }
    }

    for (const rule of forbiddenElementPlusOverrides) {
      if (hasComponentTag(text, rule.elementComponent)) {
        failCheck(`${relativePath} uses an Element Plus component that must be replaced by ${rule.expected}`);
      }
    }

    if (degradedImplementationHints.test(text)) {
      failCheck(`${relativePath} contains degraded implementation wording`);
    }

    if (relativePath.includes("/src/pages/")) {
      if (/definePage\s*\(\s*\{[\s\S]*?\bmeta\s*:\s*\{[\s\S]*?\blayout\s*:\s*["']default["']/m.test(text)) {
        failCheck(`${relativePath} redundantly declares the default layout; pages already default to layout "default"`);
      }

      const usesMgTable = hasComponentTag(text, "MgTable");
      const usesMgToolbar = hasComponentTag(text, "MgToolbar");
      const usesMgSearch = hasComponentTag(text, "MgSearch");
      const hasPaginationPattern =
        /v-model:current-page|v-model:page-size|@paging-change/i.test(text)
        || hasComponentTag(text, "MgPaging")
        || hasComponentTag(text, "ElPagination");
      const hasSearchPattern = usesMgSearch || hasComponentTag(text, "ElFormItem");
      const manualListSignals = [];
      if (usesMgToolbar) manualListSignals.push("toolbar");
      if (hasSearchPattern) manualListSignals.push("search");
      if (hasPaginationPattern) manualListSignals.push("pagination");
      if (usesMgTable) manualListSignals.push("table");

      const hasHandAssembledListLayout =
        manualListSignals.includes("table")
        && manualListSignals.includes("pagination")
        && (manualListSignals.includes("search") || manualListSignals.includes("toolbar"));

      if (frameworkUiSkillText && hasHandAssembledListLayout) {
        const distinctSignals = Array.from(new Set(manualListSignals));
        warn(
          `${relativePath} looks like a hand-assembled list page (${distinctSignals.join(", ")}); before coding, confirm candidate component capability boundaries and record why this composition is the right fit`,
        );
      }

      if (hasComponentTag(text, "ElTableColumn") && !hasMgTableContainer(text)) {
        failCheck(`${relativePath} uses el-table-column without an Mg*Table container`);
      }
    }
  }

  if (!hasFailures) {
    stdout("PASS: frontend conventions satisfied");
  }
  return !hasFailures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runFrontendConventionChecks() ? 0 : 1;
}
