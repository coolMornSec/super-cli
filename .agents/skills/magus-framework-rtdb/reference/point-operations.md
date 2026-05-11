# Point Operations - 测点操作

## 获取点信息

```java
// 根据点ID
PointResponse point = rtdbService.getPoint(1000);

// 根据全点名
PointResponse point = rtdbService.getPoint("W3.NODE1.TEMP001");

// 批量获取
List<PointResponse> points = rtdbService.getPoints(Arrays.asList(1000, 1001));
List<PointResponse> points = rtdbService.getPoints(Arrays.asList("W3.NODE1.TEMP001"));

// 获取表下所有点
List<PointResponse> points = rtdbService.getPoints("W3.NODE1");
```

## 创建点

```java
PointRequest request = new PointRequest();
request.setGn("W3.NODE1.NEWPOINT001");  // 全点名（必填）
request.setRt(0);                        // 点类型：0-模拟量
request.setEd("温度测点");                // 描述
request.setEu("℃");                     // 量纲
request.setTv(100.0F);                   // 量程上限
request.setBv(0.0F);                     // 量程下限
request.fillDefaultField();              // 填充默认值

PointResponse point = rtdbService.createPoint("W3.NODE1", request);
```

## 点类型（rt）

| 值 | 类型 | 说明 |
|----|------|------|
| 0 | AX | 模拟量（Analog）|
| 1 | DX | 开关量（Digital）|
| 2 | I2 | 短整数 |
| 3 | I4 | 长整数 |
| 4 | R8 | 浮点数（Double）|
| 5 | LONG | 长整型 |
| 6 | TEXT | 文本 |
| 7 | BLOB | 二进制 |

## 更新点

```java
PointRequest request = new PointRequest();
request.setOpId(1000);           // 点ID（优先）
request.setEd("更新后的描述");     // 新描述
request.setEu("MPa");            // 新量纲
request.setTv(10.0F);            // 量程上限
request.setBv(0.0F);             // 量程下限
request.setLc(1);                // 报警方式
request.setLl(5.0F);             // 低限报警
request.setHl(8.0F);             // 高限报警

OperateResult result = rtdbService.updatePoint(request);
```

## 删除点

```java
// 根据ID删除
OperateResult result = rtdbService.deletePointById(1000);

// 批量根据ID删除
Map<Integer, OperateResult> results = rtdbService.deletePointById(Arrays.asList(1000, 1001));

// 根据全点名删除
OperateResult result = rtdbService.deletePointByName("W3.NODE1.TEMP001");

// 批量根据全点名删除
Map<String, OperateResult> results = rtdbService.deletePointByName(
    Arrays.asList("W3.NODE1.TEMP001", "W3.NODE1.TEMP002")
);
```

## PointRequest 常用属性

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `gn` | 全点名 | 必填 |
| `rt` | 点类型 | 0 (AX) |
| `ed` | 描述 | - |
| `an` | 别名 | - |
| `eu` | 量纲 | - |
| `iv` | 初始值 | 0F |
| `tv` | 量程上限 | 100F |
| `bv` | 量程下限 | 0F |
| `fq` | 分辨率 | 1 |
| `kz` | 压缩类型 | 1 (线性) |
| `db` | 死区 | 0.2F |
| `ar` | 归档 | 1 |
| `pt` | 点来源 | 0 (DAS) |

**注意**：使用 `fillDefaultField()` 方法自动填充默认值
