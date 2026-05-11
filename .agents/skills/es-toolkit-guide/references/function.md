# 用法汇总 - function

## after

### `after(n, func)`

当您想忽略前几次调用并从第 `n` 次调用开始执行函数时,请使用 `after`。这在事件或异步操作中需要在特定次数后才执行操作时非常有用。

```typescript
import { after } from 'es-toolkit/function';

const afterFn = after(3, () => {
  console.log('executed');
});

// 不记录任何内容
afterFn();
// 不记录任何内容
afterFn();
// 记录 'executed'
afterFn();
// 记录 'executed'
afterFn();
```



#### 错误

当 `n` 不是整数或为负数时抛出错误。

## ary

### `ary(func, n)`

当您想要限制函数可接收的参数数量时,请使用 `ary`。额外传递的参数将被忽略。这在函数式编程中特别有用,可以防止回调函数接收意外的参数。

```typescript
import { ary } from 'es-toolkit/function';

function fn(a: number, b: number, c: number) {
  return Array.from(arguments);
}

// 限制为不接收任何参数
ary(fn, 0)(1, 2, 3);
// Returns: []

// 限制为只接收 1 个参数
ary(fn, 1)(1, 2, 3);
// Returns: [1]

// 限制为只接收 2 个参数
ary(fn, 2)(1, 2, 3);
// Returns: [1, 2]
```

与 `map` 等数组方法一起使用时特别有用。

```typescript
// parseInt 接收两个参数,但 map 会传递三个参数
['1', '2', '3'].map(parseInt);
// Returns: [1, NaN, NaN]

['1', '2', '3'].map(parseInt);
// 结果: [1, NaN, NaN]
// 因为会执行 parseInt('2', 1), parseInt('3', 2)。

// 使用 ary 限制为只传递第一个参数
['1', '2', '3'].map(ary(parseInt, 1));
// 结果: [1, 2, 3] ✅
```

## asyncNoop

### `asyncNoop()`

当您想在需要异步函数的地方填充空位或用作默认值时,请使用 `asyncNoop`。它返回一个解析为 `undefined` 的 `Promise`。

```typescript
import { asyncNoop } from 'es-toolkit/function';

// 用作默认值的示例
interface Props {
  fetchData?: () => Promise<void>;
}

function MyComponent({ fetchData = asyncNoop }: Props) {
  const handleFetchData = async () => {
    // fetchData 始终是一个函数,因此可以安全调用
    await fetchData();
  };

  handleFetchData();
}

// 直接调用的示例
asyncNoop();
// Returns: Promise<void>

await asyncNoop();
// Returns: undefined
```

## before

### `before(n, func)`

当您想要限制函数只执行特定次数时,请使用 `before`。函数只会执行到第 `n-1` 次调用,从第 `n` 次开始将不再执行。

```typescript
import { before } from 'es-toolkit/function';

const beforeFn = before(3, () => {
  console.log('执行了');
});

// 打印 '执行了'
beforeFn();

// 打印 '执行了'
beforeFn();

// 不会打印任何内容
beforeFn();

// 不会打印任何内容
beforeFn();
```

这在只需执行一次的任务(如初始化或设置)中特别有用。

```typescript
let initialized = false;

const initialize = before(2, () => {
  console.log('初始化中...');
  initialized = true;
});

// 打印 '初始化中...' 并执行初始化
initialize();

// 已经初始化,不会执行任何操作
initialize();
```



#### 错误

当 `n` 不是整数或为负数时会抛出错误。

## curry

### `curry(func)`

当您想要部分应用函数时,请使用 `curry`。柯里化后的函数会在收到所有必需参数之前返回新函数。一旦提供了所有参数,就会执行原始函数。

```typescript
import { curry } from 'es-toolkit/function';

function sum(a: number, b: number, c: number) {
  return a + b + c;
}

const curriedSum = curry(sum);

// 为参数 `a` 提供值 `10`
const sum10 = curriedSum(10);

// 为参数 `b` 提供值 `15`
const sum25 = sum10(15);

// 为参数 `c` 提供值 `5`
// 已收到所有参数,现在返回值
const result = sum25(5);
// Returns: 30
```

