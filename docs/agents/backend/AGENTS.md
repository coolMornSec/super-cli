# 后端执行规范

## 文档定位

- 本文件是已有 `Java/Spring` 业务模块变更与评审的执行规范。
- 它解决的是“后端 change 进入设计、计划、实现、评审、验证时必须遵循什么”。
- 它不负责初始化新应用、新模块骨架或脚手架生成。

## 推荐阅读顺序

1. 先阅读当前 change 的 `proposal.md`、`specs/...`、`design.md`、`tasks.md`
2. 再阅读当前 change 的 `process/implementation-readiness.md`
3. 然后阅读本文件
4. 最后按场景补充读取相关技能文档

## 快速判断

- 如果你在改已有 `Java/Spring` 业务模块：使用本文件。
- 如果你在设计或评审接口、DTO、异常、契约、测试：使用本文件。
- 如果你在初始化新项目、生成新模块骨架、设计新服务分层：不要使用本文件，应切换到独立专业技能。

## 适用范围

- 所有针对已有 `Java/Spring` 业务模块的接口、DTO、Service、Repository、权限、异常、契约与测试变更。
- 所有后端相关的 `design`、`writing-plans`、`implementation`、`code-review`、`verification` 阶段。

## 明确排除范围

- 新应用初始化、新模块骨架搭建、新服务脚手架生成。
- 任何以 `backend-node` 目录、实现或接口风格为参考来源的后端规范设计。
- 非 `Java/Spring` 技术栈的正式规则定义。本文件只保留扩展占位，不输出伪规范。

## 必须调用的技能

- 进入已有 `Java/Spring` 业务模块变更前，必须使用 `magus-framework-conventions` 作为总入口。
- 设计或评审 REST API 时，必须使用 `magus-framework-rest-api`。
- 设计或评审异常与错误语义时，必须使用 `magus-framework-exception`。
- 涉及依赖选择或模块能力判断时，必须使用 `magus-framework-dependencies`。
- 涉及 JPA、分页、多数据源、Redis、MQ、gRPC、STOMP、RTDB 等能力时，必须继续调用对应子技能。

## 最小工作流

1. 先确认当前 change 是否真的属于“已有 `Java/Spring` 业务模块变更”。
2. 确认当前 change 的 `proposal`、`specs`、`design`、`tasks` 已经覆盖 API、契约、错误语义和边界。
3. 在 `implementation-readiness` 中写清：
   - 受影响模块
   - 受影响包或目录
   - 契约文件位置
   - 测试入口
   - 允许修改范围与禁止扩展范围
4. 再进入实现。

若以上任一步无法回答，必须回到 `brainstorming` 或 `design`，而不是继续编码。

## 执行原则

- 后端实现必须以当前 change 已批准的 OpenSpec 文档为准，不得在实现时临时发明接口语义、错误码、资源边界或权限模型。
- 后端变更必须以已有 `Java/Spring` 业务模块为边界，不得把“初始化项目”与“变更业务模块”混成同一套流程。
- 关键代码逻辑必须带标记注释，说明关键判断、边界吸收、错误映射或状态切换意图。
- 不得自造统一响应体、异常体系、Header 上下文或第二套权限标准，必须优先复用 Magus 既有约定。
- 不得为了让接口快速跑通而绕过 `BaseException`、`ResultEnum`、`CommonRsp / DataRsp / ListRsp / PageRsp`、`@ParamCheck`、`HeaderContextHolder` 等基础约束。

## API 与契约约束

- API 路径必须遵循资源名词化、复数化、小写、`kebab-case` 约定。
- 查询、详情、分页、树结构、删除、保存等接口必须在 `design` 或 `contracts/` 中写清资源边界、请求对象、返回对象与错误语义。
- 请求对象必须优先继承 `BaseReq` / `BaseSearchReq`，并在合适层使用 `@Valid` 或 `@ParamCheck`。
- Controller 必须返回 `CommonRsp`、`DataRsp<T>`、`ListRsp<T>`、`PageRsp<T>` 等框架响应体，不得自造包装结构。
- 业务异常、参数异常、权限异常必须统一走 `BaseException` + `ResultEnum`（或实现 `ResultEnumBase` 的枚举）。
- 消息内容应使用 i18n key，不得把临时中文错误提示直接固化成新的框架标准。
- 需要用户、租户、公司、客户端、动作上下文时，必须通过 `HeaderContextHolder` 获取或透传。
- 新增资源接口时，必须在设计中说明对应的资源权限注解策略。

## DTO 与分层约束

