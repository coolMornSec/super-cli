# 用法汇总 - set

## countBy

### `countBy(set, mapper)`

当您想计算Set中有多少元素属于不同类别时,请使用 `countBy`。提供一个从每个值生成键的函数,它返回一个Map,其中生成的键及其计数作为值。对于转换产生相同键的每个元素,计数会递增。

```typescript
import { countBy } from 'es-toolkit/set';

const set = new Set([1, 2, 3, 4, 5]);

const result = countBy(set, value => (value % 2 === 0 ? 'even' : 'odd'));
// 结果: Map(2) { 'odd' => 3, 'even' => 2 }
```

可以根据各种标准计算元素。

```typescript
import { countBy } from 'es-toolkit/set';

// 按字符串长度计数
const words = new Set(['apple', 'banana', 'cherry', 'date']);

const byLength = countBy(words, word => word.length);
// 结果: Map(3) { 5 => 1, 6 => 2, 4 => 1 }

// 按属性计数
const users = new Set([
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'user' },
  { name: 'Diana', role: 'admin' },
]);

const byRole = countBy(users, user => user.role);
// 结果: Map(2) { 'admin' => 2, 'user' => 2 }

// 按派生类别计数
const ages = new Set([15, 25, 35, 45, 55]);

const ageGroups = countBy(ages, age => {
  if (age < 18) return 'minor';
  if (age < 65) return 'adult';
  return 'senior';
});
// 结果: Map(2) { 'minor' => 1, 'adult' => 4 }
```

## every

### `every(set, doesMatch)`

当您想检查Set中的所有元素是否满足特定条件时,请使用 `every`。提供一个测试每个元素的谓词函数,如果所有元素都满足谓词,它返回true,否则返回false。

```typescript
import { every } from 'es-toolkit/set';

const set = new Set([10, 20, 30]);

const result = every(set, value => value > 5);
// 结果: true

const result2 = every(set, value => value > 15);
// 结果: false
```

您可以测试各种条件。

```typescript
import { every } from 'es-toolkit/set';

// 检查所有值是否满足条件
const ages = new Set([25, 30, 35, 40]);

const allAdults = every(ages, age => age >= 18);
// 结果: true

const allSeniors = every(ages, age => age >= 65);
// 结果: false

// 检查对象属性
const users = new Set([
  { name: 'Alice', active: true },
  { name: 'Bob', active: true },
  { name: 'Charlie', active: true },
]);

const allActive = every(users, user => user.active);
// 结果: true
```

## filter

### `filter(set, callback)`

当您想创建一个仅包含满足特定条件的元素的新Set时,请使用 `filter`。提供一个测试每个元素的谓词函数,它返回一个仅包含谓词返回true的元素的新Set。

```typescript
import { filter } from 'es-toolkit/set';

const set = new Set([1, 2, 3, 4, 5]);

const result = filter(set, value => value > 2);
// 结果: Set(3) { 3, 4, 5 }
```

您可以根据各种标准进行过滤。

```typescript
import { filter } from 'es-toolkit/set';

// 按值类型过滤
const numbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const evenNumbers = filter(numbers, num => num % 2 === 0);
// 结果: Set(5) { 2, 4, 6, 8, 10 }

// 过滤对象
const products = new Set([
  { name: 'Laptop', price: 1000, available: true },
  { name: 'Mouse', price: 25, available: false },
  { name: 'Keyboard', price: 75, available: true },
]);

const availableProducts = filter(products, product => product.available);
// 结果: 包含Laptop和Keyboard的Set
```

## find

### `find(set, doesMatch)`

当您想查找Set中符合特定条件的第一个元素时,请使用 `find`。提供一个测试每个元素的谓词函数,它返回第一个匹配的元素,如果未找到则返回undefined。

```typescript
import { find } from 'es-toolkit/set';

const set = new Set([
  { name: 'apple', quantity: 10 },
  { name: 'banana', quantity: 5 },
  { name: 'grape', quantity: 15 },
]);

const result = find(set, value => value.quantity > 10);
// 结果: { name: 'grape', quantity: 15 }
```

您可以根据各种标准进行搜索。

```typescript
import { find } from 'es-toolkit/set';

// 按值属性查找
const users = new Set([
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
]);

const senior = find(users, user => user.age >= 35);
// 结果: { id: 3, name: 'Charlie', age: 35 }

// 按字符串模式查找
const emails = new Set(['user@example.com', 'admin@example.com', 'info@company.com']);

const adminEmail = find(emails, email => email.startsWith('admin'));
// 结果: 'admin@example.com'
```

## forEach

### `forEach(set, callback)`

当您想对Set中的每个元素执行函数时,请使用 `forEach`。回调函数接收值两次(为了与Map.forEach保持一致)和Set本身作为参数。这对于日志记录、更新外部状态或对每个元素执行操作等副作用很有用。

```typescript
import { forEach } from 'es-toolkit/set';

const set = new Set([1, 2, 3]);

forEach(set, value => {
  console.log(value * 2);
});
// 输出:
// 2
// 4
// 6
```

可以对每个元素执行各种操作。