这在创建可重用函数时很有用。

```typescript
function multiply(a: number, b: number) {
  return a * b;
}

const curriedMultiply = curry(multiply);
const double = curriedMultiply(2);
const triple = curriedMultiply(3);

double(5); // Returns: 10
triple(5); // Returns: 15
```

## curryRight

### `curryRight(func)`

当您想要从右到左部分应用函数时,请使用 `curryRight`。与普通的 `curry` 不同,它从最后一个参数开始接收。

```typescript
import { curryRight } from 'es-toolkit/function';

function sum(a: number, b: number, c: number) {
  return a + b + c;
}

const curriedSum = curryRight(sum);

// 为参数 `c` 提供值 `10`
const add10 = curriedSum(10);

// 为参数 `b` 提供值 `15`
const add25 = add10(15);

// 为参数 `a` 提供值 `5`
// 已收到所有参数,现在返回值
const result = add25(5);
// Returns: 30
```

这在从右到左应用参数更自然的情况下很有用。

```typescript
function greet(greeting: string, name: string) {
  return `${greeting}, ${name}!`;
}

const curriedGreet = curryRight(greet);
const greetJohn = curriedGreet('John');

greetJohn('Hello'); // Returns: 'Hello, John!'
greetJohn('Hi'); // Returns: 'Hi, John!'
```

## debounce

### `debounce(func, debounceMs, options)`

当您想要将连续调用合并为一次时,请使用 `debounce`。防抖函数会在最后一次调用后等待指定时间才执行。这对于处理快速事件(如搜索框输入或窗口调整大小)很有用。

```typescript
import { debounce } from 'es-toolkit/function';

const debouncedFunction = debounce(() => {
  console.log('执行了');
}, 1000);

// 如果在 1 秒内没有再次调用,则打印 '执行了'
debouncedFunction();

// 取消之前的调用
debouncedFunction.cancel();

// 立即执行等待中的函数
debouncedFunction.flush();
```

可以在根据用户输入调用繁重 API(如搜索)时有效使用。

```typescript
const searchInput = document.getElementById('search');
const searchResults = debounce(async (query: string) => {
  const results = await fetchSearchResults(query);
  displayResults(results);
}, 300);

searchInput.addEventListener('input', e => {
  searchResults(e.target.value);
});
```

可以使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消防抖函数调用。

```typescript
const controller = new AbortController();
const debouncedWithSignalFunction = debounce(
  () => {
    console.log('Function executed');
  },
  1000,
  { signal: controller.signal }
);

// 如果在 1 秒内没有再次调用,则打印 '执行了'
debouncedWithSignalFunction();

// 取消防抖函数调用
controller.abort();
```

## flow

### `flow(...funcs)`

当您想要连接函数以创建管道时,请使用 `flow`。前一个函数的结果成为下一个函数的输入。这在通过多个步骤转换数据时很有用。

```typescript
import { flow } from 'es-toolkit/function';

const add = (x: number, y: number) => x + y;
const square = (n: number) => n * n;
const double = (n: number) => n * 2;

const combined = flow(add, square, double);

// 首先 add(1, 2) = 3
// 然后 square(3) = 9
// 最后 double(9) = 18
combined(1, 2);
// Returns: 18
```

这在创建数据转换管道时特别有用。

```typescript
const processData = flow(
  (text: string) => text.trim(),
  (text: string) => text.toLowerCase(),
  (text: string) => text.split(' '),
  (words: string[]) => words.filter(word => word.length > 3)
);

processData('  Hello World JavaScript  ');
// Returns: ['hello', 'world', 'javascript']
```

## flowRight

### `flowRight(...funcs)`

当您想要从右到左按顺序执行多个函数以创建新函数时,请使用 `flowRight`。前一个函数的返回值作为下一个函数的参数传递。

这在以相反顺序组合函数创建数据转换管道时很有用。与 `flow` 的执行方向相反。