- Controller 只负责入参接收、权限入口、响应组装，不承担业务编排。
- Service 负责业务规则、事务边界与异常语义。
- Repository 负责数据访问，不直接承担业务规则。
- 请求对象优先使用 `Req` / `SearchReq` 语义，响应对象优先使用 `Rsp` / `DTO` 语义，不得混用成模糊的“万能对象”。
- 若当前接口存在树、分页、详情、批量操作等不同语义，应在 `design` 中拆清，而不是塞进一个不稳定的请求模型。

## 设计与计划要求

- `design` 或 `implementation-readiness` 中必须写清受影响模块、包边界、目录边界与允许修改范围。
- `design` 中必须写清 API 路径、DTO / Req / Resp 设计结论、错误语义、权限与 Header 上下文要求。
- `writing-plans` 中必须写清最小验证命令、测试矩阵、契约文件位置、禁止扩展范围与回滚条件。
- 如接口语义、错误码、权限模型或模块边界仍不明确，必须停止推进并回到 `brainstorming` 更新 OpenSpec。

## Contracts 落盘建议

- `contracts/request-example.md`：记录关键请求示例。
- `contracts/response-example.md`：记录关键响应示例。
- `contracts/error-semantics.md`：记录错误语义、状态码、业务码与提示口径。
- 如需说明契约范围与文件结构，应写入具体契约文件或 `design.md`

本仓库当前允许先放占位，但一旦进入真实接口变更，不得只保留空泛占位说明。

## 契约与变更边界要求

- 每个涉及后端接口变更的 change 都必须维护 `openspec/changes/<change-id>/contracts/` 目录。
- `contracts/` 至少应包含请求示例、响应示例、错误语义或占位说明，不得只靠 `design.md` 口头描述。
- `implementation-readiness` 中必须写明受影响模块、包或目录，不得在未声明边界时扩大修改范围。
- 未写入当前 change 规格的新接口、新资源、新异常分支、新权限行为，一律不得在实现阶段自行添加。

## 典型阻塞信号

- 说不清当前接口的资源边界。
- 说不清当前异常是参数错误、业务错误还是权限错误。
- 说不清返回体是否仍然符合 `CommonRsp / DataRsp / ListRsp / PageRsp`。
- 没有 `contracts/` 落盘，却已经开始写 Controller。
- 测试入口只有构建命令，没有真实测试命令或测试目录。

出现以上任一项，都应视为阻塞 implementation 的信号。

## 测试与验证要求

- 后端测试必须先判断最低可证明层级，再决定使用单元测试、契约测试、集成测试或最小运行验证。
- 纯 DTO 映射、工具逻辑、错误映射优先走单元测试。
- 接口语义、错误语义、统一响应体、参数校验优先走契约测试或控制器层测试。
- Service / Repository 协作、事务、数据访问边界优先走集成测试。
- 验证阶段必须至少能回答：
  - 本次 change 的正式测试入口是什么
  - 契约文件是否与实现一致
  - 受影响模块是否超出声明边界
  - 是否仍存在未吸收的异常或响应体漂移

## 后端 Ready 检查清单

- 已确认当前 change 只覆盖已有 `Java/Spring` 业务模块。
- 已调用 `magus-framework-conventions`，并按场景补充子技能。
- 已写清 API 路径、Req / Resp、错误语义、权限与 Header 上下文。
- 已存在 `contracts/` 目录。
- 已写清受影响模块、包或目录边界。
- 已写清最小测试入口与验证命令。

## 评审与验证检查

- 审查是否错误地把初始化职责混入已有模块变更规范。
- 审查是否绕开 `magus-framework-conventions` 与对应子技能，直接发明本地标准。
- 审查 API 路径、Req / Resp、异常语义、Header 上下文与权限约束是否已写入正式文档。
- 审查是否存在 `contracts/` 缺失、测试入口缺失、边界未声明却扩大改动范围的问题。
- 审查是否仍使用自造响应包装、自造异常结构或无法回溯来源的错误提示。
- 未完成以上检查时，不得给出“后端规则满足”的结论。

## 输出要求

- 如果是设计阶段，输出应能直接回填到 `design.md` 与 `contracts/`。
- 如果是计划阶段，输出应能直接回填到 `implementation-readiness.md` 与实现计划。
- 如果是评审阶段，结论必须明确写出：
  - 哪些规则已满足
  - 哪些规则缺失
  - 是否允许进入下一阶段
  - 仍有哪些剩余风险

## 扩展占位

- 未来若接入 `Go`、`Node`、`.NET` 等后端技术栈，应新增独立 lane 与独立执行规范。
- 在独立规则形成前，本文件只承认“扩展占位存在”，不承认“扩展规则已成立”。
