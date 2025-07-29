export interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  salary: number
  joinDate: string
  status: 'active' | 'inactive'
  avatar?: string
}

export interface ApiResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface SortModel {
  field: string
  sort: 'asc' | 'desc'
}

export interface FilterModel {
  [key: string]: string | number | boolean
}

export interface Column {
  field: string
  headerName: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  pinned?: 'left' | 'right'
  frozen?: boolean
  type?: 'text' | 'number' | 'date' | 'select' | 'actions'
  options?: string[]
  renderer?: (value: unknown, row: unknown) => React.ReactNode
}
