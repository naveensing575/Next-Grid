'use client'

import { useReducer, useMemo } from 'react'
import { User, SortModel, FilterModel, PaginationState } from '@/types/api.types'
import { GridState, GridAction } from '@/types/grid.types'
import { useLocalStorage } from './useLocalStorage'

// Initial state
const initialState: GridState = {
  data: [],
  columns: [],
  visibleColumns: ['id', 'name', 'email', 'role', 'department', 'salary', 'joinDate', 'status', 'actions'],
  pinnedColumns: { left: [], right: [] },
  sortModel: [],
  filterModel: {},
  selectedRows: new Set(),
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
  loading: false,
  error: null,
  searchTerm: '',
  columnWidths: {
    id: 60,
    name: 150,
    email: 200,
    role: 120,
    department: 150,
    salary: 120,
    joinDate: 120,
    status: 100,
    actions: 180,
  },
  frozenColumns: [],
  density: 'standard',
  enableInlineEdit: false,
  enableBulkActions: true,
  useVirtualization: true,
}

// Action types
const GRID_ACTIONS = {
  SET_DATA: 'SET_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SORT_MODEL: 'SET_SORT_MODEL',
  SET_FILTER_MODEL: 'SET_FILTER_MODEL',
  SET_SELECTED_ROWS: 'SET_SELECTED_ROWS',
  SET_PAGINATION: 'SET_PAGINATION',
  TOGGLE_COLUMN_VISIBILITY: 'TOGGLE_COLUMN_VISIBILITY',
  REORDER_COLUMNS: 'REORDER_COLUMNS',
  PIN_COLUMN: 'PIN_COLUMN',
  FREEZE_COLUMN: 'FREEZE_COLUMN',
  RESIZE_COLUMN: 'RESIZE_COLUMN',
  SET_DENSITY: 'SET_DENSITY',
  TOGGLE_INLINE_EDIT: 'TOGGLE_INLINE_EDIT',
  TOGGLE_BULK_ACTIONS: 'TOGGLE_BULK_ACTIONS',
  TOGGLE_VIRTUALIZATION: 'TOGGLE_VIRTUALIZATION',
  DELETE_ROW: 'DELETE_ROW',
  UPDATE_ROW: 'UPDATE_ROW',
  BULK_DELETE: 'BULK_DELETE',
  BULK_UPDATE: 'BULK_UPDATE',
} as const

// Reducer function
function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case GRID_ACTIONS.SET_DATA:
      return { ...state, data: action.payload }
    
    case GRID_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case GRID_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    
    case GRID_ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload }
    
    case GRID_ACTIONS.SET_SORT_MODEL:
      return { ...state, sortModel: action.payload }
    
    case GRID_ACTIONS.SET_FILTER_MODEL:
      return { ...state, filterModel: action.payload }
    
    case GRID_ACTIONS.SET_SELECTED_ROWS:
      return { ...state, selectedRows: action.payload }
    
    case GRID_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: action.payload }
    
    case GRID_ACTIONS.TOGGLE_COLUMN_VISIBILITY:
      const column = action.payload
      const newVisibleColumns = state.visibleColumns.includes(column)
        ? state.visibleColumns.filter(col => col !== column)
        : [...state.visibleColumns, column]
      return { ...state, visibleColumns: newVisibleColumns }
    
    case GRID_ACTIONS.REORDER_COLUMNS:
      return { ...state, visibleColumns: action.payload }
    
    case GRID_ACTIONS.PIN_COLUMN:
      const { column: col, side } = action.payload
      const newPinnedColumns = { ...state.pinnedColumns }
      
      // Remove from both sides first
      newPinnedColumns.left = newPinnedColumns.left.filter(c => c !== col)
      newPinnedColumns.right = newPinnedColumns.right.filter(c => c !== col)
      
      // Add to specified side if not null
      if (side === 'left') {
        newPinnedColumns.left = [...newPinnedColumns.left, col]
      } else if (side === 'right') {
        newPinnedColumns.right = [...newPinnedColumns.right, col]
      }
      
      return { ...state, pinnedColumns: newPinnedColumns }
    
    case GRID_ACTIONS.FREEZE_COLUMN:
      const frozenCol = action.payload
      const newFrozenColumns = state.frozenColumns.includes(frozenCol)
        ? state.frozenColumns.filter(col => col !== frozenCol)
        : [...state.frozenColumns, frozenCol]
      return { ...state, frozenColumns: newFrozenColumns }
    
    case GRID_ACTIONS.RESIZE_COLUMN:
      const { column: resizeCol, width } = action.payload
      return {
        ...state,
        columnWidths: { ...state.columnWidths, [resizeCol]: width }
      }
    
    case GRID_ACTIONS.SET_DENSITY:
      return { ...state, density: action.payload }
    
    case GRID_ACTIONS.TOGGLE_INLINE_EDIT:
      return { ...state, enableInlineEdit: !state.enableInlineEdit }
    
    case GRID_ACTIONS.TOGGLE_BULK_ACTIONS:
      return { ...state, enableBulkActions: !state.enableBulkActions }
    
    case GRID_ACTIONS.TOGGLE_VIRTUALIZATION:
      return { ...state, useVirtualization: !state.useVirtualization }
    
    case GRID_ACTIONS.DELETE_ROW:
      const deleteId = action.payload
      return {
        ...state,
        data: state.data.filter(row => row.id !== deleteId),
        selectedRows: new Set([...state.selectedRows].filter(id => id !== deleteId.toString()))
      }
    
    case GRID_ACTIONS.UPDATE_ROW:
      const { id, updates } = action.payload
      return {
        ...state,
        data: state.data.map(row => row.id === id ? { ...row, ...updates } : row)
      }
    
    case GRID_ACTIONS.BULK_DELETE:
      const deleteIds = action.payload
      return {
        ...state,
        data: state.data.filter(row => !deleteIds.includes(row.id)),
        selectedRows: new Set()
      }
    
    case GRID_ACTIONS.BULK_UPDATE:
      const { ids, updates } = action.payload
      return {
        ...state,
        data: state.data.map(row => 
          ids.includes(row.id) ? { ...row, ...updates } : row
        )
      }
    
    default:
      return state
  }
}

