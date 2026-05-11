# Quick Start - 快速开始

## 1. 添加依赖

```xml
<dependency>
    <groupId>com.magus.cloud</groupId>
    <artifactId>framework-rtdb</artifactId>
    <version>5.0.0-SNAPSHOT</version>
</dependency>
```

## 2. 配置文件

```yaml
framework:
  rtdb:
    enabled: true
    host: 192.168.2.87
    port: 8310
    username: sis
    password: openplant
    db-name: RTDB
    driver-class-name: com.magus.jdbc.Driver
    poolsize: 10
```

## 3. 注入使用

```java
@Autowired
private RTDBService rtdbService;
```

## 4. 命名规范

| 概念 | 格式 | 示例 |
|------|------|------|
| 库名 | `库名` | `W3`, `TEST` |
| 全节点名 | `库名.节点名` | `W3.NODE1` |
| 全点名 | `库名.节点名.点名` | `W3.NODE1.TEMP001` |

**注意**：全点名必须大写

## 5. 最简单的示例

```java
// 读取实时值
Map<String, PointValue> values = rtdbService.getRealByName(
    Arrays.asList("W3.NODE1.TEMP001")
);
PointValue pv = values.get("W3.NODE1.TEMP001");
System.out.println("值: " + pv.getValue());

// 写入实时值
PointValueRequest req = new PointValueRequest();
req.setGn("W3.NODE1.TEMP001");
req.setAv(25.5);
req.setTm(System.currentTimeMillis());
req.setDs(0);
rtdbService.writeRealByName(Arrays.asList(req));
```
