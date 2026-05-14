---
name: magus-multi-module-architecture
description: >
  当用户提到新建、创建、搭建、初始化任何 magus-xxx 系列应用、微服务、后端项目时必须使用此技能；
  或者用户用“业务语义”描述要新建一个应用（例如：用户中心、订单中心、消息中心、配置中心等），但未明确给出 magus-xxx 名称时，也必须使用此技能，并自动推导应用名（magus-xxx）。
  包含：规划 Maven 模块划分、模块依赖关系、基础包结构、项目骨架以及部署形态。
  用于基于 magus-xxx-base / client / facade / service 的标准多模块架构，

tags:
  - architecture
  - project-structure
  - multi-module
  - magus

category: architecture
allowed-tools: ["AskUserQuestion", "READ", "Edit", "Glob"]
priority: high
confidence: high
---

# Magus 多模块架构技能（Magus Multi-Module Architecture Skill）

## 目标

在新建一个 `magus-{Slug}` 系列应用（如 `magus-user`、`magus-order` 等）时，为 Claude 提供一套可复用的**多模块架构设计与工程骨架生成规范**（`{Slug}` 替换为具体业务名）

本 Skill 的目标：

- 统一 **模块划分**：`magus-{Slug}-base` / `magus-{Slug}-client` / `magus-{Slug}-facade` / `magus-{Slug}-service` 分工清晰
- 统一 **包结构**：`com.magus.cloud.{Slug}.base/client/facade/biz` 等包路径规范一致
- 统一 **依赖关系**：避免循环依赖，每层只依赖该依赖的下游层
- 统一 **部署方式**：`facade` 作为启动与对外暴露层，Docker 镜像与 `application.yml` 端口配置正确匹配
- 自动生成 **可编译的项目骨架**

---

# 执行策略（Execution Policy）

当本 Skill 被触发时，Claude 必须遵循以下规则：

1. **优先生成工程结构，而不是只给设计建议**
2. 如果在真实仓库环境中，应 **直接创建文件**
3. 所有生成代码必须 **可以通过编译**
4. 必须遵守 **Magus 标准模块结构**
5. 除非用户明确说明“只讨论设计”，否则必须生成 **代码骨架**


## 总体模块架构概览

一个标准的新应用通常包括以下 Maven 模块：

| 模块               | 职责 |
|------------------|----|
| magus-{Slug}-base   | 基础类与通用定义层（DTO、枚举、常量、工具、Result 枚举、初始化数据等） |
| magus-{Slug}-client | 对外 Feign Client 层（供其他服务调用当前应用接口） |
| magus-{Slug}-service | 业务实现层（biz/service/entity/repository 等核心业务逻辑） |
| magus-{Slug}-facade | 对外暴露 & 启动层（Controller、启动类、应用配置、打包） |
| 其他模块（可选）    | 如 `magus-{Slug}-job`、`magus-{Slug}-admin` 等，由用户额外说明时再设计 |

Claude 在生成新应用架构时，应按以下结构输出：

1️⃣ 项目总体结构  
2️⃣ Maven 模块列表  
3️⃣ 模块依赖关系  
4️⃣ 标准包结构  
5️⃣ 核心代码骨架  
6️⃣ Docker 与部署配置

---

# 模块依赖关系

Claude 应根据用户描述（如是否有工作流、搜索、缓存等）补充其它依赖，并确保：

- `client` 依赖 `base`
- `service` 依赖 `base`
- `facade` 依赖 `service` 和 `base`
- 避免出现反向依赖或循环依赖

## 模块一：`magus-xxx-base`

负责存放**不依赖业务实现、可被多个模块（client/facade/service）复用的基础定义**，使用 `Read` 工具读取 `references/base-module.md`并生成这个模块的代码

---

## 模块二：`magus-xxx-client`

用于对外暴露 **Feign Client 接口**，供其他微服务调用的 API，使用 `Read` 工具读取 `references/client-module.md`并生成这个模块的代码

---

## 模块三：`magus-xxx-facade`

**对外暴露层 + 可部署单体**
> ⚠️ **强制要求**：必须先完成本步骤的用户信息收集，**在收到用户回答之前，禁止执行后续任何步骤**。

1. **收集配置信息**：使用 `AskUserQuestion` 工具，一次性收集以下所有配置（用户可直接回车接受默认值）：
  - **Nacos 服务器地址**（默认：127.0.0.1:8848）
  - **Nacos 命名空间**（默认：public）
  - **Nacos 用户名**（默认：nacos）
  - **Nacos 密码**（默认：nacos）
  - **服务端口号**（建议 18xxx 区间，如 18001）
