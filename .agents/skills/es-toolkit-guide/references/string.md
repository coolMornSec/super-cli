# 用法汇总 - string

## camelCase

### `camelCase(str)`

当您想将字符串转换为驼峰命名法时,请使用 `camelCase`。驼峰命名法是一种命名规则,第一个单词以小写字母开头,其余单词的首字母大写并连接在一起。

```typescript
import { camelCase } from 'es-toolkit/string';

// 将各种形式的字符串转换为驼峰命名法
camelCase('hello world'); // returns 'helloWorld'
camelCase('some-hyphen-text'); // returns 'someHyphenText'
camelCase('CONSTANT_CASE'); // returns 'constantCase'
camelCase('PascalCase'); // returns 'pascalCase'
camelCase('mixed   SpAcE'); // returns 'mixedSpAcE'
```

将包含特殊字符、空格、连字符等分隔符的字符串转换为适合用作JavaScript变量名或对象属性名的形式。

```typescript
import { camelCase } from 'es-toolkit/string';

// 转换从API响应中接收的键
const apiKey = 'user_first_name';
const jsKey = camelCase(apiKey); // 'userFirstName'

// 将HTML属性转换为JavaScript属性
const cssProperty = 'background-color';
const jsProperty = camelCase(cssProperty); // 'backgroundColor'
```

也会保留Unicode字符。

```typescript
import { camelCase } from 'es-toolkit/string';

camelCase('keep unicode 😅'); // returns 'keepUnicode😅'
camelCase('한글-테스트'); // returns '한글테스트'
```

## capitalize

### `capitalize(str)`

当您想将字符串的第一个字母转换为大写,其余字母统一为小写时,请使用 `capitalize`。在规范化姓名或标题时非常有用。

```typescript
import { capitalize } from 'es-toolkit/string';

// 基本用法
capitalize('hello'); // returns 'Hello'
capitalize('WORLD'); // returns 'World'
capitalize('javaScript'); // returns 'Javascript'
```

也能正确处理空字符串或单字符字符串。

```typescript
import { capitalize } from 'es-toolkit/string';

capitalize(''); // returns ''
capitalize('a'); // returns 'A'
capitalize('A'); // returns 'A'
```

可以用于规范化用户输入或创建标题。

```typescript
import { capitalize } from 'es-toolkit/string';

// 规范化用户姓名
const userName = 'john DOE';
const formattedName = userName.split(' ').map(capitalize).join(' ');
// returns 'John Doe'

// 创建标题
const title = capitalize('welcome to our website');
// returns 'Welcome to our website'
```

## constantCase

### `constantCase(str)`

当您想将字符串转换为常量命名法时,请使用 `constantCase`。常量命名法是一种命名规则,所有字符都大写,单词之间用下划线(`_`)分隔。

```typescript
import { constantCase } from 'es-toolkit/string';

// 将各种形式的字符串转换为常量命名法
constantCase('hello world'); // returns 'HELLO_WORLD'
constantCase('camelCase'); // returns 'CAMEL_CASE'
constantCase('some-kebab-case'); // returns 'SOME_KEBAB_CASE'
constantCase('PascalCase'); // returns 'PASCAL_CASE'
constantCase('snake_case'); // returns 'SNAKE_CASE'
```

这是在JavaScript或其他编程语言中定义常量时常用的命名规则。

```typescript
import { constantCase } from 'es-toolkit/string';

// 生成环境变量名
const configKey = 'api base url';
const envVar = constantCase(configKey); // 'API_BASE_URL'

// 生成常量名
const settingName = 'maximum retry count';
const constantName = constantCase(settingName); // 'MAXIMUM_RETRY_COUNT'
```

也能适当处理包含空格或特殊字符的字符串。

```typescript
import { constantCase } from 'es-toolkit/string';

constantCase('HTTP Request'); // returns 'HTTP_REQUEST'
constantCase('user-agent-string'); // returns 'USER_AGENT_STRING'
constantCase('  multiple   spaces  '); // returns 'MULTIPLE_SPACES'
```

## deburr

### `deburr(str)`

当您想将字符串中的特殊字符或变音符号转换为ASCII字符时,请使用 `deburr`。它对于在URL、文件名或搜索功能中规范化字符很有用。

