export interface MenuNode {
  children?: MenuNode[]
  nodeId: string
  path: string
  text: string
}

type MenuClickHandler = (node: MenuNode) => void

const menuClickHandlers = new Set<MenuClickHandler>()

export const useMenuClick = () => {
  const onMenuItemClick = (handler: MenuClickHandler) => {
    menuClickHandlers.add(handler)

    return () => {
      menuClickHandlers.delete(handler)
    }
  }

  const triggerMenuItemClick = (node: MenuNode) => {
    menuClickHandlers.forEach((handler) => {
      handler(node)
    })
  }

  return {
    onMenuItemClick,
    triggerMenuItemClick,
  }
}
