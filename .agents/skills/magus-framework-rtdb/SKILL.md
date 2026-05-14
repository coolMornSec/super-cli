---
name: magus-framework-rtdb
description: Magus Cloud 实时数据库(OpenPlant RTDB)访问技能，提供库、表、测点的CRUD操作及实时/历史数据读写能力
version: 5.0.0-SNAPSHOT
author: Magus Cloud Team
tags:
  - rtdb
  - realtime-database
  - openplant
  - magus
  - database
  - java
  - spring-boot
dependencies:
  - com.magus.cloud:framework-rtdb:5.0.0-SNAPSHOT
  - com.magus:jdbc:1.0.5-SNAPSHOT
related_skills: []
---

# framework-rtdb 实时数据库访问技能

## 简介

`framework-rtdb` 是 Magus Cloud 框架提供的实时数据库（Real Time DataBase）访问模块，用于与 Magus OpenPlant 实时数据库进行交互。该模块提供了完整的库、表、测点管理能力，以及实时/历史数据的读写功能。

## 快速开始

```java
@Autowired
private RTDBService rtdbService;

// 读取实时值
Map<String, PointValue> values = rtdbService.getRealByName(
    Arrays.asList("W3.NODE1.TEMP001")
);

// 写入实时值
PointValueRequest req = new PointValueRequest();
req.setGn("W3.NODE1.TEMP001");
req.setAv(25.5);
req.setTm(System.currentTimeMillis());
rtdbService.writeRealByName(Arrays.asList(req));
```

## 配置

```yaml
framework:
  rtdb:
    enabled: true
    host: 192.168.2.87
    port: 8310
    username: sis
    password: openplant
    poolsize: 10
```

## 命名规范

| 概念 | 格式 | 示例 |
|------|------|------|
| 库名 | `库名` | `W3` |
| 全节点名 | `库名.节点名` | `W3.NODE1` |
| 全点名 | `库名.节点名.点名` | `W3.NODE1.TEMP001` |

**注意**：全点名必须大写

## 核心接口

### RTDBService

```java
public interface RTDBService {
    // 数据库操作
    DatabaseResponse getDatabase(String databaseName);
    DatabaseResponse createDatabase(String databaseName);
    
    // 节点表操作
    TableResponse getTable(String tableName);
    TableResponse createTable(String databaseName, String tableName);
    OperateResult updateTable(TableRequest tableRequest);
    
    // 测点操作
    PointResponse getPoint(String pointName);
    PointResponse createPoint(String tableName, PointRequest pointRequest);
    OperateResult updatePoint(PointRequest pointRequest);
    
    // 实时数据
    Map<String, PointValue> getRealByName(Collection<String> pointNames);
    Map<String, OperateResult> writeRealByName(Collection<PointValueRequest> requests);
    
    // 历史数据
    Map<String, List<PointValue>> getHistoryByName(Collection<String> pointNames, 
        Date from, Date to, ValueMode valueMode, int interval);
}
```

## 点类型

| 值 | 类型 | 说明 |
|----|------|------|
| 0 | AX | 模拟量 |
| 1 | DX | 开关量 |
| 4 | R8 | 浮点数 |

## 详细参考文档

- [quick-start.md](./reference/quick-start.md) - 快速开始
- [database-operations.md](./reference/database-operations.md) - 数据库操作
- [table-operations.md](./reference/table-operations.md) - 节点表操作
- [point-operations.md](./reference/point-operations.md) - 测点操作
- [realtime-data.md](./reference/realtime-data.md) - 实时数据操作
- [history-data.md](./reference/history-data.md) - 历史数据操作
- [utils.md](./reference/utils.md) - 工具类与连接池
- [complete-example.md](./reference/complete-example.md) - 完整示例

## 常用代码片段

### 创建测点

```java
PointRequest request = new PointRequest();
request.setGn("W3.NODE1.TEMP001");
request.setRt(0);                 // 模拟量
request.setEd("温度测点");
request.setEu("℃");
request.setTv(100.0F);            // 量程上限
request.setBv(0.0F);              // 量程下限
request.fillDefaultField();       // 填充默认值
PointResponse point = rtdbService.createPoint("W3.NODE1", request);
```

### 读取实时值

```java
PointValue pv = rtdbService.getRealByName(
    Arrays.asList("W3.NODE1.TEMP001")
).get("W3.NODE1.TEMP001");
System.out.println("值: " + pv.getValue());
```

### 读取历史值

```java
List<PointValue> history = rtdbService.getHistoryByName(
    Arrays.asList("W3.NODE1.TEMP001"),
    from, to, ValueMode.RAW, 60
).get("W3.NODE1.TEMP001");
```

### 历史统计

```java
PointValue stat = rtdbService.getHistorySpanTotalByName(
    Arrays.asList("W3.NODE1.TEMP001"),
    from, to, StatisticsMode.MAXV
).get("W3.NODE1.TEMP001");
```

## 注意事项

1. **命名规范**：全点名必须大写，格式为 `库名.节点名.点名`
2. **默认值**：创建点时调用 `fillDefaultField()` 填充默认值
3. **时间戳**：使用毫秒值
4. **异常处理**：操作可能抛出 `RTDBException`
