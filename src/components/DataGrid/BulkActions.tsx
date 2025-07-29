'use client'

import { useState } from 'react'
import Button from '../ui/Button'

interface Props {
  selectedIds: number[]
  onClearSelection: () => void
  onBulkDelete: (ids: number[]) => void
  onBulkStatusChange: (ids: number[], status: 'active' | 'inactive') => void
  onBulkExport: (ids: number[], format: 'csv' | 'excel' | 'pdf') => void
  totalCount: number
}

export default function BulkActions({
  selectedIds,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
  totalCount,
}: Props) {
  const [showExportMenu, setShowExportMenu] = useState(false)

  if (selectedIds.length === 0) return null

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {selectedIds.length} of {totalCount} items selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
          >
            Clear selection
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              label="Export Selected"
              onClick={() => setShowExportMenu(!showExportMenu)}
              color="blue"
            />
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 min-w-[150px]">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    onBulkExport(selectedIds, 'csv')
                    setShowExportMenu(false)
                  }}
                >
                  📄 Export as CSV
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    onBulkExport(selectedIds, 'excel')
                    setShowExportMenu(false)
                  }}
                >
                  📊 Export as Excel
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    onBulkExport(selectedIds, 'pdf')
                    setShowExportMenu(false)
                  }}
                >
                  📋 Export as PDF
                </button>
              </div>
            )}
          </div>

          <Button
            label="Activate Selected"
            onClick={() => onBulkStatusChange(selectedIds, 'active')}
            color="green"
          />

          <Button
            label="Deactivate Selected"
            onClick={() => onBulkStatusChange(selectedIds, 'inactive')}
            color="yellow"
          />

          <Button
            label="Delete Selected"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) {
                onBulkDelete(selectedIds)
              }
            }}
            color="red"
          />
        </div>
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  )
}
