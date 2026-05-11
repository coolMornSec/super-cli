### 职责与定位

`magus-xxx-client` 用于对外暴露 **Feign Client 接口**，供其他微服务调用的 API：

- 对外唯一入口：`com.magus.cloud.xxx.client.api` 包下的 Feign 接口
- 隐藏具体 URL，调用方只需要引入 client 依赖 + 调用接口方法

### 典型 Maven 依赖

Claude 设计新的 `magus-xxx-client` 时，应默认加入至少以下依赖：

```xml
<dependency>
    <groupId>com.magus.cloud</groupId>
    <artifactId>magus-xxx-base</artifactId>
</dependency>

<dependency>
    <groupId>com.magus.cloud</groupId>
    <artifactId>framework-openfeign</artifactId>
</dependency>
```

### 包结构与 Feign 接口示例

基础包路径：

```text
com.magus.cloud.xxx.client.api.**
```

示例接口：

```java
@FeignClient(url = "${magus-xxx:}", contextId = "XxxRestApi", name = "magus-xxx", path = "/xxx/action")
public interface XxxRestApi {

    /**
     * 查询操作
     *
     * @param req 请求对象
     * @return 通用响应
     */
    @PostMapping("/query")
    ListRsp<XxxRsp> query(@RequestBody XxxReq req);
}
```

Claude 在生成新的 Client 时应：

- 将 `name` 与 `spring.application.name` 保持一致（通常为 `magus-xxx`）
- `path` 与对外暴露的 Controller 路由保持一致（一般在 `facade` 模块中实现）
- 客户端方法签名尽量复用 `magus-xxx-base` 中的 DTO 定义
