export type UserStatus = 0 | 1

export interface UserItem {
  id: string
  username: string
  nickname: string
  email: string
  status: UserStatus
  createdAt: string
}

export interface UserFormModel {
  id?: string
  username: string
  nickname: string
  email: string
  status: UserStatus
}

export interface UserSearchForm {
  username?: string
  email?: string
  status?: UserStatus
  page: number
  size: number
}

export interface UserPageResponse<T> {
  list: T[]
  page: number
  size: number
  totalNum: number
}
