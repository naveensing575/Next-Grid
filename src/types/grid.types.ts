import { User, PaginationState, SortModel, FilterModel, Column } from './api.types'

export interface GridState {
  data: User[]
  columns: Column[]
  visibleColumns: string[]
  pinnedColumns: { left: string[], right: string[] }
  sortModel: SortModel[]
  filterModel: FilterModel
  selectedRows: Set<string>
  pagination: PaginationState
  loading: boolean
  error: string | null
  searchTerm: string
  columnWidths: Record<string, number>
  frozenColumns: string[]
  density: 'compact' | 'standard' | 'comfortable'
  enableInlineEdit: boolean
  enableBulkActions: boolean
  useVirtualization: boolean
}

export interface GridAction {
  type: string
  payload?: unknown
}

export interface GridContextType {
  state: GridState
  dispatch: React.Dispatch<GridAction>
  actions: {
    setData: (data: User[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setSearchTerm: (term: string) => void
    setSortModel: (sortModel: SortModel[]) => void
    setFilterModel: (filterModel: FilterModel) => void
    setSelectedRows: (selectedRows: Set<string>) => void
    setPagination: (pagination: PaginationState) => void
    toggleColumnVisibility: (column: string) => void
    reorderColumns: (newOrder: string[]) => void
    pinColumn: (column: string, side: 'left' | 'right' | null) => void
    freezeColumn: (column: string) => void
    resizeColumn: (column: string, width: number) => void
    setDensity: (density: 'compact' | 'standard' | 'comfortable') => void
    toggleInlineEdit: () => void
    toggleBulkActions: () => void
    toggleVirtualization: () => void
    deleteRow: (id: number) => void
    updateRow: (id: number, updates: Partial<User>) => void
    bulkDelete: (ids: number[]) => void
    bulkUpdate: (ids: number[], updates: Partial<User>) => void
  }
}

export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export interface VirtualScrollResult {
  startIndex: number
  endIndex: number
  visibleItems: number
  offsetY: number
  totalHeight: number
  scrollToIndex: (index: number) => void
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  filename?: string
  includeHeaders?: boolean
  selectedRows?: number[]
}

export interface BulkActionOptions {
  selectedIds: number[]
  action: 'delete' | 'activate' | 'deactivate' | 'export'
  format?: 'csv' | 'excel' | 'pdf'
}
