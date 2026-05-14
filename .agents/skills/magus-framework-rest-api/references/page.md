## BaseSearchReq

```java
package com.magus.cloud.framework.common.domain.req;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springdoc.core.annotations.ParameterObject;

@Data
@EqualsAndHashCode(callSuper = false)
@Schema(name = "BaseSearchReq", description = "基础分页Req对象")
@ParameterObject
public class BaseSearchReq extends BaseReq {

    private static final long serialVersionUID = 1L;

    @Min(1)
    @Schema(description = "当前页码")
    @Parameter(name = "page")
    private int page = 1;

    @Min(1)
    @Max(500)
    @Schema(description = "每页条数")
    @Parameter(name = "size")
    private int size = 20;

    @Schema(description = "排序的字段名")
    @Parameter(name = "attr")
    private String attr;

    @Schema(description = "ASC; DESC")
    @Parameter(name = "sort")
    private String sort = "ASC";

    @JsonIgnore
    public int getStartNum() {
        return (page - 1) * size;
    }

}
```

## PageRsp

参考 [response](./response.md#pagersp) 中的 `PageRsp`，它是一个通用的分页响应包装类，包含总条数、总页数、当前页码、每页条数和当前页结果集等字段。

## controller示例

```java
@PostMapping("/page")
@Operation(summary = "分页列表")
public PageRsp<UserRsp> page(@RequestBody UserSearchReq req) {
Page<UserRsp> page = brandService.list(req);
return new PageRsp<>(req, page.getTotalElements(), page.getContent());
}
```