```typescript
import { deburr } from 'es-toolkit/string';

// 基本用法
deburr('café'); // returns 'cafe'
deburr('résumé'); // returns 'resume'
deburr('naïve'); // returns 'naive'
deburr('Zürich'); // returns 'Zurich'
```

它可以处理各种语言的特殊字符。

```typescript
import { deburr } from 'es-toolkit/string';

// 德语
deburr('München'); // returns 'Munchen'
deburr('Björk'); // returns 'Bjork'

// 法语
deburr('Crème brûlée'); // returns 'Creme brulee'
deburr('naïveté'); // returns 'naivete'

// 西班牙语
deburr('niño'); // returns 'nino'
deburr('mañana'); // returns 'manana'
```

可以用于URL生成或文件名清理。

```typescript
import { deburr } from 'es-toolkit/string';

// 生成URL slug
const title = 'Café의 특별한 메뉴';
const slug = deburr(title).toLowerCase().replace(/\s+/g, '-');
// returns 'cafe의-특별한-메뉴'

// 清理文件名
const fileName = 'résumé-김철수.pdf';
const cleanName = deburr(fileName); // returns 'resume-김철수.pdf'
```

它使搜索功能中的字符串比较更容易。

```typescript
import { deburr } from 'es-toolkit/string';

function searchMatch(query: string, target: string): boolean {
  const normalizedQuery = deburr(query.toLowerCase());
  const normalizedTarget = deburr(target.toLowerCase());
  return normalizedTarget.includes(normalizedQuery);
}

searchMatch('cafe', 'Café Mocha'); // returns true
searchMatch('resume', 'résumé.pdf'); // returns true
```

## escape

### `escape(str)`

当您想在HTML中安全插入文本时,请使用 `escape`。它将 `&`、`<`、`>`、`"`、`'` 等特殊字符转换为HTML实体,以防止XSS攻击并确保HTML正确显示。

```typescript
import { escape } from 'es-toolkit/string';

// 处理基本HTML特殊字符
escape('<div>Hello World</div>'); // returns '&lt;div&gt;Hello World&lt;/div&gt;'
escape('Tom & Jerry'); // returns 'Tom &amp; Jerry'
escape('"Hello"'); // returns '&quot;Hello&quot;'
escape("'Hello'"); // returns '&#39;Hello&#39;'
```

在HTML中显示用户输入时,为了安全必须使用它。

```typescript
import { escape } from 'es-toolkit/string';

// 处理用户输入
const userInput = '<script>alert("XSS")</script>';
const safeHtml = `<div>${escape(userInput)}</div>`;
// returns '<div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>'

// 生成动态HTML
const title = 'Article "How to & Why"';
const html = `<h1>${escape(title)}</h1>`;
// returns '<h1>Article &quot;How to &amp; Why&quot;</h1>'
```

可以在模板或评论系统中使用。

```typescript
import { escape } from 'es-toolkit/string';

// 评论系统
function renderComment(comment: string, author: string) {
  return `
    <div class="comment">
      <strong>${escape(author)}</strong>: ${escape(comment)}
    </div>
  `;
}

// 使用示例
const html = renderComment('I love <coding> & "programming"!', 'John Doe');
// returns '<div class="comment"><strong>John Doe</strong>: I love &lt;coding&gt; &amp; &quot;programming&quot;!</div>'
```

将JSON字符串放入HTML属性时也很有用。

```typescript
import { escape } from 'es-toolkit/string';

const data = { message: 'Hello & "welcome"' };
const jsonString = JSON.stringify(data);
const htmlAttribute = `<div data-info="${escape(jsonString)}"></div>`;
// returns '<div data-info="{&quot;message&quot;:&quot;Hello &amp; \\&quot;welcome\\&quot;&quot;}"></div>'
```

## escapeRegExp

### `escapeRegExp(str)`

当您想在正则表达式模式中安全地使用字符串时,请使用 `escapeRegExp`。它转义正则表达式特殊字符,如 `^`、`$`、`\`、`.`、`*`、`+`、`?`、`(`、`)`、`[`、`]`、`{`、`}` 和 `|`,使它们字面匹配。

```typescript
import { escapeRegExp } from 'es-toolkit/string';