2. 收集答案后使用 `Read` 工具读取 `references/facade-module.md`并生成这个模块的代码

---

## 模块四：`magus-xxx-service`

负责**业务实现**，使用 `Read` 工具读取 `references/service-module.md`并生成这个模块的代码

---

## Docker 与部署规范

项目内通常有一个顶层 `Dockerfile`，用于打包 `magus-xxx-facade` 生成的 jar，，使用 `Read` 工具读取 `references/docker-deploy.md`并生成这个文件的代码

---

## Claude 使用本 Skill 时的流程（重要）

当用户说「我要开发一个 magus-xxx 应用」或「我要开发用户中心」或「帮我设计这个新模块 magus-xxx 的结构」时，Claude应：

### Step 0 从“业务语义”自动推导应用名

如果用户没有明确给出 `magus-xxx`，而是说“新建一个用户中心/订单中心/xx中心/xx服务”等，Claude 必须：

- **自动生成应用名**：`magus-{slug}`
- **自动生成包名片段**：`com.magus.cloud.{slug}`
- **把本次会话的根应用名记为常量**：后续所有“继续实现/增加接口/加模块/加表/加业务代码”的动作，默认都基于这个 `magus-{slug}` 目录与模块集合进行（除非用户明确切换到另一个应用）

#### slug 推导规则（确定性，不要反问用户确认）

1) **优先使用常见中心/域映射表**（命中即用）：

| 业务描述 | 推导的应用名 | 包名片段 |
|---------|-------------|---------|
| 用户中心 / 账号中心 / 会员中心 / 身份中心 | magus-user | com.magus.cloud.user |
| 权限中心 / 认证中心 / 登录中心 | magus-auth | com.magus.cloud.auth |
| 订单中心 | magus-order | com.magus.cloud.order |
| 支付中心 | magus-pay | com.magus.cloud.pay |
| 商品中心 / 货品中心 | magus-product | com.magus.cloud.product |
| 库存中心 | magus-stock | com.magus.cloud.stock |
| 消息中心 / 通知中心 | magus-message | com.magus.cloud.message |
| 配置中心 | magus-config | com.magus.cloud.config |
| 网关 | magus-gateway | com.magus.cloud.gateway |
| 文件中心 / 对象存储 | magus-file | com.magus.cloud.file |
| 搜索中心 | magus-search | com.magus.cloud.search |
| 报表中心 / BI | magus-report | com.magus.cloud.report |

2) 未命中映射表时：

- 将业务名翻译/转写为简短英文 `kebab-case`（尽量 1～2 个词），作为 `{slug}`
- 只保留小写字母、数字与连字符；去掉“中心/服务/系统/平台”等泛化后缀

> 例：用户说“新建一个用户中心” → `magus-user`；包名根：`com.magus.cloud.user.*`；模块：`magus-user-base/client/service/facade`。

### Step 1 读取 references

- 阅读规范（必须执行）
  - 必须逐一读取并遵循以下参考文件（不得跳过）：
    - `skills/magus-multi-module-architecture/references/base-module.md`
    - `skills/magus-multi-module-architecture/references/client-module.md`
    - `skills/magus-multi-module-architecture/references/service-module.md`
    - `skills/magus-multi-module-architecture/references/facade-module.md`
    - `skills/magus-multi-module-architecture/references/docker-deploy.md`
  - 输出时必须明确列出“已读取的 reference 文件清单”，并给出本次生成将遵循的关键约束点（至少覆盖：DTO 继承体系、返回包装、ResultEnum/i18n、Service 事务规范、Entity/Repository master-slave 约定、Facade 配置模板、Dockerfile 约定）。

### Step 2 生成 Maven 聚合工程

创建以下模块结构（以 `magus-{slug}` 为例）：

```
magus-{slug}/
├── pom.xml                          # 父 POM（聚合工程）
├── Dockerfile                       # Docker 打包配置
├── magus-{slug}-base/               # 基础类与通用定义层
│   ├── pom.xml
│   └── src/main/java/com/magus/cloud/{slug}/base/
│       ├── constants/
│       ├── dto/
│       │   ├── req/
│       │   └── rsp/
│       ├── enums/
│       ├── result/
│       └── utils/
├── magus-{slug}-client/             # 对外 Feign Client 层
│   ├── pom.xml
│   └── src/main/java/com/magus/cloud/{slug}/client/api/
├── magus-{slug}-service/            # 业务实现层
│   ├── pom.xml
│   └── src/main/java/com/magus/cloud/{slug}/biz/
│       ├── entity/
│       ├── repository/
│       └── service/
│           └── impl/
└── magus-{slug}-facade/             # 对外暴露 & 启动层
    ├── pom.xml
    └── src/main/java/com/magus/cloud/{slug}/facade/
        ├── Application.java
        └── controller/
```

