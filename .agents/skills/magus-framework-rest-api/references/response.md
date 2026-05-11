## BaseRsp

```java
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;

@Schema(name = "BaseRsp", description = "基础Rsp对象,用于泛型约束")
public class BaseRsp implements Serializable {
    private static final long serialVersionUID = 1L;
}
```

## CommonRsp 参考 

```java
import com.magus.cloud.framework.common.exception.ResultEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "CommonRsp", description = "通用Rsp对象,用于无返回值时")
public class CommonRsp implements Serializable {
    private static final long serialVersionUID = 1L;

    @Schema(description = "调用结果")
    private BaseRspResult result = new BaseRspResult(ResultEnum.RESULT_SUCCESS);

    private Boolean rspFlag = true;

    public CommonRsp(BaseRspResult result) {
        this.result = result;
    }
}
```

## DataRsp

```java
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "DataRsp", description = "返回单个对象时的Rsp包装类")
public class DataRsp<T> extends CommonRsp {
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "结果对象")
    private T data;
}
```

## ListRsp

```java
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ListRsp", description = "返回集合对象时的Rsp包装类")
public class ListRsp<T> extends CommonRsp {

    private static final long serialVersionUID = 1L;

    @Schema(description = "结果集合")
    private List<T> list;
}
```

## PageRsp

```java
import com.magus.cloud.framework.common.domain.req.BaseSearchReq;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PageRsp", description = "返回分页集合对象时的Rsp包装类")
public class PageRsp<T> extends CommonRsp {

    private static final long serialVersionUID = 1L;
    @Schema(description = "总条数")
    private Long totalNum = 0L;

    @Schema(description = "总页数")
    private Long totalPage = 0L;

    @Schema(description = "当前页数")
    private int page;

    @Schema(description = "每页条数")
    private int size;

    @Schema(description = "当前页结果集")
    private List<T> list;

    public PageRsp(Long totalNum, int page, int size, List<T> list) {
        if (size >= 0) {
            this.totalPage = ((totalNum + size - 1) / size);
        }
        this.page = page;
        this.size = size;
        this.totalNum = totalNum;
        this.list = list;
    }

    public PageRsp(BaseSearchReq baseSearch, Long totalNum, List<T> list) {
        this(totalNum, baseSearch.getPage(), baseSearch.getSize(), list);
    }
}
```