// 基本用法
escapeRegExp('Hello.'); // returns 'Hello\\.'
escapeRegExp('(test)'); // returns '\\(test\\)'
escapeRegExp('user@domain.com'); // returns 'user@domain\\.com'
escapeRegExp('[abc]'); // returns '\\[abc\\]'
```

在将用户输入用作正则表达式模式时这是必不可少的。

```typescript
import { escapeRegExp } from 'es-toolkit/string';

// 将用户搜索词用作正则表达式
function searchInText(text: string, searchTerm: string): boolean {
  const escapedTerm = escapeRegExp(searchTerm);
  const regex = new RegExp(escapedTerm, 'i'); // 不区分大小写
  return regex.test(text);
}

searchInText('Visit https://example.com', 'https://example.com'); // returns true
searchInText('Price: $19.99', '$19.99'); // returns true
```

也可以用于字符串替换。

```typescript
import { escapeRegExp } from 'es-toolkit/string';

function replaceAll(text: string, search: string, replacement: string): string {
  const escapedSearch = escapeRegExp(search);
  const regex = new RegExp(escapedSearch, 'g');
  return text.replace(regex, replacement);
}

const html = '<div>Hello</div> <span>World</span>';
const result = replaceAll(html, '<div>', '<section>');
// returns '<section>Hello</div> <span>World</span>'
```

它对处理文件路径或URL很有用。

```typescript
import { escapeRegExp } from 'es-toolkit/string';

// 检查文件扩展名
function hasExtension(filename: string, extension: string): boolean {
  const escapedExt = escapeRegExp(extension);
  const regex = new RegExp(`\\.${escapedExt}$`, 'i');
  return regex.test(filename);
}

hasExtension('document.pdf', 'pdf'); // returns true
hasExtension('image.jpg', 'pdf'); // returns false

// URL匹配
function matchesUrl(text: string, url: string): boolean {
  const escapedUrl = escapeRegExp(url);
  const regex = new RegExp(escapedUrl);
  return regex.test(text);
}

const content = 'Visit our site at https://es-toolkit.dev/ for more info';
matchesUrl(content, 'https://es-toolkit.dev/'); // returns true
```

## kebabCase

### `kebabCase(str)`

当您想将字符串转换为短横线命名法时，请使用 `kebabCase`。短横线命名法是一种命名约定，其中每个单词都以小写字母书写，并用短横线（-）连接。

```typescript
import { kebabCase } from 'es-toolkit/string';

// 将驼峰命名法转换为短横线命名法
kebabCase('camelCase');
// 结果：'camel-case'

// 转换带有空格的字符串
kebabCase('some whitespace');
// 结果：'some-whitespace'

// 保持已经是短横线命名法的字符串不变
kebabCase('hyphen-text');
// 结果：'hyphen-text'

// 转换包含大写字母的字符串
kebabCase('HTTPRequest');
// 结果：'http-request'
```

此函数在创建 API 端点、CSS 类名、HTML 属性等时非常有用。

## lowerCase

### `lowerCase(str)`

当您想将字符串转换为小写格式时，请使用 `lowerCase`。小写格式是一种命名约定，其中所有单词都用小写字母书写，单词之间用空格分隔。

```typescript
import { lowerCase } from 'es-toolkit/string';

// 将各种格式的字符串转换为小写格式
lowerCase('Hello World'); // returns 'hello world'
lowerCase('camelCase'); // returns 'camel case'
lowerCase('some-kebab-case'); // returns 'some kebab case'
lowerCase('PascalCase'); // returns 'pascal case'
lowerCase('SCREAMING_SNAKE_CASE'); // returns 'screaming snake case'
```

在创建面向用户的文本或标题时非常有用。

```typescript
import { lowerCase } from 'es-toolkit/string';

// 生成用户界面文本
const fieldName = 'firstName';
const label = lowerCase(fieldName); // 'first name'

// 将 API 键转换为用户友好的文本
const apiKeys = ['userEmail', 'phoneNumber', 'birthDate'];
const labels = apiKeys.map(key => lowerCase(key));
// returns ['user email', 'phone number', 'birth date']
```

在显示配置或选项名称时也可以使用。

```typescript
import { lowerCase } from 'es-toolkit/string';

// 显示设置菜单
const settings = {
  enableNotifications: true,
  darkModeEnabled: false,
  autoSaveInterval: 300,
};

