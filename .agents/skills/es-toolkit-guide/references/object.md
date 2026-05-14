# 用法汇总 - object

## clone

### `clone(obj)`

当您想要浅拷贝对象、数组、Date、RegExp 等值时使用 `clone`。浅拷贝意味着只复制顶层属性,嵌套的对象或数组与原始值共享引用。

```typescript
import { clone } from 'es-toolkit/object';

// 原始值按原样返回
const num = 29;
const clonedNum = clone(num);
console.log(clonedNum); // 29
console.log(clonedNum === num); // true

// 浅拷贝数组
const arr = [1, 2, 3];
const clonedArr = clone(arr);
console.log(clonedArr); // [1, 2, 3]
console.log(clonedArr === arr); // false

// 浅拷贝对象
const obj = { a: 1, b: 'es-toolkit', c: [1, 2, 3] };
const clonedObj = clone(obj);
console.log(clonedObj); // { a: 1, b: 'es-toolkit', c: [1, 2, 3] }
console.log(clonedObj === obj); // false
console.log(clonedObj.c === obj.c); // true (由于浅拷贝,嵌套数组共享引用)
```

支持各种 JavaScript 类型,如 `Date`、`RegExp`、`Map` 和 `Set`。

```typescript
// Date 对象
const date = new Date();
const clonedDate = clone(date);
console.log(clonedDate !== date); // true
console.log(clonedDate.getTime() === date.getTime()); // true

// RegExp 对象
const regex = /abc/gi;
const clonedRegex = clone(regex);
console.log(clonedRegex !== regex); // true
console.log(clonedRegex.source === regex.source); // true

// Map 和 Set
const map = new Map([['key', 'value']]);
const clonedMap = clone(map);
console.log(clonedMap !== map); // true
console.log(clonedMap.get('key')); // 'value'
```

## cloneDeep

### `cloneDeep(obj)`

当您想要完整复制对象或数组(包括所有嵌套结构)时使用 `cloneDeep`。深拷贝会完全独立地复制所有嵌套的对象和数组,使原始值和副本互不影响。

```typescript
import { cloneDeep } from 'es-toolkit/object';

// 原始值按原样返回
const num = 29;
const clonedNum = cloneDeep(num);
console.log(clonedNum); // 29
console.log(clonedNum === num); // true

// 深拷贝嵌套对象
const obj = { a: { b: { c: 'deep' } }, d: [1, 2, { e: 'nested' }] };
const clonedObj = cloneDeep(obj);
console.log(clonedObj); // { a: { b: { c: 'deep' } }, d: [1, 2, { e: 'nested' }] }
console.log(clonedObj === obj); // false
console.log(clonedObj.a === obj.a); // false (嵌套对象也被复制)
console.log(clonedObj.d === obj.d); // false (嵌套数组也被复制)
console.log(clonedObj.d[2] === obj.d[2]); // false (数组中的对象也被复制)

// 修改原始值不影响副本
const original = { a: { count: 1 } };
const copied = cloneDeep(original);
original.a.count = 2;
console.log(copied.a.count); // 1 (未改变)
```

支持各种 JavaScript 类型,如 `Map` 和 `Set`,并能安全处理循环引用。

```typescript
// 深拷贝 Map 和 Set
const map = new Map([['key', { nested: 'value' }]]);
const clonedMap = cloneDeep(map);
console.log(clonedMap !== map); // true
console.log(clonedMap.get('key') !== map.get('key')); // true (嵌套对象也被复制)

// 安全处理循环引用
const circular: any = { name: 'test' };
circular.self = circular;
const clonedCircular = cloneDeep(circular);
console.log(clonedCircular !== circular); // true
console.log(clonedCircular.self === clonedCircular); // true (保持循环引用)
```

对于由 getter 定义的只读属性,getter 的返回值将作为普通属性存储在复制的对象中。

```typescript
const source = {
  get computedValue() {
    return 42;
  },
  normalValue: 'hello',
};

const cloned = cloneDeep(source);
console.log(cloned); // { computedValue: 42, normalValue: 'hello' }
```

## cloneDeepWith

### `cloneDeepWith(obj, cloneValue)`

当您想要深拷贝对象或数组时,对特定值使用自定义方式进行拷贝,请使用 `cloneDeepWith`。如果自定义函数 `cloneValue` 返回一个值,则使用该值;如果返回 `undefined`,则使用默认的深拷贝方法。

