---
name: magus-framework-initial
description: 基于 @AppInfo/@AppGroupInfo/@AppFunctionInfo 的模块、菜单和按钮权限设计规范，辅助在新建 Controller 时一次性设计好权限模型。
origin: USER
---

## 目标

参考[Controller.java](assets/Controller.java)，为基于注解的权限体系提供统一规范，确保：

- **模块（Module）**、**菜单（Group/Menu）**、**按钮/操作（Function）** 三层权限结构清晰、一致
- 所有权限 `key` **全局唯一、可读、可推断含义**
- URL、路由、Controller、权限注解之间 **一一对应、命名统一**
- 新建 Controller 时，Claude 可以根据本规范 **自动帮你补齐/审查注解设计**

---

## 何时启用本 Skill

- **新建任意 `*Controller` 时**
- **为现有接口补充权限控制（菜单、按钮）时**
- **重构或合并模块、菜单时**
- **排查权限配置是否规范、是否存在冲突/重复 key 时**

在上述场景中，请明确告诉 Claude「使用 app-permission-design 这个 Skill 帮我设计权限注解」。

---

## 权限模型概览

### 模块级：`@AppInfo`

用于定义一个**顶级模块**（如“系统中心”）：

```java
@AppInfo(
    key = "framework:system",
    name = "系统中心",
    enName = "System Manager",
    remark = "系统中心"
)
```

- **key**
  - 作用：全局唯一标识一个模块
  - 推荐格式：`系统域:模块名`，全部小写，单词用 `-` 连接  
    - 示例：`framework:system`、`framework:auth`、`framework:tenant`
- **name**：模块中文名（简洁、业务习惯叫法）
- **enName**：模块英文名（Title Case，如 `System Manager`）
- **remark**：补充说明，可为空，但建议写清楚模块用途

### 菜单级：`@AppGroupInfo`

用于定义模块下的某一个**菜单 / 页面**：

```java
@AppGroupInfo(
    key = "framework:system:project_info",
    parentKey = "framework:system",
    page = "/project-info",  // 对应前端 src/pages/project-info/page.vue
    name = "项目管理",
    enName = "Project Info",
    appKey = "framework:system"
)
```

- **key**
  - 作用：全局唯一标识一组菜单/页面
  - 推荐格式：`模块key:子模块或页面`  
    - 示例：`framework:system:project_info`
- **parentKey**
  - 上级模块的 key，一般对应某个 `@AppInfo.key`
  - 如示例中 `parentKey = "framework:system"`
- **page**
  - 前端路由地址，必须与前端文件式路由的实际路径保持一致
  - 规则：对应前端 `src/pages` 目录下的文件路径，`page.vue` 文件的路由**不包含** `/page` 后缀
  - 示例：
    - 前端文件 `src/pages/project-info/page.vue` → `page = "/project-info"`
    - 前端文件 `src/pages/system/user/page.vue` → `page = "/system/user"`
    - 前端文件 `src/pages/user-center/page.vue` → `page = "/user-center"`
- **name / enName**
  - 对应菜单的中英文名称
- **appKey**
  - 归属模块的 key，通常与 `parentKey` 保持一致（例如都为 `"framework:system"`）

### 按钮/功能级：`@AppFunctionInfo`

用于定义某个接口 URL 及其拥有的按钮/操作权限：

```java
@AppFunctionInfo(
    url = "/project-info/page",
    name = "分页",
    groupKey = "framework:system:project_info",
    functions = {
        "framework:system:project_info:find",
        "framework:system:project_info:create",
        "framework:system:project_info:update",
        "framework:system:project_info:delete"
    }
)
```

- **url**
  - 完整 API 路径（包含 class 上 `@RequestMapping` 与 method 上的 `@GetMapping/@PostMapping` 等合并后的结果）
  - 建议与前端调用路径完全一致
- **name**
  - 该 URL 功能的中文名，例如 `"分页"`, `"详情"`, `"新增"`, `"编辑"`, `"删除"` 等
- **groupKey**
  - 所属菜单的 key，必须与对应 `@AppGroupInfo.key` 一致
- **functions**
  - 字符串数组，每一项代表一个**细粒度按钮/操作权限**
  - 推荐格式：`菜单key:动词`，例如  
    - `"framework:system:project_info:find"`  
    - `"framework:system:project_info:create"`  
    - `"framework:system:project_info:update"`  
    - `"framework:system:project_info:delete"`

---

## 命名与 key 规范

### 通用规则

- **全部小写**
- 单词之间用 `-` 连接（kebab-case）
- 层级之间用 `:` 连接
- 尽量**语义化**，不用无意义缩写

### 推荐分层风格

- **模块 key（`@AppInfo.key`）**
  - `framework:system`
  - `framework:auth`
  - `framework:tenant`
- **菜单 key（`@AppGroupInfo.key`）**
  - `framework:system:project_info`
  - `framework:system:dict`
  - `framework:auth:user`
- **按钮/功能 key（`@AppFunctionInfo.functions[*]`）**
  - 为对应菜单 key 加上动词结尾：
    - `framework:system:project_info:find`
    - `framework:system:project_info:create`
    - `framework:system:project_info:update`
    - `framework:system:project_info:delete`
    - `framework:system:project_info:export`
    - `framework:system:project_info:import`