```typescript
import { flowRight } from 'es-toolkit/function';

const add = (x: number, y: number) => x + y;
const square = (n: number) => n * n;
const double = (n: number) => n * 2;

// 从右到左执行: double -> square -> add
const combined = flowRight(double, square, add);
console.log(combined(1, 2)); // 18
// 执行顺序: add(1, 2) = 3, square(3) = 9, double(9) = 18

// 也可以使用单个函数
const single = flowRight((x: number) => x + 1);
console.log(single(5)); // 6
```

`this` 上下文也会传递给函数。

```typescript
import { flowRight } from 'es-toolkit/function';

const context = {
  multiplier: 3,
};

function multiply(this: typeof context, x: number) {
  return x * this.multiplier;
}

const add = (x: number) => x + 10;

const combined = flowRight(multiply, add).bind(context);
console.log(combined(5)); // 45
// 执行顺序: add(5) = 15, multiply(15) = 45
```

## identity

### `identity(value)`

当您想要原样返回某个值而不进行任何更改时,请使用 `identity`。

这在作为函数参数的默认值时很有用。在数组的 `map` 或 `filter` 中返回值本身,或在函数式编程中作为占位符使用。

```typescript
import { identity } from 'es-toolkit/function';

// 原样返回数字
const num = identity(5);
console.log(num); // 5

// 原样返回字符串
const str = identity('hello');
console.log(str); // 'hello'

// 原样返回对象
const obj = identity({ key: 'value' });
console.log(obj); // { key: 'value' }

// 在数组中使用的示例
const numbers = [1, 2, 3, 4, 5];
const same = numbers.map(identity);
console.log(same); // [1, 2, 3, 4, 5]
```

## memoize

### `memoize(func, options?)`

当您想要通过缓存函数的执行结果来优化性能时,请使用 `memoize`。使用相同参数再次调用时会返回缓存的结果,从而避免重复计算。

用于只接收一个参数的函数。如果函数接收多个参数,请将它们合并为一个对象或数组传递。

如果参数是像数组、对象这样通过引用进行比较的值,则应提供 `getCacheKey` 函数来生成适当的缓存键。

```typescript
import { memoize } from 'es-toolkit/function';

// 基本用法
const add = (x: number) => x + 10;
const memoizedAdd = memoize(add);

console.log(memoizedAdd(5)); // 15 (已计算)
console.log(memoizedAdd(5)); // 15 (缓存结果)
console.log(memoizedAdd.cache.size); // 1

// 为数组参数提供缓存键
const sum = (arr: number[]) => arr.reduce((sum, n) => sum + n, 0);
const memoizedSum = memoize(sum, {
  getCacheKey: (arr: number[]) => arr.join(','),
});

console.log(memoizedSum([1, 2, 3])); // 6 (已计算)
console.log(memoizedSum([1, 2, 3])); // 6 (缓存结果)
```

也可以使用自定义缓存。

```typescript
import { memoize, MemoizeCache } from 'es-toolkit/function';

class LRUCache<K, V> implements MemoizeCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize = 100;

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

const customCache = new LRUCache<string, number>();
const memoizedWithCustomCache = memoize(expensiveFunction, {
  cache: customCache,
});
```

## negate

### `negate(func)`

当您想要反转返回真或假值的函数的结果时,请使用 `negate`。

这在反转条件函数或过滤逻辑时很有用。例如,可以将查找偶数的函数转换为查找奇数的函数。

```typescript
import { negate } from 'es-toolkit/function';

// 基本用法
const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);

console.log(isEven(2)); // true
console.log(isOdd(2)); // false

console.log(isEven(3)); // false
console.log(isOdd(3)); // true

// 在数组过滤中使用
const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = numbers.filter(isEven);
console.log(evenNumbers); // [2, 4, 6]

const oddNumbers = numbers.filter(negate(isEven));
console.log(oddNumbers); // [1, 3, 5]
```

也可以反转复杂的条件函数。

```typescript
import { negate } from 'es-toolkit/function';

const isLongString = (str: string) => str.length > 5;
const isShortString = negate(isLongString);

const words = ['hi', 'hello', 'world', 'javascript'];

const longWords = words.filter(isLongString);
console.log(longWords); // ['hello', 'javascript']

const shortWords = words.filter(isShortString);
console.log(shortWords); // ['hi', 'world']
```

