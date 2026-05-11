---
name: magus-framework-mq
description: 面向实战的 Magus framework MQ（Spring Cloud Stream + RabbitMQ）：依赖引入、common-mq.yml 配置、bindings/function definition、生产者（StreamBridge/SlaveStreamBridge）、消费者（Consumer Bean）、消息模型（BaseMqModel/companyCode 注入）、幂等与排查清单。参考 framework-mq/README-Codex.md 的可用示例。当用户要在业务里接入/发送/消费 MQ（framework-mq）时使用。
---

# Magus `framework-mq` 实战技能（Spring Cloud Stream + RabbitMQ）

## 你要“做成什么效果”

当用户说“我要发消息/消费消息/接 MQ”，你需要输出可直接落地的方案，至少包含：

- **依赖引入**：业务服务如何依赖 `framework-mq`
- **配置接入**：在 `application.yml` 里 import `common-mq.yml`（通常来自 nacos）
- **topic/binding 配置**：`spring.cloud.stream.function.definition` + `bindings` 的 out/in 配置
- **生产者写法**：推荐封装成 service；优先用 `SlaveStreamBridge`（自动注入 `companyCode`），也可直接用 `StreamBridge`
- **消费者写法**：`@Configuration` + `@Bean Consumer<Payload>`（Spring Cloud Function）
- **至少一次语义**：幂等键/去重（通常 Redis/DB），避免重复消费副作用
- **排查清单**：bindingName、definition、destination、连不上 rabbit、消息类型不匹配等

## 模块事实（来自 `framework-mq` + README）

- **核心依赖**：`spring-cloud-stream-binder-rabbit`
- **默认组件**
  - `SlaveStreamBridge<T extends BaseMqModel>`：发送前若 `HeaderContextHolder.getUser()!=null`，会把 `companyCode` 注入到消息体
  - `BaseMqModel`：仅包含 `companyCode` 字段（业务事件建议继承它）
- **README 给出的标准接入步骤**：依赖 → yml import → common-mq.yml 配 destination/bindings/definition → 生产者 → 消费者

## 业务侧接入（必须给用户的“照抄版”）

### 1) Maven 依赖

如果当前业务项目内没有引入 `framework-mq`，需要业务服务 `pom.xml` 增加：

```xml
<dependency>
  <groupId>com.magus.cloud</groupId>
  <artifactId>framework-mq</artifactId>
</dependency>
```

### 2) `application.yml` 导入 `common-mq.yml`（README 标准写法）

```yml
spring:
  config:
    import:
      - optional:nacos:common-mq.yml
```

### 3) `common-mq.yml`（topic/binding/function definition）

按 README 示例（可直接改名）：

```yml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: admin
    password: admin
    virtual-host: /
  cloud:
    stream:
      rabbit:
        binders:
          dev-rabbit:
            type: rabbit
      function:
        definition: aaaBbb;
      bindings:
        aaaBbb-out-0:
          destination: aaa-bbb
        aaaBbb-in-0:
          destination: aaa-bbb
```

**必须对齐的三件事**（最常见错误点）：

- `function.definition` 里的函数名：`aaaBbb`
- 绑定名：`aaaBbb-out-0` / `aaaBbb-in-0`（名字与函数名强绑定）
- 目的地：`destination: aaa-bbb`（你要发到/收自哪个 topic/queue）

### 4) 生产者（两种写法：推荐 `SlaveStreamBridge`）

#### 4.1 推荐：使用 `SlaveStreamBridge`（自动注入 companyCode）

```java
@Service
public class AaaBbbProducer {

  @Autowired
  private com.magus.cloud.framework.mq.function.SlaveStreamBridge<MyEvent> slaveStreamBridge;

  public void send(MyEvent event) {
    slaveStreamBridge.send("aaaBbb-out-0", event);
  }
}

class MyEvent extends com.magus.cloud.framework.mq.model.BaseMqModel {
  private String bizId;
  // getters/setters
}
```

> 注：只有在 `HeaderContextHolder.getUser()` 有值时才会注入 `companyCode`；如果你的发送发生在“无请求上下文”的后台任务里，需要业务侧自行补齐 `companyCode`。

#### 4.2 直接用 `StreamBridge`（README 里的基础示例）

```java
@Service
public class AaaBbbProducer2 {

  @Autowired
  private org.springframework.cloud.stream.function.StreamBridge streamBridge;

  public boolean send(Object payload) {
    return streamBridge.send("aaaBbb-out-0", payload);
  }
}
```

### 5) 消费者（`Consumer<T>` Bean）

```java
@Configuration
public class AaaBbbConsumerConfig {

  @Bean
  public java.util.function.Consumer<MyEvent> aaaBbb() {
    return payload -> {
      // 业务处理（注意幂等）
    };
  }
}
```

> 函数名必须与 `spring.cloud.stream.function.definition` 中一致。

## 幂等与“至少一次”消费（必须提醒）

Spring Cloud Stream 消费通常是“至少一次”语义：同一条消息可能被重复投递/重复消费。

你需要在业务侧给出幂等方案（至少给出一种可落地选择）：

- **Redis 幂等键**：`SETNX(bizId)` + TTL；成功才执行业务；失败直接忽略
- **DB 幂等表/唯一约束**：以 `bizId` 建唯一索引，插入成功才处理

幂等键一般来自：消息里的 `bizId` / `messageId` / 业务单号。

## 常见问题排查清单

- **发不出去**：`bindingName` 必须是 `xxx-out-0`，不是 destination
- **收不到**：`function.definition` 没配/函数名不一致/没把 `xxx` 函数加入 definition（多函数时用 `a;b;c;`）
- **destination 对不上**：生产/消费的 `destination` 必须一致
- **类型反序列化异常**：尽量用稳定 DTO；生产/消费两端类结构要兼容
- **rabbit 连接失败**：检查 `spring.rabbitmq.*`（host/port/vhost/账号）

## 你在回答用户时的“输出模板”

- **依赖**：`framework-mq` 依赖片段
- **配置**：`application.yml` import + `common-mq.yml` 示例（definition/bindings/destination）
- **生产者**：优先 `SlaveStreamBridge.send("xxx-out-0", payload)`（说明 companyCode 注入条件）
- **消费者**：`@Bean Consumer<Payload> xxx()`（函数名对齐 definition）
- **幂等**：给出 Redis/DB 两种方案之一
