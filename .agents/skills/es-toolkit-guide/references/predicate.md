# 用法汇总 - predicate

## isArrayBuffer

### `isArrayBuffer(value)`

当您想确认某个值是否为 `ArrayBuffer` 时，请使用 `isArrayBuffer`。它可以在 TypeScript 中作为类型守卫使用。

```typescript
import { isArrayBuffer } from 'es-toolkit/predicate';

// ArrayBuffer 实例确认
const buffer = new ArrayBuffer(16);
const notBuffer = new Array(16);

console.log(isArrayBuffer(buffer)); // true
console.log(isArrayBuffer(notBuffer)); // false

// 在处理二进制数据时很有用
const data: unknown = getDataFromAPI();
if (isArrayBuffer(data)) {
  // 在 TypeScript 中，data 类型被缩小为 ArrayBuffer
  const uint8View = new Uint8Array(data);
  console.log(`Buffer size: ${data.byteLength} bytes`);
}

// 与各种类型比较
console.log(isArrayBuffer(new ArrayBuffer(8))); // true
console.log(isArrayBuffer(new Uint8Array(8))); // false
console.log(isArrayBuffer(new DataView(new ArrayBuffer(8)))); // false
console.log(isArrayBuffer([])); // false
console.log(isArrayBuffer({})); // false
console.log(isArrayBuffer(null)); // false
console.log(isArrayBuffer(undefined)); // false
```

在文件处理或网络通信中经常使用。

```typescript
import { isArrayBuffer } from 'es-toolkit/predicate';

// 处理文件读取结果
async function processFileData(file: File) {
  const result = await file.arrayBuffer();

  if (isArrayBuffer(result)) {
    console.log(`文件大小：${result.byteLength} 字节`);

    // 处理二进制数据
    const view = new DataView(result);
    const header = view.getUint32(0, true);
    console.log(`文件头：${header.toString(16)}`);
  }
}

// 检查从 WebSocket 接收的数据
function handleWebSocketMessage(data: unknown) {
  if (isArrayBuffer(data)) {
    console.log('收到二进制消息');
    const bytes = new Uint8Array(data);
    // 处理字节数据
  } else if (typeof data === 'string') {
    console.log('收到文本消息');
    // 处理字符串数据
  }
}
```

## isBlob

### `isBlob(value)`

当您想确认某个值是否为 Blob 实例时，请使用 `isBlob`。在浏览器环境中处理文件或二进制数据时很有用。

```typescript
import { isBlob } from 'es-toolkit/predicate';

// 基本 Blob 实例
const blob = new Blob(['hello'], { type: 'text/plain' });
const file = new File(['content'], 'example.txt', { type: 'text/plain' });

console.log(isBlob(blob)); // true
console.log(isBlob(file)); // true (File 继承自 Blob)

// 非 Blob 值
console.log(isBlob(new ArrayBuffer(8))); // false
console.log(isBlob('text data')); // false
console.log(isBlob({})); // false
console.log(isBlob(null)); // false
```

在文件处理或 API 响应验证中很有用。

```typescript
import { isBlob } from 'es-toolkit/predicate';

// 处理上传的文件
function processUploadedFile(file: unknown) {
  if (isBlob(file)) {
    // TypeScript 将 file 推断为 Blob
    console.log(`文件大小：${file.size} 字节`);
    console.log(`MIME 类型：${file.type}`);

    // 安全地使用 Blob 方法
    file.text().then(text => console.log('内容:', text));
  } else {
    console.log('无效的文件');
  }
}

// 实现下载功能
async function handleDownload(data: unknown, filename: string) {
  if (isBlob(data)) {
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

## isBoolean

### `isBoolean(value)`

当您想确认某个值是否为 `true` 或 `false` 时，请使用 `isBoolean`。在 TypeScript 中作为类型守卫工作，将值的类型缩小为 `boolean`。

```typescript
import { isBoolean } from 'es-toolkit/predicate';

// 基本布尔值确认
isBoolean(true); // true
isBoolean(false); // true

// 与其他类型区分
isBoolean(1); // false
isBoolean(0); // false
isBoolean('true'); // false
isBoolean('false'); // false
```

在 TypeScript 中作为类型守卫使用时特别有用。

```typescript
import { isBoolean } from 'es-toolkit/predicate';

function processValue(value: unknown) {
  if (isBoolean(value)) {
    // value 类型被缩小为 boolean
    console.log(value ? '是真' : '是假');
  } else {
    console.log('不是布尔值');
  }
}
```

也可以用于 API 响应或用户输入验证。

```typescript
import { isBoolean } from 'es-toolkit/predicate';

// API 响应验证
interface APIResponse {
  success: unknown;
  data: any;
}

function validateResponse(response: APIResponse) {
  if (isBoolean(response.success)) {
    console.log(`API 调用${response.success ? '成功' : '失败'}`);
    return response.success;
  }
  console.log('错误的响应格式');
  return false;
}
```

## isBrowser

### `isBrowser()`

当有需要仅在浏览器环境中执行的代码时，请使用 `isBrowser`。它通过检查 `window.document` 的存在来判断是否为浏览器环境。在 SSR（服务端渲染）或 Node.js 环境中很有用。

```typescript
import { isBrowser } from 'es-toolkit/predicate';

// 仅在浏览器环境中操作 DOM
if (isBrowser()) {
  document.getElementById('app').innerHTML = 'Hello World';
  console.log('在浏览器环境中运行');
} else {
  console.log('在服务器环境中运行');
}
```

可以用于实现基于环境的条件逻辑。

```typescript
import { isBrowser } from 'es-toolkit/predicate';

function getWindowWidth() {
  if (isBrowser()) {
    return window.innerWidth;
  }
  return 0; // 在服务器端返回默认值
}

// 注册事件监听器
function addWindowListener() {
  if (isBrowser()) {
    window.addEventListener('resize', () => {
      console.log('窗口大小已改变');
    });
  }
}
```

在 Next.js、Nuxt.js 等 SSR 框架中特别有用。

```typescript
import { isBrowser } from 'es-toolkit/predicate';

function initializeAnalytics() {
  if (isBrowser()) {
    // 仅在浏览器中加载分析脚本
    const script = document.createElement('script');
    script.src = 'https://analytics.example.com/script.js';
    document.head.appendChild(script);
  }
}

// 访问本地存储
function getStoredValue(key: string) {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
}
```

## isBuffer

### `isBuffer(value)`

在 Node.js 环境中想确认某个值是否为 Buffer 对象时，请使用 `isBuffer`。在文件处理、网络通信、二进制数据操作时很有用。在 TypeScript 中作为类型守卫工作，将值的类型缩小为 `Buffer`。

```typescript
import { isBuffer } from 'es-toolkit/predicate';

// Buffer 实例确认
const buffer = Buffer.from('hello world', 'utf8');
isBuffer(buffer); // true

// 与其他类型区分
isBuffer('hello world'); // false
isBuffer(new Uint8Array([1, 2, 3])); // false
isBuffer(new ArrayBuffer(8)); // false
```

在 TypeScript 中作为类型守卫使用时特别有用。

```typescript
import { isBuffer } from 'es-toolkit/predicate';

function processData(data: unknown) {
  if (isBuffer(data)) {
    // data 类型被缩小为 Buffer
    console.log(`Buffer 大小：${data.length} 字节`);
    console.log(`Buffer 内容：${data.toString('utf8')}`);

    // 可以安全地使用 Buffer 方法
    const slice = data.slice(0, 10);
  }
}
```

在文件处理或网络通信中经常使用。

```typescript
import { isBuffer } from 'es-toolkit/predicate';

// 处理文件数据
function readFileData(data: unknown) {
  if (isBuffer(data)) {
    const text = data.toString('utf8');
    const header = data.readUInt32BE(0);
    console.log('文件内容:', text);
  }
}

// 处理网络数据
function handleNetworkData(chunk: unknown) {
  if (isBuffer(chunk)) {
    console.log(`接收数据大小：${chunk.length} 字节`);
    const processed = Buffer.concat([chunk, Buffer.from('\n')]);
    return processed;
  }
  return null;
}
```

## isDate

### `isDate(value)`

当您想确认某个值是否为日期对象时，请使用 `isDate`。在区分字符串或数字形式的日期表示与 Date 对象时很有用。在 TypeScript 中作为类型守卫工作，将值的类型缩小为 `Date`。

```typescript
import { isDate } from 'es-toolkit/predicate';

