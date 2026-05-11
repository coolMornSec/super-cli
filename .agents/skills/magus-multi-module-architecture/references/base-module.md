### 职责与定位

`magus-xxx-base` 负责存放**不依赖业务实现、可被多个模块（client/facade/service）复用的基础定义**，包括：

- **常量**：`constants` 包，各类业务常量
- **DTO / Req / Rsp**：在多个模块 / 服务之间传输的数据结构
    - Req分为2种情况，1： 带有分页的查询入参实体，则继承BaseSearchReq，返回参数必须由PageRsp包装，2：不带分页的入参实体，则继承BaseReq，返回参数必须由CommonRsp, DataRsp, ListRsp包装
    - Rsp继承BaseRsp
- **枚举**：`enums` 包，各类业务枚举
- **工具类**：`utils` 包，通用工具
- **Result 相关**：`result` 包，包含 `XxxResultEnum` 等统一结果枚举
- **国际化与初始化数据**：
    - `resources/i18n/xxx`：中英文等多语言资源
    - `resources/initdata/xxx`：初始化字典等 JSON 数据

### 包结构规范

基础包路径：

```text
com.magus.cloud.xxx.base.**
```

Claude 设计时应推荐以下典型结构：

```text
com.magus.cloud.xxx.base.constants
com.magus.cloud.xxx.base.dto
com.magus.cloud.xxx.base.enums
com.magus.cloud.xxx.base.result
com.magus.cloud.xxx.base.utils
```

### 实体类规范

com.magus.cloud.xxx.base.dto下有req和rsp包存储接口的入参和出参：

```text
- Req分为2种情况，
  1：带有分页的查询入参实体，则继承 BaseSearchReq;
  2：不带分页的入参实体，则继承 BaseReq。
- Rsp继承BaseRsp
```

Claude 设计时应推荐以下典型结构：

**Req: 不分页参数

```java
import com.magus.cloud.framework.common.domain.req.BaseReq;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
public class XxxReq extends BaseReq {

    /**
     * code
     */
    private String code;

    /**
     * 名称
     */
    private String name;

    ... // 其他参数
}
```

**SearchReq: 分页参数

```java
import com.magus.cloud.framework.common.domain.req.BaseSearchReq;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class XxxSearchReq extends BaseSearchReq {

    /**
     * code
     */
    private String code;

    /**
     * 名称
     */
    private String name;

    ... // 其他参数

}
```

**Rsp: 响应参数

```java
import com.magus.cloud.framework.common.domain.rsp.BaseRsp;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ProcessActionRsp extends BaseRsp {

    /**
     * code
     */
    private String code;

    /**
     * 名称
     */
    private String name;

    ... // 其他参数
}
```

### ResultEnum 枚举规范

每个应用必须有一个统一的结果枚举类，如 `XxxResultEnum`，用于对接 i18n 错误信息：

```java
import com.magus.cloud.framework.common.exception.ResultCode;
import com.magus.cloud.framework.common.exception.ResultEnumBase;
import com.magus.cloud.framework.common.exception.ResultEnumObject;

public enum ProcessResultEnum implements ResultEnumBase {

    /**
     * 用户不存在
     */
    RESULT_ERROR_XXX_USER_NOT_EXIST(10_000_001, ResultCode.FAIL_BUSINESS, "xxx.error.user.not.exist");

    private final ResultEnumObject bizResultEnumObject;

    ProcessResultEnum(Integer bizCode, ResultCode resultCode, String message) {
        this.bizResultEnumObject = new ResultEnumObject(bizCode, resultCode, message);
    }

    @Override
    public ResultEnumObject getBizResultEnumObject() {
        return this.bizResultEnumObject;
    }
}
```

Claude 在异常结果枚举设计时，应提示用户：

- bizCode分为3部分，以10_000_001为例，10代表应用编号，000代表模块编号，001代表具体错误编号
- 为该应用规划一段**不与其他应用冲突的 bizCode 段**（如以 `10_0xx_xxx` 风格）
- 为每个错误码定义 i18n key，并在 `resources/i18n/xxx` 中添加对应中英文文案
