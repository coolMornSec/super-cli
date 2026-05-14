---
name: magus-framework-jpa-page
description: 面向实战的 Magus framework JPA 分页查询：BaseSearchReq/PagingParam → PageUtils(PageRequest) + SearchFilter/JpaSearchUtils(Specification) + BaseRepository.findAll(spec, pageable) 返回 Page。包含排序、动态条件、AND/OR、IN/LIKE、distinct/join(fetch) 场景提示与常见坑。当用户要“列表分页/条件查询/排序”并使用 framework-persistence-jpa 时使用。
---

# Magus `magus-framework-jpa-page` 分页实战技能

## 你要“做成什么效果”

当用户说或者功能涉及到“我要做分页列表/条件筛选/排序”，你需要输出业务侧可直接照抄的实现，至少包含：

- **依赖**：业务工程依赖 `framework-persistence-jpa`
- **请求入参**：使用 `BaseSearchReq` 或 `PagingParam`（page/size/attr/sort）
- **分页对象**：`PageUtils.page(req)` 或 `PageUtils.buildPageRequest(pagingParam)`
- **动态条件**：`SearchFilter` + `JpaSearchUtils.buildAndSpec/buildOrSpec`
- **Repository**：`extends BaseRepository<Entity, ID>`（已自带 `JpaSpecificationExecutor`）
- **Service**：调用 `repository.findAll(spec, pageRequest)` 返回 `Page<Entity>`
- **返回结构建议**：直接返回 `Page<T>` 或映射成你们的分页 VO（保留 total/size/page/content）

## 模块事实（与分页直接相关）

- `BaseRepository<T, ID>`：`JpaRepository + JpaSpecificationExecutor`（可直接 `findAll(spec, pageable)`）
- `BaseServiceImpl<T, ID>`：已封装 `findAll(spec, pageable)`，业务 service 可继承后复用
- `PageUtils`
  - `page(BaseSearchReq req)`：\(pageNo 从 1 开始\) → `PageRequest.of(page-1, size)`，并处理 `attr/sort`
  - `buildPageRequest(PagingParam)`：同上，额外提供 sort 合并重载
- `SearchFilter`：封装 EQ/LIKE/IN/GT/… 等操作符，并支持 `ignoreCase()`
- `JpaSearchUtils`：把 `SearchFilter` 集合组合成 `Specification`（AND/OR），可传 `distinct` 与 `entityGraph`（关联抓取字段）

## 标准分页写法（业务可照抄）

### 1) Repository（必须这样继承）

```java
public interface UserRepository extends com.magus.cloud.framework.jpa.repository.BaseRepository<UserEntity, String> {
}
```

### 2) Request DTO（最常用：继承/复用 `BaseSearchReq`）

`PageUtils.page(req)` 依赖这些字段：

- `page`：页码（从 1 开始）
- `size`：每页大小
- `attr`：排序字段
- `sort`：排序方向（`asc`/`desc`）

> 业务侧直接复用 `BaseSearchReq`（或你们自己的 req 继承它）即可。

### 3) Service：PageUtils + JpaSearchUtils（动态条件 + 分页 + 排序）

```java
@Service
public class UserQueryService {

  @Autowired
  private UserRepository userRepository;

  public org.springframework.data.domain.Page<UserEntity> page(UserSearchReq req) {
    org.springframework.data.domain.PageRequest pageRequest =
        com.magus.cloud.framework.jpa.persistence.PageUtils.page(req);

    java.util.List<com.magus.cloud.framework.jpa.persistence.SearchFilter> filters = new java.util.ArrayList<>();
    // 示例：按状态等值
    filters.add(com.magus.cloud.framework.jpa.persistence.SearchFilter.equal("status", req.getStatus()));
    // 示例：按名称模糊（contains/like 都可，根据你想要的匹配方式）
    filters.add(com.magus.cloud.framework.jpa.persistence.SearchFilter.contains("name", req.getName()));
    // 示例：时间范围（>=）
    filters.add(com.magus.cloud.framework.jpa.persistence.SearchFilter.ge("createTime", req.getStartTime()));
    // 示例：IN（空集合会返回“空结果”语义）
    filters.add(com.magus.cloud.framework.jpa.persistence.SearchFilter.in("type", req.getTypes()));

    org.springframework.data.jpa.domain.Specification<UserEntity> spec =
        com.magus.cloud.framework.jpa.persistence.JpaSearchUtils.buildAndSpec(filters);

    return userRepository.findAll(spec, pageRequest);
  }
}
```

> **关键点**：框架分页默认认为 `page` 从 1 开始，所以 `PageUtils` 会做 `page-1`。

### 4) AND/OR 组合（按业务需要选）

```java
Specification<UserEntity> andSpec = JpaSearchUtils.buildAndSpec(filters);
Specification<UserEntity> orSpec  = JpaSearchUtils.buildOrSpec(filters);
```

也可以把多个 `Specification` 再 `and/or` 组合：

```java
Specification<UserEntity> spec = JpaSearchUtils.and(spec1, spec2);
```

## 排序（两种来源）

- **请求驱动排序**：通过 `BaseSearchReq.attr/sort` 交给 `PageUtils.page(req)` 生成排序
- **代码固定排序**：使用 `PageUtils.buildPageRequest(pagingParam, sort)` 把固定 sort 与请求 sort 合并

## 常见坑 & 排查清单

### 1) 页码从 1 开始

`PageUtils` 会把 `page` 转成 `page-1`；如果你业务入参是从 0 开始，需要在入参层统一换算，否则会出现“第一页为空/跳页”的错觉。

### 2) IN 空集合语义

`SearchFilter.IN` 在 `DynamicSpecifications` 中对“空集合”会返回 `builder.disjunction()`（即查询结果为空）。

- 如果你想“空集合时忽略条件”，业务侧在加 filter 前先判断集合是否为空。

### 3) LIKE 转义

框架对 LIKE/CONTAINS/STARTWITH/ENDWITH 做了 escape 处理（`EscapeCharacter.of('!')`），可避免用户输入 `%/_` 时的意外匹配。

### 4) join(fetch) + 分页

`JpaSearchUtils.buildAndSpec(filters, entityGraph, distinct)` 支持传入关联抓取字段，并在 count 查询与数据查询做不同处理（分页场景常见）。

- 如果你遇到分页总数不对/重复行，尝试开启 `distinct=true` 并合理设置 fetchedAttrs（entityGraph）。

## 你在回答用户时的“输出模板”

- **分页入参**：`page/size/attr/sort`（强调 page 从 1 开始）
- **分页对象**：`PageRequest pageRequest = PageUtils.page(req)`
- **动态条件**：`List<SearchFilter>` + `JpaSearchUtils.buildAndSpec(...)`
- **查询**：`repository.findAll(spec, pageRequest)` 返回 `Page<T>`
- **坑位**：IN 空集合语义、join(fetch)+distinct、排序字段白名单（必要时业务侧限制）