for (const [key, value] of Object.entries(settings)) {
  const displayName = lowerCase(key);
  console.log(`${displayName}: ${value}`);
}
// 输出:
// enable notifications: true
// dark mode enabled: false
// auto save interval: 300
```

它可以正确处理带有特殊字符或空格的字符串。

```typescript
import { lowerCase } from 'es-toolkit/string';

lowerCase('HTTPSConnection'); // returns 'https connection'
lowerCase('user_profile-settings'); // returns 'user profile settings'
lowerCase('  mixed   CASE   text  '); // returns 'mixed case text'
```

## lowerFirst

### `lowerFirst(str)`

当您想要将字符串的第一个字母转换为小写时,请使用 `lowerFirst`。其余字符保持不变。这对于创建驼峰式变量名或属性名很有用。

```typescript
import { lowerFirst } from 'es-toolkit/string';

// 基本用法
lowerFirst('Hello'); // returns 'hello'
lowerFirst('WORLD'); // returns 'wORLD'
lowerFirst('JavaScript'); // returns 'javaScript'
```

它可以正确处理空字符串和单字符字符串。

```typescript
import { lowerFirst } from 'es-toolkit/string';

lowerFirst(''); // returns ''
lowerFirst('A'); // returns 'a'
lowerFirst('a'); // returns 'a'
```

您可以将其用于驼峰式转换。

```typescript
import { lowerFirst } from 'es-toolkit/string';

// 将类名转换为实例变量名
const className = 'UserService';
const instanceName = lowerFirst(className); // 'userService'

// 将常量名转换为驼峰式
const constantName = 'API_BASE_URL';
const camelCase = lowerFirst(constantName.toLowerCase().replace(/_(.)/g, (_, letter) => letter.toUpperCase()));
// 结果为 'apiBaseUrl'
```

它还可用于 API 响应或数据转换。

```typescript
import { lowerFirst } from 'es-toolkit/string';

// 将数据库列名转换为 JavaScript 属性名
const dbColumns = ['UserId', 'FirstName', 'LastName', 'EmailAddress'];
const jsProperties = dbColumns.map(column => lowerFirst(column));
// returns ['userId', 'firstName', 'lastName', 'emailAddress']

// 生成函数名
function createGetter(propertyName: string): string {
  return `get${propertyName}`;
}

function createSetter(propertyName: string): string {
  return `set${propertyName}`;
}

const property = lowerFirst('UserName'); // 'userName'
const getter = createGetter(property.charAt(0).toUpperCase() + property.slice(1)); // 'getUserName'
const setter = createSetter(property.charAt(0).toUpperCase() + property.slice(1)); // 'setUserName'
```

## pad

### `pad(str, length, chars?)`

当字符串长度短于指定长度时，使用 `pad` 在字符串两侧添加字符以匹配目标长度。如果无法在两侧均匀分配填充字符，则右侧会多一个字符。

```typescript
import { pad } from 'es-toolkit/string';

// 使用默认空格填充
pad('abc', 8);
// => '  abc   '

// 使用自定义字符填充
pad('abc', 8, '_-');
// => '_-abc_-_'

// 当字符串已经长于或等于目标长度时
pad('abc', 3);
// => 'abc'

pad('abcdef', 3);
// => 'abcdef'
```

当填充字符无法均匀分配到目标长度时，右侧会更长。

```typescript
import { pad } from 'es-toolkit/string';

pad('abc', 9, '123');
// => '123abc123' (左侧 3 个字符，右侧 3 个字符)

pad('abc', 10, '123');
// => '123abc1231' (左侧 3 个字符，右侧 4 个字符)
```

## pascalCase

### `pascalCase(str)`

当您想要将字符串转换为帕斯卡命名法时，请使用 `pascalCase`。帕斯卡命名法是一种命名规范，每个单词的首字母大写，单词之间不使用分隔符连接。

```typescript
import { pascalCase } from 'es-toolkit/string';

// 基本用法
pascalCase('pascalCase'); // 'PascalCase'
pascalCase('some whitespace'); // 'SomeWhitespace'

// 使用连字符或下划线连接的单词
pascalCase('hyphen-text'); // 'HyphenText'
pascalCase('snake_case'); // 'SnakeCase'

// 处理连续的大写字母
pascalCase('HTTPRequest'); // 'HttpRequest'
pascalCase('XMLHttpRequest'); // 'XmlHttpRequest'
```

它还能正确处理包含各种分隔符的字符串。

```typescript
import { pascalCase } from 'es-toolkit/string';