```typescript
import { cloneDeepWith } from 'es-toolkit/object';

// 拷贝时将数字加倍
const obj = { a: 1, b: { c: 2, d: 'text' } };
const clonedObj = cloneDeepWith(obj, value => {
  if (typeof value === 'number') {
    return value * 2;
  }
  // 返回 undefined 则使用默认拷贝方式
});
console.log(clonedObj); // { a: 2, b: { c: 4, d: 'text' } }

// 拷贝时给所有数组元素加 1
const arr = [1, [2, 3], { num: 4 }];
const clonedArr = cloneDeepWith(arr, value => {
  if (typeof value === 'number') {
    return value + 1;
  }
});
console.log(clonedArr); // [2, [3, 4], { num: 5 }]
```

自定义函数接收当前值、键、原始对象和内部栈信息作为参数。

```typescript
const data = {
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'dark', lang: 'zh' },
};

const result = cloneDeepWith(data, (value, key, obj, stack) => {
  // 以特殊方式拷贝 'user' 对象
  if (key === 'user' && typeof value === 'object') {
    return { ...value, cloned: true };
  }

  // 给字符串添加前缀
  if (typeof value === 'string') {
    return `cloned_${value}`;
  }
});

console.log(result);
// {
//   user: { name: 'cloned_Alice', age: 30, cloned: true },
//   settings: { theme: 'cloned_dark', lang: 'cloned_zh' }
// }
```

使用自定义函数可以自由配置对象的拷贝方式。例如,可以将 `Date` 对象拷贝为一年后的时间。

```typescript
const data = {
  created: new Date('2023-01-01'),
  updated: new Date('2023-12-31'),
  name: 'Document',
};

const cloned = cloneDeepWith(data, value => {
  // 将 Date 对象设置为一年后
  if (value instanceof Date) {
    const newDate = new Date(value);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate;
  }
});

console.log(cloned.created.getFullYear()); // 2024
console.log(cloned.updated.getFullYear()); // 2024
```

## findKey

### `findKey(obj, predicate)`

当您想在对象中查找满足特定条件的第一个元素的键时,请使用 `findKey`。它返回条件函数返回 `true` 的第一个值的键。

```typescript
import { findKey } from 'es-toolkit/object';

// 查找年龄小于 30 的第一个用户
const users = {
  alice: { age: 25, active: true },
  bob: { age: 30, active: false },
  charlie: { age: 35, active: true },
};

const youngUserKey = findKey(users, user => user.age < 30);
console.log(youngUserKey); // 'alice'

// 查找非活跃用户
const inactiveUserKey = findKey(users, user => !user.active);
console.log(inactiveUserKey); // 'bob'

// 没有满足条件的元素
const seniorUserKey = findKey(users, user => user.age > 50);
console.log(seniorUserKey); // undefined
```

条件函数接收当前值、键和整个对象。

```typescript
const data = {
  item1: { priority: 'high', status: 'pending' },
  item2: { priority: 'low', status: 'done' },
  item3: { priority: 'high', status: 'done' },
};

// 同时考虑键名和值的搜索
const result = findKey(data, (value, key, obj) => {
  return key.includes('2') && value.status === 'done';
});
console.log(result); // 'item2'
```

也可以用于复杂的对象结构。

```typescript
const products = {
  laptop: {
    specs: { ram: 16, cpu: 'Intel i7' },
    price: 1200,
    available: true,
  },
  phone: {
    specs: { ram: 8, cpu: 'Snapdragon' },
    price: 800,
    available: false,
  },
  tablet: {
    specs: { ram: 12, cpu: 'Apple M1' },
    price: 1000,
    available: true,
  },
};

const affordableKey = findKey(products, product => product.price < 1000 && product.available);
console.log(affordableKey); // undefined (没有满足条件的产品)

const highRamKey = findKey(products, product => product.specs.ram >= 12);
console.log(highRamKey); // 'laptop'
```

## flattenObject

### `flattenObject(object, options?)`

当您想要使用点(`.`)表示法将深层嵌套的对象或数组扁平化时,请使用 `flattenObject`。每个嵌套属性都将成为一个单层对象,其键由分隔符连接。

