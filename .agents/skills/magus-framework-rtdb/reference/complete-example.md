# Complete Example - 完整示例

## 场景：创建库表点并读写数据

```java
@Service
public class RtdbDemoService {
    
    @Autowired
    private RTDBService rtdbService;
    
    public void demo() {
        // 1. 创建库
        String dbName = "DEMO";
        DatabaseResponse db = rtdbService.getDatabase(dbName);
        if (db == null) {
            db = rtdbService.createDatabase(dbName);
        }
        
        // 2. 创建节点表
        String tableName = dbName + ".STATION01";
        TableResponse table = rtdbService.getTable(tableName);
        if (table == null) {
            table = rtdbService.createTable(dbName, "STATION01");
        }
        
        // 3. 创建测点
        String pointName = tableName + ".TEMP001";
        PointResponse point = rtdbService.getPoint(pointName);
        if (point == null) {
            PointRequest request = new PointRequest();
            request.setGn(pointName);
            request.setRt(0);  // 模拟量
            request.setEd("1#机组温度");
            request.setEu("℃");
            request.setTv(150.0F);
            request.setBv(-50.0F);
            request.fillDefaultField();
            point = rtdbService.createPoint(tableName, request);
        }
        
        // 4. 写入实时值
        List<PointValueRequest> writeRequests = new ArrayList<>();
        PointValueRequest writeReq = new PointValueRequest();
        writeReq.setGn(pointName);
        writeReq.setAv(65.5);
        writeReq.setTm(System.currentTimeMillis());
        writeReq.setDs(0);
        writeRequests.add(writeReq);
        rtdbService.writeRealByName(writeRequests);
        
        // 5. 读取实时值
        Map<String, PointValue> realValues = rtdbService.getRealByName(
            Arrays.asList(pointName)
        );
        PointValue realValue = realValues.get(pointName);
        System.out.println("实时值: " + realValue.getValue());
        
        // 6. 读取历史值
        Date from = new Date(System.currentTimeMillis() - 3600000);  // 1小时前
        Date to = new Date();
        Map<String, List<PointValue>> history = rtdbService.getHistoryByName(
            Arrays.asList(pointName), from, to, ValueMode.RAW, 60
        );
        List<PointValue> historyValues = history.get(pointName);
        System.out.println("历史数据条数: " + historyValues.size());
    }
}
```

## 批量创建测点示例

```java
public void batchCreatePoints() {
    List<PointRequest> toSave = new ArrayList<>();
    for (int i = 10000; i < 20000; i++) {
        PointRequest request = new PointRequest();
        String pn = String.format("%06d", i);
        request.setGn("ZJW.NODE1." + pn);
        request.setAn("Alias_name_" + pn);
        request.setEu("单位A" + pn);
        request.setEd("描述" + pn);
        request.setRt(0);
        request.fillDefaultField();
        toSave.add(request);
    }

    Map<String, PointResponse> createResult = rtdbService.createPoint(
        "ZJW.NODE1", toSave
    );
    long createSuccess = createResult.values().stream()
        .map(PointResponse::getOpId)
        .filter(Objects::nonNull)
        .count();
    System.out.println("创建成功：" + createSuccess);
}
```

## 历史数据统计示例

```java
public void historyStatistics() throws Exception {
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    String pointName = "DEFAULT.NODE1.POINT001";
    Set<String> pointNames = Sets.newHashSet(pointName);
    
    Date timeBegin = format.parse("2022-04-22 20:00:00");
    Date timeEnd = format.parse("2022-04-23 19:59:59");
    
    // 获取起止点值
    PointValue valueBegin = rtdbService.getHistoryByName(
        pointNames, timeBegin
    ).get(pointName);
    PointValue valueEnd = rtdbService.getHistoryByName(
        pointNames, timeEnd
    ).get(pointName);
    
    // 区间流量统计
    PointValue statValueAll = rtdbService.getHistorySpanTotalByName(
        pointNames, timeBegin, timeEnd
    ).get(pointName);
    
    // 区间最大值统计
    PointValue statValueMax = rtdbService.getHistorySpanTotalByName(
        pointNames, timeBegin, timeEnd, StatisticsMode.MAXV
    ).get(pointName);
    
    // 获取区间历史数据
    List<PointValue> pointValues = rtdbService.getHistoryByName(
        pointNames, timeBegin, timeEnd, ValueMode.BOTH, 100
    ).get(pointName);
}
```