// 混合多种分隔符的情况
pascalCase('camelCase-with_mixed.separators'); // 'CamelCaseWithMixedSeparators'

// 包含数字的情况
pascalCase('version2.1.0'); // 'Version210'

// 包含特殊字符的情况
pascalCase('user@email.com'); // 'UserEmailCom'
```

## reverseString

### `reverseString(value)`

当您想要反转字符串中的字符顺序时,请使用 `reverseString`。它可以正确处理 Unicode 字符和表情符号。

```typescript
import { reverseString } from 'es-toolkit/string';

// 基本字符串反转
reverseString('hello'); // 'olleh'
reverseString('world'); // 'dlrow'

// 混合大小写字符串
reverseString('PascalCase'); // 'esaClacsaP'

// 包含空格的字符串
reverseString('hello world'); // 'dlrow olleh'
```

它可以准确处理表情符号和特殊字符。

```typescript
import { reverseString } from 'es-toolkit/string';

// 包含表情符号的字符串
reverseString('foo 😄 bar'); // 'rab 😄 oof'
reverseString('안녕하세요'); // '요세하녕안'

// 数字和特殊字符
reverseString('12345'); // '54321'
reverseString('a-b-c'); // 'c-b-a'
```

## snakeCase

### `snakeCase(str)`

当您想要将字符串转换为蛇形命名法时，请使用 `snakeCase`。蛇形命名法是一种命名约定，其中每个单词都以小写字母书写，单词之间用下划线(\_)连接。

```typescript
import { snakeCase } from 'es-toolkit/string';

// 基本用法
snakeCase('camelCase'); // 'camel_case'
snakeCase('some whitespace'); // 'some_whitespace'

// 用连字符或其他分隔符连接的单词
snakeCase('hyphen-text'); // 'hyphen_text'
snakeCase('PascalCase'); // 'pascal_case'

// 处理连续大写字母
snakeCase('HTTPRequest'); // 'http_request'
snakeCase('XMLHttpRequest'); // 'xml_http_request'
```

它也能正确处理包含各种分隔符的字符串。

```typescript
import { snakeCase } from 'es-toolkit/string';

// 混合分隔符的情况
snakeCase('camelCase-with_mixed.separators'); // 'camel_case_with_mixed_separators'

// 包含数字的情况
snakeCase('version2.1.0'); // 'version_2_1_0'

// 包含特殊字符的情况
snakeCase('user@email.com'); // 'user_email_com'
```

## startCase

### `startCase(str)`

当您想要将字符串转换为起始大写格式(每个单词的首字母大写)时,请使用 `startCase`。它将每个单词的首字母大写,其余字母转换为小写,并用空格连接单词。

```typescript
import { startCase } from 'es-toolkit/string';

// 基本用法
startCase('hello world'); // 'Hello World'
startCase('HELLO WORLD'); // 'Hello World'

// 转换驼峰命名或帕斯卡命名
startCase('fooBar'); // 'Foo Bar'
startCase('PascalCase'); // 'Pascal Case'

// 用连字符或下划线连接的单词
startCase('hello-world'); // 'Hello World'
startCase('hello_world'); // 'Hello World'
```

它还能正确处理包含各种分隔符和特殊字符的字符串。

```typescript
import { startCase } from 'es-toolkit/string';

// 包含多个分隔符的情况
startCase('--foo-bar--'); // 'Foo Bar'
startCase('__FOO_BAR__'); // 'Foo Bar'

// 处理连续大写字母和数字
startCase('XMLHttpRequest'); // 'Xml Http Request'
startCase('_abc_123_def'); // 'Abc 123 Def'

// 空字符串或只有无意义分隔符的情况
startCase('_-_-_-_'); // ''
startCase('12abc 12ABC'); // '12 Abc 12 Abc'
```

## trim

### `trim(str, chars?)`

当您想从字符串的开头和结尾删除不必要的字符时,请使用 `trim`。如果未指定特定字符,则删除空白字符。

```typescript
import { trim } from 'es-toolkit/string';

// 基本空白删除
trim('  hello  '); // 'hello'
trim('\t\n  hello  \r\n'); // 'hello'

// 删除特定字符
trim('--hello--', '-'); // 'hello'
trim('***hello***', '*'); // 'hello'