export function useDataGrid() {
  const [state, dispatch] = useReducer(gridReducer, initialState)
  
  // Load preferences from localStorage
  const preferences = useLocalStorage('grid-preferences', {
    visibleColumns: initialState.visibleColumns,
    columnWidths: initialState.columnWidths,
    pinnedColumns: initialState.pinnedColumns,
    frozenColumns: initialState.frozenColumns,
    density: initialState.density,
    enableInlineEdit: initialState.enableInlineEdit,
    enableBulkActions: initialState.enableBulkActions,
    useVirtualization: initialState.useVirtualization,
  })

  // Actions
  const actions = useMemo(() => ({
    setData: (data: User[]) => dispatch({ type: GRID_ACTIONS.SET_DATA, payload: data }),
    setLoading: (loading: boolean) => dispatch({ type: GRID_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error: string | null) => dispatch({ type: GRID_ACTIONS.SET_ERROR, payload: error }),
    setSearchTerm: (term: string) => dispatch({ type: GRID_ACTIONS.SET_SEARCH_TERM, payload: term }),
    setSortModel: (sortModel: SortModel[]) => dispatch({ type: GRID_ACTIONS.SET_SORT_MODEL, payload: sortModel }),
    setFilterModel: (filterModel: FilterModel) => dispatch({ type: GRID_ACTIONS.SET_FILTER_MODEL, payload: filterModel }),
    setSelectedRows: (selectedRows: Set<string>) => dispatch({ type: GRID_ACTIONS.SET_SELECTED_ROWS, payload: selectedRows }),
    setPagination: (pagination: PaginationState) => dispatch({ type: GRID_ACTIONS.SET_PAGINATION, payload: pagination }),
    toggleColumnVisibility: (column: string) => dispatch({ type: GRID_ACTIONS.TOGGLE_COLUMN_VISIBILITY, payload: column }),
    reorderColumns: (newOrder: string[]) => dispatch({ type: GRID_ACTIONS.REORDER_COLUMNS, payload: newOrder }),
    pinColumn: (column: string, side: 'left' | 'right' | null) => 
      dispatch({ type: GRID_ACTIONS.PIN_COLUMN, payload: { column, side } }),
    freezeColumn: (column: string) => dispatch({ type: GRID_ACTIONS.FREEZE_COLUMN, payload: column }),
    resizeColumn: (column: string, width: number) => 
      dispatch({ type: GRID_ACTIONS.RESIZE_COLUMN, payload: { column, width } }),
    setDensity: (density: 'compact' | 'standard' | 'comfortable') => 
      dispatch({ type: GRID_ACTIONS.SET_DENSITY, payload: density }),
    toggleInlineEdit: () => dispatch({ type: GRID_ACTIONS.TOGGLE_INLINE_EDIT }),
    toggleBulkActions: () => dispatch({ type: GRID_ACTIONS.TOGGLE_BULK_ACTIONS }),
    toggleVirtualization: () => dispatch({ type: GRID_ACTIONS.TOGGLE_VIRTUALIZATION }),
    deleteRow: (id: number) => dispatch({ type: GRID_ACTIONS.DELETE_ROW, payload: id }),
    updateRow: (id: number, updates: Partial<User>) => 
      dispatch({ type: GRID_ACTIONS.UPDATE_ROW, payload: { id, updates } }),
    bulkDelete: (ids: number[]) => dispatch({ type: GRID_ACTIONS.BULK_DELETE, payload: ids }),
    bulkUpdate: (ids: number[], updates: Partial<User>) => 
      dispatch({ type: GRID_ACTIONS.BULK_UPDATE, payload: { ids, updates } }),
  }), [])

  // Computed values
  const filteredData = useMemo(() => {
    let filtered = state.data

    // Apply search
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        Object.values(user).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      )
    }

    // Apply filters
    Object.entries(state.filterModel).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(user => {
          const userValue = user[key as keyof User]
          if (typeof value === 'string') {
            return String(userValue).toLowerCase().includes(value.toLowerCase())
          }
          return userValue === value
        })
      }
    })

    return filtered
  }, [state.data, state.searchTerm, state.filterModel])

  const sortedData = useMemo(() => {
    if (state.sortModel.length === 0) return filteredData

    return [...filteredData].sort((a, b) => {
      for (const sort of state.sortModel) {
        const aVal = a[sort.field as keyof User]
        const bVal = b[sort.field as keyof User]
        
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
  }, [filteredData, state.sortModel])

  const paginatedData = useMemo(() => {
    const { page, pageSize } = state.pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, state.pagination])

  return {
    state,
    actions,
    filteredData,
    sortedData,
    paginatedData,
    preferences,
  }
}
