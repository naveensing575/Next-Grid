import { User, SortModel, FilterModel } from '@/types/api.types'

// Sorting utilities
export const sortData = <T extends Record<string, unknown>>(
  data: T[],
  sortModel: SortModel[]
): T[] => {
  if (sortModel.length === 0) return data

  return [...data].sort((a, b) => {
    for (const sort of sortModel) {
      const aVal = a[sort.field]
      const bVal = b[sort.field]
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal
        if (diff !== 0) return sort.sort === 'asc' ? diff : -diff
      } else {
        const comparison = String(aVal).localeCompare(String(bVal))
        if (comparison !== 0) return sort.sort === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })
}

// Filtering utilities
export const filterData = <T extends Record<string, unknown>>(
  data: T[],
  filterModel: FilterModel,
  searchTerm?: string
): T[] => {
  let filtered = data

  // Apply search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    filtered = filtered.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchLower)
      )
    )
  }

  // Apply filters
  Object.entries(filterModel).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filtered = filtered.filter(item => {
        const itemValue = item[key]
        
        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase())
        }
        
        if (typeof value === 'number') {
          return itemValue === value
        }
        
        if (typeof value === 'boolean') {
          return itemValue === value
        }
        
        return true
      })
    }
  })

  return filtered
}

// Pagination utilities
export const paginateData = <T>(
  data: T[],
  page: number,
  pageSize: number
): { data: T[], total: number, totalPages: number } => {
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    data: data.slice(start, end),
    total,
    totalPages,
  }
}

// Column utilities
export const getColumnWidth = (column: string, defaultWidth: number = 120): number => {
  const widthMap: Record<string, number> = {
    id: 60,
    name: 150,
    email: 200,
    role: 120,
    department: 150,
    salary: 120,
    joinDate: 120,
    status: 100,
    actions: 180,
  }
  
  return widthMap[column] || defaultWidth
}

export const getColumnType = (column: string): 'text' | 'number' | 'date' | 'select' | 'actions' => {
  const typeMap: Record<string, 'text' | 'number' | 'date' | 'select' | 'actions'> = {
    id: 'number',
    name: 'text',
    email: 'text',
    role: 'select',
    department: 'text',
    salary: 'number',
    joinDate: 'date',
    status: 'select',
    actions: 'actions',
  }
  
  return typeMap[column] || 'text'
}

export const getColumnOptions = (column: string): string[] => {
  const optionsMap: Record<string, string[]> = {
    role: ['Engineer', 'Manager', 'Designer', 'QA', 'DevOps'],
    status: ['active', 'inactive'],
    department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Design'],
  }
  
  return optionsMap[column] || []
}

// Data validation utilities
export const validateUser = (user: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!user.name || user.name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Valid email is required')
  }
  
  if (!user.role || user.role.trim().length === 0) {
    errors.push('Role is required')
  }
  
  if (!user.department || user.department.trim().length === 0) {
    errors.push('Department is required')
  }
  
  if (typeof user.salary !== 'number' || user.salary < 0) {
    errors.push('Valid salary is required')
  }
  
  if (!user.joinDate) {
    errors.push('Join date is required')
  }
  
  if (!user.status || !['active', 'inactive'].includes(user.status)) {
    errors.push('Valid status is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Format utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Search utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Keyboard navigation utilities
export const getNextFocusableElement = (
  currentElement: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right'
): HTMLElement | null => {
  const focusableElements = Array.from(
    document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[]
  
  const currentIndex = focusableElements.indexOf(currentElement)
  if (currentIndex === -1) return null
  
  let nextIndex: number
  
  switch (direction) {
    case 'down':
      nextIndex = currentIndex + 1
      break
    case 'up':
      nextIndex = currentIndex - 1
      break
    case 'right':
      nextIndex = currentIndex + 1
      break
    case 'left':
      nextIndex = currentIndex - 1
      break
  }
  
  if (nextIndex >= 0 && nextIndex < focusableElements.length) {
    return focusableElements[nextIndex]
  }
  
  return null
}

// Performance utilities
export const memoize = <T extends (...args: unknown[]) => unknown>(
  func: T,
  getKey: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}