---

## 在 Controller 上应用注解的约定

### 类级注解模板

创建一个新的业务 Controller 时，Claude 应该按以下步骤帮助你设计：

1. **确认是否复用已有模块（`@AppInfo`）**
   - 若该 Controller 业务属于现有模块，如“系统中心”，则复用现有 `AppInfo` 的 `key`，一般写在公共配置或模块入口处。
   - 若是全新业务领域，再新建一个 `@AppInfo`，并确保 `key` 未与现有模块冲突。

2. **为该 Controller 对应的菜单定义 `@AppGroupInfo`**
   - 选择 / 设计一个合适的菜单 key，例如：  
     - `framework:system:project_info`
   - 绑定到模块：
     - `parentKey` = "framework:system"
     - `appKey` = "framework:system"
   - 确定前端页面路由 `page`，必须与文件式路由生成的实际路径保持一致：
     - Controller：`ProjectInfoController`
     - 前端页面文件：`src/pages/project-info/page.vue`
     - 页面路由：`/project-info`（即 `page = "/project-info"`）

3. **示例类级注解 + Controller**

```java
@AppInfo(
    key = "framework:system",
    name = "系统中心",
    enName = "System Manager",
    remark = "系统中心"
)
@AppGroupInfo(
    key = "framework:system:project_info",
    parentKey = "framework:system",
    page = "/project-info",  // 对应前端 src/pages/project-info/page.vue
    name = "项目管理",
    enName = "Project Info",
    appKey = "framework:system"
)
@RestController
@RequestMapping("/project-info")
public class ProjectInfoController {

    // ...
}
```

当你创建新 Controller 时，Claude 应该：

- **先询问/判断** 是否使用现有模块 key，还是设计一个新的模块
- **帮助生成** 合理的 `@AppGroupInfo.key`、`page`、`name/enName`
- **检查** 是否与现有 key 冲突（若你提供已有代码，Claude 应主动搜索）

---

## 在方法上应用 `@AppFunctionInfo` 的约定

### URL 与权限的一致性

- 若类上有 `@RequestMapping("/project-info")`，方法上有 `@PostMapping("/page")`
  - 则 `@AppFunctionInfo.url` 应为：`"/project-info/page"`
- 若方法上直接为绝对路径，如 `@PostMapping("/project-info/page")`
  - 则 `url` 直接等于注解中的路径

Claude 在生成 `@AppFunctionInfo` 时，应自动**合并 class + method 的映射**，并使用最终结果作为 `url`。

### 常用 CRUD 功能模板

对于典型分页查询接口：

```java
@PostMapping("/page")
@AppFunctionInfo(
    url = "/project-info/page",
    name = "分页",
    groupKey = "framework:system:project_info",
    functions = {
        "framework:system:project_info:find",
        "framework:system:project_info:create",
        "framework:system:project_info:update",
        "framework:system:project_info:delete"
    }
)
public PageResult<ProjectInfoVO> page(@RequestBody ProjectInfoQuery query) {
    // ...
}
```

- 当你说明「这个分页接口的页面上会有增删改查四个按钮」时，Claude 应自动给出上述 `functions` 数组。
- 若只读分页（没有新增/编辑/删除按钮），Claude 应建议只保留：
  - `"framework:system:project_info:find"`

### 其它常见操作约定

建议按用途统一结尾动词，Claude 在设计时应该优先采用这些标准化动词：

- `:find` —— 查询/分页
- `:detail` —— 详情
- `:create` —— 新增
- `:update` —— 编辑/修改
- `:delete` —— 删除
- `:enable` / `:disable` —— 启用/停用
- `:export` —— 导出
- `:import` —— 导入
- `:assign` —— 分配（如角色分配用户）
- `:bind` / `:unbind` —— 绑定/解绑关系

示例：导出项目管理数据的接口：

```java
@GetMapping("/export")
@AppFunctionInfo(
    url = "/project-info/export",
    name = "导出",
    groupKey = "framework:system:project_info",
    functions = {
        "framework:system:project_info:export"
    }
)
public void export(HttpServletResponse response) {
    // ...
}
```

---

## 多语言与展示规范

- **name**：保持简洁，适合按钮/菜单展示，可直接出现在 UI 文案中
  - 示例："项目管理", "分页", "导出", "删除"
- **enName**：使用 Title Case，方便国际化：
  - 示例："Project Info", "Page Query", "Export", "Delete"
- 若系统有统一 i18n Key 规范，也可以在 `remark` 中标注对应 i18n key，方便后期追踪。

---

## Claude 在使用本 Skill 时应遵循的步骤

当用户在本项目中新建或修改一个 Controller，并说明「需要菜单/按钮权限控制」时，你（Claude）应按以下流程执行：

1. **识别上下文**
   - 读取当前 Controller 的类名、URL 映射（`@RequestMapping`、`@GetMapping` 等）
   - 确认它属于哪个业务模块（如“系统中心”、“权限管理”等）

