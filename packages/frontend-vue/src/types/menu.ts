export type MenuAccessType = 'LOCAL' | 'REMOTE'

export interface MenuItem {
  accessType: MenuAccessType
  accessTypeLabel?: string
  code: string
  id: string
  name: string
  parentId?: string
  path?: string
  sort: number
}

export interface MenuTreeNode extends MenuItem {
  children?: MenuTreeNode[]
}

export interface MenuFormModel {
  accessType: MenuAccessType
  code?: string
  id?: string
  name: string
  parentId?: string
  path?: string
  sort: number
}

export interface MenuSearchForm {
  code?: string
  name?: string
  page: number
  parentId?: string
  size: number
}

export interface MenuDataResponse<T> {
  data?: T
  list?: T
  rspFlag?: boolean
}

export interface MenuPageResponse<T> {
  list: T[]
  page: number
  size: number
  totalNum: number
}

export const MENU_ROOT_ID = '__ROOT__'

export const MENU_ROOT_NODE: MenuTreeNode = {
  accessType: 'LOCAL',
  code: 'ROOT',
  id: MENU_ROOT_ID,
  name: '全部菜单',
  path: '',
  sort: 0,
}
