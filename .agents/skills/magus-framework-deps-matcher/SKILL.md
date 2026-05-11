---
name: magus-framework-deps-matcher
description: 通用依赖匹配器。在添加功能或技术、生成骨架、添加依赖时自动触发，校验 framework-deps.html 和当前 pom.xml，防止重复添加已存在的依赖。
user-invocable: false
disable-model-invocation: false
allowed-tools: Read, Bash(python *)
---

# 智能依赖匹配器

## 功能说明

在用户添加功能或技术、生成项目骨架或添加依赖时，自动检查：
1. **Framework 中是否已存在**该依赖
2. **当前项目 pom.xml 中是否已存在**该依赖
3. **传递依赖分析**：某依赖是否会通过其他依赖自动引入

防止重复添加依赖，确保依赖管理的规范性。

## 触发条件

以下场景自动触发：
- 用户说"添加 XXX 依赖"
- 用户说"我要实现 XXX 功能"（如：发送消息、PDF导出）
- 用户说"引入 XXX"
- 用户说"使用 XXX 技术"
- 用户生成项目骨架时
- 任何涉及依赖添加的场景

## 执行流程

### 1. 解析用户需求

从用户消息中提取：
- 技术名称（如：Redis、MQ、JPA）
- 功能描述（如：发送消息、导出PDF、缓存数据）

### 2. 加载依赖数据

**查找 framework-deps.html：**
- 当前目录
- 上级目录
- Git 仓库中的 Framework 项目

**查找当前项目 pom.xml：**
- 向上查找最近的 pom.xml（排除 Framework 根项目）
- 解析其中已声明的依赖

### 3. 多层次匹配检查

| 检查层级 | 说明 | 结果 |
|---------|------|------|
| **L1: 当前项目检查** | 依赖是否已在 pom.xml 中 | 已存在 -> 提示无需添加 |
| **L2: 传递依赖检查** | 是否会被其他依赖自动引入 | 是 -> 提示无需重复添加 |
| **L3: Framework 检查** | 是否在 Framework 依赖管理中 | 是 -> 建议使用 Framework 版本 |
| **L4: 外部依赖** | 不在 Framework 中 | 提示需要手动添加 |

### 4. 输出示例

```markdown
📦 依赖检查结果
============================================================

✅ framework-redis
   状态: 已存在
   详情: 已在当前项目 pom.xml 中
   
📦 framework-mq
   状态: Framework 可用
   说明: MQ 消息队列支持（Spring Cloud Stream + RabbitMQ）
   配置示例:
      spring:
        cloud:
          stream:
            bindings:
              output:
                destination: my-queue
   
   建议: 在 pom.xml 中添加以下依赖:
       <dependency>
           <groupId>com.magus.cloud</groupId>
           <artifactId>framework-mq</artifactId>
       </dependency>

------------------------------------------------------------
💡 建议:
   • framework-redis: 无需操作，依赖已存在
   • framework-mq: 在 pom.xml 中添加依赖（见上）
```

## 使用脚本

### 命令行使用

```bash
# 语义匹配模式（分析用户描述）
python3 .agents/skills/magus-framework-deps-matcher/scripts/matcher.py "我要添加 Redis 缓存"

# 直接检查 artifactId
python3 .agents/skills/magus-framework-deps-matcher/scripts/matcher.py framework-redis --check

# JSON 输出
python3 .agents/skills/magus-framework-deps-matcher/scripts/matcher.py "添加 MQ 功能" --json
```

### 程序调用

```python
from scripts.matcher import DependencyMatcher

matcher = DependencyMatcher()

# 加载 Framework 报告
matcher.load_framework_report(Path("framework-deps.html"))

# 加载当前项目 pom
matcher.load_project_pom(Path("pom.xml"))

# 语义匹配
result = matcher.match("我要实现消息发送功能")
print(result['message'])

# 添加前检查
check = matcher.check_before_add("framework-redis")
print(f"能否添加: {check['can_add']}")
print(f"原因: {check['reason']}")
```

## 依赖映射配置

配置文件：@scripts/dependency_map.yaml 示例：

```yaml
redis:
  keywords:
    - redis
    - 缓存
    - cache
    - 分布式缓存
  dependency: framework-redis
  description: Redis 缓存支持
  config_example: |
    framework:
      redis:
        host: localhost
        port: 6379
```

### 支持的匹配类型

| 类型 | 示例输入 | 匹配结果 |
|------|---------|---------|
| **精确匹配** | "添加 Redis" | framework-redis |
| **同义词匹配** | "我要用缓存" | framework-redis |
| **功能匹配** | "实现消息发送" | framework-mq |
| **技术匹配** | "用 JPA 做 ORM" | framework-persistence-jpa |

## 传递依赖分析

系统内置传递依赖关系：

| 依赖 | 会传递引入 |
|------|-----------|
| framework-persistence-jpa | framework-redis, framework-common |
| framework-stomp | framework-redis |
| framework-rtdb | framework-redis |
| framework-core | framework-common |
| framework-openfeign | framework-common, framework-core |

**示例场景：**
用户项目已添加 `framework-persistence-jpa`，再尝试添加 `framework-redis` 时：
```
❌ 无需添加
原因: framework-redis 会通过 framework-persistence-jpa 传递引入
```

## 输出说明

### 状态标识

| 标识 | 含义 | 操作建议 |
|------|------|---------|
| ✅ | 已在当前项目 | 无需操作 |
| 📦 | 在 Framework 中可用 | 添加到 pom.xml |
| ❌ | 不在 Framework 中 | 手动查找添加 |
| ⚠️ | 存在版本冲突 | 检查版本兼容性 |

### JSON 输出格式

```json
{
  "matched": true,
  "results": [
    {
      "keyword": "redis",
      "dependency": "framework-redis",
      "description": "Redis 缓存支持",
      "in_framework": true,
      "in_project": false,
      "transitive_deps": [],
      "related_starters": ["spring-boot-starter-data-redis"]
    }
  ],
  "message": "..."
}
```

## 注意事项

1. **framework-deps.html 必须最新**：建议定期运行 `magus-framework-analyzer` 更新报告
2. **pom.xml 解析限制**：使用 XML 解析，某些复杂的 Maven 特性（如 profile）可能不完全支持
3. **传递依赖基于内置映射**：如需扩展传递依赖关系，需修改 `matcher.py` 中的 `check_transitive_deps` 方法