// Date 对象确认
const date = new Date();
isDate(date); // true

// 与其他类型区分
isDate('2024-01-01'); // false - 字符串
isDate(1640995200000); // false - 时间戳
isDate({}); // false
```

在 TypeScript 中作为类型守卫使用时特别有用。

```typescript
import { isDate } from 'es-toolkit/predicate';

function formatDate(value: unknown): string {
  if (isDate(value)) {
    // value 类型被缩小为 Date
    return value.toISOString();
  }
  return '无效日期';
}
```

可以用于 API 响应处理或用户输入验证。

```typescript
import { isDate } from 'es-toolkit/predicate';

// API 响应处理
function processResponse(response: { createdAt: unknown }) {
  if (isDate(response.createdAt)) {
    console.log(`创建时间：${response.createdAt.toLocaleDateString()}`);
  }
}

// 日期有效性验证
function validateBirthDate(value: unknown): boolean {
  if (isDate(value)) {
    const now = new Date();
    const minAge = new Date(now.getFullYear() - 150, now.getMonth(), now.getDate());

    return value <= now && value >= minAge;
  }
  return false;
}
```

## isEmptyObject

### `isEmptyObject(value)`

当您想检查是否为像 `{}` 一样没有任何属性的纯对象时使用 `isEmptyObject`。对于数组、Map、Set 等其他对象类型返回 `false`。

```typescript
import { isEmptyObject } from 'es-toolkit';

// 没有属性的纯对象
isEmptyObject({}); // true
isEmptyObject(new Object()); // true
isEmptyObject(Object.create(null)); // true

// 有属性的对象
isEmptyObject({ a: 1 }); // false
isEmptyObject({ key: 'value' }); // false

// 非纯对象类型
isEmptyObject([]); // false (数组)
isEmptyObject(null); // false
isEmptyObject(new Map()); // false
isEmptyObject(new Set()); // false
```

## isEqual

### `isEqual(a, b)`

当您想检查包括对象、数组、Date、RegExp 等在内的两个值是否深度相等时，请使用 `isEqual`。即使引用不同，只要内容相同就返回 `true`。在单元测试或数据比较时很有用。

```typescript
import { isEqual } from 'es-toolkit/predicate';

// 原始类型比较
isEqual(1, 1); // true
isEqual('hello', 'hello'); // true
isEqual(true, true); // true

// 特殊值处理
isEqual(NaN, NaN); // true
isEqual(+0, -0); // true
```

支持对象和数组的深度比较。

```typescript
import { isEqual } from 'es-toolkit/predicate';

// 深度对象比较
const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
isEqual(obj1, obj2); // true

// 数组比较
const arr1 = [1, 2, [3, 4]];
const arr2 = [1, 2, [3, 4]];
isEqual(arr1, arr2); // true
```

可以比较 Date、RegExp、Map、Set 等对象。

```typescript
import { isEqual } from 'es-toolkit/predicate';

// 日期比较
const date1 = new Date('2020-01-01');
const date2 = new Date('2020-01-01');
isEqual(date1, date2); // true

// 正则表达式比较
const regex1 = /hello/g;
const regex2 = /hello/g;
isEqual(regex1, regex2); // true

// Map 和 Set 比较
const map1 = new Map([['key', 'value']]);
const map2 = new Map([['key', 'value']]);
isEqual(map1, map2); // true

const set1 = new Set([1, 2, 3]);
const set2 = new Set([1, 2, 3]);
isEqual(set1, set2); // true
```

在单元测试中经常使用。

```typescript
import { isEqual } from 'es-toolkit/predicate';

function testApiResponse() {
  const expected = { status: 200, data: { message: 'success' } };
  const actual = { status: 200, data: { message: 'success' } };

  if (isEqual(expected, actual)) {
    console.log('测试通过！');
  } else {
    console.log('测试失败！');
  }
}
```

## isEqualWith

### `isEqualWith(a, b, areValuesEqual)`

当需要特殊比较逻辑时，请使用 `isEqualWith`。如果自定义函数返回 `true` 或 `false`，则使用该结果；如果返回 `undefined`，则使用默认比较方式。对于忽略大小写、排除特定属性、近似值比较等场景很有用。

```typescript
import { isEqualWith } from 'es-toolkit/predicate';

// 不区分大小写的字符串比较
const caseInsensitiveCompare = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.toLowerCase() === b.toLowerCase();
  }
};

isEqualWith('Hello', 'hello', caseInsensitiveCompare); // true
isEqualWith({ name: 'Alice' }, { name: 'ALICE' }, caseInsensitiveCompare); // true
```

也可以用于数字的近似值比较。

```typescript
import { isEqualWith } from 'es-toolkit/predicate';

// 允许浮点数误差的比较
const approximateCompare = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.01; // 将 0.01 以下的差异视为相等
  }
};

isEqualWith(0.1 + 0.2, 0.3, approximateCompare); // true
isEqualWith({ price: 10.01 }, { price: 10.02 }, approximateCompare); // true
```

在想要忽略特定属性进行比较时也很有用。

```typescript
import { isEqualWith } from 'es-toolkit/predicate';

// 忽略特定属性的比较
const ignoreTimestamp = (a, b, property) => {
  if (property === 'timestamp') {
    return true; // 将 timestamp 属性始终视为相等
  }
};

const obj1 = { id: 1, name: 'Test', timestamp: 1000 };
const obj2 = { id: 1, name: 'Test', timestamp: 2000 };
isEqualWith(obj1, obj2, ignoreTimestamp); // true
```

也可以实现复杂的自定义比较逻辑。

```typescript
import { isEqualWith } from 'es-toolkit/predicate';

const areValuesEqual = (a, b, property) => {
  // 忽略 ID
  if (property === 'id') {
    return true;
  }

  // 不区分大小写比较名称
  if (property === 'name' && typeof a === 'string' && typeof b === 'string') {
    return a.toLowerCase() === b.toLowerCase();
  }

  // 对其余使用默认比较方式
  return undefined;
};

const user1 = { id: 1, name: 'Alice', age: 25 };
const user2 = { id: 999, name: 'ALICE', age: 25 };
isEqualWith(user1, user2, areValuesEqual); // true
```

## isError

### `isError(value)`

当您想确认某个值是否为 `Error` 对象时，请使用 `isError`。在 TypeScript 中作为类型守卫使用，可以将值的类型缩小为 `Error`。在 try-catch 块或 API 响应处理时特别有用。

```typescript
import { isError } from 'es-toolkit/predicate';

// Error 对象确认
isError(new Error('Something went wrong')); // true
isError(new TypeError('Type error')); // true

// 与其他类型区分
isError('error'); // false
isError({ name: 'Error', message: 'Custom error' }); // false
```

在 TypeScript 中作为类型守卫使用时，值的类型会被缩小。

```typescript
function handleError(value: unknown) {
  if (isError(value)) {
    // value 类型被缩小为 Error
    console.log(`发生错误：${value.message}`);
    return value.name;
  }
  return '不是错误';
}
```

## isFile

### `isFile(value)`

当您想确认某个值是否为 File 实例时，请使用 `isFile`。File 对象是 Web API 的一部分，表示用户上传的文件或从文件系统获取的文件。与 Blob 对象不同，它包含文件名和最后修改时间等额外信息。

```typescript
import { isFile } from 'es-toolkit/predicate';

// File 对象确认
const file = new File(['hello'], 'example.txt', { type: 'text/plain' });
console.log(isFile(file)); // true

// Blob 对象不是 File
const blob = new Blob(['hello'], { type: 'text/plain' });
console.log(isFile(blob)); // false

// 一般对象
console.log(isFile({})); // false
console.log(isFile([])); // false
console.log(isFile('text')); // false
console.log(isFile(null)); // false
console.log(isFile(undefined)); // false
```

可用于验证给定参数是否为有效文件。

```typescript
// 文件上传处理器
function handleFileUpload(input: unknown) {
  if (isFile(input)) {
    console.log(`文件名：${input.name}`);
    console.log(`文件大小：${input.size} bytes`);
    console.log(`文件类型：${input.type}`);
    console.log(`最后修改：${input.lastModified}`);

    // 确定是 File，可以安全访问文件相关属性
    return input;
  }

  throw new Error('不是有效的文件');
}
```

在不支持 `File` 的 JavaScript 执行环境中也能安全处理。

```typescript
// 在 Node.js 环境或不支持 File 的环境中也安全
console.log(isFile(new Date())); // false

