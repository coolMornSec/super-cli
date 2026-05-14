# 用法汇总 - map

## countBy

### `countBy(map, mapper)`

当您想计算Map中有多少条目属于不同类别时,请使用 `countBy`。提供一个从每个值-键对生成键的函数,它返回一个Map,其中生成的键及其计数作为值。对于转换产生相同键的每个条目,计数会递增。

```typescript
import { countBy } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 1],
]);

const result = countBy(map, value => value);
// 结果: Map(2) { 1 => 2, 2 => 1 }
```

可以根据各种标准计算条目。

```typescript
import { countBy } from 'es-toolkit/map';

// 按值属性计数
const users = new Map([
  ['user1', { name: 'Alice', age: 25, department: 'Engineering' }],
  ['user2', { name: 'Bob', age: 30, department: 'Engineering' }],
  ['user3', { name: 'Charlie', age: 35, department: 'Sales' }],
]);

const byDepartment = countBy(users, user => user.department);
// 结果: Map(2) { 'Engineering' => 2, 'Sales' => 1 }

// 按派生值计数
const ages = new Map([
  ['p1', 25],
  ['p2', 30],
  ['p3', 25],
  ['p4', 40],
]);

const ageGroups = countBy(ages, age => (age < 30 ? 'young' : 'senior'));
// 结果: Map(2) { 'young' => 2, 'senior' => 2 }

// 同时使用值和键进行计数
const items = new Map([
  ['alice', 20],
  ['bob', 30],
  ['carol', 20],
]);

const firstLetter = countBy(items, (value, key) => key[0]);
// 结果: Map(3) { 'a' => 1, 'b' => 1, 'c' => 1 }
```

## every

### `every(map, doesMatch)`

当您想检查Map中的所有条目是否满足特定条件时,请使用 `every`。提供一个测试每个条目的谓词函数,如果所有条目都满足谓词,它返回true,否则返回false。

```typescript
import { every } from 'es-toolkit/map';

const map = new Map([
  ['a', 10],
  ['b', 20],
  ['c', 30],
]);

const result = every(map, value => value > 5);
// 结果: true

const result2 = every(map, value => value > 15);
// 结果: false
```

您可以测试各种条件。

```typescript
import { every } from 'es-toolkit/map';

// 检查所有值是否满足条件
const inventory = new Map([
  ['apple', { quantity: 10, inStock: true }],
  ['banana', { quantity: 5, inStock: true }],
  ['orange', { quantity: 8, inStock: true }],
]);

const allInStock = every(inventory, item => item.inStock);
// 结果: true

// 检查所有键是否匹配模式
const settings = new Map([
  ['api.timeout', 5000],
  ['api.retries', 3],
  ['api.host', 'localhost'],
]);

const allApiSettings = every(settings, (value, key) => key.startsWith('api.'));
// 结果: true
```

## filter

### `filter(map, callback)`

当您想创建一个仅包含满足特定条件的条目的新Map时,请使用 `filter`。提供一个测试每个条目的谓词函数,它返回一个仅包含谓词返回true的条目的新Map。

```typescript
import { filter } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
  ['d', 4],
]);

const result = filter(map, value => value > 2);
// 结果:
// Map(2) {
//   'c' => 3,
//   'd' => 4
// }
```

可以根据各种标准进行过滤。

```typescript
import { filter } from 'es-toolkit/map';

// 按值类型过滤
const inventory = new Map([
  ['apple', { quantity: 10, inStock: true }],
  ['banana', { quantity: 0, inStock: false }],
  ['orange', { quantity: 5, inStock: true }],
]);

const inStockItems = filter(inventory, item => item.inStock);
// 结果: 包含'apple'和'orange'条目的Map

// 按键模式过滤
const data = new Map([
  ['user_1', 'Alice'],
  ['admin_1', 'Bob'],
  ['user_2', 'Charlie'],
]);

const users = filter(data, (value, key) => key.startsWith('user_'));
// 结果: 包含'user_1'和'user_2'条目的Map
```

## findKey

### `findKey(map, doesMatch)`

