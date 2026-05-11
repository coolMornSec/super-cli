import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runBackendConventionChecks } from "./check-backend-conventions.mjs";

function createTempRepo({ includeContractsReadme = false } = {}) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "backend-conventions-"));
  const files = {
    "pom.xml": "<project />\n",
    "mvnw.cmd": "@echo off\n",
    "src/main/java/com/example/controller/SampleController.java": "class SampleController {}\n",
    "src/test/java/com/example/SampleControllerTest.java": "class SampleControllerTest {}\n",
    "openspec/changes/sample-change/.openspec.yaml": "schema: spec-driven\n",
    "openspec/changes/sample-change/design.md": "## Boundaries\n- 受影响模块：sample\n",
    "openspec/changes/sample-change/process/implementation-readiness.md": "- 允许修改范围：sample\n",
    "openspec/changes/sample-change/contracts/request-example.md": "# Request\n",
  };

  if (includeContractsReadme) {
    files["openspec/changes/sample-change/contracts/README.md"] = "# Contracts\n";
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const targetPath = path.join(repoRoot, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf8");
  }

  return repoRoot;
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

runTest("backend convention check accepts concrete contract files", () => {
  const repoRoot = createTempRepo();
  const stdout = [];
  const stderr = [];

  const passed = runBackendConventionChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /当前 change 已存在契约目录/);
});

runTest("backend convention check rejects contracts README", () => {
  const repoRoot = createTempRepo({ includeContractsReadme: true });
  const stdout = [];
  const stderr = [];

  const passed = runBackendConventionChecks({
    repoRoot,
    changeId: "sample-change",
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /contracts\/README\.md 不再作为契约说明入口/);
});
