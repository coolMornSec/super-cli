---
name: magus-framework-redis
description: 使用 Magus framework 的 Redis 约定（magusRedisTemplate、RedisService/BaseRedisService、key 命名、TTL、缓存一致性策略）。当用户提到 Redis、缓存、key、TTL、分布式锁或 framework-redis 时使用。
---

# Magus `framework-redis` 业务侧使用手册

## 你要“做成什么效果”

当用户说“业务里怎么用 Redis / framework-redis”，你需要输出可以直接落地的方案，至少包含：

- **依赖引入**：业务工程如何引入 `framework-redis`
- **配置模板**：`application.yml` 的 `spring.data.redis.*` 最小可用配置（含连接池）
- **用法示例**：推荐用 `RedisService` 注入；必要时用 `@Qualifier("magusRedisTemplate")`
- **key 规范**：统一前缀、可读、可定位；优先复用 `FrameworkRedisKey`
- **TTL 与一致性**：说明 TTL、失效策略（写后删/写后更/定时刷新）以及适用场景
- **高级用法**：`RedisAtomicLong`、Pub/Sub（含 `prefixChannel`）
- **风险/坑位**：JSON 序列化/类型信息、跨服务兼容、keys(pattern) 风险等

## 模块事实（来自 `framework-redis`）

- **自动装配入口**：Spring Boot `AutoConfiguration.imports` 导入 `RedisConfig`
- **对外可用 Bean**
  - `magusRedisTemplate`：`RedisTemplate<String, Object>`（key=String，value/hashValue=JSON）
  - `RedisService`：`@Component`，继承 `BaseRedisService`，封装常见 ops
  - `RedisMessageListenerContainer`：容器 Bean（基于 `RedisConnectionFactory`）
- **关键方法**
  - 缓存：`setCacheObject/getCacheObject/expire/deleteObject/hasKey/keys`
  - 结构：`setCacheList/getList`，`setCacheSet/getSet`，`setCacheMap/getMap`，`setMapValue/getMapValue/getMapValues/deleteMapValue`
  - pubsub：`convertAndSend`，`prefixChannel`
  - 计数：`getLong(String key)` 返回 `RedisAtomicLong`

## 业务侧接入（必须给用户的“照抄版”）

### 1) Maven 依赖

如果当前业务项目内没有引入 `framework-redis`，需要业务服务 `pom.xml` 增加：

```xml
<dependency>
  <groupId>com.magus.cloud</groupId>
  <artifactId>framework-redis</artifactId>
</dependency>
```

> 默认会通过 Spring Boot 自动装配加载 `RedisConfig`；无需手动 `@Import`。

### 2) `application.yml` 配置模板

```yml
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      database: 0
      password: ${REDIS_PASSWORD:}
      lettuce:
        pool:
          enabled: true
          max-active: 20
```

### 3) 推荐用法：注入 `RedisService`

#### 3.1 缓存对象 + TTL（最常见）

```java
@Service
public class UserCacheService {

  @Autowired
  private RedisService redisService;

  public void putUser(Long userId, UserDTO dto) {
    String key = "User:detail:" + userId;
    redisService.setCacheObject(key, dto, java.time.Duration.ofMinutes(30));
  }

  public UserDTO getUser(Long userId) {
    return redisService.getCacheObject("User:detail:" + userId);
  }

  public void evictUser(Long userId) {
    redisService.deleteObject("User:detail:" + userId);
  }
}
```

#### 3.2 Hash / List / Set（需要结构化缓存时用）

```java
// List：覆盖式写入
redisService.setCacheList("Order:ids", java.util.List.of(1L, 2L, 3L));
java.util.List<Long> ids = redisService.getList("Order:ids");

// Set：覆盖式写入
redisService.setCacheSet("Tag:hot", java.util.Set.of("A", "B"));
java.util.Set<String> tags = redisService.getSet("Tag:hot");

// Hash：按字段读写
redisService.setMapValue("User:profile", "1001", profileDto);
UserProfileDTO profile = redisService.getMapValue("User:profile", "1001");
```

### 4) 必要时用法：注入 `magusRedisTemplate`

当你需要 Spring Data Redis 原生 API（pipeline/transaction/更细粒度 ops）时，注入：

