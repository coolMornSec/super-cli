# Table Operations - 节点表操作

## 获取表

```java
// 根据表ID
TableResponse table = rtdbService.getTable(100);

// 根据全节点名
TableResponse table = rtdbService.getTable("W3.NODE1");

// 获取库下所有表
List<TableResponse> tables = rtdbService.getTables("W3");

// 批量获取
List<TableResponse> tables = rtdbService.getAllTables(
    Arrays.asList("W3.NODE1", "W3.NODE2")
);
```

## 创建表

```java
TableResponse table = rtdbService.createTable("W3", "NEWNODE");
```

## 更新表

```java
TableRequest request = new TableRequest();
request.setOpId(100);           // 表ID
request.setEd("节点描述");       // 描述
request.setFq(1000);            // 分辨率
request.setLc(1);               // 报警属性
request.setAr(1);               // 归档
request.setOf(0);               // 离线状态

OperateResult result = rtdbService.updateTable(request);
```

## 删除表

```java
// 根据ID删除
OperateResult result = rtdbService.deleteTable(100);

// 根据全节点名删除
OperateResult result = rtdbService.deleteTable("W3.NODE1");

// 批量删除
OperateResult result = rtdbService.deleteTables(Arrays.asList(100, 101));
```

## TableResponse 属性

| 属性 | 说明 |
|------|------|
| `opId` | 实时库ID |
| `gn` | 全节点名 |
| `pn` | 节点名 |
| `ec` | 状态码 |
| `ed` | 描述 |
| `fq` | 分辨率 |
| `lc` | 报警属性 |
| `ar` | 归档 |
| `of` | 离线 |
