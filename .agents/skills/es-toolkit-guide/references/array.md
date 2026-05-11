# 用法汇总 - array

## at

### `at(arr, indices)`

当您想从数组中选择特定位置的元素时,请使用 `at`。您可以使用负索引从数组末尾选择元素。

```typescript
import { at } from 'es-toolkit/array';

// 从数字数组中获取多个索引处的元素。
at([10, 20, 30, 40, 50], [1, 3, 4]);
// 返回: [20, 40, 50]

// 使用负索引从末尾获取元素。
at(['a', 'b', 'c', 'd'], [0, -1, -2]);
// 返回: ['a', 'd', 'c']
```

非整数索引会被转换为整数。

```typescript
import { at } from 'es-toolkit/array';

at([1, 2, 3, 4], [1.5, 2.9]); // [2, 3]
```

## chunk

### `chunk(arr, size)`

当您想将一个长数组拆分成多个大小相同的较小数组时,请使用 `chunk`。如果数组无法平均分割,最后一个块将包含剩余的元素。

```typescript
import { chunk } from 'es-toolkit/array';

// 将数字数组拆分为大小为 2 的块。
chunk([1, 2, 3, 4, 5], 2);
// 返回: [[1, 2], [3, 4], [5]]

// 将字符串数组拆分为大小为 3 的块。
chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3);
// 返回: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
```

拆分空数组会返回空数组。

```typescript
import { chunk } from 'es-toolkit/array';

chunk([], 2); // []
```



#### 抛出错误

如果 `size` 不是正整数,则抛出错误。

## countBy

### `countBy(arr, mapper)`

当您想按特定标准对数组元素进行分类并统计每组数量时,请使用 `countBy`。使用转换函数返回的值作为键对元素进行分组,并计算每组中的元素数量。

```typescript
import { countBy } from 'es-toolkit/array';

// 将数字分类为奇数/偶数并统计数量。
countBy([1, 2, 3, 4, 5], item => (item % 2 === 0 ? 'even' : 'odd'));
// 返回: { odd: 3, even: 2 }
```

也可以根据对象数组的特定属性进行统计。

```typescript
import { countBy } from 'es-toolkit/array';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
  { name: 'David', age: 30 },
];

countBy(users, user => user.age);
// 返回: { '25': 2, '30': 2 }
```

## difference

### `difference(firstArr, secondArr)`

当您想求两个数组的差集时,请使用 `difference`。返回一个新数组,包含只在第一个数组中存在而第二个数组中不存在的元素。

```typescript
import { difference } from 'es-toolkit/array';

// 求数字数组的差集。
const array1 = [1, 2, 3, 4, 5];
const array2 = [2, 4];
difference(array1, array2);
// 返回: [1, 3, 5]
// 2 和 4 在两个数组中都存在,所以被排除。

// 求字符串数组的差集。
const colors1 = ['red', 'blue', 'green'];
const colors2 = ['blue', 'yellow'];
difference(colors1, colors2);
// 返回: ['red', 'green']
```

与空数组的差集等于原数组。

```typescript
import { difference } from 'es-toolkit/array';

difference([1, 2, 3], []); // [1, 2, 3]
difference([], [1, 2, 3]); // []
```

## differenceBy

### `differenceBy(firstArr, secondArr, mapper)`

当您想根据特定标准比较两个数组的元素并求差集时,请使用 `differenceBy`。根据转换函数转换每个元素后的值进行比较,返回只在第一个数组中存在的元素。

```typescript
import { differenceBy } from 'es-toolkit/array';

// 根据 id 对对象数组求差集。
const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
const array2 = [{ id: 2 }, { id: 4 }];
differenceBy(array1, array2, item => item.id);
// 返回: [{ id: 1 }, { id: 3 }]
// id 为 2 的元素在两个数组中都存在,所以被排除。

// 也可以比较不同类型的数组。
const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
const numbers = [2, 4];
differenceBy(objects, numbers, item => (typeof item === 'object' ? item.id : item));
// 返回: [{ id: 1 }, { id: 3 }]
```

也可以根据字符串长度求差集。

```typescript
import { differenceBy } from 'es-toolkit/array';

const words1 = ['apple', 'banana', 'cherry'];
const words2 = ['grape', 'lemon'];
differenceBy(words1, words2, word => word.length);
// 返回: ['banana', 'cherry']
// 'apple' 与 'grape' 或 'lemon' 长度相同,所以被排除。
```

## differenceWith

### `differenceWith(firstArr, secondArr, areItemsEqual)`

当您想使用自定义函数比较两个数组的元素并求差集时,请使用 `differenceWith`。通过比较函数判断两个元素是否相同,返回只在第一个数组中存在的元素。

```typescript
import { differenceWith } from 'es-toolkit/array';

// 根据 id 对对象数组求差集
const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
const array2 = [{ id: 2 }, { id: 4 }];
const areItemsEqual = (a, b) => a.id === b.id;
differenceWith(array1, array2, areItemsEqual);
// Returns: [{ id: 1 }, { id: 3 }]
// id 为 2 的元素被判断为相同,所以被排除

// 也可以比较不同类型的数组
const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
const numbers = [2, 4];
const areItemsEqual2 = (a, b) => a.id === b;
differenceWith(objects, numbers, areItemsEqual2);
// Returns: [{ id: 1 }, { id: 3 }]
```

可以使用复杂条件比较元素。

```typescript
import { differenceWith } from 'es-toolkit/array';

const users1 = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];
const users2 = [
  { name: 'Alice', age: 31 }, // 即使年龄不同,名字相同就是同一个用户
  { name: 'David', age: 25 },
];

const areUsersEqual = (a, b) => a.name === b.name;
differenceWith(users1, users2, areUsersEqual);
// Returns: [{ name: 'Bob', age: 25 }, { name: 'Charlie', age: 35 }]
```

## drop

### `drop(arr, itemsCount)`

当您想从数组前面移除一部分元素时,请使用 `drop`。移除指定数量的开头元素,返回一个包含剩余元素的新数组。

```typescript
import { drop } from 'es-toolkit/array';

// 移除数组的前 2 个元素
drop([1, 2, 3, 4, 5], 2);
// Returns: [3, 4, 5]

// 如果要移除的数量大于数组长度,则返回空数组
drop([1, 2, 3], 5);
// Returns: []
```

传入负数或 0 时,返回一个包含与原数组相同元素的新数组。

```typescript
import { drop } from 'es-toolkit/array';

drop([1, 2, 3], 0); // [1, 2, 3]
drop([1, 2, 3], -2); // [1, 2, 3]
```

## dropRight

### `dropRight(arr, itemsCount)`

当您想从数组后面移除一部分元素时,请使用 `dropRight`。移除指定数量的末尾元素,返回一个包含剩余元素的新数组。

```typescript
import { dropRight } from 'es-toolkit/array';

// 移除数组的最后 2 个元素
dropRight([1, 2, 3, 4, 5], 2);
// Returns: [1, 2, 3]

// 如果要移除的数量大于数组长度,则返回空数组
dropRight([1, 2, 3], 5);
// Returns: []
```

传入负数或 0 时,返回一个包含与原数组相同元素的新数组。

```typescript
import { dropRight } from 'es-toolkit/array';

dropRight([1, 2, 3], 0); // [1, 2, 3]
dropRight([1, 2, 3], -2); // [1, 2, 3]
```

## dropRightWhile

### `dropRightWhile(arr, canContinueDropping)`

当您想从数组后面移除满足特定条件的元素时,请使用 `dropRightWhile`。从数组末尾开始,在条件函数返回 `true` 期间移除元素,当条件函数返回 `false` 时停止。

```typescript
import { dropRightWhile } from 'es-toolkit/array';

// 从末尾开始移除大于 3 的元素
const numbers = [1, 2, 3, 4, 5];
dropRightWhile(numbers, x => x > 3);
// Returns: [1, 2, 3]
// 4 和 5 满足条件被移除,在 3 处条件变为 false 而停止

// 从对象数组中移除满足特定条件的元素
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: true },
  { name: 'Charlie', active: false },
  { name: 'David', active: false },
];
dropRightWhile(users, user => !user.active);
// Returns: [{ name: 'Alice', active: true }, { name: 'Bob', active: true }]
```

如果是空数组或没有满足条件的元素,则返回与原数组相同的新数组。

```typescript
import { dropRightWhile } from 'es-toolkit/array';

dropRightWhile([1, 2, 3], x => x > 5); // [1, 2, 3]
dropRightWhile([], x => true); // []
```

## dropWhile

### `dropWhile(arr, canContinueDropping)`