// 在未定义 File 的环境中也不会发生错误
if (typeof File === 'undefined') {
  console.log(isFile({})); // false
}
```

## isFunction

### `isFunction(value)`

当您想确认某个值是否为函数时，请使用 `isFunction`。可以检测一般函数、异步函数、生成器函数、构造函数等所有类型的函数。

```typescript
import { isFunction } from 'es-toolkit/predicate';

// 一般函数
console.log(isFunction(function () {})); // true
console.log(isFunction(() => {})); // true
console.log(isFunction(Array.prototype.slice)); // true

// 异步函数
console.log(isFunction(async function () {})); // true
console.log(isFunction(async () => {})); // true

// 生成器函数
console.log(isFunction(function* () {})); // true

// 构造函数
console.log(isFunction(Array)); // true
console.log(isFunction(Date)); // true
console.log(isFunction(RegExp)); // true
console.log(isFunction(Promise)); // true
```

也能检测内置 JavaScript 函数和类：

```typescript
// 内置构造函数
console.log(isFunction(Object)); // true
console.log(isFunction(String)); // true
console.log(isFunction(Number)); // true
console.log(isFunction(Boolean)); // true

// 类型数组构造函数
console.log(isFunction(Int8Array)); // true
console.log(isFunction(Uint8Array)); // true
console.log(isFunction(Float32Array)); // true

// Proxy 和 Reflect
console.log(isFunction(Proxy)); // true
console.log(isFunction(Reflect.get)); // true
```

与非函数值区分：

```typescript
// 不是函数的值
console.log(isFunction({})); // false
console.log(isFunction([])); // false
console.log(isFunction('text')); // false
console.log(isFunction(42)); // false
console.log(isFunction(null)); // false
console.log(isFunction(undefined)); // false

// 看起来像函数但不是函数的值
console.log(isFunction({ call: function () {} })); // false
```

在回调函数验证或动态函数调用中很有用：

```typescript
// 回调函数验证
function processData(data: any[], callback?: unknown) {
  const result = data.map(item => item * 2);

  if (isFunction(callback)) {
    // 确定 callback 是函数，可以安全调用
    callback(result);
  }

  return result;
}

// 动态函数执行
function executeIfFunction(fn: unknown, ...args: any[]) {
  if (isFunction(fn)) {
    return fn(...args);
  }

  console.log('给定的值不是函数');
  return null;
}

// 在方法链中检查函数
const utils = {
  data: [1, 2, 3],
  process(fn: unknown) {
    if (isFunction(fn)) {
      this.data = this.data.map(fn);
    }
    return this;
  },
};
```

## isJSON

### `isJSON(value)`

当您想确认某个字符串是否为有效的 JSON 格式时，请使用 `isJSON`。此函数检查字符串是否可以用 `JSON.parse()` 解析。根据 JSON 规范，有效值包括表示对象、数组、字符串、数字、布尔值、`null` 的所有字符串。

```typescript
import { isJSON } from 'es-toolkit/predicate';

// 有效的 JSON 字符串
console.log(isJSON('{"name":"John","age":30}')); // true
console.log(isJSON('[1,2,3]')); // true
console.log(isJSON('"hello world"')); // true
console.log(isJSON('42')); // true
console.log(isJSON('true')); // true
console.log(isJSON('false')); // true
console.log(isJSON('null')); // true

// 无效的 JSON 字符串
console.log(isJSON('undefined')); // false
console.log(isJSON('function() {}')); // false
console.log(isJSON('{name: "John"}')); // false (键没有引号)
console.log(isJSON("{'name': 'John'}")); // false (使用单引号)
console.log(isJSON('{}')); // true (空对象有效)
console.log(isJSON('[]')); // true (空数组有效)
```

非字符串值都返回 `false`：

```typescript
// 非字符串值
console.log(isJSON({ name: 'John' })); // false
console.log(isJSON([1, 2, 3])); // false
console.log(isJSON(42)); // false
console.log(isJSON(true)); // false
console.log(isJSON(null)); // false
console.log(isJSON(undefined)); // false
```

在 API 响应或用户输入验证中很有用：

```typescript
// API 响应验证
function processApiResponse(response: unknown) {
  if (isJSON(response)) {
    try {
      const data = JSON.parse(response);
      console.log('解析的数据:', data);
      return data;
    } catch (error) {
      // isJSON 返回 true，这里不会执行
      console.error('解析失败:', error);
    }
  }

  console.log('不是有效的 JSON 字符串');
  return null;
}

// 用户输入验证
function validateJsonInput(input: unknown): string | null {
  if (isJSON(input)) {
    // TypeScript 将 input 推断为 string
    return input;
  }

  throw new Error('输入值必须是有效的 JSON 字符串');
}

// 配置文件验证
function loadConfig(configString: unknown) {
  if (isJSON(configString)) {
    const config = JSON.parse(configString);
    return {
      isValid: true,
      config,
      error: null,
    };
  }

  return {
    isValid: false,
    config: null,
    error: 'Invalid JSON format',
  };
}
```

也能准确检测复杂的 JSON 结构：

```typescript
const complexJson = `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "preferences": {
        "theme": "dark",
        "notifications": true
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1
  }
}`;

console.log(isJSON(complexJson)); // true

// 错误的格式
console.log(isJSON('{ "name": "John", }')); // false (trailing comma)
console.log(isJSON('{ name: "John" }')); // false (unquoted key)
console.log(isJSON("{ 'name': 'John' }")); // false (single quotes)
```

## isJSONArray

### `isJSONArray(value)`

当您想确认数组的所有元素是否都是有效的 JSON 值时，请使用 `isJSONArray`。有效的 JSON 数组是指所有项都可以序列化为 JSON 的值（`null`、对象、数组、字符串、数字、布尔值）组成的数组。

```typescript
import { isJSONArray } from 'es-toolkit/predicate';

// 有效的 JSON 数组
console.log(isJSONArray([1, 2, 3])); // true
console.log(isJSONArray(['hello', 'world'])); // true
console.log(isJSONArray([true, false, null])); // true
console.log(isJSONArray([{ name: 'John' }, { name: 'Jane' }])); // true
console.log(
  isJSONArray([
    [1, 2],
    [3, 4],
  ])
); // true (嵌套数组)
console.log(isJSONArray([])); // true (空数组)

// 复合有效 JSON 数组
const complexArray = [42, 'text', true, null, { key: 'value' }, [1, 2, 3]];
console.log(isJSONArray(complexArray)); // true
```

与无效的 JSON 数组区分：

```typescript
// 包含函数的数组 - 无效
console.log(isJSONArray([1, 2, () => {}])); // false
console.log(isJSONArray([function () {}])); // false

// 包含 undefined 的数组 - 无效
console.log(isJSONArray([1, undefined, 3])); // false

// 包含 Symbol 的数组 - 无效
console.log(isJSONArray([Symbol('test')])); // false

// 包含 Date 对象的数组 - 无效（在 JSON 中必须转换为字符串）
console.log(isJSONArray([new Date()])); // false

// 非数组值
console.log(isJSONArray('not an array')); // false
console.log(isJSONArray({ 0: 'a', 1: 'b', length: 2 })); // false (类数组对象)
console.log(isJSONArray(42)); // false
console.log(isJSONArray(null)); // false
```

在 API 响应验证或数据序列化前验证时很有用。

```typescript
// API 响应验证
function processApiArray(data: unknown) {
  if (isJSONArray(data)) {
    // 可以安全使用 JSON.stringify
    const jsonString = JSON.stringify(data);
    console.log('序列化的数组:', jsonString);
    return data;
  }

  throw new Error('不是有效的 JSON 数组');
}

// 用户输入数据验证
function validateUserList(input: unknown): any[] {
  if (isJSONArray(input)) {
    // TypeScript 将 input 推断为 any[]
    return input;
  }

  return [];
}

// 配置数组验证
function loadArrayConfig(config: unknown) {
  if (isJSONArray(config)) {
    return {
      isValid: true,
      items: config,
      count: config.length,
    };
  }

  return {
    isValid: false,
    items: [],
    count: 0,
  };
}

