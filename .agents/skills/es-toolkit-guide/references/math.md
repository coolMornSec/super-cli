# 用法汇总 - math

## clamp

### `clamp(value, maximum)`

当您想将数字限制为不超过给定最大值时,请使用 `clamp`。如果值超过最大值,则被限制为最大值;否则,返回原始值。

```typescript
import { clamp } from 'es-toolkit/math';

// 限制为最大值
const result1 = clamp(10, 5); // result1 是 5 (10 被限制为最大值 5)
const result2 = clamp(3, 5); // result2 是 3 (小于 5,保持不变)
```



### `clamp(value, minimum, maximum)`

当您想将数字限制在给定的最小值和最大值范围内时,请使用 `clamp`。如果值超出范围,则被限制为最近的边界值。

```typescript
import { clamp } from 'es-toolkit/math';

// 在最小值和最大值范围内限制
const result1 = clamp(10, 5, 15); // result1 是 10 (在 5-15 范围内)
const result2 = clamp(2, 5, 15); // result2 是 5 (被限制为最小值 5)
const result3 = clamp(20, 5, 15); // result3 是 15 (被限制为最大值 15)
```

## inRange

### `inRange(value, maximum)`

当您想检查值是否在从 0 到小于最大值的范围内时,请使用 `inRange`。最小值自动设置为 0。

```typescript
import { inRange } from 'es-toolkit/math';

// 检查从 0 到小于 5 的范围
const result1 = inRange(3, 5); // result1 为 true (0 <= 3 < 5)
const result2 = inRange(5, 5); // result2 为 false (5 不小于 5)
const result3 = inRange(-1, 5); // result3 为 false (-1 < 0)
```



### `inRange(value, minimum, maximum)`

当您想检查值是否在指定的最小值和最大值范围内时,请使用 `inRange`。

```typescript
import { inRange } from 'es-toolkit/math';

// 检查最小值和最大值范围内
const result1 = inRange(3, 2, 5); // result1 为 true (2 <= 3 < 5)
const result2 = inRange(1, 2, 5); // result2 为 false (1 < 2)
const result3 = inRange(5, 2, 5); // result3 为 false (5 不小于 5)

// 可以用于负数范围
const result4 = inRange(-3, -5, -1); // result4 为 true (-5 <= -3 < -1)
```



#### 错误

如果最小值大于或等于最大值,则抛出错误。

## mean

### `mean(nums)`

当您想求数字数组的平均值时,请使用 `mean`。它通过将所有数字相加后除以数组的长度来计算平均值。如果给定空数组,则返回 `NaN`。

```typescript
import { mean } from 'es-toolkit/math';

// 计算数字数组的平均值
const numbers = [1, 2, 3, 4, 5];
const result = mean(numbers);
// result 为 3 ((1 + 2 + 3 + 4 + 5) / 5 = 15 / 5 = 3)

// 计算带小数的数字的平均值
const decimals = [1.5, 2.5, 3.5];
const decimalResult = mean(decimals);
// decimalResult 为 2.5

// 空数组返回 NaN
const emptyResult = mean([]);
// emptyResult 为 NaN
```

## meanBy

### `meanBy(items, getValue)`

当您想求对数组的每个元素应用函数后的结果的平均值时,请使用 `meanBy`。它对于计算对象数组中特定属性的平均值或在转换每个元素后求平均值很有用。如果给定空数组,则返回 `NaN`。

```typescript
import { meanBy } from 'es-toolkit/math';

// 计算对象数组中特定属性的平均值
const people = [{ age: 23 }, { age: 25 }, { age: 27 }];
const averageAge = meanBy(people, person => person.age);
// averageAge 为 25 ((23 + 25 + 27) / 3 = 75 / 3 = 25)

// 计算字符串长度的平均值
const words = ['apple', 'banana', 'cherry'];
const averageLength = meanBy(words, word => word.length);
// averageLength 约为 5.67 ((5 + 6 + 6) / 3 ≈ 5.67)

// 空数组返回 NaN
const emptyResult = meanBy([], x => x);
// emptyResult 为 NaN
```

