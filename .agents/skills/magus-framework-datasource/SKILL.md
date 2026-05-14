---
name: magus-framework-datasource
description: Magus Framework 多数据源/分库能力，包括 MasterRepository/SlaveRepository、@OpeDatabase 注解、动态数据源切换、租户子库路由等。
---

# Magus Framework 多数据源/分库规范

基于 `framework-persistence-jpa` 模块，为 Magus Framework 项目提供多数据源访问能力，支持主库（系统配置）、从库（租户数据）以及动态数据源切换。

## 何时启用
* 需要访问数据源
* 需要访问主库（系统配置、字典等公共数据）
* 需要访问租户子库（业务数据按公司隔离）
* 需要动态切换数据源（根据参数路由到不同数据库）
* 实现分库分表的数据访问层

---

## 一、数据源体系

### 数据源类型规范

| 数据源 | 用途 | 典型场景 |
|--------|------|----------|
| 主库 (Master) | 系统级配置、字典、公共数据 | 系统参数、用户权限、配置中心 |
| 从库 (Slave) | 租户业务数据 | 订单、客户、业务单据 |
| 动态数据源 | 根据上下文切换 | 多租户 SaaS、分库分表 |

### Repository 体系规范

```
BaseRepository
    ├── MasterRepository (主库访问)
    └── SlaveRepository (从库访问，支持动态路由)
```

---

## 二、Repository 层实现

### 从库 Repository（租户数据）

使用 `SlaveRepository` 访问租户子库，支持根据 Header 中的 `compCode` 自动路由：

```java
package com.magus.cloud.xxx.biz.repository.slave;

import com.magus.cloud.framework.jpa.entity.XxxInfo;
import com.magus.cloud.framework.jpa.repository.SlaveRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XxxInfoRepository extends SlaveRepository<XxxInfo, String> {

    List<XxxInfo> findByCompCodeAndDeleted(String compCode, Boolean deleted);

    List<XxxInfo> findByCompCodeAndStatus(String compCode, Integer status);
}
```

### 主库 Repository（系统配置）

使用 `MasterRepository` 访问主库：

```java
package com.magus.cloud.xxx.biz.repository.master;

import com.magus.cloud.framework.jpa.entity.SysConfig;
import com.magus.cloud.framework.jpa.repository.MasterRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SysConfigRepository extends MasterRepository<SysConfig, String> {

    SysConfig findByConfigKey(String configKey);
}
```

---

## 三、动态数据源切换

### @OpeDatabase 注解

当 Header 无法自动提供租户信息时（如无 token 的内部调用、定时任务等），使用 `@OpeDatabase` 手动指定数据源：

```java
import com.magus.cloud.framework.jpa.annotation.OpeDatabase;
import com.magus.cloud.framework.jpa.annotation.ParamType;

@Service
public class XxxService {

    // 根据公司编码切换子库
    public List<XxxInfo> listByCompanyCode(@OpeDatabase(ParamType.COMPANY_CODE) String compCode) {
        return xxxInfoRepository.findAll();
    }

    // 根据公司ID切换子库
    public List<XxxInfo> listByCompanyId(@OpeDatabase(ParamType.COMPANY_ID) String companyId) {
        return xxxInfoRepository.findAll();
    }

    // 直接指定数据库名称
    public List<XxxInfo> listByDatabaseName(@OpeDatabase(ParamType.DATABASE_NAME) String databaseName) {
        return xxxInfoRepository.findAll();
    }
}
```

### ParamType 参数类型

| 参数类型 | 说明 | 使用场景 |
|----------|------|----------|
| `COMPANY_CODE` | 根据公司编码路由 | 已知公司编码 |
| `COMPANY_ID` | 根据公司ID路由 | 已知公司ID |
| `DATABASE_NAME` | 直接指定数据库名 | 明确知道目标库 |

### 使用约束

- `@OpeDatabase` 只能用于方法参数上
- 注解会触发 `AspectDatabaseQuery` 切面，在方法执行前切换数据源
- 方法执行完成后，数据源会自动恢复

---

## 四、分库模式速记

| 场景 | Repository | 切面行为 |
|------|------------|----------|
| 主库访问 | `MasterRepository` | 设置为 `CommonConstants._MASTER_DATASOURCE` |
| 子库访问（自动） | `SlaveRepository` | 根据 Header 中的 `compCode` 自动路由 |
| 子库访问（手动） | `SlaveRepository` + `@OpeDatabase` | 根据注解参数设置数据源 |

### 自动路由流程

```
请求 → HeaderContextHolder获取compCode 
    → SlaveRepository方法调用 
    → OpeDatabaseAspect拦截 
    → DynamicDataSourceContextHolder设置数据源 
    → 执行SQL 
    → 清理数据源上下文
```

### 手动指定流程

```
方法调用 → 检测@OpeDatabase 
    → 解析参数值 
    → OpeDatabaseAspect拦截 
    → DynamicDataSourceContextHolder设置数据源 
    → 执行SQL 
    → 清理数据源上下文
```

---

## 五、Service 层示例

### 主库 Service 实现

```java
package com.magus.cloud.xxx.biz.service.impl;

import com.magus.cloud.framework.jpa.entity.SysConfig;
import com.magus.cloud.framework.jpa.service.impl.BaseServiceImpl;
import com.magus.cloud.xxx.biz.repository.master.SysConfigRepository;
import com.magus.cloud.xxx.biz.service.SysConfigService;
import org.springframework.stereotype.Service;

@Service
public class SysConfigServiceImpl extends BaseServiceImpl<SysConfig, String> 
        implements SysConfigService {

    private final SysConfigRepository sysConfigRepository;

    public SysConfigServiceImpl(SysConfigRepository sysConfigRepository) {
        this.sysConfigRepository = sysConfigRepository;
    }

    public SysConfig getConfigByKey(String configKey) {
        return sysConfigRepository.findByConfigKey(configKey);
    }
}
```

