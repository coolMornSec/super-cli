---
name: magus-framework-rest-api
description: Magus Framework REST API 设计规范，包括 URL 规则、入参规范、返回参数规范、异常处理等。
origin: ECC
---

# Magus Framework REST API 设计规范

基于 `framework-common` 和 `framework-core` 模块的约定，为 Magus Framework 项目设计 REST API。

## When to use

* 设计新的 API 端点
* 审查现有 API
* 实现 CRUD 操作
* 添加分页、过滤功能
* 处理异常和错误响应

---

## 一、URL 规则

### 基本规范
```
# 资源应为名词、复数、小写、使用 kebab-case
GET    /xxx-info/page         # 分页查询（POST）
GET    /xxx-info/list         # 列表查询（POST）
GET    /xxx-info/find-by-id/{id}  # 根据ID查询

POST   /xxx-info/upsert       # 新增或编辑
POST   /xxx-info/delete       # 删除

# 子资源用于表示关系
GET    /xxx-info/{id}/children/list
```

### 命名规则

```
# 良好示例
/team-members          # kebab-case 多单词资源
/xxx-info/page         # 分页查询
/xxx-info/find-by-id/{id}  # 根据ID查询
/xxx-info/tree         # 树结构查询

# 不良示例
/xxx-info/getUsers              # 驼峰
/xxx-info/user                  # 单数形式
/xxx-info/team_members          # snake_case
```

### HTTP 方法映射

| 方法 | 用途 | 幂等 | 示例 |
|------|------|------|------|
| GET | 查询资源 | 是 | `GET /xxx-info/find-by-id/{id}` |
| POST | 创建资源/执行动作 | 否 | `POST /xxx-info/upsert`, `POST /xxx-info/delete` |

> 注意：对于查询操作，推荐使用 GET 方法；对于创建、更新、删除等修改操作，推荐使用 POST 方法。
---

## 二、入参规则

### 请求对象继承体系

```
BaseReq (基类)
    └── BaseSearchReq (分页查询)
            ├── page: int (当前页码，默认1)
            ├── size: int (每页条数，默认20，最大500)
            ├── attr: String (排序字段)
            └── sort: String (排序方向，ASC/DESC)
```

### 入参示例

**普通请求 DTO**（继承 BaseReq）：
```java
import com.magus.cloud.framework.common.domain.req.BaseReq;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "XxxInfoReq", description = "xxx信息请求对象")
public class XxxInfoReq extends BaseReq {
    
    @Schema(description = "名称")
    @NotBlank(message = "名称不能为空")
    private String name;
    
    @Schema(description = "描述")
    private String description;
}
```

**分页查询请求 DTO**（继承 BaseSearchReq）：
```java
import com.magus.cloud.framework.common.domain.req.BaseSearchReq;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springdoc.core.annotations.ParameterObject;

@Data
@Schema(name = "XxxInfoSearchReq", description = "xxx信息查询请求对象")
@ParameterObject
public class XxxInfoSearchReq extends BaseSearchReq {
    
    @Schema(description = "名称关键字")
    private String name;
    
    @Schema(description = "状态")
    private Integer status;
}
```

### 参数校验

**方式一：JSR303 注解（Controller 入参）**
```java
public CommonRsp upsert(@Valid @RequestBody XxxInfoReq req) {
    // ...
}
```

**方式二：@ParamCheck 注解（Service 层）**
```java
@ParamCheck
public void methodName(XxxInfoReq req) {
    // 校验失败抛出 BaseException
}
```

---

## 三、返回参数规则

### 响应包装类型

| 类型 | 使用场景 | 包装类                          |
|------|----------|------------------------------|
| 无返回值 | 增删改操作 | `CommonRsp`                  |
| 单对象 | 根据ID查询 | `DataRsp<T extends BaseRsp>` |
| 列表 | 列表查询、树结构 | `ListRsp<T extends BaseRsp>`                 |
| 分页 | 分页查询 | `PageRsp<T extends BaseRsp>`                 |

### 响应结构

**所有响应都包含以下字段：**
```json
{
  "result": {
    "bizCode": 0,
    "resultCode": "SUCCESS(0)",
    "message": "",
    "validResults": []
  },
  "rspFlag": true
}
```

### CommonRsp（无返回值）

```java
return new CommonRsp();
```

```json
{
  "result": {
    "bizCode": 200,
    "resultCode": "SUCCESS(0)",
    "message": "",
    "validResults": []
  },
  "rspFlag": true
}
```

### DataRsp<T extends BaseRsp>（单对象）

```java
XxxInfoRsp result = xxxInfoService.findOne(id);
return new DataRsp<>(result);
```

```json
{
  "data": {
    "id": "xxx-123",
    "name": "示例名称",
    "description": "描述信息"
  },
  "result": {
    "bizCode": 200,
    "resultCode": "SUCCESS(0)",
    "message": "",
    "validResults": []
  },
  "rspFlag": true
}
```

### ListRsp<T extends BaseRsp>（列表）

```java
List<XxxInfoRsp> result = xxxInfoService.list(searchReq);
return new ListRsp<>(result);
```

```json
{
  "list": [
    { "id": "xxx-123", "name": "名称1" },
    { "id": "xxx-456", "name": "名称2" }
  ],
  "result": {
    "bizCode": 200,
    "resultCode": "SUCCESS(0)",
    "message": "",
    "validResults": []
  },
  "rspFlag": true
}
```

### PageRsp<T extends BaseRsp>（分页）

```java
Page<XxxInfoRsp> result = xxxInfoService.page(searchReq);
return new PageRsp<>(searchReq, result.getTotalElements(), result.getContent());
```

```json
{
  "totalNum": 100,
  "totalPage": 5,
  "page": 1,
  "size": 20,
  "list": [
    { "id": "xxx-123", "name": "名称1" },
    { "id": "xxx-456", "name": "名称2" }
  ],
  "result": {
    "bizCode": 200,
    "resultCode": "SUCCESS(0)",
    "message": "",
    "validResults": []
  },
  "rspFlag": true
}
```

---

## 四、分页

参考 [page](references/page.md)，里面有入参出参的源码示例，以及分页查询的示例代码。

## 五、Controller 示例

详见 [Controller示例](assets/Controller.java)

---

## 六、关键类速查表

| 类别    | 类名                           | 路径 |
|-------|------------------------------|------|
| 响应包装  | `CommonRsp`                  | `com.magus.cloud.framework.common.domain.rsp` |
| 响应包装  | `DataRsp<T extends BaseRsp>` | `com.magus.cloud.framework.common.domain.rsp` |
| 响应包装  | `ListRsp<T extends BaseRsp>` | `com.magus.cloud.framework.common.domain.rsp` |
| 响应包装  | `PageRsp<T extends BaseRsp>` | `com.magus.cloud.framework.common.domain.rsp` |
| 请求基类  | `BaseReq`                    | `com.magus.cloud.framework.common.domain.req` |
| 分页请求  | `BaseSearchReq`              | `com.magus.cloud.framework.common.domain.req` |
| 控制器基类 | `BaseController`             | `com.magus.cloud.framework.core.controller` |
| 参数校验  | `@ParamCheck`                | `com.magus.cloud.framework.core.annotation` |


## References

- 输入参数： [request](references/request.md)
- 输出参数： [response](references/response.md)
- 分页： [page](references/page.md)
- Controller示例： [XxxController.java](assets/Controller.java)