```typescript
import { flattenObject } from 'es-toolkit/object';

// 扁平化嵌套对象
const nestedObject = {
  a: {
    b: {
      c: 1,
    },
  },
  d: [2, 3],
  e: 'simple',
};

const flattened = flattenObject(nestedObject);
console.log(flattened);
// {
//   'a.b.c': 1,
//   'd.0': 2,
//   'd.1': 3,
//   'e': 'simple'
// }

// 使用自定义分隔符
const withCustomDelimiter = flattenObject(nestedObject, { delimiter: '/' });
console.log(withCustomDelimiter);
// {
//   'a/b/c': 1,
//   'd/0': 2,
//   'd/1': 3,
//   'e': 'simple'
// }
```

在扁平化配置对象时非常有用。

```typescript
// 扁平化配置对象
const config = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret',
    },
  },
  features: ['auth', 'logging'],
  debug: true,
};

const flatConfig = flattenObject(config);
console.log(flatConfig);
// {
//   'database.host': 'localhost',
//   'database.port': 5432,
//   'database.credentials.username': 'admin',
//   'database.credentials.password': 'secret',
//   'features.0': 'auth',
//   'features.1': 'logging',
//   'debug': true
// }
```

使用 `options.delimiter` 选项可以用下划线(`_`)等自定义字符而不是点(`.`)来扁平化对象。

```typescript
// 环境变量风格的下划线连接
const envStyle = flattenObject(config, { delimiter: '_' });
console.log(envStyle);
// {
//   'database_host': 'localhost',
//   'database_port': 5432,
//   'database_credentials_username': 'admin',
//   'database_credentials_password': 'secret',
//   'features_0': 'auth',
//   'features_1': 'logging',
//   'debug': true
// }
```

也能适当处理空对象和特殊情况。

```typescript
// 空对象或数组
const emptyCase = {
  empty: {},
  emptyArray: [],
  nullValue: null,
  undefinedValue: undefined,
};

const result = flattenObject(emptyCase);
console.log(result);
// {
//   'empty': {},
//   'emptyArray: [],
//   'nullValue': null,
//   'undefinedValue': undefined
// }
// 空对象或空数组会作为键显示
```

## invert

### `invert(obj)`

当您想要创建一个交换对象键和值的新对象时,请使用 `invert`。原始对象的键成为新对象的值,原始对象的值成为新对象的键。如果存在重复值,则使用后面出现的键。

```typescript
import { invert } from 'es-toolkit/object';

// 基本用法
const original = { a: 1, b: 2, c: 3 };
const inverted = invert(original);
console.log(inverted); // { 1: 'a', 2: 'b', 3: 'c' }

// 存在重复值的情况
const withDuplicates = { a: 1, b: 1, c: 2 };
const result = invert(withDuplicates);
console.log(result); // { 1: 'b', 2: 'c' } (后面出现的 'b' 用作键 1 的值)

// 字符串键和数字值
const grades = { alice: 85, bob: 92, charlie: 88 };
const invertedGrades = invert(grades);
console.log(invertedGrades); // { 85: 'alice', 92: 'bob', 88: 'charlie' }
```

可以用于各种类型的键和值。

```typescript
// 数字键和字符串值
const statusCodes = { 200: 'OK', 404: 'Not Found', 500: 'Internal Server Error' };
const invertedCodes = invert(statusCodes);
console.log(invertedCodes);
// { 'OK': '200', 'Not Found': '404', 'Internal Server Error': '500' }

// 需要反向查找时很有用
const userRoles = { admin: 'administrator', user: 'regular_user', guest: 'visitor' };
const roleToKey = invert(userRoles);
console.log(roleToKey);
// { 'administrator': 'admin', 'regular_user': 'user', 'visitor': 'guest' }

// 现在可以通过值查找键
function findRoleKey(roleName: string) {
  return roleToKey[roleName];
}
console.log(findRoleKey('administrator')); // 'admin'
```

与枚举(Enum)或常量对象一起使用很有用。

```typescript
// 颜色代码映射
const colorCodes = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
};

const codeToColor = invert(colorCodes);
console.log(codeToColor);
// { '#FF0000': 'red', '#00FF00': 'green', '#0000FF': 'blue' }

// 现在可以通过颜色代码查找颜色名称
function getColorName(code: string) {
  return codeToColor[code] || 'unknown';
}
console.log(getColorName('#FF0000')); // 'red'
```

## mapKeys

### `mapKeys(object, getNewKey)`

当您想要转换对象的每个键以创建新对象时,请使用 `mapKeys`。值保持不变,只有键根据 `getNewKey` 函数的结果改变。