// 在嵌套结构中也能工作
const nestedData = [{ users: [{ name: 'Alice' }, { name: 'Bob' }] }, { users: [{ name: 'Charlie' }] }];
console.log(isJSONArray(nestedData)); // true
```

对于包含函数作为元素的数组或 `TypedArray` 对象等无法序列化为 JSON 的数组，返回 `false`。

```typescript
// 一般数组 vs JSON 数组
const regularArray = [1, 2, function () {}]; // 一般有效的数组
const jsonArray = [1, 2, 3]; // 可序列化为 JSON 的数组

console.log(Array.isArray(regularArray)); // true (一般数组检查)
console.log(isJSONArray(regularArray)); // false (JSON 数组检查)

console.log(Array.isArray(jsonArray)); // true
console.log(isJSONArray(jsonArray)); // true

// TypedArray 不是 JSON 数组
const typedArray = new Int32Array([1, 2, 3]);
console.log(Array.isArray(typedArray)); // false
console.log(isJSONArray(typedArray)); // false
```

## isJSONObject

### `isJSONObject(value)`

当您想确认对象的所有键都是字符串且所有值都是有效的 JSON 值时，请使用 `isJSONObject`。有效的 JSON 对象是指由字符串键和可序列化为 JSON 的值（`null`、对象、数组、字符串、数字、布尔值）组成的纯对象。

```typescript
import { isJSONObject } from 'es-toolkit/predicate';

// 有效的 JSON 对象
console.log(isJSONObject({ name: 'John', age: 30 })); // true
console.log(isJSONObject({ active: true, score: null })); // true
console.log(isJSONObject({})); // true (空对象)

// 嵌套结构验证
const nested = {
  user: {
    name: 'Alice',
    preferences: {
      theme: 'dark',
      notifications: true,
    },
  },
  data: [1, 2, 3],
  timestamp: null,
};
console.log(isJSONObject(nested)); // true

// 复合有效 JSON 对象
const complex = {
  id: 42,
  title: 'Example',
  published: true,
  tags: ['javascript', 'tutorial'],
  author: {
    name: 'Developer',
    email: 'dev@example.com',
  },
  metadata: null,
};
console.log(isJSONObject(complex)); // true
```

准确区分包含函数、`Symbol`、`Date` 对象、`undefined` 等无法序列化为 JSON 的值或类实例的无效 JSON 对象。

```typescript
// 包含函数的对象 - 无效
console.log(isJSONObject({ name: 'John', greet: () => {} })); // false
console.log(isJSONObject({ method: function () {} })); // false

// 包含 undefined 的对象 - 无效
console.log(isJSONObject({ name: 'John', age: undefined })); // false

// 包含 Symbol 键或值的对象 - 无效
console.log(isJSONObject({ [Symbol('key')]: 'value' })); // false
console.log(isJSONObject({ name: Symbol('name') })); // false

// Date、RegExp 等对象 - 无效
console.log(isJSONObject({ created: new Date() })); // false
console.log(isJSONObject({ pattern: /test/ })); // false

// 类实例 - 无效
class Person {
  constructor(public name: string) {}
}
console.log(isJSONObject(new Person('John'))); // false

// 非对象值
console.log(isJSONObject('not an object')); // false
console.log(isJSONObject(42)); // false
console.log(isJSONObject([1, 2, 3])); // false
console.log(isJSONObject(null)); // false
```

可用于验证是否可以安全使用 `JSON.stringify`。

```typescript
// API 响应验证
function processApiResponse(data: unknown) {
  if (isJSONObject(data)) {
    // 可以安全使用 JSON.stringify
    const jsonString = JSON.stringify(data);
    console.log('序列化的对象:', jsonString);

    // TypeScript 将 data 推断为 Record<string, any>
    return data;
  }

  throw new Error('不是有效的 JSON 对象');
}

// 配置对象验证
function loadConfig(config: unknown) {
  if (isJSONObject(config)) {
    return {
      isValid: true,
      config,
      keys: Object.keys(config),
    };
  }

  return {
    isValid: false,
    config: {},
    keys: [],
  };
}

// 用户输入数据验证
function validateUserData(input: unknown): Record<string, any> {
  if (isJSONObject(input)) {
    // 确保所有属性都可序列化为 JSON
    return input;
  }

  throw new Error('用户数据必须是有效的 JSON 对象');
}

// 嵌套对象验证
function validateNestedConfig(data: unknown) {
  if (isJSONObject(data)) {
    // 确保所有嵌套对象和数组也都符合 JSON 有效性
    console.log('配置完全兼容 JSON');
    return data;
  }

  return null;
}
```

`isJSONObject` 与其他对象检查函数有不同的目的。`isPlainObject` 检查是否为纯对象，而 `isJSONObject` 检查是否可序列化为 JSON 的对象。

```typescript
import { isPlainObject } from 'es-toolkit/predicate';

const objectWithFunction = {
  name: 'John',
  greet: function () {
    return 'Hello';
  },
};

const plainJsonObject = {
  name: 'John',
  age: 30,
};

// 纯对象 vs JSON 对象
console.log(isPlainObject(objectWithFunction)); // true (纯对象)
console.log(isJSONObject(objectWithFunction)); // false (包含函数，不是 JSON 对象)

console.log(isPlainObject(plainJsonObject)); // true
console.log(isJSONObject(plainJsonObject)); // true

// 内置对象
console.log(isPlainObject(new Date())); // false
console.log(isJSONObject(new Date())); // false

// 数组
console.log(isPlainObject([])); // false
console.log(isJSONObject([])); // false (数组是 JSON 值但不是 JSON "对象")
```

## isJSONValue

### `isJSONValue(value)`

当您想确认某个值是否可序列化为 JSON 的有效值时，请使用 `isJSONValue`。根据 JSON 规范，有效值包括 `null`、对象、数组、字符串、数字、布尔值。此函数是其他 JSON 相关类型守卫的基础函数。

```typescript
import { isJSONValue } from 'es-toolkit/predicate';

// 原始 JSON 值
console.log(isJSONValue(null)); // true
console.log(isJSONValue('hello')); // true
console.log(isJSONValue(42)); // true
console.log(isJSONValue(true)); // true
console.log(isJSONValue(false)); // true

// 对象和数组（内部值也都必须有效）
console.log(isJSONValue({ name: 'John', age: 30 })); // true
console.log(isJSONValue([1, 2, 3, 'text'])); // true
console.log(isJSONValue([])); // true (空数组)
console.log(isJSONValue({})); // true (空对象)

// 嵌套结构
const complexData = {
  user: {
    name: 'Alice',
    active: true,
    scores: [95, 87, 92],
  },
  metadata: null,
};
console.log(isJSONValue(complexData)); // true
```

准确区分无法序列化为 JSON 的值。函数、`undefined`、`Symbol`、类实例等不受 JSON 规范支持的类型会返回 `false`：

```typescript
// undefined 不受 JSON 支持
console.log(isJSONValue(undefined)); // false

// 函数无法序列化为 JSON
console.log(isJSONValue(() => {})); // false
console.log(isJSONValue(function () {})); // false

// Symbol 不受 JSON 支持
console.log(isJSONValue(Symbol('test'))); // false

// Date 对象在 JSON 中必须转换为字符串
console.log(isJSONValue(new Date())); // false

// RegExp 对象也不受 JSON 支持
console.log(isJSONValue(/pattern/)); // false

// 包含函数或 undefined 的对象/数组
console.log(isJSONValue({ name: 'John', greet: () => {} })); // false
console.log(isJSONValue([1, 2, undefined])); // false

// BigInt 不受 JSON 支持
console.log(isJSONValue(BigInt(123))); // false
```

在 JSON 序列化前的数据验证中很有用：

```typescript
// 安全的 JSON 序列化
function safeJsonStringify(data: unknown): string | null {
  if (isJSONValue(data)) {
    // 确保 data 是有效的 JSON 值
    return JSON.stringify(data);
  }

  console.warn('数据无法序列化为 JSON');
  return null;
}

// API 请求数据验证
function sendApiRequest(data: unknown) {
  if (isJSONValue(data)) {
    const jsonPayload = JSON.stringify(data);
    // 发送 API 请求
    console.log('要发送的数据:', jsonPayload);
    return fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonPayload,
    });
  }

  throw new Error('API 数据必须可序列化为 JSON');
}