// 如果多个字符中的任何一个匹配则删除
trim('##hello##world##', ['#', 'd']); // 'hello##worl'
```

当您将多个字符指定为数组时,会删除与其中任何一个匹配的所有字符。

```typescript
import { trim } from 'es-toolkit/string';

// 将多个字符指定为数组
trim('!!@@hello@@!!', ['!', '@']); // 'hello'

// 删除数字和特殊字符
trim('123abc123', ['1', '2', '3']); // 'abc'

// 同时删除字符和空格
trim('  __hello__  ', ['_', ' ']); // 'hello'
```

## trimEnd

### `trimEnd(str, chars?)`

当您想从字符串末尾删除不必要的字符时,请使用 `trimEnd`。如果未指定特定字符,则删除空白字符。

```typescript
import { trimEnd } from 'es-toolkit/string';

// 基本空白字符删除
trimEnd('hello  '); // 'hello'
trimEnd('hello\t\n  '); // 'hello'

// 删除特定字符
trimEnd('hello---', '-'); // 'hello'
trimEnd('123000', '0'); // '123'
trimEnd('abcabcabc', 'c'); // 'abcabcab'
```

将多个字符指定为数组时,会删除所有匹配其中任何一个的字符。

```typescript
import { trimEnd } from 'es-toolkit/string';

// 将多个字符指定为数组
trimEnd('hello!!@@', ['!', '@']); // 'hello'

// 删除数字和特殊字符
trimEnd('abc123', ['1', '2', '3']); // 'abc'

// 同时删除字符和空白字符
trimEnd('hello__  ', ['_', ' ']); // 'hello'
```



#### 错误

如果 `chars` 是字符串且长度不为 1,则抛出错误。

## trimStart

### `trimStart(str, chars?)`

当你想要删除字符串开头的不必要字符时使用 `trimStart`。如果不指定特定字符，则删除空白字符。

```typescript
import { trimStart } from 'es-toolkit/string';

// 删除默认空白
trimStart('  hello'); // 'hello'
trimStart('\t\n  hello'); // 'hello'

// 删除特定字符
trimStart('---hello', '-'); // 'hello'
trimStart('000123', '0'); // '123'
trimStart('abcabcabc', 'a'); // 'bcabcabc'
```

如果将多个字符指定为数组，则删除所有匹配其中任意一个的字符。

```typescript
import { trimStart } from 'es-toolkit/string';

// 将多个字符指定为数组
trimStart('!!@@hello', ['!', '@']); // 'hello'

// 删除数字和特殊字符
trimStart('123abc', ['1', '2', '3']); // 'abc'

// 同时删除字符和空白
trimStart('  __hello', ['_', ' ']); // 'hello'
```

## unescape

### `unescape(str)`

当您想将HTML实体字符转换回原始字符时,请使用 `unescape`。它将 `&amp;`、`&lt;`、`&gt;`、`&quot;`、`&#39;` 等HTML实体转换为 `&`、`<`、`>`、`"`、`'` 字符。这是 [`escape`](./escape.md) 函数的逆操作。

```typescript
import { unescape } from 'es-toolkit/string';

// 将HTML标签实体转换为原始字符
unescape('This is a &lt;div&gt; element.');
// 返回值: 'This is a <div> element.'

// 将引号实体转换为原始字符
unescape('This is a &quot;quote&quot;');
// 返回值: 'This is a "quote"'

// 将单引号实体转换为原始字符
unescape('This is a &#39;quote&#39;');
// 返回值: 'This is a 'quote''

// 将&符号实体转换为原始字符
unescape('This is a &amp; symbol');
// 返回值: 'This is a & symbol'
```

处理来自HTML表单或URL的数据时很有用:

```typescript
// 转换用户输入中的HTML实体
const userInput = 'My favorite tag is &lt;button&gt;';
const converted = unescape(userInput);
console.log(converted); // 'My favorite tag is <button>'

// 也可以转换混合多个实体的字符串
const mixed = '&quot;Hello &amp; Welcome&quot; &lt;says the &gt; user';
const result = unescape(mixed);
console.log(result); // '"Hello & Welcome" <says the > user'
```

## upperCase

### `upperCase(str)`

当您想将字符串转换为大写表示法时,请使用 `upperCase`。它将每个单词转换为大写并用空格连接单词。可以处理各种表示法的字符串,如 camelCase、kebab-case、snake_case 等。

