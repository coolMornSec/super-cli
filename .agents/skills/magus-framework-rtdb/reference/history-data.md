# History Data - 历史数据操作

## 读取单点历史值

```java
// 根据点ID读取指定时间的历史值
Collection<Integer> pointIds = Arrays.asList(1000);
Date time = new Date();
Map<Integer, PointValue> values = rtdbService.getHistoryById(pointIds, time);

// 根据全点名读取
Collection<String> pointNames = Arrays.asList("W3.NODE1.TEMP001");
Map<String, PointValue> values = rtdbService.getHistoryByName(pointNames, time);
```

## 写入历史值

```java
// 根据点ID写入
List<PointValueRequest> requests = new ArrayList<>();
PointValueRequest req = new PointValueRequest();
req.setOpId("1000");
req.setAv(25.5);
req.setTm(System.currentTimeMillis());
req.setDs(0);
requests.add(req);

Map<Integer, OperateResult> results = rtdbService.writeHistoryById(requests);

// 根据全点名写入
List<PointValueRequest> requests = new ArrayList<>();
PointValueRequest req = new PointValueRequest();
req.setGn("W3.NODE1.TEMP001");
req.setAv(25.5);
req.setTm(System.currentTimeMillis());
req.setDs(0);
requests.add(req);

Map<String, OperateResult> results = rtdbService.writeHistoryByName(requests);
```

## 读取区间历史值

```java
Collection<String> pointNames = Arrays.asList("W3.NODE1.TEMP001");
Date from = new Date(System.currentTimeMillis() - 3600000);  // 1小时前
Date to = new Date();                                         // 现在
ValueMode valueMode = ValueMode.RAW;                         // 原始值
int interval = 60;                                           // 间隔60秒

Map<String, List<PointValue>> history = rtdbService.getHistoryByName(
    pointNames, from, to, valueMode, interval
);

// 遍历结果
for (Map.Entry<String, List<PointValue>> entry : history.entrySet()) {
    String pointName = entry.getKey();
    List<PointValue> values = entry.getValue();
    System.out.println("点名: " + pointName + ", 数据条数: " + values.size());
}
```

## 取值模式（ValueMode）

| 模式 | 说明 |
|------|------|
| `RAW` | 原始值 |
| `SPAN` | 等间距值 |
| `PLOT` | 绘图值 |
| `FLOW` | 流量值 |
| `MAX` | 最大值 |
| `MIN` | 最小值 |
| `AVG` | 面积平均值 |
| `MEAN` | 算术平均值 |
| `STDEV` | 标准方差值 |
| `SUM` | 算术求和值 |
| `PREV` | 采集值最近的前一个值 |
| `NEXT` | 采集值最近的后一个值 |
| `BOTH` | 采集值最近的前后两个值 |

## 历史区间统计

```java
Collection<String> pointNames = Arrays.asList("W3.NODE1.TEMP001");
Date from = new Date(System.currentTimeMillis() - 86400000);  // 1天前
Date to = new Date();

// 默认统计（流量值）
Map<String, PointValue> stats = rtdbService.getHistorySpanTotalByName(pointNames, from, to);

// 指定统计类型
StatisticsMode statMode = StatisticsMode.AVGV;  // 时均平均值
Map<String, PointValue> stats = rtdbService.getHistorySpanTotalByName(
    pointNames, from, to, statMode
);
```

## 统计模式（StatisticsMode）

| 模式 | 说明 |
|------|------|
| `FLOW` | 流量值（积分）|
| `AVGV` | 时均平均值 |
| `MAXV` | 最大值 |
| `MINV` | 最小值 |