当您想从数组前面移除满足特定条件的元素时,请使用 `dropWhile`。从数组开头开始,在条件函数返回 `true` 期间移除元素,当条件函数返回 `false` 时停止。

```typescript
import { dropWhile } from 'es-toolkit/array';

// 从开头开始移除小于 3 的元素
const numbers = [1, 2, 3, 4, 2, 5];
dropWhile(numbers, x => x < 3);
// Returns: [3, 4, 2, 5]
// 1 和 2 满足条件被移除,在 3 处条件变为 false 而停止

// 从对象数组中移除满足特定条件的元素
const users = [
  { name: 'Alice', active: false },
  { name: 'Bob', active: false },
  { name: 'Charlie', active: true },
  { name: 'David', active: true },
];
dropWhile(users, user => !user.active);
// Returns: [{ name: 'Charlie', active: true }, { name: 'David', active: true }]
```

如果是空数组或没有满足条件的元素,则返回与原数组相同的新数组。

```typescript
import { dropWhile } from 'es-toolkit/array';

dropWhile([1, 2, 3], x => x > 5); // [1, 2, 3]
dropWhile([], x => true); // []
```

## fill

### `fill(arr, value, start?, end?)`

当您想用指定的值填充数组的特定范围时,请使用 `fill`。从开始位置到结束位置之前的元素将被替换为提供的值。如果不指定开始或结束位置,将填充整个数组。

```typescript
import { fill } from 'es-toolkit/array';

// 用 'a' 填充整个数组
const array1 = [1, 2, 3];
fill(array1, 'a');
// Returns: ['a', 'a', 'a']

// 用 2 填充空数组
const array2 = Array(3);
fill(array2, 2);
// Returns: [2, 2, 2]

// 用 '*' 填充索引 1 到 3 之前的位置
const array3 = [4, 6, 8, 10];
fill(array3, '*', 1, 3);
// Returns: [4, '*', '*', 10]
```

也可以使用负数索引。负数索引从数组末尾开始计算。

```typescript
import { fill } from 'es-toolkit/array';

const array = [1, 2, 3];
fill(array, '*', -2, -1);
// Returns: [1, '*', 3]
```

## flatMap

### `flatMap(arr, iteratee, depth = 1)`

当您想在转换数组的每个元素的同时进行扁平化时,请使用 `flatMap`。首先对每个元素应用函数,然后将结果数组扁平化到指定深度。

