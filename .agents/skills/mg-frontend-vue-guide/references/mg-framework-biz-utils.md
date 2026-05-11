---
name: mg-framework-biz-utils
description: Guide for using @magustek/framework-biz-utils library. Provides business utility functions like closeAndToNext, backToLast, onShow, watchInComponent, download, and downloadTemplate. Use when developing business features with the Magus framework business utils library.
---

# framework-biz-utils

业务工具方法，业务开发过程中，经常用到的工具方法

## 安装

```bash
pnpm add @magustek/framework-biz-utils
```

## closeAndToNext

关闭当前激活标签并跳转到下一个标签

```ts
function closeAndToNext(next?: RouteLocationRaw, appName?: string): void
```

| 参数名  | 类型             | 说明                                                                          |
| ------- | ---------------- | ----------------------------------------------------------------------------- |
| next    | RouteLocationRaw | 非必传，若传了 next 参数，则已传入的作为下一个标签跳转，同时 appName 也必须传 |
| appName | string           | 应用 code，传了 next 参数则需要传此参数                                       |

```ts
import { closeAndToNext } from '@magustek/framework-biz-utils'

closeAndToNext()
```

## backToLast

返回上一次的页面

```ts
function backToLast(last?: RouteLocationRaw, appName?: string): void
```

| 参数名  | 类型             | 说明                                                                          |
| ------- | ---------------- | ----------------------------------------------------------------------------- |
| last    | RouteLocationRaw | 非必传，若传了 next 参数，则已传入的作为下一个标签跳转，同时 appName 也必须传 |
| appName | string           | 应用 code，传了 next 参数则需要传此参数                                       |

```ts
import { backToLast } from '@magustek/framework-biz-utils'

backToLast()
```

## onShow

在 keep-alive 组件显示时触发

```ts
function onShow(callback: Function): void
```

| 参数名   | 类型     | 说明                                |
| -------- | -------- | ----------------------------------- |
| callback | Function | keep-alive 组件显示时触发的回调函数 |

```ts
import { backToLast } from '@magustek/framework-biz-utils'

onShow(() => {
  console.log('组件显示')
})
```

## watchInComponent

同 vue 的 watch, watchInComponent 只在组件激活时工作，组件失活或销毁会停止 watch

```ts
import { watchInComponent } from '@magustek/framework-biz-utils'

watchInComponent(
  () => [],
  () => {
    // 数据发生变化
  },
)
```

## download

根据文件 id 获取文件完整链接，或者下载文件

```ts
function download: (
  fileId: string,
  download?: boolean,
  config?: { path?: string; fileName?: string }
) => Promise<{url: string, name: string}>
```

| 参数名   | 类型                                   | 说明                                                                  |
| -------- | -------------------------------------- | --------------------------------------------------------------------- |
| fileId   | string                                 | 必传，文件的 id                                                       |
| download | boolean                                | 默认为 true, 下载该文件                                               |
| config   | \{ path?: string; filename?: string \} | path: 默认为文档中心的文件下载接口地址<br /> fileName: 下载的文件名称 |

| 返回值 | 类型   | 说明     |
| ------ | ------ | -------- |
| url    | string | 文件链接 |
| name   | string | 文件名称 |

```ts
import { download } from '@magustek/framework-biz-utils'

download('文件id', false).then((res) => {
  console.log(res)
})
```

## downloadTemplate

下载模版文件管理中的文件

```ts
function downloadTemplate: (
  templateData: { appCode: string; code: string },
  config?: { path?: string; fileName?: string }
) => Promise<{url: string, name: string}>
```

| 参数名       | 类型                                   | 说明                                                                  |
| ------------ | -------------------------------------- | --------------------------------------------------------------------- |
| templateData | \{ appCode: string; code: string \}    | 必传<br /> appCode: 应用 code <br /> code: 模版文件 code              |
| config       | \{ path?: string; filename?: string \} | path: 默认为模版文件管理的下载接口地址<br /> fileName: 下载的文件名称 |

| 返回值 | 类型   | 说明     |
| ------ | ------ | -------- |
| url    | string | 文件链接 |
| name   | string | 文件名称 |

```ts
import { downloadTemplate } from '@magustek/framework-biz-utils'

downloadTemplate({ appCode: '应用 code', code: '模版文件 code' }, { fileName: '自定义文件名称' })
```