```typescript
import { mapKeys } from 'es-toolkit/object';

// 为键添加前缀
const obj = { a: 1, b: 2 };
const prefixed = mapKeys(obj, (value, key) => `prefix_${key}`);
// prefixed 是 { prefix_a: 1, prefix_b: 2 }

// 结合键和值创建新键
const combined = mapKeys(obj, (value, key) => `${key}${value}`);
// combined 是 { a1: 1, b2: 2 }

// 将键转换为大写
const uppercased = mapKeys(obj, (value, key) => key.toString().toUpperCase());
// uppercased 是 { A: 1, B: 2 }
```

## mapValues

### `mapValues(object, getNewValue)`

当您想要转换对象的每个值以创建新对象时,请使用 `mapValues`。键保持不变,只有值根据 `getNewValue` 函数的结果改变。

```typescript
import { mapValues } from 'es-toolkit/object';

// 将所有值加倍
const numbers = { a: 1, b: 2, c: 3 };
const doubled = mapValues(numbers, value => value * 2);
// doubled 是 { a: 2, b: 4, c: 6 }

// 将字符串值转换为大写
const strings = { first: 'hello', second: 'world' };
const uppercased = mapValues(strings, value => value.toUpperCase());
// uppercased 是 { first: 'HELLO', second: 'WORLD' }

// 同时使用键和值
const scores = { alice: 85, bob: 90, charlie: 95 };
const grades = mapValues(scores, (value, key) => `${key}: ${value >= 90 ? 'A' : 'B'}`);
// grades 是 { alice: 'alice: B', bob: 'bob: A', charlie: 'charlie: A' }
```

## merge

### `merge(target, source)`

当您想要深度合并两个对象时,请使用 `merge`。嵌套的对象和数组也会递归合并。与 [toMerged](./toMerged.md) 不同,它会修改原始 `target` 对象。

```typescript
import { merge } from 'es-toolkit/object';

// 基本对象合并
const target = { a: 1, b: { x: 1, y: 2 } };
const source = { b: { y: 3, z: 4 }, c: 5 };
const result = merge(target, source);
// result 和 target 都是 { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }

// 数组也会被合并
const arrayTarget = { a: [1, 2], b: { x: 1 } };
const arraySource = { a: [3], b: { y: 2 } };
merge(arrayTarget, arraySource);
// arrayTarget 是 { a: [3, 2], b: { x: 1, y: 2 } }

// null 值也会被适当处理
const nullTarget = { a: null };
const nullSource = { a: [1, 2, 3] };
merge(nullTarget, nullSource);
// nullTarget 是 { a: [1, 2, 3] }
```

`undefined` 值不会覆盖现有值。

```typescript
const target = { a: 1, b: 2 };
const source = { b: undefined, c: 3 };
merge(target, source);
// target 是 { a: 1, b: 2, c: 3 } (b 未被覆盖)
```

## mergeWith

### `mergeWith(target, source, merge)`

当您想要合并两个对象并对每个属性应用自定义合并逻辑时,请使用 `mergeWith`。如果合并函数返回 `undefined`,则使用默认的深度合并逻辑。

```typescript
import { mergeWith } from 'es-toolkit/object';

// 将数字值相加合并
const target = { a: 1, b: 2, c: { x: 10 } };
const source = { b: 3, c: { x: 20, y: 30 }, d: 4 };

const result = mergeWith(target, source, (targetValue, sourceValue, key) => {
  if (typeof targetValue === 'number' && typeof sourceValue === 'number') {
    return targetValue + sourceValue; // 数字相加
  }
  // 返回 undefined 则使用默认合并逻辑
});
// result 和 target 都是 { a: 1, b: 5, c: { x: 30, y: 30 }, d: 4 }

// 连接数组合并
const arrayTarget = { items: [1, 2], metadata: { count: 2 } };
const arraySource = { items: [3, 4], metadata: { count: 2 } };

mergeWith(arrayTarget, arraySource, (targetValue, sourceValue) => {
  if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
    return targetValue.concat(sourceValue);
  }
});
// arrayTarget 是 { items: [1, 2, 3, 4], metadata: { count: 2 } }

// 根据键应用不同的合并逻辑
const config = { timeout: 1000, retries: 3, features: { featureA: true } };
const updates = { timeout: 2000, retries: 5, features: { featureB: false } };

mergeWith(config, updates, (targetValue, sourceValue, key) => {
  if (key === 'timeout') {
    return Math.max(targetValue, sourceValue); // timeout 选择较大值
  }
  if (key === 'retries') {
    return Math.min(targetValue, sourceValue); // retries 选择较小值
  }
  // 其他属性使用默认合并逻辑
});
// config 是 { timeout: 2000, retries: 3, features: { featureA: true, featureB: false } }
```