```java
@Autowired
@org.springframework.beans.factory.annotation.Qualifier("magusRedisTemplate")
private org.springframework.data.redis.core.RedisTemplate<String, Object> magusRedisTemplate;
```

> 约定：key 是 String；value/hashValue 是 JSON（框架已配置好序列化）。

## key 命名规范（必须给可执行规则）

- **优先复用已有常量**：`framework-common` 的 `FrameworkRedisKey`
- **新增 key 统一前缀 + 可读 + 可定位**：`{业务域}:{用途}:{实体}:{id}`（示例：`User:detail:1001`）
- **避免“裸 key”**：不要用 `user`、`data` 这种不可定位的 key
- **批量 key**（集合/Hash）建议用“容器 key + field”模式：例如 `User:profile` 作为 hash key，`userId` 作为 field

可参考（框架已有）：

- `FrameworkRedisKey.REDIS_KEY_PR = "Framework:"`
- `FrameworkRedisKey.ASYNC_TASK_KEY_PR = "Framework:AsyncTask:"`

## TTL 与一致性策略（让用户选对）

输出时至少让用户在这三类里选一种，并说清楚理由：

- **读多写少、允许短暂不一致**：Cache-Aside（读穿回源后 `setCacheObject` + TTL；写入 DB 后 `deleteObject` 让其自然回源）
- **写多读多、对一致性敏感**：写后更（写 DB 后同步更新缓存）或写后删 + 事件通知（视业务复杂度）
- **定时刷新型数据**：定时任务刷新缓存（同时保留 TTL 兜底）

TTL 最小实践：

- **必须设置 TTL**（除非你明确需要永久缓存，并有失效/清理方案）
- **避免雪崩**：对热点 key 使用 TTL 抖动（例如 30min ± random(0..5min)；业务侧实现）

## 高级用法

### 1) 原子计数（`RedisAtomicLong`）

```java
org.springframework.data.redis.support.atomic.RedisAtomicLong seq =
    redisService.getLong("Biz:seq:order");

long next = seq.incrementAndGet();
seq.expire(java.time.Duration.ofDays(1));
```

注意：`BaseRedisService` 内部对 `RedisAtomicLong` 做了本地 map 缓存；更适合“同 key 频繁取用”的场景。

### 2) Pub/Sub（发布消息）

```java
String channel = redisService.prefixChannel("opAlarm:alarm_type_config");
redisService.convertAndSend(channel, payload);
```

说明：`prefixChannel` 会把 `spring.data.redis.database` 加到通道前缀上，避免不同库冲突（格式：`{db}:{channel}`）。

## 常见坑 & 排查清单（实战必备）

### 1) JSON 序列化/类型兼容

`magusRedisTemplate` 使用 JSON 序列化并开启了默认类型信息（polymorphic typing）。

- **同一服务内**：通常没问题
- **跨服务共享缓存**：要确保消费方能识别生产方的类（包名/类名/字段变更要做兼容）
- **DTO 建议稳定**：对外共享的缓存对象建议用稳定 DTO（避免频繁重构导致反序列化失败）

### 2) `keys(pattern)` 风险

`BaseRedisService.keys(pattern)` 是便利方法，但在大 keyspace 下可能带来性能问题。

- 生产环境建议谨慎使用；需要扫描类需求更推荐使用 `SCAN`（如果业务确实需要，应单独实现/封装）

### 3) 连接池/共享连接

框架在开启 Lettuce pool 时会尝试关闭共享连接（`setShareNativeConnection(false)`），以减少池化场景下的共享连接问题；若遇到连接相关异常，优先核对：

- `spring.data.redis.lettuce.pool.enabled=true`
- 连接数配置是否匹配并发（`max-active` 等）

## 你在回答用户时的“输出模板”

当用户问“怎么用/怎么接入/怎么写缓存”，按下面结构输出（可直接复制）：

- **依赖**：给出 `framework-redis` 依赖片段
- **配置**：给出 `spring.data.redis` 的 yml 模板
- **代码**：默认用 `RedisService` 注入（给 set/get/TTL/evict 示例）
- **key**：给出 key 命名建议 + 1～2 个示例（必要时提 `FrameworkRedisKey`）
- **TTL/一致性**：问清读写特征（不必反问确认，直接给推荐策略 + 备选）
- **坑位**：提醒 JSON 类型兼容与 `keys(pattern)` 风险（生产慎用）
