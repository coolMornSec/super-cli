#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ignoredDirectoryNames = new Set([
  ".git",
  ".agents",
  ".codex",
  "node_modules",
  ".nuxt",
  ".output",
  "dist",
  "coverage",
  "target",
  "build",
]);

const buildEntryNames = ["pom.xml", "build.gradle", "build.gradle.kts"];
const wrapperEntryNames = ["mvnw", "mvnw.cmd", "gradlew", "gradlew.bat"];
const apiDirectoryNames = new Set(["controller", "controllers", "api", "web"]);
const javaSourceRoots = ["src/main/java", "src/main/kotlin"];
const javaTestRoots = ["src/test/java", "src/test/kotlin"];

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function walkFiles(rootPath, predicate, results = []) {
  if (!fs.existsSync(rootPath)) return results;

  const stat = fs.statSync(rootPath);
  if (!stat.isDirectory()) return results;

  for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
    if (ignoredDirectoryNames.has(entry.name)) continue;
    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(entryPath, predicate, results);
      continue;
    }
    if (entry.isFile() && predicate(entry.name, entryPath)) {
      results.push(entryPath);
    }
  }

  return results;
}

function hasFiles(rootPath) {
  if (!fs.existsSync(rootPath) || !fs.statSync(rootPath).isDirectory()) return false;
  return fs.readdirSync(rootPath).length > 0;
}

function toRelative(repoRoot, targetPath) {
  return path.relative(repoRoot, targetPath).replaceAll("\\", "/");
}

function findBuildEntries(repoRoot) {
  return walkFiles(repoRoot, (name) => buildEntryNames.includes(name));
}

function findWrapperEntries(repoRoot) {
  return walkFiles(repoRoot, (name) => wrapperEntryNames.includes(name));
}

function findApiDirectories(moduleRoot) {
  const matches = [];
  for (const sourceRoot of javaSourceRoots) {
    const absoluteSourceRoot = path.join(moduleRoot, sourceRoot);
    if (!fs.existsSync(absoluteSourceRoot) || !fs.statSync(absoluteSourceRoot).isDirectory()) continue;

    const stack = [absoluteSourceRoot];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (ignoredDirectoryNames.has(entry.name)) continue;
        const entryPath = path.join(current, entry.name);
        if (apiDirectoryNames.has(entry.name)) {
          matches.push(entryPath);
        }
        stack.push(entryPath);
      }
    }
  }

  return matches;
}

function moduleHasTests(moduleRoot) {
  return javaTestRoots.some((testRoot) => {
    const absoluteTestRoot = path.join(moduleRoot, testRoot);
    return hasFiles(absoluteTestRoot);
  });
}

function resolveModuleRoots(repoRoot) {
  return findBuildEntries(repoRoot).map((buildFilePath) => path.dirname(buildFilePath));
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

export function runBackendConventionChecks({
  repoRoot = process.cwd(),
  changeId = null,
  stdout = console.log,
  stderr = console.error,
} = {}) {
  let hasFailures = false;
  const ok = (message) => stdout(`OK: ${message}`);
  const warn = (message) => stdout(`WARN: ${message}`);
  const fail = (message) => {
    hasFailures = true;
    stderr(`FAIL: ${message}`);
  };

  const buildEntries = findBuildEntries(repoRoot);
  const wrapperEntries = findWrapperEntries(repoRoot);
  const moduleRoots = resolveModuleRoots(repoRoot);

  if (buildEntries.length === 0) {
    fail("未发现 Java/Spring 工程入口（例如 pom.xml 或 build.gradle）");
  } else {
    ok(`已发现 ${buildEntries.length} 个构建入口：${buildEntries.map((entry) => toRelative(repoRoot, entry)).join(", ")}`);
  }

  if (wrapperEntries.length === 0) {
    warn("未发现 mvnw/gradlew 包装脚本；若后续以 CI 或统一命令执行，请在 change 文档中明确说明");
  } else {
    ok(`已发现构建包装脚本：${wrapperEntries.map((entry) => toRelative(repoRoot, entry)).join(", ")}`);
  }

  if (moduleRoots.length > 0) {
    const apiDirectories = moduleRoots.flatMap((moduleRoot) => findApiDirectories(moduleRoot));
    if (apiDirectories.length === 0) {
      fail("未发现约定的 API 暴露层目录（controller/api/web）");
    } else {
      ok(`已发现 API 暴露层目录：${apiDirectories.map((entry) => toRelative(repoRoot, entry)).join(", ")}`);
    }

    const modulesWithoutTests = moduleRoots.filter((moduleRoot) => !moduleHasTests(moduleRoot));
    if (modulesWithoutTests.length > 0) {
      fail(
        `以下模块未发现正式测试源码目录（src/test/java 或 src/test/kotlin）：${modulesWithoutTests.map((entry) => toRelative(repoRoot, entry)).join(", ")}`,
      );
    } else {
      ok("已发现正式测试源码目录");
    }
  }

  if (changeId) {
    const changeRoot = path.join(repoRoot, "openspec", "changes", changeId);
    if (!fs.existsSync(changeRoot) || !fs.statSync(changeRoot).isDirectory()) {
      fail(`当前 change 不存在：openspec/changes/${changeId}`);
    } else {
      ok(`已定位当前 change：openspec/changes/${changeId}`);

      const contractsRoot = path.join(changeRoot, "contracts");
      if (!hasFiles(contractsRoot)) {
        fail(`当前 change 缺少正式契约文件或契约目录内容：${toRelative(repoRoot, contractsRoot)}`);
      } else {
        const contractEntries = fs.readdirSync(contractsRoot, { withFileTypes: true });
        const hasContractsReadme = contractEntries.some((entry) => entry.isFile() && entry.name.toLowerCase() === "readme.md");
        const hasConcreteContract = contractEntries.some((entry) => entry.name.toLowerCase() !== "readme.md");

        if (hasContractsReadme) {
          fail("contracts/README.md 不再作为契约说明入口，请改用具体契约文件或 design.md");
        }

        if (!hasConcreteContract) {
          fail(`当前 change 的 contracts/ 不得只包含 README.md：${toRelative(repoRoot, contractsRoot)}`);
        } else {
          ok(`当前 change 已存在契约目录：${toRelative(repoRoot, contractsRoot)}`);
        }
      }

      const readinessPath = path.join(changeRoot, "process", "implementation-readiness.md");
      const readinessText = readFileSafe(readinessPath) ?? "";
      const designText = readFileSafe(path.join(changeRoot, "design.md")) ?? "";
      const boundarySignals = [
        /允许修改范围[:：]/,
        /受影响模块/,
        /受影响目录/,
        /包边界/,
        /目录边界/,
        /模块边界/,
      ];

      if (boundarySignals.some((signal) => signal.test(readinessText) || signal.test(designText))) {
        ok("当前 change 已声明变更边界");
      } else {
        fail("当前 change 未在 design 或 implementation-readiness 中声明受影响模块 / 包 / 目录边界");
      }
    }
  } else {
    warn("未提供 --change，已跳过契约文件与变更边界检查");
  }

  if (!hasFailures) {
    stdout("PASS: backend conventions satisfied");
  }
  return !hasFailures;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    const options = parseCliArgs();
    if (options.help) {
      console.log("Usage: node scripts/check-backend-conventions.mjs [--change <change-id>] [--repo-root <path>]");
      process.exitCode = 0;
    } else {
      process.exitCode = runBackendConventionChecks(options) ? 0 : 1;
    }
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