## noop

### `noop()`

当需要不执行任何操作的函数时,请使用 `noop`。

这在函数是必需的地方用作默认值,或当您想要禁用回调函数时很有用。经常用作占位符或在初始化阶段使用。

```typescript
import { noop } from 'es-toolkit/function';

// 用作可选回调的默认值
interface EventHandlers {
  onSuccess?: () => void;
  onError?: () => void;
}

function processData({ onSuccess = noop, onError = noop }: EventHandlers = {}) {
  try {
    // 数据处理逻辑
    console.log('数据处理完成');
    onSuccess(); // 可以安全调用
  } catch (error) {
    onError(); // 可以安全调用
  }
}

// 无需 undefined 检查即可安全使用
processData({
  onSuccess: () => console.log('成功!'),
  // onError 用 noop 作为默认值处理
});
```

也可以在数组方法中使用。

```typescript
import { noop } from 'es-toolkit/function';

// 有条件地执行函数
const operations = [
  () => console.log('第一个操作'),
  shouldRunSecond ? () => console.log('第二个操作') : noop,
  () => console.log('第三个操作'),
];

operations.forEach(op => op()); // 安全地执行所有操作
```

## once

### `once(func)`

当您想要限制函数只执行一次时,请使用 `once`。后续调用将返回第一次调用的结果。

这对于初始化函数或事件处理程序等只需执行一次的逻辑很有用。防止重复执行并保证结果一致。

```typescript
import { once } from 'es-toolkit/function';

// 初始化函数示例
const initialize = once(() => {
  console.log('初始化应用');
  return { status: 'initialized' };
});

console.log(initialize()); // 输出 '初始化应用' 日志,返回 { status: 'initialized' }
console.log(initialize()); // 无日志,返回 { status: 'initialized' }
console.log(initialize()); // 无日志,返回 { status: 'initialized' }

// API 调用示例
const fetchConfig = once(async () => {
  console.log('获取配置');
  const response = await fetch('/api/config');
  return response.json();
});

// 只有在第一次调用时才执行实际的 API 请求
const config1 = await fetchConfig();
const config2 = await fetchConfig(); // 返回缓存的结果
```

也可以使用带参数的函数。

```typescript
import { once } from 'es-toolkit/function';

const logOnce = once((message: string) => {
  console.log(`重要消息: ${message}`);
});

logOnce('你好'); // 输出 '重要消息: 你好'
logOnce('再次你好'); // 不输出 (已经调用过)
logOnce('又是你好'); // 不输出 (已经调用过)
```

## partial

### `partial(func, ...args)`

当您想要预先固定函数的部分参数时,请使用 `partial`。预先提供的参数将放置在函数前面,后续传递的参数将添加到后面。

这是函数式编程中经常使用的柯里化(currying)类似概念。与 `bind` 不同,它不固定 `this` 上下文。

使用 `partial.placeholder` 可以在特定位置的参数稍后传递。

```typescript
import { partial } from 'es-toolkit/function';

// 基本用法
function greet(greeting: string, name: string) {
  return `${greeting}, ${name}!`;
}

const sayHello = partial(greet, 'Hello');
console.log(sayHello('John')); // 'Hello, John!'
console.log(sayHello('Jane')); // 'Hello, Jane!'

// 应用多个参数
function multiply(a: number, b: number, c: number) {
  return a * b * c;
}

const double = partial(multiply, 2);
console.log(double(3, 4)); // 24

const doubleAndTriple = partial(multiply, 2, 3);
console.log(doubleAndTriple(4)); // 24
```

可以使用占位符来调整参数顺序。

```typescript
import { partial } from 'es-toolkit/function';

function subtract(a: number, b: number, c: number) {
  return a - b - c;
}

// 只固定第二个参数,第一个和第三个稍后传递
const subtractFrom5 = partial(subtract, partial.placeholder, 5, partial.placeholder);
console.log(subtractFrom5(10, 2)); // 10 - 5 - 2 = 3

// 与数组方法一起使用
const numbers = [1, 2, 3, 4, 5];
const addTen = partial((x: number, y: number) => x + y, 10);
const result = numbers.map(addTen);
console.log(result); // [11, 12, 13, 14, 15]
```

