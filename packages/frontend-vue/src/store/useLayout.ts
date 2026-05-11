export const useLayout = defineStore('layout', () => {
  const layout = ref('default')

  const navBarHeight = ref(48)

  function setLayout(name: string) {
    layout.value = name
  }

  return {
    layout,
    setLayout,
    navBarHeight,
  }
})
