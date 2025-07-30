'use client'

import { createContext, useContext, ReactNode } from 'react'
import { GridContextType } from '@/types/grid.types'
import { useDataGrid } from '@/hooks/useDataGrid'

const DataGridContext = createContext<GridContextType | undefined>(undefined)

export function DataGridProvider({ children }: { children: ReactNode }) {
  const { state, actions } = useDataGrid()

  const contextValue: GridContextType = {
    state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: actions as unknown as React.Dispatch<any>, // Type assertion for compatibility
    actions: {
      setData: actions.setData,
      setLoading: actions.setLoading,
      setError: actions.setError,
      setSearchTerm: actions.setSearchTerm,
      setSortModel: actions.setSortModel,
      setFilterModel: actions.setFilterModel,
      setSelectedRows: actions.setSelectedRows,
      setPagination: actions.setPagination,
      toggleColumnVisibility: actions.toggleColumnVisibility,
      reorderColumns: actions.reorderColumns,
      pinColumn: actions.pinColumn,
      freezeColumn: actions.freezeColumn,
      resizeColumn: actions.resizeColumn,
      setDensity: actions.setDensity,
      toggleInlineEdit: actions.toggleInlineEdit,
      toggleBulkActions: actions.toggleBulkActions,
      toggleVirtualization: actions.toggleVirtualization,
      deleteRow: actions.deleteRow,
      updateRow: actions.updateRow,
      bulkDelete: actions.bulkDelete,
      bulkUpdate: actions.bulkUpdate,
    }
  }

  return (
    <DataGridContext.Provider value={contextValue}>
      {children}
    </DataGridContext.Provider>
  )
}

export function useDataGridContext() {
  const context = useContext(DataGridContext)
  if (context === undefined) {
    throw new Error('useDataGridContext must be used within a DataGridProvider')
  }
  return context
}
