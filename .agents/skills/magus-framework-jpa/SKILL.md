---
name: magus-framework-jpa
description: Magus Framework JPA Entity 设计规范，包括 Entity 基类选择、字段定义、Repository/Service 层实现。适用于单数据源场景的基础 JPA 操作。
origin: ECC
---

# Magus Framework JPA Entity 设计规范

基于 `framework-persistence-jpa` 模块，为 Magus Framework 项目设计 JPA Entity。

## 何时启用
* 创建新的 Entity 实体
* 设计数据表结构
* 实现 Repository 层
* 实现 Service 层 CRUD 操作

---

## 一、Entity 基类选择

### 基类体系

```
BaseEntity
    ├── BaseAuditingEntity (审计字段)
    │       └── 包含: id, deleted, createBy, createDate, lastModifiedBy, lastModifiedDate, forceModifiedVersion
    ├── BaseTreeEntity (树结构)
    │       └── 包含: id, deleted, level, seq, parent
    └── BaseTreeAuditingEntity (树+审计)
            └── 包含: id, deleted, level, seq, parent, 审计字段
```

### 包路径

| 数据源     | 包路径建议           |
|---------|-----------------|
| 主库（系统配置等） | `entity/master` |
| 子库（租户数据，默认） | `entity/slave`  |
| 独立数据库   | `entity/`       |

### 选择规则

| 场景 | 基类 | 说明 |
|------|------|------|
| 普通实体 | `BaseEntity` | 包含 id (uuid2, 36位), deleted (逻辑删除) |
| 需要审计信息 | `BaseAuditingEntity` | 在 BaseEntity 基础上增加创建人/创建时间/更新人/更新时间 |
| 树结构 | `BaseTreeEntity` | 在 BaseEntity 基础上增加 level, seq, parent |
| 树结构+审计 | `BaseTreeAuditingEntity` | 同时具备树结构和审计功能 |

---

## 二、Entity 示例

### 普通 Entity

```java
package com.magus.cloud.xxx.biz.entity;

import com.magus.cloud.framework.jpa.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "xxx_info")
@Schema(description = "xxx信息")
public class XxxInfo extends BaseEntity {

    @Schema(description = "名称")
    @Column(name = "name_", nullable = false)
    private String name;

    @Schema(description = "描述")
    @Column(name = "description_")
    private String description;

    @Schema(description = "状态")
    @Column(name = "status_")
    private Integer status;

    @Schema(description = "公司编码")
    @Column(name = "comp_code_", length = 36)
    private String compCode;
}
```

### 审计 Entity

```java
package com.magus.cloud.xxx.biz.entity;

import com.magus.cloud.framework.jpa.entity.BaseAuditingEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "xxx_info")
@Schema(description = "xxx信息")
public class XxxInfo extends BaseAuditingEntity {

    @Schema(description = "名称")
    @Column(name = "name_", nullable = false)
    private String name;

    @Schema(description = "描述")
    @Column(name = "description_")
    private String description;

    @Schema(description = "状态")
    @Column(name = "status_")
    private Integer status;

    @Schema(description = "公司编码")
    @Column(name = "comp_code_", length = 36)
    private String compCode;
}
```

### 树结构 Entity

```java
package com.magus.cloud.xxx.biz.entity;

import com.magus.cloud.framework.jpa.entity.BaseTreeAuditingEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Entity
@Table(name = "xxx_category")
@Schema(description = "xxx分类")
public class XxxCategory extends BaseTreeAuditingEntity<XxxCategory> {

    @Schema(description = "名称")
    @Column(name = "name_", nullable = false)
    private String name;

    @Schema(description = "编码")
    @Column(name = "code_", length = 50)
    private String code;

    @Schema(description = "排序")
    @Column(name = "sort_")
    private Integer sort;
}
```

---

## 三、字段命名规范

### 表名字段

- 表名统一以 `xxx_` 开头，采用小写字母加下划线分隔
- 例如：`xxx_info`、`xxx_category`

### 数据库字段

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 普通字段 | `name_` (下划线+下划线结尾) | `name_`, `description_`, `status_` |
| 外键 | `xxx_id_` | `parent_id_`, `user_id_` |
| 审计字段 | `create_by_`, `create_date_` | `create_by_`, `last_modified_date_` |
| 树字段 | `level_`, `seq_`, `parent_id_` | `level_`, `seq_` |

### Java 字段

使用驼峰命名，与数据库下划线映射：

```java
@Column(name = "name_")
private String name;

@Column(name = "comp_code_")
private String compCode;

@Column(name = "parent_id_")
private String parentId;
```

---

## 四、Repository 层（注：默认是从库）

### 从库 Repository（租户数据）

```java
package com.magus.cloud.xxx.biz.repository;

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

---

## 五、Service 层

### Service 接口

```java
package com.magus.cloud.xxx.biz.service;

import com.magus.cloud.framework.jpa.entity.XxxInfo;
import com.magus.cloud.framework.jpa.service.BaseService;

public interface XxxInfoService extends BaseService<XxxInfo, String> {

}
```

### Service 实现

```java
package com.magus.cloud.xxx.biz.service.impl;

