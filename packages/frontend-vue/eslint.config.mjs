// import { antfu } from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { configureVueProject, defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
// import { defineConfig } from 'eslint/config'
import globals from 'globals'

// import autoImportGlobals from './.eslintrc-auto-import.json'

configureVueProject({ scriptLangs: ['ts', 'tsx'] })

export default defineConfigWithVueTs(
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        parser: '@typescript-eslint/parser',
      },
    },
  },
  // defineConfig(
  //   await antfu({
  //     typescript: {
  //       overrides: {
  //         // 'perfectionist/sort-imports': ['error', { type: 'custom', partitionByNewLine: true }],
  //         // 'no-unused-vars': 'error',
  //       },
  //     },
  //   }),
  // ),
  unocss,

  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },

  globalIgnores([
    '**/skills/**',
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/.vscode/**',
    '**/.agents/**',
    '**/.trae/**',
    '**/.codebuddy/**',
    '**/.claude/**',
    'auto-imports.d.ts',
    'components.d.ts',
    'router-map.d.ts',
  ]),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,

  {
    name: 'custom:rules',
    rules: {
      // 'perfectionist/sort-imports': [
      //   'error',
      //   {
      //     order: 'asc',
      //     type: 'alphabetical',
      //   },
      // ],
      // 'perfectionist/sort-imports': ['error', { type: 'custom', partitionByNewLine: true }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false } }],

      'vue/require-macro-variable-name': ['error'],
      'vue/multi-word-component-names': ['warn', { ignores: ['index'] }],
      'vue/max-attributes-per-line': ['warn', { singleline: { max: 8 }, multiline: { max: 1 } }],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/order-in-components': ['error'],
      'vue/this-in-template': ['error', 'never'],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
    },
  },
  skipFormatting,
)
