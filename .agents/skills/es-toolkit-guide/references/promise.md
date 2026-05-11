# 用法汇总 - promise

## Mutex

### `Mutex()`

当您想要防止多个异步任务同时执行时,可以使用 `Mutex`。在需要控制并发的情况下很有用,例如数据库连接、文件系统访问、API 调用限制等。

```typescript
import { Mutex } from 'es-toolkit';

const mutex = new Mutex();

// API 调用限制示例
async function callAPI() {
  await mutex.acquire();
  try {
    // 防止多个 API 调用同时发生
    const response = await fetch('/api/data');
    return response.json();
  } finally {
    mutex.release();
  }
}

// 文件系统访问示例
async function writeToFile(data: string) {
  await mutex.acquire();
  try {
    // 防止同时对同一文件进行写入操作
    await fs.writeFile('data.txt', data);
    console.log('文件写入完成');
  } finally {
    mutex.release();
  }
}

// 即使同时调用多个任务,也会按顺序执行
callAPI();
callAPI(); // 等待第一个任务完成
writeToFile(); // 等待前面的任务完成
```

#### 属性

- `isLocked` (`boolean`): 当前互斥锁是否正在使用中。如果为 `true`,表示已有异步任务正在执行。

#### 方法

- `acquire` (`() => Promise<void>`): 获取许可并执行异步任务,或等待直到获得许可。
- `release` (`() => void`): 释放锁,使等待中的下一个任务可以执行。

## Semaphore

### `Semaphore(capacity)`

当您想要限制可以同时执行的异步任务数量时,可以使用 `Semaphore`。在需要控制资源使用量的情况下特别有用,例如数据库连接池、API 调用限制、文件下载限制等。

```typescript
import { Semaphore } from 'es-toolkit';

const semaphore = new Semaphore(3);

// API 调用限制示例(最多同时执行 3 个)
async function callAPI(id: number) {
  await semaphore.acquire();
  try {
    console.log(`开始 API 调用: ${id}`);
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  } finally {
    semaphore.release();
    console.log(`API 调用完成: ${id}`);
  }
}

// 文件下载限制示例
async function downloadFile(url: string) {
  await semaphore.acquire();
  try {
    console.log(`开始下载: ${url}`);
    // 文件下载逻辑
    await fetch(url);
  } finally {
    semaphore.release();
    console.log(`下载完成: ${url}`);
  }
}

// 即使同时调用 5 个任务,也最多只能同时执行 3 个
callAPI(1);
callAPI(2);
callAPI(3);
callAPI(4); // 等待前面的任务之一完成
callAPI(5); // 等待前面的任务之一完成
```


#### 属性

- `capacity` (`number`): 可以同时执行的任务的最大数量。
- `available` (`number`): 当前可用的许可数量。如果为 `0`,表示所有许可都在使用中。

#### 方法

- `acquire` (`() => Promise<void>`): 获取许可并执行异步任务,或等待直到获得许可。
- `release` (`() => void`): 归还许可,使等待中的下一个任务可以执行。

## delay

### `delay(ms, options?)`

当您想要暂停代码执行一定时间时,可以使用 `delay`。它可以与 async/await 一起使用,使下一段代码在一定时间后执行。如有必要,还可以通过 `AbortSignal` 取消延迟。

```typescript
import { delay } from 'es-toolkit/promise';

async function example() {
  console.log('开始');
  await delay(1000); // 延迟执行 1 秒
  console.log('1秒后执行');

  await delay(500); // 再延迟 0.5 秒
  console.log('额外 0.5 秒后执行');
}

example();
```

您也可以使用 AbortSignal 取消延迟:

```typescript
async function cancellableDelay() {
  const controller = new AbortController();
  const { signal } = controller;

  // 50ms 后取消延迟
  setTimeout(() => controller.abort(), 50);

  try {
    await delay(1000, { signal });
    console.log('1秒已过'); // 此代码不会执行
  } catch (error) {
    console.log('延迟已取消'); // 抛出 AbortError
  }
}
```

在测试中模拟异步行为时也很有用。

```typescript
async function simulateNetworkRequest() {
  console.log('开始网络请求...');
  await delay(2000); // 模拟 2 秒的网络延迟
  console.log('收到响应!');
  return { data: 'test' };
}
```



#### 错误

当 AbortSignal 激活时,抛出 `AbortError`。

## timeout

### `timeout(ms)`

当您想要在特定时间后抛出超时错误时,可以使用 `timeout`。与其他 Promise 配合 `Promise.race()` 使用,可以为任务设置时间限制,非常有用。

```typescript
import { timeout } from 'es-toolkit/promise';

// 基本用法 - 1秒后抛出 TimeoutError
try {
  await timeout(1000);
  console.log('此代码不会执行');
} catch (error) {
  console.log('发生超时错误:', error.message); // 'The operation was timed out'
}
```

可以与 `Promise.race()` 一起使用,为任务设置时间限制:

```typescript
async function fetchWithTimeout(url: string) {
  try {
    const result = await Promise.race([
      fetch(url),
      timeout(5000), // 5秒限制
    ]);
    return result;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('请求耗时过长');
    }
    throw error;
  }
}
```

当您想要在多个异步任务中任何一个未在规定时间内完成时使整个任务失败,也可以使用此方法。

```typescript
async function multipleOperationsWithTimeout() {
  try {
    await Promise.race([
      Promise.all([fetch('/api/data1'), fetch('/api/data2'), fetch('/api/data3')]),
      timeout(3000), // 为整个任务设置 3 秒限制
    ]);
    console.log('所有任务均按时完成');
  } catch (error) {
    console.log('任务未能按时完成');
  }
}
```



#### 错误

指定时间过后,抛出 `TimeoutError`。

## withTimeout

### `withTimeout(run, ms)`

当您想要为异步任务设置超时时,可以使用 `withTimeout`。如果 Promise 在指定时间内未完成,将以 `TimeoutError` 拒绝,从而防止无限等待的情况。

```typescript
import { withTimeout } from 'es-toolkit/promise';

async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

try {
  // 必须在 1 秒内完成
  const data = await withTimeout(fetchData, 1000);
  console.log('收到数据:', data);
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.log('请求超时');
  }
}
```

当您想要为数据库查询设置时间限制时也可以使用。

```typescript
async function queryDatabase(query: string) {
  // 数据库查询逻辑
  return await db.execute(query);
}

try {
  const result = await withTimeout(
    () => queryDatabase('SELECT * FROM users'),
    5000 // 5秒限制
  );
  console.log('查询结果:', result);
} catch (error) {
  console.log('查询耗时过长已取消');
}
```

在多个 API 调用中只想接收最快响应的情况下也可以使用。

```typescript
async function getFastestResponse() {
  const apis = [() => fetch('/api/server1'), () => fetch('/api/server2'), () => fetch('/api/server3')];

  try {
    // 为每个 API 设置 2 秒限制,只接收最快的响应
    const promises = apis.map(api => withTimeout(api, 2000));
    const result = await Promise.race(promises);
    return result.json();
  } catch (error) {
    console.log('所有 API 均已超时');
  }
}
```



#### 错误

如果在指定时间内未完成,抛出 `TimeoutError`。
