---
name: magus-framework-exception
description: Magus Framework 异常处理规范，包括 BaseException、ResultEnum、全局异常处理等。
origin: ECC
---

# Magus Framework 异常处理规范

基于 `framework-common` 模块的异常体系，为 Magus Framework 项目处理异常。

## 何时启用
* 抛出业务异常
* 处理校验错误
* 自定义错误码
* 全局异常处理

---

## 一、异常类体系

```
BaseException (RuntimeException)
    └── brEnum: ResultEnumObject      # 错误码对象
    └── message: String              # 错误消息
    └── validResults: List<BeanValidResult>  # 校验结果

ResultEnum (枚举 implements ResultEnumBase)
    └── bizCode: Integer             # HTTP 状态码
    └── resultCode: ResultCode       # 系统代码 (SUCCESS/FAIL_SYSTEM/FAIL_BUSINESS)
    └── message: String              # i18n 消息 key
```

---

## 二、ResultEnum 常用错误码

| bizCode | resultCode | 说明 | 消息 Key |
|---------|------------|------|----------|
| 200 | SUCCESS | 成功 | result.success |
| 400 | FAIL_BUSINESS | 参数错误 | result.error.param |
| 401 | FAIL_SYSTEM | 未授权 | result.error.unauthorized |
| 403 | FAIL_SYSTEM | 权限不足 | result.error.unauthenticated |
| 404 | FAIL_SYSTEM | 请求地址无效 | result.error.uri |
| 500 | FAIL_SYSTEM | 系统错误 | result.error.system |
| 1008 | FAIL_BUSINESS | 查询失败 | result.error.query.fail |
| 1009 | FAIL_BUSINESS | 对象已存在 | result.error.obj.exist |
| 1012 | FAIL_SYSTEM | 不允许操作 | result.error.not.allow.operation |

---

## 三、抛出异常

### 方式一：使用预定义枚举

```java
import com.magus.cloud.framework.common.exception.BaseException;
import com.magus.cloud.framework.common.exception.ResultEnum;

// 最简用法
throw new BaseException(ResultEnum.RESULT_ERROR_OBJ_NOT_EXIST);
```

### 方式二：自定义消息

```java
throw new BaseException(ResultEnum.RESULT_ERROR_PARAM, "自定义错误消息");
```

### 方式三：带校验结果（表单验证）

```java
import com.magus.cloud.framework.common.exception.BeanValidResult;
import java.util.Arrays;
import java.util.List;

List<BeanValidResult> validResults = Arrays.asList(
    new BeanValidResult("name", "名称不能为空"),
    new BeanValidResult("age", "年龄必须大于0")
);
throw new BaseException(ResultEnum.RESULT_ERROR_PARAM, validResults);
```

### 方式四：包装内部异常

```java
try {
    // 业务逻辑
} catch (IOException e) {
    throw new BaseException(e, ResultEnum.RESULT_ERROR_SYS);
}
```

---

## 四、ResultEnum 定义规范

### 新增业务错误码

```java
public enum ResultEnum implements ResultEnumBase {
    
    // ========== 业务错误码示例 ==========
    
    /**
     * 对象不存在
     */
    RESULT_ERROR_OBJ_NOT_EXIST(1000, ResultCode.FAIL_BUSINESS, "result.error.obj.not.exist"),
    
    /**
     * 对象已存在
     */
    RESULT_ERROR_OBJ_EXIST(1009, ResultCode.FAIL_BUSINESS, "result.error.obj.exist"),
    
    /**
     * 查询失败
     */
    RESULT_ERROR_QUERY_FAIL(1008, ResultCode.FAIL_BUSINESS, "result.error.query.fail"),
    
    ;
    
    private ResultEnumObject bizResultEnumObject;
    
    ResultEnum(Integer bizCode, ResultCode resultCode, String message) {
        bizResultEnumObject = new ResultEnumObject(bizCode, resultCode, message);
    }
    
    @Override
    public ResultEnumObject getBizResultEnumObject() {
        return this.bizResultEnumObject;
    }
}
```

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| bizCode | Integer | HTTP 状态码，建议：400 业务参数错误，401/403 权限错误，500 系统错误，1000+ 业务错误 |
| resultCode | ResultCode | SUCCESS(0) 成功，FAIL_SYSTEM(1) 系统错误，FAIL_BUSINESS(2) 业务错误 |
| message | String | i18n 消息 key，需在 messages_*.properties 中配置 |

