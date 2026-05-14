---
name: mg-framework-core
description: Guide for using @magustek/framework-core library. Includes setup for i18n, router, pinia, axios, and store management. Use when developing with the Magus framework core.
---

# Framework-Core

框架核心模块，提供基础功能, router, i18n, pinia

## 安装

```bash
pnpm add @magustek/framework-core
```

## createI18n

创建国际化实例

```ts
import { createApp } from "vue";
import { createI18n, useLocale } from "@magustek/framework-core";

const app = createApp();
const i18n = createI18n({ locale: useLocale().locale.value });
i18n.withGlobalLocale();
i18n.mergeLocalMessages({ cn: {}, en: {} });

app.use(i18n);
```

## createRouter

创建路由实例

```ts
import { createApp } from "vue";
import { createRouter } from "@magustek/framework-core";

const app = createApp();
const router = createRouter({ base: "", routes: [] });

app.use(router);
```

## createPinia

创建 pinia 实例

```ts
import { createApp } from "vue";
import { createPinia } from "@magustek/framework-core";

const app = createApp();
const pinia = createPinia({ storage: localStorage });

app.use(pinia);
```

## definePersistStore

创建一个默认持久化的 store

```ts
import { definePersistStore } from "@magustek/framework-core";
import { storeToRefs } from "pinia";

export const useCountStore = definePersistStore("storeId", () => {
  const count = ref(0);
  return {
    count,
  };
});

// 响应式 store 不可以直接解构，如果要解构使用 storeToRefs
const { count } = storeToRefs(useCountStore());
```

## defineRefStore

创建一个响应式的 store

```ts
import { defineRefStore } from "@magustek/framework-core";

export const useCountStore = defineRefStore(
  "storeId",
  () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const increment = () => {
      count.value++;
    };
    return {
      count,
      doubleCount,
      increment,
    };
  },
  { persist: true }
);

// 响应式 store 可以直接解构出想要的数据和方法
const { count, doubleCount, increment } = useCountStore();
```

## useAxios

### 发送请求

```ts
import { useAxios } from'@magustek/framework-core';

const { get, post, request} = useAxios() 

// 发送一个 get 请求
get('/api/user').then(res => {
  console.log(res)
});

// 发送一个 post 请求
post('/api/user').then(res => {
  console.log(res)
});

// 使用 request 发送请求
request({
  url: '/api/user',
  method: 'get' // 定义请求方法为 get
}).then(res => {
  console.log(res)
});

```

### 标注响应体类型和请求参数类型

get、post、request方法都可以接收两个泛型，第一个标注响应体类型，第二个标注请求参数类型

```ts
type MgRspFlagResponse = MgDataResponse | MgPageResponse | MgListResponse | MgBaseResponse

interface MgPageReq extends PlainObject {
    page?: number
    size?: number
    sort?: 'ASC' | 'DESC'
  }
```

```ts
import { useAxios } from'@magustek/framework-core';

const { post } = useAxios() 

post<MgListResponse, MgPageReq>('/api/user/page', {
  page: 1,
  size: 100,
  sort: 'ASC'
}).then(res =>{
  console.log(res)
});
```

### 高级用法

get、post、request方法都可以设置为非立即执行，以 `post` 方法为例

```ts
import { useAxios } from "@magustek/framework-core";

const { post } = useAxios();

// 将请求设置为非立即执行，解构出 data, execute, isLoading
const { data, execute, isLoading } = post("api/user", null, null, {
  immediate: false,
});

// 调用 execute 方法，传入参数
execute({
  firstName: "Fred",
  lastName: "Flintstone",
}).then(() => {
  console.log(data, isLoading);
});
```

### 设置默认全局请求头

通过 `setDefaults` 方法设置请求头

```javascript
import { useAxios } from "@magustek/framework-core";

const { setDefaults } = useAxios();

setDefaults({ baseURL: "/api" });
```

### 自定义拦截器

通过 `interceptors` 设置拦截器

