# Database Operations - 数据库操作

## 获取所有库

```java
Collection<Integer> databaseIds = Arrays.asList(1, 2, 3);
List<DatabaseResponse> databases = rtdbService.getAllDatabases(databaseIds);
```

## 获取单个库

```java
// 根据库ID
DatabaseResponse db = rtdbService.getDatabase(1);

// 根据库名
DatabaseResponse db = rtdbService.getDatabase("W3");
```

## 创建库

```java
DatabaseResponse db = rtdbService.createDatabase("TESTDB");
```

## 删除库

```java
// 批量删除
Collection<Integer> databaseIds = Arrays.asList(1, 2, 3);
OperateResult result = rtdbService.deleteDatabases(databaseIds);
```

## DatabaseResponse 属性

| 属性 | 说明 |
|------|------|
| `opId` | 实时库ID |
| `databaseName` | 库名 |
| `ec` | 数据库状态码 |
