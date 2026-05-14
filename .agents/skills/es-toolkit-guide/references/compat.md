# 用法汇总 - compat

## castArray

### `castArray(value?)`

当你想要确保任何值都变成数组时，使用 `castArray`。如果值已经是数组，则原样返回。否则，创建一个包含该值的新数组。

```typescript
import { castArray } from 'es-toolkit/compat';

// 将数字转换为数组
castArray(1);
// 返回值：[1]

// 将字符串转换为数组
castArray('hello');
// 返回值：['hello']

// 将对象转换为数组
castArray({ a: 1 });
// 返回值：[{ a: 1 }]
```

已经是数组的值将原样返回。

```typescript
import { castArray } from 'es-toolkit/compat';

castArray([1, 2, 3]);
// 返回值：[1, 2, 3]

castArray(['a', 'b']);
// 返回值：['a', 'b']
```

`null` 和 `undefined` 也会转换为数组。

```typescript
import { castArray } from 'es-toolkit/compat';

castArray(null);
// 返回值：[null]

castArray(undefined);
// 返回值：[undefined]
```

不带参数调用时，返回空数组。

```typescript
import { castArray } from 'es-toolkit/compat';

castArray();
// 返回值：[]
```

## chunk

### `chunk(arr, size?)`

当你想要将一个长数组分割成多个相同大小的较小数组时，使用 `chunk`。如果数组不能被均匀分割，最后一个数组将包含剩余的元素。

```typescript
import { chunk } from 'es-toolkit/compat';

// 将数字数组分成大小为 2 的块。
chunk([1, 2, 3, 4], 2);
// 返回值：[[1, 2], [3, 4]]

// 将字符串数组分成大小为 3 的块。
chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3);
// 返回值：[['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]

// 当不能均匀分割时
chunk([1, 2, 3, 4, 5], 2);
// 返回值：[[1, 2], [3, 4], [5]]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { chunk } from 'es-toolkit/compat';

chunk(null, 2);
// 返回值：[]

chunk(undefined, 2);
// 返回值：[]
```

如果大小为 0 或负数，返回空数组。

```typescript
import { chunk } from 'es-toolkit/compat';

chunk([1, 2, 3], 0);
// 返回值：[]

chunk([1, 2, 3], -1);
// 返回值：[]
```

## compact

### `compact(arr)`

当你想要从数组中移除像 `false`、`null`、`0`、`""`、`undefined` 和 `NaN` 这样的假值时,使用 `compact`。

```typescript
import { compact } from 'es-toolkit/compat';

// 移除假值
compact([0, 1, false, 2, '', 3]);
// Returns: [1, 2, 3]

compact(['a', null, 'b', undefined, 'c', NaN]);
// Returns: ['a', 'b', 'c']

// 也会移除 bigint 0
compact([0n, 1n, false, 2n]);
// Returns: [1n, 2n]

// 处理空数组
compact([]);
// Returns: []

// 当所有值都是假值时
compact([false, null, 0, '', undefined, NaN]);
// Returns: []
```

真值会保持原样。

```typescript
import { compact } from 'es-toolkit/compat';

compact([1, 'hello', true, {}, []]);
// Returns: [1, 'hello', true, {}, []]

// 非零数字
compact([0, -1, 2, -3]);
// Returns: [-1, 2, -3]
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { compact } from 'es-toolkit/compat';

compact(null);
// Returns: []

compact(undefined);
// Returns: []
```

## concat

### `concat(...values)`

当你想要按顺序连接多个值和数组来创建一个新数组时,使用 `concat`。数组会被展开,单个值会直接添加。

```typescript
import { concat } from 'es-toolkit/compat';

// 连接单个值
concat(1, 2, 3);
// Returns: [1, 2, 3]

// 连接数组
concat([1, 2], [3, 4]);
// Returns: [1, 2, 3, 4]

// 连接值和数组
concat(1, [2, 3], 4);
// Returns: [1, 2, 3, 4]
```

嵌套数组只展开一层。

```typescript
import { concat } from 'es-toolkit/compat';

// 嵌套数组只展开一层
concat([1, [2, 3]], 4);
// Returns: [1, [2, 3], 4]

// 更深层嵌套的数组
concat([1, [2, [3, 4]]], 5);
// Returns: [1, [2, [3, 4]], 5]
```

也可以处理空数组和空值。

```typescript
import { concat } from 'es-toolkit/compat';

// 与空数组一起
concat([], [1, 2], [], [3]);
// Returns: [1, 2, 3]

// 没有值的情况
concat();
// Returns: []
```

## countBy

### `countBy(collection, iteratee?)`

当你想要按某个标准对数组或对象的每个元素进行分组,并计算每个组中有多少个元素时,使用 `countBy`。迭代函数返回的值将成为键,该键对应的元素数量将成为值。

```typescript
import { countBy } from 'es-toolkit/compat';

// 按向下取整对数字分组
countBy([6.1, 4.2, 6.3], Math.floor);
// Returns: { '4': 1, '6': 2 }

// 按长度对字符串分组
countBy(['one', 'two', 'three'], 'length');
// Returns: { '3': 2, '5': 1 }

// 按年龄段对用户分组
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
  { name: 'Charlie', age: 25 },
];
countBy(users, user => Math.floor(user.age / 10) * 10);
// Returns: { '20': 2, '30': 1 }
```

也可以处理对象。

```typescript
import { countBy } from 'es-toolkit/compat';

// 按类型对对象的值进行分类
const obj = { a: 1, b: 'string', c: 2, d: 'text' };
countBy(obj, value => typeof value);
// Returns: { 'number': 2, 'string': 2 }
```

不使用迭代函数时,会按值本身分组。

```typescript
import { countBy } from 'es-toolkit/compat';

// 按值本身分组
countBy([1, 2, 1, 3, 2, 1]);
// Returns: { '1': 3, '2': 2, '3': 1 }

// 按布尔值分组
countBy([true, false, true, true]);
// Returns: { 'true': 3, 'false': 1 }
```

`null` 或 `undefined` 集合返回空对象。

```typescript
import { countBy } from 'es-toolkit/compat';

countBy(null);
// Returns: {}

countBy(undefined);
// Returns: {}
```

## difference

### `difference(arr, ...values)`

当你想要从第一个数组中删除所有包含在其余数组中的值时,使用 `difference`。顺序保持第一个数组的顺序。

```typescript
import { difference } from 'es-toolkit/compat';

// 基本用法
const array1 = [1, 2, 3, 4, 5];
const array2 = [2, 4];
const array3 = [5, 6];
difference(array1, array2, array3);
// Returns: [1, 3]

// 字符串数组
difference(['a', 'b', 'c'], ['b'], ['c', 'd']);
// Returns: ['a']

// 处理重复值
difference([1, 2, 2, 3], [2]);
// Returns: [1, 3]
```

也可以处理空数组或空差集。

```typescript
import { difference } from 'es-toolkit/compat';

// 与空数组的差集
difference([1, 2, 3], []);
// Returns: [1, 2, 3]

// 所有值都被排除的情况
difference([1, 2, 3], [1, 2, 3]);
// Returns: []

// 没有重叠值的情况
difference([1, 2], [3, 4]);
// Returns: [1, 2]
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { difference } from 'es-toolkit/compat';

difference(null, [1, 2]);
// Returns: []

difference(undefined, [1, 2]);
// Returns: []

difference([1, 2, 3], null, undefined);
// Returns: [1, 2, 3] (null和undefined被忽略)
```

也支持类数组对象。

```typescript
import { difference } from 'es-toolkit/compat';

// 类数组对象
const arrayLike1 = { 0: 1, 1: 2, 2: 3, length: 3 };
const arrayLike2 = { 0: 2, 1: 4, length: 2 };
difference(arrayLike1, arrayLike2);
// Returns: [1, 3]
```

## differenceBy

### `differenceBy(array, ...values, iteratee)`

当你想要将第一个数组的每个元素和要排除的数组的元素通过迭代函数转换后,删除产生相同值的元素时,使用 `differenceBy`。在对象数组中按特定属性值或转换值进行比较时很有用。

```typescript
import { differenceBy } from 'es-toolkit/compat';

// 按向下取整比较
differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// Returns: [1.2] (因为Math.floor(2.1) === Math.floor(2.3),所以排除2.1)

// 按字符串长度比较
differenceBy(['one', 'two', 'three'], ['four', 'eight'], 'length');
// Returns: ['one', 'two'] (因为three和eight长度相同,所以排除three)

// 按对象属性比较
const users1 = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const users2 = [{ id: 1, name: 'Different Alice' }];
differenceBy(users1, users2, 'id');
// Returns: [{ id: 2, name: 'Bob' }] (排除id为1的对象)
```

可以一次排除多个数组。

```typescript
import { differenceBy } from 'es-toolkit/compat';

// 从多个数组中排除
differenceBy([2.1, 1.2, 3.5], [2.3], [1.4], [3.2], Math.floor);
// Returns: [] (所有元素都被排除)

// 按长度比较字符串数组
differenceBy(['a', 'bb', 'ccc'], ['x'], ['yy'], ['zzz'], 'length');
// Returns: [] (长度1、2、3都被排除)
```

没有迭代函数时,像普通 `difference` 一样工作。

```typescript
import { differenceBy } from 'es-toolkit/compat';

// 不使用迭代函数
differenceBy([1, 2, 3], [2, 4]);
// Returns: [1, 3]
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { differenceBy } from 'es-toolkit/compat';

differenceBy(null, [1, 2], Math.floor);
// Returns: []

differenceBy(undefined, [1, 2], x => x);
// Returns: []
```

## differenceWith

### `differenceWith(array, ...values, comparator)`

当你想要用比较函数比较每个元素来求差时,使用 `differenceWith`。最后一个参数成为比较函数。

```typescript
import { differenceWith } from 'es-toolkit/compat';

// 按id比较对象
const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
const others = [{ id: 2 }];
const comparator = (a, b) => a.id === b.id;

differenceWith(objects, others, comparator);
// Returns: [{ id: 1 }, { id: 3 }]

// 一次排除多个数组
const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
const values1 = [{ id: 2 }];
const values2 = [{ id: 3 }];

differenceWith(array, values1, values2, comparator);
// Returns: [{ id: 1 }, { id: 4 }]
```

不提供比较函数时,像普通 `difference` 一样工作。

```typescript
import { differenceWith } from 'es-toolkit/compat';

// 不使用比较函数时进行普通比较
differenceWith([1, 2, 3], [2], [3]);
// Returns: [1]
```

也可以使用复杂的比较逻辑。

```typescript
import { differenceWith } from 'es-toolkit/compat';

const users = [
  { name: 'alice', age: 25 },
  { name: 'bob', age: 30 },
  { name: 'charlie', age: 35 },
];
const excludeUsers = [{ name: 'bob', age: 25 }]; // 不同的年龄

// 只按名称比较
const compareByName = (a, b) => a.name === b.name;
differenceWith(users, excludeUsers, compareByName);
// Returns: [{ name: 'alice', age: 25 }, { name: 'charlie', age: 35 }]
// bob被排除(即使年龄不同,名称相同)
```

## drop

### `drop(array, n?)`

当您想从数组的开头删除几个元素并获取其余元素时,使用 `drop`。默认情况下,它会删除第一个元素。

```typescript
import { drop } from 'es-toolkit/compat';

// 基本用法(删除第一个元素)
drop([1, 2, 3, 4, 5]);
// 返回: [2, 3, 4, 5]

// 删除前 2 个元素
drop([1, 2, 3, 4, 5], 2);
// 返回: [3, 4, 5]

// 删除前 3 个元素
drop(['a', 'b', 'c', 'd'], 3);
// 返回: ['d']
```

指定 0 或负数时,返回原始数组。

```typescript
import { drop } from 'es-toolkit/compat';

// 删除 0 个元素
drop([1, 2, 3], 0);
// 返回: [1, 2, 3]

// 指定负数
drop([1, 2, 3], -1);
// 返回: [1, 2, 3]
```

指定大于数组的数字时,返回空数组。

```typescript
import { drop } from 'es-toolkit/compat';

// 指定大于数组大小的数字
drop([1, 2, 3], 5);
// 返回: []

// 从空数组中删除
drop([], 1);
// 返回: []
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { drop } from 'es-toolkit/compat';

drop(null, 1);
// 返回: []

drop(undefined, 2);
// 返回: []
```

也支持类数组对象。

```typescript
import { drop } from 'es-toolkit/compat';

// 类数组对象
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
drop(arrayLike, 1);
// 返回: ['b', 'c']
```

## dropRight

### `dropRight(array, itemsCount)`

当您想从数组的末尾删除特定数量的元素并创建一个包含剩余元素的新数组时,使用 `dropRight`。

```typescript
import { dropRight } from 'es-toolkit/compat';

// 从数字数组中删除末尾的 2 个元素。
dropRight([1, 2, 3, 4, 5], 2);
// 返回: [1, 2, 3]

// 从字符串数组中删除末尾的 1 个元素。
dropRight(['a', 'b', 'c'], 1);
// 返回: ['a', 'b']

// 如果未指定要删除的数量,则使用默认值 1。
dropRight([1, 2, 3]);
// 返回: [1, 2]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { dropRight } from 'es-toolkit/compat';

dropRight(null, 2); // []
dropRight(undefined, 2); // []
```

## dropRightWhile

### `dropRightWhile(array, predicate)`

当您想从数组的末尾连续删除满足特定条件的元素时,使用 `dropRightWhile`。当条件函数返回 `false` 时停止删除。

```typescript
import { dropRightWhile } from 'es-toolkit/compat';

// 使用函数作为条件。
const users = [
  { user: 'barney', active: true },
  { user: 'fred', active: false },
  { user: 'pebbles', active: false },
];

dropRightWhile(users, user => !user.active);
// 返回: [{ user: 'barney', active: true }]

// 使用对象模式进行匹配。
dropRightWhile(users, { user: 'pebbles', active: false });
// 返回: [{ user: 'barney', active: true }, { user: 'fred', active: false }]

// 以数组形式指定属性和值。
dropRightWhile(users, ['active', false]);
// 返回: [{ user: 'barney', active: true }]

// 通过属性名检查条件。
dropRightWhile(users, 'active');
// 返回: [{ user: 'barney', active: true }, { user: 'fred', active: false }, { user: 'pebbles', active: false }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { dropRightWhile } from 'es-toolkit/compat';

dropRightWhile(null, x => x > 0); // []
dropRightWhile(undefined, x => x > 0); // []
```

## dropWhile

### `dropWhile(array, predicate)`

当您想从数组的开头连续删除满足特定条件的元素时,使用 `dropWhile`。当条件函数返回 `false` 时停止删除。

```typescript
import { dropWhile } from 'es-toolkit/compat';

// 使用函数作为条件。
dropWhile([1, 2, 3, 4, 5], n => n < 3);
// 返回: [3, 4, 5]

// 使用对象模式进行匹配。
const users = [
  { name: 'alice', active: false },
  { name: 'bob', active: false },
  { name: 'charlie', active: true },
];

dropWhile(users, { active: false });
// 返回: [{ name: 'charlie', active: true }]

// 以数组形式指定属性和值。
dropWhile(users, ['active', false]);
// 返回: [{ name: 'charlie', active: true }]

// 通过属性名检查条件。
const items = [{ visible: false }, { visible: false }, { visible: true }];

dropWhile(items, 'visible');
// 返回: [{ visible: false }, { visible: false }, { visible: true }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { dropWhile } from 'es-toolkit/compat';

dropWhile(null, x => x > 0); // []
dropWhile(undefined, x => x > 0); // []
```

## each

### `each(collection, iteratee)`

遍历数组、对象或字符串的每个元素并执行给定的函数。对于数组,按索引顺序迭代;对于对象,遍历可枚举属性。

```typescript
import { each } from 'es-toolkit/compat';

// 遍历数组
each([1, 2, 3], (value, index) => console.log(value, index));
// 日志: 1 0, 2 1, 3 2

// 遍历对象
each({ a: 1, b: 2 }, (value, key) => console.log(key, value));
// 日志: 'a' 1, 'b' 2

// 遍历字符串
each('hello', (char, index) => console.log(char, index));
// 日志: 'h' 0, 'e' 1, 'l' 2, 'l' 3, 'o' 4
```

如果函数返回 `false`,则停止迭代。

```typescript
import { each } from 'es-toolkit/compat';

each([1, 2, 3, 4], value => {
  console.log(value);
  return value !== 2; // 在 2 处停止
});
// 日志: 1, 2
```

## eachRight

### `eachRight(collection, iteratee)`

从右到左遍历数组、对象或字符串的每个元素并执行给定的函数。对于数组,从最后一个索引开始逆序迭代;对于对象,以逆序遍历可枚举属性。

```typescript
import { eachRight } from 'es-toolkit/compat';

// 逆序遍历数组
eachRight([1, 2, 3], (value, index) => console.log(value, index));
// 日志: 3 2, 2 1, 1 0

// 逆序遍历对象
eachRight({ a: 1, b: 2 }, (value, key) => console.log(key, value));
// 日志: 'b' 2, 'a' 1

// 逆序遍历字符串
eachRight('hello', (char, index) => console.log(char, index));
// 日志: 'o' 4, 'l' 3, 'l' 2, 'e' 1, 'h' 0
```

如果函数返回 `false`,则停止迭代。

```typescript
import { eachRight } from 'es-toolkit/compat';

eachRight([1, 2, 3, 4], value => {
  console.log(value);
  return value !== 2; // 在 2 处停止
});
// 日志: 4, 3, 2
```

## every

### `every(collection, predicate?)`

当您想检查数组或对象的所有元素是否满足特定条件时,使用 `every`。条件可以以各种格式指定,如函数、部分对象、属性-值对、属性名称等。

```typescript
import { every } from 'es-toolkit/compat';

// 使用检查函数
const numbers = [2, 4, 6, 8];
every(numbers, x => x % 2 === 0);
// 返回: true

// 使用属性名称
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: true },
];
every(users, 'active');
// 返回: true

// 使用部分对象
every(users, { active: true });
// 返回: true

// 使用属性-值对
every(users, ['active', true]);
// 返回: true
```

对象的操作方式相同。

```typescript
import { every } from 'es-toolkit/compat';

const scores = { math: 90, english: 85, science: 92 };
every(scores, score => score >= 80);
// 返回: true
```

`null` 或 `undefined` 被视为空集合并返回 `true`。

```typescript
import { every } from 'es-toolkit/compat';

every(null);
// 返回: true

every(undefined);
// 返回: true
```

## fill

### `fill(array, value, start?, end?)`

当您想用相同的值填充数组的特定范围或整个数组时,使用 `fill`。它会直接修改原始数组。

```typescript
import { fill } from 'es-toolkit/compat';

// 填充整个数组
const arr1 = [1, 2, 3];
fill(arr1, 'a');
// 返回: ['a', 'a', 'a']

// 填充特定范围
const arr2 = [1, 2, 3, 4, 5];
fill(arr2, '*', 1, 4);
// 返回: [1, '*', '*', '*', 5]

// 使用负数索引
const arr3 = [1, 2, 3, 4, 5];
fill(arr3, 'x', -3, -1);
// 返回: [1, 2, 'x', 'x', 5]
```

也支持类数组对象。

```typescript
import { fill } from 'es-toolkit/compat';

const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };
fill(arrayLike, 'a', 1, 2);
// 返回: { 0: 1, 1: 'a', 2: 3, length: 3 }
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { fill } from 'es-toolkit/compat';

fill(null, 'a');
// 返回: []

fill(undefined, 'a');
// 返回: []
```

字符串是只读的,因此按原样返回。

```typescript
import { fill } from 'es-toolkit/compat';

fill('abc', 'x');
// 返回: 'abc' (未修改)
```

## filter

### `filter(collection, predicate)`

当您想从数组或对象中筛选出满足特定条件的元素时,使用 `filter`。条件可以以各种格式指定,如函数、部分对象、属性-值对、属性名称等。

```typescript
import { filter } from 'es-toolkit/compat';

// 使用检查函数
const numbers = [1, 2, 3, 4, 5];
filter(numbers, x => x % 2 === 0);
// 返回: [2, 4]

// 使用属性名称
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Charlie', active: true },
];
filter(users, 'active');
// 返回: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]

// 使用部分对象
filter(users, { active: true });
// 返回: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]

// 使用属性-值对
filter(users, ['active', true]);
// 返回: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]
```

对象的操作方式相同,返回满足条件的值的数组。

```typescript
import { filter } from 'es-toolkit/compat';

const scores = { math: 90, english: 75, science: 85 };
filter(scores, score => score >= 80);
// 返回: [90, 85]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { filter } from 'es-toolkit/compat';

filter(null, x => x > 0);
// 返回: []

filter(undefined, x => x > 0);
// 返回: []
```

## find

### `find(collection, predicate, fromIndex?)`

当您想在数组或对象中查找满足特定条件的第一个元素时,使用 `find`。条件可以以各种格式指定,如函数、部分对象、属性-值对、属性名称等。

```typescript
import { find } from 'es-toolkit/compat';

// 使用检查函数
const numbers = [1, 2, 3, 4, 5];
find(numbers, x => x > 3);
// 返回: 4

// 使用属性名称
const users = [
  { name: 'Alice', active: false },
  { name: 'Bob', active: true },
  { name: 'Charlie', active: true },
];
find(users, 'active');
// 返回: { name: 'Bob', active: true }

// 使用部分对象
find(users, { active: true });
// 返回: { name: 'Bob', active: true }

// 使用属性-值对
find(users, ['name', 'Charlie']);
// 返回: { name: 'Charlie', active: true }
```

可以指定起始索引。

```typescript
import { find } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4, 5];
find(numbers, x => x > 2, 2);
// 返回: 3 (从索引 2 开始搜索)
```

对象的操作方式相同。

```typescript
import { find } from 'es-toolkit/compat';

const scores = { math: 90, english: 75, science: 85 };
find(scores, score => score >= 80);
// 返回: 90
```

`null` 或 `undefined` 被视为空集合并返回 `undefined`。

```typescript
import { find } from 'es-toolkit/compat';

find(null, x => x > 0);
// 返回: undefined

find(undefined, x => x > 0);
// 返回: undefined
```

## findIndex

### `findIndex(arr, doesMatch, fromIndex)`

当您想要查找数组中满足特定条件的第一个元素的位置时,使用 `findIndex`。您可以通过多种方式指定条件。如果没有元素满足条件,则返回 `-1`。

当您将条件指定为函数时,它会对每个元素执行该函数,并返回第一个返回 true 的元素的索引。

```typescript
import { findIndex } from 'es-toolkit/compat';

const users = [
  { id: 1, name: 'Alice', active: false },
  { id: 2, name: 'Bob', active: true },
  { id: 3, name: 'Charlie', active: true },
];

// 使用函数指定条件
findIndex(users, user => user.active);
// Returns: 1
```

当您将条件指定为部分对象时,它会返回第一个匹配这些属性的元素的索引。

```typescript
import { findIndex } from 'es-toolkit/compat';

// 使用部分对象指定条件
findIndex(users, { name: 'Bob', active: true });
// Returns: 1
```

当您将条件指定为属性名和值的数组时,它会返回第一个该属性与该值匹配的元素的索引。

```typescript
import { findIndex } from 'es-toolkit/compat';

// 使用 [属性, 值] 数组指定条件
findIndex(users, ['active', true]);
// Returns: 1
```

当您只指定属性名时,它会返回第一个该属性值为真的元素的索引。

```typescript
import { findIndex } from 'es-toolkit/compat';

// 使用属性名指定条件
findIndex(users, 'active');
// Returns: 1
```

当您指定 `fromIndex` 时,搜索将从该索引开始。负值从数组末尾开始计算。

```typescript
import { findIndex } from 'es-toolkit/compat';

// 从索引 2 开始搜索
findIndex(users, user => user.active, 2);
// Returns: 2

// 从倒数第二个元素开始搜索
findIndex(users, user => user.active, -2);
// Returns: 1
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { findIndex } from 'es-toolkit/compat';

findIndex(null, user => user.active); // -1
findIndex(undefined, 'active'); // -1
```

## findLast

### `findLast(collection, predicate?, fromIndex?)`

在数组或对象中查找满足给定条件的最后一个元素。从数组末尾开始逆序搜索,并返回满足条件的第一个元素。

```typescript
import { findLast } from 'es-toolkit/compat';

// 使用函数指定条件
const users = [
  { user: 'barney', age: 36 },
  { user: 'fred', age: 40 },
  { user: 'pebbles', age: 18 },
];
findLast(users, o => o.age < 40);
// => { user: 'pebbles', age: 18 }

// 使用对象指定条件
findLast(users, { age: 36 });
// => { user: 'barney', age: 36 }

// 使用键值对指定条件
findLast(users, ['age', 18]);
// => { user: 'pebbles', age: 18 }

// 使用属性名指定条件(具有真值的最后一个元素)
findLast(users, 'age');
// => { user: 'fred', age: 40 }
```

也可以指定搜索起始索引。

```typescript
import { findLast } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
findLast(numbers, n => n > 3, 6); // 从索引6开始逆序搜索
// => 4
```

`null` 或 `undefined` 返回空结果。

```typescript
import { findLast } from 'es-toolkit/compat';

findLast(null, x => x > 0); // undefined
findLast(undefined, x => x > 0); // undefined
```

## findLastIndex

### `findLastIndex(array, predicate, fromIndex)`

当您想要从数组末尾开始查找满足给定条件的第一个元素的索引时,使用 `findLastIndex`。如果没有元素满足条件,则返回 `-1`。

此函数可以通过多种方式指定条件。当您传递函数时,它会对每个元素执行该函数。当您传递部分对象时,它会检查元素是否具有这些属性。当您传递数组格式的键值对时,它会检查特定属性是否与给定值匹配。当您传递字符串时,它会检查该属性是否值为真。

```typescript
import { findLastIndex } from 'es-toolkit/compat';

const users = [
  { user: 'barney', active: true },
  { user: 'fred', active: false },
  { user: 'pebbles', active: false },
];

// 使用函数指定条件
findLastIndex(users, o => o.user === 'pebbles');
// Returns: 2

// 使用部分对象查找匹配的元素
findLastIndex(users, { user: 'barney', active: true });
// Returns: 0

// 使用属性值对查找匹配的元素
findLastIndex(users, ['active', false]);
// Returns: 2

// 使用属性名查找具有真值的元素
findLastIndex(users, 'active');
// Returns: 0
```

也可以指定搜索的起始位置。如果 `fromIndex` 为负数,则从数组末尾开始计算。

```typescript
import { findLastIndex } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4, 5];

// 从索引3开始逆向搜索
findLastIndex(numbers, n => n < 4, 2);
// Returns: 2

// 如果使用负索引,则从末尾开始计算
findLastIndex(numbers, n => n > 2, -2);
// Returns: 3
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { findLastIndex } from 'es-toolkit/compat';

findLastIndex(null, n => n > 0); // -1
findLastIndex(undefined, n => n > 0); // -1
```

## first

### `first(array)`

当您想要获取数组的第一个元素时使用 `first`。如果数组为空或为 `null` 或 `undefined`,则返回 `undefined`。

```typescript
import { first } from 'es-toolkit/compat';

// 从常规数组获取第一个元素
first([1, 2, 3]);
// Returns: 1

// 从字符串数组获取第一个元素
first(['a', 'b', 'c']);
// Returns: 'a'

// 空数组
first([]);
// Returns: undefined
```

`null` 或 `undefined` 返回 `undefined`。

```typescript
import { first } from 'es-toolkit/compat';

first(null); // undefined
first(undefined); // undefined
```

可用于类数组对象。

```typescript
import { first } from 'es-toolkit/compat';

const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
first(arrayLike);
// Returns: 'a'

// 字符串也被视为数组
first('hello');
// Returns: 'h'
```

对于类型保证的元组,返回确切的类型。

```typescript
import { first } from 'es-toolkit/compat';

const tuple = [1, 'two', true] as const;
first(tuple);
// Returns: 1 (类型推断为 1)
```

## flatMap

### `flatMap(collection, iteratee)`

对集合的每个元素应用迭代函数并返回展平一层的数组。支持数组、对象和字符串,可以使用各种形式的迭代器。

```typescript
import { flatMap } from 'es-toolkit/compat';

// 对数组应用函数
function duplicate(n) {
  return [n, n];
}
flatMap([1, 2], duplicate);
// 结果: [1, 1, 2, 2]

// 对对象应用函数
const obj = { a: 1, b: 2 };
flatMap(obj, (value, key) => [key, value]);
// 结果: ['a', 1, 'b', 2]

// 使用字符串属性映射
const users = [
  { user: 'barney', hobbies: ['hiking', 'coding'] },
  { user: 'fred', hobbies: ['reading'] },
];
flatMap(users, 'hobbies');
// 结果: ['hiking', 'coding', 'reading']
```

不使用迭代器时将值展平一层。

```typescript
import { flatMap } from 'es-toolkit/compat';

const obj = { a: [1, 2], b: [3, 4] };
flatMap(obj);
// 结果: [1, 2, 3, 4]
```

也可以使用部分对象进行条件映射。

```typescript
import { flatMap } from 'es-toolkit/compat';

const users = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
];
flatMap(users, { active: false });
// 结果: [false, true] (active 为 false 的元素的匹配结果)
```

## flatMapDeep

### `flatMapDeep(collection, iteratee)`

对集合的每个元素应用迭代函数并返回展平到无限深度的数组。所有嵌套的数组结构都将被展平为一维数组。

```typescript
import { flatMapDeep } from 'es-toolkit/compat';

// 对数组应用函数并深度展平
function duplicate(n) {
  return [[[n, n]]];
}
flatMapDeep([1, 2], duplicate);
// 结果: [1, 1, 2, 2]

// 对对象应用函数并深度展平
const obj = { a: 1, b: 2 };
flatMapDeep(obj, (value, key) => [[[key, value]]]);
// 结果: ['a', 1, 'b', 2]

// 使用字符串属性映射并深度展平
const users = [
  { user: 'barney', hobbies: [['hiking', 'coding']] },
  { user: 'fred', hobbies: [['reading']] },
];
flatMapDeep(users, 'hobbies');
// 结果: ['hiking', 'coding', 'reading']
```

不使用迭代器时递归展平值。

```typescript
import { flatMapDeep } from 'es-toolkit/compat';

const obj = { a: [[1, 2]], b: [[[3]]] };
flatMapDeep(obj);
// 结果: [1, 2, 3]
```

也可以使用部分对象进行条件映射。

```typescript
import { flatMapDeep } from 'es-toolkit/compat';

const users = [
  { user: 'barney', active: [true, false] },
  { user: 'fred', active: [false] },
];
flatMapDeep(users, { active: [false] });
// 结果: [true, true] (active 数组包含 [false] 的元素的匹配结果)
```

## flatMapDepth

### `flatMapDepth(collection, iteratee, depth)`

使用给定函数转换数组或对象的每个元素,然后将结果展平到指定深度并返回新数组。当您想将嵌套的数组结构仅展平到所需深度时很有用。

```typescript
import { flatMapDepth } from 'es-toolkit/compat';

// 转换数组并展平到深度2
flatMapDepth([1, 2], n => [[n, n]], 2);
// => [1, 1, 2, 2]

// 限制为深度1时不会完全展平
flatMapDepth([1, 2], n => [[n, n]], 1);
// => [[1, 1], [2, 2]]

// 从对象提取值并展平
const users = [
  { user: 'barney', hobbies: [['hiking'], ['coding']] },
  { user: 'fred', hobbies: [['reading']] },
];
flatMapDepth(users, 'hobbies', 2);
// => ['hiking', 'coding', 'reading']
```

此函数支持各种形式的迭代器。

```typescript
import { flatMapDepth } from 'es-toolkit/compat';

// 使用函数转换
flatMapDepth([1, 2, 3], n => [[n, n]], 2);

// 按属性名提取值
const objects = [{ items: [['a'], ['b']] }, { items: [['c']] }];
flatMapDepth(objects, 'items', 2);
// => ['a', 'b', 'c']

// 使用对象部分匹配
const users = [{ active: [[true], [false]] }, { active: [[false]] }];
flatMapDepth(users, { active: [[false]] }, 2);
// => [true, true]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { flatMapDepth } from 'es-toolkit/compat';

flatMapDepth(null, n => [n], 1); // => []
flatMapDepth(undefined, n => [n], 1); // => []
```

## flatten

### `flatten(value, depth)`

按指定深度展平嵌套数组。默认情况下只展平一层,并且还支持 Arguments 对象和具有 Symbol.isConcatSpreadable 的对象。

```typescript
import { flatten } from 'es-toolkit/compat';

// 基本展平(一层)
flatten([1, [2, [3, [4]], 5]]);
// 结果: [1, 2, [3, [4]], 5]

// 指定深度
flatten([1, [2, [3, [4]], 5]], 2);
// 结果: [1, 2, 3, [4], 5]

// 支持 Arguments 对象
function example() {
  return flatten(arguments);
}
example(1, [2, 3], [[4]]);
// 结果: [1, 2, 3, [4]]
```

空数组、null 或 undefined 返回空数组。

```typescript
import { flatten } from 'es-toolkit/compat';

flatten(null); // []
flatten(undefined); // []
flatten([]); // []
```

具有 Symbol.isConcatSpreadable 的对象也像数组一样被展平。

```typescript
import { flatten } from 'es-toolkit/compat';

const spreadable = { 0: 'a', 1: 'b', length: 2, [Symbol.isConcatSpreadable]: true };
flatten([1, spreadable, 3]);
// 结果: [1, 'a', 'b', 3]
```

## flattenDeep

### `flattenDeep(value)`

在所有深度递归展平嵌套数组。移除所有嵌套级别,返回完全展平的一维数组。

```typescript
import { flattenDeep } from 'es-toolkit/compat';

// 完全展平深层嵌套数组
flattenDeep([1, [2, [3, [4]], 5]]);
// 结果: [1, 2, 3, 4, 5]

// 完全展平复杂嵌套结构
flattenDeep([1, [2, [3, [[[[4]]]]], 5]]);
// 结果: [1, 2, 3, 4, 5]

// 支持混合类型
flattenDeep(['a', ['b', ['c', [['d']]]]]);
// 结果: ['a', 'b', 'c', 'd']
```

空数组、null 或 undefined 返回空数组。

```typescript
import { flattenDeep } from 'es-toolkit/compat';

flattenDeep(null); // []
flattenDeep(undefined); // []
flattenDeep([]); // []
```

已经展平的数组按原样复制。

```typescript
import { flattenDeep } from 'es-toolkit/compat';

flattenDeep([1, 2, 3, 4, 5]);
// 结果: [1, 2, 3, 4, 5]
```

## flattenDepth

### `flattenDepth(array, depth)`

当您想将嵌套数组展平到所需深度时使用 `flattenDepth`。指定深度后,它只会将嵌套数组展平到该深度。

```typescript
import { flattenDepth } from 'es-toolkit/compat';

// 展平到深度1
flattenDepth([1, [2, [3, [4]], 5]], 1);
// Returns: [1, 2, [3, [4]], 5]

// 展平到深度2
flattenDepth([1, [2, [3, [4]], 5]], 2);
// Returns: [1, 2, 3, [4], 5]

// 如果未指定深度,默认为1
flattenDepth([1, [2, [3, [4]], 5]]);
// Returns: [1, 2, [3, [4]], 5]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { flattenDepth } from 'es-toolkit/compat';

flattenDepth(null, 2); // []
flattenDepth(undefined, 2); // []
```

## forEach

### `forEach(collection, callback)`

当您想遍历数组或对象的所有元素并对每个元素执行回调函数时，请使用 `forEach`。如果回调返回 `false`，则停止遍历。

```typescript
import { forEach } from 'es-toolkit/compat';

// 遍历数组
const numbers = [1, 2, 3, 4, 5];
const results: number[] = [];

forEach(numbers, value => {
  results.push(value * 2);
});
// results 为 [2, 4, 6, 8, 10]

// 提前终止
const numbers2 = [1, 2, 3, 4, 5];
const results2: number[] = [];

forEach(numbers2, value => {
  if (value > 3) {
    return false; // 停止遍历
  }
  results2.push(value);
});
// results2 为 [1, 2, 3]
```

对象的工作方式相同。

```typescript
import { forEach } from 'es-toolkit/compat';

const obj = { a: 1, b: 2, c: 3 };
const keys: string[] = [];
const values: number[] = [];

forEach(obj, (value, key) => {
  keys.push(key);
  values.push(value);
});
// keys 为 ['a', 'b', 'c']
// values 为 [1, 2, 3]
```

`null` 或 `undefined` 被视为空集合。

```typescript
import { forEach } from 'es-toolkit/compat';

forEach(null, value => {
  console.log(value); // 不会执行
});

forEach(undefined, value => {
  console.log(value); // 不会执行
});
```

## forEachRight

### `forEachRight(collection, callback)`

从右到左顺序遍历数组、对象或字符串，并对每个元素执行回调函数。如果回调返回 `false`，则停止遍历。

```typescript
import { forEachRight } from 'es-toolkit/compat';

// 逆序遍历数组
forEachRight([1, 2, 3], (value, index) => {
  console.log(value, index);
});
// 输出: 3 2, 2 1, 1 0

// 逆序遍历字符串
forEachRight('abc', (char, index) => {
  console.log(char, index);
});
// 输出: 'c' 2, 'b' 1, 'a' 0

// 逆序遍历对象
forEachRight({ a: 1, b: 2, c: 3 }, (value, key) => {
  console.log(value, key);
});
// 输出: 3 'c', 2 'b', 1 'a'
```

`null` 或 `undefined` 按原样返回。

```typescript
import { forEachRight } from 'es-toolkit/compat';

forEachRight(null, value => console.log(value)); // null
forEachRight(undefined, value => console.log(value)); // undefined
```

如果回调返回 `false`，则停止遍历。

```typescript
import { forEachRight } from 'es-toolkit/compat';

forEachRight([1, 2, 3, 4], value => {
  console.log(value);
  if (value === 2) {
    return false; // 停止遍历
  }
});
// 输出: 4, 3, 2
```

## groupBy

### `groupBy(collection, iteratee)`

根据给定的条件函数对数组或对象的每个元素进行分组，并返回按组分类的对象。条件可以以各种形式提供，如函数、属性名、部分对象等。

```typescript
import { groupBy } from 'es-toolkit/compat';

// 按函数分组
const array = [6.1, 4.2, 6.3];
const result = groupBy(array, Math.floor);
// result 为 { '4': [4.2], '6': [6.1, 6.3] }

// 按属性名分组
const users = [
  { name: 'john', age: 30 },
  { name: 'jane', age: 25 },
  { name: 'bob', age: 30 },
];
const byAge = groupBy(users, 'age');
// byAge 为 { '25': [{ name: 'jane', age: 25 }], '30': [{ name: 'john', age: 30 }, { name: 'bob', age: 30 }] }

// 从对象分组
const obj = { a: 6.1, b: 4.2, c: 6.3 };
const groupedObj = groupBy(obj, Math.floor);
// groupedObj 为 { '4': [4.2], '6': [6.1, 6.3] }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { groupBy } from 'es-toolkit/compat';

groupBy(null, x => x); // {}
groupBy(undefined, x => x); // {}
```

也可以按部分对象或属性-值对进行分组。

```typescript
import { groupBy } from 'es-toolkit/compat';

const products = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' },
];

// 按部分对象分组
const byCategory = groupBy(products, { category: 'fruit' });
// 按属性-值对分组
const byName = groupBy(products, ['name', 'apple']);
```

## head

### `head(array)`

返回数组或类数组对象的第一个元素。如果数组为空或无效，则返回 `undefined`。

```typescript
import { head } from 'es-toolkit/compat';

// 数字数组的第一个元素
const numbers = [1, 2, 3, 4];
const first = head(numbers);
// first 为 1

// 字符串数组的第一个元素
const strings = ['a', 'b', 'c'];
const firstChar = head(strings);
// firstChar 为 'a'

// 类数组对象
const arrayLike = { 0: 'x', 1: 'y', 2: 'z', length: 3 };
const firstItem = head(arrayLike);
// firstItem 为 'x'
```

空数组或无效输入返回 `undefined`。

```typescript
import { head } from 'es-toolkit/compat';

const emptyArray: number[] = [];
const noElement = head(emptyArray);
// noElement 为 undefined

head(null); // undefined
head(undefined); // undefined
```

## includes

### `includes(collection, target, fromIndex)`

当您想检查数组、对象或字符串中是否存在特定值时，请使用 `includes`。它使用 SameValueZero 方式比较值。

```typescript
import { includes } from 'es-toolkit/compat';

// 在数组中查找值
includes([1, 2, 3], 2);
// Returns: true

// 在对象的值中查找
includes({ a: 1, b: 'a', c: NaN }, 'a');
// Returns: true

// 在字符串中查找子字符串
includes('hello world', 'world');
// Returns: true
```

可以从特定索引开始搜索。

```typescript
import { includes } from 'es-toolkit/compat';

// 从索引 2 开始搜索
includes([1, 2, 3, 2], 2, 2);
// Returns: true (在索引 3 处找到)

// 负索引从末尾计算
includes([1, 2, 3], 2, -2);
// Returns: true
```

`null` 或 `undefined` 始终返回 `false`。

```typescript
import { includes } from 'es-toolkit/compat';

includes(null, 1); // false
includes(undefined, 1); // false
```

也可以在字符串中搜索子字符串。

```typescript
import { includes } from 'es-toolkit/compat';

// 从头开始搜索
includes('hello', 'e');
// Returns: true

// 从特定位置搜索
includes('hello', 'e', 2);
// Returns: false (索引 2 之后没有 'e')
```

可以正确找到 `NaN` 值。

```typescript
import { includes } from 'es-toolkit/compat';

includes([1, 2, NaN], NaN);
// Returns: true

includes({ a: 1, b: NaN }, NaN);
// Returns: true
```

## indexOf

### `indexOf(array, searchElement, fromIndex?)`

与 `Array.prototype.indexOf` 几乎相同，但可以找到 `NaN` 值。当您需要在数组中查找特定值的位置时使用此方法。

```typescript
import { indexOf } from 'es-toolkit/compat';

// 在数字数组中查找元素
const array = [1, 2, 3, 4];
indexOf(array, 3); // => 2

// 查找 NaN 值（Array.prototype.indexOf 无法找到）
const arrayWithNaN = [1, 2, NaN, 4];
indexOf(arrayWithNaN, NaN); // => 2
```

可以从特定索引开始搜索。

```typescript
import { indexOf } from 'es-toolkit/compat';

const array = [1, 2, 3, 1, 2, 3];
indexOf(array, 2, 2); // => 4（从索引 2 开始搜索）
```

`null` 或 `undefined` 会被视为空数组。

```typescript
import { indexOf } from 'es-toolkit/compat';

indexOf(null, 1); // => -1
indexOf(undefined, 1); // => -1
```

## initial

### `initial(array)`

返回一个新数组，其中包含数组或类数组对象中除最后一个元素外的所有元素。如果数组为空或只有一个元素，则返回空数组。

```typescript
import { initial } from 'es-toolkit/compat';

// 从数字数组中排除最后一个元素
const numbers = [1, 2, 3, 4];
const result = initial(numbers);
// result 为 [1, 2, 3]

// 从字符串数组中排除最后一个元素
const strings = ['a', 'b', 'c', 'd'];
const withoutLast = initial(strings);
// withoutLast 为 ['a', 'b', 'c']

// 类数组对象
const arrayLike = { 0: 'x', 1: 'y', 2: 'z', length: 3 };
const items = initial(arrayLike);
// items 为 ['x', 'y']
```

空数组或无效输入返回空数组。

```typescript
import { initial } from 'es-toolkit/compat';

const emptyArray: number[] = [];
const result = initial(emptyArray);
// result 为 []

const singleItem = [42];
const onlyOne = initial(singleItem);
// onlyOne 为 []

initial(null); // []
initial(undefined); // []
```

## intersection

### `intersection(...arrays)`

查找在所有数组中都存在的元素，并将它们作为新数组返回。结果已去重并保持第一个数组的顺序。

```typescript
import { intersection } from 'es-toolkit/compat';

// 两个数组的交集
const array1 = [1, 2, 3, 4];
const array2 = [2, 3, 5, 6];
const result = intersection(array1, array2);
// result 为 [2, 3]

// 三个数组的交集
const array3 = [3, 4, 7, 8];
const multiResult = intersection(array1, array2, array3);
// multiResult 为 [3]

// 字符串数组
const strings1 = ['a', 'b', 'c'];
const strings2 = ['b', 'c', 'd'];
const stringResult = intersection(strings1, strings2);
// stringResult 为 ['b', 'c']

// 类数组对象
const arrayLike1 = { 0: 1, 1: 2, 2: 3, length: 3 };
const arrayLike2 = { 0: 2, 1: 3, 2: 4, length: 3 };
const likeResult = intersection(arrayLike1, arrayLike2);
// likeResult 为 [2, 3]
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { intersection } from 'es-toolkit/compat';

const array1 = [1, 2, 3];
const result1 = intersection(array1, null);
// result1 为 []

const result2 = intersection(null, undefined);
// result2 为 []
```

重复元素会从结果中删除。

```typescript
import { intersection } from 'es-toolkit/compat';

const array1 = [1, 1, 2, 3];
const array2 = [1, 2, 2, 4];
const result = intersection(array1, array2);
// result 为 [1, 2]（已去重）
```

## intersectionBy

### `intersectionBy(...arrays, iteratee)`

根据给定条件函数转换后的值，查找多个数组的交集。条件可以以各种形式提供，如函数、属性名、部分对象等。

```typescript
import { intersectionBy } from 'es-toolkit/compat';

// 按函数查找交集
const array1 = [2.1, 1.2];
const array2 = [2.3, 3.4];
const result = intersectionBy(array1, array2, Math.floor);
// result 为 [2.1]（基于 Math.floor，2 是共同的）

// 按属性查找交集
const users1 = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
];
const users2 = [
  { id: 2, name: 'jane' },
  { id: 3, name: 'bob' },
];
const byId = intersectionBy(users1, users2, 'id');
// byId 为 [{ id: 2, name: 'jane' }]

// 三个数组的交集
const array3 = [2.5, 4.1];
const multiResult = intersectionBy(array1, array2, array3, Math.floor);
// multiResult 为 [2.1]

// 类数组对象
const arrayLike1 = { 0: { x: 1 }, 1: { x: 2 }, length: 2 };
const arrayLike2 = { 0: { x: 2 }, 1: { x: 3 }, length: 2 };
const byProperty = intersectionBy(arrayLike1, arrayLike2, 'x');
// byProperty 为 [{ x: 2 }]
```

`null` 或 `undefined` 数组被视为空数组。

```typescript
import { intersectionBy } from 'es-toolkit/compat';

const array1 = [{ x: 1 }, { x: 2 }];
const result = intersectionBy(array1, null, 'x');
// result 为 []
```

也可以使用部分对象或属性-值对指定条件。

```typescript
import { intersectionBy } from 'es-toolkit/compat';

const products1 = [
  { category: 'fruit', name: 'apple' },
  { category: 'vegetable', name: 'carrot' },
];
const products2 = [
  { category: 'fruit', name: 'banana' },
  { category: 'meat', name: 'beef' },
];

// 使用部分对象指定条件
const byCategory = intersectionBy(products1, products2, { category: 'fruit' });
// 使用属性-值对指定条件
const byCategoryPair = intersectionBy(products1, products2, ['category', 'fruit']);
```

## intersectionWith

### `intersectionWith(array, ...otherArrays, comparator)`

使用自定义比较函数查找第一个数组与其余数组的交集。比较函数确定元素是否相等，只返回在所有数组中找到的元素。

```typescript
import { intersectionWith } from 'es-toolkit/compat';

const objects = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
];
const others = [
  { id: 1, name: 'john' },
  { id: 3, name: 'joe' },
];

intersectionWith(objects, others, (a, b) => a.id === b.id);
// => [{ id: 1, name: 'john' }]

// 您可以与多个数组进行比较
const array1 = [{ x: 1 }, { x: 2 }];
const array2 = [{ x: 1 }, { x: 3 }];
const array3 = [{ x: 1 }, { x: 4 }];

intersectionWith(array1, array2, array3, (a, b) => a.x === b.x);
// => [{ x: 1 }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { intersectionWith } from 'es-toolkit/compat';

intersectionWith(null, [1, 2], (a, b) => a === b); // []
intersectionWith([1, 2], undefined, (a, b) => a === b); // []
```

## invokeMap

### `invokeMap(collection, method, ...args)`

在数组或对象的每个元素上调用指定的方法。可以将方法名作为字符串传递,也可以直接传递函数。额外的参数会传递给每次方法调用。

```typescript
import { invokeMap } from 'es-toolkit/compat';

// 在数组的每个元素上调用方法
invokeMap(
  [
    [5, 1, 7],
    [3, 2, 1],
  ],
  'sort'
);
// => [[5, 1, 7].sort(), [3, 2, 1].sort()]
// => [[1, 5, 7], [1, 2, 3]]

// 使用参数调用方法
invokeMap([123, 456], 'toString', 2);
// => [(123).toString(2), (456).toString(2)]
// => ['1111011', '111001000']

// 直接传递函数
invokeMap(['a', 'b', 'c'], String.prototype.toUpperCase);
// => [String.prototype.toUpperCase('a'), String.prototype.toUpperCase('b'), String.prototype.toUpperCase('c')]
// => ['A', 'B', 'C']
```

对于对象,在每个值上调用方法。

```typescript
import { invokeMap } from 'es-toolkit/compat';

const obj = { a: 1.1, b: 2.2, c: 3.3 };
invokeMap(obj, 'toFixed', 1);
// => ['1.1', '2.2', '3.3']
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { invokeMap } from 'es-toolkit/compat';

invokeMap(null, 'toString'); // []
invokeMap(undefined, 'toString'); // []
```

## join

### `join(array, separator?)`

使用 `join` 将数组的所有元素组合成一个字符串。它使用分隔符连接每个元素。

```typescript
import { join } from 'es-toolkit/compat';

// 连接字符串数组
const arr = ['a', 'b', 'c'];
join(arr, '~'); // => "a~b~c"

// 连接数字数组
const numbers = [1, 2, 3];
join(numbers, '-'); // => "1-2-3"
```

如果省略分隔符，默认使用逗号（`,`）。

```typescript
import { join } from 'es-toolkit/compat';

join(['a', 'b', 'c']); // => "a,b,c"
```

`null` 或 `undefined` 会被视为空数组。

```typescript
import { join } from 'es-toolkit/compat';

join(null, '-'); // => ""
join(undefined, '-'); // => ""
```

## keyBy

### `keyBy(collection, iteratee)`

使用指定的键生成函数或属性名将数组或对象的每个元素组织成对象。如果有多个元素具有相同的键,则使用最后一个元素。

```typescript
import { keyBy } from 'es-toolkit/compat';

// 通过属性名生成键
const array = [
  { dir: 'left', code: 97 },
  { dir: 'right', code: 100 },
];

keyBy(array, 'dir');
// => { left: { dir: 'left', code: 97 }, right: { dir: 'right', code: 100 } }

// 使用函数生成键
keyBy(array, o => String.fromCharCode(o.code));
// => { a: { dir: 'left', code: 97 }, d: { dir: 'right', code: 100 } }

// 也可以用于对象
const obj = {
  a: { id: 1, name: 'john' },
  b: { id: 2, name: 'jane' },
};
keyBy(obj, 'name');
// => { john: { id: 1, name: 'john' }, jane: { id: 2, name: 'jane' } }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { keyBy } from 'es-toolkit/compat';

keyBy(null, 'id'); // {}
keyBy(undefined, 'id'); // {}
```

## last

### `last(array)`

当您想获取数组的最后一个元素时使用`last`。如果数组为空，则返回`undefined`。

```typescript
import { last } from 'es-toolkit/compat';

// 数字数组的最后一个元素
last([1, 2, 3, 4, 5]);
// Returns: 5

// 字符串数组的最后一个元素
last(['a', 'b', 'c']);
// Returns: 'c'

// 对象数组的最后一个元素
const users = [{ name: 'Alice' }, { name: 'Bob' }];
last(users);
// Returns: { name: 'Bob' }
```

空数组或`null`、`undefined`返回`undefined`。

```typescript
import { last } from 'es-toolkit/compat';

// 空数组
last([]);
// Returns: undefined

// null数组
last(null);
// Returns: undefined

// undefined数组
last(undefined);
// Returns: undefined
```

也支持类数组对象。

```typescript
import { last } from 'es-toolkit/compat';

// 类数组对象
const arrayLike = { 0: 'first', 1: 'second', length: 2 };
last(arrayLike);
// Returns: 'second'

// 字符串也是类数组对象
last('hello');
// Returns: 'o'
```

## lastIndexOf

### `lastIndexOf(array, searchElement, fromIndex)`

返回数组中指定元素最后出现的索引。与原生`Array.lastIndexOf`类似，但也可以找到`NaN`值。

```typescript
import { lastIndexOf } from 'es-toolkit/compat';

// 基本用法
lastIndexOf([1, 2, 1, 2], 2);
// => 3

// 指定起始索引
lastIndexOf([1, 2, 1, 2], 2, 2);
// => 1

// 查找NaN值（原生lastIndexOf无法找到NaN）
lastIndexOf([1, 2, NaN, 4, NaN], NaN);
// => 4

// 使用负索引
lastIndexOf([1, 2, 3, 4], 3, -2);
// => 2
```

`null`或`undefined`被视为空数组。

```typescript
import { lastIndexOf } from 'es-toolkit/compat';

lastIndexOf(null, 1); // -1
lastIndexOf(undefined, 1); // -1
```

## map

### `map(collection, iteratee)`

当您想要转换数组、对象或类数组对象的每个元素时使用`map`。它对每个元素执行迭代函数，并将结果作为新数组返回。

```typescript
import { map } from 'es-toolkit/compat';

// 将数组的每个元素加倍
map([1, 2, 3], x => x * 2);
// Returns: [2, 4, 6]

// 转换对象的值
const obj = { a: 1, b: 2 };
map(obj, (value, key) => `${key}:${value}`);
// Returns: ['a:1', 'b:2']

// 提取属性
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
];
map(users, 'name');
// Returns: ['John', 'Jane']
```

`null`或`undefined`被视为空数组。

```typescript
import { map } from 'es-toolkit/compat';

map(null, x => x); // []
map(undefined, x => x); // []
```

通过将属性路径指定为字符串，还可以提取嵌套属性。

```typescript
import { map } from 'es-toolkit/compat';

const users = [{ info: { name: 'John' } }, { info: { name: 'Jane' } }];
map(users, 'info.name');
// Returns: ['John', 'Jane']
```

传递对象时，会检查每个元素是否与该对象匹配。

```typescript
import { map } from 'es-toolkit/compat';

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
];
map(users, { age: 30 });
// Returns: [true, false]
```

## nth

### `nth(array, index)`

返回数组指定索引处的元素。如果索引为负数,则从数组末尾开始计算。如果索引超出范围,则返回 `undefined`。

```typescript
import { nth } from 'es-toolkit/compat';

const array = [1, 2, 3, 4, 5];

// 正索引
nth(array, 1);
// => 2

// 负索引 (从末尾开始)
nth(array, -1);
// => 5

nth(array, -2);
// => 4

// 超出范围的索引
nth(array, 10);
// => undefined

nth(array, -10);
// => undefined
```

`null` 或 `undefined` 被视为 `undefined`。

```typescript
import { nth } from 'es-toolkit/compat';

nth(null, 0); // undefined
nth(undefined, 0); // undefined
```

## orderBy

### `orderBy(collection, criteria, orders)`

根据指定的条件和排序顺序对数组或对象的元素进行排序。您可以使用多个条件,并为每个条件指定升序 (`'asc'`) 或降序 (`'desc'`) 排序。

```typescript
import { orderBy } from 'es-toolkit/compat';

const users = [
  { name: 'fred', age: 48 },
  { name: 'barney', age: 34 },
  { name: 'fred', age: 40 },
  { name: 'barney', age: 36 },
];

// 按名称升序、年龄降序排序
orderBy(users, ['name', 'age'], ['asc', 'desc']);
// => [
//   { name: 'barney', age: 36 },
//   { name: 'barney', age: 34 },
//   { name: 'fred', age: 48 },
//   { name: 'fred', age: 40 }
// ]

// 使用函数指定排序条件
orderBy(users, [user => user.name, user => user.age], ['asc', 'desc']);
// => 与上面相同的结果

// 按单个条件排序
orderBy(users, 'age', 'desc');
// => [{ name: 'fred', age: 48 }, { name: 'fred', age: 40 }, ...]
```

对于对象,对值进行排序。

```typescript
import { orderBy } from 'es-toolkit/compat';

const obj = {
  a: { name: 'fred', age: 48 },
  b: { name: 'barney', age: 34 },
};

orderBy(obj, 'age', 'desc');
// => [{ name: 'fred', age: 48 }, { name: 'barney', age: 34 }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { orderBy } from 'es-toolkit/compat';

orderBy(null, 'name'); // []
orderBy(undefined, 'age'); // []
```

## partition

### `partition(collection, predicate)`

根据给定的条件函数将数组或对象的元素分成两组。第一组包含条件为真的元素,第二组包含条件为假的元素。

```typescript
import { partition } from 'es-toolkit/compat';

// 将数字数组分成偶数和奇数
partition([1, 2, 3, 4, 5, 6], n => n % 2 === 0);
// => [[2, 4, 6], [1, 3, 5]]

// 使用属性名称指定条件
const users = [
  { name: 'john', active: true },
  { name: 'jane', active: false },
  { name: 'bob', active: true },
];

partition(users, 'active');
// => [
//   [{ name: 'john', active: true }, { name: 'bob', active: true }],
//   [{ name: 'jane', active: false }]
// ]

// 使用对象条件过滤
partition(users, { active: true });
// => [
//   [{ name: 'john', active: true }, { name: 'bob', active: true }],
//   [{ name: 'jane', active: false }]
// ]

// 使用数组条件过滤
partition(users, ['name', 'john']);
// => [
//   [{ name: 'john', active: true }],
//   [{ name: 'jane', active: false }, { name: 'bob', active: true }]
// ]
```

对于对象,分割值。

```typescript
import { partition } from 'es-toolkit/compat';

const obj = {
  a: { score: 90 },
  b: { score: 40 },
  c: { score: 80 },
};

partition(obj, item => item.score >= 80);
// => [[{ score: 90 }, { score: 80 }], [{ score: 40 }]]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { partition } from 'es-toolkit/compat';

partition(null, x => x > 0); // [[], []]
partition(undefined, 'active'); // [[], []]
```

## pull

### `pull(array, ...valuesToRemove)`

从数组中删除所有指定的值并修改原始数组。通过直接修改原始数组而不是复制它可以节省内存。

```typescript
import { pull } from 'es-toolkit/compat';

// 从数字数组中删除特定值
const numbers = [1, 2, 3, 2, 4, 2, 5];
pull(numbers, 2, 3);
console.log(numbers); // [1, 4, 5]

// 从字符串数组中删除特定值
const fruits = ['apple', 'banana', 'apple', 'cherry'];
pull(fruits, 'apple');
console.log(fruits); // ['banana', 'cherry']
```

## pullAll

### `pullAll(array, valuesToRemove)`

从数组中删除 `valuesToRemove` 数组中包含的所有值并修改原始数组。类似于 `pull` 函数,但将要删除的值作为数组接收。

```typescript
import { pullAll } from 'es-toolkit/compat';

// 从数字数组中删除特定值
const numbers = [1, 2, 3, 2, 4, 2, 5];
pullAll(numbers, [2, 3]);
console.log(numbers); // [1, 4, 5]

// 从字符串数组中删除特定值
const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana'];
pullAll(fruits, ['apple', 'banana']);
console.log(fruits); // ['cherry']
```

如果传入空数组、`null` 或 `undefined`,则不会删除任何内容。

```typescript
import { pullAll } from 'es-toolkit/compat';

const numbers = [1, 2, 3];
pullAll(numbers, []);
console.log(numbers); // [1, 2, 3]

pullAll(numbers, null);
console.log(numbers); // [1, 2, 3]
```

## pullAllBy

### `pullAllBy(array, values, iteratee)`

根据通过提供的iteratee函数转换后的值从数组中删除指定的值。原始数组会被修改,并返回修改后的数组。

```typescript
import { pullAllBy } from 'es-toolkit/compat';

// 通过比较属性值来删除
const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];
pullAllBy(array, [{ x: 1 }, { x: 3 }], 'x');
console.log(array); // [{ x: 2 }]

// 通过函数转换值来比较
const numbers = [1, 2, 3, 4, 5];
pullAllBy(numbers, [2, 4], n => n % 2);
console.log(numbers); // [1, 3, 5] (只剩奇数)
```

如果数组为空、`null` 或 `undefined`,则原样返回原始数组。

```typescript
import { pullAllBy } from 'es-toolkit/compat';

pullAllBy([], [1, 2], x => x); // []
pullAllBy(null as any, [1, 2], x => x); // null
```

## pullAllWith

### `pullAllWith(array, values, comparator)`

使用提供的比较函数从数组中删除指定的值。原始数组会被修改，并返回修改后的数组。

```typescript
import { pullAllWith } from 'es-toolkit/compat';

// 通过对象比较删除
const array = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
];
pullAllWith(array, [{ x: 3, y: 4 }], (a, b) => a.x === b.x && a.y === b.y);
console.log(array); // [{ x: 1, y: 2 }, { x: 5, y: 6 }]

// 通过字符串长度比较删除
const words = ['hello', 'world', 'test', 'code'];
pullAllWith(words, ['hi'], (a, b) => a.length === b.length);
console.log(words); // ['hello', 'world', 'code'] ('test' 因与 'hi' 长度相同而被删除)
```

如果数组为空或为 `null`、`undefined`，则按原样返回原始数组。

```typescript
import { pullAllWith } from 'es-toolkit/compat';

pullAllWith([], [1], (a, b) => a === b); // []
pullAllWith(null as any, [1], (a, b) => a === b); // null
```

## pullAt

### `pullAt(array, ...indexes)`

从数组中删除指定索引处的元素并返回已删除元素的数组。原始数组会被修改。

```typescript
import { pullAt } from 'es-toolkit/compat';

// 通过单个索引删除
const array = [1, 2, 3, 4, 5];
const removed = pullAt(array, 1, 3);
console.log(array); // [1, 3, 5]
console.log(removed); // [2, 4]

// 通过索引数组删除
const colors = ['red', 'green', 'blue', 'yellow'];
const removedColors = pullAt(colors, [0, 2]);
console.log(colors); // ['green', 'yellow']
console.log(removedColors); // ['red', 'blue']
```

不存在的索引被视为 `undefined`。

```typescript
import { pullAt } from 'es-toolkit/compat';

const numbers = [10, 20, 30];
const removed = pullAt(numbers, 1, 5);
console.log(numbers); // [10, 30]
console.log(removed); // [20, undefined]
```

## reduce

### `reduce(collection, iteratee, initialValue)`

遍历数组或对象的所有元素以计算累积值。如果提供初始值,则从该值开始;否则从第一个元素开始。

```typescript
import { reduce } from 'es-toolkit/compat';

// 计算数组总和
const numbers = [1, 2, 3, 4];
const sum = reduce(numbers, (acc, value) => acc + value, 0);
console.log(sum); // 10

// 计算对象值的总和
const scores = { math: 95, english: 87, science: 92 };
const totalScore = reduce(scores, (acc, value) => acc + value, 0);
console.log(totalScore); // 274
```

如果不提供初始值,第一个元素将成为初始值,并从第二个元素开始迭代。

```typescript
import { reduce } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4];
const sum = reduce(numbers, (acc, value) => acc + value);
console.log(sum); // 10 (1 + 2 + 3 + 4)

// 空数组返回 undefined
const empty = [];
const result = reduce(empty, (acc, value) => acc + value);
console.log(result); // undefined
```

## reduceRight

### `reduceRight(collection, iteratee, initialValue)`

从右到左遍历数组或对象的所有元素以计算累积值。如果提供初始值,则从该值开始;否则从最后一个元素开始。

```typescript
import { reduceRight } from 'es-toolkit/compat';

// 将数组连接成字符串(从右侧)
const letters = ['a', 'b', 'c', 'd'];
const result = reduceRight(letters, (acc, value) => acc + value, '');
console.log(result); // 'dcba'

// 对象值的乘法(键顺序的逆序)
const numbers = { x: 2, y: 3, z: 4 };
const product = reduceRight(numbers, (acc, value) => acc * value, 1);
console.log(product); // 24 (1 * 4 * 3 * 2)
```

如果不提供初始值,最后一个元素将成为初始值,并从倒数第二个元素开始迭代。

```typescript
import { reduceRight } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4];
const sum = reduceRight(numbers, (acc, value) => acc + value);
console.log(sum); // 10 (4 + 3 + 2 + 1)

// 空数组返回 undefined
const empty = [];
const result = reduceRight(empty, (acc, value) => acc + value);
console.log(result); // undefined
```

## reject

### `reject(collection, predicate)`

从数组、对象或字符串中选出不符合给定条件的元素，并返回一个新数组。执行与 `filter` 相反的操作。

```typescript
import { reject } from 'es-toolkit/compat';

// 过滤出不是偶数的数字
reject([1, 2, 3, 4, 5], n => n % 2 === 0);
// => [1, 3, 5]

// 过滤出不具有特定属性的对象
reject([{ a: 1 }, { a: 2 }, { b: 1 }], 'a');
// => [{ b: 1 }]

// 过滤出不具有特定属性值的对象
reject([{ a: 1 }, { a: 2 }, { a: 3 }], { a: 2 });
// => [{ a: 1 }, { a: 3 }]

// 从字符串中过滤出不是特定字符的字符
reject('abc', char => char === 'b');
// => ['a', 'c']
```

此函数支持多种形式的 predicate。

```typescript
import { reject } from 'es-toolkit/compat';

// 使用函数条件
reject(users, user => user.age < 18);

// 对象的部分匹配
reject(users, { active: false });

// 属性-值数组
reject(users, ['status', 'pending']);

// 通过属性名检查 truthy 值
reject(users, 'premium');
```

## remove

### `remove(array, predicate)`

遍历数组并从原始数组中删除满足给定条件的元素,将删除的元素作为新数组返回。请注意,原始数组会被直接修改。

```typescript
import { remove } from 'es-toolkit/compat';

// 使用函数条件删除
const numbers = [1, 2, 3, 4, 5];
const evens = remove(numbers, n => n % 2 === 0);
console.log(numbers); // => [1, 3, 5]
console.log(evens); // => [2, 4]

// 使用部分对象匹配删除
const objects = [{ a: 1 }, { a: 2 }, { a: 3 }];
const removed = remove(objects, { a: 1 });
console.log(objects); // => [{ a: 2 }, { a: 3 }]
console.log(removed); // => [{ a: 1 }]

// 使用属性-值对删除
const items = [{ name: 'apple' }, { name: 'banana' }, { name: 'cherry' }];
const cherries = remove(items, ['name', 'cherry']);
console.log(items); // => [{ name: 'apple' }, { name: 'banana' }]
console.log(cherries); // => [{ name: 'cherry' }]
```

此函数支持各种形式的谓词。

```typescript
import { remove } from 'es-toolkit/compat';

// 使用函数条件
remove(users, user => user.active === false);

// 部分对象匹配
remove(users, { status: 'inactive' });

// 属性-值数组
remove(users, ['type', 'guest']);

// 按属性名检查真值
remove(users, 'isDeleted');
```

## reverse

### `reverse(array)`

反转数组的顺序，使第一个元素成为最后一个，最后一个元素成为第一个。它直接修改原始数组并返回修改后的数组。

```typescript
import { reverse } from 'es-toolkit/compat';

// 反转数字数组
const numbers = [1, 2, 3, 4, 5];
const reversed = reverse(numbers);
console.log(numbers); // => [5, 4, 3, 2, 1]
console.log(reversed); // => [5, 4, 3, 2, 1]

// 反转字符串数组
const words = ['apple', 'banana', 'cherry'];
reverse(words);
console.log(words); // => ['cherry', 'banana', 'apple']

// 空数组或 null/undefined 原样返回
reverse([]); // => []
reverse(null); // => null
reverse(undefined); // => undefined
```

请注意，此函数会直接修改原始数组。

```typescript
import { reverse } from 'es-toolkit/compat';

const original = [1, 2, 3];
const result = reverse(original);

console.log(original === result); // => true（同一个数组对象）
console.log(original); // => [3, 2, 1]（原数组被修改）
```

## sample

### `sample(collection)`

当需要从数组或对象中选择一个随机元素时，使用 `sample`。对于数组，返回一个随机元素，对于对象，返回一个随机值。

```typescript
import { sample } from 'es-toolkit/compat';

// 从数组中获取随机元素
sample([1, 2, 3, 4, 5]);
// 返回1到5之间的随机数字

// 从对象中获取随机值
sample({ a: 1, b: 2, c: 3 });
// 返回1、2、3中的随机值

// 也可以处理字符串
sample('hello');
// 返回 'h'、'e'、'l'、'l'、'o' 中的随机字符
```

`null` 或 `undefined` 返回 `undefined`。

```typescript
import { sample } from 'es-toolkit/compat';

sample(null); // undefined
sample(undefined); // undefined
```

## sampleSize

### `sampleSize(collection, size?)`

当需要从数组或对象中随机选择元素时，使用 `sampleSize`。它使用 Floyd 算法进行高效的无重复采样。

```typescript
import { sampleSize } from 'es-toolkit/compat';

// 从数组中随机选择3个元素。
sampleSize([1, 2, 3, 4, 5], 3);
// 返回值：[2, 4, 5]（实际结果可能不同）

// 从对象中随机选择2个值。
sampleSize({ a: 1, b: 2, c: 3, d: 4 }, 2);
// 返回值：[2, 4]（实际结果可能不同）
```

`null` 或 `undefined` 作为空数组处理。

```typescript
import { sampleSize } from 'es-toolkit/compat';

sampleSize(null, 2);
// 返回值：[]

sampleSize(undefined, 2);
// 返回值：[]
```

## shuffle

### `shuffle(collection)`

使用 Fisher-Yates 算法随机打乱数组或对象的元素并返回新数组。不会修改原数组。

```typescript
import { shuffle } from 'es-toolkit/compat';

// 打乱数字数组
const numbers = [1, 2, 3, 4, 5];
const shuffled1 = shuffle(numbers);
// 返回值：例如 [3, 1, 5, 2, 4]（每次顺序不同）

// 打乱字符串数组
const fruits = ['apple', 'banana', 'cherry', 'date'];
const shuffled2 = shuffle(fruits);
// 返回值：例如 ['cherry', 'apple', 'date', 'banana']

// 打乱对象的值
const obj = { a: 1, b: 2, c: 3, d: 4 };
const shuffled3 = shuffle(obj);
// 返回值：例如 [3, 1, 4, 2]（对象值被随机打乱）
```

`null` 或 `undefined` 作为空数组处理。

```typescript
import { shuffle } from 'es-toolkit/compat';

shuffle(null);
// 返回值：[]

shuffle(undefined);
// 返回值：[]
```

## size

### `size(collection)`

当需要检查数组、字符串、对象、Map、Set 的大小时，使用 `size`。它为各种类型的集合提供一致的大小信息。

```typescript
import { size } from 'es-toolkit/compat';

// 数组的元素个数
size([1, 2, 3]);
// 返回 3

// 字符串的字符个数
size('hello');
// 返回 5

// 对象的可枚举属性个数
size({ a: 1, b: 2, c: 3 });
// 返回 3

// Map 的元素个数
size(
  new Map([
    ['a', 1],
    ['b', 2],
  ])
);
// 返回 2

// Set 的元素个数
size(new Set([1, 2, 3]));
// 返回 3
```

`null` 或 `undefined` 返回 0。

```typescript
import { size } from 'es-toolkit/compat';

size(null); // 0
size(undefined); // 0
size({}); // 0
size([]); // 0
```

## slice

### `slice(array, start, end)`

当只需要数组的特定部分时，使用 `slice`。它创建一个新数组，包含从开始位置到结束位置之前的元素。

```typescript
import { slice } from 'es-toolkit/compat';

// 从索引1到2进行切割
slice([1, 2, 3, 4], 1, 3);
// 返回值：[2, 3]

// 使用负索引
slice([1, 2, 3, 4], -2);
// 返回值：[3, 4]

// 仅指定开始位置
slice([1, 2, 3, 4], 2);
// 返回值：[3, 4]
```

`null` 或 `undefined` 作为空数组处理。

```typescript
import { slice } from 'es-toolkit/compat';

slice(null); // []
slice(undefined); // []
```

处理稀疏数组时，空槽会用 `undefined` 填充。

```typescript
import { slice } from 'es-toolkit/compat';

const sparse = new Array(3);
sparse[1] = 'b';
slice(sparse);
// 返回值：[undefined, 'b', undefined]
```

使用负索引会从数组末尾开始计算。

```typescript
import { slice } from 'es-toolkit/compat';

slice([1, 2, 3, 4, 5], -3, -1);
// 返回值：[3, 4]
```

## some

### `some(collection, predicate)`

当您想检查数组或对象中是否至少有一个元素满足条件时，请使用 `some`。它支持各种形式的条件。

```typescript
import { some } from 'es-toolkit/compat';

// 在数组上使用条件函数
some([1, 2, 3, 4], n => n % 2 === 0);
// 返回 true（2 和 4 是偶数）

// 在数组上使用部分对象匹配
some([{ a: 1 }, { a: 2 }, { a: 3 }], { a: 2 });
// 返回 true

// 在数组上使用属性-值对匹配
some([{ a: 1 }, { a: 2 }, { a: 3 }], ['a', 2]);
// 返回 true

// 在数组上检查属性是否为真
some([{ a: 0 }, { a: 1 }, { a: 0 }], 'a');
// 返回 true（存在 a=1 的元素）

// 在对象上使用条件函数
some({ a: 1, b: 2, c: 3 }, n => n % 2 === 0);
// 返回 true（2 是偶数）
```

如果未提供条件，则检查是否有任何值为真的元素。

```typescript
import { some } from 'es-toolkit/compat';

some([0, 1, 2]); // true（1 和 2 为真）
some([false, null, undefined]); // false（所有值都为假）
some(null); // false（被视为空数组）
```

## sortBy

### `sortBy(collection, ...iteratees)`

使用 `sortBy` 来使用多个条件按升序对数组或对象进行排序。它对每个元素执行排序条件函数,并根据结果值进行排序。

```typescript
import { sortBy } from 'es-toolkit/compat';

// 按名称对用户进行排序。
const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

sortBy(users, ['user']);
// Returns: [
//   { user: 'barney', age: 34 },
//   { user: 'barney', age: 36 },
//   { user: 'fred', age: 48 },
//   { user: 'fred', age: 40 },
// ]

// 使用函数进行排序。
sortBy(users, [
  function (o) {
    return o.user;
  },
]);
// Returns: [
//   { user: 'barney', age: 34 },
//   { user: 'barney', age: 36 },
//   { user: 'fred', age: 48 },
//   { user: 'fred', age: 40 },
// ]
```

您也可以同时使用多个条件。

```typescript
import { sortBy } from 'es-toolkit/compat';

const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

// 首先按名称排序,然后按年龄排序。
sortBy(users, ['user', item => item.age]);
// Returns: [
//   { user: 'barney', age: 34 },
//   { user: 'barney', age: 36 },
//   { user: 'fred', age: 40 },
//   { user: 'fred', age: 48 },
// ]
```

`null` 和 `undefined` 被视为空数组。

```typescript
import { sortBy } from 'es-toolkit/compat';

sortBy(null, ['key']); // []
sortBy(undefined, ['key']); // []
```

## sortedIndex

### `sortedIndex(array, value)`

在已排序数组中查找插入值的位置时，请使用 `sortedIndex`。它使用二分查找快速找到位置。

```typescript
import { sortedIndex } from 'es-toolkit/compat';

// 在数字数组中查找插入位置
sortedIndex([30, 50], 40);
// 返回 1（40位于30和50之间）

// 在字符串数组中查找插入位置
sortedIndex(['a', 'c'], 'b');
// 返回 1（'b'位于'a'和'c'之间）

// 当存在相同值时，返回第一个位置
sortedIndex([1, 2, 2, 3], 2);
// 返回 1（第一个2的位置）
```

对于 `null` 或 `undefined` 数组，返回 0。

```typescript
import { sortedIndex } from 'es-toolkit/compat';

sortedIndex(null, 1); // 0
sortedIndex(undefined, 1); // 0
```

## sortedIndexBy

### `sortedIndexBy(array, value, iteratee)`

在应用转换函数后查找值在已排序数组中的插入位置时，请使用 `sortedIndexBy`。它对每个元素和值应用转换函数进行比较。

```typescript
import { sortedIndexBy } from 'es-toolkit/compat';

// 在按属性排序的对象数组中查找插入位置
const objects = [{ x: 4 }, { x: 5 }];
sortedIndexBy(objects, { x: 4 }, 'x');
// 返回 0

// 使用函数进行转换
const numbers = [10, 20, 30];
sortedIndexBy(numbers, 25, n => n);
// 返回 2

// 使用属性值数组进行转换
const users = [{ name: 'alice' }, { name: 'bob' }];
sortedIndexBy(users, { name: 'bob' }, ['name', 'bob']);
// 返回 1 (等价于向 [false, true] 中插入 true)
```

对于 `null` 或 `undefined` 数组，返回 0。

```typescript
import { sortedIndexBy } from 'es-toolkit/compat';

sortedIndexBy(null, { x: 1 }, 'x'); // 0
sortedIndexBy(undefined, { x: 1 }, 'x'); // 0
```

## sortedIndexOf

### `sortedIndexOf(array, value)`

在已排序数组中查找特定值首次出现的索引时，请使用 `sortedIndexOf`。它使用二分查找快速找到值。

```typescript
import { sortedIndexOf } from 'es-toolkit/compat';

// 在数字数组中查找值
sortedIndexOf([11, 22, 33, 44, 55], 33);
// 返回 2

// 当值不存在时
sortedIndexOf([11, 22, 33, 44, 55], 30);
// 返回 -1

// 当存在重复值时，返回第一个索引
sortedIndexOf([1, 2, 2, 3, 3, 3, 4], 3);
// 返回 3（第一个3的位置）

// 0和-0被视为相等
sortedIndexOf([-0, 0], 0);
// 返回 0
```

空数组、`null` 或 `undefined` 返回 -1。

```typescript
import { sortedIndexOf } from 'es-toolkit/compat';

sortedIndexOf([], 1); // -1
sortedIndexOf(null, 1); // -1
sortedIndexOf(undefined, 1); // -1
```

## sortedLastIndex

### `sortedLastIndex(array, value)`

在已排序数组中查找插入值的最高位置时，请使用 `sortedLastIndex`。当存在重复值时，它返回最后位置之后的索引。

```typescript
import { sortedLastIndex } from 'es-toolkit/compat';

// 在具有重复值的数组中查找最后插入位置
sortedLastIndex([4, 5, 5, 5, 6], 5);
// 返回 4（最后一个5之后的位置）

// 查找新值的插入位置
sortedLastIndex([10, 20, 30], 25);
// 返回 2（25位于30之前）

// 当值不存在时
sortedLastIndex([1, 2, 3], 0);
// 返回 0（位于最前面）
```

对于 `null` 或 `undefined` 数组，返回 0。

```typescript
import { sortedLastIndex } from 'es-toolkit/compat';

sortedLastIndex(null, 1); // 0
sortedLastIndex(undefined, 1); // 0
```

## sortedLastIndexBy

### `sortedLastIndexBy(array, value, iteratee)`

在应用转换函数后查找值在已排序数组中的最高插入位置时，请使用 `sortedLastIndexBy`。当存在重复值时，它返回最后值之后的索引。

```typescript
import { sortedLastIndexBy } from 'es-toolkit/compat';

// 在按属性排序的对象数组中查找最后插入位置
const objects = [{ x: 4 }, { x: 5 }, { x: 5 }];
sortedLastIndexBy(objects, { x: 5 }, 'x');
// 返回 3（最后一个 x: 5 之后的位置）

// 使用函数进行转换
const numbers = [10, 20, 20, 30];
sortedLastIndexBy(numbers, 20, n => n);
// 返回 3
```

对于 `null` 或 `undefined` 数组，返回 0。

```typescript
import { sortedLastIndexBy } from 'es-toolkit/compat';

sortedLastIndexBy(null, { x: 1 }, 'x'); // 0
sortedLastIndexBy(undefined, { x: 1 }, 'x'); // 0
```

## sortedLastIndexOf

### `sortedLastIndexOf(array, value)`

在已排序数组中查找特定值最后一次出现的索引时，请使用 `sortedLastIndexOf`。它使用二分查找快速找到值。

```typescript
import { sortedLastIndexOf } from 'es-toolkit/compat';

// 在数字数组中查找值
sortedLastIndexOf([1, 2, 3, 4, 5], 3);
// 返回 2

// 当值不存在时
sortedLastIndexOf([1, 2, 3, 4, 5], 6);
// 返回 -1

// 当存在重复值时，返回最后一个索引
sortedLastIndexOf([1, 2, 2, 3, 3, 3, 4], 3);
// 返回 5（最后一个3的位置）

// 0和-0被视为相等
sortedLastIndexOf([-0, 0], 0);
// 返回 1
```

空数组、`null` 或 `undefined` 返回 -1。

```typescript
import { sortedLastIndexOf } from 'es-toolkit/compat';

sortedLastIndexOf([], 1); // -1
sortedLastIndexOf(null, 1); // -1
sortedLastIndexOf(undefined, 1); // -1
```

## tail

### `tail(array)`

当您想要创建一个包含输入数组中除第一个元素外所有元素的新数组时,使用 `tail`。如果输入数组为空或只有一个元素,则返回空数组。

```typescript
import { tail } from 'es-toolkit/compat';

// 从数字数组中删除第一个元素。
tail([1, 2, 3]);
// Returns: [2, 3]

// 从字符串数组中删除第一个元素。
tail(['a', 'b', 'c']);
// Returns: ['b', 'c']

// 只有一个元素的数组。
tail([1]);
// Returns: []

// 空数组。
tail([]);
// Returns: []
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { tail } from 'es-toolkit/compat';

tail(null); // []
tail(undefined); // []
```

## take

### `take(array, count)`

从数组开头获取指定数量的元素并返回一个新数组。如果 `count` 大于数组长度,则返回整个数组。

```typescript
import { take } from 'es-toolkit/compat';

// 基本用法
const numbers = [1, 2, 3, 4, 5];
const result1 = take(numbers, 3);
// Returns: [1, 2, 3]

// 请求的数量大于数组长度
const result2 = take(numbers, 10);
// Returns: [1, 2, 3, 4, 5] (整个数组)

// 请求 0 个元素
const result3 = take(numbers, 0);
// Returns: []

// 处理空数组
const result4 = take([], 3);
// Returns: []

// 处理负数
const result5 = take(numbers, -1);
// Returns: []
```

## takeRight

### `takeRight(array, count)`

当您想要从数组末尾获取指定数量的元素来创建新数组时,使用 `takeRight`。如果请求的数量大于数组长度,则返回整个数组。

```typescript
import { takeRight } from 'es-toolkit/compat';

// 从数字数组中获取末尾的 2 个元素。
takeRight([1, 2, 3, 4, 5], 2);
// Returns: [4, 5]

// 从字符串数组中获取末尾的 3 个元素。
takeRight(['a', 'b', 'c'], 2);
// Returns: ['b', 'c']

// 当请求的数量大于数组长度时
takeRight([1, 2, 3], 5);
// Returns: [1, 2, 3]

// 请求 0 个元素
takeRight([1, 2, 3], 0);
// Returns: []

// 请求负数
takeRight([1, 2, 3], -1);
// Returns: []
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { takeRight } from 'es-toolkit/compat';

takeRight(null, 2); // []
takeRight(undefined, 2); // []
```

## takeRightWhile

### `takeRightWhile(array, predicate)`

当您想要从数组末尾开始在条件满足时获取元素来创建新数组时,使用 `takeRightWhile`。当条件评估为 false 时停止。

```typescript
import { takeRightWhile } from 'es-toolkit/compat';

// 使用函数条件
const numbers = [1, 2, 3, 4, 5];
takeRightWhile(numbers, x => x > 3);
// Returns: [4, 5]

// 使用对象属性条件
const users = [
  { user: 'barney', active: true },
  { user: 'fred', active: false },
  { user: 'pebbles', active: false },
];

takeRightWhile(users, o => !o.active);
// Returns: [{ user: 'fred', active: false }, { user: 'pebbles', active: false }]

// 使用部分对象进行条件匹配
takeRightWhile(users, { active: false });
// Returns: [{ user: 'pebbles', active: false }]

// 使用属性-值数组进行条件匹配
takeRightWhile(users, ['active', false]);
// Returns: [{ user: 'fred', active: false }, { user: 'pebbles', active: false }]

// 使用属性名检查真值
const items = [{ active: false }, { active: true }, { active: true }];
takeRightWhile(items, 'active');
// Returns: [{ active: true }, { active: true }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { takeRightWhile } from 'es-toolkit/compat';

takeRightWhile(null, x => x > 0); // []
takeRightWhile(undefined, x => x > 0); // []
```

## takeWhile

### `takeWhile(array, predicate)`

当您想要从数组开头开始在条件满足时获取元素来创建新数组时,使用 `takeWhile`。当条件评估为 false 时停止。

```typescript
import { takeWhile } from 'es-toolkit/compat';

// 使用函数条件
const numbers = [1, 2, 3, 4, 5];
takeWhile(numbers, x => x < 3);
// Returns: [1, 2]

// 使用对象属性条件
const users = [
  { user: 'barney', active: false },
  { user: 'fred', active: false },
  { user: 'pebbles', active: true },
];

takeWhile(users, o => !o.active);
// Returns: [{ user: 'barney', active: false }, { user: 'fred', active: false }]

// 使用部分对象进行条件匹配
takeWhile(users, { active: false });
// Returns: [{ user: 'barney', active: false }]

// 使用属性-值数组进行条件匹配
takeWhile(users, ['active', false]);
// Returns: [{ user: 'barney', active: false }, { user: 'fred', active: false }]

// 使用属性名检查真值
const items = [{ active: true }, { active: true }, { active: false }];
takeWhile(items, 'active');
// Returns: [{ active: true }, { active: true }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { takeWhile } from 'es-toolkit/compat';

takeWhile(null, x => x > 0); // []
takeWhile(undefined, x => x > 0); // []
```

## union

### `union(...arrays)`

当您想要合并多个数组并去除重复项以创建仅包含唯一值的新数组时，请使用 `union`。保留每个值首次出现的顺序。

```typescript
import { union } from 'es-toolkit/compat';

// 合并数字数组
union([2], [1, 2]);
// 返回: [2, 1]

// 合并多个数组
union([2], [1, 2], [2, 3]);
// 返回: [2, 1, 3]

// 嵌套数组不会被展平
union([1, 3, 2], [1, [5]], [2, [4]]);
// 返回: [1, 3, 2, [5], [4]]

// 非数组值会被忽略
union([0], 3, { '0': 1 }, null, [2, 1]);
// 返回: [0, 2, 1]

// 类数组对象也会被处理
union([0], { 0: 'a', length: 1 }, [2, 1]);
// 返回: [0, 'a', 2, 1]
```

`null` 或 `undefined` 会被忽略。

```typescript
import { union } from 'es-toolkit/compat';

union([1, 2], null, undefined, [3, 4]);
// 返回: [1, 2, 3, 4]
```

## unionBy

### `unionBy(...arrays, iteratee)`

当您想要合并多个数组并根据给定的标准函数去除重复项以创建仅包含唯一值的新数组时，请使用 `unionBy`。保留每个值首次出现的顺序。

```typescript
import { unionBy } from 'es-toolkit/compat';

// 通过向下取整比较小数
unionBy([2.1], [1.2, 2.3], Math.floor);
// 返回: [2.1, 1.2]

// 通过对象属性比较
unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x');
// 返回: [{ x: 1 }, { x: 2 }]

// 使用函数比较
unionBy(
  [{ id: 1, name: 'a' }],
  [
    { id: 2, name: 'b' },
    { id: 1, name: 'c' },
  ],
  item => item.id
);
// 返回: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]

// 使用部分对象比较
unionBy([{ x: 1, y: 1 }], [{ x: 1, y: 2 }], { x: 1 });
// 返回: [{ x: 1, y: 1 }]
```

`null` 或 `undefined` 数组会被忽略。

```typescript
import { unionBy } from 'es-toolkit/compat';

unionBy([1, 2], null, undefined, [3, 4], x => x);
// 返回: [1, 2, 3, 4]
```

## unionWith

### `unionWith(...arrays, comparator)`

当您想要合并多个数组并使用自定义比较函数去除重复项以创建仅包含唯一值的新数组时,请使用 `unionWith`。保留每个值首次出现的顺序。

```typescript
import { unionWith } from 'es-toolkit/compat';

// 使用自定义比较函数
const objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
];
const others = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
];

unionWith(objects, others, (a, b) => a.x === b.x && a.y === b.y);
// 返回: [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 1 }]

// 简单的相等性比较
unionWith([1, 2], [2, 3], (a, b) => a === b);
// 返回: [1, 2, 3]

// 按字符串长度比较
unionWith(['ab', 'cd'], ['ef', 'gh', 'ab'], (a, b) => a.length === b.length);
// 返回: ['ab']
```

`null` 或 `undefined` 数组会被忽略。

```typescript
import { unionWith } from 'es-toolkit/compat';

unionWith([1, 2], null, undefined, [3, 4], (a, b) => a === b);
// 返回: [1, 2, 3, 4]
```

## uniq

### `uniq(array)`

通过从数组中去除重复项返回一个仅包含唯一元素的新数组。仅保留每个元素的第一次出现,并保留顺序。

```typescript
import { uniq } from 'es-toolkit/compat';

// 从数字数组中去除重复项
const numbers = [1, 2, 2, 3, 3, 4, 1];
const result1 = uniq(numbers);
// 返回: [1, 2, 3, 4]

// 从字符串数组中去除重复项
const strings = ['a', 'b', 'b', 'c', 'a'];
const result2 = uniq(strings);
// 返回: ['a', 'b', 'c']

// 从对象数组中去除重复项(引用值比较)
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const objects = [obj1, obj2, obj1];
const result3 = uniq(objects);
// 返回: [{ id: 1 }, { id: 2 }]
```

## uniqBy

### `uniqBy(array, iteratee)`

对数组的每个元素应用转换函数,并仅保留转换结果相同的元素中的第一个元素。这在根据对象数组中的特定属性或数字数组中的特定计算结果去除重复项时很有用。

```typescript
import { uniqBy } from 'es-toolkit/compat';

// 在数字数组中通过 Math.floor 结果去除重复项
uniqBy([2.1, 1.2, 2.3], Math.floor);
// 返回: [2.1, 1.2]

// 在对象数组中通过属性去除重复项
uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x');
// 返回: [{ x: 1 }, { x: 2 }]

// 使用函数去除重复项
uniqBy([{ name: 'John' }, { name: 'Jane' }, { name: 'John' }], obj => obj.name);
// 返回: [{ name: 'John' }, { name: 'Jane' }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { uniqBy } from 'es-toolkit/compat';

uniqBy(null, Math.floor); // []
uniqBy(undefined, 'x'); // []
```

## uniqWith

### `uniqWith(array, comparator)`

使用比较函数比较数组的每个元素来去除重复项。当比较函数返回 `true` 时,两个元素被视为相等,仅保留第一次出现的元素。如果未提供比较函数,默认使用浅相等性比较。

```typescript
import { uniqWith } from 'es-toolkit/compat';

// 不使用比较函数(浅相等性比较)
uniqWith([1, 2, 2, 3]);
// 返回: [1, 2, 3]

// 使用自定义比较函数根据奇偶性标准去除重复项
uniqWith([1, 2, 3, 4], (a, b) => a % 2 === b % 2);
// 返回: [1, 2]

// 在对象数组中根据属性去除重复项
const objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
];
uniqWith(objects, (a, b) => a.x === b.x && a.y === b.y);
// 返回: [{ x: 1, y: 2 }, { x: 2, y: 1 }]
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { uniqWith } from 'es-toolkit/compat';

uniqWith(null); // []
uniqWith(undefined); // []
```

## unzip

### `unzip(array)`

收集嵌套数组中相同索引处的元素并将它们作为新数组返回。执行与 `zip` 函数相反的操作。这在转置矩阵或重组结构化数据时很有用。

```typescript
import { unzip } from 'es-toolkit/compat';

// 解压混合字符串、布尔值和数字的数组
const zipped = [
  ['a', true, 1],
  ['b', false, 2],
];
const result = unzip(zipped);
// 返回: [['a', 'b'], [true, false], [1, 2]]

// 解压数字数组
const numbers = [
  [1, 4],
  [2, 5],
  [3, 6],
];
unzip(numbers);
// 返回: [[1, 2, 3], [4, 5, 6]]

// 处理不同长度的数组
const uneven = [
  ['a', 1],
  ['b', 2, true],
];
unzip(uneven);
// 返回: [['a', 'b'], [1, 2], [undefined, true]]
```

`null`、`undefined` 或空数组被视为空数组。

```typescript
import { unzip } from 'es-toolkit/compat';

unzip(null); // []
unzip(undefined); // []
unzip([]); // []
```

## unzipWith

### `unzipWith(array, iteratee)`

收集嵌套数组中相同索引处的元素并应用转换函数。类似于 `unzip` 函数,但可以对每个组应用转换函数。如果未提供转换函数,则执行默认的 `unzip` 操作。

```typescript
import { unzipWith } from 'es-toolkit/compat';

// 将相同位置的元素相加
unzipWith(
  [
    [1, 10, 100],
    [2, 20, 200],
  ],
  (a, b) => a + b
);
// 返回: [3, 30, 300]

// 不使用转换函数(默认 unzip 操作)
unzipWith([
  [1, 4],
  [2, 5],
  [3, 6],
]);
// 返回: [[1, 2, 3], [4, 5, 6]]

// 字符串连接
unzipWith(
  [
    ['a', 'x'],
    ['b', 'y'],
    ['c', 'z'],
  ],
  (a, b) => a + b
);
// 返回: ['abc', 'xyz']

// 查找最大值
unzipWith(
  [
    [1, 10],
    [2, 20],
    [3, 5],
  ],
  Math.max
);
// 返回: [3, 20]
```

`null`、`undefined` 或空数组被视为空数组。

```typescript
import { unzipWith } from 'es-toolkit/compat';

unzipWith(null, (a, b) => a + b); // []
unzipWith(undefined, (a, b) => a + b); // []
unzipWith([], (a, b) => a + b); // []
```

## without

### `without(array, ...values)`

返回一个从数组中删除指定值的新数组。原始数组不会被修改。

```typescript
import { without } from 'es-toolkit/compat';

// 从数字数组中删除多个值
const numbers = [1, 2, 3, 4, 5, 2, 4];
const result1 = without(numbers, 2, 4);
// 返回: [1, 3, 5]

// 从字符串数组中删除值
const fruits = ['apple', 'banana', 'cherry', 'banana'];
const result2 = without(fruits, 'banana');
// 返回: ['apple', 'cherry']

// 处理空数组
const result3 = without([], 1, 2, 3);
// 返回: []
```

## xor

### `xor(...arrays)`

计算多个数组的对称差集。换句话说,返回恰好存在于给定数组中的一个数组中的元素。这在比较两个或多个数组时查找不重叠的唯一元素时很有用。

```typescript
import { xor } from 'es-toolkit/compat';

// 两个数组的对称差集
xor([1, 2, 3, 4], [3, 4, 5, 6]);
// 返回: [1, 2, 5, 6]

// 三个数组的对称差集
xor([1, 2], [2, 3], [4, 5]);
// 返回: [1, 3, 4, 5]

// 字符串数组
xor(['a', 'b'], ['b', 'c']);
// 返回: ['a', 'c']

// 仅提供一个数组
xor([1, 2, 3]);
// 返回: [1, 2, 3]
```

`null`、`undefined` 或空数组被忽略,只处理有效数组。

```typescript
import { xor } from 'es-toolkit/compat';

xor([1, 2], null, [2, 3]);
// 返回: [1, 3]

xor([], [1, 2], [2, 3]);
// 返回: [1, 3]
```

## xorBy

### `xorBy(...arrays, iteratee)`

根据转换函数计算多个数组的对称差集。返回其转换结果恰好存在于数组中的一个数组中的元素。这在根据对象数组中的特定属性或数字数组中的特定计算结果进行比较时很有用。

```typescript
import { xorBy } from 'es-toolkit/compat';

// 通过 Math.floor 结果计算对称差集
xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
// 返回: [1.2, 4.3]

// 通过对象属性计算对称差集
xorBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x');
// 返回: [{ x: 2 }]

// 使用函数计算对称差集
const users1 = [{ name: 'John', age: 30 }];
const users2 = [
  { name: 'Jane', age: 25 },
  { name: 'John', age: 30 },
];
xorBy(users1, users2, user => user.name);
// 返回: [{ name: 'Jane', age: 25 }]

// 三个数组的对称差集
xorBy([1.2, 2.3], [3.4, 4.5], [5.6, 6.7], Math.floor);
// 返回: [1.2, 2.3, 3.4, 4.5, 5.6, 6.7]
```

`null` 或 `undefined` 被忽略。

```typescript
import { xorBy } from 'es-toolkit/compat';

xorBy([2.1, 1.2], null, [4.3, 2.4], Math.floor);
// 返回: [1.2, 4.3]
```

## xorWith

### `xorWith(...arrays, comparator)`

使用比较函数计算多个数组的对称差集。当比较函数返回 `true` 时,两个元素被视为相等,并返回恰好存在于数组中的一个数组中的元素。这在处理复杂对象或需要自定义比较逻辑时很有用。

```typescript
import { xorWith } from 'es-toolkit/compat';

// 简单数字比较
xorWith([1, 2], [2, 3], (a, b) => a === b);
// 返回: [1, 3]

// 比较对象属性
const objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
];
const others = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
];
xorWith(objects, others, (a, b) => a.x === b.x && a.y === b.y);
// 返回: [{ x: 2, y: 1 }, { x: 1, y: 1 }]

// 三个数组的对称差集
xorWith([1], [2], [3], (a, b) => a === b);
// 返回: [1, 2, 3]

// 按字符串长度比较
xorWith(['hello'], ['world', 'hi'], (a, b) => a.length === b.length);
// 返回: ['hi']
```

如果未提供比较函数,默认使用浅相等性比较。

```typescript
import { xorWith } from 'es-toolkit/compat';

xorWith([1, 2], [2, 3]);
// 返回: [1, 3]
```

## zip

### `zip(...arrs)`

接受多个数组并将每个索引处的元素分组为一个元组来创建一个新数组。如果输入数组的长度不同,结果数组的长度将与最长输入数组的长度相匹配,缺失的元素用 `undefined` 填充。

```typescript
import { zip } from 'es-toolkit/compat';

const arr1 = [1, 2, 3];
const arr2 = ['a', 'b', 'c'];
const result = zip(arr1, arr2);
// 返回: [[1, 'a'], [2, 'b'], [3, 'c']]

// 不同长度的数组
const arr3 = [true, false];
const result2 = zip(arr1, arr2, arr3);
// 返回: [[1, 'a', true], [2, 'b', false], [3, 'c', undefined]]

// 包含空数组
zip([1, 2], [], ['a', 'b']);
// 返回: [[1, undefined, 'a'], [2, undefined, 'b']]
```

## zipObject

### `zipObject(keys, values)`

当您想要从键数组和值数组创建单个对象时,请使用 `zipObject`。它使用第一个数组的元素作为属性名称,第二个数组的元素作为其相应的值。这在处理 API 响应或转换数据时特别有用。

```typescript
import { zipObject } from 'es-toolkit/compat';

// 基本用法
const keys = ['a', 'b', 'c'];
const values = [1, 2, 3];
const result = zipObject(keys, values);
// 返回: { a: 1, b: 2, c: 3 }

// 不同长度的数组
const keys2 = ['x', 'y', 'z'];
const values2 = [10, 20];
const result2 = zipObject(keys2, values2);
// 返回: { x: 10, y: 20, z: undefined }

// 提供空数组
const result3 = zipObject([], []);
// 返回: {}
```

## zipObjectDeep

### `zipObjectDeep(keys, values)`

使用第一个数组的路径和第二个数组的值创建一个深层嵌套的对象。路径可以作为点符号字符串或属性名称数组提供。这在生成复杂的嵌套数据结构或将平面键值对转换为分层对象时很有用。

```typescript
import { zipObjectDeep } from 'es-toolkit/compat';

// 将路径指定为点符号字符串
const paths = ['a.b.c', 'd.e.f'];
const values = [1, 2];
const result = zipObjectDeep(paths, values);
// 返回: { a: { b: { c: 1 } }, d: { e: { f: 2 } } }

// 将路径指定为数组
const pathArrays = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
];
const values2 = [1, 2];
const result2 = zipObjectDeep(pathArrays, values2);
// 返回: { a: { b: { c: 1 } }, d: { e: { f: 2 } } }

// 包含数组索引的路径
const arrayPaths = ['a.b[0].c', 'a.b[1].d'];
const values3 = [1, 2];
const result3 = zipObjectDeep(arrayPaths, values3);
// 返回: { a: { b: [{ c: 1 }, { d: 2 }] } }
```

`null` 或 `undefined` 键数组被视为空对象。

```typescript
import { zipObjectDeep } from 'es-toolkit/compat';

zipObjectDeep(null, [1, 2]); // {}
zipObjectDeep(undefined, [1, 2]); // {}
```

## zipWith

### `zipWith(...arrs, iteratee)`

接受多个数组并使用提供的函数组合每个索引处的元素来创建一个新数组。如果数组的长度不同,它将处理到最长数组的长度,对于缺失的值传递 `undefined`。

```typescript
import { zipWith } from 'es-toolkit/compat';

// 将两个数组的元素相加
const result1 = zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b);
// 返回: [5, 7, 9]

// 组合三个数组的元素
const result2 = zipWith([1, 2], [3, 4], [5, 6], (a, b, c) => a + b + c);
// 返回: [9, 12]

// 不同长度的数组
const result3 = zipWith([1, 2, 3], [4, 5], (a, b) => (a || 0) + (b || 0));
// 返回: [5, 7, 3]
```

## after

### `after(n, func)`

当您想限制函数仅在被调用特定次数后才执行时,请使用 `after`。它在多个异步操作完成后执行回调,或在初始化阶段后激活函数时非常有用。

```typescript
import { after } from 'es-toolkit/compat';

// 基本用法
const logAfterThree = after(3, () => {
  console.log('从第3次调用开始执行!');
});

logAfterThree(); // 不执行
logAfterThree(); // 不执行
logAfterThree(); // 输出 "从第3次调用开始执行!"
logAfterThree(); // 输出 "从第3次调用开始执行!" (继续执行)
```

您还可以使用它在所有异步操作完成后执行特定回调。

```typescript
import { after } from 'es-toolkit/compat';

const tasks = ['task1', 'task2', 'task3'];
const allTasksComplete = after(tasks.length, () => {
  console.log('所有任务已完成!');
});

// 每个任务完成时调用
tasks.forEach(task => {
  performAsyncTask(task, () => {
    console.log(`${task} 完成`);
    allTasksComplete(); // 第3次调用时输出 "所有任务已完成!"
  });
});
```

当传递0或负数时,从第一次调用开始立即执行。

```typescript
import { after } from 'es-toolkit/compat';

const immediate = after(0, () => console.log('立即执行'));
immediate(); // "立即执行"

const negative = after(-1, () => console.log('立即执行'));
negative(); // "立即执行"
```

## ary

### `ary(func, n)`

当您想限制函数接收的参数数量时,请使用 `ary`。它在安全地使用接收太多参数的函数或在回调函数中忽略不必要的参数时非常有用。

```typescript
import { ary } from 'es-toolkit/compat';

// 基本用法
function greet(name, age, city) {
  return `你好, ${name}! ${age}岁, 来自${city}。`;
}

const limitedGreet = ary(greet, 2);
console.log(limitedGreet('张三', 30, '北京', '额外参数'));
// "你好, 张三! 30岁, 来自undefined。"
// 第3个参数之后被忽略
```

与数组方法一起使用时,可以防止不必要的参数传递给回调函数。

```typescript
import { ary } from 'es-toolkit/compat';

// parseInt接受第二个参数(基数),但map的回调传递3个参数
const numbers = ['1', '2', '3', '4', '5'];

// 错误用法 - parseInt将索引作为基数接收
console.log(numbers.map(parseInt)); // [1, NaN, NaN, NaN, NaN]

// 使用ary只传递第一个参数
console.log(numbers.map(ary(parseInt, 1))); // [1, 2, 3, 4, 5]
```

可以限制函数只接收所需数量的参数。

```typescript
import { ary } from 'es-toolkit/compat';

function sum(...args) {
  return args.reduce((total, num) => total + num, 0);
}

const sum0 = ary(sum, 0);
const sum1 = ary(sum, 1);
const sum2 = ary(sum, 2);
const sum3 = ary(sum, 3);

console.log(sum0(1, 2, 3, 4, 5)); // 0 (无参数)
console.log(sum1(1, 2, 3, 4, 5)); // 1 (仅第一个参数)
console.log(sum2(1, 2, 3, 4, 5)); // 3 (仅前两个参数)
console.log(sum3(1, 2, 3, 4, 5)); // 6 (仅前三个参数)
```

当传递负数或 `NaN` 时,会被视为0,所有参数都被忽略。

```typescript
import { ary } from 'es-toolkit/compat';

const func = (a, b, c) => [a, b, c];

console.log(ary(func, -1)(1, 2, 3)); // [] (负数视为0)
console.log(ary(func, NaN)(1, 2, 3)); // [] (NaN视为0)
```

## attempt

### `attempt(func, ...args)`

当您想安全地执行函数时使用 `attempt`。在执行可能抛出错误的函数时，它很有用，可以防止程序崩溃并将错误作为返回值处理。

```typescript
import { attempt } from 'es-toolkit/compat';

// 基本用法 - 成功的情况
const result = attempt((x, y) => x + y, 2, 3);
console.log(result); // 5

// 错误情况
const errorResult = attempt(() => {
  throw new Error('出错了');
});
console.log(errorResult); // Error: 出错了
```

以下是与使用 try-catch 块的区别。

```typescript
// 使用 attempt
import { attempt } from 'es-toolkit/compat';

const result = attempt(riskyFunction, arg1, arg2);
if (result instanceof Error) {
  console.log('发生错误:', result.message);
} else {
  console.log('结果:', result);
}

// 使用 try-catch (更直接)
try {
  const result = riskyFunction(arg1, arg2);
  console.log('结果:', result);
} catch (error) {
  console.log('发生错误:', error.message);
}
```

## before

### `before(n, func)`

当您想要限制函数只执行到特定次数时，请使用 `before`。这对于限制函数调用次数或只在初始设置阶段执行函数时非常有用。

```typescript
import { before } from 'es-toolkit/compat';

// 基本用法
let count = 0;
const beforeThree = before(3, () => ++count);

console.log(beforeThree()); // 1 (第一次调用)
console.log(beforeThree()); // 2 (第二次调用)
console.log(beforeThree()); // 2 (从第三次调用开始返回最后结果)
console.log(beforeThree()); // 2 (继续返回最后结果)
```

使用闭包的替代方案：

```typescript
// 使用 before
const beforeThree = before(3, myFunction);

// 使用闭包（更简单更快）
function createBefore(limit, callback) {
  let callCount = 0;
  let lastResult;

  return function (...args) {
    if (callCount < limit - 1) {
      lastResult = callback.apply(this, args);
      callCount++;
    }
    return lastResult;
  };
}

const beforeThreeAlternative = createBefore(3, myFunction);
```

用作初始化函数：

```typescript
import { before } from 'es-toolkit/compat';

class Database {
  constructor() {
    this.isInitialized = false;

    // 初始化只执行一次
    this.initialize = before(2, () => {
      console.log('正在初始化数据库...');
      this.setupConnection();
      this.isInitialized = true;
      return '初始化完成';
    });
  }

  setupConnection() {
    // 实际连接设置逻辑
  }

  query(sql) {
    const initResult = this.initialize();
    console.log(initResult); // 第一次调用: "初始化完成"，之后：相同结果

    // 查询执行逻辑
    return `执行查询: ${sql}`;
  }
}

const db = new Database();
db.query('SELECT * FROM users'); // 执行初始化
db.query('SELECT * FROM products'); // 不执行初始化
```

限制 API 调用：

```typescript
import { before } from 'es-toolkit/compat';

// 最多允许 5 次 API 调用
const limitedApiCall = before(6, endpoint => {
  console.log(`API 调用: ${endpoint}`);
  return fetch(endpoint).then(res => res.json());
});

// 前 5 次执行实际的 API 调用
limitedApiCall('/api/data1'); // 实际调用
limitedApiCall('/api/data2'); // 实际调用
limitedApiCall('/api/data3'); // 实际调用
limitedApiCall('/api/data4'); // 实际调用
limitedApiCall('/api/data5'); // 实际调用
limitedApiCall('/api/data6'); // 返回最后结果（不进行 API 调用）
```

限制事件监听器：

```typescript
import { before } from 'es-toolkit/compat';

// 最多处理 3 次点击事件
const limitedClickHandler = before(4, event => {
  console.log('处理点击:', event.target.id);
  return `处理完成: ${Date.now()}`;
});

document.getElementById('button').addEventListener('click', limitedClickHandler);
// 只处理前 3 次点击，之后返回最后结果
```

处理参数和返回值：

```typescript
import { before } from 'es-toolkit/compat';

const limitedCalculator = before(3, (operation, a, b) => {
  const result = operation === 'add' ? a + b : a - b;
  console.log(`计算: ${a} ${operation} ${b} = ${result}`);
  return result;
});

console.log(limitedCalculator('add', 5, 3)); // "计算: 5 add 3 = 8"，返回: 8
console.log(limitedCalculator('subtract', 10, 4)); // "计算: 10 subtract 4 = 6"，返回: 6
console.log(limitedCalculator('multiply', 7, 2)); // 不计算，返回: 6（最后结果）
```

传递 0 或 1 会使函数不执行：

```typescript
import { before } from 'es-toolkit/compat';

const neverCalled = before(0, () => {
  console.log('此函数不会执行');
  return '结果';
});

const onceOnly = before(1, () => {
  console.log('此函数也不会执行');
  return '结果';
});

console.log(neverCalled()); // undefined
console.log(onceOnly()); // undefined
```

资源清理优化：

```typescript
import { before } from 'es-toolkit/compat';

// 函数引用会自动清理以防止内存泄漏
const limitedProcessor = before(2, data => {
  // 复杂的数据处理
  return processComplexData(data);
});

// 第 2 次调用后，原始函数引用被移除（垃圾回收）
```

## bind

### `bind(func, thisObj, ...partialArgs)`

当您想要固定函数的 `this` 上下文或预先提供部分参数时，使用 `bind`。当您想使用占位符在特定位置稍后提供参数时特别有用。

```typescript
import { bind } from 'es-toolkit/compat';

// 基本用法
function greet(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
}

const object = { user: '张三' };
const boundGreet = bind(greet, object, '你好');

console.log(boundGreet('!')); // "你好 张三!"
console.log(boundGreet('~')); // "你好 张三~"
```

与原生 bind 比较:

```typescript
// 使用 bind
import { bind } from 'es-toolkit/compat';

const boundFn1 = bind(func, thisObj, 'arg1');

// 使用原生 bind（更快）
const boundFn2 = func.bind(thisObj, 'arg1');

// 结果相同但原生更快
```

使用占位符功能:

```typescript
import { bind } from 'es-toolkit/compat';

function calculate(operation, a, b, suffix) {
  return `${a} ${operation} ${b} = ${operation === '+' ? a + b : a - b}${suffix}`;
}

// 使用占位符稍后在特定位置提供参数
const calcWithSuffix = bind(
  calculate,
  null,
  bind.placeholder, // operation 稍后提供
  bind.placeholder, // a 稍后提供
  bind.placeholder, // b 稍后提供
  '分' // suffix 预先提供
);

console.log(calcWithSuffix('+', 5, 3)); // "5 + 3 = 8分"
console.log(calcWithSuffix('-', 10, 4)); // "10 - 4 = 6分"
```

更实用的占位符示例:

```typescript
import { bind } from 'es-toolkit/compat';

function apiRequest(method, url, options, callback) {
  // API 请求逻辑
  console.log(`${method} ${url}`, options);
  callback(`${method} 请求完成`);
}

// 为 POST 请求创建部分应用函数
const postRequest = bind(
  apiRequest,
  null,
  'POST', // 固定 method
  bind.placeholder, // url 稍后提供
  { 'Content-Type': 'application/json' }, // 固定 options
  bind.placeholder // callback 稍后提供
);

postRequest('/api/users', result => {
  console.log(result); // "POST 请求完成"
});

postRequest('/api/products', result => {
  console.log(result); // "POST 请求完成"
});
```

方法绑定:

```typescript
import { bind } from 'es-toolkit/compat';

class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }

  log(level, message) {
    console.log(`[${this.prefix}] ${level}: ${message}`);
  }
}

const logger = new Logger('MyApp');

// 绑定方法以在不同上下文中使用
const logError = bind(logger.log, logger, 'ERROR');
const logInfo = bind(logger.log, logger, 'INFO');

// 现在可以独立使用
setTimeout(() => logError('服务器连接失败'), 1000);
setTimeout(() => logInfo('应用程序已启动'), 2000);
```

在事件处理器中使用:

```typescript
import { bind } from 'es-toolkit/compat';

class ButtonHandler {
  constructor(name) {
    this.name = name;
    this.clickCount = 0;
  }

  handleClick(event, customData) {
    this.clickCount++;
    console.log(`${this.name} 按钮点击 #${this.clickCount}`);
    console.log('自定义数据:', customData);
    console.log('事件类型:', event.type);
  }
}

const handler = new ButtonHandler('菜单');

// 预先提供自定义数据，稍后传递事件
const boundHandler = bind(
  handler.handleClick,
  handler,
  bind.placeholder, // event 稍后传入
  '菜单已选择' // customData 预先提供
);

// 连接到 DOM 事件（event 自动作为第一个参数传递）
document.getElementById('menu-btn')?.addEventListener('click', boundHandler);
```

也支持构造函数:

```typescript
import { bind } from 'es-toolkit/compat';

function Person(name, age, city) {
  this.name = name;
  this.age = age;
  this.city = city || '首尔';
}

// 创建首尔居民的构造函数
const SeoulPerson = bind(Person, null, bind.placeholder, bind.placeholder, '首尔');

const person1 = new SeoulPerson('张三', 30);
const person2 = new SeoulPerson('李四', 25);

console.log(person1); // Person { name: '张三', age: 30, city: '首尔' }
console.log(person2); // Person { name: '李四', age: 25, city: '首尔' }
```

在函数式编程中使用:

```typescript
import { bind } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4, 5];

// 将 parseInt 基数固定为 10
const parseDecimal = bind(parseInt, null, bind.placeholder, 10);

// 在 map 中安全使用
const parsed = ['1', '2', '3'].map(parseDecimal);
console.log(parsed); // [1, 2, 3]

// 使用普通 parseInt 时的问题
const problematic = ['1', '2', '3'].map(parseInt); // [1, NaN, NaN]
```

## bindKey

### `bindKey(object, key, ...partialArgs)`

当您想绑定对象的方法，同时允许该方法在以后被更改时，请使用 `bindKey`。与普通的 `bind` 不同，它每次调用时都会引用最新的方法。

```typescript
import { bindKey } from 'es-toolkit/compat';

const object = {
  user: 'fred',
  greet: function (greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  },
};

// 绑定方法。
let bound = bindKey(object, 'greet', 'hi');
bound('!');
// 返回: 'hi fred!'

// 重新定义方法。
object.greet = function (greeting, punctuation) {
  return greeting + 'ya ' + this.user + punctuation;
};

// 绑定的函数调用新方法。
bound('!');
// 返回: 'hiya fred!'
```

您可以使用占位符来保留参数位置。

```typescript
import { bindKey } from 'es-toolkit/compat';

const object = {
  user: 'fred',
  greet: function (greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  },
};

// 使用占位符。
const bound = bindKey(object, 'greet', bindKey.placeholder, '!');
bound('hi');
// 返回: 'hi fred!'
```

部分应用的参数会首先传递，然后是调用时提供的参数。

```typescript
import { bindKey } from 'es-toolkit/compat';

const object = {
  add: function (a, b, c) {
    return a + b + c;
  },
};

// 预先设置第一个参数。
const bound = bindKey(object, 'add', 10);
bound(20, 30);
// 返回: 60 (10 + 20 + 30)
```

## curry

### `curry(func, arity)`

当您想要对函数进行柯里化以便更容易地进行部分应用时，使用 `curry`。它对于逐步提供参数或使用占位符稍后在特定位置提供参数非常有用。

```typescript
import { curry } from 'es-toolkit/compat';

// 基本用法
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

// 可以用各种方式调用
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
```

与主库 curry 的比较:

```typescript
// compat 版本 (灵活，但较慢)
import { curry } from 'es-toolkit/compat';
const curriedCompat = curry(add);
curriedCompat(1, 2)(3); // 支持
curriedCompat(1)(curry.placeholder, 3)(2); // 支持占位符

// 主库版本 (更快，但只能一次一个)
import { curry } from 'es-toolkit';
const curriedMain = curry(add);
curriedMain(1)(2)(3); // 支持
curriedMain(1, 2)(3); // 不支持
```

使用占位符功能:

```typescript
import { curry } from 'es-toolkit/compat';

function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const curriedGreet = curry(greet);

// 使用占位符跳过中间参数
const greetWithExclamation = curriedGreet(curry.placeholder, curry.placeholder, '!');
console.log(greetWithExclamation('Hello', 'John')); // "Hello, John!"

const sayHello = curriedGreet('Hello');
console.log(sayHello(curry.placeholder, '~')('Jane')); // "Hello, Jane~"
```

在函数式编程中使用:

```typescript
import { curry } from 'es-toolkit/compat';

// 创建映射函数
const map = curry((fn, array) => array.map(fn));
const filter = curry((predicate, array) => array.filter(predicate));

const numbers = [1, 2, 3, 4, 5];

// 创建可重用的函数
const double = x => x * 2;
const isEven = x => x % 2 === 0;

const mapDouble = map(double);
const filterEven = filter(isEven);

console.log(mapDouble(numbers)); // [2, 4, 6, 8, 10]
console.log(filterEven(numbers)); // [2, 4]

// 函数组合
const processNumbers = nums => mapDouble(filterEven(nums));
console.log(processNumbers(numbers)); // [4, 8]
```

配置 API 客户端:

```typescript
import { curry } from 'es-toolkit/compat';

function apiRequest(method, baseUrl, endpoint, options) {
  return fetch(`${baseUrl}${endpoint}`, {
    method,
    ...options,
  });
}

const curriedApiRequest = curry(apiRequest);

// 使用默认设置创建专用函数
const apiGet = curriedApiRequest('GET', 'https://api.example.com');
const apiPost = curriedApiRequest('POST', 'https://api.example.com');

// 包含认证标头
const authenticatedPost = apiPost(curry.placeholder, {
  headers: { Authorization: 'Bearer token123' },
});

// 使用
apiGet('/users'); // GET https://api.example.com/users
authenticatedPost('/users'); // POST with auth headers
```

数学运算函数:

```typescript
import { curry } from 'es-toolkit/compat';

const calculate = curry((operation, a, b) => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      throw new Error('不支持的操作');
  }
});

// 专用操作函数
const add = calculate('+');
const subtract = calculate('-');
const multiply = calculate('*');

console.log(add(5, 3)); // 8
console.log(subtract(10)(4)); // 6
console.log(multiply(3, 4)); // 12

// 使用占位符固定第二个操作数
const addFive = calculate('+', curry.placeholder, 5);
console.log(addFive(10)); // 15
```

指定参数个数:

```typescript
import { curry } from 'es-toolkit/compat';

function variableArgsFunction(a, b, c, ...rest) {
  return [a, b, c, rest];
}

// 将参数个数限制为 3
const curriedFixed = curry(variableArgsFunction, 3);

console.log(curriedFixed(1)(2)(3)); // [1, 2, 3, []]
console.log(curriedFixed(1, 2)(3)); // [1, 2, 3, []]

// 不指定参数个数使用 (默认值: function.length)
const curriedDefault = curry(variableArgsFunction); // arity = 3
```

简单的柯里化替代方案:

```typescript
// 使用 curry
const curriedAdd = curry((a, b, c) => a + b + c);

// 手动闭包 (更快)
const manualCurry = a => b => c => a + b + c;

// 两者产生相同的结果
console.log(curriedAdd(1)(2)(3)); // 6
console.log(manualCurry(1)(2)(3)); // 6
```

也支持构造函数:

```typescript
import { curry } from 'es-toolkit/compat';

function Person(name, age, city) {
  this.name = name;
  this.age = age;
  this.city = city;
}

const CurriedPerson = curry(Person);
const SeoulPerson = CurriedPerson(curry.placeholder, curry.placeholder, 'Seoul');

const person1 = new SeoulPerson('John', 30);
const person2 = new SeoulPerson('Jane', 25);

console.log(person1.city); // "Seoul"
console.log(person2.city); // "Seoul"
```

## curryRight

### `curryRight(func, arity)`

当您想要从右到左柯里化一个函数并从最后一个参数开始部分应用参数时,请使用 `curryRight`。与常规的 `curry` 不同,它首先从最后一个参数开始处理。

```typescript
import { curryRight } from 'es-toolkit/compat';

// 基本用法
function subtract(a, b, c) {
  return a - b - c;
}

const curriedSubtract = curryRight(subtract);

// 从右开始柯里化(从最后一个参数开始)
console.log(curriedSubtract(1)(2)(5)); // 5 - 2 - 1 = 2
console.log(curriedSubtract(1, 2)(5)); // 5 - 2 - 1 = 2
console.log(curriedSubtract(1)(2, 5)); // 2 - 5 - 1 = -4
console.log(curriedSubtract(1, 2, 5)); // 1 - 2 - 5 = -6
```

`curry` 和 `curryRight` 的区别:

```typescript
import { curry, curryRight } from 'es-toolkit/compat';

function divide(a, b, c) {
  return a / b / c;
}

// 常规 curry(从左开始)
const leftCurried = curry(divide);
console.log(leftCurried(12)(3)(2)); // ((12 / 3) / 2) = 2

// curryRight(从右开始)
const rightCurried = curryRight(divide);
console.log(rightCurried(2)(3)(12)); // ((12 / 3) / 2) = 2
// 最后提供的 12 成为第一个参数(a)
```

与主库的比较:

```typescript
// compat 版本(灵活,但较慢)
import { curryRight } from 'es-toolkit/compat';
const curriedCompat = curryRight(subtract);
curriedCompat(1, 2)(3); // 支持
curriedCompat(1)(curryRight.placeholder, 3)(2); // 支持占位符

// 主库版本(更快,但一次只能一个)
import { curryRight } from 'es-toolkit';
const curriedMain = curryRight(subtract);
curriedMain(1)(2)(3); // 支持
curriedMain(1, 2)(3); // 不支持
```

使用占位符功能:

```typescript
import { curryRight } from 'es-toolkit/compat';

function formatMessage(name, action, time) {
  return `${name} 在 ${time} ${action}了`;
}

const curriedFormat = curryRight(formatMessage);

// 使用占位符跳过特定位置
const todayAction = curriedFormat('今天');
const todayLoginAction = todayAction(curryRight.placeholder, '登录');

console.log(todayLoginAction('张三'));
// "张三 在 今天 登录了"

// 首先固定时间
const morningFormat = curriedFormat('早上9点');
console.log(morningFormat('评论', '李四'));
// "李四 在 早上9点 评论了"
```

在数组处理中使用:

```typescript
import { curryRight } from 'es-toolkit/compat';

// 从数组末尾获取特定数量的项
function takeFromEnd(array, count, separator = ', ') {
  return array.slice(-count).join(separator);
}

const curriedTake = curryRight(takeFromEnd);

// 创建用逗号分隔的函数
const takeWithComma = curriedTake(', ');

// 获取最后3项
const takeLast3 = takeWithComma(3);

const fruits = ['苹果', '香蕉', '橙子', '葡萄', '猕猴桃'];
console.log(takeLast3(fruits)); // "橙子, 葡萄, 猕猴桃"

// 使用不同的分隔符
const takeWithDash = curriedTake(' - ');
console.log(takeWithDash(2, fruits)); // "葡萄 - 猕猴桃"
```

在函数组合中使用:

```typescript
import { curryRight } from 'es-toolkit/compat';

// 日志输出函数
function logWithPrefix(message, level, timestamp) {
  return `[${timestamp}] ${level}: ${message}`;
}

const curriedLog = curryRight(logWithPrefix);

// 用当前时间固定
const currentTimeLog = curriedLog(new Date().toISOString());

// 按级别创建记录器
const errorLog = currentTimeLog('ERROR');
const infoLog = currentTimeLog('INFO');
const debugLog = currentTimeLog('DEBUG');

// 使用
console.log(errorLog('数据库连接失败'));
console.log(infoLog('服务器已启动'));
console.log(debugLog('正在处理用户请求'));
```

函数式编程管道:

```typescript
import { curryRight } from 'es-toolkit/compat';

// 数据转换函数
const mapWith = curryRight((array, fn) => array.map(fn));
const filterWith = curryRight((array, predicate) => array.filter(predicate));
const reduceWith = curryRight((array, reducer, initial) => array.reduce(reducer, initial));

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 定义转换函数
const double = x => x * 2;
const isEven = x => x % 2 === 0;
const sum = (acc, val) => acc + val;

// 组合管道(右侧优先)
const processNumbers = nums => {
  return reduceWith(filterWith(mapWith(nums, double), isEven), sum, 0);
};

console.log(processNumbers(numbers)); // 所有数字翻倍,过滤偶数,然后求和
```

API 请求构建器:

```typescript
import { curryRight } from 'es-toolkit/compat';

function makeRequest(url, method, headers, body) {
  return fetch(url, { method, headers, body });
}

const curriedRequest = curryRight(makeRequest);

// 首先设置 body
const withJsonBody = curriedRequest(JSON.stringify({ data: 'test' }));

// 添加 headers
const withHeaders = withJsonBody({
  'Content-Type': 'application/json',
  Authorization: 'Bearer token123',
});

// 设置 POST 方法
const postRequest = withHeaders('POST');

// 最终使用
postRequest('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

手动柯里化替代方案:

```typescript
// 使用 curryRight
const curriedSubtract = curryRight((a, b, c) => a - b - c);

// 手动闭包(更快,从右开始)
const manualCurryRight = c => b => a => a - b - c;

// 两者结果相同
console.log(curriedSubtract(1)(2)(5)); // 2
console.log(manualCurryRight(1)(2)(5)); // 2
```

指定参数数量:

```typescript
import { curryRight } from 'es-toolkit/compat';

function variableArgsFunction(a, b, c, ...rest) {
  return { a, b, c, rest };
}

// 将参数数量限制为3(忽略 rest)
const curriedFixed = curryRight(variableArgsFunction, 3);

// 从右侧按 c, b, a 的顺序接收
console.log(curriedFixed(3)(2)(1)); // { a: 1, b: 2, c: 3, rest: [] }
```

## debounce

### `debounce(func, wait, options)`

当您想要延迟函数调用时,使用 `debounce`。它对于防止搜索输入、滚动事件、按钮点击等中的过度调用很有用。

```typescript
import { debounce } from 'es-toolkit/compat';

// 基本用法
const searchFunction = debounce(query => {
  console.log('搜索:', query);
}, 300);

// 仅当在 300ms 内未再次调用时执行
searchFunction('React'); // 不执行
searchFunction('Vue'); // 不执行
searchFunction('Angular'); // 300ms 后输出 "搜索: Angular"
```

与主库 debounce 的比较:

```typescript
// compat 版本(Lodash 兼容,包含 maxWait 等额外选项)
import { debounce } from 'es-toolkit/compat';
const debouncedCompat = debounce(func, 300, {
  leading: true,
  trailing: false,
  maxWait: 1000
});

// 主库版本(更快、更简单)
import { debounce } from 'es-toolkit';
const debouncedMain = debounce(func, 300, {
  edges: ['leading'] // 使用 edges 而不是 leading/trailing
});
```

leading 和 trailing 选项:

```typescript
import { debounce } from 'es-toolkit/compat';

const func = () => console.log('执行了');

// leading: true - 首次调用时立即执行
const leadingDebounce = debounce(func, 1000, { leading: true });
leadingDebounce(); // 立即输出 "执行了"
leadingDebounce(); // 等待 1 秒
// 1 秒后没有额外执行

// trailing: true(默认) - 最后一次调用后延迟执行
const trailingDebounce = debounce(func, 1000, { trailing: true });
trailingDebounce(); // 等待 1 秒
trailingDebounce(); // 等待 1 秒(取消之前的计时器)
// 1 秒后输出 "执行了"

// 两者都为 true - 在开始和结束时执行
const bothDebounce = debounce(func, 1000, {
  leading: true,
  trailing: true,
});
bothDebounce(); // 立即输出 "执行了"
bothDebounce(); // 等待 1 秒
// 1 秒后输出 "执行了"(trailing)
```

maxWait 选项:

```typescript
import { debounce } from 'es-toolkit/compat';

// 保证至少每 2 秒执行一次
const debouncedWithMaxWait = debounce(() => console.log('已保存'), 500, { maxWait: 2000 });

// 即使快速连续调用,也会每 2 秒执行一次
setInterval(() => {
  debouncedWithMaxWait();
}, 100); // 每 100ms 调用一次,但每 2 秒输出 "已保存"
```

实际搜索示例:

```typescript
import { debounce } from 'es-toolkit/compat';

class SearchComponent {
  constructor() {
    this.searchInput = document.getElementById('search');

    // 将用户输入防抖 300ms
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300, {
      leading: false, // 输入开始时不立即搜索
      trailing: true, // 输入停止后搜索
    });

    this.searchInput.addEventListener('input', e => {
      this.debouncedSearch(e.target.value);
    });
  }

  performSearch(query) {
    if (query.length < 2) return;

    console.log('API 调用:', query);
    // fetch(`/api/search?q=${query}`)...
  }
}
```

滚动事件优化:

```typescript
import { debounce } from 'es-toolkit/compat';

// 将滚动事件防抖 100ms,但至少每 500ms 执行一次
const optimizedScrollHandler = debounce(
  () => {
    const scrollTop = window.pageYOffset;
    console.log('滚动位置:', scrollTop);

    // 头部隐藏/显示逻辑
    if (scrollTop > 100) {
      document.header.classList.add('hidden');
    } else {
      document.header.classList.remove('hidden');
    }
  },
  100,
  { maxWait: 500 }
);

window.addEventListener('scroll', optimizedScrollHandler);
```

API 调用限制:

```typescript
import { debounce } from 'es-toolkit/compat';

class AutoSave {
  constructor() {
    // 防抖 500ms,至少每 5 秒保存一次
    this.debouncedSave = debounce(this.saveToServer.bind(this), 500, { maxWait: 5000 });
  }

  onTextChange(content) {
    this.pendingContent = content;
    this.debouncedSave();
  }

  saveToServer() {
    if (!this.pendingContent) return;

    console.log('保存到服务器:', this.pendingContent);
    // fetch('/api/save', { ... })

    this.pendingContent = null;
  }
}
```

cancel 和 flush 方法:

```typescript
import { debounce } from 'es-toolkit/compat';

const debouncedFunc = debounce(() => {
  console.log('执行了');
}, 1000);

debouncedFunc(); // 等待 1 秒

// 取消待执行的调用
debouncedFunc.cancel();

// 或立即执行
debouncedFunc(); // 开始等待 1 秒
debouncedFunc.flush(); // 立即输出 "执行了" 并取消计时器
```

防止重复按钮点击:

```typescript
import { debounce } from 'es-toolkit/compat';

const handleSubmit = debounce(
  async formData => {
    console.log('正在提交表单...');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
      console.log('提交完成');
    } catch (error) {
      console.error('提交失败:', error);
    }
  },
  1000,
  { leading: true, trailing: false } // 仅处理第一次点击
);

document.getElementById('submit-btn').addEventListener('click', e => {
  const formData = new FormData(e.target.form);
  handleSubmit(formData);
});
```

调整大小事件处理:

```typescript
import { debounce } from 'es-toolkit/compat';

const handleResize = debounce(
  () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log('窗口已调整大小:', { width, height });

    // 重新计算布局
    recalculateLayout();
  },
  250,
  { leading: false, trailing: true }
);

window.addEventListener('resize', handleResize);

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  handleResize.cancel();
});
```

## defer

### `defer(func, ...args)`

当您想在当前调用栈结束后执行函数时，请使用 `defer`。您可以将函数执行延迟到下一个事件循环，同时向函数传递额外的参数。

```typescript
import { defer } from 'es-toolkit/compat';

// 延迟控制台输出
defer(console.log, 'deferred message');
// 在当前调用栈结束后输出 'deferred message'

// 延迟执行函数和参数
const greet = (name: string, greeting: string) => {
  console.log(`${greeting}, ${name}!`);
};

defer(greet, 'John', 'Hello');
// 在当前调用栈结束后输出 'Hello, John!'
```

内部使用 `setTimeout(func, 1, ...args)` 在 1 毫秒后执行函数。

```typescript
import { defer } from 'es-toolkit/compat';

// 以下两段代码的工作方式相同
defer(console.log, 'message');
setTimeout(console.log, 1, 'message');
```

## delay

### `delay(func, wait, ...args)`

当您想要将函数执行延迟特定时间时，请使用 `delay`。它对于动画定时、延迟用户反馈或调度异步操作很有用。

```typescript
import { delay } from 'es-toolkit/compat';

// 基本用法
const timerId = delay(() => {
  console.log('1秒后执行');
}, 1000);

// 带参数使用
delay(
  (name, age) => {
    console.log(`你好，${age}岁的${name}！`);
  },
  2000,
  '张三',
  30
);
// 2秒后：打印 "你好，30岁的张三！"
```

与 `setTimeout` 比较：

```typescript
// 使用 delay
import { delay } from 'es-toolkit/compat';

const timerId1 = delay(myFunction, 1000, 'arg1', 'arg2');

// 使用 setTimeout（更快，标准）
const timerId2 = setTimeout(myFunction, 1000, 'arg1', 'arg2');

// 或使用箭头函数
const timerId3 = setTimeout(() => myFunction('arg1', 'arg2'), 1000);
```

动画序列：

```typescript
import { delay } from 'es-toolkit/compat';

class AnimationSequence {
  constructor(element) {
    this.element = element;
  }

  fadeInSequence() {
    // 立即开始
    this.element.style.opacity = '0';
    this.element.style.display = 'block';

    // 100ms 后开始淡入
    delay(() => {
      this.element.style.transition = 'opacity 500ms ease-in';
      this.element.style.opacity = '1';
    }, 100);

    // 1秒后缩放动画
    delay(() => {
      this.element.style.transform = 'scale(1.1)';
    }, 1000);

    // 1.5秒后恢复原始大小
    delay(() => {
      this.element.style.transform = 'scale(1)';
    }, 1500);
  }
}
```

取消定时器：

```typescript
import { delay } from 'es-toolkit/compat';

class TimerManager {
  constructor() {
    this.timers = new Map();
  }

  setDelayedTask(id, task, delayMs) {
    // 如果存在现有定时器则取消
    this.cancelTask(id);

    const timerId = delay(task, delayMs);
    this.timers.set(id, timerId);

    return timerId;
  }

  cancelTask(id) {
    const timerId = this.timers.get(id);
    if (timerId) {
      clearTimeout(timerId);
      this.timers.delete(id);
      return true;
    }
    return false;
  }

  cancelAllTasks() {
    this.timers.forEach(timerId => clearTimeout(timerId));
    this.timers.clear();
  }
}

const timerManager = new TimerManager();

// 调度任务
timerManager.setDelayedTask(
  'save',
  () => {
    console.log('自动保存');
  },
  5000
);

timerManager.setDelayedTask(
  'cleanup',
  () => {
    console.log('清理完成');
  },
  10000
);

// 必要时取消特定任务
// timerManager.cancelTask('save');

// 页面卸载时清理所有定时器
window.addEventListener('beforeunload', () => {
  timerManager.cancelAllTasks();
});
```

## flip

### `flip(func)`

当您想要通过反转参数顺序来创建新函数时,请使用 `flip`。它将原本从第一个参数开始按顺序接收的函数改为从最后一个参数开始接收。

```typescript
import { flip } from 'es-toolkit/compat';

function greet(greeting: string, name: string) {
  return `${greeting}, ${name}!`;
}

const flipped = flip(greet);
flipped('John', 'Hello'); // 'Hello, John!'

// 原始函数按 (greeting, name) 顺序接收参数
// 但反转后的函数按 (name, greeting) 顺序接收参数
```

对于接受多个参数的函数,所有参数的顺序都会反转。

```typescript
import { flip } from 'es-toolkit/compat';

function fn(a: string, b: string, c: string, d: string) {
  return [a, b, c, d];
}

const flipped = flip(fn);
flipped('1', '2', '3', '4'); // ['4', '3', '2', '1']
```

## flow

### `flow(...functions)`

当您想要创建一个从左到右依次执行多个函数的组合函数时，请使用 `flow`。它对于创建数据转换管道很有用。

```typescript
import { flow } from 'es-toolkit/compat';

// 基本用法
function add(x, y) {
  return x + y;
}

function square(n) {
  return n * n;
}

function double(n) {
  return n * 2;
}

// 从左到右执行: double(square(add(x, y)))
const calculate = flow(add, square, double);
console.log(calculate(1, 2)); // double(square(add(1, 2))) = double(square(3)) = double(9) = 18

// 以数组形式传递函数
const calculate2 = flow([add, square], double);
console.log(calculate2(2, 3)); // 50

// 现代替代方案（推荐）
const modernCalculate = (x, y) => double(square(add(x, y)));
console.log(modernCalculate(1, 2)); // 18

// 使用管道操作符（未来的 JavaScript）
const pipeCalculate = (x, y) => add(x, y) |> square |> double;

// 或使用链式模式
class Calculator {
  constructor(value) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this;
  }

  square() {
    this.value *= this.value;
    return this;
  }

  double() {
    this.value *= 2;
    return this;
  }

  valueOf() {
    return this.value;
  }
}

const chainedResult = new Calculator(3).square().double().valueOf(); // 18
```

## flowRight

### `flowRight(...functions)`

当您想要创建一个从右到左依次执行多个函数的组合函数时，请使用 `flowRight`。它对于创建数据转换管道很有用。

```typescript
import { flowRight } from 'es-toolkit/compat';

// 基本用法
function add(x, y) {
  return x + y;
}

function square(n) {
  return n * n;
}

function double(n) {
  return n * 2;
}

// 从右到左执行: double(square(add(x, y)))
const calculate = flowRight(double, square, add);
console.log(calculate(1, 2)); // double(square(add(1, 2))) = double(square(3)) = double(9) = 18

// 以数组形式传递函数
const calculate2 = flowRight([double, square], add);
console.log(calculate2(2, 3)); // 50

// 现代替代方案（推荐）
const modernCalculate = (x, y) => double(square(add(x, y)));
console.log(modernCalculate(1, 2)); // 18

// 或使用函数链
const chainedCalculate = (x, y) => [x, y]
  .reduce((acc, val, idx) => idx === 0 ? val : acc + val)
  .valueOf()
  |> (n => n * n)
  |> (n => n * 2);
```

通常以与 `flow` 相反的顺序工作。它的工作方式类似于函数组合，因此很直观。

## identity

### `identity(value)`

当您想要原样返回接收到的值时,请使用 `identity`。它主要用作默认值或占位符函数,在函数式编程中经常使用。

```typescript
import { identity } from 'es-toolkit/compat';

// 基本用法
console.log(identity(5)); // 5
console.log(identity('hello')); // 'hello'
console.log(identity({ key: 'value' })); // { key: 'value' }

// 与数组的 map 一起使用（值复制）
const numbers = [1, 2, 3, 4, 5];
const copied = numbers.map(identity);
console.log(copied); // [1, 2, 3, 4, 5]

// 在过滤中用作默认值
const values = [1, 0, '', 'hello', null, undefined, false, true];
const filtered = values.filter(identity); // 只保留真值
console.log(filtered); // [1, 'hello', true]

// 用作默认转换函数
function processData(data, transform = identity) {
  return transform(data);
}

console.log(processData('hello')); // 'hello'
console.log(processData('hello', x => x.toUpperCase())); // 'HELLO'
```

在大多数情况下,可以用更简单的箭头函数 `x => x` 替代:

```typescript
// 使用箭头函数而不是 identity（推荐）
const copied = numbers.map(x => x);
const filtered = values.filter(x => x);
```

## memoize

### `memoize(func, resolver)`

当您想要缓存函数结果以在使用相同参数调用时重用之前的结果时，请使用 `memoize`。它对于昂贵的计算或 API 调用很有用。

```typescript
import { memoize } from 'es-toolkit/compat';

// 基本用法
function expensiveCalculation(n) {
  console.log('计算中...', n);
  return n * n;
}

const memoizedCalc = memoize(expensiveCalculation);

console.log(memoizedCalc(5)); // '计算中... 5', 25
console.log(memoizedCalc(5)); // 25 (缓存的结果，不计算)
console.log(memoizedCalc(10)); // '计算中... 10', 100

// 使用自定义解析器
function fetchUserData(userId, includeProfile) {
  console.log('获取用户数据...', userId, includeProfile);
  return { id: userId, profile: includeProfile ? '个人资料数据' : null };
}

// 生成考虑所有参数的缓存键
const memoizedFetch = memoize(fetchUserData, (userId, includeProfile) => {
  return `${userId}_${includeProfile}`;
});

memoizedFetch(1, true); // '获取用户数据... 1 true'
memoizedFetch(1, true); // 使用缓存的结果
memoizedFetch(1, false); // '获取用户数据... 1 false' (不同的缓存键)

// 访问和修改缓存
console.log(memoizedCalc.cache.get(5)); // 25
memoizedCalc.cache.set(7, 49); // 手动设置缓存
console.log(memoizedCalc(7)); // 49 (使用缓存值，不计算)
```

在大多数情况下使用基本哈希映射，但根据需要也可以使用自定义缓存实现。

## negate

### `negate(predicate)`

当您想创建一个对函数结果进行取反的新函数时,使用 `negate`。在过滤或条件语句中检查相反条件时很有用。

```typescript
import { negate } from 'es-toolkit/compat';

// 基本用法
function isEven(n) {
  return n % 2 === 0;
}

const isOdd = negate(isEven);
console.log(isOdd(3)); // true
console.log(isOdd(4)); // false

// 在数组过滤中使用
const numbers = [1, 2, 3, 4, 5, 6];
const oddNumbers = numbers.filter(negate(isEven));
console.log(oddNumbers); // [1, 3, 5]

// 现代替代方案(推荐)
const modernOddNumbers = numbers.filter(n => !isEven(n));
// 或
const isOddModern = n => !isEven(n);
const modernOddNumbers2 = numbers.filter(isOddModern);

// 复杂示例
function isEmpty(str) {
  return str.trim().length === 0;
}

const hasContent = negate(isEmpty);
const messages = ['', ' ', 'hello', '  ', 'world'];
const validMessages = messages.filter(hasContent);
console.log(validMessages); // ['hello', 'world']
```

主要用于数组过滤或条件逻辑,但在大多数情况下,直接使用逻辑非运算符更直观。

## noop

### `noop(...args)`

当您需要一个什么都不做的占位符函数时,使用 `noop`。它通常用作默认值或回调函数。

```typescript
import { noop } from 'es-toolkit/compat';

// 基本用法
noop(); // 什么都不做
noop(1, 2, 3); // 接受参数但什么都不做

// 用作默认回调
function processData(data, callback = noop) {
  // 处理数据
  console.log('处理数据中...', data);

  // 调用回调(如果未提供则为 noop)
  callback(data);
}

processData('测试'); // 即使未提供回调也能正常工作

// 现代替代方案(推荐)
function modernProcessData(data, callback = () => {}) {
  console.log('处理数据中...', data);
  callback(data);
}

// 或使用可选回调
function processDataOptional(data, callback) {
  console.log('处理数据中...', data);
  callback?.(data); // 仅在提供回调时调用
}
```

在需要默认值或占位符的情况下很有用,但在现代 JavaScript 中,使用可选链(`?.`)或默认参数更常见。

## nthArg

### `nthArg(n)`

当您只需要函数特定位置的参数时,使用 `nthArg`。如果使用负索引,则从末尾开始计数。

```typescript
import { nthArg } from 'es-toolkit/compat';

// 创建一个获取第二个参数的函数
const getSecondArg = nthArg(1);
getSecondArg('a', 'b', 'c', 'd');
// Returns: 'b'

// 创建一个获取倒数第二个参数的函数
const getPenultimateArg = nthArg(-2);
getPenultimateArg('a', 'b', 'c', 'd');
// Returns: 'c'

// 创建一个获取第一个参数的函数(默认)
const getFirstArg = nthArg();
getFirstArg('a', 'b', 'c');
// Returns: 'a'
```

与数组方法一起使用时很有用。

```typescript
import { nthArg } from 'es-toolkit/compat';

// 从每个数组中只提取第二个元素
const arrays = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
arrays.map(nthArg(1));
// Returns: [2, 5, 8]
```

负索引从末尾开始计数。

```typescript
import { nthArg } from 'es-toolkit/compat';

// 获取最后一个参数的函数
const getLastArg = nthArg(-1);
getLastArg('first', 'middle', 'last');
// Returns: 'last'
```

## once

### `once(func)`

当您想限制函数只能被调用一次时,使用 `once`。第一次调用后,结果会被缓存并返回相同的值。

```typescript
import { once } from 'es-toolkit/compat';

// 基本用法
let count = 0;
const increment = once(() => {
  count++;
  console.log('计数器递增:', count);
  return count;
});

increment(); // 输出 '计数器递增: 1',返回 1
increment(); // 不输出任何内容,返回 1
increment(); // 不输出任何内容,返回 1

// 实用示例 - 初始化函数
const initialize = once(() => {
  console.log('正在初始化应用程序...');
  // 昂贵的初始化操作
  return '初始化完成';
});

// 即使多次调用,初始化也只执行一次
initialize(); // 输出 '正在初始化应用程序...'
initialize(); // 不输出任何内容
```

在创建昂贵的初始化操作或设置函数时很有用。例如,可以用于数据库连接、API 令牌初始化等。

## overArgs

### `overArgs(func, ...transforms)`

当您想在调用函数之前转换每个参数时,使用 `overArgs`。每个参数由对应的转换函数处理。

```typescript
import { overArgs } from 'es-toolkit/compat';

function doubled(n) {
  return n * 2;
}

function square(n) {
  return n * n;
}

// 第一个参数加倍,第二个参数平方
const func = overArgs((x, y) => [x, y], [doubled, square]);
func(5, 3);
// Returns: [10, 9]
```

也可以使用字符串提取属性。

```typescript
import { overArgs } from 'es-toolkit/compat';

const user1 = { name: 'John', age: 30 };
const user2 = { name: 'Jane', age: 25 };

// 从每个对象中提取属性
const getUserInfo = overArgs((name, age) => `${name} is ${age} years old`, ['name', 'age']);
getUserInfo(user1, user2);
// Returns: "John is 25 years old"
```

如果未提供转换函数或为 `null`/`undefined`,则参数将按原样传递。

```typescript
import { overArgs } from 'es-toolkit/compat';

const func = overArgs((a, b, c) => [a, b, c], [n => n * 2, null, n => n * 3]);
func(5, 10, 15);
// Returns: [10, 10, 45]
```

超过转换函数数量的参数将按原样传递。

```typescript
import { overArgs } from 'es-toolkit/compat';

const func = overArgs((a, b, c) => [a, b, c], [n => n * 2]);
func(5, 10, 15);
// Returns: [10, 10, 15]
```

也可以检查参数是否与对象匹配。

```typescript
import { overArgs } from 'es-toolkit/compat';

const func = overArgs((match1, match2) => [match1, match2], [{ age: 30 }, { active: true }]);

func({ name: 'John', age: 30 }, { active: true, status: 'online' });
// Returns: [true, true]
```

## partial

### `partial(func, ...args)`

当您想通过预填充参数来创建部分应用的函数时,使用 `partial`。主要在参数顺序重要的函数中固定前面的参数时很有用。

```typescript
import { partial } from 'es-toolkit/compat';

// 基本用法
function greet(greeting, name, punctuation) {
  return `${greeting} ${name}${punctuation}`;
}

// 预设第一个参数
const sayHello = partial(greet, 'Hello');
sayHello('Alice', '!'); // 'Hello Alice!'

// 预设多个参数
const greetAlice = partial(greet, 'Hello', 'Alice');
greetAlice('!'); // 'Hello Alice!'

// 使用 placeholder 控制参数顺序
const greetWithExclamation = partial(greet, partial.placeholder, 'Alice', '!');
greetWithExclamation('Hi'); // 'Hi Alice!'
```

在大多数情况下可以用箭头函数替代:

```typescript
// 使用箭头函数代替 partial(推荐)
const sayHello = (name, punctuation) => greet('Hello', name, punctuation);
const greetAlice = punctuation => greet('Hello', 'Alice', punctuation);
```

## partialRight

### `partialRight(func, ...args)`

当您想通过从右侧预填充参数来创建部分应用的函数时,使用 `partialRight`。主要在参数顺序重要的函数中固定最后的参数时很有用。

```typescript
import { partialRight } from 'es-toolkit/compat';

// 基本用法
function greet(greeting, name, punctuation) {
  return `${greeting} ${name}${punctuation}`;
}

// 预设最后一个参数
const greetWithExclamation = partialRight(greet, '!');
greetWithExclamation('Hello', 'Alice'); // 'Hello Alice!'

// 预设多个参数
const sayHiToAlice = partialRight(greet, 'Alice', '!');
sayHiToAlice('Hi'); // 'Hi Alice!'

// 使用 placeholder 控制参数顺序
const greetAliceWithCustom = partialRight(greet, 'Alice', partialRight.placeholder);
greetAliceWithCustom('Hello', '?'); // 'Hello Alice?'
```

在大多数情况下可以用箭头函数替代:

```typescript
// 使用箭头函数代替 partialRight(推荐)
const greetWithExclamation = (greeting, name) => greet(greeting, name, '!');
const sayHiToAlice = greeting => greet(greeting, 'Alice', '!');
```

## rearg

### `rearg(func, ...indices)`

当您想在调用函数时更改参数顺序时,请使用 `rearg`。它会按照指定的索引顺序重新排列参数,然后调用原函数。

```typescript
import { rearg } from 'es-toolkit/compat';

const greet = (greeting, name) => `${greeting}, ${name}!`;

// 交换参数顺序(第1个,第0个)
const rearrangedGreet = rearg(greet, 1, 0);
rearrangedGreet('World', 'Hello');
// 返回值: "Hello, World!"

// 原函数保持不变
greet('Hello', 'World');
// 返回值: "Hello, World!"
```

您也可以将索引作为数组传递。

```typescript
import { rearg } from 'es-toolkit/compat';

const fn = (a, b, c) => [a, b, c];

// 使用数组指定索引
const rearranged = rearg(fn, [2, 0, 1]);
rearranged('a', 'b', 'c');
// 返回值: ['c', 'a', 'b']
```

您可以只重新排列部分参数,其余参数保持原样。

```typescript
import { rearg } from 'es-toolkit/compat';

const fn = (a, b, c, d) => [a, b, c, d];

// 只重新排列前两个参数
const rearranged = rearg(fn, 1, 0);
rearranged('first', 'second', 'third', 'fourth');
// 返回值: ['second', 'first', 'third', 'fourth']
```

不存在的索引会被处理为 `undefined`。

```typescript
import { rearg } from 'es-toolkit/compat';

const fn = (a, b, c) => [a, b, c];

// 包含不存在的索引 5
const rearranged = rearg(fn, 5, 1, 0);
rearranged('a', 'b', 'c');
// 返回值: [undefined, 'b', 'a']
```

嵌套数组也会被展平处理。

```typescript
import { rearg } from 'es-toolkit/compat';

const fn = (a, b, c, d) => [a, b, c, d];

// 嵌套数组索引
const rearranged = rearg(fn, [1, [2, 0]], 3);
rearranged('a', 'b', 'c', 'd');
// 返回值: ['b', 'c', 'a', 'd']
```

## rest

### `rest(func, start)`

当您想通过将指定索引开始的剩余参数分组到数组中来转换函数参数时,请使用 `rest`。它对于创建可变参数函数很有用。

```typescript
import { rest } from 'es-toolkit/compat';

// 基本用法 - 将最后的参数分组到数组中
function logMessage(level, message, ...details) {
  console.log(`[${level}] ${message}`, details);
}

const restLogger = rest(logMessage, 2);
restLogger('ERROR', '发生错误', '详细信息 1', '详细信息 2');
// 内部调用 logMessage('ERROR', '发生错误', [['详细信息 1', '详细信息 2']])

// 不同索引的示例
function process(action, target, ...args) {
  return { action, target, args };
}

const restProcess = rest(process, 1);
restProcess('update', 'user', 'name', 'John', 'age', 25);
// { action: 'update', target: ['user', 'name', 'John', 'age', 25], args: [] }
```

当您想将函数的最后参数作为数组接收时使用它。在现代 JavaScript 中,使用剩余参数语法(`...args`)更为常见。

## spread

### `spread(func, argsIndex)`

当您想通过将数组参数展开为单个参数来调用函数时,请使用 `spread`。您可以指定数组的位置,允许它与其他参数一起使用。

```typescript
import { spread } from 'es-toolkit/compat';

// 基本用法 - 第一个参数是数组
function add(a, b) {
  return a + b;
}

const spreadAdd = spread(add);
spreadAdd([1, 2]); // 3

// 当第二个参数是数组时
function greet(greeting, names) {
  return `${greeting}, ${names.join(' and ')}!`;
}

const spreadGreet = spread(greet, 1);
spreadGreet('Hello', ['Alice', 'Bob']); // 'Hello, Alice and Bob!'

// 现代展开运算符示例(推荐)
function modernAdd(a, b) {
  return a + b;
}

const numbers = [1, 2];
modernAdd(...numbers); // 3 - 更简单、更快
```

在将数组作为函数参数传递时特别有用,但在现代 JavaScript 中,使用展开运算符更为常见。

## throttle

### `throttle(func, wait, options)`

当您想限制函数调用在指定时间间隔内最多执行一次时,请使用 `throttle`。它对于限制事件处理程序或 API 调用的频率很有用。

```typescript
import { throttle } from 'es-toolkit/compat';

// 基本用法 - 每秒最多执行一次
const throttledLog = throttle(() => {
  console.log('事件发生!');
}, 1000);

// 使用选项的示例
const throttledScroll = throttle(handleScroll, 100, {
  leading: true, // 首次调用时立即执行
  trailing: false, // 最后一次调用后不执行
});

window.addEventListener('scroll', throttledScroll);
```

在处理快速发生的事件(如滚动或调整大小事件)时,这对于性能至关重要。

## unary

### `unary(func)`

当您想限制函数最多接受一个参数时,请使用 `unary`。传递的任何额外参数都将被忽略。

```typescript
import { unary } from 'es-toolkit/compat';

function greet(name, greeting, punctuation) {
  return `${greeting} ${name}${punctuation}`;
}

// 转换为只接受第一个参数的函数
const greetOne = unary(greet);
greetOne('Alice', 'Hello', '!'); // 与 greet('Alice') 相同

// 与数组的 map 函数一起使用时很有用
const numbers = ['1', '2', '3'];
numbers.map(parseInt); // [1, NaN, NaN] - 意外结果
numbers.map(unary(parseInt)); // [1, 2, 3] - 正确结果
```

## wrap

### `wrap(value, wrapper)`

当您想对值或函数应用额外的逻辑时,请使用 `wrap`。您可以通过包装函数定义新的行为,该函数将原始值作为第一个参数接收。

```typescript
import { wrap } from 'es-toolkit/compat';

// 包装函数以添加日志功能
const greet = (name: string) => `Hi, ${name}`;
const loggedGreet = wrap(greet, (originalFunc, name) => {
  const result = originalFunc(name);
  console.log(`[LOG] ${result}`);
  return result;
});

loggedGreet('Alice'); // 在控制台输出 "[LOG] Hi, Alice" 并返回 "Hi, Alice"
```

您也可以包装非函数值。该值将作为第一个参数传递给包装函数。

```typescript
import { wrap } from 'es-toolkit/compat';

// 创建一个将字符串包装在 HTML 标签中的函数
const htmlWrapper = wrap('Hello World', (text, tag) => `<${tag}>${text}</${tag}>`);
console.log(htmlWrapper('h1')); // "<h1>Hello World</h1>"

// 创建一个在计算中使用数字的函数
const calculate = wrap(10, (baseValue, multiplier) => baseValue * multiplier);
console.log(calculate(5)); // 50
```

这是一个更复杂的函数包装示例。

```typescript
import { wrap } from 'es-toolkit/compat';

const add = (a: number, b: number) => a + b;

// 创建一个带有性能测量的函数
const timedAdd = wrap(add, (originalAdd, a, b) => {
  const start = Date.now();
  const result = originalAdd(a, b);
  const end = Date.now();
  console.log(`执行时间: ${end - start}ms`);
  return result;
});

timedAdd(3, 7); // 在控制台输出执行时间并返回 10
```

## add

### `add(value, other)`

当您想要将两个值相加时，请使用 `add`。它不仅可以处理数字，还可以处理字符串。

```typescript
import { add } from 'es-toolkit/compat';

// 数字相加
add(2, 3);
// Returns: 5

add(1.5, 2.5);
// Returns: 4

// 处理 NaN
add(NaN, 5);
// Returns: NaN

add(10, NaN);
// Returns: NaN
```

当包含字符串时，它作为字符串连接操作。

```typescript
import { add } from 'es-toolkit/compat';

add('2', 3);
// Returns: '23'

add(1, '5');
// Returns: '15'

add('hello', 'world');
// Returns: 'helloworld'
```

`undefined` 值被特殊处理。

```typescript
import { add } from 'es-toolkit/compat';

add(undefined, undefined);
// Returns: 0

add(5, undefined);
// Returns: 5

add(undefined, 3);
// Returns: 3
```

## ceil

### `ceil(number, precision?)`

当您想要将数字向上舍入到特定小数位数时，请使用 `ceil`。

```typescript
import { ceil } from 'es-toolkit/compat';

// 基本向上舍入（到整数）
ceil(4.006);
// Returns: 5

ceil(4.1);
// Returns: 5

// 向上舍入到小数点后两位
ceil(6.004, 2);
// Returns: 6.01

ceil(6.001, 2);
// Returns: 6.01

// 向上舍入到负数位（十位数）
ceil(6040, -2);
// Returns: 6100

ceil(1234, -2);
// Returns: 1300

// 负数也向上舍入
ceil(-4.1);
// Returns: -4

ceil(-6.004, 2);
// Returns: -6.00
```

## clamp

### `clamp(number, lower, upper)`

当您想要将数字限制在指定的最小值和最大值之间时，请使用 `clamp`。

```typescript
import { clamp } from 'es-toolkit/compat';

// 基本用法
clamp(3, 2, 4);
// Returns: 3 (在范围内)

clamp(0, 5, 10);
// Returns: 5 (限制为最小值)

clamp(15, 5, 10);
// Returns: 10 (限制为最大值)

// 处理负数
clamp(-5, -10, -1);
// Returns: -5

clamp(-15, -10, -1);
// Returns: -10 (限制为最小值)
```

### `clamp(number, upper)`

如果只提供一个参数，该值将用作最大值。

```typescript
import { clamp } from 'es-toolkit/compat';

// 只指定最大值
clamp(5, 3);
// Returns: 3 (限制为最大值)

clamp(2, 3);
// Returns: 2 (在范围内)

clamp(1, 5);
// Returns: 1
```

NaN 值被处理为 0。

```typescript
import { clamp } from 'es-toolkit/compat';

clamp(5, NaN, 10);
// Returns: 5 (NaN 被处理为 0，范围是 0~10)

clamp(5, 2, NaN);
// Returns: 2 (NaN 被处理为 0，范围是 0~2)
```

## divide

### `divide(value, other)`

当您想要将两个数字相除时，请使用 `divide`。

```typescript
import { divide } from 'es-toolkit/compat';

// 基本除法
divide(6, 3);
// Returns: 2

divide(10, 5);
// Returns: 2

// 小数除法
divide(7, 2);
// Returns: 3.5

divide(1, 3);
// Returns: 0.3333333333333333

// 除以零
divide(6, 0);
// Returns: Infinity

divide(-6, 0);
// Returns: -Infinity

// NaN 处理
divide(2, NaN);
// Returns: NaN

divide(NaN, 3);
// Returns: NaN

divide(NaN, NaN);
// Returns: NaN
```

## floor

### `floor(number, precision?)`

当您想要将数字向下舍入到特定小数位数时，请使用 `floor`。

```typescript
import { floor } from 'es-toolkit/compat';

// 基本向下舍入（到整数）
floor(4.9);
// Returns: 4

floor(4.1);
// Returns: 4

// 向下舍入到小数点后两位
floor(6.994, 2);
// Returns: 6.99

floor(6.999, 2);
// Returns: 6.99

// 向下舍入到负数位（十位数）
floor(6040, -2);
// Returns: 6000

floor(1234, -2);
// Returns: 1200

// 负数也向下舍入
floor(-4.1);
// Returns: -5

floor(-6.994, 2);
// Returns: -7.00
```

## inRange

### `inRange(value, minimum, maximum?)`

当您想要检查数字是否在特定范围内时，请使用 `inRange`。最小值包含在内，最大值不包含在内。

```typescript
import { inRange } from 'es-toolkit/compat';

// 基本用法
inRange(3, 2, 4);
// Returns: true (2 ≤ 3 < 4)

inRange(1, 2, 5);
// Returns: false (1 < 2)

inRange(5, 2, 5);
// Returns: false (5 不包含在内)

// 范围边界值
inRange(2, 2, 4);
// Returns: true (最小值包含在内)

inRange(4, 2, 4);
// Returns: false (最大值不包含在内)
```

### `inRange(value, maximum)`

如果只提供两个参数，则处理为从 0 到 maximum 的范围。

```typescript
import { inRange } from 'es-toolkit/compat';

inRange(3, 5);
// Returns: true (0 ≤ 3 < 5)

inRange(-1, 5);
// Returns: false (-1 < 0)

inRange(0, 5);
// Returns: true (0 ≤ 0 < 5)

inRange(5, 5);
// Returns: false (5 不包含在内)
```

如果最小值大于最大值，会自动交换。

```typescript
import { inRange } from 'es-toolkit/compat';

inRange(3, 5, 2);
// Returns: true (范围变为 2~5，2 ≤ 3 < 5)

inRange(1, 5, 2);
// Returns: false (1 < 2)
```

无效值会被适当转换。

```typescript
import { inRange } from 'es-toolkit/compat';

// 字符串数字转换
inRange(3, '2', '4');
// Returns: true

// falsy 值被处理为 0
inRange(1, null, 5);
// Returns: true (null 被处理为 0，范围为 0~5)

inRange(3, false, 5);
// Returns: true (false 被处理为 0)
```

## max

### `max(items?)`

当您想要在数组中查找最大值时，请使用 `max`。

```typescript
import { max } from 'es-toolkit/compat';

// 数字数组中的最大值
max([1, 2, 3]);
// Returns: 3

max([10, 5, 8, 20]);
// Returns: 20

// 字符串数组中的最大值（按字典序）
max(['a', 'b', 'c']);
// Returns: 'c'

max(['apple', 'banana', 'cherry']);
// Returns: 'cherry'

// 空数组或 null/undefined
max([]);
// Returns: undefined

max(null);
// Returns: undefined

max(undefined);
// Returns: undefined
```

负数也能正确处理。

```typescript
import { max } from 'es-toolkit/compat';

max([-1, -5, -3]);
// Returns: -1

max([0, -2, 5, -10]);
// Returns: 5
```

## maxBy

### `maxBy(array, iteratee)`

在数组中查找函数计算值最大的元素。

```typescript
import { maxBy } from 'es-toolkit/compat';

// 对象数组中特定属性最大的元素
const people = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 35 },
];

maxBy(people, person => person.age);
// Returns: { name: '王五', age: 35 }

// 也可以使用属性名
maxBy(people, 'age');
// Returns: { name: '王五', age: 35 }
```

用函数转换值来查找最大值。

```typescript
import { maxBy } from 'es-toolkit/compat';

const items = [{ a: 1 }, { a: 2 }, { a: 3 }];
maxBy(items, x => x.a);
// Returns: { a: 3 }

const numbers = [-1, -2, -3];
maxBy(numbers, x => Math.abs(x));
// Returns: -3 (绝对值最大的元素)
```

通过数组元素访问。

```typescript
import { maxBy } from 'es-toolkit/compat';

const arrays = [
  [1, 2],
  [3, 4],
  [0, 5],
];
maxBy(arrays, 0); // 第一个元素最大的数组
// Returns: [3, 4]

maxBy(arrays, 1); // 第二个元素最大的数组
// Returns: [0, 5]
```

查找对象特定属性和值匹配的情况。

```typescript
import { maxBy } from 'es-toolkit/compat';

const users = [
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 35, active: true },
];

// active 为 true 的元素中的第一个
maxBy(users, ['active', true]);
// Returns: { name: '张三', age: 25, active: true }

// 用对象指定条件
maxBy(users, { active: true });
// Returns: { name: '张三', age: 25, active: true }
```

空数组返回 undefined。

```typescript
import { maxBy } from 'es-toolkit/compat';

maxBy([], x => x.a);
// Returns: undefined

maxBy(null);
// Returns: undefined

maxBy(undefined);
// Returns: undefined
```

## mean

### `mean(array)`

计算数字数组的平均值。

```typescript
import { mean } from 'es-toolkit/compat';

// 数字数组
mean([1, 2, 3, 4, 5]);
// Returns: 3

mean([10, 20, 30]);
// Returns: 20

mean([1.5, 2.5, 3.5]);
// Returns: 2.5
```

空数组返回 NaN。

```typescript
import { mean } from 'es-toolkit/compat';

mean([]);
// Returns: NaN

mean(null);
// Returns: NaN

mean(undefined);
// Returns: NaN
```

无效值会被视作 0 并计算。

```typescript
import { mean } from 'es-toolkit/compat';

mean([1, undefined, 2, null, 3]);
// Returns: 1.2 (1 + 2 + 3) / 5 = 1.2
```

字符串将会被拼接。

```typescript
import { mean } from 'es-toolkit/compat';

mean(['1', '2', '3']);
// Returns: 41 (123 / 3 = 41)
```

## meanBy

### `meanBy(array, iteratee)`

计算数组中每个元素应用函数后结果的平均值。

```typescript
import { meanBy } from 'es-toolkit/compat';

// 对象数组中特定属性的平均值
const people = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 35 },
];

meanBy(people, person => person.age);
// Returns: 30

// 也可以使用属性名
meanBy(people, 'age');
// Returns: 30
```

用函数转换值来计算平均值。

```typescript
import { meanBy } from 'es-toolkit/compat';

const numbers = [1.5, 2.7, 3.2, 4.8];
meanBy(numbers, x => Math.floor(x));
// Returns: 2.5 (1 + 2 + 3 + 4) / 4

const items = [{ a: 1 }, { a: 2 }, { a: 3 }];
meanBy(items, x => x.a);
// Returns: 2
```

通过数组元素访问。

```typescript
import { meanBy } from 'es-toolkit/compat';

const arrays = [[2], [3], [1]];
meanBy(arrays, 0); // 第一个元素的平均值
// Returns: 2
```

只计算对象特定属性和值匹配的情况。

```typescript
import { meanBy } from 'es-toolkit/compat';

const users = [
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 35, active: true },
];

// 只有 active 为 true 的人
meanBy(users, { active: true });
// Returns: 0.6666666 (active 为 true 的人占总人数的比例)
```

空数组返回 NaN。

```typescript
import { meanBy } from 'es-toolkit/compat';

meanBy([], x => x.a);
// Returns: NaN

meanBy(null);
// Returns: NaN

meanBy(undefined);
// Returns: NaN
```

## min

### `min(items?)`

当您想要在数组中查找最小值时，请使用 `min`。

```typescript
import { min } from 'es-toolkit/compat';

// 数字数组中的最小值
min([3, 1, 4, 1, 5, 9]);
// Returns: 1

min([10, 5, 8, 20]);
// Returns: 5

// 字符串数组中的最小值（按字典序）
min(['c', 'a', 'b']);
// Returns: 'a'

min(['cherry', 'apple', 'banana']);
// Returns: 'apple'

// 空数组或 null/undefined
min([]);
// Returns: undefined

min(null);
// Returns: undefined

min(undefined);
// Returns: undefined
```

负数也能正确处理。

```typescript
import { min } from 'es-toolkit/compat';

min([0, -3, 2, 8, 7]);
// Returns: -3

min([-1, -5, -3]);
// Returns: -5
```

## minBy

### `minBy(array, iteratee)`

在数组中找到通过函数计算后值最小的元素。

```typescript
import { minBy } from 'es-toolkit/compat';

// 对象数组中特定属性最小的元素
const people = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 35 },
];

minBy(people, person => person.age);
// Returns: { name: '张三', age: 25 }

// 也可以使用属性名
minBy(people, 'age');
// Returns: { name: '张三', age: 25 }
```

通过函数转换值来找到最小值。

```typescript
import { minBy } from 'es-toolkit/compat';

const items = [{ a: 1 }, { a: 2 }, { a: 3 }];
minBy(items, x => x.a);
// Returns: { a: 1 }

const numbers = [-1, -2, -3];
minBy(numbers, x => Math.abs(x));
// Returns: -1 (绝对值最小的元素)
```

通过数组元素访问。

```typescript
import { minBy } from 'es-toolkit/compat';

const arrays = [
  [1, 2],
  [3, 4],
  [0, 5],
];
minBy(arrays, 0); // 第一个元素最小的数组
// Returns: [0, 5]

minBy(arrays, 1); // 第二个元素最小的数组
// Returns: [1, 2]
```

查找对象的特定属性和值匹配的情况。

```typescript
import { minBy } from 'es-toolkit/compat';

const users = [
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 35, active: true },
];

// 在 active 为 true 的元素中找到不是第一个的元素
minBy(users, ['active', true]);
// Returns: { name: '李四', age: 30, active: false }

// 使用对象指定条件
minBy(users, { active: true });
// Returns: { name: '李四', age: 30, active: false }
```

空数组返回 undefined。

```typescript
import { minBy } from 'es-toolkit/compat';

minBy([], x => x.a);
// Returns: undefined

minBy(null);
// Returns: undefined

minBy(undefined);
// Returns: undefined
```

## multiply

### `multiply(value, other)`

当您想要将两个数字相乘时，请使用 `multiply`。

```typescript
import { multiply } from 'es-toolkit/compat';

// 基本乘法
multiply(2, 3);
// Returns: 6

multiply(4, 5);
// Returns: 20

// 负数处理
multiply(2, -3);
// Returns: -6

multiply(-4, -5);
// Returns: 20

// 小数处理
multiply(2.5, 4);
// Returns: 10

// NaN 处理
multiply(NaN, 3);
// Returns: NaN

multiply(2, NaN);
// Returns: NaN

multiply(NaN, NaN);
// Returns: NaN
```

## parseInt

### `parseInt(string, radix?)`

当您想要将字符串转换为整数时，请使用 `parseInt`。可以指定基数来解析不同进制。

```typescript
import { parseInt } from 'es-toolkit/compat';

// 基本十进制解析
parseInt('123');
// Returns: 123

parseInt('08');
// Returns: 8

// 十六进制自动识别
parseInt('0x20');
// Returns: 32

// 明确指定基数
parseInt('08', 10);
// Returns: 8

parseInt('0x20', 16);
// Returns: 32

parseInt('1010', 2);
// Returns: 10

// 在数组中使用
['6', '08', '10'].map(parseInt);
// Returns: [6, 8, 10]
```

格式错误的字符串返回 NaN。

```typescript
import { parseInt } from 'es-toolkit/compat';

parseInt('abc');
// Returns: NaN

parseInt('');
// Returns: NaN

parseInt('123abc');
// Returns: 123 (只解析前面部分)
```

## random

### `random(floating?)`

生成 0 和 1 之间的随机数字。

```typescript
import { random } from 'es-toolkit/compat';

random();
// Returns: 0.123456789 (0~1 之间的小数)

random(true);
// Returns: 0.987654321 (返回小数)

random(false);
// Returns: 0 或 1 (返回整数)
```

### `random(max, floating?)`

生成从 0 到 max 的随机数字。

```typescript
import { random } from 'es-toolkit/compat';

random(5);
// Returns: 3.456789 (0~5 之间的小数)

random(10, true);
// Returns: 7.123456 (0~10 之间的小数)

random(3, false);
// Returns: 2 (0~3 之间的整数)
```

### `random(min, max, floating?)`

生成从 min 到 max 的随机数字。

```typescript
import { random } from 'es-toolkit/compat';

random(1, 5);
// Returns: 3.456789 (1~5 之间的小数)

random(0, 10, true);
// Returns: 6.789012 (0~10 之间的小数)

random(1, 6, false);
// Returns: 4 (1~6 之间的整数)
```

范围颠倒时会自动交换。

```typescript
import { random } from 'es-toolkit/compat';

random(5, 1);
// Returns: 3.456789 (范围变为 1~5)
```

使用 guard 对象处理特殊情况。

```typescript
import { random } from 'es-toolkit/compat';

const guard = { 5: 5 };
random(5, 5, guard);
// Returns: 2.345678 (0~5 之间的小数)
```

## range

### `range(end)`

创建从 0 到 end 以 1 递增的数组。

```typescript
import { range } from 'es-toolkit/compat';

range(4);
// Returns: [0, 1, 2, 3]

range(0);
// Returns: []

range(-4);
// Returns: [0, -1, -2, -3]
```

### `range(start, end)`

创建从 start 到 end 以 1 递增的数组。

```typescript
import { range } from 'es-toolkit/compat';

range(1, 5);
// Returns: [1, 2, 3, 4]

range(5, 1);
// Returns: [5, 4, 3, 2] (自动以 -1 递减)

range(-2, 3);
// Returns: [-2, -1, 0, 1, 2]
```

### `range(start, end, step)`

创建从 start 到 end 以 step 递增的数组。

```typescript
import { range } from 'es-toolkit/compat';

range(0, 20, 5);
// Returns: [0, 5, 10, 15]

range(0, -4, -1);
// Returns: [0, -1, -2, -3]

range(1, 4, 0);
// Returns: [1, 1, 1]
```

小数 step 也可以使用。

```typescript
import { range } from 'es-toolkit/compat';

range(0, 1, 0.2);
// Returns: [0, 0.2, 0.4, 0.6, 0.8]

range(1, 0, -0.25);
// Returns: [1, 0.75, 0.5, 0.25]
```

用作 iteratee 时通过 guard 对象处理。

```typescript
import { range } from 'es-toolkit/compat';

[1, 2, 3].map(range);
// Returns: [[0], [0, 1], [0, 1, 2]]
```

## rangeRight

### `rangeRight(end)`

创建从 0 到 end 以 1 递增后逆序的数组。

```typescript
import { rangeRight } from 'es-toolkit/compat';

rangeRight(4);
// Returns: [3, 2, 1, 0]

rangeRight(0);
// Returns: []

rangeRight(-4);
// Returns: [-3, -2, -1, 0]
```

### `rangeRight(start, end)`

创建从 start 到 end 以 1 递增后逆序的数组。

```typescript
import { rangeRight } from 'es-toolkit/compat';

rangeRight(1, 5);
// Returns: [4, 3, 2, 1]

rangeRight(5, 1);
// Returns: [2, 3, 4, 5] (自动以 -1 递减后逆序)

rangeRight(-2, 3);
// Returns: [2, 1, 0, -1, -2]
```

### `rangeRight(start, end, step)`

创建从 start 到 end 以 step 递增后逆序的数组。

```typescript
import { rangeRight } from 'es-toolkit/compat';

rangeRight(0, 8, 2);
// Returns: [6, 4, 2, 0]

rangeRight(0, -4, -1);
// Returns: [-3, -2, -1, 0]

rangeRight(1, 4, 0);
// Returns: [1, 1, 1]
```

小数 step 也可以使用。

```typescript
import { rangeRight } from 'es-toolkit/compat';

rangeRight(0, 1, 0.2);
// Returns: [0.8, 0.6, 0.4, 0.2, 0]

rangeRight(1, 0, -0.25);
// Returns: [0.25, 0.5, 0.75, 1]
```

用作 iteratee 时通过 guard 对象处理。

```typescript
import { rangeRight } from 'es-toolkit/compat';

[1, 2, 3].map(rangeRight);
// Returns: [[0], [1, 0], [2, 1, 0]]
```

## round

### `round(number, precision?)`

将数字四舍五入到指定的小数位数。

```typescript
import { round } from 'es-toolkit/compat';

// 基本四舍五入（小数点后 0 位）
round(4.006);
// Returns: 4

round(4.6);
// Returns: 5

// 指定小数位
round(4.006, 2);
// Returns: 4.01

round(4.123456, 3);
// Returns: 4.123
```

负数精度也可以。

```typescript
import { round } from 'es-toolkit/compat';

// 十位数四舍五入
round(4060, -2);
// Returns: 4100

round(1234, -1);
// Returns: 1230

round(1234, -3);
// Returns: 1000
```

负数也能处理。

```typescript
import { round } from 'es-toolkit/compat';

round(-4.006);
// Returns: -4

round(-4.006, 2);
// Returns: -4.01

round(-1234, -2);
// Returns: -1200
```

## subtract

### `subtract(value, other)`

当您想要将两个数字相减时，请使用 `subtract`。

```typescript
import { subtract } from 'es-toolkit/compat';

// 基本减法
subtract(6, 4);
// Returns: 2

subtract(10, 3);
// Returns: 7

// 负数处理
subtract(-6, 4);
// Returns: -10

subtract(6, -4);
// Returns: 10

// NaN 处理
subtract(NaN, 4);
// Returns: NaN

subtract(6, NaN);
// Returns: NaN

subtract(NaN, NaN);
// Returns: NaN
```

## sum

### `sum(array)`

将数组中的所有数字相加得到总和。

```typescript
import { sum } from 'es-toolkit/compat';

// 数字数组
sum([1, 2, 3]);
// Returns: 6

sum([1.5, 2.5, 3]);
// Returns: 7

// 空数组
sum([]);
// Returns: 0
```

BigInt 和字符串也能处理。

```typescript
import { sum } from 'es-toolkit/compat';

// BigInt 数组
sum([1n, 2n, 3n]);
// Returns: 6n

// 字符串数组（连接）
sum(['1', '2']);
// Returns: '12'
```

无效值会被忽略。

```typescript
import { sum } from 'es-toolkit/compat';

sum([1, undefined, 2]);
// Returns: 3 (忽略 undefined)

sum(null);
// Returns: 0

sum(undefined);
// Returns: 0
```

## sumBy

### `sumBy(array, iteratee)`

对数组的每个元素应用函数后将结果相加。

```typescript
import { sumBy } from 'es-toolkit/compat';

// 数字数组
sumBy([1, 2, 3], value => value);
// Returns: 6

sumBy([1.5, 2.5, 3.5], value => Math.floor(value));
// Returns: 6 (1 + 2 + 3)

// 空数组
sumBy([], value => value);
// Returns: 0
```

### `sumBy(array)`

不提供函数时直接将数组值相加。

```typescript
import { sumBy } from 'es-toolkit/compat';

sumBy([1, 2, 3]);
// Returns: 6

sumBy([1n, 2n, 3n]);
// Returns: 6n
```

将对象数组中的特定属性相加。

```typescript
import { sumBy } from 'es-toolkit/compat';

const people = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 35 },
];

sumBy(people, person => person.age);
// Returns: 90

// 也可以使用属性名
sumBy(people, 'age');
// Returns: 90
```

字符串也会被连接。

```typescript
import { sumBy } from 'es-toolkit/compat';

const items = [{ a: '1' }, { a: '2' }];
sumBy(items, obj => obj.a);
// Returns: '12'
```

无效值会被忽略。

```typescript
import { sumBy } from 'es-toolkit/compat';

sumBy([1, undefined, 2], value => value);
// Returns: 3 (忽略 undefined)

sumBy(null);
// Returns: 0

sumBy(undefined);
// Returns: 0
```

## assign

### `assign(target, ...sources)`

当您想将一个或多个源对象的属性复制到目标对象时,请使用 `assign`。如果有相同的键,后面的源的值将覆盖前面的值。

```typescript
import { assign } from 'es-toolkit/compat';

// 基本用法
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };
const result = assign(target, source);
// 结果: { a: 1, b: 3, c: 4 }
console.log(target === result); // true (目标对象被修改)

// 合并多个源对象
const target2 = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
const source3 = { d: 4 };
assign(target2, source1, source2, source3);
// 结果: { a: 1, b: 2, c: 3, d: 4 }

// 覆盖属性
const target3 = { x: 1, y: 2 };
const source4 = { y: 3, z: 4 };
const source5 = { y: 5 };
assign(target3, source4, source5);
// 结果: { x: 1, y: 5, z: 4 } (y 被最后一个值覆盖)
```

此函数仅复制对象的自有属性,不复制继承的属性。如果值相同,它还会进行优化,不会覆盖。

## assignIn

### `assignIn(target, ...sources)`

当您想将源对象的自有属性和继承属性都复制到目标对象时,请使用 `assignIn`。与 `assign` 不同,它包括原型链中的属性。

```typescript
import { assignIn } from 'es-toolkit/compat';

// 基本用法
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };
const result = assignIn(target, source);
// 结果: { a: 1, b: 3, c: 4 }
console.log(target === result); // true (目标对象被修改)

// 合并多个源对象
const target2 = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
assignIn(target2, source1, source2);
// 结果: { a: 1, b: 2, c: 3 }

// 也复制继承的属性
function Parent() {}
Parent.prototype.inherited = 'inheritedValue';
const child = Object.create(Parent.prototype);
child.own = 'ownValue';

const target3 = {};
assignIn(target3, child);
// 结果: { own: 'ownValue', inherited: 'inheritedValue' }

// 也复制数组的索引属性和length等
const arr = [1, 2, 3];
arr.customProp = 'custom';
const target4 = {};
assignIn(target4, arr);
// 结果: { '0': 1, '1': 2, '2': 3, customProp: 'custom' }
```

与 `assign` 不同,此函数也复制继承的属性。如果值相同,它还会进行优化,不会覆盖。

## assignInWith

### `assignInWith(target, ...sources, customizer)`

当您想要在包含继承属性的同时自定义属性分配方式时,请使用 `assignInWith`。自定义函数决定每个属性的最终值。

```typescript
import { assignInWith } from 'es-toolkit/compat';

// 基本用法 - 仅在undefined时分配
const target = { a: 1, b: undefined };
const source = { b: 2, c: 3 };
const result = assignInWith(target, source, (objValue, srcValue) => {
  return objValue === undefined ? srcValue : objValue;
});
// 结果: { a: 1, b: 2, c: 3 }

// 合并数组值的自定义函数
const target2 = { numbers: [1, 2] };
const source2 = { numbers: [3, 4], name: 'test' };
assignInWith(target2, source2, (objValue, srcValue) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return objValue.concat(srcValue);
  }
  return srcValue;
});
// 结果: { numbers: [1, 2, 3, 4], name: 'test' }

// 也处理继承的属性
function Parent() {}
Parent.prototype.inherited = 'value';
const child = Object.create(Parent.prototype);
child.own = 'ownValue';

const target3 = { existing: 'data' };
assignInWith(target3, child, (objValue, srcValue, key) => {
  if (objValue === undefined) {
    return `processed_${srcValue}`;
  }
  return objValue;
});
// 结果: { existing: 'data', own: 'processed_ownValue', inherited: 'processed_value' }
```

如果自定义函数返回 `undefined`,则使用默认的分配行为。与 `assignIn` 不同,此函数允许您对每个属性应用自定义逻辑。

## assignWith

### `assignWith(object, ...sources, customizer)`

当您想要自定义属性分配方式时,请使用 `assignWith`。自定义函数决定每个属性的最终值。

```typescript
import { assignWith } from 'es-toolkit/compat';

// 基本用法 - 仅在undefined时分配
const target = { a: 1, b: undefined };
const source = { b: 2, c: 3 };
const result = assignWith(target, source, (objValue, srcValue) => {
  return objValue === undefined ? srcValue : objValue;
});
// Returns: { a: 1, b: 2, c: 3 }

// 数组合并
const target2 = { users: ['alice'] };
const source2 = { users: ['bob', 'charlie'] };
const result2 = assignWith(target2, source2, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
// Returns: { users: ['alice', 'bob', 'charlie'] }

// 多个源与自定义函数
const target3 = { a: 1 };
const result3 = assignWith(target3, { b: 2 }, { c: 3 }, (objValue, srcValue) => {
  return objValue === undefined ? srcValue : objValue;
});
// Returns: { a: 1, b: 2, c: 3 }
```

## at

### `at(object, ...paths)`

当您想要一次从对象中获取多个路径的值时,请使用 `at`。它返回与每个路径对应的值作为数组。

```typescript
import { at } from 'es-toolkit/compat';

// 基本用法
const object = { a: 1, b: 2, c: 3 };
const result = at(object, 'a', 'c');
// Returns: [1, 3]

// 嵌套对象
const nested = {
  a: {
    b: {
      c: 4,
    },
  },
  x: [1, 2, 3],
};
const result2 = at(nested, 'a.b.c', 'x[1]');
// Returns: [4, 2]

// 将路径作为数组传递
const paths = ['a', 'c'];
const result3 = at(object, paths);
// Returns: [1, 3]

// 不存在的路径
const result4 = at(object, 'nonexistent', 'a');
// Returns: [undefined, 1]
```

`null` 或 `undefined` 对象返回 `undefined` 数组。

```typescript
import { at } from 'es-toolkit/compat';

at(null, 'a', 'b'); // [undefined, undefined]
at(undefined, 'a', 'b'); // [undefined, undefined]
```

## clone

### `clone(value)`

当您想要创建值的浅拷贝时,请使用 `clone`。它可以复制各种类型的对象和原始值。

```typescript
import { clone } from 'es-toolkit/compat';

// 复制原始值
const num = 42;
const clonedNum = clone(num);
// Returns: 42 (相同的值)

// 复制数组
const arr = [1, 2, 3];
const clonedArr = clone(arr);
// Returns: [1, 2, 3] (新的数组实例)

// 复制对象
const obj = { a: 1, b: 'hello' };
const clonedObj = clone(obj);
// Returns: { a: 1, b: 'hello' } (新的对象实例)

// 复制Date对象
const date = new Date('2023-01-01');
const clonedDate = clone(date);
// Returns: new Date('2023-01-01') (新的Date实例)

// 复制正则表达式
const regex = /hello/gi;
regex.lastIndex = 3;
const clonedRegex = clone(regex);
// Returns: /hello/gi with lastIndex = 3

// 复制Map
const map = new Map([
  ['a', 1],
  ['b', 2],
]);
const clonedMap = clone(map);
// Returns: new Map([['a', 1], ['b', 2]])

// 复制Set
const set = new Set([1, 2, 3]);
const clonedSet = clone(set);
// Returns: new Set([1, 2, 3])
```

嵌套对象仅进行浅拷贝。

```typescript
import { clone } from 'es-toolkit/compat';

const nested = {
  a: 1,
  b: {
    c: 2,
  },
};
const clonedNested = clone(nested);

console.log(clonedNested !== nested); // true (不同的对象)
console.log(clonedNested.b === nested.b); // true (嵌套对象具有相同的引用)
```

## cloneDeep

### `cloneDeep(value)`

当您想要创建值的深拷贝时,请使用 `cloneDeep`。它将嵌套的对象和数组完全复制为新实例。

```typescript
import { cloneDeep } from 'es-toolkit/compat';

// 复制原始值
const num = 42;
const clonedNum = cloneDeep(num);
// Returns: 42 (相同的值)

// 深拷贝数组
const arr = [1, [2, 3], { a: 4 }];
const clonedArr = cloneDeep(arr);
clonedArr[1][0] = 99;
console.log(arr[1][0]); // 2 (原始值未更改)
console.log(clonedArr[1][0]); // 99

// 深拷贝对象
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};
const clonedObj = cloneDeep(obj);
clonedObj.b.d.e = 99;
console.log(obj.b.d.e); // 3 (原始值未更改)
console.log(clonedObj.b.d.e); // 99

// 深拷贝Date对象
const date = new Date('2023-01-01');
const clonedDate = cloneDeep(date);
// Returns: new Date('2023-01-01') (新的Date实例)

// 复杂的嵌套结构
const complex = {
  arr: [1, { nested: true }],
  map: new Map([['key', { value: 1 }]]),
  set: new Set([{ item: 1 }]),
  date: new Date(),
};
const clonedComplex = cloneDeep(complex);
// 所有嵌套对象都作为完全新的实例被复制
```

循环引用也得到正确处理。

```typescript
import { cloneDeep } from 'es-toolkit/compat';

const obj = { a: 1 };
obj.self = obj; // 循环引用

const cloned = cloneDeep(obj);
console.log(cloned !== obj); // true
console.log(cloned.self === cloned); // true (保留循环引用)
```

## cloneDeepWith

### `cloneDeepWith(value, customizer?)`

当您想要自定义深拷贝的工作方式时,请使用 `cloneDeepWith`。自定义函数控制特定值的复制方式。

```typescript
import { cloneDeepWith } from 'es-toolkit/compat';

// 基本用法(没有自定义函数)
const obj = {
  a: 1,
  b: {
    c: 2,
  },
};
const cloned = cloneDeepWith(obj);
// Returns: { a: 1, b: { c: 2 } } (完全新的实例)

// 特殊处理Date对象
const obj2 = {
  name: 'test',
  createdAt: new Date('2023-01-01'),
  nested: {
    updatedAt: new Date('2023-12-31'),
  },
};
const cloned2 = cloneDeepWith(obj2, value => {
  if (value instanceof Date) {
    // 将Date转换为时间戳数字
    return value.getTime();
  }
  // 返回undefined使用默认的深拷贝行为
});
// Returns: {
//   name: 'test',
//   createdAt: 1672531200000,
//   nested: { updatedAt: 1703980800000 }
// }

// 转换数组元素
const arr = [1, [2, 3], { a: 4, b: [5, 6] }];
const clonedArr = cloneDeepWith(arr, value => {
  if (typeof value === 'number') {
    return value * 10;
  }
});
// Returns: [10, [20, 30], { a: 40, b: [50, 60] }]

// 处理函数
const objWithFunc = {
  data: { count: 1 },
  increment: function () {
    this.data.count++;
  },
};
const clonedWithFunc = cloneDeepWith(objWithFunc, value => {
  if (typeof value === 'function') {
    // 将函数转换为字符串
    return value.toString();
  }
});
// Returns: {
//   data: { count: 1 },
//   increment: "function() { this.data.count++; }"
// }
```

结合循环引用和自定义函数:

```typescript
import { cloneDeepWith } from 'es-toolkit/compat';

const obj = { a: 1, b: { c: 2 } };
obj.b.self = obj; // 循环引用

const cloned = cloneDeepWith(obj, value => {
  if (typeof value === 'number') {
    return value + 100;
  }
});

console.log(cloned.a); // 101
console.log(cloned.b.c); // 102
console.log(cloned.b.self === cloned); // true (保留循环引用)
```

## cloneWith

### `cloneWith(value, customizer?)`

当您想要自定义复制工作方式时,请使用 `cloneWith`。自定义函数控制特定值的复制方式。

```typescript
import { cloneWith } from 'es-toolkit/compat';

// 基本用法(没有自定义函数)
const obj = { a: 1, b: 'hello' };
const cloned = cloneWith(obj);
// Returns: { a: 1, b: 'hello' } (新的对象实例)

// 转换数字值
const obj2 = { a: 1, b: 2, c: 'text' };
const cloned2 = cloneWith(obj2, value => {
  const obj = {};
  for (const key in value) {
    const val = value[key];
    if (typeof val === 'number') {
      obj[key] = val * 2;
    } else {
      obj[key] = val;
    }
  }
  return obj;
});
// Returns: { a: 2, b: 4, c: 'text' }

// 转换数组元素
const arr = [1, 2, 3];
const clonedArr = cloneWith(arr, value => {
  return value.map(x => x + 10);
});
// Returns: [11, 12, 13]

// 处理特定类型
const complex = {
  date: new Date('2023-01-01'),
  number: 42,
  text: 'hello',
};
const clonedComplex = cloneWith(complex, value => {
  const obj = {};
  for (const key in value) {
    const val = value[key];
    if (val instanceof Date) {
      obj[key] = val.toISOString();
    } else if (typeof val === 'string') {
      obj[key] = val.toUpperCase();
    } else {
      obj[key] = val;
    }
  }
  return obj;
});
// Returns: { date: '2023-01-01T00:00:00.000Z', number: 42, text: 'HELLO' }
```

如果自定义函数返回 `undefined`,则使用默认的复制行为。

```typescript
import { cloneWith } from 'es-toolkit/compat';

const obj = { a: 1, b: { c: 2 } };
const cloned = cloneWith(obj, value => {
  // 对所有值返回undefined = 使用默认复制
  return undefined;
});
// Returns: { a: 1, b: { c: 2 } } (与clone相同的结果)
```

## create

### `create(prototype, properties?)`

当您想要基于原型创建新对象时,请使用 `create`。您也可以选择添加属性。

```typescript
import { create } from 'es-toolkit/compat';

// 基本用法
const person = {
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  },
};

const john = create(person, { name: 'John' });
john.greet(); // "Hello, my name is John"

// 检查方法继承
console.log('greet' in john); // true
console.log(john.hasOwnProperty('greet')); // false (继承的属性)
console.log(john.hasOwnProperty('name')); // true (自有属性)

// 复杂的原型
const animal = {
  type: 'animal',
  makeSound() {
    console.log('Some generic sound');
  },
};

const dog = create(animal, {
  breed: 'Golden Retriever',
  name: 'Buddy',
  makeSound() {
    console.log('Woof!');
  },
});

console.log(dog.type); // 'animal' (继承的)
console.log(dog.breed); // 'Golden Retriever' (自有属性)
dog.makeSound(); // 'Woof!' (覆盖的方法)

// null原型
const cleanObj = create(null, { data: 'value' });
console.log(cleanObj.toString); // ƒ toString() { [native code] } (null 等价于 {})

// 继承空对象
const empty = create({});
console.log(Object.getPrototypeOf(empty)); // {} (空对象)
```

只有可枚举的字符串键才会被复制。

```typescript
import { create } from 'es-toolkit/compat';

const proto = { inherited: true };
const props = {
  visible: 'yes',
  [Symbol('hidden')]: 'no', // Symbol键不会被复制
};

// 添加不可枚举属性
Object.defineProperty(props, 'hidden', {
  value: 'secret',
  enumerable: false,
});

const obj = create(proto, props);
console.log(obj.visible); // 'yes'
console.log(obj.hidden); // undefined (不可枚举)
console.log(obj[Symbol('hidden')]); // undefined (Symbol键)
console.log(obj.inherited); // true (继承的)
```

## defaults

### `defaults(object, ...sources)`

当您想为对象中的 `undefined` 属性或从 `Object.prototype` 继承的属性设置默认值时,请使用 `defaults`。您可以传递多个默认值对象,它们将按从左到右的顺序应用。

```typescript
import { defaults } from 'es-toolkit/compat';

// 用默认值填充 undefined 属性
defaults({ a: 1 }, { a: 2, b: 2 }, { c: 3 });
// 返回值: { a: 1, b: 2, c: 3 }

// 只有 undefined 属性会用默认值填充
defaults({ a: undefined }, { a: 1 });
// 返回值: { a: 1 }

// null 值保持不变
defaults({ a: null }, { a: 1 });
// 返回值: { a: null }
```

如果属性已经有值,则不会用默认值覆盖。

```typescript
import { defaults } from 'es-toolkit/compat';

defaults({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
// 返回值: { a: 1, b: 2, c: 3 }
```

## defaultsDeep

### `defaultsDeep(target, ...sources)`

当您想对嵌套对象中的 `undefined` 属性递归设置默认值时,请使用 `defaultsDeep`。与 `defaults` 类似,但它也会合并嵌套对象。

```typescript
import { defaultsDeep } from 'es-toolkit/compat';

// 在嵌套对象中设置默认值
defaultsDeep({ a: { b: 2 } }, { a: { b: 3, c: 3 }, d: 4 });
// 返回值: { a: { b: 2, c: 3 }, d: 4 }

// 只有 undefined 属性会用默认值填充
defaultsDeep({ a: { b: undefined } }, { a: { b: 1 } });
// 返回值: { a: { b: 1 } }

// null 值保持不变
defaultsDeep({ a: null }, { a: { b: 1 } });
// 返回值: { a: null }
```

您可以传递多个源对象以分阶段应用默认值。

```typescript
import { defaultsDeep } from 'es-toolkit/compat';

defaultsDeep({ a: { b: 2 } }, { a: { c: 3 } }, { a: { d: 4 }, e: 5 });
// 返回值: { a: { b: 2, c: 3, d: 4 }, e: 5 }
```

## extend

### `extend(object, ...sources)`

使用 `extend` 将属性从一个对象复制到另一个对象。类似于 `Object.assign()`,但也会复制继承的属性。此函数是 `assignIn` 的别名。

```typescript
import { extend } from 'es-toolkit/compat';

// 复制基本属性
const target = { a: 1 };
extend(target, { b: 2 }, { c: 3 });
// 返回值: { a: 1, b: 2, c: 3 }

// 也会复制继承的属性
function Parent() {
  this.a = 1;
}
Parent.prototype.b = 2;

const source = new Parent();
extend({}, source);
// 返回值: { a: 1, b: 2 }
```

当存在相同属性时,后面的源对象的值会覆盖前面的。

```typescript
import { extend } from 'es-toolkit/compat';

extend({ a: 1, b: 2 }, { b: 3 }, { c: 4 });
// 返回值: { a: 1, b: 3, c: 4 }
```

## extendWith

### `extendWith(object, ...sources, customizer)`

使用 `extendWith` 通过自定义逻辑合并对象属性。它类似于 `extend`,但允许您决定如何合并每个属性。此函数是 `assignInWith` 的别名。

```typescript
import { extendWith } from 'es-toolkit/compat';

// 使用自定义合并逻辑复制属性
const target = { a: 1, b: 2 };
extendWith(target, { b: 3, c: 4 }, (objValue, srcValue) => {
  return objValue === undefined ? srcValue : objValue;
});
// 返回值: { a: 1, b: 2, c: 4 }

// 连接数组的自定义合并
const obj1 = { a: [1, 2] };
const obj2 = { a: [3, 4], b: [5, 6] };
extendWith(obj1, obj2, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
// 返回值: { a: [1, 2, 3, 4], b: [5, 6] }
```

可以使用多个源对象。

```typescript
import { extendWith } from 'es-toolkit/compat';

extendWith({ a: 1 }, { b: 2 }, { c: 3 }, (objValue, srcValue) => srcValue * 2);
// 返回值: { a: 1, b: 4, c: 6 }
```

## findKey

### `findKey(obj, predicate)`

使用 `findKey` 在对象中查找满足条件的第一个元素的键。可以使用函数、对象、数组、字符串等各种形式的条件。

```typescript
import { findKey } from 'es-toolkit/compat';

// 使用函数条件查找键
const users = {
  alice: { age: 25, active: true },
  bob: { age: 30, active: false },
  charlie: { age: 35, active: true },
};

findKey(users, user => user.age > 30);
// 返回值: 'charlie'

// 使用对象条件查找键
findKey(users, { active: false });
// 返回值: 'bob'

// 使用属性路径查找键
findKey(users, 'active');
// 返回值: 'alice'
```

如果没有匹配的元素,则返回 `undefined`。

```typescript
import { findKey } from 'es-toolkit/compat';

findKey({ a: 1, b: 2 }, value => value > 5);
// 返回值: undefined
```

## findLastKey

### `findLastKey(obj, predicate)`

使用 `findLastKey` 在对象中查找符合条件的最后一个元素的键。与 `findKey` 相反,它从末尾开始搜索。可以使用函数、对象、数组、字符串等各种形式的条件。

```typescript
import { findLastKey } from 'es-toolkit/compat';

// 使用函数条件查找键
const users = {
  alice: { age: 25, active: true },
  bob: { age: 30, active: false },
  charlie: { age: 35, active: true },
};

findLastKey(users, user => user.active);
// 返回值: 'charlie' (从末尾找到的第一个 active: true)

// 使用对象条件查找键
findLastKey(users, { active: true });
// 返回值: 'charlie'

// 使用属性路径查找键
findLastKey(users, 'active');
// 返回值: 'charlie'

// 使用属性-值数组查找键
findLastKey(users, ['active', false]);
// 返回值: 'bob'
```

如果没有符合条件的元素,则返回 `undefined`。

```typescript
import { findLastKey } from 'es-toolkit/compat';

findLastKey({ a: 1, b: 2 }, value => value > 5);
// 返回值: undefined
```

## forIn

### `forIn(object, iteratee)`

遍历对象的所有属性并调用 `iteratee` 函数。它不仅遍历对象的自有属性,还遍历通过原型链继承的属性。如果 `iteratee` 函数返回 `false`,则停止遍历。

```typescript
import { forIn } from 'es-toolkit/compat';

// 遍历对象的所有属性
const obj = { a: 1, b: 2 };
forIn(obj, (value, key) => {
  console.log(key, value);
});
// 输出: 'a' 1, 'b' 2

// 包括继承属性的遍历
function Parent() {
  this.inherited = 'value';
}
Parent.prototype.protoProperty = 'proto';

const child = new Parent();
child.own = 'ownValue';

forIn(child, (value, key) => {
  console.log(key, value);
});
// 输出: 'inherited' 'value', 'own' 'ownValue', 'protoProperty' 'proto'

// 根据条件提前退出
forIn(obj, (value, key) => {
  console.log(key, value);
  return key !== 'a'; // 在 'a' 之后停止
});
// 输出: 'a' 1
```

`null` 或 `undefined` 会原样返回。

```typescript
import { forIn } from 'es-toolkit/compat';

forIn(null, iteratee); // null
forIn(undefined, iteratee); // undefined
```

## forInRight

### `forInRight(object, iteratee)`

按反向顺序迭代对象的所有属性,调用 `iteratee` 函数。它不仅迭代对象的自有属性,还包括通过原型链继承的属性。由于它将键收集到数组中然后反向迭代,因此比正常迭代慢。如果 `iteratee` 函数返回 `false`,则停止迭代。

```typescript
import { forInRight } from 'es-toolkit/compat';

// 按反向顺序迭代所有属性
const obj = { a: 1, b: 2 };
forInRight(obj, (value, key) => {
  console.log(key, value);
});
// 输出: 'b' 2, 'a' 1

// 包括继承属性的反向迭代
function Parent() {
  this.inherited = 'value';
}
Parent.prototype.protoProperty = 'proto';

const child = new Parent();
child.own = 'ownValue';

forInRight(child, (value, key) => {
  console.log(key, value);
});
// 输出: 'protoProperty' 'proto', 'own' 'ownValue', 'inherited' 'value'

// 根据条件提前终止
forInRight(obj, (value, key) => {
  console.log(key, value);
  return key !== 'a'; // 在 'a' 处停止
});
// 输出: 'b' 2, 'a' 1
```

`null` 或 `undefined` 会原样返回。

```typescript
import { forInRight } from 'es-toolkit/compat';

forInRight(null, iteratee); // null
forInRight(undefined, iteratee); // undefined
```

## forOwn

### `forOwn(object, iteratee)`

仅迭代对象的自有属性,调用 `iteratee` 函数。它只迭代对象直接拥有的属性,排除继承的属性和 `Symbol` 键。如果 `iteratee` 函数返回 `false`,则停止迭代。

```typescript
import { forOwn } from 'es-toolkit/compat';

// 仅迭代对象的自有属性
const obj = { a: 1, b: 2 };
forOwn(obj, (value, key) => {
  console.log(key, value);
});
// 输出: 'a' 1, 'b' 2

// 排除继承的属性
function Parent() {
  this.inherited = 'value';
}
Parent.prototype.protoProperty = 'proto';

const child = new Parent();
child.own = 'ownValue';

forOwn(child, (value, key) => {
  console.log(key, value);
});
// 输出: 'inherited' 'value', 'own' 'ownValue' (protoProperty 被排除)

// 根据条件提前终止
forOwn(obj, (value, key) => {
  console.log(key, value);
  return key !== 'a'; // 在 'a' 之后停止
});
// 输出: 'a' 1
```

`null` 或 `undefined` 按原样返回。

```typescript
import { forOwn } from 'es-toolkit/compat';

forOwn(null, iteratee); // null
forOwn(undefined, iteratee); // undefined
```

## forOwnRight

### `forOwnRight(object, iteratee)`

以相反的顺序仅迭代对象的自有属性,调用 `iteratee` 函数。它以相反的顺序仅迭代对象直接拥有的属性,排除继承的属性和 `Symbol` 键。由于它将键收集到数组中然后以相反的顺序迭代,因此比正常迭代慢。如果 `iteratee` 函数返回 `false`,则停止迭代。

```typescript
import { forOwnRight } from 'es-toolkit/compat';

// 以相反的顺序仅迭代自有属性
const obj = { a: 1, b: 2 };
forOwnRight(obj, (value, key) => {
  console.log(key, value);
});
// 输出: 'b' 2, 'a' 1

// 以相反的顺序迭代,排除继承的属性
function Parent() {
  this.inherited = 'value';
}
Parent.prototype.protoProperty = 'proto';

const child = new Parent();
child.own = 'ownValue';

forOwnRight(child, (value, key) => {
  console.log(key, value);
});
// 输出: 'own' 'ownValue', 'inherited' 'value' (protoProperty 被排除)

// 根据条件提前终止
forOwnRight(obj, (value, key) => {
  console.log(key, value);
  return key !== 'a'; // 在 'a' 处停止
});
// 输出: 'b' 2, 'a' 1
```

`null` 或 `undefined` 按原样返回。

```typescript
import { forOwnRight } from 'es-toolkit/compat';

forOwnRight(null, iteratee); // null
forOwnRight(undefined, iteratee); // undefined
```

## fromPairs

### `fromPairs(pairs)`

接收一个由键值对组成的数组，并将其转换为对象。每个键值对必须是包含 2 个元素的数组。第一个元素成为键，第二个元素成为值。在整理或转换数据时非常有用。

```typescript
import { fromPairs } from 'es-toolkit/compat';

// 基本键值对转换
const pairs = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];
const result = fromPairs(pairs);
// 结果: { a: 1, b: 2, c: 3 }

// 处理各种值类型
const mixedPairs = [
  ['name', 'John'],
  ['age', 30],
  ['active', true],
];
const user = fromPairs(mixedPairs);
// 结果: { name: 'John', age: 30, active: true }
```

`null`、`undefined` 或不是类数组对象的值将被处理为空对象。

```typescript
import { fromPairs } from 'es-toolkit/compat';

fromPairs(null); // {}
fromPairs(undefined); // {}
fromPairs('invalid'); // {}
```

## functions

### `functions(object)`

检查对象的自有属性,仅返回函数属性的名称数组。排除继承的属性和 `Symbol` 键,只检查对象直接拥有的字符串键属性。在查找对象的方法或单独处理函数属性时很有用。

```typescript
import { functions } from 'es-toolkit/compat';

// 基本用法
const obj = {
  name: 'John',
  age: 30,
  greet: () => 'Hello',
  calculate: function (x, y) {
    return x + y;
  },
};

const functionNames = functions(obj);
// 结果: ['greet', 'calculate']

// 在类实例中查找函数
class Calculator {
  constructor() {
    this.value = 0;
    this.add = function (n) {
      this.value += n;
    };
  }

  multiply(n) {
    this.value *= n;
  }
}

Calculator.prototype.divide = function (n) {
  this.value /= n;
};

const calc = new Calculator();
const methods = functions(calc);
// 结果: ['add'] (排除继承的 multiply、divide)

// 没有函数的对象
const data = { x: 1, y: 2, z: 'text' };
const noFunctions = functions(data);
// 结果: []
```

`null` 或 `undefined` 会被处理为空数组。

```typescript
import { functions } from 'es-toolkit/compat';

functions(null); // []
functions(undefined); // []
```

## functionsIn

### `functionsIn(object)`

检查对象的所有属性,返回仅包含函数类型属性名称的数组。不仅检查对象自身的属性,还会通过原型链检查所有继承的属性。适用于查找对象的所有方法(包括继承的方法)。

```typescript
import { functionsIn } from 'es-toolkit/compat';

// 基本用法
const obj = {
  name: 'John',
  age: 30,
  greet: () => 'Hello',
  calculate: function (x, y) {
    return x + y;
  },
};

const functionNames = functionsIn(obj);
// 结果: ['greet', 'calculate']

// 包括继承的函数
class Calculator {
  constructor() {
    this.value = 0;
    this.add = function (n) {
      this.value += n;
    };
  }

  multiply(n) {
    this.value *= n;
  }
}

Calculator.prototype.divide = function (n) {
  this.value /= n;
};

const calc = new Calculator();
const allMethods = functionsIn(calc);
// 结果: ['add', 'divide'] (`multiply` 不可枚举)

// 通过原型链继承
function Parent() {
  this.parentMethod = function () {
    return 'parent';
  };
}
Parent.prototype.protoMethod = function () {
  return 'proto';
};

function Child() {
  Parent.call(this);
  this.childMethod = function () {
    return 'child';
  };
}
Child.prototype = Object.create(Parent.prototype);

const child = new Child();
const inheritedFunctions = functionsIn(child);
// 结果: ['parentMethod', 'childMethod', 'protoMethod']
```

`null` 或 `undefined` 将被视为空数组。

```typescript
import { functionsIn } from 'es-toolkit/compat';

functionsIn(null); // []
functionsIn(undefined); // []
```

## get

### `get(object, path, defaultValue?)`

使用 `get` 安全地从对象路径获取值。当路径不存在或值为 `undefined` 时,返回默认值。

```typescript
import { get } from 'es-toolkit/compat';

// 使用点表示法访问嵌套对象
const object = { a: { b: { c: 3 } } };
get(object, 'a.b.c');
// => 3

// 使用数组表示法访问
get(object, ['a', 'b', 'c']);
// => 3

// 为不存在的路径提供默认值
get(object, 'a.b.d', 'default');
// => 'default'

// 包含数组索引的路径
const arrayObject = { users: [{ name: 'john' }, { name: 'jane' }] };
get(arrayObject, 'users[0].name');
// => 'john'
```

安全地访问 `null` 或 `undefined` 对象。

```typescript
import { get } from 'es-toolkit/compat';

get(null, 'a.b.c', 'default');
// => 'default'

get(undefined, ['a', 'b'], 'default');
// => 'default'
```

## has

### `has(object, path)`

当您想检查对象是否具有特定路径的属性时,请使用 `has`。它只检查自有属性(own property),不检查继承的属性。

```typescript
import { has } from 'es-toolkit/compat';

// 简单属性检查
const object = { a: 1, b: 2 };
has(object, 'a');
// => true

// 嵌套对象检查
const nested = { a: { b: { c: 3 } } };
has(nested, 'a.b.c');
// => true
has(nested, ['a', 'b', 'c']);
// => true

// 不存在的属性
has(nested, 'a.b.d');
// => false

// 数组索引检查
const array = [1, 2, 3];
has(array, 2);
// => true
has(array, 5);
// => false
```

它在稀疏数组中也能正常工作。

```typescript
import { has } from 'es-toolkit/compat';

const sparse = [1, , 3]; // 索引 1 为空
has(sparse, 0); // true
has(sparse, 1); // true - 实际上存在,但值为 undefined
has(sparse, 2); // true
```

## hasIn

### `hasIn(object, path)`

当您想检查对象在特定路径是否有属性时,使用 `hasIn`。与 `has` 不同,它也会检查继承的属性(原型链中的属性)。

```typescript
import { hasIn } from 'es-toolkit/compat';

// 检查自有属性
const object = { a: 1, b: 2 };
hasIn(object, 'a');
// => true

// 检查嵌套对象
const nested = { a: { b: { c: 3 } } };
hasIn(nested, 'a.b.c');
// => true
hasIn(nested, ['a', 'b', 'c']);
// => true

// 不存在的属性
hasIn(nested, 'a.b.d');
// => false

// 检查数组索引
const array = [1, 2, 3];
hasIn(array, 2);
// => true
hasIn(array, 5);
// => false
```

它也会检查继承的属性。

```typescript
import { hasIn } from 'es-toolkit/compat';

// 检查原型链中的属性
function Rectangle() {}
Rectangle.prototype.area = function () {};

const rect = new Rectangle();
hasIn(rect, 'area'); // true - 也能找到继承的属性
has(rect, 'area'); // false - has 只检查自有属性
```

安全地处理 `null` 和 `undefined`。

```typescript
import { hasIn } from 'es-toolkit/compat';

hasIn(null, 'a');
// => false

hasIn(undefined, 'b');
// => false
```

## invert

### `invert(object)`

当您想要交换对象的键和值时,请使用 `invert`。原始对象的键将成为新对象的值,原始对象的值将成为新对象的键。

```typescript
import { invert } from 'es-toolkit/compat';

// 基本键值反转
const object = { a: 1, b: 2, c: 3 };
invert(object);
// => { '1': 'a', '2': 'b', '3': 'c' }

// 反转字符串值
const colors = { red: '#ff0000', green: '#00ff00', blue: '#0000ff' };
invert(colors);
// => { '#ff0000': 'red', '#00ff00': 'green', '#0000ff': 'blue' }

// 混合键和值类型
const mixed = { a: 1, 2: 'b', c: 3, 4: 'd' };
invert(mixed);
// => { '1': 'a', 'b': '2', '3': 'c', 'd': '4' }
```

当存在重复值时,将使用最后一个键。

```typescript
import { invert } from 'es-toolkit/compat';

// 存在重复值的情况
const object = { a: 1, b: 1, c: 2 };
invert(object);
// => { '1': 'b', '2': 'c' }
// 'a' 被覆盖并丢失
```

## invertBy

### `invertBy(object, iteratee?)`

当你想要反转对象的键和值,并将具有相同值的键分组到数组中时,请使用 `invertBy`。你可以选择性地提供一个迭代器函数来转换值。

```typescript
import { invertBy } from 'es-toolkit/compat';

// 基本的键值反转(相同的值被分组到数组中)
const object = { a: 1, b: 2, c: 1 };
invertBy(object);
// => { '1': ['a', 'c'], '2': ['b'] }

// 使用迭代器函数进行值转换
const ages = { john: 25, jane: 30, bob: 25 };
invertBy(ages, age => `age_${age}`);
// => { 'age_25': ['john', 'bob'], 'age_30': ['jane'] }

// 按字符串长度分组
const words = { a: 'hello', b: 'world', c: 'hi', d: 'test' };
invertBy(words, word => word.length);
// => { '5': ['a', 'b'], '2': ['c'], '4': ['d'] }
```

你也可以按对象属性分组。

```typescript
import { invertBy } from 'es-toolkit/compat';

// 按对象属性分组
const users = {
  user1: { department: 'IT', age: 30 },
  user2: { department: 'HR', age: 25 },
  user3: { department: 'IT', age: 35 },
};

invertBy(users, user => user.department);
// => { 'IT': ['user1', 'user3'], 'HR': ['user2'] }
```

安全地处理 `null` 或 `undefined`。

```typescript
import { invertBy } from 'es-toolkit/compat';

invertBy(null);
// => {}

invertBy(undefined);
// => {}
```

## keys

### `keys(object)`

当您想要获取对象的自身属性名称时,使用 `keys`。它只返回自身属性,不包括继承的属性。

```typescript
import { keys } from 'es-toolkit/compat';

// 基本对象的键
const object = { a: 1, b: 2, c: 3 };
keys(object);
// => ['a', 'b', 'c']

// 数组的索引
const array = [1, 2, 3];
keys(array);
// => ['0', '1', '2']

// 字符串的索引
keys('hello');
// => ['0', '1', '2', '3', '4']
```

从函数或构造函数继承的属性会被排除。

```typescript
import { keys } from 'es-toolkit/compat';

function Foo() {
  this.a = 1;
  this.b = 2;
}
Foo.prototype.c = 3;

keys(new Foo());
// => ['a', 'b'] ('c' 被排除,因为它是原型属性)
```

类数组对象会被特殊处理。

```typescript
import { keys } from 'es-toolkit/compat';

// TypedArray
const typedArray = new Uint8Array([1, 2, 3]);
keys(typedArray);
// => ['0', '1', '2']

// arguments 对象
function example() {
  return keys(arguments);
}
example('a', 'b', 'c');
// => ['0', '1', '2']
```

安全处理 `null` 和 `undefined`。

```typescript
import { keys } from 'es-toolkit/compat';

keys(null);
// => []

keys(undefined);
// => []
```

## keysIn

### `keysIn(object)`

当您想要获取对象的所有属性名称(包括继承的属性)时,请使用 `keysIn`。与 `keys` 不同,它还返回原型链中的属性。

```typescript
import { keysIn } from 'es-toolkit/compat';

// 基本对象的键
const object = { a: 1, b: 2 };
keysIn(object);
// => ['a', 'b']

// 数组的索引
const array = [1, 2, 3];
keysIn(array);
// => ['0', '1', '2']

// 字符串的索引
keysIn('hello');
// => ['0', '1', '2', '3', '4']
```

它也包括继承的属性。

```typescript
import { keysIn } from 'es-toolkit/compat';

function Foo() {
  this.a = 1;
  this.b = 2;
}
Foo.prototype.c = 3;

keysIn(new Foo());
// => ['a', 'b', 'c'] (包括原型属性 'c')

// 排除 constructor
class MyClass {
  constructor() {
    this.prop = 1;
  }
  method() {}
}
MyClass.prototype.inherited = 2;

keysIn(new MyClass());
// => ['prop', 'method', 'inherited'] (排除了 constructor)
```

它特殊处理类数组对象。

```typescript
import { keysIn } from 'es-toolkit/compat';

// TypedArray
const typedArray = new Uint8Array([1, 2, 3]);
keysIn(typedArray);
// => ['0', '1', '2'] (排除 buffer、byteLength 等)

// arguments 对象
function example() {
  return keysIn(arguments);
}
example('a', 'b', 'c');
// => ['0', '1', '2']
```

它安全地处理 `null` 或 `undefined`。

```typescript
import { keysIn } from 'es-toolkit/compat';

keysIn(null);
// => []

keysIn(undefined);
// => []
```

## mapKeys

### `mapKeys(object, iteratee)`

使用 `iteratee` 函数转换对象中的每个键来创建新对象。值保持不变,只修改键。适用于转换或规范化对象键。

```typescript
import { mapKeys } from 'es-toolkit/compat';

// 为键添加前缀
const obj = { a: 1, b: 2, c: 3 };
const result = mapKeys(obj, (value, key) => 'prefix_' + key);
// 结果: { prefix_a: 1, prefix_b: 2, prefix_c: 3 }

// 将键转换为大写
const data = { name: 'John', age: 30 };
const uppercased = mapKeys(data, (value, key) => key.toUpperCase());
// 结果: { NAME: 'John', AGE: 30 }

// 将数组索引转换为键
const arr = ['apple', 'banana', 'orange'];
const indexed = mapKeys(arr, (value, index) => `item_${index}`);
// 结果: { item_0: 'apple', item_1: 'banana', item_2: 'orange' }

// 通过组合键和值创建新键
const scores = { math: 90, science: 85, english: 92 };
const detailed = mapKeys(scores, (value, key) => `${key}_score_${value}`);
// 结果: { math_score_90: 90, science_score_85: 85, english_score_92: 92 }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { mapKeys } from 'es-toolkit/compat';

mapKeys(null, iteratee); // {}
mapKeys(undefined, iteratee); // {}
```

## mapValues

### `mapValues(object, iteratee)`

使用 `iteratee` 函数转换对象中的每个值来创建新对象。键保持不变,只修改值。可以处理字符串、数组和对象。适用于转换或计算数据。

```typescript
import { mapValues } from 'es-toolkit/compat';

// 转换对象值
const obj = { a: 1, b: 2, c: 3 };
const doubled = mapValues(obj, value => value * 2);
// 结果: { a: 2, b: 4, c: 6 }

// 将字符串转换为大写
const names = { first: 'john', last: 'doe' };
const uppercased = mapValues(names, value => value.toUpperCase());
// 结果: { first: 'JOHN', last: 'DOE' }

// 转换字符串中的每个字符
const str = 'abc';
const charMap = mapValues(str, char => char.toUpperCase());
// 结果: { '0': 'A', '1': 'B', '2': 'C' }

// 将数组转换为对象
const arr = [10, 20, 30];
const arrMap = mapValues(arr, (value, index) => value + index);
// 结果: { '0': 10, '1': 21, '2': 32 }

// 使用属性路径提取值
const users = {
  user1: { profile: { name: 'Alice' } },
  user2: { profile: { name: 'Bob' } },
};
const userNames = mapValues(users, 'profile.name');
// 结果: { user1: 'Alice', user2: 'Bob' }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { mapValues } from 'es-toolkit/compat';

mapValues(null, iteratee); // {}
mapValues(undefined, iteratee); // {}
```

## merge

### `merge(object, ...sources)`

将一个或多个源对象深度合并到目标对象中。嵌套的对象和数组会递归合并。如果源对象的属性是 `undefined`,则不会覆盖目标对象中的现有值。适用于合并对象配置或应用默认值。

```typescript
import { merge } from 'es-toolkit/compat';

// 基本对象合并
const target = { a: 1, b: { x: 1, y: 2 } };
const source = { b: { y: 3, z: 4 }, c: 5 };
const result = merge(target, source);
// 结果: { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }

// 数组合并
const obj1 = { arr: [1, 2] };
const obj2 = { arr: [3, 4] };
const merged = merge(obj1, obj2);
// 结果: { arr: [3, 4] } (数组被替换)

// 多个对象合并
const base = { a: 1 };
const ext1 = { b: 2 };
const ext2 = { c: 3 };
const ext3 = { d: 4 };
const combined = merge(base, ext1, ext2, ext3);
// 结果: { a: 1, b: 2, c: 3, d: 4 }

// 嵌套对象合并
const config = {
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: { auth: true },
};
const overrides = {
  api: { timeout: 10000, retries: 3 },
  features: { analytics: true },
};
const finalConfig = merge(config, overrides);
// 结果: {
//   api: { url: 'https://api.example.com', timeout: 10000, retries: 3 },
//   features: { auth: true, analytics: true }
// }
```

目标对象会被修改,因此如需保留原始对象请使用空对象。

```typescript
import { merge } from 'es-toolkit/compat';

const original = { a: 1, b: { x: 1 } };
const source = { b: { y: 2 } };

// 保留原始对象
const result = merge({}, original, source);
// original 未被修改
```

## mergeWith

### `mergeWith(object, ...sources, customizer)`

将一个或多个源对象深度合并到目标对象中,使用自定义函数控制合并行为。如果自定义函数返回 `undefined`,则使用默认合并逻辑。适用于连接数组或应用特殊合并规则。

```typescript
import { mergeWith } from 'es-toolkit/compat';

// 数字相加
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const result = mergeWith(obj1, obj2, (objValue, srcValue) => {
  if (typeof objValue === 'number' && typeof srcValue === 'number') {
    return objValue + srcValue;
  }
});
// 结果: { a: 1, b: 5, c: 4 }

// 连接数组
const arr1 = { items: [1, 2] };
const arr2 = { items: [3, 4] };
const merged = mergeWith(arr1, arr2, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
// 结果: { items: [1, 2, 3, 4] }

// 连接字符串
const str1 = { message: 'Hello' };
const str2 = { message: 'World' };
const combined = mergeWith(str1, str2, (objValue, srcValue, key) => {
  if (key === 'message' && typeof objValue === 'string') {
    return objValue + ' ' + srcValue;
  }
});
// 结果: { message: 'Hello World' }

// 多个源对象与自定义函数
const base = { scores: [80] };
const quiz1 = { scores: [90] };
const quiz2 = { scores: [85] };
const final = mergeWith(base, quiz1, quiz2, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});
// 结果: { scores: [80, 90, 85] }
```

自定义函数接收各种参数。

```typescript
import { mergeWith } from 'es-toolkit/compat';

const customizer = (objValue, srcValue, key, object, source, stack) => {
  console.log('合并中:', key, objValue, '->', srcValue);

  // 仅对特定键进行自定义
  if (key === 'specialField') {
    return `${objValue}_${srcValue}`;
  }

  // 返回undefined使用默认合并逻辑
  return undefined;
};
```

## omit

### `omit(object, ...paths)`

创建一个排除指定键的新对象。支持深层键路径,可以使用数组一次指定多个键。适用于从对象中删除敏感信息或仅选择需要的属性。

```typescript
import { omit } from 'es-toolkit/compat';

// 删除基本键
const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
const publicUser = omit(user, 'password', 'email');
// 结果: { id: 1, name: 'John' }

// 使用数组删除多个键
const data = { a: 1, b: 2, c: 3, d: 4 };
const filtered = omit(data, ['a', 'c']);
// 结果: { b: 2, d: 4 }

// 删除深层键路径
const nested = {
  user: { profile: { name: 'John', age: 30 }, settings: { theme: 'dark' } },
  admin: true,
};
const result = omit(nested, 'user.profile.age', 'admin');
// 结果: { user: { profile: { name: 'John' }, settings: { theme: 'dark' } } }

// 组合嵌套数组和键
const complex = { a: 1, b: 2, c: 3, d: { e: 4, f: 5 } };
const simplified = omit(complex, 'a', ['b', 'c'], 'd.f');
// 结果: { d: { e: 4 } }
```

您可以自由组合数组、字符串和键路径。

```typescript
import { omit } from 'es-toolkit/compat';

const config = {
  api: { url: 'https://api.example.com', key: 'secret', timeout: 5000 },
  ui: { theme: 'dark', language: 'en' },
  debug: true,
};

// 以多种方式指定键
const cleaned = omit(config, 'api.key', ['debug'], 'ui.language');
// 结果: { api: { url: 'https://api.example.com', timeout: 5000 }, ui: { theme: 'dark' } }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { omit } from 'es-toolkit/compat';

omit(null, 'key'); // {}
omit(undefined, 'key'); // {}
```

## omitBy

### `omitBy(object, predicate)`

对对象的每个属性执行断言函数,并创建一个新对象,排除断言返回true的属性。适用于根据条件动态过滤属性。

```typescript
import { omitBy } from 'es-toolkit/compat';

// 删除特定类型的值
const data = { a: 1, b: 'remove', c: 3, d: 'keep' };
const numbers = omitBy(data, value => typeof value === 'string');
// 结果: { a: 1, c: 3 }

// 根据条件删除属性
const user = { id: 1, name: 'John', age: 0, active: false, email: '' };
const validData = omitBy(user, value => !value);
// 结果: { id: 1, name: 'John' } (删除假值)

// 按键名过滤
const settings = { userSetting: true, adminSetting: false, debugMode: true };
const userOnly = omitBy(settings, (value, key) => key.startsWith('admin'));
// 结果: { userSetting: true, debugMode: true }

// 仅删除数字属性
const mixed = { str: 'hello', num1: 42, bool: true, num2: 0, obj: {} };
const noNumbers = omitBy(mixed, value => typeof value === 'number');
// 结果: { str: 'hello', bool: true, obj: {} }

// 也可用于数组
const arr = [1, 2, 3, 4, 5];
const filtered = omitBy(arr, value => value % 2 === 0);
// 结果: { '0': 1, '2': 3, '4': 5 } (偶数索引处的奇数值)

// 利用值、键和原始对象
const scores = { math: 90, science: 75, english: 85, art: 60 };
const passingGrades = omitBy(scores, (value, key, obj) => {
  console.log(`${key}: ${value} (平均: ${Object.values(obj).reduce((a, b) => a + b) / Object.keys(obj).length})`);
  return value < 80;
});
// 结果: { math: 90, english: 85 }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { omitBy } from 'es-toolkit/compat';

omitBy(null, () => true); // {}
omitBy(undefined, () => true); // {}
```

## pick

### `pick(object, ...props)`

当您想创建一个仅包含对象中所需属性的新对象时,请使用 `pick`。可以使用数组一次传递多个键,或将它们作为单个参数逐个传递。支持深层键路径,因此您也可以选择嵌套属性。

```typescript
import { pick } from 'es-toolkit/compat';

// 基本用法
const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = pick(obj, ['a', 'c']);
// 结果: { a: 1, c: 3 }

// 作为单个参数传递
const result2 = pick(obj, 'a', 'c');
// 结果: { a: 1, c: 3 }

// 选择深层路径
const nested = {
  user: { profile: { name: 'John', age: 30 }, settings: { theme: 'dark' } },
  admin: true,
};
const userInfo = pick(nested, 'user.profile.name', 'admin');
// 结果: { user: { profile: { name: 'John' } }, admin: true }

// 混合数组和单个键
const mixed = { a: 1, b: 2, c: 3, d: { e: 4, f: 5 } };
const selected = pick(mixed, ['a', 'b'], 'c', 'd.e');
// 结果: { a: 1, b: 2, c: 3, d: { e: 4 } }

// 区分点表示法键和实际带点的键
const ambiguous = {
  'a.b': 1, // 实际键 'a.b'
  a: { b: 2, c: 3 }, // 嵌套对象
};
const dotKey = pick(ambiguous, 'a.b');
// 结果: { 'a.b': 1 } (实际键优先)
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { pick } from 'es-toolkit/compat';

pick(null, ['a', 'b']); // {}
pick(undefined, ['a', 'b']); // {}
```

## pickBy

### `pickBy(object, predicate)`

对对象的每个属性执行断言函数,并创建一个新对象,仅包含断言返回true的属性。适用于根据条件动态选择属性。

```typescript
import { pickBy } from 'es-toolkit/compat';

// 仅选择特定类型的值
const data = { a: 1, b: 'keep', c: 3, d: 'select' };
const strings = pickBy(data, value => typeof value === 'string');
// 结果: { b: 'keep', d: 'select' }

// 根据条件选择属性
const user = { id: 1, name: 'John', age: 0, active: true, email: '' };
const validData = pickBy(user, value => Boolean(value));
// 结果: { id: 1, name: 'John', active: true } (仅真值)

// 按键名过滤
const settings = { userSetting: true, adminSetting: false, debugMode: true };
const userOnly = pickBy(settings, (value, key) => key.startsWith('user'));
// 结果: { userSetting: true }

// 仅选择数字属性
const mixed = { str: 'hello', num1: 42, bool: true, num2: 0, obj: {} };
const numbersOnly = pickBy(mixed, value => typeof value === 'number');
// 结果: { num1: 42, num2: 0 }

// 也可用于数组
const arr = [1, 2, 3, 4, 5];
const evens = pickBy(arr, value => value % 2 === 0);
// 结果: { '1': 2, '3': 4 } (偶数的索引和值)

// 利用值、键和原始对象
const scores = { math: 90, science: 75, english: 85, art: 60 };
const highScores = pickBy(scores, (value, key, obj) => {
  const average = Object.values(obj).reduce((a, b) => a + b) / Object.keys(obj).length;
  return value > average;
});
// 结果: { math: 90, english: 85 }
```

不带断言函数调用时,仅选择真值。

```typescript
import { pickBy } from 'es-toolkit/compat';

const data = { a: 1, b: '', c: 0, d: 'hello', e: null, f: true };
const truthyValues = pickBy(data);
// 结果: { a: 1, d: 'hello', f: true }
```

`null` 或 `undefined` 被视为空对象。

```typescript
import { pickBy } from 'es-toolkit/compat';

pickBy(null, () => true); // {}
pickBy(undefined, () => true); // {}
```

## property

### `property(path)`

当您想创建一个从特定路径检索值的函数时,请使用 `property`。创建的函数可以在多个对象中重用,便于与数组方法一起使用。

```typescript
import { property } from 'es-toolkit/compat';

// 基本用法
const getName = property('name');
const user = { name: 'John', age: 30 };
const result = getName(user);
// 结果: 'John'

// 深层路径访问
const getNestedValue = property('user.profile.name');
const data = { user: { profile: { name: 'Alice', age: 25 } } };
const nestedResult = getNestedValue(data);
// 结果: 'Alice'

// 使用数组路径
const getByArray = property(['user', 'profile', 'name']);
const arrayResult = getByArray(data);
// 结果: 'Alice'

// 与数组方法一起使用
const users = [
  { user: { profile: { name: 'John' } } },
  { user: { profile: { name: 'Jane' } } },
  { user: { profile: { name: 'Bob' } } },
];
const names = users.map(property('user.profile.name'));
// 结果: ['John', 'Jane', 'Bob']

// 数组索引访问
const getFirstItem = property('[0]');
const items = ['first', 'second', 'third'];
const firstItem = getFirstItem(items);
// 结果: 'first'

// 数字键访问
const getIndex = property(1);
const arr = ['a', 'b', 'c'];
const secondItem = getIndex(arr);
// 结果: 'b'
```

如果路径不存在,则返回 `undefined`。

```typescript
import { property } from 'es-toolkit/compat';

const getMissing = property('nonexistent.path');
const result = getMissing({ some: 'data' });
// 结果: undefined
```

## propertyOf

### `propertyOf(object)`

当您想创建一个从单个对象的多个路径检索值的函数时,请使用 `propertyOf`。与 `property` 相反,它先固定对象,允许您查询各种路径。

```typescript
import { propertyOf } from 'es-toolkit/compat';

// 基本用法
const data = { name: 'John', age: 30, city: 'New York' };
const getValue = propertyOf(data);

const name = getValue('name');
// 结果: 'John'

const age = getValue('age');
// 结果: 30

// 深层路径访问
const complexData = {
  user: { profile: { name: 'Alice', age: 25 } },
  settings: { theme: 'dark', lang: 'en' },
};
const getComplexValue = propertyOf(complexData);

const userName = getComplexValue('user.profile.name');
// 结果: 'Alice'

const theme = getComplexValue('settings.theme');
// 结果: 'dark'

// 使用数组路径
const arrayPath = getComplexValue(['user', 'profile', 'age']);
// 结果: 25

// 将多个路径作为数组处理
const paths = ['user.profile.name', 'settings.theme', 'settings.lang'];
const values = paths.map(getComplexValue);
// 结果: ['Alice', 'dark', 'en'] (每个路径的值)

// 数组索引访问
const arrayData = [10, 20, 30];
const getArrayValue = propertyOf(arrayData);
const firstItem = getArrayValue(0);
// 结果: 10

const secondItem = getArrayValue('[1]');
// 结果: 20
```

如果路径不存在,则返回 `undefined`。

```typescript
import { propertyOf } from 'es-toolkit/compat';

const data = { a: 1, b: 2 };
const getValue = propertyOf(data);
const missing = getValue('nonexistent.path');
// 结果: undefined
```

## result

### `result(object, path, defaultValue)`

当您想从对象的路径中获取值并自动调用路径上的函数时,使用 `result`。它与 `get` 函数类似,但会执行遇到的函数,如果最终值也是函数则调用并返回结果。

```typescript
import { result } from 'es-toolkit/compat';

// 基本用法(普通值)
const obj = { a: { b: { c: 3 } } };
const value = result(obj, 'a.b.c');
// 结果: 3

// 自动函数调用
const objWithFunc = {
  compute: () => ({ value: 42 }),
  getValue: function () {
    return this.compute().value;
  },
};
const computed = result(objWithFunc, 'getValue');
// 结果: 42 (调用 getValue 函数)

// 路径上的函数调用
const nested = {
  data: () => ({ user: { getName: () => 'John' } }),
};
const name = result(nested, 'data.user.getName');
// 结果: 'John' (data() 和 getName() 都被调用)

// 使用默认值
const incomplete = { a: { b: null } };
const withDefault = result(incomplete, 'a.b.c', 'default value');
// 结果: 'default value'

// 默认值是函数的情况
const withFuncDefault = result(incomplete, 'a.b.c', () => 'computed default');
// 结果: 'computed default' (调用默认值函数)

// 使用数组路径
const arrayPath = result(objWithFunc, ['getValue']);
// 结果: 42

// 动态默认值
const dynamic = result(incomplete, 'missing.path', function () {
  return `Generated at ${new Date().toISOString()}`;
});
// 结果: 包含当前时间的字符串
```

调用函数时 `this` 上下文会被保留。

```typescript
import { result } from 'es-toolkit/compat';

const calculator = {
  multiplier: 2,
  compute: function () {
    return 10 * this.multiplier;
  },
};

const calculatedValue = result(calculator, 'compute');
// 结果: 20 (this.multiplier 被正确引用)
```

## set

### `set(object, path, value)`

当您想在对象的特定路径设置值时,请使用 `set`。如果路径的任何部分不存在,将自动创建。在处理嵌套对象或数组时很有用。

```typescript
import { set } from 'es-toolkit/compat';

// 基本用法
const obj = { a: { b: { c: 3 } } };
set(obj, 'a.b.c', 4);
console.log(obj.a.b.c); // 4

// 在数组中设置值
const arr = [1, 2, 3];
set(arr, '1', 4);
console.log(arr[1]); // 4

// 创建不存在的路径
const empty = {};
set(empty, 'user.profile.name', 'John');
console.log(empty);
// 结果: { user: { profile: { name: 'John' } } }

// 使用数组路径
const data = {};
set(data, ['nested', 'array', 0], 'first item');
console.log(data);
// 结果: { nested: { array: ['first item'] } }

// 自动创建数组索引
const list = {};
set(list, 'items[0]', 'first');
set(list, 'items[2]', 'third');
console.log(list);
// 结果: { items: ['first', undefined, 'third'] }

// 混合嵌套对象和数组
const complex = {};
set(complex, 'users[0].profile.settings.theme', 'dark');
console.log(complex);
// 结果: { users: [{ profile: { settings: { theme: 'dark' } } }] }

// 处理数字键
const numeric = {};
set(numeric, 123, 'number key');
console.log(numeric[123]); // 'number key'

// 覆盖现有值
const existing = { a: { b: 'old' } };
set(existing, 'a.b', 'new');
console.log(existing.a.b); // 'new'
```

原始对象被直接修改并返回。

```typescript
import { set } from 'es-toolkit/compat';

const original = { x: 1 };
const result = set(original, 'y', 2);

console.log(original === result); // true
console.log(original); // { x: 1, y: 2 }
```

## setWith

### `setWith(object, path, value, customizer)`

当您想在对象的特定路径设置值,同时使用自定义函数控制中间对象的类型时,请使用 `setWith`。如果自定义函数返回 `undefined`,则使用默认逻辑(数组索引使用数组,否则使用对象)。

```typescript
import { setWith } from 'es-toolkit/compat';

// 基本用法(无自定义函数)
const obj1 = {};
setWith(obj1, 'a.b.c', 4);
console.log(obj1);
// 结果: { a: { b: { c: 4 } } }

// 强制创建数组的自定义函数
const obj2 = {};
setWith(obj2, '[0][1]', 'value', () => []);
console.log(obj2);
// 结果: { '0': [undefined, 'value'] }

// 仅在特定条件下自定义
const obj3 = {};
setWith(obj3, 'a[0].b.c', 'nested', (value, key) => {
  // 仅对数字键(数组索引)返回空对象
  return typeof key === 'string' && /^\d+$/.test(key) ? {} : undefined;
});
console.log(obj3);
// 结果: { a: { '0': { b: { c: 'nested' } } } }

// 使用 Object 构造函数作为自定义函数
const obj4 = {};
setWith(obj4, 'x[0].y', 42, Object);
console.log(obj4);
// 结果: { x: { '0': { y: 42 } } }

// 复杂的自定义函数逻辑
const obj5 = {};
setWith(obj5, 'data.items[0].props.config', 'value', (value, key, object) => {
  console.log('Creating:', key, 'in', object);

  // 对特定键使用 Map
  if (key === 'props') {
    return new Map();
  }

  // 对数字键使用数组
  if (typeof key === 'string' && /^\d+$/.test(key)) {
    return [];
  }

  // 默认使用普通对象
  return {};
});

// 使用 WeakMap 作为中间对象
const obj6 = {};
setWith(obj6, 'cache.user.profile', 'data', (value, key) => {
  if (key === 'cache') {
    return new WeakMap();
  }
  return undefined; // 使用默认行为
});
```

自定义函数接收三个参数。

```typescript
import { setWith } from 'es-toolkit/compat';

const obj = {};
setWith(obj, 'a.b[0].c', 'value', (nsValue, key, nsObject) => {
  console.log('nsValue:', nsValue); // 当前值(通常为 undefined)
  console.log('key:', key); // 要创建的键
  console.log('nsObject:', nsObject); // 父对象

  // 根据特定条件返回不同的对象类型
  return key === 'b' ? [] : {};
});
```

## toDefaulted

### `toDefaulted(object, ...sources)`

当您想通过将一个或多个源对象的默认值应用到目标对象来创建新对象时,请使用 `toDefaulted`。仅为 `undefined` 的属性或来自 `Object.prototype` 的属性设置默认值。

```typescript
import { toDefaulted } from 'es-toolkit/compat';

// 基本默认值分配
const user = { name: 'John' };
const defaults = { name: 'Anonymous', age: 25, role: 'user' };
toDefaulted(user, defaults);
// => { name: 'John', age: 25, role: 'user' }

// 从多个源应用默认值
const config = { theme: 'dark' };
const defaults1 = { theme: 'light', lang: 'en' };
const defaults2 = { lang: 'ko', region: 'Asia' };
toDefaulted(config, defaults1, defaults2);
// => { theme: 'dark', lang: 'en', region: 'Asia' }
```

只有 `undefined` 值会被默认值替换,`null` 值会保留。

```typescript
import { toDefaulted } from 'es-toolkit/compat';

const data = {
  name: undefined,
  age: null,
  active: false,
};
const defaults = {
  name: 'Default',
  age: 18,
  active: true,
  role: 'user',
};

toDefaulted(data, defaults);
// => { name: 'Default', age: null, active: false, role: 'user' }
```

原始对象不会被修改;返回一个新对象。

```typescript
import { toDefaulted } from 'es-toolkit/compat';

const original = { a: 1 };
const result = toDefaulted(original, { a: 2, b: 3 });

console.log(original); // { a: 1 } (未修改)
console.log(result); // { a: 1, b: 3 } (新对象)
```

## toPairs

### `toPairs(object)`

当您想将对象自身的可枚举属性转换为 `[键, 值]` 形式的数组时,请使用 `toPairs`。不包括继承的属性。

```typescript
import { toPairs } from 'es-toolkit/compat';

// 基本对象转换
const object = { a: 1, b: 2, c: 3 };
toPairs(object);
// => [['a', 1], ['b', 2], ['c', 3]]

// 具有数字键的对象
const numbers = { 0: 'zero', 1: 'one', 2: 'two' };
toPairs(numbers);
// => [['0', 'zero'], ['1', 'one'], ['2', 'two']]
```

也可以处理 `Map` 和 `Set`。

```typescript
import { toPairs } from 'es-toolkit/compat';

// Map 对象转换
const map = new Map();
map.set('name', 'John');
map.set('age', 30);
toPairs(map);
// => [['name', 'John'], ['age', 30]]

// Set 对象转换(值与键相同)
const set = new Set([1, 2, 3]);
toPairs(set);
// => [[1, 1], [2, 2], [3, 3]]
```

安全处理 `null` 或 `undefined`。

```typescript
import { toPairs } from 'es-toolkit/compat';

toPairs(null);
// => []

toPairs(undefined);
// => []
```

## toPairsIn

### `toPairsIn(object)`

当您想将对象的所有可枚举属性(包括继承的属性)转换为 `[键, 值]` 形式的数组时,请使用 `toPairsIn`。与 `toPairs` 不同,原型链中的属性也会被包含。

```typescript
import { toPairsIn } from 'es-toolkit/compat';

// 基本对象转换
const object = { a: 1, b: 2 };
toPairsIn(object);
// => [['a', 1], ['b', 2]]

// 包括继承的属性
function Parent() {
  this.inherited = 'value';
}
Parent.prototype.proto = 'property';

const child = new Parent();
child.own = 'own';
toPairsIn(child);
// => [['inherited', 'value'], ['own', 'own'], ['proto', 'property']]
```

也可以处理 `Map` 和 `Set`。

```typescript
import { toPairsIn } from 'es-toolkit/compat';

// Map 对象转换
const map = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);
toPairsIn(map);
// => [['key1', 'value1'], ['key2', 'value2']]

// Set 对象转换
const set = new Set([1, 2, 3]);
toPairsIn(set);
// => [[1, 1], [2, 2], [3, 3]]
```

## transform

### `transform(object, iteratee, accumulator)`

当您想遍历数组或对象的每个元素,在累加器中累积值时,请使用 `transform`。当 `iteratee` 函数返回 `false` 时,迭代停止。

```typescript
import { transform } from 'es-toolkit/compat';

// 转换数组
const numbers = [2, 3, 4];
const doubled = transform(
  numbers,
  (acc, value) => {
    acc.push(value * 2);
  },
  []
);
// 返回: [4, 6, 8]

// 转换对象
const obj = { a: 1, b: 2, c: 1 };
const grouped = transform(
  obj,
  (result, value, key) => {
    (result[value] || (result[value] = [])).push(key);
  },
  {}
);
// 返回: { '1': ['a', 'c'], '2': ['b'] }
```

如果省略累加器,将自动创建空数组或空对象。

```typescript
import { transform } from 'es-toolkit/compat';

// 对于数组会创建空数组
const result1 = transform([1, 2, 3], (acc, value) => {
  acc.push(value * 2);
});
// 返回: [2, 4, 6]

// 对于对象会创建空对象
const result2 = transform({ a: 1, b: 2 }, (acc, value, key) => {
  acc[key] = value * 2;
});
// 返回: { a: 2, b: 4 }
```

可以通过在 `iteratee` 函数中返回 `false` 来停止迭代。

```typescript
import { transform } from 'es-toolkit/compat';

const numbers = [1, 2, 3, 4, 5];
const result = transform(
  numbers,
  (acc, value) => {
    if (value > 3) {
      return false; // 停止迭代
    }
    acc.push(value * 2);
  },
  []
);
// 返回: [2, 4, 6] (4 和 5 未处理)
```

如果省略 `iteratee` 函数,则返回一个空对象或空数组。

```typescript
import { transform } from 'es-toolkit/compat';

const array = [1, 2, 3];
const copy1 = transform(array);
// 返回: []

const obj = { a: 1, b: 2 };
const copy2 = transform(obj);
// 返回: {}
```

## unset

### `unset(obj, path)`

当您想要删除嵌套对象中特定路径的属性时，使用 `unset`。路径可以指定为字符串或数组。

```typescript
import { unset } from 'es-toolkit/compat';

// 使用字符串路径删除嵌套属性
const obj = { a: { b: { c: 42 } } };
unset(obj, 'a.b.c'); // => true
console.log(obj); // { a: { b: {} } }

// 使用数组路径删除嵌套属性
const obj2 = { a: { b: { c: 42 } } };
unset(obj2, ['a', 'b', 'c']); // => true
console.log(obj2); // { a: { b: {} } }
```

也可以通过数组索引删除元素。

```typescript
import { unset } from 'es-toolkit/compat';

const arr = [1, 2, 3, 4];
unset(arr, 1); // => true
console.log(arr); // [1, undefined, 3, 4]（元素被删除并变为 undefined）
```

即使属性不存在或已被删除，也会返回 `true`。

```typescript
import { unset } from 'es-toolkit/compat';

const obj = { a: { b: 1 } };
unset(obj, 'a.c'); // => true（不存在的属性）
```

`null` 或 `undefined` 对象会被安全处理。

```typescript
import { unset } from 'es-toolkit/compat';

unset(null, 'a.b'); // => true
unset(undefined, 'a.b'); // => true
```

## update

### `update(obj, path, updater)`

当您想要使用函数转换嵌套对象中特定路径的值时，使用 `update`。如果路径不存在，将自动创建。

```typescript
import { update } from 'es-toolkit/compat';

// 转换嵌套属性值
const object = { a: [{ b: { c: 3 } }] };
update(object, 'a[0].b.c', n => (n as number) * 2);
// => { a: [{ b: { c: 6 } }] }

// 使用数组路径更新
update(object, ['a', 0, 'b', 'c'], n => (n as number) + 10);
// => { a: [{ b: { c: 13 } }] }
```

如果路径不存在，将自动创建必要的嵌套结构。

```typescript
import { update } from 'es-toolkit/compat';

// 在空对象中创建嵌套结构
update({}, 'a.b.c', () => 'hello');
// => { a: { b: { c: 'hello' } } }

// 数组也会自动创建
update({}, 'a.b[0]', () => 'value');
// => { a: { b: ['value'] } }
```

可以基于现有值计算新值。

```typescript
import { update } from 'es-toolkit/compat';

const stats = { score: 100 };
update(stats, 'score', score => score * 1.1); // 增加 10%
// => { score: 110 }
```

## updateWith

### `updateWith(obj, path, updater, customizer?)`

与 `update` 类似，但可以使用自定义函数控制路径不存在时创建的中间对象的形状。

```typescript
import { updateWith } from 'es-toolkit/compat';

// 基本行为（与 update 相同）
const object = { a: [{ b: { c: 3 } }] };
updateWith(object, 'a[0].b.c', n => n * n);
// => { a: [{ b: { c: 9 } }] }

// 使用数组路径更新
updateWith(object, ['a', 0, 'b', 'c'], n => n + 10);
// => { a: [{ b: { c: 13 } }] }
```

可以使用自定义函数控制创建的中间对象的形状。

```typescript
import { updateWith } from 'es-toolkit/compat';

const object = {};

// 使用 Object 构造函数作为自定义函数（创建对象而不是数组）
updateWith(object, '[0][1]', () => 'a', Object);
// => { '0': { '1': 'a' } }
// （默认行为是 { '0': ['a'] }）
```

自定义函数接收要创建的值、键和对象作为参数。

```typescript
import { updateWith } from 'es-toolkit/compat';

const customizer = (value: any, key: string, object: any) => {
  // 对于数字键创建对象而不是数组
  if (!isNaN(Number(key))) {
    return {};
  }
};

const result = {};
updateWith(result, '[0][1]', () => 'value', customizer);
// => { '0': { '1': 'value' } }
```

如果路径已存在，则不会调用自定义函数。

```typescript
import { updateWith } from 'es-toolkit/compat';

const object = { a: { b: 1 } };
updateWith(
  object,
  'a.b',
  n => n * 2,
  () => {
    console.log('Not called'); // 不会被调用
    return {};
  }
);
// => { a: { b: 2 } }
```

## values

### `values(obj)`

当您想要将对象的所有属性值作为数组获取时，使用 `values`。它与 `Object.values` 相同，但可以安全地处理 `null` 或 `undefined`。

```typescript
import { values } from 'es-toolkit/compat';

// 获取对象值
const obj = { a: 1, b: 2, c: 3 };
values(obj); // => [1, 2, 3]

// 具有数字键的对象
const numberKeyObj = { 0: 'a', 1: 'b', 2: 'c' };
values(numberKeyObj); // => ['a', 'b', 'c']
```

也可以处理数组或类数组对象。

```typescript
import { values } from 'es-toolkit/compat';

// 数组
values([1, 2, 3]); // => [1, 2, 3]

// 字符串（类数组对象）
values('hello'); // => ['h', 'e', 'l', 'l', 'o']
```

`null` 或 `undefined` 会被视为空数组。

```typescript
import { values } from 'es-toolkit/compat';

values(null); // => []
values(undefined); // => []
```

仅返回可枚举属性。

```typescript
import { values } from 'es-toolkit/compat';

const obj = Object.create(
  { inherited: 'not included' },
  {
    own: { value: 'included', enumerable: true },
    nonEnum: { value: 'not included', enumerable: false },
  }
);

values(obj); // => ['included']
```

## valuesIn

### `valuesIn(object)`

当您想从对象获取所有属性值作为数组时,请使用 `valuesIn`。与普通的 `Object.values` 不同,它还包括从原型链继承的属性值。

```typescript
import { valuesIn } from 'es-toolkit/compat';

const obj = { a: 1, b: 2, c: 3 };
valuesIn(obj); // [1, 2, 3]

// 也可以处理数组
valuesIn([1, 2, 3]); // [1, 2, 3]
```

包括从原型继承的属性。

```typescript
import { valuesIn } from 'es-toolkit/compat';

function Parent() {
  this.a = 1;
}
Parent.prototype.inherited = 'fromParent';

function Child() {
  Parent.call(this);
  this.b = 2;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.childProp = 'childValue';

const obj = new Child();
valuesIn(obj); // [1, 2, 'childValue', 'fromParent'] (排除 constructor)
```

将 `null` 或 `undefined` 处理为空数组。

```typescript
import { valuesIn } from 'es-toolkit/compat';

valuesIn(null); // []
valuesIn(undefined); // []
```

## conforms

### `conforms(source)`

当您需要一次性检查多个属性的条件时，请使用 `conforms`。此函数生成一个验证函数，在后续检查多个对象时非常有用。

```typescript
import { conforms } from 'es-toolkit/compat';

// 定义条件函数
const isPositive = n => n > 0;
const isEven = n => n % 2 === 0;
const isString = s => typeof s === 'string';

// 创建包含多个条件的验证函数
const validator = conforms({
  a: isPositive,
  b: isEven,
  c: isString,
});

// 验证对象
validator({ a: 2, b: 4, c: 'hello' }); // true (满足所有条件)
validator({ a: -1, b: 4, c: 'hello' }); // false (a 不是正数)
validator({ a: 2, b: 3, c: 'hello' }); // false (b 不是偶数)
validator({ a: 2, b: 4, c: 123 }); // false (c 不是字符串)

// 在数组过滤中使用
const users = [
  { age: 25, score: 80, name: 'Alice' },
  { age: 17, score: 95, name: 'Bob' },
  { age: 30, score: 75, name: 'Charlie' },
];

const adultHighScorer = conforms({
  age: n => n >= 18,
  score: n => n >= 80,
});

const filteredUsers = users.filter(adultHighScorer);
// [{ age: 25, score: 80, name: 'Alice' }]
```

## conformsTo

### `conformsTo(target, source)`

当您需要检查对象的属性是否都满足指定条件时，请使用 `conformsTo`。对每个属性应用相应的条件函数并确认结果。

```typescript
import { conformsTo } from 'es-toolkit/compat';

// 基本用法
const object = { a: 1, b: 2 };
const conditions = {
  a: n => n > 0,
  b: n => n > 1,
};

conformsTo(object, conditions); // true (满足所有条件)

// 多种条件
const user = { name: 'Alice', age: 25, active: true };
const userValidation = {
  name: s => typeof s === 'string' && s.length > 0,
  age: n => typeof n === 'number' && n >= 18,
  active: b => typeof b === 'boolean',
};

conformsTo(user, userValidation); // true

// 不满足条件的情况
const invalidUser = { name: '', age: 15, active: 'yes' };
conformsTo(invalidUser, userValidation); // false

// 部分条件检查
const partialConditions = {
  age: n => n >= 21,
};
conformsTo(user, partialConditions); // true (仅检查 age)

// 缺少属性的情况
const incompleteObject = { a: 1 }; // 没有 b 属性
const strictConditions = {
  a: n => n > 0,
  b: n => n > 0,
};
conformsTo(incompleteObject, strictConditions); // false (没有 b 属性)
```

## isArguments

### `isArguments(value)`

当您需要检查给定值是否为函数的 arguments 对象时，请使用 `isArguments`。此函数在 TypeScript 中也作为类型守卫工作，将值的类型缩小为 `IArguments`。

```typescript
import { isArguments } from 'es-toolkit/compat';

// 在普通函数中
function normalFunction() {
  return isArguments(arguments); // true
}

// 在严格模式中
function strictFunction() {
  'use strict';
  return isArguments(arguments); // true
}

// 非 arguments 的值
isArguments([1, 2, 3]); // false
isArguments({ 0: 'a', 1: 'b', length: 2 }); // false
isArguments(null); // false
isArguments(undefined); // false

// 实际使用示例
function example() {
  if (isArguments(arguments)) {
    console.log('This is an arguments object');
    console.log('Length:', arguments.length);
  }
}
```

## isArray

### `isArray(value)`

当您想要检查值是否为数组时，请使用 `isArray`。此函数也可以在 TypeScript 中用作类型守卫。

```typescript
import { isArray } from 'es-toolkit/compat';

// 检查数组
isArray([1, 2, 3]);
// Returns: true

isArray('abc');
// Returns: false

isArray(() => {});
// Returns: false

// 与对象区分
isArray({ 0: 'a', 1: 'b', length: 2 });
// Returns: false

isArray(null);
// Returns: false
```

## isArrayBuffer

### `isArrayBuffer(value)`

当您想要类型安全地检查值是否为 ArrayBuffer 时，请使用 `isArrayBuffer`。在 TypeScript 中也作为类型守卫工作。

```typescript
import { isArrayBuffer } from 'es-toolkit/compat';

// 检查 ArrayBuffer
const buffer = new ArrayBuffer(16);
isArrayBuffer(buffer); // true

// 其他类型返回 false
isArrayBuffer(new Array()); // false
isArrayBuffer(new Map()); // false
isArrayBuffer({}); // false
isArrayBuffer('hello'); // false
isArrayBuffer(123); // false
isArrayBuffer(null); // false
isArrayBuffer(undefined); // false
```

## isArrayLike

### `isArrayLike(value)`

当您需要检查给定值是否为类数组对象时，请使用 `isArrayLike`。数组、字符串、arguments 对象、NodeList 等都属于类数组对象。

```typescript
import { isArrayLike } from 'es-toolkit/compat';

// 数组和字符串
isArrayLike([1, 2, 3]); // true
isArrayLike('abc'); // true
isArrayLike(''); // true

// 类数组对象
isArrayLike({ 0: 'a', 1: 'b', length: 2 }); // true
isArrayLike({ length: 0 }); // true

// arguments 对象
function example() {
  return isArrayLike(arguments); // true
}

// 非数组对象
isArrayLike({}); // false
isArrayLike({ length: 'invalid' }); // false
isArrayLike(null); // false
isArrayLike(undefined); // false
isArrayLike(() => {}); // false
isArrayLike(123); // false
```

## isArrayLikeObject

### `isArrayLikeObject(value)`

当您需要检查给定值是否为非原始值的类数组对象时，请使用 `isArrayLikeObject`。数组、arguments 对象、NodeList 等属于此类，但字符串由于是原始值而被排除。

```typescript
import { isArrayLikeObject } from 'es-toolkit/compat';

// 类数组对象（非原始值）
isArrayLikeObject([1, 2, 3]); // true
isArrayLikeObject({ 0: 'a', 1: 'b', length: 2 }); // true
isArrayLikeObject({ length: 0 }); // true

// arguments 对象
function example() {
  return isArrayLikeObject(arguments); // true
}

// NodeList 或 HTMLCollection（在浏览器中）
isArrayLikeObject(document.querySelectorAll('div')); // true

// 原始值返回 false（包括字符串）
isArrayLikeObject('abc'); // false
isArrayLikeObject(''); // false
isArrayLikeObject(123); // false
isArrayLikeObject(true); // false

// 其他对象
isArrayLikeObject({}); // false
isArrayLikeObject(null); // false
isArrayLikeObject(undefined); // false
isArrayLikeObject(() => {}); // false
```

## isBoolean

### `isBoolean(value)`

当您想要类型安全地检查值是否为布尔类型时，请使用 `isBoolean`。检查原始布尔值和 Boolean 对象包装器。在 TypeScript 中也作为类型守卫工作。

```typescript
import { isBoolean } from 'es-toolkit/compat';

// 原始布尔值
isBoolean(true); // true
isBoolean(false); // true

// Boolean 对象包装器
isBoolean(new Boolean(true)); // true
isBoolean(new Boolean(false)); // true

// 其他类型返回 false
isBoolean(0); // false
isBoolean(1); // false
isBoolean('true'); // false
isBoolean('false'); // false
isBoolean(null); // false
isBoolean(undefined); // false
isBoolean({}); // false
isBoolean([]); // false
```

## isBuffer

### `isBuffer(value)`

当您想要类型安全地检查值是否为 Buffer 实例时，请使用 `isBuffer`。在 Node.js 环境中处理 Buffer 对象时很有用。在 TypeScript 中也作为类型守卫工作。

```typescript
import { isBuffer } from 'es-toolkit/compat';

// 检查 Buffer 实例
const buffer = Buffer.from('hello');
isBuffer(buffer); // true

// 其他类型返回 false
isBuffer('hello'); // false
isBuffer([1, 2, 3]); // false
isBuffer(new Uint8Array([1, 2, 3])); // false
isBuffer({}); // false
isBuffer(null); // false
isBuffer(undefined); // false
```

## isDate

### `isDate(value)`

当你想要类型安全地检查值是否为 Date 对象时使用 `isDate`。在 TypeScript 中它也可以作为类型守卫使用。

```typescript
import { isDate } from 'es-toolkit/compat';

// 检查 Date 对象
const date = new Date();
isDate(date); // true

// 无效的 Date 也被识别为 Date 对象
const invalidDate = new Date('invalid');
isDate(invalidDate); // true

// 其他类型返回 false
isDate('2024-01-01'); // false
isDate(1640995200000); // false
isDate({}); // false
isDate(null); // false
isDate(undefined); // false
```

## isElement

### `isElement(value)`

当需要检查给定值是否为 DOM 元素时使用 `isElement`。由于此函数使用结构性检查，结果可能不完全准确。

```typescript
import { isElement } from 'es-toolkit/compat';

// DOM 元素
isElement(document.body); // true
isElement(document.createElement('div')); // true
isElement(document.querySelector('p')); // true (如果元素存在)

// 非 DOM 元素的值
isElement('<body>'); // false
isElement({}); // false
isElement(null); // false
isElement(undefined); // false

// 文本节点或其他节点类型
isElement(document.createTextNode('text')); // false
isElement(document.createComment('comment')); // false
```

## isEmpty

### `isEmpty(value)`

当您需要检查各种类型的值是否为空时，请使用 `isEmpty`。可以处理字符串、数组、对象、Map、Set 等。

```typescript
import { isEmpty } from 'es-toolkit/compat';

// 检查字符串
isEmpty(''); // true
isEmpty('hello'); // false

// 检查数组
isEmpty([]); // true
isEmpty([1, 2, 3]); // false

// 检查对象
isEmpty({}); // true
isEmpty({ a: 1 }); // false

// 检查 Map 和 Set
isEmpty(new Map()); // true
isEmpty(new Set()); // true
isEmpty(new Map([['key', 'value']])); // false
isEmpty(new Set([1, 2, 3])); // false

// null 和 undefined
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty(); // true

// 类数组对象
isEmpty({ 0: 'a', length: 1 }); // false
isEmpty({ length: 0 }); // false
```

原始值都被视为空值：

```typescript
import { isEmpty } from 'es-toolkit/compat';

isEmpty(0); // true
isEmpty(false); // true
isEmpty(123); // true
isEmpty('text'); // false (字符串按长度判断)
```

## isEqual

### `isEqual(a, b)`

当需要深度比较两个值是否相等时使用 `isEqual`。它会比较复杂类型如 Date、RegExp、对象、数组等的内容。

```typescript
import { isEqual } from 'es-toolkit/compat';

// 基本类型比较
isEqual(1, 1); // true
isEqual('hello', 'hello'); // true
isEqual(true, true); // true

// 对象深度比较
isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
isEqual({ a: 1 }, { a: 1, b: undefined }); // false

// 数组深度比较
isEqual([1, 2, 3], [1, 2, 3]); // true
isEqual([1, [2, 3]], [1, [2, 3]]); // true

// Date 对象比较
isEqual(new Date('2020-01-01'), new Date('2020-01-01')); // true
isEqual(new Date('2020-01-01'), new Date('2020-01-02')); // false

// RegExp 对象比较
isEqual(/abc/g, /abc/g); // true
isEqual(/abc/g, /abc/i); // false
```

它也会递归比较嵌套的对象和数组。

```typescript
import { isEqual } from 'es-toolkit/compat';

const obj1 = {
  user: {
    name: 'John',
    details: {
      age: 30,
      hobbies: ['reading', 'gaming'],
    },
  },
};

const obj2 = {
  user: {
    name: 'John',
    details: {
      age: 30,
      hobbies: ['reading', 'gaming'],
    },
  },
};

isEqual(obj1, obj2); // true
```

## isEqualWith

### `isEqualWith(a, b, areValuesEqual?)`

使用自定义比较函数深度比较两个值。如果自定义函数返回布尔值，则使用该结果；如果返回 `undefined`，则使用默认相等性比较。

自定义比较函数也会用于比较对象、数组、Map、Set 等复杂结构内部的值，确保深度比较。

```typescript
import { isEqualWith } from 'es-toolkit/compat';

// 忽略大小写的字符串比较
const customizer = (a: any, b: any) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.toLowerCase() === b.toLowerCase();
  }
};

isEqualWith('Hello', 'hello', customizer); // true
isEqualWith({ a: 'Hello' }, { a: 'hello' }, customizer); // true

// 按绝对值比较数字
const absCustomizer = (a: any, b: any) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a) === Math.abs(b);
  }
};

isEqualWith([-1, 2], [1, -2], absCustomizer); // true

// 复杂对象比较
const obj1 = {
  name: 'JOHN',
  details: { age: 30, city: 'NYC' },
};
const obj2 = {
  name: 'john',
  details: { age: 30, city: 'nyc' },
};

isEqualWith(obj1, obj2, customizer); // true
```

对 Map 和 Set 进行特殊处理。

```typescript
import { isEqualWith } from 'es-toolkit/compat';

const customizer = (a: any, b: any) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.toLowerCase() === b.toLowerCase();
  }
};

const map1 = new Map([['KEY', 'value']]);
const map2 = new Map([['key', 'value']]);
isEqualWith(map1, map2, customizer); // true

const set1 = new Set(['HELLO']);
const set2 = new Set(['hello']);
isEqualWith(set1, set2, customizer); // true
```

## isError

### `isError(value)`

当需要类型安全地检查值是否为 Error 对象时使用 `isError`。在 TypeScript 中它也可以作为类型守卫使用。

```typescript
import { isError } from 'es-toolkit/compat';

// 检查 Error 对象
isError(new Error()); // true
isError(new TypeError('Type error')); // true
isError(new ReferenceError('Reference error')); // true

// 继承 Error 的自定义错误
class CustomError extends Error {}
isError(new CustomError()); // true

// 其他类型返回 false
isError('Error'); // false
isError({ name: 'Error', message: 'Something went wrong' }); // false
isError({}); // false
isError(null); // false
isError(undefined); // false
```

## isFinite

### `isFinite(value)`

当需要检查给定值是否为有限数字时使用 `isFinite`。此函数在 TypeScript 中也可以作为类型守卫使用，将值的类型缩小为 `number`。

```typescript
import { isFinite } from 'es-toolkit/compat';

// 有限数字
isFinite(100); // true
isFinite(-50); // true
isFinite(3.14); // true
isFinite(0); // true

// 无穷大返回 false
isFinite(Infinity); // false
isFinite(-Infinity); // false

// NaN 也返回 false
isFinite(NaN); // false

// 其他类型也返回 false
isFinite('100'); // false
isFinite([]); // false
isFinite({}); // false
isFinite(null); // false
isFinite(undefined); // false
```

## isFunction

### `isFunction(value)`

当需要类型安全地检查值是否为函数时使用 `isFunction`。在 TypeScript 中它也可以作为类型守卫使用。

```typescript
import { isFunction } from 'es-toolkit/compat';

// 普通函数
isFunction(function () {}); // true
isFunction(() => {}); // true

// 内置函数和构造函数
isFunction(Array.prototype.slice); // true
isFunction(Proxy); // true
isFunction(Int8Array); // true

// 异步函数和生成器函数
isFunction(async function () {}); // true
isFunction(function* () {}); // true

// 其他类型返回 false
isFunction('function'); // false
isFunction({}); // false
isFunction([]); // false
isFunction(null); // false
isFunction(undefined); // false
isFunction(123); // false
```

## isInteger

### `isInteger(value)`

当需要检查给定值是否为整数时使用 `isInteger`。此函数在 TypeScript 中也可以作为类型守卫使用，将值的类型缩小为 `number`。

```typescript
import { isInteger } from 'es-toolkit/compat';

// 整数值检查
isInteger(3); // true
isInteger(-5); // true
isInteger(0); // true

// 小数值返回 false
isInteger(3.14); // false
isInteger(-2.5); // false

// 无穷大返回 false
isInteger(Infinity); // false
isInteger(-Infinity); // false

// 其他类型也返回 false
isInteger('3'); // false
isInteger([]); // false
isInteger({}); // false
```

## isLength

### `isLength(value)`

当需要检查值是否为有效长度时使用 `isLength`。有效长度必须是数字类型、非负整数，且不超过 JavaScript 的最大安全整数（`Number.MAX_SAFE_INTEGER`）。在 TypeScript 中它也可以作为类型守卫使用。

```typescript
import { isLength } from 'es-toolkit/compat';

// 有效长度
isLength(0); // true
isLength(42); // true
isLength(100); // true
isLength(Number.MAX_SAFE_INTEGER); // true

// 无效长度
isLength(-1); // false (负数)
isLength(1.5); // false (非整数)
isLength(Number.MAX_SAFE_INTEGER + 1); // false (超出安全范围)
isLength('3'); // false (字符串)
isLength(null); // false
isLength(undefined); // false
isLength({}); // false
isLength([]); // false
```

在验证数组或字符串的 length 属性是否有效时很有用。

```typescript
import { isLength } from 'es-toolkit/compat';

function validateArrayLength(arr: any[]) {
  if (isLength(arr.length)) {
    console.log(`数组长度 ${arr.length} 是有效的`);
    return true;
  }
  return false;
}

validateArrayLength([1, 2, 3]); // "数组长度 3 是有效的"
```

## isMap

### `isMap(value)`

当需要类型安全地检查值是否为 Map 时使用 `isMap`。在 TypeScript 中它也可以作为类型守卫使用。

```typescript
import { isMap } from 'es-toolkit/compat';

// 检查 Map
const map = new Map();
isMap(map); // true

// 其他类型返回 false
isMap(new Set()); // false
isMap(new WeakMap()); // false
isMap({}); // false
isMap([]); // false
isMap('map'); // false
isMap(123); // false
isMap(null); // false
isMap(undefined); // false
```

它也可以区分 Map 和其他类似的集合。

```typescript
import { isMap } from 'es-toolkit/compat';

// Map vs Set vs WeakMap
isMap(new Map([['key', 'value']])); // true
isMap(new Set(['value'])); // false
isMap(new WeakMap()); // false

// Map vs 普通对象
isMap({}); // false
isMap({ key: 'value' }); // false
isMap(Object.create(null)); // false
```

## isMatch

### `isMatch(target, source)`

使用 `isMatch` 检查对象或数组是否部分匹配另一个对象的结构和值。不需要完全相同，只要 source 的所有属性都存在于 target 中且具有相同的值即可。

```typescript
import { isMatch } from 'es-toolkit/compat';

// 对象部分匹配
isMatch({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }); // true (a, b 匹配)
isMatch({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }); // false (target 中没有 c)

// 嵌套对象
isMatch({ user: { name: 'Alice', age: 25, city: 'Seoul' } }, { user: { name: 'Alice', age: 25 } }); // true

// 数组部分匹配（顺序无关）
isMatch([1, 2, 3, 4], [2, 4]); // true (数组中有 2 和 4)
isMatch([1, 2, 3], [1, 2, 3]); // true (完全匹配)
isMatch([1, 2], [1, 2, 3]); // false (target 中没有 3)

// Map 部分匹配
const targetMap = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const sourceMap = new Map([
  ['a', 1],
  ['b', 2],
]);
isMatch(targetMap, sourceMap); // true

// Set 部分匹配
const targetSet = new Set([1, 2, 3, 4]);
const sourceSet = new Set([2, 4]);
isMatch(targetSet, sourceSet); // true

// 空 source 总是返回 true
isMatch({ a: 1 }, {}); // true
isMatch([1, 2, 3], []); // true
```

更直接且快速的方法：

```typescript
// 完全相等性检查（更快）
import { isEqual } from 'es-toolkit';

isEqual(obj1, obj2);

// 特定属性检查（更明确）
target.a === source.a && target.b === source.b;

// 对象结构检查
Object.keys(source).every(key => target[key] === source[key]);
```

## isMatchWith

### `isMatchWith(target, source, customizer)`

当需要自定义比较逻辑时使用 `isMatchWith`。您可以直接控制每个属性的比较。

```typescript
import { isMatchWith } from 'es-toolkit/compat';

// 不区分大小写的字符串比较
const caseInsensitiveCompare = (objVal, srcVal) => {
  if (typeof objVal === 'string' && typeof srcVal === 'string') {
    return objVal.toLowerCase() === srcVal.toLowerCase();
  }
  return undefined; // 使用默认行为
};

isMatchWith({ name: 'ALICE', age: 25 }, { name: 'alice' }, caseInsensitiveCompare); // true

// 数字范围比较
const rangeCompare = (objVal, srcVal, key) => {
  if (key === 'age' && typeof srcVal === 'object' && srcVal.min !== undefined) {
    return objVal >= srcVal.min && objVal <= srcVal.max;
  }
  return undefined;
};

isMatchWith({ name: 'John', age: 25 }, { age: { min: 18, max: 30 } }, rangeCompare); // true

// 数组长度比较
const lengthCompare = (objVal, srcVal, key) => {
  if (key === 'items' && Array.isArray(objVal) && typeof srcVal === 'number') {
    return objVal.length === srcVal;
  }
  return undefined;
};

isMatchWith({ items: ['a', 'b', 'c'], count: 3 }, { items: 3 }, lengthCompare); // true

// 复杂的条件比较
const conditionalCompare = (objVal, srcVal, key, object, source) => {
  // 仅在特定键上应用特殊逻辑
  if (key === 'status') {
    return srcVal === 'active' || objVal === 'any';
  }

  // 嵌套对象中的特殊处理
  if (typeof srcVal === 'object' && srcVal !== null && objVal?.special) {
    return srcVal.id === objVal.special;
  }

  return undefined; // 默认行为
};

isMatchWith({ user: { special: 123 }, status: 'any' }, { user: { id: 123, status: 'active' } }, conditionalCompare); // true
```

## isNaN

### `isNaN(value)`

当您想检查值是否为 `NaN` 时使用 `isNaN`。

```typescript
import { isNaN } from 'es-toolkit/compat';

// NaN 检查
isNaN(NaN);
// 返回: true

isNaN(Number.NaN);
// 返回: true

// 其他值
isNaN(undefined);
// 返回: false

isNaN(null);
// 返回: false

isNaN(0);
// 返回: false

isNaN('NaN');
// 返回: false
```

## isNative

### `isNative(value)`

当您想检查给定值是否为 JavaScript 引擎实现的原生函数时使用 `isNative`。可以区分浏览器或 Node.js 提供的内置函数。

```typescript
import { isNative } from 'es-toolkit/compat';

// 原生函数
isNative(Array.prototype.push); // true
isNative(Object.keys); // true
isNative(Math.max); // true
isNative(JSON.parse); // true
isNative(console.log); // true (在浏览器/Node.js 环境中)

// 用户定义函数
isNative(function () {}); // false
isNative(() => {}); // false
isNative(function customFunction() {}); // false

// 库函数
isNative(require('lodash').map); // false
isNative(require('es-toolkit').chunk); // false

// 非函数值
isNative({}); // false
isNative([]); // false
isNative('function'); // false
isNative(123); // false
isNative(null); // false

// 绑定函数
const boundFunction = Array.prototype.push.bind([]);
isNative(boundFunction); // true (绑定函数是原生的)

// 方法
const obj = { method: Array.prototype.push };
isNative(obj.method); // true (仍然是原生函数)
```

## isNil

### `isNil(x)`

当您想类型安全地检查值是否为 `null` 或 `undefined` 时使用 `isNil`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isNil } from 'es-toolkit/compat';

// null 和 undefined 返回 true
isNil(null); // true
isNil(undefined); // true

// 所有其他值返回 false
isNil(0); // false
isNil(''); // false
isNil(false); // false
isNil([]); // false
isNil({}); // false
isNil('hello'); // false
isNil(42); // false
```

与被认为是假值但不是 `null` 或 `undefined` 的值进行区分。

```typescript
import { isNil } from 'es-toolkit/compat';

// 被认为是假值但不是 null/undefined 的值
isNil(0); // false
isNil(''); // false
isNil(false); // false
isNil(NaN); // false

// 只有 null 和 undefined 返回 true
isNil(null); // true
isNil(undefined); // true
```

## isNull

### `isNull(value)`

当您想类型安全地检查值是否恰好为 `null` 时使用 `isNull`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isNull } from 'es-toolkit/compat';

// 只有 null 返回 true
isNull(null); // true

// undefined 也返回 false
isNull(undefined); // false

// 所有其他值也返回 false
isNull(0); // false
isNull(''); // false
isNull(false); // false
isNull([]); // false
isNull({}); // false
isNull('null'); // false
isNull(NaN); // false
```

可以区分检查 `null` 和 `undefined`。

```typescript
import { isNull } from 'es-toolkit/compat';

function handleValue(value: string | null | undefined) {
  if (isNull(value)) {
    console.log('值明确为 null');
  } else if (value === undefined) {
    console.log('值为 undefined');
  } else {
    console.log(`有值: ${value}`);
  }
}

handleValue(null); // "值明确为 null"
handleValue(undefined); // "值为 undefined"
handleValue('hello'); // "有值: hello"
```

## isNumber

### `isNumber(value)`

当您想检查值是否为数字时使用 `isNumber`。此函数将原始数字和 Number 对象都识别为数字。

```typescript
import { isNumber } from 'es-toolkit/compat';

// 原始数字
isNumber(123);
// 返回: true

isNumber(3.14);
// 返回: true

isNumber(NaN);
// 返回: true

// Number 对象
isNumber(new Number(42));
// 返回: true

// 其他类型
isNumber('123');
// 返回: false

isNumber(true);
// 返回: false

isNumber(null);
// 返回: false
```

## isObject

### `isObject(value)`

当您想检查值是否为对象时使用 `isObject`。在 JavaScript 中，数组、函数、对象、正则表达式、Date 等都被视为对象。

```typescript
import { isObject } from 'es-toolkit/compat';

// 普通对象
isObject({});
// 返回: true

// 数组也是对象
isObject([1, 2, 3]);
// 返回: true

// 函数也是对象
isObject(() => {});
// 返回: true

// Date 也是对象
isObject(new Date());
// 返回: true

// null 不是对象
isObject(null);
// 返回: false

// 原始类型不是对象
isObject('string');
// 返回: false

isObject(123);
// 返回: false
```

## isObjectLike

### `isObjectLike(value)`

当您想检查给定值是否为类似对象的值时使用 `isObjectLike`。类似对象的值是 `typeof` 运算符的结果为 `'object'` 且不为 `null` 的值。

```typescript
import { isObjectLike } from 'es-toolkit/compat';

// 类似对象的值
isObjectLike({ a: 1 }); // true
isObjectLike([1, 2, 3]); // true
isObjectLike(new Date()); // true
isObjectLike(/regex/); // true
isObjectLike(new Map()); // true
isObjectLike(new Set()); // true

// 不类似对象的值
isObjectLike('abc'); // false
isObjectLike(123); // false
isObjectLike(true); // false
isObjectLike(() => {}); // false
isObjectLike(Symbol('sym')); // false

// 特殊情况
isObjectLike(null); // false (null 的 typeof 为 'object' 但不是类似对象)
isObjectLike(undefined); // false
```

## isPlainObject

### `isPlainObject(object)`

当您想检查值是否为纯对象时使用 `isPlainObject`。纯对象是通过 `{}` 字面量、`new Object()` 或 `Object.create(null)` 创建的对象。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isPlainObject } from 'es-toolkit/compat';

// 纯对象
isPlainObject({}); // true
isPlainObject(new Object()); // true
isPlainObject(Object.create(null)); // true
isPlainObject({ name: 'John', age: 30 }); // true

// 不是纯对象的值
isPlainObject([]); // false (数组)
isPlainObject(new Date()); // false (Date 实例)
isPlainObject(new Map()); // false (Map 实例)
isPlainObject(new Set()); // false (Set 实例)
isPlainObject(/regex/); // false (正则表达式)
isPlainObject(function () {}); // false (函数)
isPlainObject(null); // false
isPlainObject(undefined); // false
isPlainObject('object'); // false (字符串)
isPlainObject(42); // false (数字)
```

区分类实例和纯对象。

```typescript
import { isPlainObject } from 'es-toolkit/compat';

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person('John');
const plainObj = { name: 'John' };

isPlainObject(person); // false (类实例)
isPlainObject(plainObj); // true (纯对象)
```

正确处理自定义 `Symbol.toStringTag` 属性。

```typescript
import { isPlainObject } from 'es-toolkit/compat';

// 可写的 Symbol.toStringTag
const obj1 = {};
obj1[Symbol.toStringTag] = 'CustomObject';
isPlainObject(obj1); // true

// 只读的 Symbol.toStringTag (内置对象)
const date = new Date();
isPlainObject(date); // false
```

## isRegExp

### `isRegExp(value)`

当您想类型安全地检查值是否为正则表达式时使用 `isRegExp`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isRegExp } from 'es-toolkit/compat';

// 正则表达式
isRegExp(/abc/); // true
isRegExp(new RegExp('abc')); // true
isRegExp(/[a-z]+/g); // true
isRegExp(/pattern/gi); // true

// 其他类型返回 false
isRegExp('/abc/'); // false (字符串)
isRegExp('pattern'); // false (字符串)
isRegExp({}); // false (对象)
isRegExp([]); // false (数组)
isRegExp(null); // false
isRegExp(undefined); // false
isRegExp(123); // false (数字)
```

区分正则表达式字符串和实际正则表达式对象。

```typescript
import { isRegExp } from 'es-toolkit/compat';

// 正则表达式 vs 正则表达式字符串
isRegExp(/test/); // true
isRegExp('/test/'); // false
isRegExp('\\d+'); // false
isRegExp('/\\d+/g'); // false

// 各种正则表达式标志
isRegExp(/test/i); // true (忽略大小写)
isRegExp(/test/g); // true (全局搜索)
isRegExp(/test/m); // true (多行)
isRegExp(/test/gim); // true (所有标志组合)
```

也识别动态创建的正则表达式。

```typescript
import { isRegExp } from 'es-toolkit/compat';

// 通过 RegExp 构造函数创建的正则表达式
const dynamicRegex = new RegExp('\\d{3}-\\d{4}', 'g');
isRegExp(dynamicRegex); // true

// 通过字符串创建的正则表达式
const pattern = 'hello';
const flags = 'gi';
const regex = new RegExp(pattern, flags);
isRegExp(regex); // true
```

## isSafeInteger

### `isSafeInteger(value)`

当您想检查给定值是否为安全整数时使用 `isSafeInteger`。安全整数是介于 -(2^53 - 1) 和 (2^53 - 1) 之间的整数，可以在 JavaScript 中精确表示。

```typescript
import { isSafeInteger } from 'es-toolkit/compat';

// 安全整数
isSafeInteger(3); // true
isSafeInteger(-42); // true
isSafeInteger(0); // true
isSafeInteger(Number.MAX_SAFE_INTEGER); // true (9007199254740991)
isSafeInteger(Number.MIN_SAFE_INTEGER); // true (-9007199254740991)

// 不安全的整数
isSafeInteger(Number.MAX_SAFE_INTEGER + 1); // false
isSafeInteger(Number.MIN_SAFE_INTEGER - 1); // false
isSafeInteger(9007199254740992); // false

// 非整数值
isSafeInteger(3.14); // false
isSafeInteger('3'); // false
isSafeInteger(1n); // false (BigInt)
isSafeInteger([]); // false
isSafeInteger({}); // false
isSafeInteger(null); // false
isSafeInteger(undefined); // false

// 无穷大和 NaN
isSafeInteger(Infinity); // false
isSafeInteger(-Infinity); // false
isSafeInteger(NaN); // false
```

## isSet

### `isSet(value)`

当您想类型安全地检查值是否为 Set 时使用 `isSet`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isSet } from 'es-toolkit/compat';

// Set 检查
const set = new Set();
isSet(set); // true

// 其他类型返回 false
isSet(new Map()); // false
isSet(new WeakSet()); // false
isSet([]); // false
isSet({}); // false
isSet('set'); // false
isSet(123); // false
isSet(null); // false
isSet(undefined); // false
```

也与其他类似 Set 的集合进行区分。

```typescript
import { isSet } from 'es-toolkit/compat';

// Set vs Map vs WeakSet
isSet(new Set([1, 2, 3])); // true
isSet(new Map([['key', 'value']])); // false
isSet(new WeakSet()); // false

// Set vs 数组
isSet(new Set([1, 2, 3])); // true
isSet([1, 2, 3]); // false

// Set vs 普通对象
isSet(new Set()); // true
isSet({}); // false
isSet(Object.create(null)); // false
```

## isString

### `isString(value)`

当您想类型安全地检查值是否为字符串时使用 `isString`。检查原始字符串和 String 对象包装器。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isString } from 'es-toolkit/compat';

// 原始字符串
isString('hello'); // true
isString(''); // true
isString('123'); // true

// String 对象包装器
isString(new String('hello')); // true
isString(new String('')); // true

// 其他类型返回 false
isString(123); // false
isString(true); // false
isString(null); // false
isString(undefined); // false
isString({}); // false
isString([]); // false
isString(Symbol('test')); // false
```

与看起来类似字符串的其他类型进行区分。

```typescript
import { isString } from 'es-toolkit/compat';

// 字符串 vs 数字
isString('123'); // true
isString(123); // false

// 字符串 vs 布尔值
isString('true'); // true
isString(true); // false

// 字符串 vs null/undefined
isString('null'); // true
isString(null); // false
isString('undefined'); // true
isString(undefined); // false
```

## isSymbol

### `isSymbol(value)`

当您想类型安全地检查值是否为符号时使用 `isSymbol`。检查原始符号和 Symbol 对象包装器。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isSymbol } from 'es-toolkit/compat';

// 原始符号
isSymbol(Symbol('test')); // true
isSymbol(Symbol.for('global')); // true
isSymbol(Symbol.iterator); // true

// Symbol 对象包装器
isSymbol(Object(Symbol('test'))); // true

// 其他类型返回 false
isSymbol('symbol'); // false
isSymbol(123); // false
isSymbol(true); // false
isSymbol(null); // false
isSymbol(undefined); // false
isSymbol({}); // false
isSymbol([]); // false
```

也正确识别各种内置符号。

```typescript
import { isSymbol } from 'es-toolkit/compat';

// 众所周知的符号
isSymbol(Symbol.iterator); // true
isSymbol(Symbol.asyncIterator); // true
isSymbol(Symbol.toStringTag); // true
isSymbol(Symbol.hasInstance); // true
isSymbol(Symbol.toPrimitive); // true

// 全局符号
isSymbol(Symbol.for('myGlobalSymbol')); // true

// 用户定义符号
const mySymbol = Symbol('mySymbol');
isSymbol(mySymbol); // true
```

## isTypedArray

### `isTypedArray(x)`

当您想检查值是否为类型数组时使用 `isTypedArray`。类型数组是处理二进制数据的特殊数组类型。

```typescript
import { isTypedArray } from 'es-toolkit/compat';

// 类型数组
isTypedArray(new Uint8Array([1, 2, 3])); // true
isTypedArray(new Int16Array([1, 2, 3])); // true
isTypedArray(new Float32Array([1.1, 2.2])); // true
isTypedArray(new BigInt64Array([1n, 2n])); // true

// 其他类型返回 false
isTypedArray([1, 2, 3]); // false (普通数组)
isTypedArray(new ArrayBuffer(16)); // false (ArrayBuffer)
isTypedArray(new DataView(new ArrayBuffer(16))); // false (DataView)
isTypedArray('array'); // false (字符串)
isTypedArray({}); // false (对象)
isTypedArray(null); // false
isTypedArray(undefined); // false
```

识别各种类型的类型数组。

```typescript
import { isTypedArray } from 'es-toolkit/compat';

// 整数类型数组
isTypedArray(new Int8Array()); // true
isTypedArray(new Int16Array()); // true
isTypedArray(new Int32Array()); // true
isTypedArray(new Uint8Array()); // true
isTypedArray(new Uint16Array()); // true
isTypedArray(new Uint32Array()); // true
isTypedArray(new Uint8ClampedArray()); // true

// 浮点类型数组
isTypedArray(new Float32Array()); // true
isTypedArray(new Float64Array()); // true

// BigInt 类型数组
isTypedArray(new BigInt64Array()); // true
isTypedArray(new BigUint64Array()); // true
```

与类似类型数组的其他对象进行区分。

```typescript
import { isTypedArray } from 'es-toolkit/compat';

const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);
const typedArray = new Uint8Array(buffer);
const regularArray = [1, 2, 3, 4];

isTypedArray(buffer); // false (ArrayBuffer)
isTypedArray(view); // false (DataView)
isTypedArray(typedArray); // true (TypedArray)
isTypedArray(regularArray); // false (普通数组)
```

在二进制数据处理中区分类型时很有用。

```typescript
import { isTypedArray } from 'es-toolkit/compat';

function processData(data: unknown) {
  if (isTypedArray(data)) {
    console.log(`类型数组长度: ${data.length}`);
    console.log(`字节长度: ${data.byteLength}`);
    console.log(`字节偏移: ${data.byteOffset}`);
    console.log(`构造函数: ${data.constructor.name}`);

    // 输出第一个值
    if (data.length > 0) {
      console.log(`第一个值: ${data[0]}`);
    }
  } else if (Array.isArray(data)) {
    console.log('这是普通数组');
  } else {
    console.log('这不是数组');
  }
}

processData(new Uint8Array([1, 2, 3])); // 输出类型数组信息
processData([1, 2, 3]); // "这是普通数组"
processData('not an array'); // "这不是数组"
```

## isUndefined

### `isUndefined(x)`

当您想类型安全地检查值是否恰好为 `undefined` 时使用 `isUndefined`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isUndefined } from 'es-toolkit/compat';

// 只有 undefined 返回 true
isUndefined(undefined); // true

// null 也返回 false
isUndefined(null); // false

// 所有其他值也返回 false
isUndefined(0); // false
isUndefined(''); // false
isUndefined(false); // false
isUndefined([]); // false
isUndefined({}); // false
isUndefined('undefined'); // false
isUndefined(NaN); // false
```

可以区分检查 `undefined` 和 `null`。

```typescript
import { isUndefined } from 'es-toolkit/compat';

function handleValue(value: string | null | undefined) {
  if (isUndefined(value)) {
    console.log('值为 undefined');
  } else if (value === null) {
    console.log('值明确为 null');
  } else {
    console.log(`有值: ${value}`);
  }
}

handleValue(undefined); // "值为 undefined"
handleValue(null); // "值明确为 null"
handleValue('hello'); // "有值: hello"
```

在检查未声明的变量或未初始化的属性时很有用。

```typescript
import { isUndefined } from 'es-toolkit/compat';

const obj: { name?: string; age?: number } = { name: 'John' };

if (isUndefined(obj.age)) {
  console.log('年龄未设置');
  obj.age = 25; // 设置默认值
}

// 函数参数的默认值处理
function greet(name: string, title?: string) {
  if (isUndefined(title)) {
    title = '先生/女士';
  }
  console.log(`您好，${name}${title}!`);
}

greet('张三'); // "您好，张三先生/女士!"
greet('张三', '老师'); // "您好，张三老师!"
```

## isWeakMap

### `isWeakMap(value)`

当您想类型安全地检查值是否为 WeakMap 时使用 `isWeakMap`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isWeakMap } from 'es-toolkit/compat';

// WeakMap 检查
const weakMap = new WeakMap();
isWeakMap(weakMap); // true

// 其他类型返回 false
isWeakMap(new Map()); // false
isWeakMap(new Set()); // false
isWeakMap(new WeakSet()); // false
isWeakMap({}); // false
isWeakMap([]); // false
isWeakMap('weakmap'); // false
isWeakMap(123); // false
isWeakMap(null); // false
isWeakMap(undefined); // false
```

也与其他类似的集合进行区分。

```typescript
import { isWeakMap } from 'es-toolkit/compat';

// WeakMap vs Map
const obj = {};
const weakMap = new WeakMap([[obj, 'value']]);
const map = new Map([[obj, 'value']]);

isWeakMap(weakMap); // true
isWeakMap(map); // false

// WeakMap vs WeakSet
isWeakMap(new WeakMap()); // true
isWeakMap(new WeakSet()); // false

// WeakMap vs 普通对象
isWeakMap(new WeakMap()); // true
isWeakMap({}); // false
```

在利用 WeakMap 的特殊属性时很有用。

```typescript
import { isWeakMap } from 'es-toolkit/compat';

function setupWeakReference(collection: unknown, key: object, value: any) {
  if (isWeakMap(collection)) {
    // WeakMap 只能使用对象作为键，并维护弱引用
    collection.set(key, value);
    console.log('已存储到 WeakMap 中作为弱引用');

    // WeakMap 没有大小信息
    console.log('WeakMap 没有大小信息');
  } else {
    console.log('不是 WeakMap');
  }
}

const weakMap = new WeakMap();
const regularMap = new Map();
const obj = { id: 1 };

setupWeakReference(weakMap, obj, 'data'); // "已存储到 WeakMap 中作为弱引用"
setupWeakReference(regularMap, obj, 'data'); // "不是 WeakMap"
```

## isWeakSet

### `isWeakSet(value)`

当您想类型安全地检查值是否为 WeakSet 时使用 `isWeakSet`。在 TypeScript 中也可以作为类型守卫使用。

```typescript
import { isWeakSet } from 'es-toolkit/compat';

// WeakSet 检查
const weakSet = new WeakSet();
isWeakSet(weakSet); // true

// 其他类型返回 false
isWeakSet(new Set()); // false
isWeakSet(new Map()); // false
isWeakSet(new WeakMap()); // false
isWeakSet([]); // false
isWeakSet({}); // false
isWeakSet('weakset'); // false
isWeakSet(123); // false
isWeakSet(null); // false
isWeakSet(undefined); // false
```

也与其他类似的集合进行区分。

```typescript
import { isWeakSet } from 'es-toolkit/compat';

// WeakSet vs Set
const obj = {};
const weakSet = new WeakSet([obj]);
const set = new Set([obj]);

isWeakSet(weakSet); // true
isWeakSet(set); // false

// WeakSet vs WeakMap
isWeakSet(new WeakSet()); // true
isWeakSet(new WeakMap()); // false

// WeakSet vs 数组
isWeakSet(new WeakSet()); // true
isWeakSet([]); // false
```

在利用 WeakSet 的特殊属性时很有用。

```typescript
import { isWeakSet } from 'es-toolkit/compat';

function addWeakReference(collection: unknown, item: object) {
  if (isWeakSet(collection)) {
    // WeakSet 只能存储对象，并维护弱引用
    collection.add(item);
    console.log('已存储到 WeakSet 中作为弱引用');

    // WeakSet 没有大小信息且不可迭代
    console.log('WeakSet 没有大小信息且不可迭代');
  } else {
    console.log('不是 WeakSet');
  }
}

const weakSet = new WeakSet();
const regularSet = new Set();
const obj = { id: 1 };

addWeakReference(weakSet, obj); // "已存储到 WeakSet 中作为弱引用"
addWeakReference(regularSet, obj); // "不是 WeakSet"
```

对于防止内存泄漏的对象跟踪很有用。

```typescript
import { isWeakSet } from 'es-toolkit/compat';

// DOM 元素跟踪示例
function trackDOMElement(tracker: unknown, element: Element) {
  if (isWeakSet(tracker)) {
    // 当 DOM 元素被删除时，WeakSet 中也会自动删除
    tracker.add(element);
    console.log('开始跟踪 DOM 元素');

    // 稍后检查跟踪状态
    if (tracker.has(element)) {
      console.log('此元素正在被跟踪');
    }
  }
}
```

## matches

### `matches(source)`

当您想创建一个函数来检查对象或数组的结构和值是否与特定模式匹配时使用 `matches`。在数组过滤或对象搜索中很有用。

```typescript
import { matches } from 'es-toolkit/compat';

// 对象模式匹配
const userMatcher = matches({ age: 25, department: 'Engineering' });

const users = [
  { name: 'Alice', age: 25, department: 'Engineering' },
  { name: 'Bob', age: 30, department: 'Marketing' },
  { name: 'Charlie', age: 25, department: 'Engineering' },
];

const engineeringUsers = users.filter(userMatcher);
// [{ name: 'Alice', age: 25, department: 'Engineering' },
//  { name: 'Charlie', age: 25, department: 'Engineering' }]

// 嵌套对象模式
const profileMatcher = matches({
  profile: { city: 'Seoul', verified: true },
});

const profiles = [
  { name: 'Kim', profile: { city: 'Seoul', verified: true, score: 100 } },
  { name: 'Lee', profile: { city: 'Busan', verified: true } },
  { name: 'Park', profile: { city: 'Seoul', verified: false } },
];

const seoulVerifiedUsers = profiles.filter(profileMatcher);
// [{ name: 'Kim', profile: { city: 'Seoul', verified: true, score: 100 } }]

// 数组模式匹配
const arrayMatcher = matches([2, 4]);
const arrays = [
  [1, 2, 3, 4, 5],
  [2, 4, 6],
  [1, 3, 5],
];
const matchingArrays = arrays.filter(arrayMatcher);
// [[1, 2, 3, 4, 5], [2, 4, 6]]

// 空模式匹配所有值
const emptyMatcher = matches({});
emptyMatcher({ anything: 'value' }); // true
emptyMatcher([]); // true
emptyMatcher(null); // true
```

## matchesProperty

### `matchesProperty(property, source)`

当您想创建一个函数来检查对象的特定属性是否与给定值匹配时使用 `matchesProperty`。在数组过滤或对象搜索中很有用。

```typescript
import { matchesProperty } from 'es-toolkit/compat';

// 简单属性检查
const checkName = matchesProperty('name', 'Alice');

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Alice', age: 35 },
];

const aliceUsers = users.filter(checkName);
// [{ name: 'Alice', age: 25 }, { name: 'Alice', age: 35 }]

// 嵌套属性检查（数组路径）
const checkCity = matchesProperty(['address', 'city'], 'Seoul');

const profiles = [
  { name: 'Kim', address: { city: 'Seoul', district: 'Gangnam' } },
  { name: 'Lee', address: { city: 'Busan', district: 'Haeundae' } },
  { name: 'Park', address: { city: 'Seoul', district: 'Mapo' } },
];

const seoulUsers = profiles.filter(checkCity);
// [{ name: 'Kim', address: { city: 'Seoul', district: 'Gangnam' } },
//  { name: 'Park', address: { city: 'Seoul', district: 'Mapo' } }]

// 用字符串表示深层路径
const checkScore = matchesProperty('stats.game.score', 100);

const players = [
  { name: 'Player1', stats: { game: { score: 100, level: 5 } } },
  { name: 'Player2', stats: { game: { score: 95, level: 4 } } },
  { name: 'Player3', stats: { game: { score: 100, level: 6 } } },
];

const perfectScorers = players.filter(checkScore);
// [{ name: 'Player1', stats: { game: { score: 100, level: 5 } } },
//  { name: 'Player3', stats: { game: { score: 100, level: 6 } } }]

// 与复杂对象匹配
const checkRole = matchesProperty('role', { type: 'admin', permissions: ['read', 'write'] });

const accounts = [
  { user: 'Alice', role: { type: 'admin', permissions: ['read', 'write'] } },
  { user: 'Bob', role: { type: 'user', permissions: ['read'] } },
  { user: 'Charlie', role: { type: 'admin', permissions: ['read', 'write'] } },
];

const admins = accounts.filter(checkRole);
// [{ user: 'Alice', role: { type: 'admin', permissions: ['read', 'write'] } },
//  { user: 'Charlie', role: { type: 'admin', permissions: ['read', 'write'] } }]
```

## camelCase

### `camelCase(str)`

将字符串转换为驼峰命名法。驼峰命名法是一种命名约定,第一个单词以小写字母开头,后续单词的首字母大写,所有单词连接时不带空格。

```typescript
import { camelCase } from 'es-toolkit/compat';

camelCase('camelCase'); // 'camelCase'
camelCase('some whitespace'); // 'someWhitespace'
camelCase('hyphen-text'); // 'hyphenText'
camelCase('HTTPRequest'); // 'httpRequest'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { camelCase } from 'es-toolkit/compat';

camelCase(123); // '123'
camelCase(null); // ''
camelCase(undefined); // ''
```

## capitalize

### `capitalize(str)`

将字符串的第一个字符转换为大写,其余字符转换为小写。这对于改善单词的第一印象或将其格式化为标题形式很有用。

```typescript
import { capitalize } from 'es-toolkit/compat';

capitalize('fred'); // 'Fred'
capitalize('FRED'); // 'Fred'
capitalize('fRED'); // 'Fred'
```

空字符串和非字符串值也可以处理。

```typescript
import { capitalize } from 'es-toolkit/compat';

capitalize(''); // ''
capitalize(123); // '123'
capitalize(null); // ''
capitalize(undefined); // ''
```

## deburr

### `deburr(str)`

将字符串中的特殊字符和变音符号转换为ASCII字符。这对于使多语言文本更易于搜索或排序很有用。

```typescript
import { deburr } from 'es-toolkit/compat';

deburr('Æthelred'); // 'Aethelred'
deburr('München'); // 'Munchen'
deburr('Crème brûlée'); // 'Creme brulee'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { deburr } from 'es-toolkit/compat';

deburr(123); // '123'
deburr(null); // ''
deburr(undefined); // ''
```

## endsWith

### `endsWith(str, target, position?)`

当您想检查字符串是否以特定字符串结尾时,请使用 `endsWith`。您还可以指定搜索的位置。

```typescript
import { endsWith } from 'es-toolkit/compat';

// 检查字符串结尾
endsWith('fooBar', 'Bar');
// Returns: true

endsWith('fooBar', 'foo');
// Returns: false

// 检查到特定位置
endsWith('fooBar', 'foo', 3);
// Returns: true (检查前3个字符'foo'是否以'foo'结尾)
```

`null` 或 `undefined` 返回 `false`。

```typescript
import { endsWith } from 'es-toolkit/compat';

endsWith(null, 'test');
// Returns: false

endsWith('test', null);
// Returns: false
```

## escape

### `escape(str)`

将字符串中的 `&`、`<`、`>`、`"`、`'` 字符转换为相应的HTML实体。这对于在HTML文档中安全插入文本以防止XSS攻击很有用。

```typescript
import { escape } from 'es-toolkit/compat';

escape('This is a <div> element.'); // 'This is a &lt;div&gt; element.'
escape('This is a "quote"'); // 'This is a &quot;quote&quot;'
escape("This is a 'quote'"); // 'This is a &#39;quote&#39;'
escape('This is a & symbol'); // 'This is a &amp; symbol'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { escape } from 'es-toolkit/compat';

escape(123); // '123'
escape(null); // ''
escape(undefined); // ''
```

## escapeRegExp

### `escapeRegExp(str)`

转义字符串中的正则表达式特殊字符 `^`、`$`、`\`、`.`、`*`、`+`、`?`、`(`、`)`、`[`、`]`、`{`、`}`、`|`。当您想在动态创建正则表达式时将字符串按字面处理时很有用。

```typescript
import { escapeRegExp } from 'es-toolkit/compat';

escapeRegExp('[es-toolkit](https://es-toolkit.dev/)');
// '\\[es-toolkit\\]\\(https://es-toolkit\\.dev/\\)'

escapeRegExp('$^{}.+*?()[]|\\');
// '\\$\\^\\{\\}\\.\\+\\*\\?\\(\\)\\[\\]\\|\\\\'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { escapeRegExp } from 'es-toolkit/compat';

escapeRegExp(123); // '123'
escapeRegExp(null); // ''
escapeRegExp(undefined); // ''
```

## kebabCase

### `kebabCase(str)`

将字符串转换为短横线命名法。短横线命名法是一种命名约定,每个单词以小写字母书写,并用短横线(-)字符连接。它通常用于URL和CSS类名。

```typescript
import { kebabCase } from 'es-toolkit/compat';

kebabCase('camelCase'); // 'camel-case'
kebabCase('some whitespace'); // 'some-whitespace'
kebabCase('hyphen-text'); // 'hyphen-text'
kebabCase('HTTPRequest'); // 'http-request'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { kebabCase } from 'es-toolkit/compat';

kebabCase(123); // '123'
kebabCase(null); // ''
kebabCase(undefined); // ''
```

## lowerCase

### `lowerCase(str)`

将字符串转换为小写单词并用空格分隔。每个单词都转换为小写并用空格字符连接。这对于创建人类可读的文本形式很有用。

```typescript
import { lowerCase } from 'es-toolkit/compat';

lowerCase('camelCase'); // 'camel case'
lowerCase('some whitespace'); // 'some whitespace'
lowerCase('hyphen-text'); // 'hyphen text'
lowerCase('HTTPRequest'); // 'http request'
```

非字符串值也会在处理前转换为字符串。

```typescript
import { lowerCase } from 'es-toolkit/compat';

lowerCase(123); // '123'
lowerCase(null); // ''
lowerCase(undefined); // ''
```

## lowerFirst

### `lowerFirst(str)`

将字符串的第一个字符转换为小写。其余字符保持不变。这对于创建驼峰命名变量名或只想将第一个字符小写时很有用。

```typescript
import { lowerFirst } from 'es-toolkit/compat';

lowerFirst('fred'); // 'fred'
lowerFirst('Fred'); // 'fred'
lowerFirst('FRED'); // 'fRED'
lowerFirst(''); // ''
```

非字符串值也会在处理前转换为字符串。

```typescript
import { lowerFirst } from 'es-toolkit/compat';

lowerFirst(123); // '123'
lowerFirst(null); // ''
lowerFirst(undefined); // ''
```

## pad

### `pad(str, length, chars)`

当您想在字符串两侧添加填充以匹配所需长度时,请使用 `pad`。如果填充字符不能均匀分配,额外的字符将放在右侧。

```typescript
import { pad } from 'es-toolkit/compat';

// 用默认空格填充
pad('abc', 8);
// Returns: '  abc   '

// 用指定字符填充
pad('abc', 8, '_-');
// Returns: '_-abc_-_'

// 如果已经足够长则原样返回
pad('abc', 3);
// Returns: 'abc'

// 如果长度更短则原样返回
pad('abc', 2);
// Returns: 'abc'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { pad } from 'es-toolkit/compat';

pad(null, 5); // '     '
pad(undefined, 3, '*'); // '***'
```

## padEnd

### `padEnd(str, length?, chars?)`

当您想在字符串末尾添加填充以匹配所需长度时,请使用 `padEnd`。

```typescript
import { padEnd } from 'es-toolkit/compat';

// 用空格填充
padEnd('abc', 6);
// Returns: 'abc   '

// 用特定字符填充
padEnd('abc', 6, '_-');
// Returns: 'abc_-_'

// 如果原始长度更长则原样返回
padEnd('abc', 3);
// Returns: 'abc'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { padEnd } from 'es-toolkit/compat';

padEnd(null, 5, '*');
// Returns: '*****'

padEnd(undefined, 3);
// Returns: '   '
```

## padStart

### `padStart(str, length?, chars?)`

当您想在字符串开头添加填充以匹配所需长度时,请使用 `padStart`。

```typescript
import { padStart } from 'es-toolkit/compat';

// 用空格填充
padStart('abc', 6);
// Returns: '   abc'

// 用特定字符填充
padStart('abc', 6, '_-');
// Returns: '_-_abc'

// 如果原始长度更长则原样返回
padStart('abc', 3);
// Returns: 'abc'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { padStart } from 'es-toolkit/compat';

padStart(null, 5, '*');
// Returns: '*****'

padStart(undefined, 3);
// Returns: '   '
```

## repeat

### `repeat(str, n?)`

当您想多次重复字符串以创建新字符串时,请使用 `repeat`。如果重复次数小于1,则返回空字符串。

```typescript
import { repeat } from 'es-toolkit/compat';

// 重复字符串
repeat('abc', 2);
// Returns: 'abcabc'

repeat('hello', 3);
// Returns: 'hellohellohello'

// 重复0次返回空字符串
repeat('abc', 0);
// Returns: ''
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { repeat } from 'es-toolkit/compat';

repeat(null, 3);
// Returns: ''

repeat(undefined, 2);
// Returns: ''
```

如果不指定重复次数,则重复1次。

```typescript
import { repeat } from 'es-toolkit/compat';

repeat('abc');
// Returns: 'abc'
```

## replace

### `replace(target, pattern, replacement)`

当您想在字符串中查找特定模式并替换为其他字符串时,请使用 `replace`。您可以使用字符串或正则表达式模式,替换内容可以指定为字符串或函数。

```typescript
import { replace } from 'es-toolkit/compat';

// 用字符串模式替换
replace('abcde', 'de', '123');
// Returns: 'abc123'

// 用正则表达式模式替换
replace('abcde', /[bd]/g, '-');
// Returns: 'a-c-e'
```

您也可以使用函数来动态决定替换内容。

```typescript
import { replace } from 'es-toolkit/compat';

// 用函数决定替换内容
replace('abcde', 'de', match => match.toUpperCase());
// Returns: 'abcDE'

// 正则表达式和函数的组合
replace('abcde', /[bd]/g, match => match.toUpperCase());
// Returns: 'aBcDe'
```

`null` 或 `undefined` 目标被视为空字符串。

```typescript
import { replace } from 'es-toolkit/compat';

replace(null, 'test', 'replaced');
// Returns: ''

replace(undefined, /test/g, 'replaced');
// Returns: ''
```

## snakeCase

### `snakeCase(str)`

当您想将字符串转换为蛇形命名法 (snake*case) 时,请使用 `snakeCase`。蛇形命名法是一种命名约定,其中每个单词都以小写字母书写,并用下划线 (*) 连接。

```typescript
import { snakeCase } from 'es-toolkit/compat';

// 转换驼峰命名法
snakeCase('camelCase');
// Returns: 'camel_case'

// 转换空格分隔的字符串
snakeCase('some whitespace');
// Returns: 'some_whitespace'

// 转换连字符分隔的字符串
snakeCase('hyphen-text');
// Returns: 'hyphen_text'

// 处理连续大写字母
snakeCase('HTTPRequest');
// Returns: 'http_request'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { snakeCase } from 'es-toolkit/compat';

snakeCase(null); // ''
snakeCase(undefined); // ''
```

## split

### `split(string, separator?, limit?)`

当您想使用特定分隔符将字符串拆分为数组时,请使用 `split`。您还可以限制结果数组的最大长度。

```typescript
import { split } from 'es-toolkit/compat';

// 按连字符拆分
split('a-b-c', '-');
// 返回值: ['a', 'b', 'c']

// 限制结果数量
split('a-b-c-d', '-', 2);
// 返回值: ['a', 'b']

// 按正则表达式拆分
split('hello world', /\s/);
// 返回值: ['hello', 'world']
```

如果未指定分隔符,整个字符串将成为数组的第一个元素。

```typescript
import { split } from 'es-toolkit/compat';

split('hello');
// 返回值: ['hello']
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { split } from 'es-toolkit/compat';

split(null);
// 返回值: ['']

split(undefined);
// 返回值: ['']
```

## startCase

### `startCase(str)`

当您想将字符串转换为 Start Case 时,请使用 `startCase`。Start Case 是一种命名约定,每个单词的首字母大写并用空格分隔。

```typescript
import { startCase } from 'es-toolkit/compat';

// 转换普通字符串
startCase('hello world');
// 返回值: 'Hello World'

// 已经大写的单词保持不变
startCase('HELLO WORLD');
// 返回值: 'HELLO WORLD'

// 转换连字符分隔的字符串
startCase('hello-world');
// 返回值: 'Hello World'

// 转换下划线分隔的字符串
startCase('hello_world');
// 返回值: 'Hello World'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { startCase } from 'es-toolkit/compat';

startCase(null); // ''
startCase(undefined); // ''
```

## startsWith

### `startsWith(str, target, position?)`

当您想检查字符串是否以特定字符串开头时,使用 `startsWith`。您还可以指定开始搜索的位置。

```typescript
import { startsWith } from 'es-toolkit/compat';

// 检查字符串开头
startsWith('fooBar', 'foo');
// 返回值: true

startsWith('fooBar', 'bar');
// 返回值: false

// 从特定位置开始检查
startsWith('fooBar', 'Bar', 3);
// 返回值: true (检查从第3个位置开始是否以 'Bar' 开头)
```

对于 `null` 或 `undefined` 返回 `false`。

```typescript
import { startsWith } from 'es-toolkit/compat';

startsWith(null, 'test');
// 返回值: false

startsWith('test', null);
// 返回值: false
```

## template

### `template(string, options?)`

当您想要将数据插入字符串模板以创建完整字符串时,请使用 `template`。您可以安全地转义值、按原样插入值或执行 JavaScript 代码。

基本用法允许您插入或转义值。

```typescript
import { template } from 'es-toolkit/compat';

// 按原样插入值
const compiled = template('<%= value %>');
compiled({ value: 'Hello, World!' });
// 返回: 'Hello, World!'

// 安全转义 HTML
const safeCompiled = template('<%- value %>');
safeCompiled({ value: '<script>alert("xss")</script>' });
// 返回: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

您也可以执行 JavaScript 代码。

```typescript
import { template } from 'es-toolkit/compat';

// 使用条件语句
const compiled = template('<% if (user) { %>你好 <%= user %>!<% } %>');
compiled({ user: 'es-toolkit' });
// 返回: '你好 es-toolkit!'

// 使用循环
const listTemplate = template('<% users.forEach(function(user) { %><li><%= user %></li><% }); %>');
listTemplate({ users: ['小明', '小红', '小刚'] });
// 返回: '<li>小明</li><li>小红</li><li>小刚</li>'
```

您可以指定变量名以更安全地使用。

```typescript
import { template } from 'es-toolkit/compat';

const compiled = template('<%= data.name %> 今年 <%= data.age %> 岁', {
  variable: 'data',
});
compiled({ name: '小明', age: 25 });
// 返回: '小明 今年 25 岁'
```

您可以导入和使用外部函数。

```typescript
import { template } from 'es-toolkit/compat';

const compiled = template('<%= _.toUpper(message) %>', {
  imports: { _: { toUpper: str => str.toUpperCase() } },
});
compiled({ message: 'hello world' });
// 返回: 'HELLO WORLD'
```

您也可以创建自定义分隔符。

```typescript
import { template } from 'es-toolkit/compat';

// 使用自定义分隔符插入值
const compiled = template('{{ message }}', {
  interpolate: /\{\{([\s\S]+?)\}\}/g,
});
compiled({ message: '你好!' });
// 返回: '你好!'

// 使用自定义分隔符转义
const safeCompiled = template('[- html -]', {
  escape: /\[-([\s\S]+?)-\]/g,
});
safeCompiled({ html: '<div>内容</div>' });
// 返回: '&lt;div&gt;内容&lt;/div&gt;'
```

## toLower

### `toLower(value?)`

当您想将值转换为小写字符串时,请使用 `toLower`。它首先将任何类型的值转换为字符串,然后转换为小写。

```typescript
import { toLower } from 'es-toolkit/compat';

// 将字符串转换为小写
toLower('--FOO-BAR--');
// Returns: '--foo-bar--'

toLower('Hello World');
// Returns: 'hello world'

// 转换数字
toLower(123);
// Returns: '123'

// 转换数组
toLower([1, 2, 3]);
// Returns: '1,2,3'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { toLower } from 'es-toolkit/compat';

toLower(null);
// Returns: ''

toLower(undefined);
// Returns: ''

toLower();
// Returns: ''
```

## toUpper

### `toUpper(value?)`

当您想将值转换为大写字符串时,请使用 `toUpper`。它首先将任何类型的值转换为字符串,然后转换为大写。

```typescript
import { toUpper } from 'es-toolkit/compat';

// 将字符串转换为大写
toUpper('--foo-bar--');
// Returns: '--FOO-BAR--'

toUpper('Hello World');
// Returns: 'HELLO WORLD'

// 转换数字
toUpper(123);
// Returns: '123'

// 转换数组
toUpper([1, 2, 3]);
// Returns: '1,2,3'
```

`null` 和 `undefined` 被处理为空字符串。

```typescript
import { toUpper } from 'es-toolkit/compat';

toUpper(null);
// Returns: ''

toUpper(undefined);
// Returns: ''

toUpper();
// Returns: ''
```

## trim

### `trim(str, chars)`

当您想要移除字符串开头和结尾的空格或特定字符时,请使用 `trim`。如果未指定 `chars`,则只移除开头和结尾的空格。

```typescript
import { trim } from 'es-toolkit/compat';

// 移除开头和结尾的空格
trim('  hello  ');
// 返回: 'hello'

// 移除指定字符
trim('--hello--', '-');
// 返回: 'hello'

// 使用数组移除多个字符
trim('##hello##', ['#', 'o']);
// 返回: 'hell'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { trim } from 'es-toolkit/compat';

trim(null); // ''
trim(undefined); // ''
```

## trimEnd

### `trimEnd(str, chars)`

当您想要移除字符串结尾的空格或特定字符时,请使用 `trimEnd`。如果未指定 `chars`,则只移除结尾的空格。

```typescript
import { trimEnd } from 'es-toolkit/compat';

// 移除结尾的空格
trimEnd('  abc  ');
// 返回: '  abc'

// 移除指定字符
trimEnd('-_-abc-_-', '_-');
// 返回: '-_-abc'

// 仅应用于字符串结尾
trimEnd('abc', 'a');
// 返回: 'abc'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { trimEnd } from 'es-toolkit/compat';

trimEnd(null); // ''
trimEnd(undefined); // ''
```

## trimStart

### `trimStart(str, chars)`

当您想要移除字符串开头的空格或特定字符时,请使用 `trimStart`。如果未指定 `chars`,则只移除开头的空格。

```typescript
import { trimStart } from 'es-toolkit/compat';

// 移除开头的空格
trimStart('  abc  ');
// 返回: 'abc  '

// 移除指定字符
trimStart('-_-abc-_-', '_-');
// 返回: 'abc-_-'

// 仅应用于字符串开头
trimStart('abc', 'c');
// 返回: 'abc'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { trimStart } from 'es-toolkit/compat';

trimStart(null); // ''
trimStart(undefined); // ''
```

## truncate

### `truncate(string, options?)`

当您想要将长字符串截断到指定长度时,请使用 `truncate`。截断部分将替换为省略字符串(默认值: `"..."`)。

```typescript
import { truncate } from 'es-toolkit/compat';

// 基本用法 (最大 30 个字符)
truncate('hi-diddly-ho there, neighborino');
// 返回: 'hi-diddly-ho there, neighbo...'

// 指定长度
truncate('hi-diddly-ho there, neighborino', { length: 24 });
// 返回: 'hi-diddly-ho there, n...'

// 更改省略字符串
truncate('hi-diddly-ho there, neighborino', { omission: ' [...]' });
// 返回: 'hi-diddly-ho there, neig [...]'
```

您可以指定分隔符以在该位置截断。

```typescript
import { truncate } from 'es-toolkit/compat';

// 使用空格分隔符在单词边界处截断
truncate('hi-diddly-ho there, neighborino', {
  length: 24,
  separator: ' ',
});
// 返回: 'hi-diddly-ho there,...'

// 使用正则表达式指定分隔符
truncate('hi-diddly-ho there, neighborino', {
  length: 24,
  separator: /,? +/,
});
// 返回: 'hi-diddly-ho there...'
```

Unicode 字符也能正确处理。

```typescript
import { truncate } from 'es-toolkit/compat';

truncate('¥§✈✉🤓', { length: 5 });
// 返回: '¥§✈✉🤓'

truncate('¥§✈✉🤓', { length: 4, omission: '…' });
// 返回: '¥§✈…'
```

## unescape

### `unescape(str)`

当您想要将 HTML 实体 `&amp;`、`&lt;`、`&gt;`、`&quot;`、`&#39;` 转换回原始字符时,请使用 `unescape`。这是 `escape` 函数的反向操作。

```typescript
import { unescape } from 'es-toolkit/compat';

// 反转义 HTML 标签
unescape('This is a &lt;div&gt; element.');
// 返回: 'This is a <div> element.'

// 反转义引号
unescape('This is a &quot;quote&quot;');
// 返回: 'This is a "quote"'

// 反转义撇号
unescape('This is a &#39;quote&#39;');
// 返回: 'This is a 'quote''

// 反转义 & 符号
unescape('This is a &amp; symbol');
// 返回: 'This is a & symbol'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { unescape } from 'es-toolkit/compat';

unescape(null); // ''
unescape(undefined); // ''
```

## upperCase

### `upperCase(str)`

当您想要将字符串转换为大写形式 (UPPER CASE) 时,请使用 `upperCase`。大写是一种命名约定,每个单词都用大写字母书写并用空格连接。

```typescript
import { upperCase } from 'es-toolkit/compat';

// 转换驼峰命名
upperCase('camelCase');
// 返回: 'CAMEL CASE'

// 转换空格分隔的字符串
upperCase('some whitespace');
// 返回: 'SOME WHITESPACE'

// 转换连字符分隔的字符串
upperCase('hyphen-text');
// 返回: 'HYPHEN TEXT'

// 当大写字母连续出现时
upperCase('HTTPRequest');
// 返回: 'HTTP REQUEST'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { upperCase } from 'es-toolkit/compat';

upperCase(null); // ''
upperCase(undefined); // ''
```

## upperFirst

### `upperFirst(str)`

当您想要仅将字符串的第一个字符大写时,请使用 `upperFirst`。其余字符保持不变。

```typescript
import { upperFirst } from 'es-toolkit/compat';

// 以小写字母开头的字符串
upperFirst('fred');
// 返回: 'Fred'

// 已经以大写字母开头的字符串
upperFirst('Fred');
// 返回: 'Fred'

// 全大写字符串
upperFirst('FRED');
// 返回: 'FRED'
```

`null` 或 `undefined` 被视为空字符串。

```typescript
import { upperFirst } from 'es-toolkit/compat';

upperFirst(null); // ''
upperFirst(undefined); // ''
```

## words

### `words(str, pattern)`

当您想要将字符串拆分为单词时,请使用 `words`。默认情况下,它会识别英文字母、数字、表情符号等来提取单词。

```typescript
import { words } from 'es-toolkit/compat';

// 基本单词提取
words('fred, barney, & pebbles');
// 返回: ['fred', 'barney', 'pebbles']

// 从驼峰命名中提取单词
words('camelCaseWord');
// 返回: ['camel', 'Case', 'Word']

// 包含数字的字符串
words('hello123world');
// 返回: ['hello', '123', 'world']
```

您还可以使用自定义模式提取单词。

```typescript
import { words } from 'es-toolkit/compat';

// 使用正则表达式提取单词
words('hello world', /\w+/g);
// 返回: ['hello', 'world']

// 使用字符串模式
words('one-two-three', '-');
// 返回: ['-']
```

`null` 或 `undefined` 被视为空数组。

```typescript
import { words } from 'es-toolkit/compat';

words(null); // []
words(undefined); // []
```

## bindAll

### `bindAll(object, ...methodNames)`

当您想要将特定方法的 `this` 值固定到该对象时，请使用 `bindAll`。当将方法作为事件处理程序或回调函数传递时，这对于维护 `this` 上下文很有用。

```typescript
import { bindAll } from 'es-toolkit/compat';

const view = {
  label: 'docs',
  click: function () {
    console.log('clicked ' + this.label);
  },
};

// 将方法绑定到对象
bindAll(view, 'click');
document.addEventListener('click', view.click);
// => 点击时输出 'clicked docs'
```

您可以一次绑定多个方法。

```typescript
import { bindAll } from 'es-toolkit/compat';

const obj = {
  name: 'example',
  greet() {
    return `Hello, ${this.name}!`;
  },
  farewell() {
    return `Goodbye, ${this.name}!`;
  },
};

// 使用数组绑定多个方法
bindAll(obj, ['greet', 'farewell']);

const greet = obj.greet;
greet(); // 'Hello, example!' (this 已正确绑定)
```

它可以处理数字和特殊键。

```typescript
import { bindAll } from 'es-toolkit/compat';

const obj = {
  '-0': function () {
    return 'negative zero';
  },
  '0': function () {
    return 'zero';
  },
};

bindAll(obj, -0);
obj['-0'](); // 'negative zero'
```

## cond

### `cond(pairs)`

当您想要按顺序检查多个条件并执行第一个为真的条件对应的函数时，请使用 `cond`。在以函数式方式表达复杂条件逻辑时很有用。

```typescript
import { cond } from 'es-toolkit/compat';

// 基本用法
const getValue = cond([
  [x => x > 10, x => 'big'],
  [x => x > 5, x => 'medium'],
  [x => x > 0, x => 'small'],
  [() => true, () => 'zero or negative'],
]);

console.log(getValue(15)); // "big"
console.log(getValue(8)); // "medium"
console.log(getValue(3)); // "small"
console.log(getValue(-1)); // "zero or negative"
```

也可以用于对象模式匹配。

```typescript
import { cond } from 'es-toolkit/compat';

const processUser = cond([
  [user => user.role === 'admin', user => `管理员: ${user.name}`],
  [user => user.role === 'user', user => `用户: ${user.name}`],
  [user => user.role === 'guest', user => `访客: ${user.name}`],
  [() => true, () => '未知角色'],
]);

console.log(processUser({ name: '张三', role: 'admin' })); // "管理员: 张三"
console.log(processUser({ name: '李四', role: 'user' })); // "用户: 李四"
```

只执行第一个为真的条件，如果所有条件都为假，则返回 `undefined`。

```typescript
import { cond } from 'es-toolkit/compat';

const checkValue = cond([
  [x => x > 10, x => 'greater than 10'],
  [x => x < 5, x => 'less than 5'],
]);

console.log(checkValue(15)); // "greater than 10"
console.log(checkValue(3)); // "less than 5"
console.log(checkValue(7)); // undefined (不符合条件)
```

## constant

### `constant(value)`

当您需要一个总是返回特定值的函数时，请使用 `constant`。在函数式编程中提供默认值或用作回调函数时很有用。

```typescript
import { constant } from 'es-toolkit/compat';

// 基本用法
const always42 = constant(42);
console.log(always42()); // 42

const alwaysHello = constant('hello');
console.log(alwaysHello()); // "hello"
```

与数组的 map 或其他高阶函数一起使用时很方便。

```typescript
import { constant } from 'es-toolkit/compat';

// 将所有元素填充为 0
const numbers = [1, 2, 3, 4, 5];
const zeros = numbers.map(constant(0));
console.log(zeros); // [0, 0, 0, 0, 0]

// 将所有元素替换为相同的对象
const users = ['alice', 'bob', 'charlie'];
const defaultUser = users.map(constant({ role: 'user', active: true }));
console.log(defaultUser);
// [{ role: 'user', active: true }, { role: 'user', active: true }, { role: 'user', active: true }]
```

也可以用于提供条件默认值。

```typescript
import { constant } from 'es-toolkit/compat';

function processData(data, fallback = constant('默认值')) {
  return data || fallback();
}

console.log(processData(null)); // "默认值"
console.log(processData('实际数据')); // "实际数据"
```

保持对象引用。

```typescript
import { constant } from 'es-toolkit/compat';

const obj = { a: 1 };
const getObj = constant(obj);

console.log(getObj() === obj); // true (相同的对象引用)
```

## defaultTo

### `defaultTo(value, defaultValue)`

当值为 `null`、`undefined` 或 `NaN` 时，您想要提供默认值时，请使用 `defaultTo`。在处理 API 响应或用户输入中的无效值时很有用。

```typescript
import { defaultTo } from 'es-toolkit/compat';

// 基本用法
console.log(defaultTo(null, 'default')); // 'default'
console.log(defaultTo(undefined, 'default')); // 'default'
console.log(defaultTo(NaN, 0)); // 0
console.log(defaultTo('actual', 'default')); // 'actual'
console.log(defaultTo(123, 0)); // 123
```

可以用于处理 API 响应。

```typescript
import { defaultTo } from 'es-toolkit/compat';

function processUserData(response) {
  return {
    name: defaultTo(response.name, '无名称'),
    age: defaultTo(response.age, 0),
    score: defaultTo(response.score, 0), // 包括 NaN 处理
  };
}

// 当 API 返回不完整数据时
const userData = processUserData({
  name: null,
  age: undefined,
  score: NaN,
});

console.log(userData);
// { name: '无名称', age: 0, score: 0 }
```

也可以用于数组或对象。

```typescript
import { defaultTo } from 'es-toolkit/compat';

const users = defaultTo(response.users, []);
const metadata = defaultTo(response.metadata, {});

// 只处理 null/undefined/NaN，不处理空数组或对象
console.log(defaultTo([], ['default'])); // [] (空数组但是有效值)
console.log(defaultTo({}, { default: true })); // {} (空对象但是有效值)
```

## eq

### `eq(value, other)`

当您想要检查两个值是否相等时，请使用 `eq`。与常规的 `===` 比较不同，它在 `NaN` 之间的比较中返回 `true`。

```typescript
import { eq } from 'es-toolkit/compat';

// 基本用法
console.log(eq(1, 1)); // true
console.log(eq(0, -0)); // true (SameValueZero 中 0 和 -0 被视为相等)
console.log(eq(NaN, NaN)); // true
console.log(eq('a', 'a')); // true
console.log(eq('a', 'b')); // false
```

与 `Object.is()` 的不同行为。

```typescript
// 使用 eq
console.log(eq(NaN, NaN)); // true
console.log(eq(0, -0)); // true

// 使用 Object.is (更快)
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(0, -0)); // false (Object.is 将 0 和 -0 视为不同)

// 使用 ===
console.log(NaN === NaN); // false
console.log(0 === -0); // true
```

## gt

### `gt(value, other)`

当您想要比较两个值并检查第一个值是否大于第二个值时，请使用 `gt`。字符串之间按字典顺序比较，其他类型转换为数字后比较。

```typescript
import { gt } from 'es-toolkit/compat';

gt(3, 1);
// Returns: true

gt(3, 3);
// Returns: false

gt(1, 3);
// Returns: false

// 字符串比较 (字典顺序)
gt('def', 'abc');
// Returns: true

gt('abc', 'def');
// Returns: false

// 其他类型转换为数字后比较
gt('10', 5);
// Returns: true (10 > 5)

gt(1, null);
// Returns: true (1 > 0)
```

## gte

### `gte(value, other)`

当您想要比较两个值并检查第一个值是否大于或等于第二个值时，请使用 `gte`。字符串之间按字典顺序比较，其他类型转换为数字后比较。

```typescript
import { gte } from 'es-toolkit/compat';

gte(3, 1);
// Returns: true

gte(3, 3);
// Returns: true

gte(1, 3);
// Returns: false

// 字符串比较 (字典顺序)
gte('def', 'abc');
// Returns: true

gte('abc', 'def');
// Returns: false

// 其他类型转换为数字后比较
gte('10', 5);
// Returns: true (10 >= 5)

gte(1, null);
// Returns: true (1 >= 0)
```

## invoke

### `invoke(object, path, args)`

当您想要用参数调用对象特定路径上的方法时，请使用 `invoke`。路径可以指定为点表示法字符串或属性键数组。

```typescript
import { invoke } from 'es-toolkit/compat';

const object = {
  a: {
    b: function (x, y) {
      return x + y;
    },
  },
};

// 使用点表示法指定路径
invoke(object, 'a.b', [1, 2]);
// Returns: 3

// 使用数组指定路径
invoke(object, ['a', 'b'], [1, 2]);
// Returns: 3

// 不存在的路径
invoke(object, 'a.c.d', [1, 2]);
// Returns: undefined

// 各种类型的参数
const obj = {
  calculate: {
    sum: function (...numbers) {
      return numbers.reduce((a, b) => a + b, 0);
    },
    multiply: function (a, b) {
      return a * b;
    },
  },
};

invoke(obj, 'calculate.sum', [1, 2, 3, 4]);
// Returns: 10

invoke(obj, ['calculate', 'multiply'], [5, 6]);
// Returns: 30
```

## iteratee

### `iteratee(value?)`

当您想要创建一个从集合元素中提取值或检查条件的函数时，请使用 `iteratee`。根据提供的参数类型执行不同的操作。

```typescript
import { iteratee } from 'es-toolkit/compat';

// 函数: 返回给定的函数本身
const func = iteratee(object => object.a);
[{ a: 1 }, { a: 2 }, { a: 3 }].map(func);
// Returns: [1, 2, 3]

// 属性名: 返回该属性值的函数
const getA = iteratee('a');
[{ a: 1 }, { a: 2 }, { a: 3 }].map(getA);
// Returns: [1, 2, 3]

// 对象: 检查是否与给定对象匹配的函数
const matchesObj = iteratee({ a: 1 });
[
  { a: 1, b: 2 },
  { a: 2, b: 3 },
  { a: 1, c: 4 },
].find(matchesObj);
// Returns: { a: 1, b: 2 }

// 属性-值对: 检查该属性是否与特定值匹配的函数
const matchesProperty = iteratee(['a', 1]);
[{ a: 1 }, { a: 2 }, { a: 3 }].find(matchesProperty);
// Returns: { a: 1 }

// null 或无参数: 返回元素本身的函数
const identity = iteratee();
[{ a: 1 }, { a: 2 }, { a: 3 }].map(identity);
// Returns: [{ a: 1 }, { a: 2 }, { a: 3 }]
```

根据参数类型的操作:

- **函数**: 原样返回给定的函数。
- **属性名**: 从元素中返回给定属性的值。
- **属性-值对**: 返回表示元素的属性是否与给定值匹配的真/假值。
- **部分对象**: 返回表示元素是否与部分对象的属性和值匹配的真/假值。
- **null 或无参数**: 返回原样返回元素的函数。

## lt

### `lt(value, other)`

当您想要比较两个值并检查第一个值是否小于第二个值时，请使用 `lt`。字符串之间按字典顺序比较，其他类型转换为数字后比较。

```typescript
import { lt } from 'es-toolkit/compat';

lt(1, 3);
// Returns: true

lt(3, 3);
// Returns: false

lt(3, 1);
// Returns: false

// 字符串比较 (字典顺序)
lt('abc', 'def');
// Returns: true

lt('def', 'abc');
// Returns: false

// 其他类型转换为数字后比较
lt('5', 10);
// Returns: true (5 < 10)

lt(null, 1);
// Returns: true (0 < 1)
```

## lte

### `lte(value, other)`

当您想要比较两个值并检查第一个值是否小于或等于第二个值时，请使用 `lte`。字符串之间按字典顺序比较，其他类型转换为数字后比较。

```typescript
import { lte } from 'es-toolkit/compat';

lte(1, 3);
// Returns: true

lte(3, 3);
// Returns: true

lte(3, 1);
// Returns: false

// 字符串比较 (字典顺序)
lte('abc', 'def');
// Returns: true

lte('def', 'abc');
// Returns: false

// 其他类型转换为数字后比较
lte('10', 5);
// Returns: false (10 <= 5)

lte(null, 0);
// Returns: true (0 <= 0)
```

## method

### `method(path, ...args)`

创建一个从对象调用特定路径方法并使用预定义参数的函数。在函数式编程中重用方法调用或在数组的 `map` 等中很有用。

```typescript
import { method } from 'es-toolkit/compat';

const object = {
  a: {
    b: function (x, y) {
      return x + y;
    },
  },
};

// 创建方法调用函数
const add = method('a.b', 1, 2);
console.log(add(object)); // => 3

// 对数组中每个对象调用方法
const objects = [{ calc: { sum: (a, b) => a + b } }, { calc: { sum: (a, b) => a * b } }];

const calculate = method('calc.sum', 5, 3);
objects.map(calculate); // => [8, 15]
```

也可以处理嵌套路径。

```typescript
import { method } from 'es-toolkit/compat';

const obj = {
  users: {
    getName: function (prefix) {
      return prefix + this.name;
    },
    name: 'John',
  },
};

const getUserName = method('users.getName', 'Mr. ');
getUserName(obj); // => 'Mr. John'
```

## methodOf

### `methodOf(object, ...args)`

创建一个使用预定义参数调用特定对象方法的函数。与 `method` 相反，当您想要固定对象并稍后指定路径时很有用。

```typescript
import { methodOf } from 'es-toolkit/compat';

const object = {
  a: {
    b: function (x, y) {
      return x + y;
    },
  },
};

// 预先绑定对象和参数
const callMethod = methodOf(object, 1, 2);
console.log(callMethod('a.b')); // => 3

// 对多个路径使用相同的对象和参数调用
const calculator = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  subtract: (a, b) => a - b,
};

const compute = methodOf(calculator, 10, 5);
console.log(compute('add')); // => 15
console.log(compute('multiply')); // => 50
console.log(compute('subtract')); // => 5
```

也可以在嵌套对象中使用。

```typescript
import { methodOf } from 'es-toolkit/compat';

const data = {
  users: {
    findById: function (id) {
      return `User ${id}`;
    },
    findByName: function (name) {
      return `Found ${name}`;
    },
  },
};

const userFinder = methodOf(data, 'john');
userFinder('users.findById'); // => 'User john'
userFinder('users.findByName'); // => 'Found john'
```

## now

### `now()`

返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。对时间测量或时间戳生成很有用。

```typescript
import { now } from 'es-toolkit/compat';

// 获取当前时间
const currentTime = now();
console.log(currentTime); // => 1703925600000（示例）

// 测量执行时间
const startTime = now();
// 耗时操作
const endTime = now();
console.log(`操作时间：${endTime - startTime}ms`);

// 用作时间戳
const timestamp = now();
const logMessage = `[${timestamp}] 操作完成`;
```

返回与 `Date.now()` 相同的结果。

```typescript
import { now } from 'es-toolkit/compat';

console.log(now() === Date.now()); // => true（在同一时间调用时）
```

## over

### `over(...iteratees)`

接收多个函数，创建一个函数，该函数使用相同的参数调用每个函数并返回结果数组。当需要用相同的数据进行多种计算时很有用。

```typescript
import { over } from 'es-toolkit/compat';

// 一起使用数学函数
const mathOperations = over([Math.max, Math.min]);
mathOperations(1, 2, 3, 4);
// => [4, 1]

// 也可以作为单独的函数传递
const operations = over(Math.max, Math.min);
operations(1, 2, 3, 4);
// => [4, 1]

// 提取对象属性
const getProperties = over(['name', 'age']);
getProperties({ name: 'John', age: 30 });
// => ['John', 30]

// 检查条件
const validators = over([
  { name: 'John' }, // 对象匹配
  { age: 30 },
]);
validators({ name: 'John', age: 30 });
// => [true, true]
```

也可以处理嵌套路径。

```typescript
import { over } from 'es-toolkit/compat';

const data = {
  user: { name: 'John', profile: { age: 30 } },
  settings: { theme: 'dark' },
};

const getInfo = over(['user.name', 'user.profile.age', 'settings.theme']);
getInfo(data);
// => ['John', 30, 'dark']
```

## overEvery

### `overEvery(...predicates)`

接收多个条件函数，创建一个函数，该函数检查给定值是否满足所有条件。对复合条件检查或数据验证很有用。

```typescript
import { overEvery } from 'es-toolkit/compat';

// 检查字符串条件
const isValidString = overEvery([
  value => typeof value === 'string',
  value => value.length > 3,
  value => value.includes('o'),
]);

isValidString('hello'); // => true
isValidString('hi'); // => false (长度为3以下)
isValidString('test'); // => false (没有'o')

// 检查数字范围
const isInRange = overEvery([
  num => num >= 0,
  num => num <= 100,
  num => num % 1 === 0, // 检查是否为整数
]);

isInRange(50); // => true
isInRange(-5); // => false (小于0)
isInRange(150); // => false (超过100)
isInRange(50.5); // => false (不是整数)
```

也可以检查对象属性。

```typescript
import { overEvery } from 'es-toolkit/compat';

// 检查对象属性
const isValidUser = overEvery([
  'name', // name属性是否为真值
  { age: 30 }, // age是否为30
  ['active', true], // active是否为true
]);

isValidUser({ name: 'John', age: 30, active: true }); // => true
isValidUser({ name: '', age: 30, active: true }); // => false (name为空字符串)
isValidUser({ name: 'John', age: 25, active: true }); // => false (age不同)
```

## overSome

### `overSome(...predicates)`

接收多个条件函数，创建一个函数，该函数检查给定值是否满足任意一个条件。对灵活的条件检查或替代验证很有用。

```typescript
import { overSome } from 'es-toolkit/compat';

// 检查是否为字符串或数字
const isStringOrNumber = overSome([value => typeof value === 'string', value => typeof value === 'number']);

isStringOrNumber('hello'); // => true
isStringOrNumber(42); // => true
isStringOrNumber(true); // => false

// 检查多个条件中是否有任意一个满足
const hasValidProperty = overSome([
  obj => obj.name && obj.name.length > 0,
  obj => obj.email && obj.email.includes('@'),
  obj => obj.phone && obj.phone.length >= 10,
]);

hasValidProperty({ name: 'John' }); // => true
hasValidProperty({ email: 'john@example.com' }); // => true
hasValidProperty({ phone: '1234567890' }); // => true
hasValidProperty({ age: 30 }); // => false
```

也可以检查对象属性。

```typescript
import { overSome } from 'es-toolkit/compat';

// 检查多个条件中是否有任意一个匹配
const matchesAnyCondition = overSome([
  'isActive', // isActive属性是否为真值
  { role: 'admin' }, // role是否为'admin'
  ['status', 'vip'], // status是否为'vip'
]);

matchesAnyCondition({ isActive: true }); // => true
matchesAnyCondition({ role: 'admin' }); // => true
matchesAnyCondition({ status: 'vip' }); // => true
matchesAnyCondition({ role: 'user', status: 'normal' }); // => false
```

## stubArray

### `stubArray()`

始终返回新空数组的函数。当需要空数组作为默认值或在函数式编程中需要一致的返回值时使用。

```typescript
import { stubArray } from 'es-toolkit/compat';

// 返回空数组
const emptyArray = stubArray();
console.log(emptyArray); // => []

// 在数组方法中作为默认值使用
const items = [1, 2, 3];
const result = items.filter(x => x > 5) || stubArray();
console.log(result); // => []

// 在函数式编程中使用
const getData = () => stubArray();
const data = getData();
data.push('item'); // 新数组，所以安全
```

每次返回新的数组实例。

```typescript
import { stubArray } from 'es-toolkit/compat';

const arr1 = stubArray();
const arr2 = stubArray();

console.log(arr1 === arr2); // => false (不同实例)
console.log(Array.isArray(arr1)); // => true
console.log(arr1.length); // => 0
```

## stubFalse

### `stubFalse()`

始终返回 `false` 的函数。在函数式编程中需要一致的假值或在条件回调中作为默认值时很有用。

```typescript
import { stubFalse } from 'es-toolkit/compat';

// 返回 false
const result = stubFalse();
console.log(result); // => false

// 在数组过滤中作为默认条件使用
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(stubFalse); // 移除所有元素
console.log(evenNumbers); // => []

// 在函数式编程中使用
const isValid = condition => (condition ? someValidation : stubFalse);
const validator = isValid(false);
console.log(validator()); // => false
```

每次返回相同的 `false` 值。

```typescript
import { stubFalse } from 'es-toolkit/compat';

const result1 = stubFalse();
const result2 = stubFalse();

console.log(result1 === result2); // => true
console.log(typeof result1); // => 'boolean'
console.log(result1); // => false
```

## stubObject

### `stubObject()`

始终返回新空对象的函数。当需要空对象作为默认值或在函数式编程中需要一致的返回值时使用。

```typescript
import { stubObject } from 'es-toolkit/compat';

// 返回空对象
const emptyObject = stubObject();
console.log(emptyObject); // => {}

// 作为默认值使用
function processData(data = stubObject()) {
  return { ...data, processed: true };
}

console.log(processData()); // => { processed: true }
console.log(processData({ name: 'John' })); // => { name: 'John', processed: true }

// 在函数式编程中使用
const createEmpty = () => stubObject();
const obj = createEmpty();
obj.newProperty = 'value'; // 新对象，所以安全
```

每次返回新的对象实例。

```typescript
import { stubObject } from 'es-toolkit/compat';

const obj1 = stubObject();
const obj2 = stubObject();

console.log(obj1 === obj2); // => false (不同实例)
console.log(typeof obj1); // => 'object'
console.log(Object.keys(obj1).length); // => 0
```

## stubString

### `stubString()`

始终返回空字符串的函数。当需要空字符串作为默认值或在函数式编程中需要一致的返回值时使用。

```typescript
import { stubString } from 'es-toolkit/compat';

// 返回空字符串
const emptyString = stubString();
console.log(emptyString); // => ''

// 作为默认值使用
function formatMessage(message = stubString()) {
  return message || '默认消息';
}

console.log(formatMessage()); // => '默认消息'
console.log(formatMessage('你好')); // => '你好'

// 在函数式编程中使用
const createEmpty = () => stubString();
const str = createEmpty();
console.log(str.length); // => 0
```

每次返回相同的空字符串。

```typescript
import { stubString } from 'es-toolkit/compat';

const str1 = stubString();
const str2 = stubString();

console.log(str1 === str2); // => true
console.log(typeof str1); // => 'string'
console.log(str1.length); // => 0
```

## stubTrue

### `stubTrue()`

当需要始终返回 `true` 值的回调函数或默认值时，使用 `stubTrue`。在数组方法的过滤或条件逻辑中提供一致的 `true` 值时很有用。

```typescript
import { stubTrue } from 'es-toolkit/compat';

// 保留数组中所有元素的过滤器
const items = [1, 2, 3, 4, 5];
const allItems = items.filter(stubTrue);
console.log(allItems); // [1, 2, 3, 4, 5]
```

也可以在条件设置中作为默认值使用。

```typescript
import { stubTrue } from 'es-toolkit/compat';

// 默认启用的选项
const defaultOptions = {
  enableFeatureA: stubTrue(),
  enableFeatureB: stubTrue(),
  enableFeatureC: stubTrue(),
};

console.log(defaultOptions); // { enableFeatureA: true, enableFeatureB: true, enableFeatureC: true }
```

## times

### `times(n, iteratee)`

执行给定次数的迭代函数并将结果作为数组返回。每次迭代时将当前索引传递给函数。

```typescript
import { times } from 'es-toolkit/compat';

// 从0到2的索引乘以2的值数组
times(3, i => i * 2);
// 返回：[0, 2, 4]

// 多次生成相同值
times(2, () => 'es-toolkit');
// 返回：['es-toolkit', 'es-toolkit']
```

如果不传递函数，则返回索引数组。

```typescript
import { times } from 'es-toolkit/compat';

times(3);
// 返回：[0, 1, 2]
```

## toArray

### `toArray(value)`

将各种值转换为数组。对象转换为值的数组，类数组对象转换为数组，其他值转换为空数组。

```typescript
import { toArray } from 'es-toolkit/compat';

// 将对象转换为值的数组
toArray({ a: 1, b: 2 });
// Returns: [1, 2]

// 将字符串转换为字符数组
toArray('abc');
// Returns: ['a', 'b', 'c']

// 将 Map 转换为值的数组
const map = new Map([
  ['a', 1],
  ['b', 2],
]);
toArray(map);
// Returns: [['a', 1], ['b', 2]]
```

null 或 undefined 转换为空数组。

```typescript
import { toArray } from 'es-toolkit/compat';

toArray(null);
// Returns: []

toArray(undefined);
// Returns: []
```

## toFinite

### `toFinite(value)`

将值转换为有限数字。无穷大转换为 Number.MAX_VALUE，NaN 转换为 0。

```typescript
import { toFinite } from 'es-toolkit/compat';

// 普通数字原样返回
toFinite(3.2);
// Returns: 3.2

// 无穷大转换为 MAX_VALUE
toFinite(Infinity);
// Returns: 1.7976931348623157e+308

toFinite(-Infinity);
// Returns: -1.7976931348623157e+308

// 字符串数字转换为数字
toFinite('3.2');
// Returns: 3.2
```

无效值转换为 0。

```typescript
import { toFinite } from 'es-toolkit/compat';

toFinite(NaN);
// Returns: 0

toFinite(Symbol.iterator);
// Returns: 0

toFinite(null);
// Returns: 0
```

## toInteger

### `toInteger(value)`

将值转换为整数。小数部分被舍弃，只保留整数部分。

```typescript
import { toInteger } from 'es-toolkit/compat';

// 将小数转换为整数
toInteger(3.2);
// Returns: 3

// 将字符串数字转换为整数
toInteger('3.2');
// Returns: 3

// 非常小的数变为 0
toInteger(Number.MIN_VALUE);
// Returns: 0

// 无穷大变为 MAX_VALUE
toInteger(Infinity);
// Returns: 1.7976931348623157e+308
```

无效值转换为 0。

```typescript
import { toInteger } from 'es-toolkit/compat';

toInteger(NaN);
// Returns: 0

toInteger(Symbol.iterator);
// Returns: 0

toInteger(null);
// Returns: 0
```

## toLength

### `toLength(value)`

将值转换为有效的数组索引。限制为 0 以上 2^32-1 以下的整数。

```typescript
import { toLength } from 'es-toolkit/compat';

// 将小数转换为整数
toLength(3.2);
// Returns: 3

// 负数转换为 0
toLength(-1);
// Returns: 0

// 字符串数字进行转换
toLength('42');
// Returns: 42

// 非常大的数转换为限制值
toLength(Number.MAX_VALUE);
// Returns: 4294967295
```

null 或 undefined 转换为 0。

```typescript
import { toLength } from 'es-toolkit/compat';

toLength(null);
// Returns: 0

toLength(undefined);
// Returns: 0
```

## toNumber

### `toNumber(value)`

将值转换为数字。符号处理为 NaN。

```typescript
import { toNumber } from 'es-toolkit/compat';

// 普通数字原样返回
toNumber(3.2);
// Returns: 3.2

// 字符串数字进行转换
toNumber('3.2');
// Returns: 3.2

// 无穷大也原样返回
toNumber(Infinity);
// Returns: Infinity

// 非常小的数也原样返回
toNumber(Number.MIN_VALUE);
// Returns: 5e-324
```

符号和 NaN 转换为 NaN。

```typescript
import { toNumber } from 'es-toolkit/compat';

toNumber(Symbol.iterator);
// Returns: NaN

toNumber(NaN);
// Returns: NaN
```

## toPath

### `toPath(deepKey)`

将深层键字符串转换为路径数组。支持点表示法和方括号表示法。

```typescript
import { toPath } from 'es-toolkit/compat';

// 点表示法
toPath('a.b.c');
// Returns: ['a', 'b', 'c']

// 方括号表示法
toPath('a[b][c]');
// Returns: ['a', 'b', 'c']

// 混合表示法
toPath('a.b[c].d');
// Returns: ['a', 'b', 'c', 'd']

// 用引号包围的键
toPath('a["b.c"].d');
// Returns: ['a', 'b.c', 'd']
```

还能处理前导点或空键。

```typescript
import { toPath } from 'es-toolkit/compat';

// 前导点的情况
toPath('.a.b.c');
// Returns: ['', 'a', 'b', 'c']

// 空字符串
toPath('');
// Returns: []

// 复杂路径
toPath('.a[b].c.d[e]["f.g"].h');
// Returns: ['', 'a', 'b', 'c', 'd', 'e', 'f.g', 'h']
```

## toPlainObject

### `toPlainObject(value)`

将值转换为普通对象。将继承的可枚举字符串键属性扁平化为自身属性。

```typescript
import { toPlainObject } from 'es-toolkit/compat';

// 构造函数和原型
function Foo() {
  this.b = 2;
}
Foo.prototype.c = 3;

const foo = new Foo();
toPlainObject(foo);
// Returns: { b: 2, c: 3 }

// 将数组转换为对象
toPlainObject([1, 2, 3]);
// Returns: { 0: 1, 1: 2, 2: 3 }
```

处理各种对象类型。

```typescript
import { toPlainObject } from 'es-toolkit/compat';

// 将字符串转换为对象
toPlainObject('abc');
// Returns: { 0: 'a', 1: 'b', 2: 'c' }

// 已经是普通对象的情况
const obj = { a: 1, b: 2 };
toPlainObject(obj);
// Returns: { a: 1, b: 2 }
```

## toSafeInteger

### `toSafeInteger(value)`

当您想要将值转换为安全整数时，请使用 `toSafeInteger`。安全整数是在 JavaScript 中可以准确表示的整数，在 `Number.MIN_SAFE_INTEGER` 和 `Number.MAX_SAFE_INTEGER` 范围内的值。

```typescript
import { toSafeInteger } from 'es-toolkit/compat';

toSafeInteger(3.2);
// Returns: 3

toSafeInteger(Infinity);
// Returns: 9007199254740991

toSafeInteger('3.2');
// Returns: 3

// 字符串转换
toSafeInteger('abc');
// Returns: 0

// 特殊值处理
toSafeInteger(NaN);
// Returns: 0

toSafeInteger(null);
// Returns: 0

toSafeInteger(undefined);
// Returns: 0
```

无穷大值也会限制在安全范围内。

```typescript
import { toSafeInteger } from 'es-toolkit/compat';

toSafeInteger(-Infinity);
// Returns: -9007199254740991 (Number.MIN_SAFE_INTEGER)

toSafeInteger(Number.MAX_VALUE);
// Returns: 9007199254740991
```

用作数组索引或 ID 值时很有用。

```typescript
import { toSafeInteger } from 'es-toolkit/compat';

function getArrayItem(arr: any[], index: any) {
  const safeIndex = toSafeInteger(index);
  return arr[safeIndex];
}

const items = ['a', 'b', 'c', 'd', 'e'];
console.log(getArrayItem(items, '2.7')); // 'c' (索引 2)
console.log(getArrayItem(items, Infinity)); // undefined (超出范围)
```

## toString

### `toString(value)`

将值转换为字符串。null 和 undefined 转换为空字符串，保留 -0 的符号。

```typescript
import { toString } from 'es-toolkit/compat';

// 基本类型
toString(null);
// Returns: ''

toString(undefined);
// Returns: ''

toString('hello');
// Returns: 'hello'

toString(123);
// Returns: '123'

// 保留 -0 的符号
toString(-0);
// Returns: '-0'
```

数组进行递归转换。

```typescript
import { toString } from 'es-toolkit/compat';

// 将数组转换为字符串
toString([1, 2, 3]);
// Returns: '1,2,3'

// 嵌套数组
toString([1, [2, 3], 4]);
// Returns: '1,2,3,4'

// 包含 -0 的数组
toString([1, 2, -0]);
// Returns: '1,2,-0'

// 包含符号的数组
toString([Symbol('a'), Symbol('b')]);
// Returns: 'Symbol(a),Symbol(b)'
```

## uniqueId

### `uniqueId(prefix?: string): string`

生成唯一的字符串标识符。通过递增内部计数器来保证唯一性。

```typescript
import { uniqueId } from 'es-toolkit/compat';

// 带前缀生成唯一 ID
uniqueId('contact_'); // => 'contact_1'
uniqueId('user_'); // => 'user_2'

// 不带前缀生成唯一 ID
uniqueId(); // => '3'
uniqueId(); // => '4'
```

每次连续调用时内部计数器递增。

```typescript
import { uniqueId } from 'es-toolkit/compat';

// 每次调用生成不同的 ID
const ids = Array.from({ length: 5 }, () => uniqueId('item_'));
console.log(ids);
// => ['item_1', 'item_2', 'item_3', 'item_4', 'item_5']
```

对生成 DOM 元素的唯一 ID 很有用。

```typescript
import { uniqueId } from 'es-toolkit/compat';

// 生成表单元素的唯一 ID
const inputId = uniqueId('input_');
const labelId = uniqueId('label_');

console.log(inputId); // => 'input_6'
console.log(labelId); // => 'label_7'
```