// localStorage 保存前验证
function saveToStorage(key: string, value: unknown) {
  if (isJSONValue(value)) {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  console.error('无法保存到 localStorage 的数据类型');
  return false;
}

// 配置文件验证
function validateConfig(config: unknown) {
  if (isJSONValue(config)) {
    return {
      isValid: true,
      config,
      serialized: JSON.stringify(config),
    };
  }

  return {
    isValid: false,
    config: null,
    error: 'Config must be a valid JSON value',
  };
}
```

可以与其他类型守卫组合使用。

```typescript
// 检查具体的 JSON 类型
function processJsonData(data: unknown) {
  if (!isJSONValue(data)) {
    throw new Error('Invalid JSON value');
  }

  // 现在确保 data 是有效的 JSON 值
  if (isJSONObject(data)) {
    console.log('是 JSON 对象:', Object.keys(data));
  } else if (isJSONArray(data)) {
    console.log('是 JSON 数组:', data.length, '个项目');
  } else {
    console.log('是原始 JSON 值:', typeof data, data);
  }
}

// 嵌套数据验证
const testData = {
  valid: { name: 'test', values: [1, 2, 3] },
  invalid: { name: 'test', callback: () => {} },
};

console.log(isJSONValue(testData.valid)); // true
console.log(isJSONValue(testData.invalid)); // false
```

边界情况：

```typescript
// 特殊数字值
console.log(isJSONValue(Infinity)); // false (在 JSON 中转换为 null)
console.log(isJSONValue(-Infinity)); // false
console.log(isJSONValue(NaN)); // false (在 JSON 中转换为 null)

// 空值
console.log(isJSONValue('')); // true (空字符串)
console.log(isJSONValue(0)); // true
console.log(isJSONValue(false)); // true

// 具有原型的对象
const obj = Object.create({ inherited: 'value' });
obj.own = 'property';
console.log(isJSONValue(obj)); // true (视为纯对象)
```

## isLength

### `isLength(value)`

当您想确认某个值是否为有效的数组长度时，请使用 `isLength`。有效的长度必须是大于等于 0 且小于等于 `Number.MAX_SAFE_INTEGER` 的整数。

```typescript
import { isLength } from 'es-toolkit/predicate';

// 有效的长度
console.log(isLength(0)); // true
console.log(isLength(42)); // true
console.log(isLength(Number.MAX_SAFE_INTEGER)); // true

// 无效的长度
console.log(isLength(-1)); // false (负数)
console.log(isLength(1.5)); // false (小数)
console.log(isLength(Number.MAX_SAFE_INTEGER + 1)); // false (不安全的整数)
console.log(isLength('42')); // false (字符串)
console.log(isLength(null)); // false (null)
```

在 TypeScript 中也可以用作类型守卫。

```typescript
function processLength(value: unknown) {
  if (isLength(value)) {
    // 现在 value 类型被缩小为 number
    console.log(value.toFixed(2));
  }
}
```

## isMap

### `isMap(value)`

当你想检查值是否为Map实例时，使用`isMap`。它使用`instanceof`运算符检查是否为`Map`。

```typescript
import { isMap } from 'es-toolkit/predicate';

// Map实例
const map = new Map([['key', 'value']]);
console.log(isMap(map)); // true

// 非Map值
console.log(isMap(new Set())); // false
console.log(isMap(new WeakMap())); // false
console.log(isMap({})); // false
console.log(isMap([])); // false
console.log(isMap(null)); // false
```

在TypeScript中也可以用作类型守卫。

```typescript
function processValue(value: unknown) {
  if (isMap(value)) {
    // 现在value被缩小为Map<any, any>类型
    console.log(value.size);
    value.set('new-key', 'new-value');
  }
}
```

## isNil

### `isNil(value)`

当您想检查值是否为 `null` 或 `undefined` 时，请使用 `isNil`。

```typescript
import { isNil } from 'es-toolkit/predicate';

// null 或 undefined 值
console.log(isNil(null)); // true
console.log(isNil(undefined)); // true

// 其他值
console.log(isNil(0)); // false
console.log(isNil('')); // false
console.log(isNil(false)); // false
console.log(isNil([])); // false
console.log(isNil({})); // false
```

它也可以在 TypeScript 中用作类型守卫：

```typescript
function processValue(value: string | null | undefined) {
  if (isNil(value)) {
    // value 现在被缩小为 null | undefined 类型
    console.log('值为空');
  } else {
    // value 被缩小为 string 类型
    console.log(value.toUpperCase());
  }
}
```

## isNode

### `isNode()`

当您想检查当前代码是否在 Node.js 环境中运行时，请使用 `isNode`。在使用 Node.js 特定的 API 之前验证环境时非常有用。

```typescript
import { isNode } from 'es-toolkit/predicate';

if (isNode()) {
  // Node.js 特定代码
  console.log('此代码在 Node.js 中运行');
  const fs = await import('node:fs');
  const path = await import('node:path');
} else {
  // 仅浏览器代码
  console.log('此代码在浏览器中运行');
  const response = await fetch('/api/data');
}
```

在有条件地使用 Node.js 模块时也很有用：

```typescript
function getEnvironmentInfo() {
  if (isNode()) {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      environment: 'Node.js',
    };
  } else {
    return {
      userAgent: navigator.userAgent,
      environment: 'Browser',
    };
  }
}
```

## isNotNil

### `isNotNil(value)`

当您想检查值是否既不是 `null` 也不是 `undefined` 时，请使用 `isNotNil`。它对于从数组中过滤掉 `null` 或 `undefined` 值特别有用。

```typescript
import { isNotNil } from 'es-toolkit/predicate';

// 基本用法
console.log(isNotNil(42)); // true
console.log(isNotNil('hello')); // true
console.log(isNotNil([])); // true
console.log(isNotNil({})); // true

console.log(isNotNil(null)); // false
console.log(isNotNil(undefined)); // false

// 在数组过滤中很有用
const mixedArray = [1, null, 'hello', undefined, true, 0];
const filteredArray = mixedArray.filter(isNotNil);
// filteredArray 变成 [1, 'hello', true, 0]（null 和 undefined 被移除）
```

它也可以在 TypeScript 中用作类型守卫。

```typescript
function processItems(items: (string | null | undefined)[]) {
  // 使用 isNotNil 过滤会将类型缩小为 string[]
  const validItems = items.filter(isNotNil);

  validItems.forEach(item => {
    // item 现在被保证是 string 类型
    console.log(item.toUpperCase());
  });
}
```

## isNull

### `isNull(value)`

当您想检查值是否正好是 `null` 时，请使用 `isNull`。它使用严格相等（`===`）仅识别 `null` 而不识别 undefined。

```typescript
import { isNull } from 'es-toolkit/predicate';

// null 值
console.log(isNull(null)); // true

// 非 null 值
console.log(isNull(undefined)); // false
console.log(isNull(0)); // false
console.log(isNull('')); // false
console.log(isNull(false)); // false
console.log(isNull([])); // false
console.log(isNull({})); // false
```

它也可以在 TypeScript 中用作类型守卫。

```typescript
function processValue(value: string | null | undefined) {
  if (isNull(value)) {
    // value 现在被缩小为 null 类型
    console.log('值为 null');
  } else {
    // value 被缩小为 string | undefined 类型
    console.log('值不是 null：', value);
  }
}
```

`isNull` 与 [`isNil`](./isNil.md) 不同，它将 `undefined` 视为 `false`。

```typescript
import { isNil, isNull } from 'es-toolkit/predicate';

console.log(isNull(undefined)); // false
console.log(isNil(undefined)); // true
```

## isNumber

### `isNumber(value)`

当您想检查值是否为数字时使用 `isNumber`。

```typescript
import { isNumber } from 'es-toolkit/predicate';

// 基本数字值检查
isNumber(123); // true
isNumber(3.14); // true
isNumber(NaN); // true
isNumber(Infinity); // true

// 与其他类型区分
isNumber('123'); // false
isNumber(true); // false
isNumber(null); // false
isNumber(undefined); // false
```

在 TypeScript 中作为类型守卫使用时特别有用。

```typescript
import { isNumber } from 'es-toolkit';