```javascript
import { useAxios } from "@magustek/framework-core";

const { interceptors } = useAxios();

// 请求拦截器
interceptors.request.use(onFulfilled, onRejected, options)

// 响应拦截器
interceptors.response.use(onFulfilled, onRejected, options)
```

### 处理未授权请求 401

内部会有默认处理方式，如果使用自定义的处理方式，会覆盖默认处理方法

```javascript
import { useAxios } from "@magustek/framework-core";

const { onUnauthorized } = useAxios();

onUnauthorized((response) => {
  // 处理未授权请求
});
```

## ~~onShow~~ 已弃用

在 keep-alive 组件显示时触发，参考 `framework-biz-utils` 的 `onShow` 方法

## useToken

获取、设置、删除 token 信息

```javascript
import { useToken } from "@magustek/framework-core";

const { getToken, setToken, removeToken } = useToken();

// 获取 token
const token = getToken();

// 设置 token
setToken(token);

// 删除 token
removeToken();
```

## useLocale

获取、设置当前国际化信息

```ts
import { useLocale } from "@magustek/framework-core";

const { locale } = useLocale();

// 设置为英文模式
locale.value = 'en'
```

## useClearStore

清除 store 缓存信息

```ts
import { useClearStore } from "@magustek/framework-core";

const { clearAll } = useClearStore()

// 清除所有缓存数据
clearAll()
```

## useCoreStore

使用 `useCoreStore` 获取基础数据

```ts
import { useCoreStore } from '@magustek/framework-core'

const { 
  userInfo, // 当前用户基本信息
  dicts,    // 所有字典信息
  authCodes // 当前用户所拥有的权限码
} = useCoreStore()

console.log(userInfo, dicts, authCodes)
```

## useGlobalPinia

获取全局 pinia 实例

```ts
import { useGlobalPinia } from '@magustek/framework-core'

const globaPinia = useGlobalPinia()

console.log(globaPinia)
```

结合 defineRefStore 使用

```ts
import { defineRefStore, useGlobalPinia} from '@magustek/framework-core'

const defineCountStore = defineRefStore(
  'countStore',
  () => {
    const count = ref(0);
    return {
      count,
  }
}

const useCountStore = defineCountStore(useGlobalPinia())

export { useCountStore }

```

## useGlobalStore

使用 `useGlobalStore` 提供的方法来存储、读取共享数据

```ts
import { useGlobalStore } from '@magustek/framework-core'

const { getItem, setItem, removeItem } = useGlobalStore()

// 获取数据
const value = getItem('key')

// 设置数据
setItem('key', 'value')

// 删除数据
removeItem('key')
```

## useKeepAliveTag

使用 `useKeepAliveTag` 提供的方法来缓存子应用的页面

```vue
<!-- src/layout/index.vue --> 
<template>
  <keep-alive :include="keepAliveList">
    <router-view v-slot="{ Component, route }">
      <component :is="keepAliveComponent(Component, route)" />
    </router-view>
  </keep-alive>
</template>

<script lang="ts" setup>
import { useKeepAliveTag } from "@magustek/framework-core";
const { keepAliveList, keepAliveComponent } = useKeepAliveTag();
</script>
```

## useMultiTags

使用 `useMultiTags` 提供的方法来操作标签栏

```ts
import { useMultiTags } from '@magustek/framework-core'

const {
  multiTags,   // 当前所有的标签
  activeTag,   // 当前激活的标签
  lastTag,     // 上一个标签
  pushTag,     // 添加标签
  closeTag,    // 关闭标签
  updateTag,   // 更新标签
  closeAll,    // 关闭所有标签
  closeActive, // 关闭激活的标签
  closeOthers, // 关闭除激活的标签以外的标签
} = useMultiTags();
```

## useDicts

通过字典 code 获取字典信息

```ts
import { useDicts } from '@magustek/framework-core'

const list = useDicts('code')

console.log(list)
```

## useParams

通过 `useParams` 获取自定义参数

```ts
import { useParams } from '@magustek/framework-core'

const data = useParams('code')

console.log(data)
```
