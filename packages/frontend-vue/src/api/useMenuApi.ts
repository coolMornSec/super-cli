import type { MenuFormModel, MenuItem, MenuPageResponse, MenuSearchForm, MenuTreeNode } from '@/types/menu'

const BASE = '/api/menu'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  const json = await res.json()
  if (!json.rspFlag) {
    throw new Error(json.message || '请求失败')
  }
  return json as T
}

export function useMenuApi() {
  function fetchMenuTree(): Promise<{ rspFlag: boolean; data: MenuTreeNode[] }> {
    return request(`${BASE}/tree`)
  }

  function fetchMenuChildren(params: MenuSearchForm): Promise<MenuPageResponse<MenuItem>> {
    const searchParams = new URLSearchParams()
    if (params.parentId) searchParams.set('parentId', params.parentId)
    if (params.name) searchParams.set('name', params.name)
    if (params.code) searchParams.set('code', params.code)
    searchParams.set('page', String(params.page))
    searchParams.set('size', String(params.size))
    return request(`${BASE}/children?${searchParams.toString()}`)
  }

  function fetchMenuById(id: string): Promise<{ rspFlag: boolean; data: MenuItem }> {
    return request(`${BASE}/${id}`)
  }

  function createMenu(data: MenuFormModel): Promise<{ rspFlag: boolean; data: MenuItem }> {
    return request(`${BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function updateMenu(id: string, data: MenuFormModel): Promise<{ rspFlag: boolean; data: MenuItem }> {
    return request(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function deleteMenu(id: string): Promise<{ rspFlag: boolean; message: string }> {
    return request(`${BASE}/${id}`, { method: 'DELETE' })
  }

  function batchDeleteMenus(ids: string[]): Promise<{ rspFlag: boolean; message: string }> {
    return request(`${BASE}/batch?ids=${ids.join(',')}`, { method: 'DELETE' })
  }

  return { fetchMenuTree, fetchMenuChildren, fetchMenuById, createMenu, updateMenu, deleteMenu, batchDeleteMenus }
}
