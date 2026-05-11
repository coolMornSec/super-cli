# 脚本指南

本目录存放仓库级流程脚本与规范检查脚本。

## 脚本清单

### `check-backend-conventions.mjs`

- 作用：检查后端 `backend-java` lane 的基线约束。
- 当前检查项：
  - Java/Spring 工程入口
  - API 暴露层目录约定
  - 正式测试源码目录
  - 当前 change 的 `contracts/` 目录
  - 当前 change 的变更边界声明
- 典型命令：

```bash
node scripts/check-backend-conventions.mjs --change java-backend-workflow-governance
```

### `check-frontend-conventions.mjs`

- 作用：检查前端 `frontend` lane 的页面与组件约束。
- 当前检查项包括：
  - 禁止原生表格与原生表单控件替代业务组件
  - 约束 Element Plus 与 `@magustek/framework-ui` 的替换关系
  - 页面级列表编排的降级实现提示

### `check-workflow.mjs`

- 作用：检查当前 change 的流程运行态是否满足当前阶段门禁。
- 当前能力：
  - 校验 `workflow-state.md`
  - 校验 `implementation-readiness.md`
  - 校验 `proposal / specs / design / tasks / plan` 路径
  - 识别 `frontend` 与 `backend-java` lane
  - 在 `verification` 阶段分发前端或后端规范检查
- 典型命令：

```bash
node scripts/check-workflow.mjs --change java-backend-workflow-governance
```

### `scaffold-change-process.mjs`

- 作用：为新建 change 生成 `process/workflow-state.md` 与 `process/implementation-readiness.md`。
- 当前能力：
  - 支持 `--stage`
  - 支持 `--lanes`
  - 支持覆盖已有文件
  - `implementation-readiness` 内容从 `tempaltes/implementation-readiness.common.md`、`frontend.md`、`backend-java.md` 读取并按 lane 拼装
- 典型命令：

```bash
node scripts/scaffold-change-process.mjs --change java-backend-workflow-governance --stage proposal --lanes backend-java
```

### `fix-esbuild-permissions.mjs`

- 作用：修复 Windows 下 `esbuild`、Vite、Vitest、Playwright 常见权限问题。
- 主要用于前端测试或本地运行前的环境修复。

### `check-frontend-conventions.test.mjs`

- 作用：为 `check-frontend-conventions.mjs` 提供脚本级测试。

### `check-workflow.test.mjs`

- 作用：为 `check-workflow.mjs` 提供脚本级测试。

### `scaffold-change-process.test.mjs`

- 作用：为 `scaffold-change-process.mjs` 提供脚手架脚本测试。

## 使用建议

- 创建或恢复 change 时，优先使用 `scaffold-change-process.mjs`。
- 阶段推进前，优先运行 `check-workflow.mjs`。
- 涉及 lane 规范时，分别运行对应 lane 的检查脚本。
- 若脚本输出 `FAIL`，应优先回到当前 change 文档或 readiness 补齐，不要直接绕过门禁。

## 当前限制

- `check-backend-conventions.mjs` 当前只支持 `backend-java` lane。
- 当前仓库若不存在真实 Java 工程入口，后端脚本会明确阻塞，而不是误报通过。
- 非 `Java/Spring` 技术栈目前只保留扩展占位，没有正式检查脚本。