function processValue(value: unknown) {
  if (isNumber(value)) {
    // value 类型被缩小为 number
    console.log(value * 2);
  } else {
    console.log('不是数字');
  }
}
```

## isPlainObject

### `isPlainObject(value)`

当您想检查值是否为普通对象时，请使用 `isPlainObject`。普通对象是使用对象字面量（`{}`）或 `Object` 构造函数创建的对象。类实例、数组或其他特殊对象不是普通对象。

```typescript
import { isPlainObject } from 'es-toolkit/predicate';

// 普通对象
console.log(isPlainObject({})); // true
console.log(isPlainObject({ name: 'John', age: 30 })); // true
console.log(isPlainObject(Object.create(null))); // true
console.log(isPlainObject(new Object())); // true

// 非普通对象
console.log(isPlainObject([])); // false（数组）
console.log(isPlainObject(new Date())); // false（Date 对象）
console.log(isPlainObject(new Set())); // false（Set 对象）
console.log(isPlainObject(new Map())); // false（Map 对象）
console.log(isPlainObject(null)); // false（null）
console.log(isPlainObject(42)); // false（数字）
console.log(isPlainObject('hello')); // false（字符串）

// 类实例
class MyClass {}
console.log(isPlainObject(new MyClass())); // false
```

在序列化数据或验证配置对象时很有用。

```typescript
function processConfig(config: unknown) {
  if (isPlainObject(config)) {
    // config 现在被缩小为 Record<PropertyKey, any> 类型
    console.log('有效的配置对象');
    Object.keys(config).forEach(key => {
      console.log(`${key}: ${config[key]}`);
    });
  } else {
    throw new Error('配置必须是普通对象');
  }
}
```

## isPrimitive

### `isPrimitive(value)`

当您想检查值是否为 JavaScript 原始值时，请使用 `isPrimitive`。JavaScript 的原始值包括 `null`、`undefined`、字符串、数字、布尔值、符号和 `BigInt`。它对于区分对象或函数等引用类型很有用。

```typescript
import { isPrimitive } from 'es-toolkit/predicate';

// 原始值
console.log(isPrimitive(null)); // true
console.log(isPrimitive(undefined)); // true
console.log(isPrimitive('hello')); // true
console.log(isPrimitive(42)); // true
console.log(isPrimitive(true)); // true
console.log(isPrimitive(false)); // true
console.log(isPrimitive(Symbol('test'))); // true
console.log(isPrimitive(123n)); // true

// 引用类型（非原始值）
console.log(isPrimitive({})); // false
console.log(isPrimitive([])); // false
console.log(isPrimitive(new Date())); // false
console.log(isPrimitive(new Map())); // false
console.log(isPrimitive(new Set())); // false
console.log(isPrimitive(() => {})); // false
console.log(isPrimitive(/regex/)); // false
```

在实现深拷贝逻辑时很有用。

```typescript
// 以不同方式处理原始值和对象
function deepClone(value: any): any {
  if (isPrimitive(value)) {
    // 原始值按原样返回
    return value;
  }

  // 对对象执行克隆逻辑
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }

  const result: any = {};
  for (const key in value) {
    result[key] = deepClone(value[key]);
  }
  return result;
}

// 在值比较中使用
function isEqual(a: unknown, b: unknown): boolean {
  if (isPrimitive(a) && isPrimitive(b)) {
    return a === b;
  }

  // 复杂的对象比较逻辑...
  return false;
}

// 用于日志记录的安全字符串转换
function safeLog(value: unknown) {
  if (isPrimitive(value)) {
    console.log('原始值:', value);
  } else {
    console.log('对象:', typeof value, Object.prototype.toString.call(value));
  }
}
```

您可以将其用作类型守卫来编写安全的代码。

```typescript
function processValue(input: unknown) {
  if (isPrimitive(input)) {
    // TypeScript 将 input 推断为原始类型
    console.log('原始值的类型:', typeof input);
    console.log('原始值:', input);
    return input;
  }

  // 这里 input 被推断为对象类型
  console.log('这是对象类型');
  return null;
}

// API 响应验证
function validateApiResponse(data: unknown) {
  if (isPrimitive(data)) {
    return {
      type: 'primitive',
      value: data,
      serializable: true,
    };
  }

  return {
    type: 'object',
    value: data,
    serializable: false, // 需要额外验证
  };
}

// 配置值处理
function normalizeConfigValue(value: unknown) {
  if (isPrimitive(value)) {
    // 原始值可以安全地转换为字符串
    return String(value);
  }

  // 将对象序列化为 JSON
  try {
    return JSON.stringify(value);
  } catch {
    return '[复杂对象]';
  }
}
```

您可以区分 `String`、`Number`、`Boolean` 等包装对象和原始值。

```typescript
// 包装对象不是原始值
console.log(isPrimitive(new String('hello'))); // false
console.log(isPrimitive(new Number(42))); // false
console.log(isPrimitive(new Boolean(true))); // false

// 但实际的原始值返回 true
console.log(isPrimitive('hello')); // true
console.log(isPrimitive(42)); // true
console.log(isPrimitive(true)); // true

// 可以使用 valueOf() 提取原始值
const strObj = new String('hello');
console.log(isPrimitive(strObj.valueOf())); // true
```

## isPromise

### `isPromise(value)`

当您想检查值是否为 `Promise` 实例时，请使用 `isPromise`。在异步代码中需要区分 `Promise` 对象和其他值，或需要有条件地使用 `await` 时非常有用。

```typescript
import { isPromise } from 'es-toolkit/predicate';

// Promise 实例
const promise1 = new Promise(resolve => resolve('done'));
const promise2 = Promise.resolve(42);
const promise3 = Promise.reject(new Error('failed'));

console.log(isPromise(promise1)); // true
console.log(isPromise(promise2)); // true
console.log(isPromise(promise3)); // true

// 非 Promise 值
console.log(isPromise({})); // false
console.log(isPromise('hello')); // false
console.log(isPromise(42)); // false
console.log(isPromise(null)); // false
console.log(isPromise(undefined)); // false
```

在异步函数中根据条件执行逻辑时非常有用。

```typescript
// 检查值是否为 Promise 并适当处理
async function processValue(input: unknown) {
  if (isPromise(input)) {
    // TypeScript 将 input 推断为 Promise<any>
    const result = await input;
    console.log('Promise 结果:', result);
    return result;
  }

  // 非 Promise 值直接返回
  console.log('普通值:', input);
  return input;
}

// API 响应处理
function handleApiCall(response: unknown) {
  if (isPromise(response)) {
    return response.then(data => ({ success: true, data })).catch(error => ({ success: false, error: error.message }));
  }

  // 已解决的值
  return { success: true, data: response };
}

// 在工具函数中使用
function toPromise<T>(value: T | Promise<T>): Promise<T> {
  if (isPromise(value)) {
    return value;
  }

  return Promise.resolve(value);
}
```

可以区分类似 Promise 的对象和真正的 `Promise`。

```typescript
// thenable 对象不是 Promise
const thenable = {
  then: (resolve: Function) => resolve('not a promise'),
};

console.log(isPromise(thenable)); // false

// async 函数结果是 Promise
async function asyncFunction() {
  return 'async result';
}

console.log(isPromise(asyncFunction())); // true

// 普通函数不是 Promise
function normalFunction() {
  return 'normal result';
}

console.log(isPromise(normalFunction())); // false
```

也可以用于错误处理。

```typescript
function safeExecute(fn: () => any) {
  try {
    const result = fn();

    if (isPromise(result)) {
      return result.catch(error => {
        console.error('异步函数执行中出错:', error);
        return null;
      });
    }

    return result;
  } catch (error) {
    console.error('同步函数执行中出错:', error);
    return null;
  }
}

// 超时处理
function withTimeout<T>(valueOrPromise: T | Promise<T>, timeoutMs: number) {
  if (!isPromise(valueOrPromise)) {
    return valueOrPromise;
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeoutMs);
  });

  return Promise.race([valueOrPromise, timeoutPromise]);
}
```

## isRegExp

### `isRegExp(value)`

当您想检查值是否为 `RegExp` 实例时,请使用 `isRegExp`。在区分正则表达式对象和普通字符串或其他对象时非常有用。

```typescript
import { isRegExp } from 'es-toolkit/predicate';