## partialRight

### `partialRight(func, ...args)`

当您想要从后面开始固定函数的部分参数时,请使用 `partialRight`。与 `partial` 相反,预先提供的参数将放置在函数后面,后续传递的参数将添加到前面。

这在想要固定函数的最后参数并只动态更改前面参数时很有用。

使用 `partialRight.placeholder` 可以在特定位置的参数稍后传递。

```typescript
import { partialRight } from 'es-toolkit/function';

// 基本用法
function greet(greeting: string, name: string) {
  return `${greeting}, ${name}!`;
}

const greetJohn = partialRight(greet, 'John');
console.log(greetJohn('Hello')); // 'Hello, John!'
console.log(greetJohn('Hi')); // 'Hi, John!'

// 应用多个参数
function subtract(a: number, b: number, c: number) {
  return a - b - c;
}

const subtractFrom10And5 = partialRight(subtract, 5, 2);
console.log(subtractFrom10And5(10)); // 10 - 5 - 2 = 3

// 在数学运算中应用常量
function divide(dividend: number, divisor: number) {
  return dividend / divisor;
}

const divideBy2 = partialRight(divide, 2);
console.log(divideBy2(10)); // 10 / 2 = 5
console.log(divideBy2(20)); // 20 / 2 = 10
```

可以使用占位符来调整参数顺序。

```typescript
import { partialRight } from 'es-toolkit/function';

function formatMessage(level: string, message: string, timestamp: string) {
  return `[${level}] ${message} at ${timestamp}`;
}

// 只固定最后一个参数,其余稍后传递
const logWithTime = partialRight(formatMessage, partialRight.placeholder, '2023-01-01');
console.log(logWithTime('INFO', 'Application started'));
// '[INFO] Application started at 2023-01-01'

// 与数组一起使用
const numbers = [1, 2, 3, 4, 5];
const appendSuffix = partialRight((num: number, suffix: string) => `${num}${suffix}`, 'th');
const result = numbers.map(appendSuffix);
console.log(result); // ['1th', '2th', '3th', '4th', '5th']
```

## rest

### `rest(func, startIndex?)`

当您想要将函数的其余参数打包成数组传递时,请使用 `rest`。特定索引之前的参数单独传递,之后的参数打包成数组传递。

这在创建接收可变参数的函数或更改现有函数的参数处理方式时很有用。

```typescript
import { rest } from 'es-toolkit/function';

// 基本用法 (从最后一个参数开始打包成数组)
function sum(a: number, b: number, numbers: number[]) {
  return a + b + numbers.reduce((sum, n) => sum + n, 0);
}

const restSum = rest(sum); // startIndex 默认为 func.length - 1 (2)
console.log(restSum(1, 2, 3, 4, 5)); // 1 + 2 + (3 + 4 + 5) = 15
// sum 函数以 [1, 2, [3, 4, 5]] 的形式调用

// 从其他索引开始打包成数组
function logMessage(level: string, messages: string[]) {
  console.log(`[${level}] ${messages.join(' ')}`);
}

const restLog = rest(logMessage, 1); // 从索引 1 开始打包成数组
restLog('INFO', 'Application', 'started', 'successfully');
// 以 logMessage('INFO', ['Application', 'started', 'successfully']) 的形式调用

// 实用示例: 第一个参数单独传递,其余打包成数组
function format(template: string, values: any[]) {
  return values.reduce((result, value, index) => {
    return result.replace(`{${index}}`, value);
  }, template);
}

const restFormat = rest(format, 1);
console.log(restFormat('Hello {0}, welcome to {1}!', 'John', 'our site'));
// 'Hello John, welcome to our site!'
```

参数不足的情况也会自动处理。

