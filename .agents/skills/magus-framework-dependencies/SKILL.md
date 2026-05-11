---
name: magus-framework-dependencies
description: Magus Framework 完整依赖参考手册。包含所有模块的依赖清单、版本管理、使用场景说明，用于指导新业务模块的依赖选择。
---

# Magus Framework 依赖参考手册

> 版本: 6.0.1-SNAPSHOT  
> 更新日期: 2026-03-16  
> 适用范围: 基于 Magus Framework 的新业务模块开发

---

## 目录

1. [版本信息](#版本信息)
2. [框架模块清单](#框架模块清单)
3. [依赖分类说明](#依赖分类说明)
4. [模块详细依赖](#模块详细依赖)
5. [使用指南](#使用指南)
6. [新增依赖流程](#新增依赖流程)

---

## 版本信息

### 核心技术栈版本

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 17 | JDK版本 |
| Spring Boot | 3.5.10 | 基础框架 |
| Spring Cloud | 2025.0.0 | 微服务框架 |
| Spring Cloud Alibaba | 2025.0.0.0 | 阿里微服务组件 |
| Spring Boot Admin | 3.5.7 | 监控管理 |

### 数据库驱动版本

| 数据库 | 驱动版本 |
|--------|----------|
| MySQL | mysql-connector-j (Spring Boot管理) |
| PostgreSQL | 42.7.7 |
| Oracle | ojdbc8 23.5.0.24.07 |
| 达梦(DM) | 8.1.3.140 |
| 人大金仓(Kingbase) | 8.6.1 |
| 海量(Vastbase) | 1.0.0 |
| 南大通用(GBase) | 5.0.0 |
| 优炫(UXDB) | 2.1.2.4a |

### 常用工具版本

| 工具 | 版本 | 用途 |
|------|------|------|
| Lombok | 1.18.42 | 代码生成 |
| Guava | 33.5.0-jre | Google工具库 |
| Apache Commons Lang3 | 3.20.0 | 通用工具 |
| Apache Commons Collections4 | 4.5.0 | 集合工具 |
| Apache Commons Pool2 | 2.13.1 | 连接池 |
| Apache Commons JEXL3 | 3.6.2 | 表达式引擎 |
| EasyExcel | 4.0.3 | Excel处理 |
| Druid | 1.2.12 | 连接池 |
| Knife4j | 4.5.0 | API文档 |
| BouncyCastle | 1.69 | 加密算法 |

---

## 框架模块清单

### 核心模块

| 模块 | artifactId | 说明 | 依赖关系 |
|------|------------|------|----------|
| framework-parent | framework-parent | 父POM，统一版本管理 | 无 |
| framework-dependencies | framework-dependencies | 依赖管理BOM | 无 |
| framework-common | framework-common | 公共工具类 | 独立 |
| framework-core | framework-core | 核心功能 | 依赖 common |

### 数据访问模块

| 模块 | artifactId | 说明 | 依赖关系 |
|------|------------|------|----------|
| framework-persistence-jpa | framework-persistence-jpa | JPA持久化 | 依赖 core, redis, mq |
| framework-redis | framework-redis | Redis缓存 | 依赖 common |
| framework-rtdb | framework-rtdb | 实时数据库 | 依赖 redis |

### 通信模块

| 模块 | artifactId | 说明 | 依赖关系 |
|------|------------|------|----------|
| framework-mq | framework-mq | 消息队列(RabbitMQ) | 依赖 common |
| framework-openfeign | framework-openfeign | HTTP客户端 | 依赖 common |
| framework-stomp | framework-stomp | WebSocket | 依赖 common, redis |
| framework-grpc-lib | framework-grpc-lib | gRPC基础库 | 独立 |
| framework-grpc-client | framework-grpc-client | gRPC客户端 | 依赖 grpc-lib, common |

### 业务模块

| 模块 | artifactId | 说明 | 依赖关系 |
|------|------------|------|----------|
| framework-initial | framework-initial | 系统初始化 | 依赖 core, mq, grpc-client, persistence-jpa |
| framework-pdf | framework-pdf | PDF生成 | 依赖 common, redis(可选) |

---

## 依赖分类说明

### 1. 基础必选依赖

所有业务模块都应该引入的基础依赖：

```xml
<!-- 在 parent 中已管理版本 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
</dependency>

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
</dependency>
```

### 2. 框架模块依赖

根据业务场景选择需要的框架模块：

| 场景 | 推荐依赖 |
|------|----------|
| 基础Web服务 | framework-core |
| 数据库访问(JPA) | framework-persistence-jpa |
| Redis缓存 | framework-redis |
| 消息队列 | framework-mq |
| 服务间调用 | framework-openfeign |
| WebSocket | framework-stomp |
| gRPC调用 | framework-grpc-client |
| PDF生成 | framework-pdf |
| 实时数据库 | framework-rtdb |
| 系统初始化 | framework-initial |

### 3. 数据库驱动依赖

根据使用的数据库选择对应驱动（通常在 facade 模块配置）：

```xml
<!-- MySQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <classifier>og</classifier>
</dependency>

<!-- 达梦 -->
<dependency>
    <groupId>com.dameng</groupId>
    <artifactId>DmJdbcDriver18</artifactId>
</dependency>
<dependency>
    <groupId>com.dameng</groupId>
    <artifactId>DmDialect-for-hibernate6.1</artifactId>
</dependency>

<!-- 其他国产数据库类似... -->
```

---

## 模块详细依赖

### 1. framework-common

**说明**: 公共工具包，提供基础工具类、常量、异常定义等

**主要依赖**:
```xml
<!-- Spring -->
spring-boot-starter
spring-boot-starter-json
spring-boot-admin-starter-client
spring-context-support
spring-data-commons
spring-security-crypto

<!-- Jakarta EE -->
jakarta.servlet-api
jakarta.validation-api

<!-- 工具库 -->
guava
commons-jexl3
easyexcel
knife4j-openapi3-jakarta-spring-boot-starter
bcprov-jdk15to18 (SM2加密)
```

**使用场景**: 所有模块的基础依赖

---

### 2. framework-core

**说明**: 核心功能模块，提供Web服务、配置、监控等能力

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common
framework-grpc-client

<!-- Nacos -->
spring-cloud-starter-alibaba-nacos-config
spring-cloud-starter-alibaba-nacos-discovery

<!-- Spring Boot Starters -->
spring-boot-configuration-processor
spring-boot-starter-logging
spring-boot-starter-web (排除tomcat)
spring-boot-starter-undertow
spring-boot-starter-cache
spring-boot-starter-validation
spring-boot-starter-aop
spring-boot-starter-actuator
```

**使用场景**: 需要提供Web服务的模块

---

### 3. framework-persistence-jpa

**说明**: JPA持久化模块，提供数据库访问能力

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-core
framework-redis
framework-mq

<!-- JPA -->
spring-boot-starter-data-jpa

<!-- 分布式事务 -->
spring-cloud-starter-alibaba-seata

<!-- 连接池 -->
druid-spring-boot-starter

<!-- 多数据库支持 -->
mysql-connector-j
postgresql
DmJdbcDriver18 + DmDialect
ojdbc8
kingbase8 + KesDialect
vastbase-g100
gbase-jdbc
uxdbjdbc
```

**使用场景**: 需要数据库访问的模块

---

### 4. framework-redis

**说明**: Redis缓存模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common

<!-- Redis -->
spring-boot-starter-data-redis
spring-boot-starter-json
commons-pool2
```

**使用场景**: 需要Redis缓存的模块

---

### 5. framework-mq

**说明**: 消息队列模块，基于RabbitMQ

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common

<!-- MQ -->
spring-cloud-stream-binder-rabbit
```

**使用场景**: 需要消息队列的模块

---

### 6. framework-openfeign

**说明**: HTTP客户端模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common

<!-- Feign -->
spring-cloud-starter-openfeign
spring-cloud-starter-loadbalancer
feign-okhttp
```

**使用场景**: 需要调用其他HTTP服务的模块

---

### 7. framework-stomp

**说明**: WebSocket/STOMP模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common
framework-redis

<!-- WebSocket -->
spring-boot-starter-websocket
```

**使用场景**: 需要WebSocket实时通信的模块

---

### 8. framework-grpc-lib / framework-grpc-client

**说明**: gRPC通信模块

**主要依赖**:
```xml
<!-- gRPC -->
grpc-netty-shaded
grpc-stub
grpc-protobuf
protoc

<!-- Spring gRPC -->
grpc-client-spring-boot-starter
netty-tcnative-boringssl-static

<!-- 注解 -->
jakarta.annotation-api
```

**使用场景**: 需要gRPC通信的模块

---

### 9. framework-pdf

**说明**: PDF生成模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-common
framework-redis (optional)

<!-- 模板 -->
spring-boot-starter-freemarker

<!-- iText7 -->
itext7-core
html2pdf
```

**使用场景**: 需要生成PDF的模块

---

### 10. framework-rtdb

**说明**: 实时数据库模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-redis
framework-persistence-jpa

<!-- 连接池 -->
commons-pool2

<!-- 实时数据库 -->
openplant-java-api

<!-- 其他 -->
netty-socketio
kafka_2.11
slf4j-api
```

**使用场景**: 需要访问实时数据库的模块

---

### 11. framework-initial

**说明**: 系统初始化模块

**主要依赖**:
```xml
<!-- 框架内部 -->
framework-core
framework-mq
framework-grpc-client
framework-persistence-jpa

<!-- 配置处理 -->
spring-boot-configuration-processor
```

**使用场景**: 需要系统初始化功能的模块

---

## 使用指南

### 标准业务模块依赖配置

#### 1. base 模块

```xml
<dependencies>
    <!-- 仅需 framework-common -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-common</artifactId>
    </dependency>
</dependencies>
```

#### 2. service 模块

```xml
<dependencies>
    <!-- 基础 -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>xxx-base</artifactId>
    </dependency>
    
    <!-- 根据需求选择 -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-persistence-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-redis</artifactId>
    </dependency>
    
    <!-- 可选 -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-mq</artifactId>
    </dependency>
</dependencies>
```

#### 3. facade 模块

```xml
<dependencies>
    <!-- 内部依赖 -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>xxx-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>xxx-service</artifactId>
    </dependency>
    
    <!-- 基础Web -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-common</artifactId>
    </dependency>
    
    <!-- 可选 -->
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-openfeign</artifactId>
    </dependency>
    
    <!-- 数据库驱动(按需选择) -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
</dependencies>
```

#### 4. client 模块

```xml
<dependencies>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>xxx-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-openfeign</artifactId>
    </dependency>
</dependencies>
```

---

## 新增依赖流程

### 评估清单

在添加新依赖前，请确认以下问题：

1. **功能必要性**
   - [ ] 该功能是否必须使用外部依赖实现？
   - [ ] framework-common 中是否已有类似功能？
   - [ ] 是否可以用现有工具组合实现？

2. **版本兼容性**
   - [ ] 是否与 Spring Boot 3.5.x 兼容？
   - [ ] 是否与 Java 17 兼容？
   - [ ] 是否与其他现有依赖冲突？

3. **维护成本**
   - [ ] 该依赖的社区活跃度如何？
   - [ ] 是否有官方Spring Boot Starter？
   - [ ] 是否有完善的文档？

4. **安全考虑**
   - [ ] 是否存在已知安全漏洞？
   - [ ] 是否需要定期更新版本？

### 审批流程

```
1. 技术选型 → 2. 兼容性测试 → 3. 安全评估 → 4. 文档更新 → 5. 代码审查
```

### 禁止清单

以下类型的依赖应谨慎使用或避免使用：

- ❌ 已停止维护的依赖
- ❌ 与 Spring Boot 版本不兼容的依赖
- ❌ 未经安全评估的加密库
- ❌ 重复功能的依赖（如已有 Jackson 再引入 Gson）

---

## 附录

### 完整依赖树

```
framework-parent (6.0.1-SNAPSHOT)
├── framework-dependencies (BOM)
│   ├── framework-common
│   ├── framework-core
│   ├── framework-persistence-jpa
│   ├── framework-redis
│   ├── framework-mq
│   ├── framework-initial
│   ├── framework-stomp
│   ├── framework-rtdb
│   ├── framework-openfeign
│   ├── framework-pdf
│   ├── framework-grpc-lib
│   └── framework-grpc-client
```

### 外部依赖 BOM

- Spring Boot Dependencies: 3.5.10
- Spring Cloud Dependencies: 2025.0.0
- Spring Cloud Alibaba Dependencies: 2025.0.0.0
- Spring Boot Admin Dependencies: 3.5.7
