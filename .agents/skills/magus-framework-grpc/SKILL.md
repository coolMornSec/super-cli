---
name: magus-framework-grpc
description: 应用 Magus framework 的 gRPC client 约定（HeaderClientInterceptor、既有 client service 如 UserClientService/RoleClientService/ResourceClientService、standalone 鉴权对接）。当新增或排查 gRPC 调用、拦截器、Metadata header 或 framework-grpc 集成时使用。
---

# gRPC 使用规范（Magus framework）

## 默认组件

- `HeaderClientInterceptor`：在 gRPC client 侧为调用附加 header（`Metadata`）
- 既有 client service：优先复用 `UserClientService`/`RoleClientService`/`ResourceClientService`（如适用）

## 与鉴权集成

- `spring.profiles.active=standalone` 模式下，HTTP 请求会通过 gRPC `UserClientService.checkResourceOnUser(...)` 做资源鉴权（见 `ServiceHeaderInterceptor`）。


