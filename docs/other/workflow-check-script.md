# 工作流校验脚本说明

`scripts/check-workflow.mjs` 用于校验当前 change 的 `workflow-state.md` 与 `implementation-readiness.md` 是否满足所在阶段的最低门禁要求。

## 运行方式

```bash
node scripts/check-workflow.mjs --change <change-id>
node scripts/check-frontend-conventions.mjs
```

未传 `--change` 时，脚本仍会尝试兼容旧的全局 `docs/process/*.md` 路径，但该模式仅用于迁移期兜底，不应继续作为新流程的正式入口。

## 校验内容

- 当前阶段是否合法
- 当前功能名称与 slug 是否存在
- 阶段要求的文档路径是否填写且文件存在
- 当前 change 的 `openspec/changes/<change-id>/process/implementation-readiness.md` 是否存在且结构有效
- Magustek 相关技能出现时，`.npmrc` 是否满足私有源要求
- 当阶段到达 `verification` 或 `finish` 时，前端规范检查脚本是否存在且通过

## 适用场景

- 每次阶段流转后立即运行
- 每次补齐规格、计划、评审或验证文档后运行
- 进入 `implementation` 前作为当前 change readiness 记录门禁
- 进入 `verification` 或 `finish` 前作为硬性门禁

## 脚本可自动校验

- 当前阶段是否合法
- 当前功能名称与 slug 是否存在
- 阶段要求的文档路径是否填写且文件存在
- 当前 change 的 `implementation-readiness.md` 是否存在且结构有效
- Magustek 相关技能出现时，`.npmrc` 是否满足私有源要求
- 当阶段到达 `verification` 或 `finish` 时，前端规范检查脚本是否存在且通过

## 仍需人工复核

- 某个功能在进入 `implementation` 前是否已经完成并填写 readiness 记录
- 当前 change 的 `implementation-readiness.md` 中的工作区策略是否合理
- 当前 change 的 `implementation-readiness.md` 中的环境前置是否真实完成
- 当前 change 的 `implementation-readiness.md` 中的前端任务收口是否真的收敛了页面元素、入口数量与回流方式
- 当前 change 的 `implementation-readiness.md` 中的需求-测试矩阵是否完整覆盖主链路、关键异常和状态一致性
- 组件能力边界、测试矩阵覆盖完整性和评审结论是否真的成立

## 当前限制

- 该脚本主要验证流程状态与文档存在性
- 更细粒度的前端实现规范由 `scripts/check-frontend-conventions.mjs` 负责
- current change 的 readiness 记录是否存在且结构有效可以脚本判断，但某个功能是否已真实完成 readiness 内容仍需要结合人工复核与交付记录判断