## omit

### `omit(obj, keys)`

当您想要从对象中排除特定键时使用 `omit`。它返回一个新对象,其中删除了与指定键对应的属性。

```typescript
import { omit } from 'es-toolkit/object';

// 排除特定键
const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = omit(obj, ['b', 'c']);
// result 是 { a: 1, d: 4 }

// 指定不存在的键不会导致错误
const safe = omit(obj, ['b', 'nonexistent']);
// safe 是 { a: 1, c: 3, d: 4 }
```

## omitBy

### `omitBy(obj, shouldOmit)`

当您想基于条件函数选择性地排除对象的属性时,请使用 `omitBy`。它返回一个新对象,该对象仅包含条件函数返回 `false` 的属性,排除返回 `true` 的属性。

```typescript
import { omitBy } from 'es-toolkit/object';

// 排除具有字符串值的属性
const obj = { a: 1, b: 'remove', c: 3, d: 'also remove' };
const result = omitBy(obj, value => typeof value === 'string');
// result 是 { a: 1, c: 3 }

// 仅排除偶数值
const numbers = { a: 1, b: 2, c: 3, d: 4 };
const odds = omitBy(numbers, value => value % 2 === 0);
// odds 是 { a: 1, c: 3 }

// 同时使用键和值
const data = { user1: 25, user2: 17, admin1: 30, admin2: 28 };
const nonAdmins = omitBy(data, (value, key) => key.startsWith('admin'));
// nonAdmins 是 { user1: 25, user2: 17 }
```

## pick

### `pick(obj, keys)`

当您想从对象中仅选择特定键对应的属性时,请使用 `pick`。它返回一个仅包含指定键对应属性的新对象。

```typescript
import { pick } from 'es-toolkit/object';

// 仅选择特定键
const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = pick(obj, ['a', 'c']);
// result 是 { a: 1, c: 3 }

// 即使指定不存在的键也会被忽略
const safe = pick(obj, ['a', 'nonexistent']);
// safe 是 { a: 1 }

// 也可以用于嵌套对象
const nested = {
  user: { name: 'John', age: 30 },
  posts: ['post1', 'post2'],
  settings: { theme: 'dark' },
};
const picked = pick(nested, ['user', 'settings']);
// picked 是 { user: { name: 'John', age: 30 }, settings: { theme: 'dark' } }
```

## pickBy

### `pickBy(obj, shouldPick)`

当您想基于条件函数选择性地选择对象的属性时,请使用 `pickBy`。它返回一个仅包含条件函数返回 `true` 的属性的新对象。

```typescript
import { pickBy } from 'es-toolkit/object';

// 仅选择具有字符串值的属性
const obj = { a: 1, b: 'select', c: 3, d: 'also select' };
const result = pickBy(obj, value => typeof value === 'string');
// result 是 { b: 'select', d: 'also select' }

// 仅选择偶数值
const numbers = { a: 1, b: 2, c: 3, d: 4 };
const evens = pickBy(numbers, value => value % 2 === 0);
// evens 是 { b: 2, d: 4 }

// 同时使用键和值
const data = { user1: 25, user2: 17, admin1: 30, admin2: 28 };
const admins = pickBy(data, (value, key) => key.startsWith('admin') && value > 25);
// admins 是 { admin1: 30, admin2: 28 }
```

## toCamelCaseKeys

### `toCamelCaseKeys(obj)`

当您想要将对象的所有键转换为驼峰命名法时,请使用 `toCamelCaseKeys`。嵌套对象和数组中的对象也会递归转换。

例如，对象的键会按如下方式转换：

- `snake_case` → `camelCase`（例如 `user_id` → `userId`）
- `PascalCase` → `camelCase`（例如 `UserId` → `userId`）
- `uppercase keys` → `camelCase`（例如 `FIRST_NAME` → `firstName`, `LAST` → `last`）