## median

### `median(nums)`

当您想求数字数组的中位数时,请使用 `median`。将数组按升序排序后,找到位于中间的值。对于具有奇数个元素的数组,返回正中间的值,对于具有偶数个元素的数组,返回中间两个值的平均值。如果给定空数组,则返回 `NaN`。

```typescript
import { median } from 'es-toolkit/math';

// 计算具有奇数个元素的数组的中位数
const oddNumbers = [1, 2, 3, 4, 5];
const oddResult = median(oddNumbers);
// oddResult 为 3 (排序数组 [1, 2, 3, 4, 5] 中的中间值)

// 计算具有偶数个元素的数组的中位数
const evenNumbers = [1, 2, 3, 4];
const evenResult = median(evenNumbers);
// evenResult 为 2.5 ((2 + 3) / 2 = 2.5)

// 未排序的数组会自动排序
const unordered = [3, 1, 4, 1, 5];
const unorderedResult = median(unordered);
// unorderedResult 为 3 (排序后 [1, 1, 3, 4, 5] 中的中间值)

// 空数组返回 NaN
const emptyResult = median([]);
// emptyResult 为 NaN
```

## medianBy

### `medianBy(items, getValue)`

当您想求对数组的每个元素应用函数后的结果的中位数时,请使用 `medianBy`。它对于计算对象数组中特定属性的中位数或在转换每个元素后求中位数很有用。对于具有奇数个元素的数组,返回正中间的值,对于具有偶数个元素的数组,返回中间两个值的平均值。如果给定空数组,则返回 `NaN`。

```typescript
import { medianBy } from 'es-toolkit/math';

// 计算对象数组中特定属性的中位数(奇数个)
const people = [{ age: 23 }, { age: 25 }, { age: 27 }, { age: 29 }, { age: 31 }];
const medianAge = medianBy(people, person => person.age);
// medianAge 为 27 (排序后的ages [23, 25, 27, 29, 31] 中的中间值)

// 计算对象数组中特定属性的中位数(偶数个)
const scores = [{ score: 80 }, { score: 90 }, { score: 85 }, { score: 95 }];
const medianScore = medianBy(scores, item => item.score);
// medianScore 为 87.5 (排序后的scores [80, 85, 90, 95] 中 (85 + 90) / 2)

// 计算字符串长度的中位数
const words = ['cat', 'elephant', 'dog', 'butterfly', 'ant'];
const medianLength = medianBy(words, word => word.length);
// medianLength 为 3 (长度 [3, 8, 3, 9, 3] 排序后为 [3, 3, 3, 8, 9] 中的中间值)

// 空数组返回 NaN
const emptyResult = medianBy([], x => x);
// emptyResult 为 NaN
```

## random

### `random(maximum)` / `random(minimum, maximum)`

当您需要随机数时,请使用 `random`。它生成带有小数点的数字。

```typescript
import { random } from 'es-toolkit/math';

// 生成0以上5以下的随机小数。
const num1 = random(5);
console.log(num1); // 例如: 2.718281828

// 生成2以上10以下的随机小数。
const num2 = random(2, 10);
console.log(num2); // 例如: 7.158765432

// 也可以用于负数范围。
const num3 = random(-5, -1);
console.log(num3); // 例如: -3.842134567

// 小数范围也可以。
const num4 = random(1.5, 2.5);
console.log(num4); // 例如: 1.923456789
```

如果范围无效,则抛出错误。

```typescript
import { random } from 'es-toolkit/math';

// 如果最大值为0或更小,则发生错误。
try {
  random(0);
} catch (error) {
  console.error(error.message); // 'Invalid input: The maximum value must be greater than the minimum value.'
}

// 如果最小值大于或等于最大值,则发生错误。
try {
  random(5, 3);
} catch (error) {
  console.error(error.message); // 'Invalid input: The maximum value must be greater than the minimum value.'
}
```



