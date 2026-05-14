import type { UserFormModel, UserItem, UserPageResponse, UserSearchForm } from '@/types/user'

const BASE = '/api/user'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  const json = await res.json()
  if (!json.rspFlag) {
    throw new Error(json.message || '请求失败')
  }
  return json as T
}

export function useUserApi() {
  function fetchUserPage(params: UserSearchForm): Promise<UserPageResponse<UserItem>> {
    const searchParams = new URLSearchParams()
    if (params.username) searchParams.set('username', params.username)
    if (params.email) searchParams.set('email', params.email)
    if (params.status !== undefined) searchParams.set('status', String(params.status))
    searchParams.set('page', String(params.page))
    searchParams.set('size', String(params.size))
    return request(`${BASE}/page?${searchParams.toString()}`)
  }

  function fetchUserById(id: string): Promise<{ rspFlag: boolean; data: UserItem }> {
    return request(`${BASE}/${id}`)
  }

  function createUser(data: UserFormModel): Promise<{ rspFlag: boolean; data: UserItem }> {
    return request(`${BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function updateUser(id: string, data: UserFormModel): Promise<{ rspFlag: boolean; data: UserItem }> {
    return request(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function deleteUser(id: string): Promise<{ rspFlag: boolean; message: string }> {
    return request(`${BASE}/${id}`, { method: 'DELETE' })
  }

  function batchDeleteUsers(ids: string[]): Promise<{ rspFlag: boolean; message: string }> {
    return request(`${BASE}/batch?ids=${ids.join(',')}`, { method: 'DELETE' })
  }

  return { fetchUserPage, fetchUserById, createUser, updateUser, deleteUser, batchDeleteUsers }
}
