# Utils - 工具类

## GNUtil - 全点名工具

```java
// 将逗号分隔的点名格式化为 SQL IN 子句格式
String gnNames = "W3.NODE1.P001,W3.NODE1.P002,W3.NODE1.P003";
String formatted = GNUtil.FormartGNs(gnNames);
// 结果: 'W3.NODE1.P001','W3.NODE1.P002','W3.NODE1.P003'

// 将逗号分隔的点名转换为 List
List<String> gnList = GNUtil.FormartGN(gnNames);
// 结果: [W3.NODE1.P001, W3.NODE1.P002, W3.NODE1.P003]
```

## 连接池管理

```java
// 获取连接池统计信息
String poolStats = rtdbService.getPoolStats();
System.out.println(poolStats);

// 获取连接池对象
OpioRTDBPool pool = rtdbService.getPool();

// 手动获取/释放连接（通常不需要手动管理）
IOPConnect conn = rtdbService.getConnect();
try {
    // 使用连接执行自定义操作
} finally {
    rtdbService.freeConnect(conn);
}

// 使用 execute 方法自动管理连接
Integer result = rtdbService.execute(conn -> {
    // 使用 conn 执行操作
    return conn.getPointId("W3.NODE1.TEMP001");
});
```

## 异常处理

```java
try {
    PointValue value = rtdbService.getRealByName(
        Arrays.asList("W3.NODE1.TEMP001")
    ).get("W3.NODE1.TEMP001");
} catch (RTDBException e) {
    // 处理 RTDB 异常
    System.err.println("RTDB 操作失败: " + e.getMessage());
}
```

## 获取服务器时间

```java
long serverTime = rtdbService.getServerTime();
```