// RegExp 实例
const regex1 = /abc/;
const regex2 = new RegExp('abc');
const regex3 = new RegExp('\\d+', 'g');

console.log(isRegExp(regex1)); // true
console.log(isRegExp(regex2)); // true
console.log(isRegExp(regex3)); // true

// 非 RegExp 值
console.log(isRegExp('/abc/')); // false (字符串)
console.log(isRegExp('abc')); // false
console.log(isRegExp({})); // false
console.log(isRegExp(null)); // false
console.log(isRegExp(undefined)); // false
```

对正则表达式模式验证或字符串处理非常有用:

```typescript
// 动态模式验证
function validatePattern(pattern: unknown, text: string) {
  if (isRegExp(pattern)) {
    // TypeScript 将 pattern 推断为 RegExp
    return pattern.test(text);
  }

  // 将字符串模式转换为正则表达式
  if (typeof pattern === 'string') {
    const regex = new RegExp(pattern);
    return regex.test(text);
  }

  return false;
}

// 使用示例
console.log(validatePattern(/hello/, 'hello world')); // true
console.log(validatePattern('\\d+', '123')); // true
console.log(validatePattern('invalid', 'text')); // false

// 在表单验证中使用
function createValidator(rule: unknown) {
  if (isRegExp(rule)) {
    return (value: string) => rule.test(value);
  }

  // 其他规则类型...
  return () => false;
}

// 创建邮箱验证器
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValidator = createValidator(emailRegex);

console.log(emailValidator('test@example.com')); // true
console.log(emailValidator('invalid-email')); // false
```

在条件字符串处理中使用:

```typescript
// 文本处理工具
function processText(input: string, processor: unknown) {
  if (isRegExp(processor)) {
    // 使用正则表达式提取匹配部分
    const matches = input.match(processor);
    return matches ? matches : [];
  }

  // 其他处理器类型...
  return [input];
}

// 提取数字
const numberRegex = /\d+/g;
const numbers = processText('价格: 1000元, 折扣: 200元', numberRegex);
console.log(numbers); // ['1000', '200']

// 提取 URL
const urlRegex = /https?:\/\/[^\s]+/g;
const urls = processText('网站: https://example.com 参考', urlRegex);
console.log(urls); // ['https://example.com']

// 基于配置的文本验证
class TextValidator {
  private rules: Array<{ name: string; rule: unknown }> = [];

  addRule(name: string, rule: unknown) {
    this.rules.push({ name, rule });
  }

  validate(text: string) {
    const results: Array<{ rule: string; passed: boolean }> = [];

    for (const { name, rule } of this.rules) {
      if (isRegExp(rule)) {
        results.push({
          rule: name,
          passed: rule.test(text),
        });
      } else {
        results.push({
          rule: name,
          passed: false,
        });
      }
    }

    return results;
  }
}

