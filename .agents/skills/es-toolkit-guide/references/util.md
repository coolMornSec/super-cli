# 用法汇总 - util

## assert

### `assert(condition, message)`

当代码中的特定条件必须满足时使用 `assert`。如果条件为假,它会立即抛出错误并停止程序执行。

```typescript
import { assert } from 'es-toolkit/util';

// 如果条件为真,则什么都不做
assert(true, '此消息不会出现');

// 如果条件为假,则抛出错误
assert(false, '此条件为假'); // Error: 此条件为假

// 检查值不是 null 或 undefined 时
const value = getValue();
assert(value !== null && value !== undefined, '值不能是 null 或 undefined');
// 现在可以确定 value 既不是 null 也不是 undefined

// 检查数字是否为正数时
const number = getNumber();
assert(number > 0, '数字必须是正数');
```

你也可以直接传递错误对象。

```typescript
import { assert } from 'es-toolkit/util';

// 传递 Error 对象
assert(false, new Error('自定义错误消息'));

// 使用自定义错误类
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

assert(false, new ValidationError('验证失败'));
```

在开发过程中验证代码假设或检查函数输入是否在预期范围内时特别有用。



#### 错误

如果条件评估为假,则抛出提供的消息或错误对象。

## attempt

### `attempt(func)`

当您想安全地执行函数时,请使用 `attempt`。它允许您在不使用 try-catch 块包装代码的情况下处理错误。

```typescript
import { attempt } from 'es-toolkit/util';

// 成功的情况
const [error, result] = attempt(() => 42);
// error 为 null,result 为 42

// 发生错误的情况
const [error, result] = attempt(() => {
  throw new Error('出现问题了');
});
// error 是 Error 对象,result 为 null

// 您也可以指定类型
const [error, names] = attempt<string[], Error>(() => ['Alice', 'Bob']);
// names 被推断为 string[] 类型
```

::: warning 不要与异步函数一起使用

此函数不适用于异步函数(返回 `Promise` 的函数)。如果传递异步函数,它将返回 `[null, Promise<T>]`,但即使 Promise 稍后被拒绝,它也无法捕获错误。

对于异步函数,请改用 [`attemptAsync`](./attemptAsync.md) 函数。

```typescript
// 错误用法
const [error, promise] = attempt(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});

// 正确用法
const [error, data] = await attemptAsync(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});
```

:::

## attemptAsync

### `attemptAsync(func)`

当您想要安全地执行异步函数时,请使用 `attemptAsync`。您可以在不用 try-catch 包装 async/await 块的情况下处理错误。

```typescript
import { attemptAsync } from 'es-toolkit/util';

// API 请求成功的情况
const [error, data] = await attemptAsync(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});
// error 为 null,data 包含响应数据

// 发生网络错误的情况
const [error, data] = await attemptAsync(async () => {
  throw new Error('网络错误');
});
// error 为 Error 对象,data 为 null

// 您也可以指定类型
interface User {
  id: number;
  name: string;
}

const [error, users] = await attemptAsync<User[]>(async () => {
  const response = await fetch('https://api.example.com/users');
  return response.json();
});
// users 被推断为 User[] 类型
```

在需要错误处理的异步操作(如数据库查询或文件读取)中特别有用。

```typescript
// 文件读取示例
const [error, content] = await attemptAsync(async () => {
  const fs = await import('fs/promises');
  return fs.readFile('config.json', 'utf8');
});

if (error) {
  console.log('无法读取文件:', error.message);
} else {
  console.log('文件内容:', content);
}
```

::: info 对于同步函数请使用 attempt

此函数适用于处理异步函数(返回 `Promise` 的函数)。如果要处理同步函数,建议使用 [`attempt`](./attempt.md) 函数。

:::

## invariant

### `invariant(condition, message)`

当代码中的特定条件必须满足时,请使用 `invariant`。如果条件为假,它会立即抛出错误以停止程序执行。

```typescript
import { invariant } from 'es-toolkit/util';

// 如果条件为真,则不执行任何操作
invariant(true, '此消息不会出现');

// 如果条件为假,则抛出错误
invariant(false, '此条件为假'); // Error: 此条件为假

// 检查值不为 null 或 undefined 时
const value = getValue();
invariant(value !== null && value !== undefined, '值不能为 null 或 undefined');
// 现在可以确定 value 既不是 null 也不是 undefined

// 检查数字是否为正数时
const number = getNumber();
invariant(number > 0, '数字必须为正数');
```

您也可以直接传递错误对象。

```typescript
import { invariant } from 'es-toolkit/util';

// 传递 Error 对象
invariant(false, new Error('自定义错误消息'));

// 使用自定义错误类
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

invariant(false, new ValidationError('验证失败'));
```

它在开发过程中验证代码假设或确保函数输入值在预期范围内时特别有用。



#### 错误

如果条件评估为假,则抛出提供的消息或错误对象。