#### 错误

如果最大值小于或等于最小值,则抛出错误。

## randomInt

### `randomInt(maximum)` / `randomInt(minimum, maximum)`

当您需要随机整数时,请使用 `randomInt`。它只返回没有小数点的整数。

```typescript
import { randomInt } from 'es-toolkit/math';

// 生成0以上5以下的随机整数。
const num1 = randomInt(5);
console.log(num1); // 例如: 3

// 生成2以上10以下的随机整数。
const num2 = randomInt(2, 10);
console.log(num2); // 例如: 7

// 也可以用于负数范围。
const num3 = randomInt(-5, -1);
console.log(num3); // 例如: -3

// 模拟骰子掷骰(1-6)
const diceRoll = randomInt(1, 7);
console.log(diceRoll); // 例如: 4

// 从数组中选择随机索引
const items = ['apple', 'banana', 'cherry', 'date'];
const randomIndex = randomInt(items.length);
console.log(items[randomIndex]); // 例如: 'banana'
```



#### 错误

如果最大值小于或等于最小值,则抛出错误。

## range

### `range(end)`

当您需要从 0 到指定结束值的连续数字数组时使用 `range`。它在循环中很有用。

```typescript
import { range } from 'es-toolkit/math';

// 创建从 0 到 3 的数组。
const numbers1 = range(4);
console.log(numbers1); // [0, 1, 2, 3]

// 具有 10 个元素的数组的索引
const indices = range(10);
console.log(indices); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// 可以代替 forEach 使用。
range(5).forEach(i => {
  console.log(`迭代 ${i}`); // 迭代 0, 迭代 1, 迭代 2, 迭代 3, 迭代 4
});
```



### `range(start, end, step?)`

当您需要具有指定起始值、结束值和步长的连续数字数组时使用 `range`。它在循环中很有用。

```typescript
import { range } from 'es-toolkit/math';

// 创建从 1 到 4 的数组。
const numbers2 = range(1, 5);
console.log(numbers2); // [1, 2, 3, 4]

// 创建从 0 到 20 以 5 递增的数组。
const numbers3 = range(0, 20, 5);
console.log(numbers3); // [0, 5, 10, 15]

// 也可以向负方向移动。
const numbers4 = range(0, -5, -1);
console.log(numbers4); // [0, -1, -2, -3, -4]

// 也可以从大数到小数。
const numbers5 = range(5, 0, -1);
console.log(numbers5); // [5, 4, 3, 2, 1]

// 创建特定范围的页码
const pageNumbers = range(1, 11);
console.log(pageNumbers); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```



#### 抛出异常

- 如果 `step` 为 0 或不是整数,则抛出错误。

## rangeRight

### `rangeRight(end)`

当您需要从结束值到 0 的反向连续数字数组时使用 `rangeRight`。它与 `range` 类似,但结果是从后面开始的。

```typescript
import { rangeRight } from 'es-toolkit/math';

// 创建从 3 到 0 的反向数组。
const numbers1 = rangeRight(4);
console.log(numbers1); // [3, 2, 1, 0]

// 数组的反向索引
const items = ['a', 'b', 'c', 'd', 'e'];
const reverseIndices = rangeRight(items.length);
reverseIndices.forEach(i => {
  console.log(items[i]); // 按 'e', 'd', 'c', 'b', 'a' 顺序输出
});
```



### `rangeRight(start, end, step?)`

当您需要具有指定起始值、结束值和步长的反向连续数字数组时使用 `rangeRight`。它与 `range` 类似,但结果是从后面开始的。

