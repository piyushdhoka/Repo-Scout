// Re-export all types from individual modules
export * from './api.types'
export * from './auth.types'
export * from './component.types'
export * from './store.types'
export * from './common.types'

// Utility type exports
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type Maybe<T> = T | null | undefined

export type ID = string | number

export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type SortOrder = 'asc' | 'desc'
export type SortField = string

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith'

export type Filter<T> = {
  [K in keyof T]?: {
    value?: T[K]
    operator?: FilterOperator
  }
}

export type SearchParams = {
  query?: string
  page?: number
  limit?: number
  sort?: SortField
  order?: SortOrder
  filters?: Record<string, any>
}