---

### Step 3: 模块依赖关系

```
                    +-------------------------+
                    |    magus-{slug}-base    |
                    +------------+------------+
                                 |
            +--------------------+-------------------+
            |                                        |
+-----------v----------+                 +-----------v----------+
|  magus-{slug}-client |                 | magus-{slug}-service |
+----------------------+                 +-----------+----------+
                                                     |
                                         +-----------v----------+
                                         | magus-{slug}-facade  |
                                         +----------------------+
```

---


### Step 4: 父 POM 规范

> ⚠️ **强制要求**：必须先完成本步骤的用户信息收集，**在收到用户回答之前，禁止执行 Step 5 及后续任何步骤**。

**立即调用 `AskUserQuestion` 工具**，一次性收集以下所有配置（用户可直接回车接受默认值）：

1. **项目版本**（默认：`5.0.1-SNAPSHOT`）
2. **Framework 版本**（默认：`5.0.0`）
3. **正式版本私服id**（默认：`magus`）
4. **正式版本私服地址**（默认：`http://220.248.70.147:58081/repository/maven-releases` ）
5. **开发版本私服id**（默认：`magus`）
6. **开发版本私服地址**（默认：`http://220.248.70.147:58081/repository/maven-snapshots`，id: `magus`）
7. **SCM 地址**（默认：`scm:git:https://dev.magustek.com/bigdata/magus-basic-platform/magus-{slug}/magus-{slug}.git`）

收集完用户回答后，将以下模板中的占位符替换为实际值，再生成 `pom.xml`：

