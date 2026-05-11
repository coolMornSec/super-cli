/// <reference types="vite/client" />
/// <reference types="vite-plugin-vue-layouts/client" />
/// <reference types="unplugin-icons/types/vue" />
/// <reference types="@magustek/framework-types" />
/// <reference types="element-plus/global" />
/// <reference types="./auto-imports.d.ts" />
/// <reference types="./components.d.ts" />
/// <reference types="./router-map.d.ts" />
//
import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

declare module '@magustek/icon-svg' {
  import type { Plugin } from 'vue'

  const MgIcons: Plugin
  export default MgIcons
}