```typescript
import { rest } from 'es-toolkit/function';

function greet(greeting: string, name: string, extras: string[]) {
  const extraText = extras.length > 0 ? ` ${extras.join(' ')}` : '';
  return `${greeting} ${name}!${extraText}`;
}

const restGreet = rest(greet);

console.log(restGreet('Hello', 'Alice', 'Have a great day!'));
// 'Hello Alice! Have a great day!'

console.log(restGreet('Hi', 'Bob'));
// 'Hi Bob!' (extras 为空数组)

console.log(restGreet('Hey'));
// 'Hey undefined!' (name 为 undefined, extras 为空数组)
```

## retry

### `retry(func, options?)`

当异步函数失败时想要自动重试时,请使用 `retry`。这对于可能暂时失败的操作(如 API 调用或网络请求)很有用。

可以设置重试次数、重试间隔和取消信号。重试间隔可以是固定值,也可以是根据重试次数动态计算的函数。

```typescript
import { retry } from 'es-toolkit/function';

// 基本用法 (无限重试)
const data1 = await retry(async () => {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
});

// 限制重试次数
const data2 = await retry(async () => {
  return await fetchData();
}, 3);

// 设置重试间隔 (100ms)
const data3 = await retry(
  async () => {
    return await fetchData();
  },
  {
    retries: 3,
    delay: 100,
  }
);

// 动态重试间隔 (指数退避)
const data4 = await retry(
  async () => {
    return await fetchData();
  },
  {
    retries: 5,
    delay: attempts => Math.min(100 * Math.pow(2, attempts), 5000),
  }
);
```

当只想在特定错误时重试时,可以使用 `shouldRetry` 选项。

```typescript
import { retry } from 'es-toolkit/function';

class NetworkError extends Error {
  constructor(public status: number) {
    super(`Network error: ${status}`);
  }
}

// 仅在 500+ 错误时重试
const data5 = await retry(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new NetworkError(response.status);
    }
    return response.json();
  },
  {
    retries: 3,
    shouldRetry: (error, attempt) => error instanceof NetworkError && error.status >= 500,
  }
);
```

也可以使用 AbortSignal 取消重试。

```typescript
import { retry } from 'es-toolkit/function';

const controller = new AbortController();

// 5 秒后取消重试
setTimeout(() => controller.abort(), 5000);

try {
  const data = await retry(
    async () => {
      return await fetchData();
    },
    {
      retries: 10,
      delay: 1000,
      signal: controller.signal,
    }
  );
  console.log(data);
} catch (error) {
  console.log('重试被取消或失败:', error);
}
```



#### 错误

当重试次数超过或被 AbortSignal 取消时抛出最后的错误。

## spread

### `spread(func)`

当您想要将数组形式的参数展开为单个参数传递给函数时,请使用 `spread`。

这与 JavaScript 的展开运算符(`...`)类似,但是通过转换函数使其接收数组的方式。在经常使用 `apply` 方法的情况下很有用。

```typescript
import { spread } from 'es-toolkit/function';

// 基本用法
function add(a: number, b: number) {
  return a + b;
}

const spreadAdd = spread(add);
console.log(spreadAdd([5, 3])); // 8

// 具有多个参数的函数
function greet(greeting: string, name: string, punctuation: string) {
  return `${greeting}, ${name}${punctuation}`;
}

const spreadGreet = spread(greet);
console.log(spreadGreet(['Hello', 'World', '!'])); // 'Hello, World!'

// 与 Math 函数一起使用
const numbers = [1, 2, 3, 4, 5];
const spreadMax = spread(Math.max);
console.log(spreadMax(numbers)); // 5

const spreadMin = spread(Math.min);
console.log(spreadMin(numbers)); // 1
```

`this` 上下文也会保持。

```typescript
import { spread } from 'es-toolkit/function';

const calculator = {
  multiply: function (a: number, b: number, c: number) {
    return a * b * c;
  },
};

const spreadMultiply = spread(calculator.multiply);
console.log(spreadMultiply.call(calculator, [2, 3, 4])); // 24
```

## throttle

### `throttle(func, throttleMs, options?)`

当您想要限制函数调用的时间间隔时,请使用 `throttle`。这在处理频繁发生的事件(如滚动、调整大小、鼠标移动)时优化性能很有用。

