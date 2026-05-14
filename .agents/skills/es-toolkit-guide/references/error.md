# 用法汇总 - error

## AbortError

### `new AbortError(message?)`

当操作被中止或取消时使用的错误类。当像 [debounce](../function/debounce.md) 或 [delay](../promise/delay.md) 这样的操作被 `AbortSignal` 取消时会抛出此错误。

```typescript
import { AbortError } from 'es-toolkit/error';

// 使用默认消息创建错误。
throw new AbortError();
// 错误消息: 'The operation was aborted'

// 使用自定义消息创建错误。
throw new AbortError('文件上传已取消');
// 错误消息: '文件上传已取消'
```

与 AbortSignal 一起使用的示例。

```typescript
import { AbortError, delay } from 'es-toolkit';

async function fetchData(signal: AbortSignal) {
  try {
    await delay(1000, { signal });
    return '数据加载完成';
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('操作已取消');
    }
    throw error;
  }
}

const controller = new AbortController();
controller.abort(); // 取消操作
await fetchData(controller.signal); // 抛出 AbortError
```

## TimeoutError

### `new TimeoutError(message?)`

当操作的时间限制超过时使用的错误类。当像 [timeout](../promise/timeout.md) 或 [withTimeout](../promise/withTimeout.md) 这样的操作超时时会抛出此错误。

```typescript
import { TimeoutError } from 'es-toolkit/error';

// 使用默认消息创建错误。
throw new TimeoutError();
// 错误消息: 'The operation was timed out'

// 使用自定义消息创建错误。
throw new TimeoutError('API 请求已超时');
// 错误消息: 'API 请求已超时'
```

与超时一起使用的示例。

```typescript
import { timeout, TimeoutError } from 'es-toolkit';

async function fetchWithTimeout(url: string) {
  try {
    const response = await timeout(() => fetch(url), 3000);
    return response;
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log('请求已超时');
    }
    throw error;
  }
}

// 如果超过3秒则抛出 TimeoutError
await fetchWithTimeout('https://example.com/api/slow');
```
