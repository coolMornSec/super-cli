import type { MockMethod } from 'vite-plugin-mock'

interface MenuItem {
  id: string
  name: string
  code: string
  path: string
  accessType: 'LOCAL' | 'REMOTE'
  sort: number
  parentId: string | null
}

// In-memory data store (mutable for session-based CRUD)
let idCounter = 100
const menus: MenuItem[] = [
  { id: '1', name: '系统管理', code: 'system_manage', path: '/system', accessType: 'LOCAL', sort: 1, parentId: null },
  { id: '2', name: '用户管理', code: 'user_manage', path: '/system/user', accessType: 'LOCAL', sort: 1, parentId: '1' },
  { id: '3', name: '角色管理', code: 'role_manage', path: '/system/role', accessType: 'LOCAL', sort: 2, parentId: '1' },
  { id: '4', name: '菜单管理', code: 'menu_manage', path: '/system/menu', accessType: 'LOCAL', sort: 3, parentId: '1' },
  { id: '5', name: '业务管理', code: 'biz_manage', path: '/biz', accessType: 'LOCAL', sort: 2, parentId: null },
  { id: '6', name: '订单管理', code: 'order_manage', path: '/biz/order', accessType: 'REMOTE', sort: 1, parentId: '5' },
  { id: '7', name: '日志管理', code: 'log_manage', path: '/log', accessType: 'LOCAL', sort: 3, parentId: null },
]

function buildTree(parentId: string | null): any[] {
  return menus
    .filter((m) => m.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((m) => ({ ...m, children: buildTree(m.id) }))
}

function hasChildren(menuId: string): boolean {
  return menus.some((m) => m.parentId === menuId)
}

function nextId(): string {
  return String(++idCounter)
}

export default [
  // GET /api/menu/tree - full menu tree
  {
    url: '/api/menu/tree',
    method: 'get',
    response: () => {
      const tree = buildTree(null)
      return { rspFlag: true, data: tree }
    },
  },

  // GET /api/menu/children - paginated children of a node
  {
    url: '/api/menu/children',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const parentId = query.parentId || null
      const name = query.name || ''
      const code = query.code || ''
      const page = Number(query.page) || 1
      const size = Number(query.size) || 100

      let filtered = menus.filter((m) => {
        if (parentId) {
          if (m.parentId !== parentId) return false
        } else {
          if (m.parentId !== null) return false
        }
        if (name && !m.name.includes(name)) return false
        if (code && !m.code.includes(code)) return false
        return true
      })

      filtered.sort((a, b) => a.sort - b.sort)
      const totalNum = filtered.length
      const start = (page - 1) * size
      const list = filtered.slice(start, start + size)

      return { rspFlag: true, list, page, size, totalNum }
    },
  },

  // GET /api/menu/:id - get single menu
  {
    url: '/api/menu/:id',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const menu = menus.find((m) => m.id === query.id)
      if (!menu) {
        return { rspFlag: false, message: '菜单不存在' }
      }
      return { rspFlag: true, data: menu }
    },
  },

  // POST /api/menu - create a menu
  {
    url: '/api/menu',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { name, code, path, accessType, sort, parentId } = body

      if (!name) {
        return { rspFlag: false, message: '菜单名称不能为空' }
      }

      // Check code uniqueness
      if (menus.some((m) => m.code === code)) {
        return { rspFlag: false, message: '菜单编码已存在' }
      }

      const newMenu: MenuItem = {
        id: nextId(),
        name,
        code: code || '',
        path: path || '',
        accessType: accessType || 'LOCAL',
        sort: sort ?? 0,
        parentId: parentId || null,
      }
      menus.push(newMenu)

      return { rspFlag: true, data: newMenu }
    },
  },

  // PUT /api/menu/:id - update a menu
  {
    url: '/api/menu/:id',
    method: 'put',
    response: ({ query, body }: { query: Record<string, string>; body: any }) => {
      const menuId = query.id
      const idx = menus.findIndex((m) => m.id === menuId)
      if (idx === -1) {
        return { rspFlag: false, message: '菜单不存在' }
      }

      const { name, code, path, accessType, sort, parentId } = body

      if (!name) {
        return { rspFlag: false, message: '菜单名称不能为空' }
      }

      // Code unchanged in edit — skip uniqueness check for its own code
      if (code && code !== menus[idx].code && menus.some((m) => m.code === code)) {
        return { rspFlag: false, message: '菜单编码已存在' }
      }

      menus[idx] = {
        ...menus[idx],
        name,
        path: path ?? menus[idx].path,
        accessType: accessType ?? menus[idx].accessType,
        sort: sort ?? menus[idx].sort,
        parentId: parentId !== undefined ? (parentId || null) : menus[idx].parentId,
      }

      return { rspFlag: true, data: menus[idx] }
    },
  },

  // DELETE /api/menu/batch - batch delete (check children first)
  {
    url: '/api/menu/batch',
    method: 'delete',
    response: ({ query }: { query: Record<string, string> }) => {
      const ids = (query.ids || '').split(',').filter(Boolean)
      if (ids.length === 0) {
        return { rspFlag: false, message: '请选择要删除的菜单' }
      }

      // Check ALL before deleting any — all-or-nothing
      const withChildren = ids.filter((id) => hasChildren(id))
      if (withChildren.length > 0) {
        const names = withChildren
          .map((id) => menus.find((m) => m.id === id)?.name || id)
          .join('、')
        return { rspFlag: false, message: `以下菜单存在子菜单，不允许删除：${names}` }
      }

      for (const id of ids) {
        const idx = menus.findIndex((m) => m.id === id)
        if (idx !== -1) menus.splice(idx, 1)
      }

      return { rspFlag: true, message: '删除成功' }
    },
  },

  // DELETE /api/menu/:id - delete single (check children first)
  {
    url: '/api/menu/:id',
    method: 'delete',
    response: ({ query }: { query: Record<string, string> }) => {
      const menuId = query.id

      if (hasChildren(menuId)) {
        const name = menus.find((m) => m.id === menuId)?.name || menuId
        return { rspFlag: false, message: `菜单"${name}"存在子菜单，不允许删除` }
      }

      const idx = menus.findIndex((m) => m.id === menuId)
      if (idx === -1) {
        return { rspFlag: false, message: '菜单不存在' }
      }
      menus.splice(idx, 1)

      return { rspFlag: true, message: '删除成功' }
    },
  },
] as MockMethod[]
