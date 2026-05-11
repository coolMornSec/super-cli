import MgIcons from '@magustek/icon-svg'

import '@magustek/icon-font'
import '@magustek/icon-font/dist/icon-font.css'
import '@magustek/framework-ui/dist/style.css'
import 'element-plus/dist/index.css'

import './styles/index.scss'

import App from './App.vue'
import { i18n } from './i18n/i18n'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.use(MgIcons)
app.mount('#app')
