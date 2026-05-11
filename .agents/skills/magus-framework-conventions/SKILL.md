---
name: magus-framework-conventions
description: 应用 Magus framework 约定（异常、响应体、Header 上下文、参数校验、模块选择）。当生成或修改依赖 com.magus.cloud framework 的 Java/Spring 代码时使用，或用户提到 framework、BaseException、ResultEnum、CommonRsp、Redis、JPA、多数据源、MQ、OpenFeign、HeaderContextHolder 时使用。
---

# Magus framework 约定总览

你正在为 **Magus `framework`（Java 17 / Spring Boot 3.5.x / Spring Cloud 2025.x）** 及其业务依赖项目生成/修改代码。该 framework 的核心目标是：业务代码尽量 **只依赖 framework 的通用能力**（异常、响应体、Header 上下文、Redis、JPA、MQ、OpenFeign、gRPC 等），并保持一致的工程约定。

## 这个技能的定位

这是 **Magus framework 相关技能的总入口 / 总调度技能**。

当用户没有明确提到某个子技能，但当前任务在生成或修改代码时已经出现相关场景，你需要：

1. 先使用本技能判断当前代码会依赖哪些 framework 能力。
2. 一旦识别到某类能力被使用，主动加载对应子技能，而不是等用户显式提及。
3. 由对应子技能提供细节规则，本技能负责总体约定、触发时机和执行顺序。

换句话说，本技能不是替代其他技能，而是用于在编码过程中 **自动识别场景并触发正确的技能链路**。

## 必读约束（默认必须遵守）

- **统一异常**：业务错误、参数错误、权限错误一律抛 `BaseException`，优先使用 `ResultEnum`（或实现 `ResultEnumBase` 的枚举）。
- **国际化消息**：`ResultEnum` 的 `message` 必须是 i18n key（例如 `result.error.param`），错误处理通过 `MessageSource` 转成多语言文本。
- **统一响应体**：Controller 层返回 `CommonRsp` / `DataRsp<T extends BaseRsp>` / `ListRsp<T extends BaseRsp>` 等 framework 响应对象；不要自造新的响应包裹结构。
- **分层职责**：Controller 只做入参、权限、响应组装；业务逻辑放 Service；数据访问放 Repository。
- **参数校验**：需要自动校验请求 DTO 时，在 Service 或 Facade 上使用 `@ParamCheck`，由 `ParamCheckAspect` 执行 `jakarta.validation` 校验。
- **Header 上下文**：通过 `HeaderContextHolder` 获取用户、租户、客户端、action、token；微服务链路默认通过 OpenFeign 透传 `magus-user` 等 header。
- **资源权限**：新增 Controller 或 API 时，需要补充 `@AppInfo()`、`@AppGroupInfo()`、`@AppFunctionInfo()` 等资源注解。
- **JPA 约定**：优先复用 `BaseRepository`、`BaseServiceImpl`、`@EnableJpaAuditing`、`@EntityScan/@EnableJpaRepositories(com.magus.cloud)`；实体优先继承 framework base entity。
- **Redis 约定**：优先使用 framework 提供的 `RedisService` / `BaseRedisService`，key 前缀优先复用 `CommonConstants`。
- **MQ 约定**：优先使用 Spring Cloud Stream 配套能力和 `SlaveStreamBridge.send(bindingName, model)`；`companyCode` 通过 `HeaderContextHolder` 注入到 `BaseMqModel`。
- **一致性优先**：优先复用 framework 的基类、工具、常量和配置，不要引入并行的“第二套标准”。

## 开始任何编码前的最小工作流

