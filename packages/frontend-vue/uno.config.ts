import presetRemToPx from '@unocss/preset-rem-to-px'

import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['**/*.{html,js,ts,jsx,tsx,vue}'],
  },
  presets: [
    //
    presetWind4({ attributifyPseudo: true }),
    presetIcons({ scale: 1.2, warn: true }),
    presetAttributify(),
    presetTypography(),
    presetRemToPx(),
    presetWebFonts({ provider: 'none' }),
  ],
})