```typescript
import { forEach } from 'es-toolkit/set';

// 累积值
const numbers = new Set([1, 2, 3, 4, 5]);

let sum = 0;
forEach(numbers, value => {
  sum += value;
});
// sum现在是15

// 带转换地将元素收集到数组中
const names = new Set(['alice', 'bob', 'charlie']);

const uppercased: string[] = [];
forEach(names, value => {
  uppercased.push(value.toUpperCase());
});
// uppercased: ['ALICE', 'BOB', 'CHARLIE']

// 根据条件更新外部Set
const scores = new Set([85, 92, 78, 95, 88]);

const highScores = new Set<number>();
forEach(scores, value => {
  if (value >= 90) {
    highScores.add(value);
  }
});
// highScores包含92和95

// 处理对象
const users = new Set([
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true },
]);

const activeUserIds: number[] = [];
forEach(users, user => {
  if (user.active) {
    activeUserIds.push(user.id);
  }
});
// activeUserIds: [1, 3]
```

## keyBy

### `keyBy(set, getKeyFromValue)`

当您想通过从值生成键将Set转换为Map时,请使用 `keyBy`。提供一个从每个值生成键的函数,它返回一个新Map,其中键由键函数生成,值是原始集合中的相应值。如果多个元素产生相同的键,则使用最后遇到的值。

```typescript
import { keyBy } from 'es-toolkit/set';

const set = new Set([
  { type: 'fruit', name: 'apple' },
  { type: 'fruit', name: 'banana' },
  { type: 'vegetable', name: 'carrot' },
]);

const result = keyBy(set, item => item.type);
// 结果:
// Map(2) {
//   'fruit' => { type: 'fruit', name: 'banana' },
//   'vegetable' => { type: 'vegetable', name: 'carrot' }
// }
// 注意: 'banana'被保留是因为它是最后一个'fruit'
```

可以根据各种标准创建索引。

```typescript
import { keyBy } from 'es-toolkit/set';

// 按ID索引
const users = new Set([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]);

const byId = keyBy(users, user => user.id);
// 结果: Map(3) { 1 => {...}, 2 => {...}, 3 => {...} }

// 按名称索引
const byName = keyBy(users, user => user.name);
// 结果: 键为'Alice', 'Bob', 'Charlie'的Map

// 按派生值索引
const numbers = new Set([1, 2, 3, 4, 5]);

const byParity = keyBy(numbers, num => (num % 2 === 0 ? 'even' : 'odd'));
// 结果: Map(2) {
//   'odd' => 5,
//   'even' => 4
// }
// 注意: 保留最后的偶数(4)和最后的奇数(5)
```

## map

### `map(set, getNewValue)`

当您想要转换Set的元素时,请使用 `map`。提供一个从每个元素生成新值的函数,它返回一个具有转换后元素的新Set。

```typescript
import { map } from 'es-toolkit/set';

const set = new Set([1, 2, 3]);

const result = map(set, value => value * 2);
// 结果: Set(3) { 2, 4, 6 }
```

您可以通过各种方式转换元素。

```typescript
import { map } from 'es-toolkit/set';

// 转换字符串
const names = new Set(['alice', 'bob', 'charlie']);

const uppercased = map(names, name => name.toUpperCase());
// 结果: Set(3) { 'ALICE', 'BOB', 'CHARLIE' }

// 转换对象
const prices = new Set([10, 20, 30]);

const products = map(prices, price => ({ price, currency: 'USD' }));
// 结果: 包含对象{ price: 10, currency: 'USD' }等的Set

// 提取属性
const users = new Set([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]);

const ids = map(users, user => user.id);
// 结果: Set(2) { 1, 2 }
```

## reduce

### `reduce(set, callback, initialValue?)`

当您想通过累积每个元素的结果将Set转换为单个值时,请使用 `reduce`。提供一个处理每个元素并更新累加器的回调函数。如果提供了初始值,它将用作起始累加器值。如果未提供初始值且Set为空,则会抛出TypeError。

```typescript
import { reduce } from 'es-toolkit/set';

const set = new Set([1, 2, 3]);

const result = reduce(set, (acc, value) => acc + value, 0);
// 结果: 6
```

您可以通过各种方式归约Set。

```typescript
import { reduce } from 'es-toolkit/set';

// 带初始值的求和
const numbers = new Set([10, 20, 30, 40]);

const total = reduce(numbers, (acc, num) => acc + num, 0);
// 结果: 100

// 不带初始值(使用第一个元素)
const values = new Set([5, 10]);

const sum = reduce(values, (acc, value) => acc + value);
// 结果: 15(从第一个值5开始)

// 从Set构建数组
const uniqueNames = new Set(['Alice', 'Bob', 'Charlie']);

const nameList = reduce(uniqueNames, (acc, name) => [...acc, name.toUpperCase()], [] as string[]);
// 结果: ['ALICE', 'BOB', 'CHARLIE']
```



#### 抛出

(`TypeError`): 如果Set为空且未提供初始值。

## some

### `some(set, doesMatch)`

当您想检查Set中是否至少有一个元素满足特定条件时,请使用 `some`。提供一个测试每个元素的谓词函数,如果至少有一个元素满足谓词,它返回true,否则返回false。

```typescript
import { some } from 'es-toolkit/set';

const set = new Set([1, 2, 3]);

const result = some(set, value => value > 2);
// 结果: true

const result2 = some(set, value => value > 5);
// 结果: false
```

您可以测试各种条件。

```typescript
import { some } from 'es-toolkit/set';

// 检查是否有任何值满足条件
const numbers = new Set([1, 3, 5, 7, 9]);

const hasEven = some(numbers, num => num % 2 === 0);
// 结果: false

const hasLarge = some(numbers, num => num > 5);
// 结果: true

// 检查对象属性
const users = new Set([
  { name: 'Alice', admin: false },
  { name: 'Bob', admin: true },
  { name: 'Charlie', admin: false },
]);

const hasAdmin = some(users, user => user.admin);
// 结果: true
```