1. **识别目标**：你是在改 framework 本身，还是在为“业务项目”生成依赖 framework 的代码？
2. **定位模块**（framework 仓库内）：
   - `framework-common`：异常、响应体、上下文、常量
   - `framework-core`：Controller 基类、参数校验、全局异常、Header 拦截
   - `framework-redis`：Redis Template 与 RedisService
   - `framework-persistence-jpa`：base entity、repository、service、JPA 配置
   - `framework-openfeign`：header 透传与 decoder
   - `framework-mq`：消息发送封装
   - `framework-grpc`：gRPC client
   - `framework-stomp`：WebSocket / STOMP
   - `framework-pdf`：PDF 渲染
   - `framework-initial`：资源与功能初始化
   - `framework-rtdb`：RTDB 能力
3. **输出变更清单**：生成代码前先给出将新增/修改的文件列表与原因；改动后补充最小验证建议（如编译、单测、基本运行路径）。

## 识别到场景后如何触发子技能

只要当前代码生成或修改过程中出现以下任一场景，即使用户没有主动提到，也要自动加载对应技能：

- 需要先生成多模块后端骨架时，加载 [magus-multi-module-architecture](../magus-multi-module-architecture/SKILL.md)
- 需要补 framework 依赖、校验版本或管理 BOM 时，加载 [magus-framework-dependencies](../magus-framework-dependencies/SKILL.md)
- 需要统一异常、错误码、响应失败语义时，加载 [magus-framework-exception](../magus-framework-exception/SKILL.md)
- 需要新增或修改 REST Controller、请求响应对象、接口规范时，加载 [magus-framework-rest-api](../magus-framework-rest-api/SKILL.md)
- 需要处理 STOMP 或 WebSocket 时，加载 [magus-framework-stomp](../magus-framework-stomp/SKILL.md)
- 需要使用 Redis 缓存、分布式缓存能力时，加载 [magus-framework-redis](../magus-framework-redis/SKILL.md)
- 需要发送或消费 MQ 消息时，加载 [magus-framework-mq](../magus-framework-mq/SKILL.md)
- 需要生成 PDF 模板或渲染 PDF 时，加载 [magus-framework-pdf](../magus-framework-pdf/SKILL.md)
- 需要发起 gRPC 调用时，加载 [magus-framework-grpc](../magus-framework-grpc/SKILL.md)
- 需要补充资源、菜单、按钮、接口权限注解时，加载 [magus-framework-initial](../magus-framework-initial/SKILL.md)
- 需要定义 JPA 实体、Repository、基础持久化能力时，加载 [magus-framework-jpa](../magus-framework-jpa/SKILL.md)
- 需要处理 JPA 分页查询时，加载 [magus-framework-jpa-page](../magus-framework-jpa-page/SKILL.md)
- 需要处理多数据源、分库分表或库路由时，加载 [magus-framework-datasource](../magus-framework-datasource/SKILL.md)
- 需要访问 RTDB 实时数据库时，加载 [magus-framework-rtdb](../magus-framework-rtdb/SKILL.md)

## 推荐执行流程

1. 如果后端骨架尚未生成，优先加载 `magus-multi-module-architecture`，先把模块结构搭好。
2. 使用 framework 能力前，先在业务项目 `dependencyManagement` 中引入 `com.magus.cloud:framework-dependencies:${framework.version}`，再按需添加 `framework-core`、`framework-redis`、`framework-persistence-jpa`、`framework-mq` 等依赖。
3. 模块根 POM 的 `dependencyManagement` 统一管理 `magus-xxx-base/client/facade/service` 等内部依赖版本。
4. 新增依赖前，先检查 `magus-framework-dependencies` 是否已管理版本，没有再补充。
5. 代码一旦涉及特定能力，立即加载对应子技能，不依赖用户显式提及。
6. 需要测试时优先写并执行单测；涉及核心链路时，再补最小运行验证。
7. 修复顺序固定为：编译错误 > 单测失败 > 运行验证失败。

## 输出要求

- 先说明将新增或修改哪些文件，以及原因。
- 生成代码后给出最小验证建议。
- 可预见异常使用 `BaseException(ResultEnum...)`，不可预见异常交给全局处理转换为 `RESULT_ERROR_SYS`。