当您想查找符合特定条件的第一个条目的键时,请使用 `findKey`。提供一个测试每个条目的谓词函数,它返回第一个匹配条目的键,如果未找到则返回undefined。

```typescript
import { findKey } from 'es-toolkit/map';

const map = new Map([
  ['apple', { color: 'red', quantity: 10 }],
  ['banana', { color: 'yellow', quantity: 5 }],
  ['grape', { color: 'purple', quantity: 15 }],
]);

const result = findKey(map, value => value.quantity > 10);
// 结果: 'grape'
```

您可以根据各种标准进行搜索。

```typescript
import { findKey } from 'es-toolkit/map';

// 按值属性查找
const users = new Map([
  ['user1', { name: 'Alice', age: 25 }],
  ['user2', { name: 'Bob', age: 30 }],
  ['user3', { name: 'Charlie', age: 35 }],
]);

const seniorUser = findKey(users, user => user.age >= 35);
// 结果: 'user3'

// 按键模式查找
const settings = new Map([
  ['api.timeout', 5000],
  ['api.retries', 3],
  ['db.host', 'localhost'],
]);

const dbSetting = findKey(settings, (value, key) => key.startsWith('db.'));
// 结果: 'db.host'
```

## findValue

### `findValue(map, doesMatch)`

当您想查找符合特定条件的第一个条目的值时,请使用 `findValue`。提供一个测试每个条目的谓词函数,它返回第一个匹配条目的值,如果未找到则返回undefined。

```typescript
import { findValue } from 'es-toolkit/map';

const map = new Map([
  ['apple', { color: 'red', quantity: 10 }],
  ['banana', { color: 'yellow', quantity: 5 }],
  ['grape', { color: 'purple', quantity: 15 }],
]);

const result = findValue(map, value => value.quantity > 10);
// 结果: { color: 'purple', quantity: 15 }
```

您可以根据各种标准进行搜索。

```typescript
import { findValue } from 'es-toolkit/map';

// 按值属性查找
const products = new Map([
  ['p1', { name: 'Laptop', price: 1000, inStock: true }],
  ['p2', { name: 'Mouse', price: 25, inStock: false }],
  ['p3', { name: 'Keyboard', price: 75, inStock: true }],
]);

const expensiveProduct = findValue(products, product => product.price > 500);
// 结果: { name: 'Laptop', price: 1000, inStock: true }

// 按键模式查找
const cache = new Map([
  ['temp_1', { data: 'foo', timestamp: 100 }],
  ['perm_1', { data: 'bar', timestamp: 200 }],
  ['temp_2', { data: 'baz', timestamp: 300 }],
]);

const permanent = findValue(cache, (value, key) => key.startsWith('perm_'));
// 结果: { data: 'bar', timestamp: 200 }
```

## forEach

### `forEach(map, callback)`

当您想对Map中的每个条目执行函数时,请使用 `forEach`。回调函数接收值、键和Map本身作为参数。这对于日志记录、更新外部状态或对每个条目执行操作等副作用很有用。

```typescript
import { forEach } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

forEach(map, (value, key) => {
  console.log(`${key}: ${value}`);
});
// 输出:
// a: 1
// b: 2
// c: 3
```

可以对每个条目执行各种操作。

```typescript
import { forEach } from 'es-toolkit/map';

// 累积值
const prices = new Map([
  ['apple', 1.5],
  ['banana', 0.75],
  ['orange', 2.0],
]);

let total = 0;
forEach(prices, value => {
  total += value;
});
// total现在是4.25

// 将条目收集到数组中
const users = new Map([
  ['user1', { name: 'Alice', age: 25 }],
  ['user2', { name: 'Bob', age: 30 }],
]);

const userList: string[] = [];
forEach(users, (value, key) => {
  userList.push(`${key}: ${value.name} (${value.age})`);
});
// userList: ['user1: Alice (25)', 'user2: Bob (30)']

// 根据条件更新外部Map
const inventory = new Map([
  ['item1', { stock: 10, price: 5 }],
  ['item2', { stock: 0, price: 10 }],
  ['item3', { stock: 5, price: 15 }],
]);

const outOfStock = new Map<string, any>();
forEach(inventory, (value, key) => {
  if (value.stock === 0) {
    outOfStock.set(key, value);
  }
});
// outOfStock包含item2
```