与 JavaScript 内置的 [Array#flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 和 [Array#map](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 组合调用 `map(iteratee).flat(depth)` 的效果相同,但速度更快。

```typescript
import { flatMap } from 'es-toolkit/array';

// 将数字数组的每个元素复制两次
const arr = [1, 2, 3];
flatMap(arr, item => [item, item]);
// Returns: [1, 1, 2, 2, 3, 3]

// 扁平化深度为 2
flatMap(arr, item => [[item, item]], 2);
// Returns: [1, 1, 2, 2, 3, 3]
```

可以使用不同的深度进行扁平化。

```typescript
import { flatMap } from 'es-toolkit/array';

const arr = [1, 2, 3];

// 使用默认深度 1 进行扁平化
flatMap(arr, item => [item, item]);
// Returns: [1, 1, 2, 2, 3, 3]

// 使用深度 3 进行扁平化
flatMap(arr, item => [[[item, item]]], 3);
// Returns: [1, 1, 2, 2, 3, 3]
```

## flatMapDeep

### `flatMapDeep(arr, iteratee)`

当您想在转换数组的每个元素的同时完全扁平化所有嵌套数组时,请使用 `flatMapDeep`。首先对每个元素应用函数,然后将结果数组扁平化到所有深度。

```typescript
import { flatMapDeep } from 'es-toolkit/array';

// 将每个元素复制两次后完全扁平化
const result1 = flatMapDeep([1, 2, 3], item => [item, item]);
// Returns: [1, 1, 2, 2, 3, 3]
```

无论嵌套多深的数组都会完全扁平化。

```typescript
import { flatMapDeep } from 'es-toolkit/array';

// 嵌套数组也会完全扁平化
const result = flatMapDeep([1, 2, 3], item => [[item, item]]);
// Returns: [1, 1, 2, 2, 3, 3]

// 多层嵌套也会全部扁平化
const result2 = flatMapDeep([1, 2, 3], item => [[[item, item]]]);
// Returns: [1, 1, 2, 2, 3, 3]
```

## flatten

### `flatten(arr, depth = 1)`

当您想将嵌套数组扁平化到特定深度时,请使用 `flatten`。它将数组内的数组展开到指定级别,形成平面结构。

与 JavaScript 内置的 [Array#flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 效果相同,但速度更快。

```typescript
import { flatten } from 'es-toolkit/array';

// 使用默认深度 1 进行扁平化
const array = [1, [2, 3], [4, [5, 6]]];
flatten(array);
// Returns: [1, 2, 3, 4, [5, 6]]

// 使用深度 2 进行扁平化
flatten(array, 2);
// Returns: [1, 2, 3, 4, 5, 6]
```

可以调整深度,只扁平化到想要的级别。

```typescript
import { flatten } from 'es-toolkit/array';

const array = [1, [2, 3], [4, [5, 6]]];

// 使用深度 1 进行扁平化(默认值)
const result1 = flatten(array, 1);
// Returns: [1, 2, 3, 4, [5, 6]]

// 使用深度 2 进行扁平化
const result2 = flatten(array, 2);
// Returns: [1, 2, 3, 4, 5, 6]
```

## flattenDeep

### `flattenDeep(arr)`

当您想完全扁平化嵌套数组,无论嵌套多深时,请使用 `flattenDeep`。它将数组内的所有嵌套数组展开,形成一个平面结构。

与 JavaScript 内置的 [Array#flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 调用 `flat(Infinity)` 的效果相同,但速度更快。

```typescript
import { flattenDeep } from 'es-toolkit/array';

// 扁平化所有嵌套级别
const array = [1, [2, [3]], [4, [5, 6]]];
const result = flattenDeep(array);
// Returns: [1, 2, 3, 4, 5, 6]
```

无论多复杂的嵌套结构都会完全扁平化。

```typescript
import { flattenDeep } from 'es-toolkit/array';

const complexArray = [1, [2, [3, [4, [5]]]], 6];
const result = flattenDeep(complexArray);
// Returns: [1, 2, 3, 4, 5, 6]
```

## forEachRight

### `forEachRight(arr, callback)`

当您想逆序遍历数组并对每个元素执行操作时,请使用 `forEachRight`。它从数组的最后一个元素到第一个元素依次调用回调函数。在需要逆序处理或从数组末尾开始工作时很有用。

```typescript
import { forEachRight } from 'es-toolkit/array';

const array = [1, 2, 3];
const result: number[] = [];

// 使用 forEachRight 函数逆序遍历数组
forEachRight(array, value => {
  result.push(value);
});

console.log(result); // [3, 2, 1]
```

回调函数接收三个参数。

```typescript
import { forEachRight } from 'es-toolkit/array';

const array = ['a', 'b', 'c'];
forEachRight(array, (value, index, arr) => {
  console.log(`值: ${value}, 索引: ${index}, 数组:`, arr);
});
// 输出:
// 值: c, 索引: 2, 数组: ['a', 'b', 'c']
// 值: b, 索引: 1, 数组: ['a', 'b', 'c']
// 值: a, 索引: 0, 数组: ['a', 'b', 'c']
```

## groupBy

### `groupBy(arr, getKeyFromItem)`

当您想根据特定标准对数组元素进行分类时,请使用 `groupBy`。提供一个从每个元素生成键的函数,它将具有相同键的元素分组在一起并作为对象返回。返回对象的值是属于每个组的元素数组。在按类别整理数据或进行分组分析时很有用。

```typescript
import { groupBy } from 'es-toolkit/array';

// 按类别对对象数组进行分组
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' },
];

const result = groupBy(items, item => item.category);
// 结果:
// {
//   fruit: [
//     { category: 'fruit', name: 'apple' },
//     { category: 'fruit', name: 'banana' }
//   ],
//   vegetable: [
//     { category: 'vegetable', name: 'carrot' }
//   ]
// }
```

可以按各种标准进行分组。

```typescript
import { groupBy } from 'es-toolkit/array';

// 按字符串长度分组
const words = ['one', 'two', 'three', 'four', 'five'];
const byLength = groupBy(words, word => word.length);
// 结果: { 3: ['one', 'two'], 4: ['four', 'five'], 5: ['three'] }

// 按奇数/偶数分组
const numbers = [1, 2, 3, 4, 5, 6];
const byParity = groupBy(numbers, num => (num % 2 === 0 ? 'even' : 'odd'));
// 结果: { odd: [1, 3, 5], even: [2, 4, 6] }
```

## head

### `head(arr)`

当您想获取数组的第一个元素时,请使用 `head`。如果数组为空,则返回 `undefined`。在访问数组开头的数据时很有用。

```typescript
import { head } from 'es-toolkit/array';

// 获取数字数组的第一个元素
const numbers = [1, 2, 3, 4, 5];
head(numbers);
// Returns: 1

// 获取字符串数组的第一个元素
const strings = ['a', 'b', 'c'];
head(strings);
// Returns: 'a'

// 空数组返回 undefined
const emptyArray: number[] = [];
head(emptyArray);
// Returns: undefined
```

类型处理很安全。

```typescript
import { head } from 'es-toolkit/array';

// 非空数组的情况下类型明确
const nonEmptyArray = [1, 2, 3] as const;
head(nonEmptyArray);
// Returns: 1 (类型: 1)

// 普通数组的情况下可能为 undefined
const maybeEmptyArray = [1, 2, 3];
head(maybeEmptyArray);
// Returns: 1 | undefined (类型: number | undefined)
```

## initial

### `initial(arr)`

当您想获取除最后一个元素外的所有元素时,请使用 `initial`。如果数组为空或只有一个元素,则返回空数组。在需要排除数组末尾进行处理时很有用。

```typescript
import { initial } from 'es-toolkit/array';

// 从数字数组中排除最后一个元素
const numbers = [1, 2, 3, 4, 5];
initial(numbers);
// Returns: [1, 2, 3, 4]

// 从字符串数组中排除最后一个元素
const strings = ['a', 'b', 'c'];
initial(strings);
// Returns: ['a', 'b']

// 只有一个元素的数组返回空数组
const single = [42];
initial(single);
// Returns: []
```

空数组或特殊情况也能安全处理。

```typescript
import { initial } from 'es-toolkit/array';

// 空数组返回空数组
const empty: number[] = [];
initial(empty);
// Returns: []

// 也可以处理嵌套数组
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
initial(nested);
// Returns: [[1, 2], [3, 4]]
```

## intersection

### `intersection(firstArr, secondArr)`

当您想只查找两个数组的共同元素时,请使用 `intersection`。它从第一个数组的元素中,只返回第二个数组中也存在的元素组成的新数组。在求两个数据集的交集时很有用。

```typescript
import { intersection } from 'es-toolkit/array';

// 求数字数组的交集
const numbers1 = [1, 2, 3, 4, 5];
const numbers2 = [3, 4, 5, 6, 7];
intersection(numbers1, numbers2);
// Returns: [3, 4, 5]

// 求字符串数组的交集
const strings1 = ['apple', 'banana', 'cherry'];
const strings2 = ['banana', 'cherry', 'date'];
intersection(strings1, strings2);
// Returns: ['banana', 'cherry']
```

也能处理没有交集或特殊情况。

```typescript
import { intersection } from 'es-toolkit/array';

// 没有交集时返回空数组
const noCommon1 = [1, 2, 3];
const noCommon2 = [4, 5, 6];
intersection(noCommon1, noCommon2);
// Returns: []

// 一方为空数组时也返回空数组
const numbers = [1, 2, 3];
const empty: number[] = [];
intersection(numbers, empty);
// Returns: []
```

## intersectionBy

### `intersectionBy(firstArr, secondArr, mapper)`

当您想根据特定属性或转换后的值查找两个数组的共同元素时,请使用 `intersectionBy`。它比较用转换函数处理每个元素后的结果来求交集。在对象数组中按特定属性比较或需要复杂转换逻辑时很有用。

```typescript
import { intersectionBy } from 'es-toolkit/array';

// 根据对象的 id 属性求交集
const users1 = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
  { id: 3, name: 'bob' },
];
const users2 = [
  { id: 2, name: 'jane' },
  { id: 4, name: 'alice' },
];
intersectionBy(users1, users2, user => user.id);
// Returns: [{ id: 2, name: 'jane' }]

// 也可以比较不同类型的数组
const objects = [
  { id: 1, name: 'apple' },
  { id: 2, name: 'banana' },
];
const ids = [2, 3, 4];
intersectionBy(objects, ids, item => (typeof item === 'object' ? item.id : item));
// Returns: [{ id: 2, name: 'banana' }]
```

也可以应用复杂的转换逻辑。

```typescript
import { intersectionBy } from 'es-toolkit/array';

// 转换为小写后比较字符串
const words1 = ['Apple', 'Banana', 'Cherry'];
const words2 = ['apple', 'DATE', 'elderberry'];
intersectionBy(words1, words2, word => word.toLowerCase());
// Returns: ['Apple']

// 转换为绝对值后比较数字
const numbers1 = [1, -2, 3, -4];
const numbers2 = [2, -3, 4, 5];
intersectionBy(numbers1, numbers2, num => Math.abs(num));
// Returns: [-2, 3, -4]
```

## intersectionWith

### `intersectionWith(firstArr, secondArr, areItemsEqual)`

当您想用自定义的比较函数查找两个数组的共同元素时,请使用 `intersectionWith`。在单纯的值比较难以处理的复杂对象或需要特殊比较逻辑的情况下很有用。

```typescript
import { intersectionWith } from 'es-toolkit/array';

// 按对象的 id 属性比较
const users1 = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
];
const users2 = [
  { id: 2, name: 'jane' },
  { id: 3, name: 'bob' },
];
intersectionWith(users1, users2, (a, b) => a.id === b.id);
// Returns: [{ id: 2, name: 'jane' }]

// 也可以比较不同类型
const objects = [
  { id: 1, name: 'apple' },
  { id: 2, name: 'banana' },
];
const ids = [2, 3];
intersectionWith(objects, ids, (obj, id) => obj.id === id);
// Returns: [{ id: 2, name: 'banana' }]
```

也可以实现复杂的比较逻辑。

```typescript
import { intersectionWith } from 'es-toolkit/array';

// 不区分大小写的字符串比较
const words1 = ['Apple', 'Banana'];
const words2 = ['apple', 'cherry'];
intersectionWith(words1, words2, (a, b) => a.toLowerCase() === b.toLowerCase());
// Returns: ['Apple']

// 范围内的数字比较
const numbers1 = [1.1, 2.3, 3.7];
const numbers2 = [1.0, 2.5, 4.0];
intersectionWith(numbers1, numbers2, (a, b) => Math.abs(a - b) < 0.5);
// Returns: [1.1] (1.1 和 1.0 的差小于 0.5)
```

## isSubset

### `isSubset(superset, subset)`

当您想确认一个数组的所有元素是否都包含在另一个数组中时,请使用 `isSubset`。在确认子集关系或检查权限、功能、标签等是否在允许范围内时很有用。

```typescript
import { isSubset } from 'es-toolkit/array';

// 检查数字数组的子集
const numbers = [1, 2, 3, 4, 5];
const subset = [2, 3, 4];
isSubset(numbers, subset);
// Returns: true

// 检查字符串数组的子集
const permissions = ['read', 'write', 'delete', 'admin'];
const userPermissions = ['read', 'write'];
isSubset(permissions, userPermissions);
// Returns: true

// 不是子集的情况
const colors = ['red', 'blue', 'green'];
const invalidColors = ['red', 'yellow'];
isSubset(colors, invalidColors);
// Returns: false
```

特殊情况也能正确处理。

```typescript
import { isSubset } from 'es-toolkit/array';

// 空数组始终是子集
const anyArray = [1, 2, 3];
const emptyArray: number[] = [];
isSubset(anyArray, emptyArray);
// Returns: true

// 相同的数组是自己的子集
const same = ['a', 'b', 'c'];
isSubset(same, same);
// Returns: true

// 即使有重复元素也能正常工作
const withDuplicates = [1, 2, 2, 3];
const duplicateSubset = [2, 2];
isSubset(withDuplicates, duplicateSubset);
// Returns: true
```

## isSubsetWith

### `isSubsetWith(superset, subset, areItemsEqual)`

当您想用自定义的比较函数确认子集关系时,请使用 `isSubsetWith`。在比较对象或需要特殊比较逻辑时很有用。

```typescript
import { isSubsetWith } from 'es-toolkit/array';

// 根据对象的 id 检查子集
const users = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
  { id: 3, name: 'bob' },
];
const targetUsers = [
  { id: 2, name: 'jane' },
  { id: 1, name: 'john' },
];
isSubsetWith(users, targetUsers, (a, b) => a.id === b.id);
// Returns: true

// 不是子集的情况
const allUsers = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
];
const someUsers = [{ id: 3, name: 'bob' }];
isSubsetWith(allUsers, someUsers, (a, b) => a.id === b.id);
// Returns: false
```

也可以使用复杂的比较逻辑。

```typescript
import { isSubsetWith } from 'es-toolkit/array';

// 不区分大小写的字符串比较
const validNames = ['Alice', 'Bob', 'Charlie'];
const userNames = ['alice', 'BOB'];
isSubsetWith(validNames, userNames, (a, b) => a.toLowerCase() === b.toLowerCase());
// Returns: true

// 范围内的数字比较
const validRanges = [1, 2, 3, 4, 5];
const testNumbers = [1.1, 2.8];
isSubsetWith(validRanges, testNumbers, (a, b) => Math.abs(a - b) < 0.5);
// Returns: true (1.1 与 1 足够接近,2.8 与 3 足够接近)
```

## keyBy

### `keyBy(arr, getKeyFromItem)`

当您想创建一个以键索引的对象以便快速查找数组的每个元素时,请使用 `keyBy`。提供一个从每个元素生成唯一键的函数,即可创建一个可以用该键访问元素的对象。如果有多个元素生成相同的键,则使用最后一个元素。

```typescript
import { keyBy } from 'es-toolkit/array';

// 使用对象的 id 属性作为键
const users = [
  { id: 1, name: 'john' },
  { id: 2, name: 'jane' },
  { id: 3, name: 'bob' },
];
keyBy(users, user => user.id);
// Returns: {
//   1: { id: 1, name: 'john' },
//   2: { id: 2, name: 'jane' },
//   3: { id: 3, name: 'bob' }
// }

// 使用字符串属性作为键
const products = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' },
];
keyBy(products, item => item.category);
// Returns: {
//   fruit: { category: 'fruit', name: 'banana' }, // 最后一个 fruit 元素
//   vegetable: { category: 'vegetable', name: 'carrot' }
// }
```

也可以使用复杂的键生成逻辑。

```typescript
import { keyBy } from 'es-toolkit/array';

// 组合多个属性创建键
const orders = [
  { date: '2023-01-01', customerId: 1, amount: 100 },
  { date: '2023-01-01', customerId: 2, amount: 200 },
  { date: '2023-01-02', customerId: 1, amount: 150 },
];
keyBy(orders, order => `${order.date}-${order.customerId}`);
// Returns: {
//   '2023-01-01-1': { date: '2023-01-01', customerId: 1, amount: 100 },
//   '2023-01-01-2': { date: '2023-01-01', customerId: 2, amount: 200 },
//   '2023-01-02-1': { date: '2023-01-02', customerId: 1, amount: 150 }
// }
```

## last

### `last(arr)`

当您想获取数组的最后一个元素时,请使用 `last`。如果数组为空,则返回 `undefined`。在访问数组末尾的数据时很有用。

```typescript
import { last } from 'es-toolkit/array';

// 获取数字数组的最后一个元素
const numbers = [1, 2, 3, 4, 5];
last(numbers);
// Returns: 5

// 获取字符串数组的最后一个元素
const strings = ['a', 'b', 'c'];
last(strings);
// Returns: 'c'

// 空数组返回 undefined
const emptyArray: number[] = [];
last(emptyArray);
// Returns: undefined
```

类型处理很安全。

```typescript
import { last } from 'es-toolkit/array';

// 非空数组的情况下类型明确
const nonEmptyArray = [1, 2, 3] as const;
last(nonEmptyArray);
// Returns: 3 (类型: 3)

// 普通数组的情况下可能为 undefined
const maybeEmptyArray = [1, 2, 3];
last(maybeEmptyArray);
// Returns: 3 | undefined (类型: number | undefined)
```

在大数组中也能高效工作。

```typescript
import { last } from 'es-toolkit/array';

// 性能已优化
const largeArray = Array(1000000)
  .fill(0)
  .map((_, i) => i);
last(largeArray);
// Returns: 999999 (快速访问)

// 也可以处理嵌套数组
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
last(nested);
// Returns: [5, 6]
```

## maxBy

### `maxBy(items, getValue)`

当您想用转换函数将数组元素转换为数值,并找到具有最大值的原始元素时,请使用 `maxBy`。对于空数组返回 `undefined`。

```typescript
import { maxBy } from 'es-toolkit/array';

// 从对象数组中找到特定属性具有最大值的元素
const people = [
  { name: 'john', age: 30 },
  { name: 'jane', age: 28 },
  { name: 'joe', age: 26 },
];
maxBy(people, person => person.age);
// Returns: { name: 'john', age: 30 }

// 从数字数组中找到绝对值最大的元素
const numbers = [-10, -5, 0, 5, 15];
maxBy(numbers, x => Math.abs(x));
// Returns: 15
```

对于空数组返回 `undefined`。

```typescript
import { maxBy } from 'es-toolkit/array';

maxBy([], x => x.value); // undefined
```

## minBy

### `minBy(items, getValue)`

当您想用转换函数将数组元素转换为数值,并找到具有最小值的原始元素时,请使用 `minBy`。对于空数组返回 `undefined`。

```typescript
import { minBy } from 'es-toolkit/array';

// 从对象数组中找到特定属性具有最小值的元素
const people = [
  { name: 'john', age: 30 },
  { name: 'jane', age: 28 },
  { name: 'joe', age: 26 },
];
minBy(people, person => person.age);
// Returns: { name: 'joe', age: 26 }

// 从数字数组中找到绝对值最小的元素
const numbers = [-10, -5, 0, 5, 15];
minBy(numbers, x => Math.abs(x));
// Returns: 0
```

对于空数组返回 `undefined`。

```typescript
import { minBy } from 'es-toolkit/array';

minBy([], x => x.value); // undefined
```

## orderBy

### `orderBy(arr, criteria, orders)`

当您想对对象数组进行多条件复合排序时,请使用 `orderBy`。可以为每个条件指定升序或降序,如果前面的条件值相同,则按下一个条件排序。

```typescript
import { orderBy } from 'es-toolkit/array';

// 根据多个标准对用户数组进行排序
const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

orderBy(users, [obj => obj.user, 'age'], ['asc', 'desc']);
// Returns:
// [
//   { user: 'barney', age: 36 },
//   { user: 'barney', age: 34 },
//   { user: 'fred', age: 48 },
//   { user: 'fred', age: 40 }
// ]

// 可以混合使用属性名和函数
const products = [
  { name: 'Apple', category: 'fruit', price: 1.5 },
  { name: 'Banana', category: 'fruit', price: 0.8 },
  { name: 'Broccoli', category: 'vegetable', price: 2.0 },
];

orderBy(products, ['category', product => product.name.length], ['asc', 'desc']);
// Returns: 先按 category 排序,在相同 category 内按名称长度降序排序
```

如果排序方向的数量少于条件数量,则重复使用最后一个方向。

```typescript
import { orderBy } from 'es-toolkit/array';

const data = [
  { a: 1, b: 1, c: 1 },
  { a: 1, b: 2, c: 2 },
  { a: 2, b: 1, c: 1 },
];

orderBy(data, ['a', 'b', 'c'], ['asc', 'desc']);
// 'a' 升序,'b' 和 'c' 降序排序
```

## partition

### `partition(arr, isInTruthy)`

当您想根据特定条件将数组元素分为两组时,请使用 `partition`。将条件函数返回 `true` 的元素和返回 `false` 的元素分别放入不同的数组。

```typescript
import { partition } from 'es-toolkit/array';

// 将数字数组分为偶数和奇数
const numbers = [1, 2, 3, 4, 5, 6];
const [evens, odds] = partition(numbers, x => x % 2 === 0);
// evens: [2, 4, 6]
// odds: [1, 3, 5]

// 根据特定条件分割对象数组
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Charlie', active: true },
];
const [activeUsers, inactiveUsers] = partition(users, user => user.active);
// activeUsers: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]
// inactiveUsers: [{ name: 'Bob', active: false }]
```

对于空数组返回两个空数组。

```typescript
import { partition } from 'es-toolkit/array';

const [truthy, falsy] = partition([], x => x > 0);
// truthy: []
// falsy: []
```

## pull

### `pull(arr, valuesToRemove)`

当您想从数组中移除所有特定值时,请使用 `pull`。此函数直接修改原数组,并返回修改后的数组。

```typescript
import { pull } from 'es-toolkit/array';

// 从数字数组中移除特定值
const numbers = [1, 2, 3, 4, 5, 2, 4];
pull(numbers, [2, 4]);
console.log(numbers); // [1, 3, 5]

// 从字符串数组中移除特定字符串
const fruits = ['apple', 'banana', 'cherry', 'banana', 'date'];
pull(fruits, ['banana', 'cherry']);
console.log(fruits); // ['apple', 'date']

// 从对象数组中移除引用相同的对象
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const obj3 = { id: 3 };
const objects = [obj1, obj2, obj3, obj1];
pull(objects, [obj1]);
console.log(objects); // [{ id: 2 }, { id: 3 }]
```

如果不想修改原数组而是创建新数组,请使用 `difference` 函数。

```typescript
import { pull } from 'es-toolkit/array';
import { difference } from 'es-toolkit/array';

const original = [1, 2, 3, 4, 5];

// pull 修改原数组
const arr1 = [...original];
pull(arr1, [2, 4]);
console.log(arr1); // [1, 3, 5]

// difference 返回新数组
const arr2 = difference(original, [2, 4]);
console.log(original); // [1, 2, 3, 4, 5] (未改变)
console.log(arr2); // [1, 3, 5]
```

## pullAt

### `pullAt(arr, indicesToRemove)`

当您想移除数组特定位置的元素时,请使用 `pullAt`。此函数修改原数组,并将被移除的元素作为新数组返回。也支持负数索引,从数组末尾开始计算。

```typescript
import { pullAt } from 'es-toolkit/array';

// 一次移除多个索引的元素
const numbers = [10, 20, 30, 40, 50];
const removed = pullAt(numbers, [1, 3, 4]);
console.log(removed); // [20, 40, 50]
console.log(numbers); // [10, 30]

// 即使有重复的索引也能安全处理
const fruits = ['apple', 'banana', 'cherry', 'date'];
const removedFruits = pullAt(fruits, [1, 2, 1]);
console.log(removedFruits); // ['banana', 'cherry', 'banana']
console.log(fruits); // ['apple', 'date']
```

如果指定了不存在的索引,该位置将返回 `undefined`。

```typescript
import { pullAt } from 'es-toolkit/array';

const items = [1, 2, 3];
const removed = pullAt(items, [0, 5, 2]);
console.log(removed); // [1, undefined, 3]
console.log(items); // [2]
```

## remove

### `remove(arr, shouldRemoveElement)`

当您想从数组中移除满足特定条件的元素并查看被移除的元素时,请使用 `remove`。此函数在修改原数组的同时,将被移除的元素作为单独的数组返回。如果想保持原数组不变,请使用 `filter` 方法。

```typescript
import { remove } from 'es-toolkit/array';

// 移除偶数
const numbers = [1, 2, 3, 4, 5];
const removedNumbers = remove(numbers, value => value % 2 === 0);
console.log(numbers); // [1, 3, 5] (原数组被修改)
console.log(removedNumbers); // [2, 4] (被移除的元素)

// 移除满足特定条件的对象
const users = [
  { name: 'john', age: 25 },
  { name: 'jane', age: 17 },
  { name: 'bob', age: 30 },
];
const minors = remove(users, user => user.age < 18);
console.log(users); // [{ name: 'john', age: 25 }, { name: 'bob', age: 30 }]
console.log(minors); // [{ name: 'jane', age: 17 }]
```

也可以使用索引和原数组信息。

```typescript
import { remove } from 'es-toolkit/array';

// 基于索引移除元素
const items = ['a', 'b', 'c', 'd', 'e'];
const removedAtEvenIndex = remove(items, (value, index) => index % 2 === 0);
console.log(items); // ['b', 'd']
console.log(removedAtEvenIndex); // ['a', 'c', 'e']
```

## sample

### `sample(arr)`

当您想从数组中随机获取一个元素时,请使用 `sample`。在游戏中选择随机道具、随机获取测试数据或进行抽签时非常有用。

```typescript
import { sample } from 'es-toolkit/array';

// 从数字数组中随机选择一个
const numbers = [1, 2, 3, 4, 5];
const randomNumber = sample(numbers);
// Returns: 1, 2, 3, 4, 5 中的一个

// 从字符串数组中随机选择一个
const fruits = ['apple', 'banana', 'cherry', 'date'];
const randomFruit = sample(fruits);
// Returns: 'apple', 'banana', 'cherry', 'date' 中的一个

// 从对象数组中随机选择一个
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
];
const randomUser = sample(users);
// Returns: 三个用户中随机选择一个
```

也可以用于各种类型的数组。

```typescript
import { sample } from 'es-toolkit/array';

// 布尔数组
const booleans = [true, false];
const randomBoolean = sample(booleans);
// Returns: true 或 false

// 混合类型数组
const mixed = [1, 'hello', { key: 'value' }, [1, 2, 3]];
const randomItem = sample(mixed);
// Returns: 数组中的任意元素
```

## sampleSize

### `sampleSize(array, size)`

当您想从数组中随机抽样多个元素时,请使用 `sampleSize`。使用 Floyd 算法高效生成无重复的随机样本。在问卷调查中抽取样本或游戏中随机选择多个道具时非常有用。

```typescript
import { sampleSize } from 'es-toolkit/array';

// 从数字数组中随机选择3个
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const randomNumbers = sampleSize(numbers, 3);
// Returns: [2, 7, 9] (示例,实际是随机的)

// 从字符串数组中随机选择2个
const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
const randomFruits = sampleSize(fruits, 2);
// Returns: ['cherry', 'apple'] (示例,实际是随机的)
```

可以按不同大小进行抽样。

```typescript
import { sampleSize } from 'es-toolkit/array';

const items = ['a', 'b', 'c', 'd', 'e'];

// 选择1个
const single = sampleSize(items, 1);
// Returns: ['c'] (示例)

// 选择与整个数组大小相同的数量(洗牌效果)
const all = sampleSize(items, 5);
// Returns: ['b', 'd', 'a', 'e', 'c'] (示例)

// 选择空数组
const none = sampleSize(items, 0);
// Returns: []
```



#### 错误

如果 `size` 大于数组的长度,会抛出错误。

## shuffle

### `shuffle(arr)`

当您想随机打乱数组中的元素顺序时,请使用 `shuffle`。使用 Fisher-Yates 算法保证完美的随机洗牌,使所有排列都以相同的概率出现。在纸牌游戏中洗牌、随机化测验题目顺序或播放列表随机播放时非常有用。

```typescript
import { shuffle } from 'es-toolkit/array';

// 打乱数字数组
const numbers = [1, 2, 3, 4, 5];
const shuffledNumbers = shuffle(numbers);
// Returns: [3, 1, 4, 5, 2] (示例,实际是随机的)
console.log(numbers); // [1, 2, 3, 4, 5] (原数组未改变)

// 打乱字符串数组
const fruits = ['apple', 'banana', 'cherry', 'date'];
const shuffledFruits = shuffle(fruits);
// Returns: ['cherry', 'apple', 'date', 'banana'] (示例,实际是随机的)
```

可以打乱各种类型的数组。

```typescript
import { shuffle } from 'es-toolkit/array';

// 打乱对象数组
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
];
const shuffledUsers = shuffle(users);
// Returns: 用户对象以随机顺序排列的新数组

// 打乱混合类型数组
const mixed = [1, 'hello', true, { key: 'value' }];
const shuffledMixed = shuffle(mixed);
// Returns: 元素以随机顺序排列的新数组
```

## sortBy

### `sortBy(arr, criteria)`

当您想根据多个属性或计算值对对象数组进行排序时,请使用 `sortBy`。提供属性名或转换函数的数组,会按照该顺序设置优先级并进行升序排序。在对表格数据排序或需要复杂排序逻辑时非常有用。

```typescript
import { sortBy } from 'es-toolkit/array';

// 按单个属性排序
const users = [
  { name: 'john', age: 30 },
  { name: 'jane', age: 25 },
  { name: 'bob', age: 35 },
];
const byAge = sortBy(users, ['age']);
// Returns: [{ name: 'jane', age: 25 }, { name: 'john', age: 30 }, { name: 'bob', age: 35 }]

// 按多个属性排序
const employees = [
  { name: 'john', department: 'engineering', age: 30 },
  { name: 'jane', department: 'hr', age: 25 },
  { name: 'bob', department: 'engineering', age: 35 },
  { name: 'alice', department: 'engineering', age: 25 },
];
const sorted = sortBy(employees, ['department', 'age']);
// Returns: 先按部门排序,然后按年龄排序
// [
//   { name: 'alice', department: 'engineering', age: 25 },
//   { name: 'john', department: 'engineering', age: 30 },
//   { name: 'bob', department: 'engineering', age: 35 },
//   { name: 'jane', department: 'hr', age: 25 }
// ]
```

可以使用函数创建复杂的排序标准。

```typescript
import { sortBy } from 'es-toolkit/array';

// 混合使用函数和属性
const products = [
  { name: 'laptop', price: 1000, category: 'electronics' },
  { name: 'shirt', price: 50, category: 'clothing' },
  { name: 'phone', price: 800, category: 'electronics' },
];

const sorted = sortBy(products, [
  'category',
  item => -item.price, // 价格按降序排序
]);
// Returns: 先按类别排序,然后按价格从高到低排序

// 按计算值排序
const words = ['hello', 'a', 'wonderful', 'world'];
const byLength = sortBy(
  words.map(word => ({ word, length: word.length })),
  ['length']
);
// Returns: 按字符串长度排序的对象数组
```

## tail

### `tail(arr)`

当您想要获取数组中除第一个元素外的所有元素时,请使用 `tail`。如果数组为空或只有一个元素,则返回空数组。这在处理栈或队列中除第一个元素外的其余元素时很有用。

```typescript
import { tail } from 'es-toolkit/array';

// 从数字数组中排除第一个元素。
const numbers = [1, 2, 3, 4, 5];
tail(numbers);
// Returns: [2, 3, 4, 5]

// 从字符串数组中排除第一个元素。
const strings = ['first', 'second', 'third'];
tail(strings);
// Returns: ['second', 'third']

// 只有一个元素的数组返回空数组。
const single = [42];
tail(single);
// Returns: []
```

它可以安全地处理空数组和特殊情况。

```typescript
import { tail } from 'es-toolkit/array';

// 空数组返回空数组。
const empty: number[] = [];
tail(empty);
// Returns: []

// 也可以处理嵌套数组。
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
tail(nested);
// Returns: [[3, 4], [5, 6]]

// 也可以处理对象数组。
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];
tail(users);
// Returns: [{ id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
```

## take

### `take(arr, count?)`

当您只需要数组前面的几个元素时,请使用 `take`。如果请求的数量大于数组长度,则返回整个数组。

```typescript
import { take } from 'es-toolkit/array';

// 获取前3个元素。
take([1, 2, 3, 4, 5], 3);
// Returns: [1, 2, 3]

// 获取前2个元素。
take(['a', 'b', 'c'], 2);
// Returns: ['a', 'b']
```

如果请求的数量多于数组的元素,则返回整个数组。

```typescript
import { take } from 'es-toolkit/array';

take([1, 2, 3], 5);
// Returns: [1, 2, 3]
```

如果省略 `count`,则只获取第一个元素。

```typescript
import { take } from 'es-toolkit/array';

take([1, 2, 3]);
// Returns: [1]
```

## takeRight

### `takeRight(arr, count?)`

当您只需要数组末尾的几个元素时,请使用 `takeRight`。如果请求的数量大于数组长度,则返回整个数组。

```typescript
import { takeRight } from 'es-toolkit/array';

// 获取最后2个元素。
takeRight([1, 2, 3, 4, 5], 2);
// Returns: [4, 5]

// 获取最后2个元素。
takeRight(['a', 'b', 'c'], 2);
// Returns: ['b', 'c']
```

如果请求的数量多于数组的元素,则返回整个数组。

```typescript
import { takeRight } from 'es-toolkit/array';

takeRight([1, 2, 3], 5);
// Returns: [1, 2, 3]
```

如果省略 `count`,则只获取最后一个元素。

```typescript
import { takeRight } from 'es-toolkit/array';

takeRight([1, 2, 3]);
// Returns: [3]
```

## takeRightWhile

### `takeRightWhile(arr, shouldContinueTaking)`

当您想从数组的末尾开始获取满足条件的元素时,请使用 `takeRightWhile`。遇到条件函数返回假的第一个元素时会停止。

```typescript
import { takeRightWhile } from 'es-toolkit/array';

// 从末尾开始获取小于4的数字
takeRightWhile([5, 4, 3, 2, 1], n => n < 4);
// 结果: [3, 2, 1]

// 从末尾开始获取大于3的数字
takeRightWhile([1, 2, 3], n => n > 3);
// 结果: []

// 获取字符串长度小于等于5的元素
takeRightWhile(['hello', 'world', 'foo', 'bar'], str => str.length <= 5);
// 结果: ['hello', 'world', 'foo', 'bar']
```

## takeWhile

### `takeWhile(arr, predicate)`

当您只需要从数组开头开始满足特定条件的元素时,请使用 `takeWhile`。遇到不满足条件的第一个元素时会停止获取。

```typescript
import { takeWhile } from 'es-toolkit/array';

// 只获取小于3的元素。
takeWhile([1, 2, 3, 4], x => x < 3);
// Returns: [1, 2]

// 从开头就没有大于3的元素,因此返回空数组。
takeWhile([1, 2, 3, 4], x => x > 3);
// Returns: []
```

也可以用于对象数组。

```typescript
import { takeWhile } from 'es-toolkit/array';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
  { name: 'David', age: 40 },
];

// 只获取30岁以下的用户。
takeWhile(users, user => user.age < 30);
// Returns: [{ name: 'Alice', age: 25 }]
```

## toFilled

### `toFilled(arr, value, start?, end?)`

当您想用指定的值填充数组的特定范围时,请使用 `toFilled`。它不会修改原数组,而是创建并返回一个新数组。

```typescript
import { toFilled } from 'es-toolkit/array';

const array = [1, 2, 3, 4, 5];

// 从索引2到末尾用'*'填充。
toFilled(array, '*', 2);
// Returns: [1, 2, '*', '*', '*']

// 从索引1到4之前用'*'填充。
toFilled(array, '*', 1, 4);
// Returns: [1, '*', '*', '*', 5]
```

如果省略起始和结束位置,则填充整个数组。

```typescript
import { toFilled } from 'es-toolkit/array';

const array = [1, 2, 3, 4, 5];

toFilled(array, '*');
// Returns: ['*', '*', '*', '*', '*']
```

也可以使用负索引。从数组末尾开始计算。

```typescript
import { toFilled } from 'es-toolkit/array';

const array = [1, 2, 3, 4, 5];

// 从倒数第4个到倒数第1个之前用'*'填充。
toFilled(array, '*', -4, -1);
// Returns: [1, '*', '*', '*', 5]
```

## union

### `union(arr1, arr2)`

当您想将多个数组的所有元素合并为一个且不重复时,请使用 `union`。它将两个数组合并后,返回一个去除重复值的新数组。

```typescript
import { union } from 'es-toolkit/array';

// 求数字数组的并集。
const array1 = [1, 2, 3];
const array2 = [3, 4, 5];
union(array1, array2);
// Returns: [1, 2, 3, 4, 5]

// 求字符串数组的并集。
const fruits1 = ['apple', 'banana'];
const fruits2 = ['banana', 'orange'];
union(fruits1, fruits2);
// Returns: ['apple', 'banana', 'orange']
```

第一个数组的元素先出现,然后添加第二个数组的唯一元素。

```typescript
import { union } from 'es-toolkit/array';

const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4, 5];
union(arr1, arr2);
// Returns: [1, 2, 3, 4, 5]
// 1, 2, 3来自arr1,4, 5来自arr2。
```

## unionBy

### `unionBy(arr1, arr2, mapper)`

当您想根据特定属性从对象数组中去除重复项时,请使用 `unionBy`。如果 `mapper` 函数返回的值相同,则将其视为相同元素。

```typescript
import { unionBy } from 'es-toolkit/array';

// 根据id求对象的并集。
const users1 = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const users2 = [
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];
unionBy(users1, users2, user => user.id);
// Returns: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]

// 根据数字除以3的余数求并集。
const nums1 = [1, 2, 3];
const nums2 = [4, 5, 6];
unionBy(nums1, nums2, x => x % 3);
// Returns: [1, 2, 3]
// 1 % 3 = 1, 2 % 3 = 2, 3 % 3 = 0,
// 4 % 3 = 1, 5 % 3 = 2, 6 % 3 = 0,所以都重复了。
```

使用自定义比较函数也可以根据复杂标准求并集。

```typescript
import { unionBy } from 'es-toolkit/array';

const products1 = [
  { category: 'electronics', price: 100 },
  { category: 'books', price: 20 },
];
const products2 = [
  { category: 'electronics', price: 150 },
  { category: 'toys', price: 30 },
];

// 根据类别求并集。
unionBy(products1, products2, product => product.category);
// Returns: [
//   { category: 'electronics', price: 100 },
//   { category: 'books', price: 20 },
//   { category: 'toys', price: 30 }
// ]
```

## unionWith

### `unionWith(arr1, arr2, areItemsEqual)`

当您想根据复杂条件判断元素是否相等时,请使用 `unionWith`。如果提供的函数返回真,则将两个元素判断为相同并去除重复。

```typescript
import { unionWith } from 'es-toolkit/array';

// 根据对象的id求并集。
const array1 = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const array2 = [
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];
const areItemsEqual = (a, b) => a.id === b.id;
unionWith(array1, array2, areItemsEqual);
// Returns: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
```

也可以使用更复杂的比较逻辑。

```typescript
import { unionWith } from 'es-toolkit/array';

// 根据坐标求并集。
const points1 = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
];
const points2 = [
  { x: 3, y: 4 },
  { x: 5, y: 6 },
];
const arePointsEqual = (p1, p2) => p1.x === p2.x && p1.y === p2.y;
unionWith(points1, points2, arePointsEqual);
// Returns: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }]
```

忽略大小写的字符串比较示例。

```typescript
import { unionWith } from 'es-toolkit/array';

const words1 = ['Apple', 'banana'];
const words2 = ['BANANA', 'orange'];
const areWordsEqual = (a, b) => a.toLowerCase() === b.toLowerCase();
unionWith(words1, words2, areWordsEqual);
// Returns: ['Apple', 'banana', 'orange']
// 'banana'和'BANANA'被判断为相同,因此只保留第一个。
```

## uniq

### `uniq(arr)`

当您想去除数组中的重复值,只保留唯一值时,请使用 `uniq`。它会保持原数组中首次出现的顺序。

```typescript
import { uniq } from 'es-toolkit/array';

// 从数字数组中去除重复项。
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = uniq(numbers);
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]

// 从字符串数组中去除重复项。
const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
const uniqueWords = uniq(words);
console.log(uniqueWords); // ['apple', 'banana', 'cherry']

// 从对象数组中去除引用相同的对象。
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const obj3 = { id: 3 };
const objects = [obj1, obj2, obj1, obj3, obj2];
const uniqueObjects = uniq(objects);
console.log(uniqueObjects); // [{ id: 1 }, { id: 2 }, { id: 3 }]
```

对于空数组返回空数组。

```typescript
import { uniq } from 'es-toolkit/array';

const emptyArray = uniq([]);
console.log(emptyArray); // []
```

## uniqBy

### `uniqBy(arr, mapper)`

当您想根据特定标准转换数组元素来判断重复时,请使用 `uniqBy`。对于转换函数返回相同值的元素,只保留首次出现的元素。

```typescript
import { uniqBy } from 'es-toolkit/array';

// 将小数向下取整转换后去除重复项。
const numbers = [1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19];
const result = uniqBy(numbers, Math.floor);
console.log(result); // [1.2, 2.1, 3.2, 5.7, 7.19]

// 根据对象数组的特定属性去除重复项。
const users = [
  { id: 1, name: 'john', age: 30 },
  { id: 2, name: 'jane', age: 30 },
  { id: 3, name: 'joe', age: 25 },
  { id: 4, name: 'jenny', age: 25 },
];
const uniqueByAge = uniqBy(users, user => user.age);
console.log(uniqueByAge);
// [{ id: 1, name: 'john', age: 30 }, { id: 3, name: 'joe', age: 25 }]

// 根据字符串长度去除重复项。
const words = ['apple', 'pie', 'banana', 'cat', 'dog'];
const uniqueByLength = uniqBy(words, word => word.length);
console.log(uniqueByLength); // ['apple', 'pie', 'banana']
```

对于复杂对象也可以根据特定字段的组合进行去重。

```typescript
import { uniqBy } from 'es-toolkit/array';

const products = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' },
  { category: 'fruit', name: 'grape' },
];

// 根据类别去除重复项。
const uniqueByCategory = uniqBy(products, item => item.category);
console.log(uniqueByCategory.length); // 2
console.log(uniqueByCategory);
// [{ category: 'fruit', name: 'apple' }, { category: 'vegetable', name: 'carrot' }]
```

## uniqWith

### `uniqWith(arr, areItemsEqual)`

当您想根据自定义比较函数判断两个元素是否相等来去除重复时,请使用 `uniqWith`。对于比较函数返回 `true` 的元素,只保留首次出现的元素。

```typescript
import { uniqWith } from 'es-toolkit/array';

// 将差值小于1的数字视为相同来去除重复项。
const numbers = [1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19];
const result = uniqWith(numbers, (a, b) => Math.abs(a - b) < 1);
console.log(result); // [1.2, 3.2, 5.7, 7.19]

// 根据特定字段比较对象来去除重复项。
const users = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 25 },
];
const uniqueByAge = uniqWith(users, (a, b) => a.age === b.age);
console.log(uniqueByAge);
// [{ id: 1, name: 'John', age: 30 }, { id: 3, name: 'Bob', age: 25 }]

// 不区分大小写比较字符串来去除重复项。
const words = ['Apple', 'APPLE', 'banana', 'Banana', 'cherry'];
const uniqueCaseInsensitive = uniqWith(words, (a, b) => a.toLowerCase() === b.toLowerCase());
console.log(uniqueCaseInsensitive); // ['Apple', 'banana', 'cherry']
```

也可以进行复杂的对象比较。

```typescript
import { uniqWith } from 'es-toolkit/array';

const products = [
  { name: 'iPhone', brand: 'Apple', price: 1000 },
  { name: 'Galaxy', brand: 'Samsung', price: 900 },
  { name: 'iPhone', brand: 'Apple', price: 1100 }, // 相同的name和brand
  { name: 'Pixel', brand: 'Google', price: 800 },
];

// 当名称和品牌都相同时判断为重复。
const uniqueProducts = uniqWith(products, (a, b) => a.name === b.name && a.brand === b.brand);
console.log(uniqueProducts);
// [
//   { name: 'iPhone', brand: 'Apple', price: 1000 },
//   { name: 'Galaxy', brand: 'Samsung', price: 900 },
//   { name: 'Pixel', brand: 'Google', price: 800 }
// ]
```

## unzip

### `unzip(zipped)`

当您想从绑定在一起的二维数组中收集相同索引的元素创建新数组时,请使用 `unzip`。这是 zip 的相反操作。

```typescript
import { unzip } from 'es-toolkit/array';

// 解开绑定了字符串、布尔值、数字的数组。
const zipped = [
  ['a', true, 1],
  ['b', false, 2],
  ['c', true, 3],
];
const result = unzip(zipped);
console.log(result);
// [['a', 'b', 'c'], [true, false, true], [1, 2, 3]]

// 解开绑定了用户信息的数组。
const users = [
  ['john', 30, 'engineer'],
  ['jane', 25, 'designer'],
  ['bob', 35, 'manager'],
];
const [names, ages, roles] = unzip(users);
console.log(names); // ['john', 'jane', 'bob']
console.log(ages); // [30, 25, 35]
console.log(roles); // ['engineer', 'designer', 'manager']
```

也可以处理长度不同的数组。较短数组的空位会用 `undefined` 填充。

```typescript
import { unzip } from 'es-toolkit/array';

const mixed = [[1, 'a'], [2, 'b', true], [3]];
const result = unzip(mixed);
console.log(result);
// [[1, 2, 3], ['a', 'b', undefined], [undefined, true, undefined]]
```

传入空数组返回空数组。

```typescript
import { unzip } from 'es-toolkit/array';

const empty = unzip([]);
console.log(empty); // []
```

## unzipWith

### `unzipWith(target, iteratee)`

当您想从绑定在一起的二维数组中收集相同位置的元素并应用转换函数获得结果时,请使用 `unzipWith`。它与 `unzip` 类似,但可以用自定义函数转换每组元素。

```typescript
import { unzipWith } from 'es-toolkit/array';

// 将相同位置的数字相加。
const numbers = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const sums = unzipWith(numbers, (a, b, c) => a + b + c);
console.log(sums); // [9, 12] (1+3+5=9, 2+4+6=12)

// 将相同位置的字符串连接起来。
const words = [
  ['hello', 'world'],
  ['foo', 'bar'],
  ['es', 'toolkit'],
];
const combined = unzipWith(words, (a, b, c) => a + b + c);
console.log(combined); // ['hellofooes', 'worldbartoolkit']

// 计算对象数组中特定属性的平均值。
const scores = [
  [{ score: 80 }, { score: 90 }],
  [{ score: 85 }, { score: 95 }],
  [{ score: 75 }, { score: 88 }],
];
const averages = unzipWith(scores, (a, b, c) => (a.score + b.score + c.score) / 3);
console.log(averages); // [80, 91] (80+85+75)/3, (90+95+88)/3
```

如果数组长度不同,会传递 undefined。

```typescript
import { unzipWith } from 'es-toolkit/array';

const mixed = [
  [1, 4],
  [2, 5],
  [3], // 长度不同
];
const result = unzipWith(mixed, (a, b, c) => {
  // c可能为undefined
  return (a || 0) + (b || 0) + (c || 0);
});
console.log(result); // [6, 9] (1+2+3, 4+5+0)
```

传入空数组将会抛出异常。

```typescript
import { unzipWith } from 'es-toolkit/array';

const empty = unzipWith([], (a, b) => a + b);
console.log(empty); // 抛出异常
```

## windowed

### `windowed(arr, size, step?, options?)`

当您想让指定大小的窗口沿着数组均匀滑动并返回包含每个窗口快照的数组时,请使用 `windowed`。

在时间序列数据分析中计算移动平均值、从字符串中提取 n-gram、或在数组中查找特定模式时很有用。也可以用于按批次处理数据或实现滑动窗口算法。

```typescript
import { windowed } from 'es-toolkit/array';

// 基本用法 - 创建大小为3的窗口。
const numbers = [1, 2, 3, 4, 5];
const result = windowed(numbers, 3);
console.log(result); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]

// 指定step来调整窗口间隔。
const data = [1, 2, 3, 4, 5, 6, 7, 8];
const stepped = windowed(data, 3, 2);
console.log(stepped); // [[1, 2, 3], [3, 4, 5], [5, 6, 7]]

// 也可以用于字符串数组。
const words = ['a', 'b', 'c', 'd', 'e'];
const wordWindows = windowed(words, 2);
console.log(wordWindows); // [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']]
```

如果想包含部分窗口,请使用 `partialWindows` 选项。

```typescript
import { windowed } from 'es-toolkit/array';

const numbers = [1, 2, 3, 4, 5, 6];

// 不包含部分窗口(默认)
const complete = windowed(numbers, 4, 3);
console.log(complete); // [[1, 2, 3, 4]]

// 包含部分窗口
const withPartial = windowed(numbers, 4, 3, { partialWindows: true });
console.log(withPartial); // [[1, 2, 3, 4], [4, 5, 6]]
```

每个快照以数组形式提供,最后几个数组可能包含的元素少于指定大小。

```typescript
import { windowed } from 'es-toolkit/array';

const small = [1, 2];

// 当窗口大于数组时
console.log(windowed(small, 5)); // []
console.log(windowed(small, 5, 1, { partialWindows: true })); // [[1, 2], [2]]
```



#### 错误

- 当 `size` 或 `step` 不是正整数时会抛出错误。

## without

### `without(arr, ...values)`

当您想从数组中删除不需要的特定值时,请使用 `without`。原数组不会被修改,返回已删除指定值的新数组。

```typescript
import { without } from 'es-toolkit/array';

// 从数字数组中删除特定值。
without([1, 2, 3, 4, 5], 2, 4);
// Returns: [1, 3, 5]

// 从字符串数组中删除特定值。
without(['a', 'b', 'c', 'a'], 'a');
// Returns: ['b', 'c']
```

也能正确处理 `NaN` 值。

```typescript
import { without } from 'es-toolkit/array';

without([1, NaN, 3, NaN, 5], NaN);
// Returns: [1, 3, 5]
```

## xor

### `xor(arr1, arr2)`

当您想求两个数组的对称差集时,请使用 `xor`。返回一个由只存在于两个数组之一且不在交集中的元素组成的新数组。

```typescript
import { xor } from 'es-toolkit/array';

// 求数字数组的对称差集。
xor([1, 2, 3, 4], [3, 4, 5, 6]);
// Returns: [1, 2, 5, 6]

// 求字符串数组的对称差集。
xor(['a', 'b'], ['b', 'c']);
// Returns: ['a', 'c']
```

重复元素会自动删除。

```typescript
import { xor } from 'es-toolkit/array';

xor([1, 2, 2, 3], [3, 4, 4, 5]);
// Returns: [1, 2, 4, 5]
```

## xorBy

### `xorBy(arr1, arr2, mapper)`

当您想根据特定标准比较两个数组的元素并求对称差集时,请使用 `xorBy`。用映射函数转换每个元素后,创建一个只存在于两个数组之一的元素的新数组。

```typescript
import { xorBy } from 'es-toolkit/array';

// 根据对象的id求对称差集。
xorBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], obj => obj.id);
// Returns: [{ id: 1 }, { id: 3 }]

// 根据字符串长度求对称差集。
xorBy(['apple', 'banana'], ['grape', 'cherry', 'apple'], str => str.length);
// Returns: [] (所有长度都重复)
```

映射函数结果相同的元素被视为一个。

```typescript
import { xorBy } from 'es-toolkit/array';

// 映射函数结果相同的元素被视为一个。
xorBy([1, 2, 3, 4], [3, 4, 5, 6], n => n % 3);
// Returns: [] (所有余数都重复)
```

## xorWith

### `xorWith(arr1, arr2, areElementsEqual)`

当您想用复杂对象或特殊比较条件求对称差集时,请使用 `xorWith`。用用户定义的相等函数比较元素,创建一个只存在于两个数组之一的元素的新数组。

```typescript
import { xorWith } from 'es-toolkit/array';

// 根据对象的id进行比较。
xorWith(
  [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
  [
    { id: 2, name: 'Bobby' },
    { id: 3, name: 'Charlie' },
  ],
  (a, b) => a.id === b.id
);
// Returns: [{ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }]

// 忽略大小写进行比较。
xorWith(['Apple', 'Banana'], ['APPLE', 'Cherry'], (a, b) => a.toLowerCase() === b.toLowerCase());
// Returns: ['Banana', 'Cherry']
```

也可以进行更复杂的比较。

```typescript
import { xorWith } from 'es-toolkit/array';

// 根据绝对值进行比较。
xorWith([-1, -2, 3], [1, 2, -4], (a, b) => Math.abs(a) === Math.abs(b));
// Returns: [3, -4]

// 进行深层对象比较。
xorWith(
  [{ specs: { ram: 8, storage: 256 } }],
  [{ specs: { ram: 8, storage: 256 } }],
  (a, b) => a.specs.ram === b.specs.ram && a.specs.storage === b.specs.storage
);
// Returns: []
```

## zip

### `zip(...arrs)`

当您想将多个数组中相同位置的元素绑定在一起时,请使用 `zip`。返回一个将每个数组相同索引的元素组成元组的新数组。

```typescript
import { zip } from 'es-toolkit/array';

// 绑定两个数组。
zip([1, 2, 3], ['a', 'b', 'c']);
// Returns: [[1, 'a'], [2, 'b'], [3, 'c']]

// 绑定三个数组。
zip([1, 2], ['a', 'b', 'c'], [true, false]);
// Returns: [[1, 'a', true], [2, 'b', false], [undefined, 'c', undefined]]
```

如果数组长度不同,会按最长数组的长度对齐。较短数组的空位会用 `undefined` 填充。

```typescript
import { zip } from 'es-toolkit/array';

zip([1, 2], ['a', 'b', 'c', 'd']);
// Returns: [[1, 'a'], [2, 'b'], [undefined, 'c'], [undefined, 'd']]
```

## zipObject

### `zipObject(keys, values)`

当您想将两个数组合并为一个对象时,请使用 `zipObject`。返回一个新对象,第一个数组的元素作为键,第二个数组的元素作为值。

```typescript
import { zipObject } from 'es-toolkit/array';

// 将键和值创建为对象。
zipObject(['a', 'b', 'c'], [1, 2, 3]);
// Returns: { a: 1, b: 2, c: 3 }

// 如果键更多,值会是undefined。
zipObject(['a', 'b', 'c', 'd'], [1, 2, 3]);
// Returns: { a: 1, b: 2, c: 3, d: undefined }
```

如果值数组更长,超出的值会被忽略。

```typescript
import { zipObject } from 'es-toolkit/array';

zipObject(['a', 'b'], [1, 2, 3, 4]);
// Returns: { a: 1, b: 2 }
```

## zipWith

### `zipWith(...arrs, combine)`

当您想以期望的方式结合多个数组的相同位置元素时,请使用 `zipWith`。将每个数组相同索引的元素传递给结合函数,用其结果创建新数组。

```typescript
import { zipWith } from 'es-toolkit/array';

// 将两个数字数组相加。
zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b);
// Returns: [5, 7, 9]

// 连接字符串。
zipWith(['a', 'b'], ['c', 'd'], ['e', 'f'], (a, b, c) => `${a}${b}${c}`);
// Returns: ['ace', 'bdf']
```

如果数组长度不同,会按最长数组的长度对齐。较短数组的空位会传递 `undefined`。

```typescript
import { zipWith } from 'es-toolkit/array';

zipWith([1, 2], [10, 20, 30], (a, b) => (a ?? 0) + (b ?? 0));
// Returns: [11, 22, 30]
```