与 `debounce` 不同,throttle 保证函数在指定时间内至少执行一次。

```typescript
import { throttle } from 'es-toolkit/function';

// 基本用法 (每秒最多执行一次)
const throttledLog = throttle(() => {
  console.log('函数执行了!');
}, 1000);

// 第一次调用: 立即执行
throttledLog(); // 输出 '函数执行了!'

// 1 秒内的额外调用: 被忽略
throttledLog();
throttledLog();

// 1 秒后最后一次调用作为 trailing 执行

// 优化滚动事件
const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY);
}, 100); // 每 100ms 最多一次

window.addEventListener('scroll', handleScroll);

// 优化 API 调用
const searchThrottled = throttle(async (query: string) => {
  const results = await fetch(`/api/search?q=${query}`);
  console.log('搜索结果:', await results.json());
}, 300);

// 即使每次输入都调用,也只每 300ms 执行一次实际搜索
searchThrottled('hello');
searchThrottled('hello w');
searchThrottled('hello world');
```

可以调整 leading 和 trailing 选项。

```typescript
import { throttle } from 'es-toolkit/function';

// 只启用 leading (只在开始时执行)
const leadingOnly = throttle(() => console.log('Leading only'), 1000, { edges: ['leading'] });

// 只启用 trailing (只在结束时执行)
const trailingOnly = throttle(() => console.log('Trailing only'), 1000, { edges: ['trailing'] });

leadingOnly(); // 立即执行
leadingOnly(); // 被忽略
leadingOnly(); // 被忽略

trailingOnly(); // 不会立即执行
trailingOnly(); // 被忽略
trailingOnly(); // 1 秒后执行
```

也可以手动控制。

```typescript
import { throttle } from 'es-toolkit/function';

const throttledFunc = throttle(() => console.log('执行了'), 1000);

throttledFunc(); // 立即执行
throttledFunc(); // 等待中

// 立即处理等待中的执行
throttledFunc.flush();

// 取消等待中的执行
throttledFunc.cancel();
```

## unary

### `unary(func)`

当您想限制函数只接受一个参数时,请使用 `unary`。所有额外传递的参数都会被忽略。

这在数组的 `map`、`filter`、`forEach` 等方法中非常有用,可以防止回调函数接收到比预期更多的参数。

```typescript
import { unary } from 'es-toolkit/function';

// 基本用法
function greet(name: string, age?: number, city?: string) {
  console.log(`您好,${name}!`);
  if (age) console.log(`年龄:${age}`);
  if (city) console.log(`城市:${city}`);
}

const greetOnlyName = unary(greet);
greetOnlyName('小明', 25, '北京'); // 只输出 '您好,小明!'

// 与数组方法一起使用
const numbers = ['1', '2', '3', '4', '5'];

// parseInt 的第二个参数接受基数,
// 但 map 的回调会传递 (value, index, array)
console.log(numbers.map(parseInt)); // [1, NaN, NaN, NaN, NaN] (意外的结果)

// 使用 unary 只传递第一个参数
console.log(numbers.map(unary(parseInt))); // [1, 2, 3, 4, 5] (预期的结果)

// 其他示例:当函数接受多个参数但只想使用一个时
function logValue(value: any, prefix: string = 'Value:', suffix: string = '') {
  console.log(`${prefix} ${value} ${suffix}`);
}

const data = ['apple', 'banana', 'cherry'];

// 只想输出值,不要 prefix 和 suffix
data.forEach(unary(logValue));
// Value: apple
// Value: banana
// Value: cherry
```

在函数组合中也很有用。

```typescript
import { unary } from 'es-toolkit/function';

// 接受多个参数的函数
function multiply(a: number, b: number = 1, c: number = 1) {
  return a * b * c;
}

// 限制为只使用第一个参数
const multiplyOne = unary(multiply);

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => multiplyOne(x, 2, 3)); // b 和 c 被忽略
console.log(doubled); // [1, 2, 3, 4, 5] (1 * 1 * 1 的结果)
```