```typescript
import { rangeRight } from 'es-toolkit/math';

// 创建从 4 到 1 的反向数组。
const numbers2 = rangeRight(1, 5);
console.log(numbers2); // [4, 3, 2, 1]

// 创建从 15 到 0 以 5 递减的数组。
const numbers3 = rangeRight(0, 20, 5);
console.log(numbers3); // [15, 10, 5, 0]

// 也可以向负方向移动。
const numbers4 = rangeRight(-5, 0, 1);
console.log(numbers4); // [-1, -2, -3, -4, -5]

// 也可以从小数到大数。
const numbers5 = rangeRight(5, 0, -1);
console.log(numbers5); // [1, 2, 3, 4, 5]
```

在需要倒计时或分页中的反向顺序时很有用。

```typescript
import { rangeRight } from 'es-toolkit/math';

// 创建倒计时
const countdown = rangeRight(0, 11);
console.log(countdown); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

// 分页中从最后一页到第一页
const pageNumbers = rangeRight(1, 11);
console.log(pageNumbers); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```



#### 抛出异常

- 如果 `step` 为 0 或不是整数,则抛出错误。

## round

### `round(value, precision?)`

当您想将数字四舍五入到特定小数位数时使用 `round`。它是用于精确计算的数学函数。

```typescript
import { round } from 'es-toolkit/math';

// 默认 - 四舍五入到整数。
const num1 = round(1.2345);
console.log(num1); // 1

// 四舍五入到小数点后 2 位。
const num2 = round(1.2345, 2);
console.log(num2); // 1.23

// 四舍五入到小数点后 3 位。
const num3 = round(1.2387, 3);
console.log(num3); // 1.239

// 也可以四舍五入负数。
const num4 = round(-1.2345, 2);
console.log(num4); // -1.23

// 也可以处理大数。
const num5 = round(123.456789, 4);
console.log(num5); // 123.4568
```

在价格计算和统计中很有用。

```typescript
import { round } from 'es-toolkit/math';

// 价格计算(到小数点后 2 位)
const price = 19.999;
const finalPrice = round(price, 2);
console.log(finalPrice); // 20.00

// 百分比计算(到小数点后 1 位)
const percentage = 66.66666;
const displayPercentage = round(percentage, 1);
console.log(displayPercentage); // 66.7

// 评分计算(到小数点后 1 位)
const rating = 4.267;
const displayRating = round(rating, 1);
console.log(displayRating); // 4.3
```

在需要精确的计算中进行四舍五入。

```typescript
import { round } from 'es-toolkit/math';

// 整理数学计算结果
const result = Math.PI * 2;
const cleanResult = round(result, 5);
console.log(cleanResult); // 6.28318

// 四舍五入测量值
const measurement = 15.789123;
const rounded = round(measurement, 3);
console.log(rounded); // 15.789
```

无效的 precision 值会抛出错误。

```typescript
import { round } from 'es-toolkit/math';

// 如果 precision 不是整数,则会发生错误。
try {
  round(1.23, 2.5);
} catch (error) {
  console.error(error.message); // 'Precision must be an integer.'
}
```



#### 抛出异常

- 如果 `precision` 不是整数,则抛出错误。

## sum

### `sum(nums)`

当您想要计算数字总和时使用 `sum`。它将数组中的所有数字相加以计算总和。

```typescript
import { sum } from 'es-toolkit/math';

// 基本数字求和
const numbers = [1, 2, 3, 4, 5];
const total = sum(numbers);
console.log(total); // 15

// 小数求和
const prices = [19.99, 25.5, 3.75];
const totalPrice = sum(prices);
console.log(totalPrice); // 49.24

// 负数和正数混合求和
const values = [-10, 5, -3, 8];
const result = sum(values);
console.log(result); // 0

// 单个数字数组
const single = [42];
const singleSum = sum(single);
console.log(singleSum); // 42
```

空数组和实际使用示例。