```typescript
import { upperCase } from 'es-toolkit/string';

// 将camelCase转换为大写表示法
upperCase('camelCase');
// 返回值: 'CAMEL CASE'

// 也可以转换已有空格的字符串
upperCase('some whitespace');
// 返回值: 'SOME WHITESPACE'

// 将kebab-case转换为大写表示法
upperCase('hyphen-text');
// 返回值: 'HYPHEN TEXT'

// 也可以处理连续大写字母的字符串
upperCase('HTTPSRequest');
// 返回值: 'HTTPS REQUEST'
```

将各种命名约定转换为统一的大写格式时很有用:

```typescript
// 统一API响应中的各种键名
const apiKeys = ['user_name', 'firstName', 'email-address', 'phoneNumber'];
const upperCaseKeys = apiKeys.map(key => upperCase(key));
console.log(upperCaseKeys);
// ['USER NAME', 'FIRST NAME', 'EMAIL ADDRESS', 'PHONE NUMBER']

// 显示文件名时使用
const fileName = 'profile_image_thumbnail.jpg';
const displayName = upperCase(fileName.replace('.jpg', ''));
console.log(displayName); // 'PROFILE IMAGE THUMBNAIL'
```

## upperFirst

### `upperFirst(str)`

当您想将字符串的第一个字母大写而其余字母保持不变时,请使用 `upperFirst`。它在首字母大写句子开头或格式化名称时很有用。

```typescript
import { upperFirst } from 'es-toolkit/string';

// 将小写字符串的第一个字母大写
upperFirst('fred');
// 返回值: 'Fred'

// 如果第一个字母已经是大写,则保持不变
upperFirst('Fred');
// 返回值: 'Fred'

// 即使所有字母都是大写也保持不变
upperFirst('FRED');
// 返回值: 'FRED'
```

在各种情况下都很有用:

```typescript
// 格式化用户名
const userName = 'john';
const displayName = upperFirst(userName);
console.log(displayName); // 'John'

// 将句子的第一个字母大写
const sentence = 'hello world';
const capitalizedSentence = upperFirst(sentence);
console.log(capitalizedSentence); // 'Hello world'

// 处理多个名称
const names = ['alice', 'bob', 'charlie'];
const capitalizedNames = names.map(name => upperFirst(name));
console.log(capitalizedNames); // ['Alice', 'Bob', 'Charlie']

// 将camelCase转换为PascalCase
const camelCase = 'firstName';
const pascalCase = upperFirst(camelCase);
console.log(pascalCase); // 'FirstName'
```

## words

### `words(str)`

当您想将字符串拆分为单独的单词时,请使用 `words`。它根据 camelCase、kebab-case、空格、标点符号拆分单词,并能正确识别表情符号和 Unicode 字符。在处理各种命名约定的字符串时很有用。

```typescript
import { words } from 'es-toolkit/string';

// 将由标点符号和空格分隔的字符串拆分为单词
words('fred, barney, & pebbles');
// 返回值: ['fred', 'barney', 'pebbles']

// 正确拆分 camelCase 和连续的大写字母
words('camelCaseHTTPRequest🚀');
// 返回值: ['camel', 'Case', 'HTTP', 'Request', '🚀']

// 处理 Unicode 字符和数字
words('Lunedì 18 Set');
// 返回值: ['Lunedì', '18', 'Set']
```

在各种情况下将字符串拆分为单词时都很有用:

```typescript
// 将变量名拆分为单词以转换为其他命名约定
const variableName = 'getUserProfile';
const wordList = words(variableName);
console.log(wordList); // ['get', 'User', 'Profile']

// 将 snake_case 拆分为单词
const snakeCase = 'user_profile_data';
const snakeWords = words(snakeCase);
console.log(snakeWords); // ['user', 'profile', 'data']

// 将 kebab-case 拆分为单词
const kebabCase = 'user-profile-data';
const kebabWords = words(kebabCase);
console.log(kebabWords); // ['user', 'profile', 'data']

// 处理复杂字符串
const complex = 'XMLHttpRequest2.0_parser-v1.2';
const complexWords = words(complex);
console.log(complexWords); // ['XML', 'Http', 'Request', '2', '0', 'parser', 'v', '1', '2']
```
