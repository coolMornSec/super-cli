# Realtime Data - 实时数据操作

## 读取实时值

```java
// 根据点ID读取
Collection<Integer> pointIds = Arrays.asList(1000, 1001);
Map<Integer, PointValue> values = rtdbService.getRealById(pointIds);

// 根据全点名读取
Collection<String> pointNames = Arrays.asList("W3.NODE1.TEMP001");
Map<String, PointValue> values = rtdbService.getRealByName(pointNames);

// 遍历结果
for (Map.Entry<String, PointValue> entry : values.entrySet()) {
    PointValue pv = entry.getValue();
    System.out.println("点名: " + pv.getPointName());
    System.out.println("值: " + pv.getValue());
    System.out.println("时间: " + new Date(pv.getTime()));
    System.out.println("状态: " + pv.getValueState());
}
```

## 写入实时值

```java
// 根据点ID写入
List<PointValueRequest> requests = new ArrayList<>();
PointValueRequest req = new PointValueRequest();
req.setOpId("1000");                    // 点ID
req.setAv(25.5);                        // 值
req.setTm(System.currentTimeMillis());  // 时间戳（毫秒）
req.setDs(0);                           // 点状态
requests.add(req);

Map<Integer, OperateResult> results = rtdbService.writeRealById(requests);

// 根据全点名写入
List<PointValueRequest> requests = new ArrayList<>();
PointValueRequest req = new PointValueRequest();
req.setGn("W3.NODE1.TEMP001");          // 全点名
req.setAv(25.5);
req.setTm(System.currentTimeMillis());
req.setDs(0);
requests.add(req);

Map<String, OperateResult> results = rtdbService.writeRealByName(requests);
```

## PointValue 属性

| 属性 | 说明 |
|------|------|
| `opId` | 实时库ID |
| `pointName` | 点名 |
| `time` | 时间戳（毫秒）|
| `value` | 值 |
| `valueState` | 值状态 |
| `valueType` | 值类型 |
| `extend` | 扩展属性 |

## PointValueRequest 属性

| 属性 | 说明 |
|------|------|
| `opId` | 点ID（与gn二选一）|
| `gn` | 全点名（与opId二选一）|
| `av` | 值 |
| `tm` | 时间戳（毫秒）|
| `ds` | 点状态 |
| `value` | OPValue对象（可选）|