---

## 五、全局异常处理

### ServiceErrorHandler

框架提供全局异常处理器 `ServiceErrorHandler`，会自动：

1. 捕获所有 `BaseException`
2. 提取 `bizCode` 作为 HTTP 状态码
3. 将异常转换为 `CommonRsp` 包装的 `BaseRspResult`
4. 处理消息国际化

```java
// 源码位置
// com.magus.cloud.framework.core.exception.ServiceErrorHandler
```

### 响应格式

**成功响应：**
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

**错误响应：**
```json
{
  "result": {
    "bizCode": 1000,
    "resultCode": "FAIL_BUSINESS(2)",
    "message": "对象不存在",
    "validResults": []
  },
  "rspFlag": true
}
```

**校验错误响应：**
```json
{
  "result": {
    "bizCode": 400,
    "resultCode": "FAIL_BUSINESS(2)",
    "message": "参数错误",
    "validResults": [
      { "propertyPath": "name", "message": "名称不能为空" },
      { "propertyPath": "age", "message": "年龄必须大于0" }
    ]
  },
  "rspFlag": true
}
```

---

## 六、Service 层异常处理

### Service 层抛出异常

```java
@Service
public class XxxInfoService {
    
    @Autowired
    private XxxInfoRepository repository;
    
    public XxxInfoRsp findOne(String id) {
        XxxInfo entity = repository.findById(id)
            .orElseThrow(() -> new BaseException(ResultEnum.RESULT_ERROR_OBJ_NOT_EXIST));
        
        // 转换并返回
        return convertToRsp(entity);
    }
    
    public void deleteAll(List<String> ids) {
        List<XxxInfo> entities = repository.findAllById(ids);
        if (entities.isEmpty()) {
            throw new BaseException(ResultEnum.RESULT_ERROR_OBJ_NOT_EXIST);
        }
        repository.deleteAll(entities);
    }
}
```

### Controller 层捕获（可选）

通常不需要在 Controller 层捕获异常，由全局异常处理器统一处理：

---

## 七、关键类速查表

| 类名 | 路径 | 说明 |
|------|------|------|
| `BaseException` | `com.magus.cloud.framework.common.exception` | 基础异常类 |
| `ResultEnum` | `com.magus.cloud.framework.common.exception` | 预定义错误码枚举 |
| `ResultEnumBase` | `com.magus.cloud.framework.common.exception` | 错误码接口 |
| `ResultEnumObject` | `com.magus.cloud.framework.common.exception` | 错误码对象 |
| `ResultCode` | `com.magus.cloud.framework.common.exception` | 系统代码枚举 |
| `BeanValidResult` | `com.magus.cloud.framework.common.exception` | 校验结果 |
| `BaseRspResult` | `com.magus.cloud.framework.common.domain.rsp` | 响应结果对象 |
| `ServiceErrorHandler` | `com.magus.cloud.framework.core.exception` | 全局异常处理器 |
| `CommonRsp` | `com.magus.cloud.framework.common.domain.rsp` | 通用响应 |

---

## 八、i18n 消息配置

在 `messages.properties`（或 `messages_zh_CN.properties`）中配置：

```properties
# 通用
result.success=操作成功
result.error.param=参数错误
result.error.unauthorized=未授权
result.error.unauthenticated=权限不足
result.error.uri=请求地址无效
result.error.system=系统错误

# 业务
result.error.obj.not.exist=对象不存在
result.error.obj.exist=对象已存在
result.error.query.fail=查询失败
result.error.not.allow.operation=不允许操作
```