2. **模块级（`@AppInfo`）**
   - 若用户已在其它地方定义好 `@AppInfo`，优先复用，并引用其 `key`
   - 若用户说明是全新模块，协助设计新的 `@AppInfo`，并给出合理的 `key` / `name` / `enName` / `remark` 建议

3. **菜单级（`@AppGroupInfo`）**
   - 根据 Controller 业务语义，建议一个合适的菜单 key，如：`framework:system:project_info`
   - 填好：
     - `parentKey` = 对应模块的 `key`
     - `appKey` = 对应模块的 `key`
     - `page` = 前端路由路径（如 `/project-info`，对应 `src/pages/project-info/page.vue`）
     - `name` / `enName` = 合理的中英文名称
   - 将 `@AppGroupInfo` 直接加在 Controller 类上（或用户指定的位置）

4. **方法级（`@AppFunctionInfo`）**
   - 对每一个需要权限控制的接口方法：
     - 计算真实 `url`（合并 class + method 的映射）
     - 根据方法用途，建议：
       - `name`（如“分页”、“新增”、“删除”、“导出”等）
       - `functions` 数组（按上文 CRUD / 其它动词规范生成）
     - `groupKey` = 对应 `@AppGroupInfo.key`
   - 若多个方法共享同一个 URL 且仅参数不同，优先避免重复定义相同 `url` 的权限，必要时提醒用户检查设计。

5. **校验与提示**
   - 检查新设计的 `key` 是否与用户提供的现有代码中重复（根据你能看到的范围）
   - 如发现命名不统一、不符合约定（如大小写、分隔符、动词风格），主动提出优化建议
   - 确保 URL、路由、菜单 key、按钮 key 在命名上保持一致可推断

---

## 权限设计检查清单

在提交/合并前，可以让 Claude 按此清单帮你再过一遍：

- **模块级**
  - [ ] 该 Controller 归属的模块是否已经存在 `@AppInfo`？
  - [ ] 新增的模块 `key` 是否语义清晰且未与现有模块冲突？

- **菜单级**
  - [ ] `@AppGroupInfo.key` 是否遵循 `模块key:子模块/页面` 命名规则？
  - [ ] `parentKey` 与 `appKey` 是否指向正确模块？
  - [ ] `page` 是否与实际前端路由一致？（注意：`page.vue` 对应的路由不带 `/page` 后缀）
  - [ ] `name` / `enName` 是否合理、清晰？

- **按钮/功能级**
  - [ ] 每个 `@AppFunctionInfo.url` 是否与实际接口 URL 完全一致？
  - [ ] `groupKey` 是否与对应菜单的 key 一致？
  - [ ] `functions` 中的 key 是否遵循 `菜单key:动词` 命名规则？
  - [ ] 是否存在明显重复或意义重叠的按钮 key？
  - [ ] 是否为不需要按钮级控制的接口（如内部调用）错误地设计了按钮权限？

只要本 Skill 在对话中启用，Claude 就应当按照以上规范，**主动帮你补齐和审查权限注解设计**，而不是被动等待你逐个指出字段。

---

## 与 framework-initial 的集成约定

在使用 Magus 的 `framework-initial` 模块时，Controller 与权限注解还需要满足初始化/资源扫描的额外要求：

- **资源扫描机制**
  - `AppResourceAnnotationBeanPostProcessor` 会扫描带 `@AppResource` 或 `@RestController` 的 Bean，并解析其中的资源/功能信息。
  - 当你在 Controller 上使用 `@AppInfo/@AppGroupInfo/@AppFunctionInfo` 这套权限注解时，应确保：
    - Controller 本身被 Spring 管理（通常是 `@RestController`）
    - URL/method 等信息可被正常解析（不要依赖非常规的动态映射方式）。

- **字段完整性与错误枚举**
  - 如果某些关键字段缺失或不合法（例如缺少 httpMethod、url 无法推导），初始化过程可能抛出以下错误枚举之一：
    - `RESULT_ERROR_FUNCTION_INFO_WITHOUT_URL`
    - `RESULT_ERROR_FUNCTION_INFO_WITHOUT_METHOD`
    - `RESULT_ERROR_FUNCTION_INFO_INIT_FAIL`
  - Claude 在生成注解时应主动检查这些字段是否齐全，并在缺失时立即提示补充，避免到运行时才失败。

- **设计流程建议**
  1. 先按照本 Skill 的规则设计好 `@AppInfo/@AppGroupInfo/@AppFunctionInfo`（模块/菜单/按钮）。
  2. 确认 Controller 的 `@RequestMapping`/`@GetMapping`/`@PostMapping` 路径与 `@AppFunctionInfo.url` 一致。
  3. 确保所有需要参与初始化的 Controller/资源类都在 Spring 扫描包范围内，并被 `framework-initial` 能够发现。
  4. 如启动时报 functionInfo 相关错误，优先检查：url、method、code/key 是否缺失或拼写错误。

只要与初始化/资源注册相关的改动出现，Claude 应同时应用 **本 Skill（权限/注解设计）** 与上述 **framework-initial 集成约定**，确保权限模型与初始化流程两边都一致、可用。