- `{project_version}` → 默认值或者用户填写的项目版本
- `{framework_version}` → 默认值或者用户填写的 Framework 版本
- `{release_repo_id}` → 默认值或者用户填写的正式版本私服id
- `{release_repo_url}` → 默认值或者用户填写的正式版本私服地址
- `{snapshot_repo_id}` → 默认值或者用户填写的开发版本私服id
- `{snapshot_repo_url}` → 默认值或者用户填写的开发版本私服地址
- `{scm_url}` → 默认值或者用户填写的 SCM 地址

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.magus.cloud</groupId>
    <artifactId>magus-{slug}</artifactId>
    <version>${revision}</version>
    <packaging>pom</packaging>

    <properties>
        <revision>{project_version}</revision>
        <framework.version>{framework_version}</framework.version>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <modules>
        <module>magus-{slug}-base</module>
        <module>magus-{slug}-client</module>
        <module>magus-{slug}-service</module>
        <module>magus-{slug}-facade</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.magus.cloud</groupId>
                <artifactId>framework-dependencies</artifactId>
                <version>${framework.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.magus.cloud</groupId>
                <artifactId>magus-{slug}-base</artifactId>
                <version>${revision}</version>
            </dependency>
            <dependency>
                <groupId>com.magus.cloud</groupId>
                <artifactId>magus-{slug}-client</artifactId>
                <version>${revision}</version>
            </dependency>
            <dependency>
                <groupId>com.magus.cloud</groupId>
                <artifactId>magus-{slug}-service</artifactId>
                <version>${revision}</version>
            </dependency>
            <dependency>
                <groupId>com.magus.cloud</groupId>
                <artifactId>magus-{slug}-facade</artifactId>
                <version>${revision}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <distributionManagement>
        <repository>
            <id>{release_repo_id}</id>
            <url>{release_repo_url}</url>
        </repository>
        <snapshotRepository>
            <id>{snapshot_repo_id}</id>
            <url>{snapshot_repo_url}</url>
        </snapshotRepository>
    </distributionManagement>

    <scm>
        <connection>{scm_url}</connection>
        <developerConnection>{scm_url}</developerConnection>
        <tag>HEAD</tag>
    </scm>
</project>
```

---

### Step 5: 各模块 POM 依赖

**magus-{slug}-base/pom.xml:**
```xml
<dependencies>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-common</artifactId>
    </dependency>
</dependencies>
```

**magus-{slug}-client/pom.xml:**
```xml
<dependencies>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>magus-{slug}-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-openfeign</artifactId>
    </dependency>
</dependencies>
```

**magus-{slug}-service/pom.xml:**
```xml
<dependencies>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>magus-{slug}-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-persistence-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>framework-initial</artifactId>
    </dependency>
</dependencies>
```

**magus-{slug}-facade/pom.xml:**
```xml
<dependencies>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>magus-{slug}-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>magus-{slug}-client</artifactId>
    </dependency>
    <dependency>
        <groupId>com.magus.cloud</groupId>
        <artifactId>magus-{slug}-service</artifactId>
    </dependency>
</dependencies>

<build>
<finalName>${parent.artifactId}</finalName>
<plugins>
    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <executions>
            <execution>
                <goals>
                    <goal>build-info</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
            <mainClass>com.magus.cloud.{slug}.facade.Application</mainClass>
        </configuration>
        <executions>
            <execution>
                <goals>
                    <goal>repackage</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
</plugins>
</build>
```

---

### Step 6: 生成基础代码骨架

**base 模块:**

- `{Slug}Req.java` - 继承 `BaseReq`
- `{Slug}SearchReq.java` - 继承 `BaseSearchReq`
- `{Slug}Rsp.java` - 继承 `BaseRsp`
- `{Slug}ResultEnum.java` - 实现 `ResultEnumBase`
- `messages.properties` / `messages_en.properties`

**client 模块:**

- `{Slug}RestApi.java` - Feign Client 接口

**service 模块:**

生成该模块前使用 `AskUserQuestion` 工具向用户提问,使用主库、从库还是独立的库，根据用户选择使用 `magus-framework-datasource` 技能
使用 `magus-framework-jpa` 技能 生成 Entity, Repository, Service

- `{Slug}Entity.java` - 继承 `BaseAuditingEntity`，
- `{Slug}Repository.java` - 继承 `BaseRepository`
- `{Slug}Service.java` / `{Slug}ServiceImpl.java`保持现状
- 涉及异常处理 - 使用 `magus-framework-exception` 技能
- 涉及分页处理 - 使用 `magus-framework-jpa-page` 技能

**facade 模块:**

- `Application.java` - Spring Boot 启动类
- `{Slug}Controller.java` - REST 接口，使用 `magus-framework-rest-api` 技能
- `{Slug}Controller.java` - 菜单和功能组的权限，使用 `magus-framework-initial` 技能
- `application.yml` - 应用配置

- 最小生成代码集合：

```text
magus-xxx/
 ├── pom.xml
 ├── Dockerfile
 ├── magus-xxx-base
 │   ├── {Slug}Req
 │   ├── {Slug}SearchReq
 │   ├── {Slug}Rsp
 │   └── {Slug}ResultEnum
 │   └── messages.properties
 │   └── messages_en.properties
 │   └── pom.xml
 ├── magus-{Slug}-client
 │   └── {Slug}RestApi
 │   └── pom.xml
 ├── magus-{Slug}-service
 │   ├── {Slug}Entity
 │   ├── {Slug}Repository
 │   ├── {Slug}Service
 │   └── {Slug}ServiceImpl
 │   └── pom.xml
 └── magus-{Slug}-facade
     ├── Application
     ├── {Slug}Controller
     └── application.yml
 │   └── pom.xml
```
---

### Step 7 生成或校验 Dockerfile

```dockerfile
FROM openjdk:17-oracle
MAINTAINER magus
EXPOSE 18{xxx}   # 与应用配置的 server.port 一致
ENV TZ=Asia/Shanghai
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ADD magus-{slug}-facade/target/*.jar app.jar
ENTRYPOINT java \
  --add-opens=java.base/java.lang=ALL-UNNAMED \
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \
  -Djava.security.egd=file:/dev/./urandom \
  -jar /app.jar
```

- 检查 `EXPOSE` 与 `application.yml` 中 `server.port` 是否一致
- 检查 jar 路径是否指向 `magus-{Slug}-facade/target/*.jar`
- 若不一致，应主动提示并给出修正建议

---

### Step 8 优先自动生成，而不是只给文字建议

代码生成完成后，**必须**按以下检查清单执行，不可跳过：

- [ ] 确认 Dockerfile 的 EXPOSE 端口与 application.yml server.port 一致
- [ ] 确认所有模块依赖方向正确（base → client/service → facade）
- [ ] 运行编译验证：`mvn -DskipTests clean package`（必须通过，否则修复后重新验证）

---

## 输出清单

生成完成后向用户输出：
1. ✅ 项目总体结构
2. ✅ Maven 模块列表及职责
3. ✅ 模块依赖关系图
4. ✅ 标准包结构
5. ✅ 核心代码骨架清单
6. ✅ Docker 与部署配置
7. ✅ 编译验证结果

只要本 Skill 被启用，Claude 就应按照上述规范，**主动给出模块划分、pom 依赖、包结构、配置与 Docker 打包的完整建议和初始模板**，而不是只生成零散代码段。