// 使用示例
const validator = new TextValidator();
validator.addRule('仅字母', /^[a-zA-Z]+$/);
validator.addRule('包含数字', /\d/);
validator.addRule('禁止特殊字符', /^[^!@#$%^&*()]+$/);

console.log(validator.validate('Hello123'));
// [
//   { rule: '仅字母', passed: false },
//   { rule: '包含数字', passed: true },
//   { rule: '禁止特殊字符', passed: true }
// ]
```

区分字符串和正则表达式:

```typescript
// 在搜索功能中使用
function searchText(content: string, query: unknown) {
  if (isRegExp(query)) {
    // 正则表达式搜索 - 高级模式匹配
    const matches = content.match(query);
    return matches ? matches.length : 0;
  }

  if (typeof query === 'string') {
    // 普通字符串搜索
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }

  return 0;
}

// 使用示例
const text = 'Hello world! Hello everyone!';

console.log(searchText(text, /hello/gi)); // 2 (正则表达式)
console.log(searchText(text, 'Hello')); // 2 (字符串,已转义)
console.log(searchText(text, /h.llo/i)); // 2 (模式匹配)

// 动态过滤
function createFilter(patterns: unknown[]) {
  const regexPatterns = patterns.filter(isRegExp);

  return (text: string) => {
    return regexPatterns.some(pattern => pattern.test(text));
  };
}

// 垃圾邮件过滤器示例
const spamPatterns = [
  /\b(广告|促销)\b/,
  /\d{3}-\d{4}-\d{4}/, // 电话号码模式
  'invalid', // 不是 RegExp,从过滤器中排除
  /\$\d+/, // 价格模式
];

const spamFilter = createFilter(spamPatterns);
console.log(spamFilter('紧急广告!')); // true
console.log(spamFilter('你好')); // false
```

使用正则表达式标志和属性:

```typescript
// 检查 RegExp 属性
function analyzeRegex(value: unknown) {
  if (isRegExp(value)) {
    return {
      source: value.source,
      flags: value.flags,
      global: value.global,
      ignoreCase: value.ignoreCase,
      multiline: value.multiline,
      unicode: value.unicode,
      sticky: value.sticky,
    };
  }

  return null;
}

// 使用示例
const regex = /hello/gim;
const analysis = analyzeRegex(regex);
console.log(analysis);
// {
//   source: 'hello',
//   flags: 'gim',
//   global: true,
//   ignoreCase: true,
//   multiline: true,
//   unicode: false,
//   sticky: false
// }

// 克隆正则表达式
function cloneRegex(value: unknown) {
  if (isRegExp(value)) {
    return new RegExp(value.source, value.flags);
  }

  return null;
}

const originalRegex = /test/gi;
const clonedRegex = cloneRegex(originalRegex);
console.log(clonedRegex?.test('TEST')); // true
```

## isSet

### `isSet(value)`

当您想检查值是否为 `Set` 实例时,请使用 `isSet`。在区分 `Set` 对象和其他对象时非常有用。

```typescript
import { isSet } from 'es-toolkit/predicate';

// Set 实例
const set1 = new Set();
const set2 = new Set([1, 2, 3]);
const set3 = new Set(['a', 'b', 'c']);

console.log(isSet(set1)); // true
console.log(isSet(set2)); // true
console.log(isSet(set3)); // true

// 非 Set 值
console.log(isSet(new Map())); // false
console.log(isSet(new WeakSet())); // false
console.log(isSet([])); // false
console.log(isSet({})); // false
console.log(isSet(null)); // false
console.log(isSet(undefined)); // false
```

在为 `Set`、`Array`、`Map` 等 JavaScript 内置对象执行不同逻辑时非常有用。

```typescript
// 计算集合大小
function getCollectionSize(collection: unknown): number {
  if (isSet(collection)) {
    // TypeScript 将 collection 推断为 Set<any>
    return collection.size;
  }

  if (Array.isArray(collection)) {
    return collection.length;
  }

  if (collection && typeof collection === 'object') {
    return Object.keys(collection).length;
  }

  return 0;
}

// 使用示例
console.log(getCollectionSize(new Set([1, 2, 3]))); // 3
console.log(getCollectionSize([1, 2, 3])); // 3
console.log(getCollectionSize({ a: 1, b: 2 })); // 2

// 去重工具
function removeDuplicates(data: unknown) {
  if (isSet(data)) {
    // 已经是 Set,直接返回
    return data;
  }

  if (Array.isArray(data)) {
    return new Set(data);
  }

  // 不转换其他类型
  return data;
}

const duplicatedArray = [1, 2, 2, 3, 3, 3];
const uniqueSet = removeDuplicates(duplicatedArray);
console.log(uniqueSet); // Set { 1, 2, 3 }

const existingSet = new Set(['a', 'b']);
console.log(removeDuplicates(existingSet)); // Set { 'a', 'b' } (返回相同的 Set)
```

也可以广泛用于 Set 操作和数据转换。

```typescript
// 通用集合合并
function mergeCollections(...collections: unknown[]): Set<any> {
  const result = new Set();

  for (const collection of collections) {
    if (isSet(collection)) {
      // 将 Set 的所有值添加到结果中
      for (const item of collection) {
        result.add(item);
      }
    } else if (Array.isArray(collection)) {
      // 添加数组的所有值
      for (const item of collection) {
        result.add(item);
      }
    }
  }

  return result;
}

// 使用示例
const set1 = new Set([1, 2, 3]);
const array1 = [3, 4, 5];
const set2 = new Set(['a', 'b']);

const merged = mergeCollections(set1, array1, set2);
console.log(merged); // Set { 1, 2, 3, 4, 5, 'a', 'b' }

// 计算集合交集
function getIntersection(coll1: unknown, coll2: unknown): Set<any> {
  const set1 = isSet(coll1) ? coll1 : new Set(Array.isArray(coll1) ? coll1 : []);
  const set2 = isSet(coll2) ? coll2 : new Set(Array.isArray(coll2) ? coll2 : []);

  const intersection = new Set();

  for (const item of set1) {
    if (set2.has(item)) {
      intersection.add(item);
    }
  }

  return intersection;
}

// 使用示例
const setA = new Set([1, 2, 3, 4]);
const arrayB = [3, 4, 5, 6];

const intersection = getIntersection(setA, arrayB);
console.log(intersection); // Set { 3, 4 }
```

## isString

### `isString(value)`

当您想检查值是否为字符串时,请使用 `isString`。在区分字符串类型和其他原始类型或对象时非常有用。

```typescript
import { isString } from 'es-toolkit/predicate';

// 字符串值
console.log(isString('hello')); // true
console.log(isString('')); // true
console.log(isString('123')); // true
console.log(isString('true')); // true

// 非字符串值
console.log(isString(123)); // false
console.log(isString(true)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
console.log(isString([])); // false
console.log(isString({})); // false
console.log(isString(new String('hello'))); // false (String 对象)
```

对数据验证和类型安全的字符串处理非常有用:

```typescript
// 安全的字符串操作
function processText(input: unknown): string {
  if (isString(input)) {
    // TypeScript 将 input 推断为 string
    return input.trim().toLowerCase();
  }

  // 将其他类型转换为字符串
  return String(input);
}

// 使用示例
console.log(processText('  HELLO  ')); // 'hello'
console.log(processText(123)); // '123'
console.log(processText(true)); // 'true'
console.log(processText(null)); // 'null'

// 表单数据验证
function validateForm(data: Record<string, unknown>) {
  const errors: string[] = [];

  if (!isString(data.name) || data.name.length === 0) {
    errors.push('姓名为必填项');
  }

  if (!isString(data.email) || !data.email.includes('@')) {
    errors.push('请输入有效的电子邮箱');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 使用示例
console.log(validateForm({ name: 'John', email: 'john@example.com' }));
// { isValid: true, errors: [] }

console.log(validateForm({ name: 123, email: 'invalid-email' }));
// { isValid: false, errors: ['姓名为必填项', '请输入有效的电子邮箱'] }
```

## isSymbol

### `isSymbol(value)`

当您想检查值是否为 `symbol` 时,请使用 `isSymbol`。

```typescript
import { isSymbol } from 'es-toolkit/predicate';

// symbol 值
const sym1 = Symbol('description');
const sym2 = Symbol.for('global');
const sym3 = Symbol.iterator;

console.log(isSymbol(sym1)); // true
console.log(isSymbol(sym2)); // true
console.log(isSymbol(sym3)); // true

// 非 symbol 值
console.log(isSymbol('symbol')); // false
console.log(isSymbol(123)); // false
console.log(isSymbol(true)); // false
console.log(isSymbol(null)); // false
console.log(isSymbol(undefined)); // false
console.log(isSymbol({})); // false
console.log(isSymbol([])); // false
```

对安全访问对象属性或管理元数据非常有用。

```typescript
// 安全的属性访问
function getPropertyValue(obj: object, key: unknown) {
  if (isSymbol(key)) {
    // TypeScript 将 key 推断为 symbol
    return (obj as any)[key];
  }

  if (typeof key === 'string') {
    return (obj as any)[key];
  }

  return undefined;
}

// 使用示例
const mySymbol = Symbol('myKey');
const obj = {
  name: 'John',
  [mySymbol]: 'secret value',
};

console.log(getPropertyValue(obj, 'name')); // 'John'
console.log(getPropertyValue(obj, mySymbol)); // 'secret value'
console.log(getPropertyValue(obj, 123)); // undefined

// 元数据存储
class MetadataManager {
  private metadata = new Map<symbol, any>();

  setMetadata(key: unknown, value: any): boolean {
    if (isSymbol(key)) {
      this.metadata.set(key, value);
      return true;
    }
    return false;
  }

  getMetadata(key: unknown): any {
    if (isSymbol(key)) {
      return this.metadata.get(key);
    }
    return undefined;
  }

  hasMetadata(key: unknown): boolean {
    if (isSymbol(key)) {
      return this.metadata.has(key);
    }
    return false;
  }
}

// 使用示例
const manager = new MetadataManager();
const typeSymbol = Symbol('type');
const versionSymbol = Symbol('version');

manager.setMetadata(typeSymbol, 'user');
manager.setMetadata(versionSymbol, '1.0');
manager.setMetadata('invalid', 'value'); // false, 不是 symbol

console.log(manager.getMetadata(typeSymbol)); // 'user'
console.log(manager.hasMetadata(versionSymbol)); // true
```

## isTypedArray

### `isTypedArray(value)`

当您想检查值是否为 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例时,请使用 `isTypedArray`。

```typescript
import { isTypedArray } from 'es-toolkit/predicate';

// TypedArray 实例
const uint8 = new Uint8Array([1, 2, 3]);
const int16 = new Int16Array([1000, 2000]);
const float32 = new Float32Array([1.5, 2.5]);
const bigUint64 = new BigUint64Array([1n, 2n]);

console.log(isTypedArray(uint8)); // true
console.log(isTypedArray(int16)); // true
console.log(isTypedArray(float32)); // true
console.log(isTypedArray(bigUint64)); // true

// 非 TypedArray 值
console.log(isTypedArray([1, 2, 3])); // false (普通数组)
console.log(isTypedArray(new ArrayBuffer(8))); // false (ArrayBuffer)
console.log(isTypedArray(new DataView(new ArrayBuffer(8)))); // false (DataView)
console.log(isTypedArray({})); // false
console.log(isTypedArray(null)); // false
console.log(isTypedArray(undefined)); // false
```

## isUndefined

### `isUndefined(value)`

当您想检查值是否为 `undefined` 时,请使用 `isUndefined`。在检查变量是否已初始化或可选属性是否存在时非常有用。

```typescript
import { isUndefined } from 'es-toolkit/predicate';

// undefined 值
console.log(isUndefined(undefined)); // true
console.log(isUndefined(void 0)); // true

let uninitialized: string;
console.log(isUndefined(uninitialized)); // true

// 非 undefined 值
console.log(isUndefined(null)); // false
console.log(isUndefined('')); // false
console.log(isUndefined(0)); // false
console.log(isUndefined(false)); // false
console.log(isUndefined({})); // false
console.log(isUndefined([])); // false
```

## isWeakMap

### `isWeakMap(value)`

当您想检查值是否为 `WeakMap` 实例时,请使用 `isWeakMap`。`WeakMap` 是一个以对象作为键的键值存储,使用弱引用,有助于防止内存泄漏。

```typescript
import { isWeakMap } from 'es-toolkit/predicate';

// WeakMap 实例
const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, 'value']]);

console.log(isWeakMap(weakMap1)); // true
console.log(isWeakMap(weakMap2)); // true

// 非 WeakMap 值
console.log(isWeakMap(new Map())); // false
console.log(isWeakMap(new Set())); // false
console.log(isWeakMap(new WeakSet())); // false
console.log(isWeakMap({})); // false
console.log(isWeakMap([])); // false
console.log(isWeakMap(null)); // false
console.log(isWeakMap(undefined)); // false
```

## isWeakSet

### `isWeakSet(value)`

当您想检查值是否为 WeakSet 实例时,请使用 `isWeakSet`。

```typescript
import { isWeakSet } from 'es-toolkit/predicate';

// WeakSet 实例
const weakSet1 = new WeakSet();
const weakSet2 = new WeakSet([{}, []]);

console.log(isWeakSet(weakSet1)); // true
console.log(isWeakSet(weakSet2)); // true

// 非 WeakSet 值
console.log(isWeakSet(new Set())); // false
console.log(isWeakSet(new Map())); // false
console.log(isWeakSet(new WeakMap())); // false
console.log(isWeakSet([])); // false
console.log(isWeakSet({})); // false
console.log(isWeakSet(null)); // false
console.log(isWeakSet(undefined)); // false
```
