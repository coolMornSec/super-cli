import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // base: import.meta.env.BASE_URL,
  // @ts-ignore
  routes: setupLayouts([...routes]),
})

// @ts-ignore
if (import.meta.hot) handleHotUpdate(router)

export { router }
