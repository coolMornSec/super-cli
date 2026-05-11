### 职责与定位

`magus-xxx-facade` 是**对外暴露层 + 可部署单体**，职责包括：

- 提供对外 HTTP API（`controller`）
- 持有 Spring Boot `Application` 启动类
- 管理应用级配置（`application.yml`）
- 作为 Docker 镜像打包入口（最终运行的 jar 属于该模块）

### 包结构与启动类

基础包路径：

```text
com.magus.cloud.xxx.facade.controller
```

启动类示例（放在 `facade` 包下，如 `com.magus.cloud.xxx.facade.Application`）：

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 典型 Maven 依赖与 build 配置

Claude 为新建 `magus-xxx-facade` 设计 pom 时，需要参考 [facade的POM](../assets/pom.xml)

Claude 在生成时应把 `mainClass` 中的包名与实际启动类路径保持一致。

### `application.yml` 示例与约定

`facade` 模块的 `resources/application.yml` 示例：

```yaml
server:
  port: {{SERVER_PORT}}   # 端口号，需要与 Dockerfile 的 EXPOSE 一致

spring:
  application:
    name: magus-xxx
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_SERVER_ADDR:{{NACOS_SERVER_ADDR}}}
        namespace: ${NACOS_NAMESPACE:{{NACOS_NAMESPACE}}}
        username: ${NACOS_USERNAME:{{NACOS_USERNAME}}}
        password: ${NACOS_PASSWORD:{{NACOS_PASSWORD}}}
      config:
        server-addr: ${spring.cloud.nacos.discovery.server-addr}
        namespace: ${spring.cloud.nacos.discovery.namespace}
        username: ${spring.cloud.nacos.discovery.username}
        password: ${spring.cloud.nacos.discovery.password}
  config:
    import:
      - optional:nacos:application.yml
      - optional:nacos:common-mq.yml
      - optional:nacos:${spring.application.name}.yml
```


Claude 在设计新应用时应：

- 建议一个不冲突的 `server.port`（一般在 `18xxx` 区间），可以先询问下用户
- 确保 `spring.application.name` 与 `FeignClient.name`、注册中心服务名等保持一致
- nacos配置固定，nacos服务器地址、端口、命名空间、账号、密码提醒用户补充
- config通用的yml配置固定application.yml、common-mq.yml、以及和自身spring.application.name一致的yml