```typescript
import { toCamelCaseKeys } from 'es-toolkit/object';

// 基本对象转换
const obj = { user_id: 1, first_name: 'John', last_name: 'Doe' };
const result = toCamelCaseKeys(obj);
// result 是 { userId: 1, firstName: 'John', lastName: 'Doe' }

// 数组中的对象也会转换
const users = [
  { user_id: 1, first_name: 'John' },
  { user_id: 2, first_name: 'Jane' },
];
const convertedUsers = toCamelCaseKeys(users);
// convertedUsers 是 [{ userId: 1, firstName: 'John' }, { userId: 2, firstName: 'Jane' }]

// 嵌套对象也会完全转换
const nested = {
  user_data: {
    user_id: 1,
    contact_info: {
      email_address: 'john@example.com',
      phone_number: '123-456-7890',
    },
  },
};
const nestedResult = toCamelCaseKeys(nested);
// nestedResult 是 {
//   userData: {
//     userId: 1,
//     contactInfo: {
//       emailAddress: 'john@example.com',
//       phoneNumber: '123-456-7890'
//     }
//   }
// }

// PascalCase 和 uppercase keys 的键也会被转换
const raw = { UserId: 1, FIRST_NAME: 'JinHo', LAST: 'Yeom' };
const converted = toCamelCaseKeys(raw);
// converted 是 { userId: 1, firstName: 'JinHo', last: 'Yeom' }
```

## toMerged

### `toMerged(target, source)`

当您想要深度合并两个对象但不想修改原始对象时,请使用 `toMerged`。与 [merge](./merge.md) 不同,它不会修改原始 `target` 对象,而是返回一个新对象。

```typescript
import { toMerged } from 'es-toolkit/object';

// 基本对象合并
const target = { a: 1, b: { x: 1, y: 2 } };
const source = { b: { y: 3, z: 4 }, c: 5 };
const result = toMerged(target, source);
// result 是 { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }
// target 保持为 { a: 1, b: { x: 1, y: 2 } }

// 数组也会被合并
const arrayTarget = { a: [1, 2], b: { x: 1 } };
const arraySource = { a: [3], b: { y: 2 } };
const arrayResult = toMerged(arrayTarget, arraySource);
// arrayResult 是 { a: [3, 2], b: { x: 1, y: 2 } }
// arrayTarget 未被修改

// null 值也会被适当处理
const nullTarget = { a: null };
const nullSource = { a: [1, 2, 3] };
const nullResult = toMerged(nullTarget, nullSource);
// nullResult 是 { a: [1, 2, 3] }
```

`undefined` 值不会覆盖现有值。

```typescript
const target = { a: 1, b: 2 };
const source = { b: undefined, c: 3 };
const result = toMerged(target, source);
// result 是 { a: 1, b: 2, c: 3 } (b 未被覆盖)
```

## toSnakeCaseKeys

### `toSnakeCaseKeys(obj)`

当您想要将对象的所有键转换为 snake_case 时,请使用 `toSnakeCaseKeys`。嵌套对象和数组中的对象也会递归转换。

例如，对象的键会按如下方式转换：

- `camelCase` → `snake_case`（例如 `userId` → `user_id`）
- `PascalCase` → `snake_case`（例如 `UserId` → `user_id`）
- `UPPERCASE_KEYS` → `snake_case`（例如 `FIRST_NAME` → `first_name`, `LAST` → `last`）

```typescript
import { toSnakeCaseKeys } from 'es-toolkit/object';

// 基本对象转换
const obj = { userId: 1, firstName: 'John', lastName: 'Doe' };
const result = toSnakeCaseKeys(obj);
// result 是 { user_id: 1, first_name: 'John', last_name: 'Doe' }

// 数组中的对象也会转换
const users = [
  { userId: 1, firstName: 'John' },
  { userId: 2, firstName: 'Jane' },
];
const convertedUsers = toSnakeCaseKeys(users);
// convertedUsers 是 [{ user_id: 1, first_name: 'John' }, { user_id: 2, first_name: 'Jane' }]

// 嵌套对象也会完全转换
const nested = {
  userData: {
    userId: 1,
    contactInfo: {
      emailAddress: 'john@example.com',
      phoneNumber: '123-456-7890',
    },
  },
};
const nestedResult = toSnakeCaseKeys(nested);
// nestedResult 是 {
//   user_data: {
//     user_id: 1,
//     contact_info: {
//       email_address: 'john@example.com',
//       phone_number: '123-456-7890'
//     }
//   }
// }
```