```typescript
import { sum } from 'es-toolkit/math';

// 空数组返回 0。
const empty = sum([]);
console.log(empty); // 0

// 计算分数总和
const scores = [85, 92, 78, 96, 88];
const totalScore = sum(scores);
const averageScore = totalScore / scores.length;
console.log(totalScore); // 439
console.log(averageScore); // 87.8

// 计算月销售额总和
const monthlySales = [12000, 15000, 18000, 14000, 16000];
const totalSales = sum(monthlySales);
console.log(totalSales); // 75000

// 计算购物车总金额
const cartItems = [29.99, 15.5, 8.75, 42.0];
const cartTotal = sum(cartItems);
console.log(cartTotal); // 96.24
```

计算结果可以与其他函数一起使用。

```typescript
import { sum } from 'es-toolkit/math';
import { round } from 'es-toolkit/math';

// 求和后四舍五入
const measurements = [1.234, 2.567, 3.891];
const total = sum(measurements);
const rounded = round(total, 2);
console.log(rounded); // 7.69

// 计算百分比
const votes = [45, 32, 23];
const totalVotes = sum(votes);
const percentages = votes.map(vote => round((vote / totalVotes) * 100, 1));
console.log(percentages); // [45.0, 32.0, 23.0]
```

## sumBy

### `sumBy(items, getValue)`

当您想将数组的每个元素转换为数字并计算总和时使用 `sumBy`。它在从对象数组中求特定属性的总和时很有用。

```typescript
import { sumBy } from 'es-toolkit/math';

// 从对象数组中求特定属性的总和
const products = [
  { name: 'laptop', price: 1000 },
  { name: 'mouse', price: 25 },
  { name: 'keyboard', price: 75 },
];
const totalPrice = sumBy(products, item => item.price);
console.log(totalPrice); // 1100

// 用户年龄总和
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
];
const totalAge = sumBy(users, user => user.age);
console.log(totalAge); // 90

// 字符串长度总和
const words = ['hello', 'world', 'test'];
const totalLength = sumBy(words, word => word.length);
console.log(totalLength); // 14
```

也可以进行复杂的计算。

```typescript
import { sumBy } from 'es-toolkit/math';

// 加权分数总和
const scores = [
  { subject: 'math', score: 90, weight: 0.3 },
  { subject: 'english', score: 85, weight: 0.2 },
  { subject: 'science', score: 95, weight: 0.5 },
];
const weightedSum = sumBy(scores, item => item.score * item.weight);
console.log(weightedSum); // 91

// 数组的数组中长度的总和
const arrays = [[1, 2], [3, 4, 5], [6]];
const totalElements = sumBy(arrays, arr => arr.length);
console.log(totalElements); // 6

// 条件计算
const orders = [
  { id: 1, amount: 100, status: 'completed' },
  { id: 2, amount: 200, status: 'pending' },
  { id: 3, amount: 150, status: 'completed' },
];
const completedTotal = sumBy(orders, order => (order.status === 'completed' ? order.amount : 0));
console.log(completedTotal); // 250
```

实际使用示例。

```typescript
import { sumBy } from 'es-toolkit/math';

// 月销售额总和
const monthlyReports = [
  { month: 'January', sales: 12000, expenses: 8000 },
  { month: 'February', sales: 15000, expenses: 9000 },
  { month: 'March', sales: 18000, expenses: 11000 },
];
const totalSales = sumBy(monthlyReports, report => report.sales);
const totalExpenses = sumBy(monthlyReports, report => report.expenses);
const totalProfit = totalSales - totalExpenses;
console.log(totalSales); // 45000
console.log(totalExpenses); // 28000
console.log(totalProfit); // 17000

// 计算学生平均成绩的总分
const students = [
  { name: 'Alice', tests: [85, 90, 88] },
  { name: 'Bob', tests: [92, 87, 95] },
  { name: 'Charlie', tests: [78, 85, 82] },
];
const totalTestScores = sumBy(students, student => student.tests.reduce((sum, score) => sum + score, 0));
console.log(totalTestScores); // 762
```

空数组返回 0。

```typescript
import { sumBy } from 'es-toolkit/math';

const emptyArray = [];
const result = sumBy(emptyArray, x => x.value);
console.log(result); // 0
```