import com.magus.cloud.framework.common.domain.rsp.PageRsp;
import com.magus.cloud.framework.common.domain.req.BaseSearchReq;
import com.magus.cloud.framework.jpa.entity.XxxInfo;
import com.magus.cloud.framework.jpa.persistence.PageUtils;
import com.magus.cloud.xxx.biz.repository.XxxInfoRepository;
import com.magus.cloud.xxx.biz.service.XxxInfoService;
import com.magus.cloud.framework.jpa.service.impl.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class XxxInfoServiceImpl extends BaseServiceImpl<XxxInfo, String> implements XxxInfoService {

    private final XxxInfoRepository xxxInfoRepository;

    public XxxInfoServiceImpl(XxxInfoRepository xxxInfoRepository) {
        this.xxxInfoRepository = xxxInfoRepository;
    }

    public PageRsp<XxxInfo> page(BaseSearchReq searchReq) {
        return PageUtils.getPageRsp(searchReq, xxxInfoRepository);
    }

    public List<XxxInfo> listByCompCode(String compCode) {
        return xxxInfoRepository.findByCompCodeAndDeleted(compCode, false);
    }
}
```

---

## 六、查询工具

### SearchFilter 用法

```java
import com.magus.cloud.framework.jpa.persistence.SearchFilter;
import org.springframework.data.jpa.domain.Specification;
import com.magus.cloud.framework.jpa.persistence.DynamicSpecifications;
import java.util.ArrayList;
import java.util.List;

// 构建查询条件
List<SearchFilter> filters = new ArrayList<>();
filters.add(SearchFilter.equal("compCode", compCode));
filters.add(SearchFilter.equal("deleted", false));
if (keyword != null) {
    filters.add(SearchFilter.like("name", keyword));
}
Specification<XxxInfo> spec = DynamicSpecifications.bySearchFilter(filters, XxxInfo.class);
```

### 常用查询操作

```java
// 等于
SearchFilter.equal("compCode", compCode)
SearchFilter.equal("deleted", false)

// LIKE 查询
SearchFilter.like("name", keyword)          // %keyword%
SearchFilter.startWith("code", prefix)       // prefix%
SearchFilter.endWith("code", suffix)         // %suffix

// 比较
SearchFilter.gt("age", 18)                   // >
SearchFilter.lt("age", 60)                   // <
SearchFilter.ge("price", 100)                // >=
SearchFilter.le("price", 1000)               // <=

// IN 查询
SearchFilter.in("status", Arrays.asList(1, 2, 3))

// 空值判断
SearchFilter.isNull("parentId")
SearchFilter.isNotNull("parentId")
```

---

## 七、关键类速查表

| 类别 | 类名 | 路径 |
|------|------|------|
| 实体基类 | `BaseEntity` | `com.magus.cloud.framework.jpa.entity` |
| 实体基类 | `BaseAuditingEntity` | `com.magus.cloud.framework.jpa.entity` |
| 实体基类 | `BaseTreeEntity` | `com.magus.cloud.framework.jpa.entity` |
| 实体基类 | `BaseTreeAuditingEntity` | `com.magus.cloud.framework.jpa.entity` |
| 仓储-通用 | `BaseRepository` | `com.magus.cloud.framework.jpa.repository` |
| 服务接口 | `BaseService` | `com.magus.cloud.framework.jpa.service` |
| 服务实现 | `BaseServiceImpl` | `com.magus.cloud.framework.jpa.service.impl` |
| 查询条件 | `SearchFilter` | `com.magus.cloud.framework.jpa.persistence` |
| 分页工具 | `PageUtils` | `com.magus.cloud.framework.jpa.persistence` |

---

## 八、Entity 完整示例

### 带索引的 Entity

```java
package com.magus.cloud.xxx.biz.entity;

import com.magus.cloud.framework.jpa.entity.BaseAuditingEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "xxx_info", indexes = {
    @Index(name = "idx_comp_code", columnList = "comp_code_"),
    @Index(name = "idx_status", columnList = "status_"),
    @Index(name = "idx_comp_status", columnList = "comp_code_,status_", unique = true)
})
@Schema(description = "xxx信息")
public class XxxInfo extends BaseAuditingEntity {

    @Schema(description = "名称")
    @Column(name = "name_", nullable = false, length = 100)
    private String name;

    @Schema(description = "编码")
    @Column(name = "code_", nullable = false, unique = true, length = 50)
    private String code;

    @Schema(description = "描述")
    @Column(name = "description_", columnDefinition = "TEXT")
    private String description;

    @Schema(description = "状态: 0-禁用, 1-启用")
    @Column(name = "status_")
    private Integer status = 1;

    @Schema(description = "公司编码")
    @Column(name = "comp_code_", nullable = false, length = 36)
    private String compCode;

    @Schema(description = "备注")
    @Column(name = "remark_")
    private String remark;
}
```

### 常用注解速查

| 注解 | 用途 |
|------|------|
| `@Entity` | 声明为 JPA 实体 |
| `@Table` | 指定表名和索引 |
| `@Column` | 映射数据库字段 |
| `@Id` | 主键（继承 BaseEntity 已包含） |
| `@GeneratedValue` | 主键生成策略（继承 BaseEntity 已配置 uuid2） |
| `@Transient` | 非持久化字段 |
| `@JsonBackReference` | 解决 JSON 循环引用 |
| `@Index` | 索引 |
| `unique = true` | 唯一约束 |