## hasValue

### `hasValue(map, searchElement)`

当您想检查Map是否包含特定值时,请使用 `hasValue`。此函数使用SameValueZero比较(类似于Array.prototype.includes),这意味着NaN被认为等于NaN。

```typescript
import { hasValue } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

const result = hasValue(map, 2);
// 结果: true

const result2 = hasValue(map, 5);
// 结果: false
```

您可以搜索各种值类型。

```typescript
import { hasValue } from 'es-toolkit/map';

// 搜索NaN(使用SameValueZero比较)
const numbers = new Map([
  ['a', 1],
  ['b', NaN],
  ['c', 3],
]);

const hasNaN = hasValue(numbers, NaN);
// 结果: true

// 搜索对象(引用相等性)
const obj = { id: 1 };
const objects = new Map([
  ['first', obj],
  ['second', { id: 2 }],
]);

const hasObj = hasValue(objects, obj);
// 结果: true

const hasSimilar = hasValue(objects, { id: 1 });
// 结果: false(不同的引用)
```

## keyBy

### `keyBy(map, getKeyFromEntry)`

当您想通过从值生成新键来重组Map时,请使用 `keyBy`。提供一个从每个值-键对生成键的函数,它返回一个新Map,其中键由键函数生成,值是原始映射中的相应值。如果多个条目产生相同的键,则使用最后遇到的值。

```typescript
import { keyBy } from 'es-toolkit/map';

const map = new Map([
  ['x', { type: 'fruit', name: 'apple' }],
  ['y', { type: 'fruit', name: 'banana' }],
  ['z', { type: 'vegetable', name: 'carrot' }],
]);

const result = keyBy(map, item => item.type);
// 结果:
// Map(2) {
//   'fruit' => { type: 'fruit', name: 'banana' },
//   'vegetable' => { type: 'vegetable', name: 'carrot' }
// }
// 注意: 'banana'被保留是因为它是最后一个'fruit'
```

可以根据各种标准重组数据。

```typescript
import { keyBy } from 'es-toolkit/map';

// 按ID属性索引
const users = new Map([
  ['user1', { id: 101, name: 'Alice', role: 'admin' }],
  ['user2', { id: 102, name: 'Bob', role: 'user' }],
  ['user3', { id: 103, name: 'Charlie', role: 'user' }],
]);

const byId = keyBy(users, user => user.id);
// 结果: 键为101, 102, 103的Map

// 按角色索引(每个角色的最后一个用户获胜)
const byRole = keyBy(users, user => user.role);
// 结果: Map(2) {
//   'admin' => { id: 101, name: 'Alice', role: 'admin' },
//   'user' => { id: 103, name: 'Charlie', role: 'user' }
// }

// 使用值和原始键转换键
const inventory = new Map([
  ['item_1', { category: 'electronics', price: 100 }],
  ['item_2', { category: 'electronics', price: 200 }],
]);

const categorized = keyBy(inventory, (value, key) => `${value.category}_${key}`);
// 结果: 键为'electronics_item_1', 'electronics_item_2'的Map
```

## mapKeys

### `mapKeys(map, getNewKey)`

当您想要转换Map的键同时保持值不变时,请使用 `mapKeys`。提供一个从每个条目生成新键的函数,它返回一个具有转换后键的新Map。

```typescript
import { mapKeys } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

const result = mapKeys(map, (value, key) => key.toUpperCase());
// 结果:
// Map(3) {
//   'A' => 1,
//   'B' => 2,
//   'C' => 3
// }
```

您可以通过各种方式转换键。

