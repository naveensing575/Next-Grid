'use client'

import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}

// Hook for grid preferences
export function useGridPreferences() {
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>('grid-column-order', [])
  const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>('grid-visible-columns', [])
  const [columnWidths, setColumnWidths] = useLocalStorage<Record<string, number>>('grid-column-widths', {})
  const [pinnedColumns, setPinnedColumns] = useLocalStorage<{ left: string[], right: string[] }>('grid-pinned-columns', { left: [], right: [] })
  const [frozenColumns, setFrozenColumns] = useLocalStorage<string[]>('grid-frozen-columns', [])
  const [density, setDensity] = useLocalStorage<'compact' | 'standard' | 'comfortable'>('grid-density', 'standard')
  const [enableInlineEdit, setEnableInlineEdit] = useLocalStorage<boolean>('grid-inline-edit', false)
  const [enableBulkActions, setEnableBulkActions] = useLocalStorage<boolean>('grid-bulk-actions', true)
  const [useVirtualization, setUseVirtualization] = useLocalStorage<boolean>('grid-virtualization', true)

  return {
    columnOrder,
    setColumnOrder,
    visibleColumns,
    setVisibleColumns,
    columnWidths,
    setColumnWidths,
    pinnedColumns,
    setPinnedColumns,
    frozenColumns,
    setFrozenColumns,
    density,
    setDensity,
    enableInlineEdit,
    setEnableInlineEdit,
    enableBulkActions,
    setEnableBulkActions,
    useVirtualization,
    setUseVirtualization,
  }
}
