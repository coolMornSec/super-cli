import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runFrontendConventionChecks } from "./check-frontend-conventions.mjs";

function createTempRepo(structure) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "frontend-conventions-"));

  for (const [relativePath, content] of Object.entries(structure)) {
    const targetPath = path.join(repoRoot, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf8");
  }

  return repoRoot;
}

function createSkillDoc() {
  return `# mg-framework-ui

## 通用组件索引

| Mg 组件 | 替代 | 使用建议 | 参考 |
| --- | --- | --- | --- |
| \`MgButton\` | \`ElButton\` | - | [a](a) |
| \`MgTabs\` | \`ElTabs\` | - | [a](a) |
| \`MgTabPane\` | \`ElTabPane\` | - | [a](a) |
| \`MgTable\` | \`ElTable\` | - | [a](a) |

## 业务组件索引

| Mg 组件 | 业务定位 | 适用场景 | 参考 |
| --- | --- | --- | --- |
| \`MgPageTable\` | 一体化列表页 | 典型后台列表页 | [a](a) |
| \`MgSplit\` + \`MgSplitPanel\` | 分栏工作区 | 左树右表 | [a](a) |
| \`MgToolbar\` | 工具栏封装 | 列表页操作区 | [a](a) |
| \`MgSearch\` | 轻量搜索输入封装 | 搜索条 | [a](a) |
`;
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

runTest("checks packages/frontend-vue/src when present", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/example.vue": "<template><el-button>提交</el-button></template>",
  });

  const stdout = [];
  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /MgButton/);
});

runTest("derives forbidden Element Plus replacements from the skill component index", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/components/TabsDemo.vue":
      "<template><ElTabs><ElTabPane label=\"A\" /></ElTabs></template>",
  });

  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: () => {},
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /MgTabs/);
  assert.match(stderr.join("\n"), /MgTabPane/);
});

runTest("warns about hand-assembled list pages with a generic capability-boundary message", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/UserList.vue": `<template>
  <MgToolbar>
    <MgButton type="primary">新增</MgButton>
  </MgToolbar>
  <Mg-Table
    v-model:page-size="page.size"
    v-model:current-page="page.page"
    :data="rows"
    :total="total"
    @paging-change="queryData"
  >
    <el-table-column prop="name" label="名称" />
  </Mg-Table>
</template>`,
  });

  const stdout = [];
  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  const output = stdout.join("\n");
  assert.match(output, /candidate component capability boundaries/);
  assert.match(output, /record why this composition is the right fit/);
  assert.doesNotMatch(output, /MgPageTable|MgSplit/);
});

runTest("allows a higher-order table container page without emitting the hand-assembled warning", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/TreeList.vue": `<template>
  <MgPageTable :data="rows" :total="total" v-model:current-page="page">
    <el-table-column prop="name" label="名称" />
  </MgPageTable>
</template>`,
  });

  const stdout = [];
  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.doesNotMatch(stdout.join("\n"), /candidate component capability boundaries/);
  assert.doesNotMatch(stdout.join("\n"), /hand-assembled list page/);
});

runTest("does not warn for a tree-table page without list-assembly signals", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/TreeList.vue": `<template>
  <MgTree :data="treeData" />
  <MgTable :data="rows">
    <el-table-column prop="name" label="名称" />
  </MgTable>
</template>`,
  });

  const stdout = [];
  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, true);
  assert.equal(stderr.length, 0);
  assert.doesNotMatch(stdout.join("\n"), /candidate component capability boundaries/);
});

runTest("fails when a page redundantly declares the default layout", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/system/alarm/page.vue": `<script setup lang="ts">
  defineOptions({ name: 'SystemAlarmPage' })
  definePage({ meta: { layout: 'default' } })
</script>`,
  });

  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: () => {},
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  assert.match(stderr.join("\n"), /default layout/);
});

runTest("reports el-table-column without Mg*Table container only once", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
    "packages/frontend-vue/src/pages/system/menu/page.vue": `<template>
  <ElTableColumn prop="name" label="名称" />
</template>`,
  });

  const stderr = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: () => {},
    stderr: (message) => stderr.push(message),
  });

  assert.equal(passed, false);
  const output = stderr.join("\n");
  const matches = output.match(/uses el-table-column without an Mg\*Table container/g) ?? [];
  assert.equal(matches.length, 1);
});

runTest("skips checks when packages/frontend-vue/src does not exist", () => {
  const repoRoot = createTempRepo({
    ".agents/skills/mg-framework-ui/SKILL.md": createSkillDoc(),
  });

  const stdout = [];
  const passed = runFrontendConventionChecks({
    repoRoot,
    stdout: (message) => stdout.push(message),
    stderr: () => {},
  });

  assert.equal(passed, true);
  assert.match(stdout.join("\n"), /packages\/frontend-vue\/src not present/);
});
