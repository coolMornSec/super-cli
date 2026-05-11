# Process 目录说明

`docs/process/` 稳定流程定义

## 当前目录边界

- `stage-checklists/`：阶段检查清单。
- `l4-execution-adapter.md`：本仓库对通用技能、人工确认、独立评审、TDD 例外和宿主能力限制的 L4 适配规则。

新建 change 后，应立即执行：

```bash
node scripts/scaffold-change-process.mjs --change "<change-id>" --stage proposal
```

用于创建这两个基础模板。

进入 `implementation` 前，应先在当前 change 的 `process/` 目录中完成 readiness 记录；发生正式阶段切换前，应先同步更新当前 change 的 workflow-state。

当通用技能与仓库 L4 规范冲突时，先读取并遵循 [l4-execution-adapter.md](./l4-execution-adapter.md)。

## 辅助说明文档

- [PATH-GUIDE.md](../other/PATH-GUIDE.md)：全仓库关键文档索引。
- [workflow-check-script.md](../other/workflow-check-script.md)：工作流门禁脚本说明。
- [validation-scenarios.md](../other/validation-scenarios.md)：流程演练场景。
