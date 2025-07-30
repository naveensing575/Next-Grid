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

export type GridAction =
  | { type: 'SET_DATA'; payload: User[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SORT_MODEL'; payload: SortModel[] }
  | { type: 'SET_FILTER_MODEL'; payload: FilterModel }
  | { type: 'SET_SELECTED_ROWS'; payload: Set<string> }
  | { type: 'SET_PAGINATION'; payload: PaginationState }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; payload: string }
  | { type: 'REORDER_COLUMNS'; payload: string[] }
  | { type: 'PIN_COLUMN'; payload: { column: string; side: 'left' | 'right' | null } }
  | { type: 'FREEZE_COLUMN'; payload: string }
  | { type: 'RESIZE_COLUMN'; payload: { column: string; width: number } }
  | { type: 'SET_DENSITY'; payload: 'compact' | 'standard' | 'comfortable' }
  | { type: 'TOGGLE_INLINE_EDIT' }
  | { type: 'TOGGLE_BULK_ACTIONS' }
  | { type: 'TOGGLE_VIRTUALIZATION' }
  | { type: 'DELETE_ROW'; payload: number }
  | { type: 'UPDATE_ROW'; payload: { id: number; updates: Partial<User> } }
  | { type: 'BULK_DELETE'; payload: number[] }
  | { type: 'BULK_UPDATE'; payload: { ids: number[]; updates: Partial<User> } }


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
