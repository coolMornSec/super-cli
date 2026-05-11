import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { MgFrameworkBizUi } from '@magustek/framework-biz-ui/vite'
import { MgFrameworkUi } from '@magustek/framework-ui/vite'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import {
  ElementPlusResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver,
} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import { vitePluginVersionMark } from 'vite-plugin-version-mark'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

export default defineConfig(() => {
  const isVitest = Boolean(process.env.VITEST)
  const elementPlusResolver = ElementPlusResolver({
    importStyle: isVitest ? false : 'sass',
  })
  const componentResolvers = [
    VueUseDirectiveResolver(),
    VueUseComponentsResolver(),
    elementPlusResolver,
    IconsResolver(),
  ]

  if (!isVitest) {
    componentResolvers.push(
      MgFrameworkBizUi({ cssLayer: 'components' }),
      MgFrameworkUi({ cssLayer: 'components' }),
    )
  }

  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './tests/unit/setup.ts',
      include: ['tests/unit/**/*.test.ts'],
      restoreMocks: true,
      clearMocks: true,
    },
    plugins: [
      vitePluginVersionMark(),
      VueRouter({
        dts: './router-map.d.ts',
        routesFolder: 'src/pages',
        exclude: ['**/components', '**/utils', '**/composable'],
      }),
      Vue(),
      Layouts({ exclude: ['src/layouts/components/**'], pagesDirs: null }),
      VueDevTools(),
      AutoImport({
        dirs: [
          'src/api/**',
          'src/utils/**',
          'src/composable/**',
          'src/layouts/composable/**',
        ],
        packagePresets: [
          'es-toolkit',
          '@vueuse/router',
          '@magustek/framework-core',
          '@magustek/framework-utils',
          '@magustek/framework-biz-utils',
        ],
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          { from: 'pinia', imports: ['storeToRefs', 'defineStore'] },
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw', 'RouteRecordRaw'],
            type: true,
          },
        ],
        vueDirectives: true,
        eslintrc: { enabled: true, globalsPropValue: 'readonly' },
        resolvers: [elementPlusResolver],
      }),
      Components({
        resolvers: componentResolvers,
      }),
      Icons(),
      VueI18nPlugin({}),
      viteMockServe({
        mockPath: 'mock',
        enable: !isVitest,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/theme.scss" as *;',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:18031',
          secure: false,
          changeOrigin: true,
        },
      },
    },
  }
})