### 从库 Service 实现（带动态切换）

```java
package com.magus.cloud.xxx.biz.service.impl;

import com.magus.cloud.framework.common.domain.rsp.PageRsp;
import com.magus.cloud.framework.common.domain.req.BaseSearchReq;
import com.magus.cloud.framework.jpa.entity.XxxInfo;
import com.magus.cloud.framework.jpa.persistence.PageUtils;
import com.magus.cloud.framework.jpa.service.impl.BaseServiceImpl;
import com.magus.cloud.framework.jpa.annotation.OpeDatabase;
import com.magus.cloud.framework.jpa.annotation.ParamType;
import com.magus.cloud.xxx.biz.repository.slave.XxxInfoRepository;
import com.magus.cloud.xxx.biz.service.XxxInfoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class XxxInfoServiceImpl extends BaseServiceImpl<XxxInfo, String> 
        implements XxxInfoService {

    private final XxxInfoRepository xxxInfoRepository;

    public XxxInfoServiceImpl(XxxInfoRepository xxxInfoRepository) {
        this.xxxInfoRepository = xxxInfoRepository;
    }

    // 普通查询 - 自动从 Header 获取 compCode
    public PageRsp<XxxInfo> page(BaseSearchReq searchReq) {
        return PageUtils.getPageRsp(searchReq, xxxInfoRepository);
    }

    // 根据公司编码查询 - 手动指定数据源
    public List<XxxInfo> listByCompanyCode(@OpeDatabase(ParamType.COMPANY_CODE) String compCode) {
        return xxxInfoRepository.findByCompCodeAndDeleted(compCode, false);
    }

    // 根据数据库名查询 - 直接指定数据源
    public List<XxxInfo> listByDbName(@OpeDatabase(ParamType.DATABASE_NAME) String dbName) {
        return xxxInfoRepository.findAll();
    }
}
```

---

## 六、多数据源配置

### 配置文件示例

```yaml
spring:
  datasource:
    # 主库配置
    master:
      url: jdbc:mysql://localhost:3306/magus_master?useUnicode=true&characterEncoding=utf8
      username: root
      password: xxx
      driver-class-name: com.mysql.cj.jdbc.Driver
    # 从库模板配置（实际库名会根据租户动态生成）
    slave:
      url-prefix: jdbc:mysql://localhost:3306/
      url-suffix: ?useUnicode=true&characterEncoding=utf8
      username: root
      password: xxx
      driver-class-name: com.mysql.cj.jdbc.Driver
```

### 动态数据源注册

框架会自动根据租户信息动态创建数据源并注册到 `DynamicRoutingDataSource` 中。

---

## 七、关键类速查表

| 类别 | 类名 | 路径 | 说明 |
|------|------|------|------|
| 仓储-主库 | `MasterRepository` | `com.magus.cloud.framework.jpa.repository` | 主库数据访问 |
| 仓储-从库 | `SlaveRepository` | `com.magus.cloud.framework.jpa.repository` | 从库数据访问（支持动态路由） |
| 数据源注解 | `@OpeDatabase` | `com.magus.cloud.framework.jpa.annotation` | 动态数据源切换注解 |
| 参数类型 | `ParamType` | `com.magus.cloud.framework.jpa.annotation` | 数据源路由参数类型 |
| 数据源上下文 | `DynamicDataSourceContextHolder` | `com.magus.cloud.framework.jpa.datasource` | 线程级数据源上下文 |
| 动态数据源 | `DynamicRoutingDataSource` | `com.magus.cloud.framework.jpa.datasource` | 动态路由数据源实现 |
| 数据源切面 | `OpeDatabaseAspect` | `com.magus.cloud.framework.jpa.aspect` | 处理 @OpeDatabase 注解 |
| 查询切面 | `AspectDatabaseQuery` | `com.magus.cloud.framework.jpa.aspect` | 处理 Repository 层数据源切换 |

---

## 八、最佳实践

### 1. 主从库选择原则

- **主库 (MasterRepository)**: 系统配置、字典、公共数据、跨租户数据
- **从库 (SlaveRepository)**: 租户业务数据、需要按公司隔离的数据

### 2. 动态切换使用场景

- 定时任务内部调用（无用户上下文）
- 后台管理跨租户查询
- 数据迁移/同步场景
- 无 Token 的内部服务调用

### 3. 注意事项

- 避免在事务中切换数据源（可能导致数据不一致）
- `@OpeDatabase` 只在当前方法调用有效，嵌套调用需重新注解
- 数据源名称大小写敏感，确保与配置一致

### 4. 事务处理

```java
// 主库事务
@Transactional(value = "masterTransactionManager")
public void masterTxOperation() {
    // 主库操作
}

// 从库事务（默认）
@Transactional
public void slaveTxOperation() {
    // 从库操作
}
```

---

## 九、完整示例

### 多数据源混合使用场景

```java
@Service
public class DataSyncService {

    @Autowired
    private SysConfigRepository sysConfigRepository;  // 主库
    
    @Autowired
    private XxxInfoRepository xxxInfoRepository;      // 从库

    // 从主库读取配置，同步到指定租户库
    public void syncToTenant(@OpeDatabase(ParamType.COMPANY_CODE) String compCode) {
        // 1. 从主库读取系统配置（自动路由到主库）
        SysConfig config = sysConfigRepository.findByConfigKey("sync.config");
        
        // 2. 查询租户数据（根据 @OpeDatabase 路由到指定租户库）
        List<XxxInfo> tenantData = xxxInfoRepository.findByCompCodeAndDeleted(compCode, false);
        
        // 3. 执行同步逻辑...
    }
}
```