```typescript
import { mapKeys } from 'es-toolkit/map';

// 为键添加前缀
const categories = new Map([
  ['fruit', ['apple', 'banana']],
  ['vegetable', ['carrot', 'potato']],
]);

const prefixed = mapKeys(categories, (value, key) => `category_${key}`);
// 结果: 具有键'category_fruit'、'category_vegetable'的Map

// 根据值转换
const scores = new Map([
  ['alice', 95],
  ['bob', 87],
  ['charlie', 92],
]);

const ranked = mapKeys(scores, (value, key) => (value >= 90 ? `top_${key}` : key));
// 结果: 具有键'top_alice'、'bob'、'top_charlie'的Map
```

## mapValues

### `mapValues(map, getNewValue)`

当您想要转换Map的值同时保持键不变时,请使用 `mapValues`。提供一个从每个条目生成新值的函数,它返回一个具有转换后值的新Map。

```typescript
import { mapValues } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

const result = mapValues(map, value => value * 2);
// 结果:
// Map(3) {
//   'a' => 2,
//   'b' => 4,
//   'c' => 6
// }
```

您可以通过各种方式转换值。

```typescript
import { mapValues } from 'es-toolkit/map';

// 格式化值
const prices = new Map([
  ['apple', 1.5],
  ['banana', 0.75],
  ['orange', 2.0],
]);

const formatted = mapValues(prices, value => `$${value.toFixed(2)}`);
// 结果: 具有值'$1.50'、'$0.75'、'$2.00'的Map

// 根据键转换
const inventory = new Map([
  ['premium_item', 10],
  ['standard_item', 20],
  ['basic_item', 30],
]);

const adjusted = mapValues(inventory, (value, key) => (key.startsWith('premium_') ? value * 1.5 : value));
// 结果: 具有值15、20、30的Map
```

## reduce

### `reduce(map, callback, initialValue?)`

当您想通过累积每个条目的结果将Map转换为单个值时,请使用 `reduce`。提供一个处理每个条目并更新累加器的回调函数。如果提供了初始值,它将用作起始累加器值。如果未提供初始值且Map为空,则会抛出TypeError。

```typescript
import { reduce } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

const result = reduce(map, (acc, value) => acc + value, 0);
// 结果: 6
```

您可以通过各种方式归约Map。

```typescript
import { reduce } from 'es-toolkit/map';

// 带初始值的求和
const scores = new Map([
  ['alice', 95],
  ['bob', 87],
  ['charlie', 92],
]);

const totalScore = reduce(scores, (acc, score) => acc + score, 0);
// 结果: 274

// 不带初始值(使用第一个值)
const numbers = new Map([
  ['a', 10],
  ['b', 20],
]);

const sum = reduce(numbers, (acc, value) => acc + value);
// 结果: 30(从第一个值10开始)

// 从Map构建对象
const settings = new Map([
  ['theme', 'dark'],
  ['lang', 'en'],
  ['notifications', true],
]);

const config = reduce(settings, (acc, value, key) => ({ ...acc, [key]: value }), {} as Record<string, any>);
// 结果: { theme: 'dark', lang: 'en', notifications: true }
```



#### 抛出

(`TypeError`): 如果Map为空且未提供初始值。

## some

### `some(map, doesMatch)`

当您想检查Map中是否至少有一个条目满足特定条件时,请使用 `some`。提供一个测试每个条目的谓词函数,如果至少有一个条目满足谓词,它返回true,否则返回false。

```typescript
import { some } from 'es-toolkit/map';

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

const result = some(map, value => value > 2);
// 结果: true

const result2 = some(map, value => value > 5);
// 结果: false
```

您可以测试各种条件。

```typescript
import { some } from 'es-toolkit/map';

// 检查是否有任何值满足条件
const inventory = new Map([
  ['apple', { quantity: 0, inStock: false }],
  ['banana', { quantity: 5, inStock: true }],
  ['orange', { quantity: 0, inStock: false }],
]);

const hasStock = some(inventory, item => item.inStock);
// 结果: true

// 检查是否有任何键匹配模式
const data = new Map([
  ['user_1', 'Alice'],
  ['user_2', 'Bob'],
  ['group_1', 'Admins'],
]);

const hasAdmin = some(data, (value, key) => key.startsWith('admin_'));
// 结果: false
```
