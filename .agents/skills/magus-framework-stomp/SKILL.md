---
name: magus-framework-stomp
description: 在业务项目中使用 Magus framework-stomp 的实战手册（如何引入依赖、如何用 StompService 发送广播/点对点/按 session 发送、如何读取 HeaderContextHolder 获取当前用户、以及如何用 Redis 中的 session/subscription 信息排障）。当你要在业务侧接入或排查 WebSocket/STOMP 时使用。
---

# STOMP/WebSocket（Magus framework）业务侧使用手册

## 结论（先看这里）

- **业务侧不要自己封装 `SimpMessagingTemplate`**：直接注入并复用框架提供的 `StompService`（`com.magus.cloud.framework.stomp.service.StompService`）。
- 需要当前用户/租户信息时，像 HTTP 一样从 `HeaderContextHolder.getUser()` 获取（框架会在消息处理前后自动绑定/清理）。

## 业务侧接入步骤

### 1）添加依赖（业务项目）

如果当前业务项目内没有引入 `framework-stomp`，需要在业务项目 `pom.xml` 引入（版本用你们统一的 `${framework.version}`）：

```xml
<dependency>
  <groupId>com.magus.cloud</groupId>
  <artifactId>framework-stomp</artifactId>
  <version>${framework.version}</version>
</dependency>
```

### 2）客户端连接点（约定）

- endpoint：`/stomp`（SockJS）
- broker：`/topic`、`/queue`
- app 前缀：`/app`
- user 前缀：`/user`

> 如果你要让服务端在消息处理时能拿到用户信息，客户端握手阶段需要带 header：`magus-user`（URL encode 的 JSON），框架会 decode 并绑定 Principal。

## 业务侧如何发送消息（推荐只用 StompService）

### 广播（topic）

```java
@Autowired
private StompService stompService;

public void broadcast(Object payload) {
  stompService.convertAndSend("/topic/notice", payload);
}
```

### 点对点（按用户 principal）

客户端订阅：`/user/queue/notice`  
服务端推送：

```java
public void notifyUser(String loginId, Object payload) {
  stompService.convertAndSendToUser(loginId, "/queue/notice", payload);
}
```

### 精准推送（按 sessionId）

当你需要“同一用户多端在线时只推某一端”，使用：

```java
public void notifySession(String loginId, String sessionId, Object payload) {
  stompService.convertAndSendToUserWithSession(loginId, sessionId, "/queue/notice", payload);
}
```

> `convertAndSendToUserWithSession` 内部会创建带 `sessionId` 的 headers；若 user 为空，会回退用 `sessionId` 作为 user。

## 业务侧如何处理入站消息（读取 HeaderContextHolder）

当业务用 `@MessageMapping` 或其他方式处理客户端发来的消息时：

- 框架会在 inbound channel 处理前写入 `HeaderContextHolder.setUser(...)`，处理后清理
- 因此你可以直接读取：

```java
BaseUser user = HeaderContextHolder.getUser();
String compCode = user != null ? user.getCompCode() : null;
```

## 排障手册（为什么用户收不到消息）

`StompService` 内置了基于 Redis 的 session 与订阅信息读取能力，可用于快速定位问题：

### 1）用户是否在线（session-user）

```java
Map<String, String> sessionUsers = stompService.getSessionUsers();
```

### 2）某个 session 订阅了哪些主题

```java
Set<String> topics = stompService.getSubscribeBySessionId(sessionId);
```

### 3）全量订阅视图（session-subscribe）

```java
Map<String, Set<String>> all = stompService.getSessionSubscribes();
```

排查思路（按顺序）：

- **是否建立连接**：`getSessionUsers()` 中是否出现该 session？
- **是否订阅正确 destination**：session 的订阅列表里是否包含你推送的 `/topic/...` 或 `/user/queue/...`？
- **推送 destination 是否匹配**：
  - 广播用 `/topic/...`
  - 点对点推送时 destination 传 `/queue/...`，客户端订阅 `/user/queue/...`
- **principal 是否一致**：你传给 `convertAndSendToUser` 的 user（通常 loginId）必须与握手阶段绑定的 Principal 一致。


