export default {
  '*.{vue,css,scss}': ['stylelint --fix'],
  '*.{vue,ts,tsx,mts,mjs,js,jsx}': ['eslint --fix --no-warn-ignored'],
  '*.{vue,ts,tsx,mts,mjs,js,jsx,css,scss,json}': ['prettier --write'],
}
