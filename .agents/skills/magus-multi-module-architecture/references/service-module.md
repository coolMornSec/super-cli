### 职责与定位

`magus-xxx-service` 负责**业务实现**，典型职责包含：

- 业务 service / entity / repository 等
- 与数据库 / 中间件（如 MQ、ES、缓存、流程引擎等）的交互
- 事务边界的控制

### 包结构建议

基础包路径：

```text
com.magus.cloud.xxx.biz.**.**
```

Claude 在设计时可推荐类似结构：

```text
com.magus.cloud.xxx.biz.service
com.magus.cloud.xxx.biz.entity
com.magus.cloud.xxx.biz.repository
```


示例接口：

entity示例：

entity下分为3种情况，
    1：独立的数据库，entity实体类直接建立在 `com.magus.cloud.xxx.biz.entity` 下；
    2：主库，entity实体类建立在 `com.magus.cloud.file.biz.entity.master` 下；
    3：从库，entity实体类建立在 `com.magus.cloud.file.biz.entity.slave` 下。

```java
import com.magus.cloud.framework.jpa.entity.BaseAuditingEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user")
@Schema(description = "用户")
public class User extends BaseAuditingEntity {
	private static final long serialVersionUID = 1L;

	@Schema(description = "名称")
	@Column(name = "name", length = 100, nullable = false)
	private String name;

	@Schema(description = "code")
	@Column(name = "code", length = 20, nullable = false)
	private String code;

	@Schema(description = "说明")
	@Column(name = "remark", length = 200)
	private String remark;
	
}
```

> 注意：
> 1. entity实体类必须继承 BaseAuditingEntity，BaseAuditingEntity包含了createBy、createDate、lastModifiedBy、lastModifiedDate、id、deleted
> 2. 必须添加@Schema()注解， 注解在类上就是类的描述，注解在参数上就是参数的描述
> 3. 其他注解视情况而定，如果需要对参数内容做正则规范，则添加，如@Pattern，@Size等（非必须）

repository示例：

repository分为3种情况，
    1：独立的数据库，repository类继承BaseRepository<Bean, String>；
    2：主库，repository类继承MasterRepository<Bean, String>；
    3：从库，repository类继承SlaveRepository<Bean, String>。
均建立在 `com.magus.cloud.xxx.biz.repository` 下。

1. 独立的数据库

```java

import com.magus.cloud.xxx.biz.entity.Bean;
import com.magus.cloud.framework.jpa.repository.BaseRepository;

public interface XxxRepository extends BaseRepository<Bean, String> {
}
```

2. master数据库

```java
import com.magus.cloud.xxx.biz.entity.Bean;
import com.magus.cloud.framework.jpa.repository.MasterRepository;

public interface XxxRepository extends MasterRepository<Bean, String> {
}
```

3. slave数据库

```java
import com.magus.cloud.xxx.biz.entity.Bean;
import com.magus.cloud.framework.jpa.repository.SlaveRepository;

public interface XxxRepository extends SlaveRepository<Bean, String> {
}
```

service示例：

接口：

```java
import com.magus.cloud.framework.jpa.service.BaseService;
import com.magus.cloud.xxx.entity.master.Bean;


public interface XxxService extends BaseService<Bean, String> {

  void xxx();

  ... // 其他接口
}

```

实现类:

```java
import com.magus.cloud.framework.jpa.service.impl.BaseServiceImpl;
import com.magus.cloud.xxx.entity.slave.Bean;
import com.magus.cloud.xxx.repository.XxxRepository;
import com.magus.cloud.xxx.service.XxxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.seata.spring.annotation.GlobalTransactional;

@Service
public class XxxServiceImpl extends BaseServiceImpl<Bean, String> implements XxxService {

    @Autowired
    private XxxRepository repository;

    @Override
    @GlobalTransactional(rollbackFor = Exception.class)
    public void xxx() {
    }


    ... // 其他接口的实现，如果示例中有分页，请参考文档 [magus-framework-jpa-page](../../magus-framework-jpa-page/SKILL.md)
}
```

> 注意：事务规范：
> 1. Service 方法必须使用 `@GlobalTransactional`
> 2. Controller 不允许声明事务
> 3. Repository 不允许声明事务
> 4. 分布式事务统一由 Service 控制
> 5. 用户在说明具体的数据源类型的情况下，需要根据数据源类型（独立/主库/从库）选择对应的 Repository 父类（BaseRepository/MasterRepository/SlaveRepository）以及将实体类创建到对应的包路径下（`com.magus.cloud.xxx.biz.entity` / `com.magus.cloud.xxx.biz.entity.master` / `com.magus.cloud.xxx.biz.entity.slave`），默认是从库

### 典型依赖示例

具体依赖根据业务而定，例如集成 xxx：

```xml
<dependency>
    <groupId>com.magus.cloud</groupId>
    <artifactId>magus-xxx-base</artifactId>
</dependency>
```