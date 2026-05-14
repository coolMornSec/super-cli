# Consistency Log

## 目的

用于记录 L3 需求与 L4 规格之间的补充、变更与追溯关系。

## 记录字段

- 记录编号
- 来源级别
- 补充时间
- 补充原因
- 原始需求引用
- 新增内容
- 影响范围
- 是否影响验收标准
- 是否同步回写 L3

## 使用规则

- 任何在 L4 发现的需求疏漏，都必须记录
- 任何新增约束、边界、例外、验收项，都必须同步到 L3
- 若 L3 与 L4 冲突，以最新显式确认版本为准
- 不允许静默修改需求或规格

## 简化模板

- ID:
- Source:
- Reason:
- Requirement Ref:
- Added Content:
- Impact:
- Acceptance Impact:
- Synced Back to L3:
