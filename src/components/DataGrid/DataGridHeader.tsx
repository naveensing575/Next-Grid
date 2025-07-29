'use client'

import { Reorder, motion } from 'framer-motion'
import { useState, useRef } from 'react'

interface Props {
  onSort: (col: keyof User) => void
  sortColumn: keyof User | null
  sortOrder: 'asc' | 'desc' | null
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  visibleColumns: string[]
  onReorder: (newOrder: string[]) => void
  pinnedColumns?: { left: string[], right: string[] }
  onPinColumn?: (col: string, side: 'left' | 'right' | null) => void
  columnWidths?: Record<string, number>
  onColumnResize?: (col: string, width: number) => void
  frozenColumns?: string[]
  onToggleFrozen?: (col: string) => void
  enableBulkActions?: boolean
  selectedIds?: number[]
  onSelectAll?: (selected: boolean) => void
}

interface User {
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

interface Filters {
  name: string
  email: string
  role: string
  status: string
  salaryMin: string
  salaryMax: string
}

export default function DataGridHeader({
  onSort,
  sortColumn,
  sortOrder,
  filters,
  onFilterChange,
  visibleColumns,
  onReorder,
  pinnedColumns = { left: [], right: [] },
  onPinColumn = () => {},
  columnWidths = {},
  onColumnResize = () => {},
  frozenColumns = [],
  onToggleFrozen = () => {},
  enableBulkActions = false,
  selectedIds = [],
  onSelectAll = () => {},
}: Props) {
  const [resizing, setResizing] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null)
  const headerRef = useRef<HTMLTableRowElement>(null)

  const getIcon = (col: keyof User) => {
    if (sortColumn !== col) return ''
    return sortOrder === 'asc' ? ' ▲' : sortOrder === 'desc' ? ' ▼' : ''
  }

  const handleMouseDown = (e: React.MouseEvent, col: string) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      e.preventDefault()
      setResizing(col)
      const startX = e.clientX
      const startWidth = columnWidths[col] || 120

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX))
        onColumnResize(col, newWidth)
      }

      const handleMouseUp = () => {
        setResizing(null)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, col: string) => {
    e.preventDefault()
    setShowContextMenu(col)
  }

  const isPinned = (col: string) =>
    pinnedColumns.left.includes(col) || pinnedColumns.right.includes(col)

  const getPinnedSide = (col: string) => {
    if (pinnedColumns.left.includes(col)) return 'left'
    if (pinnedColumns.right.includes(col)) return 'right'
    return null
  }

  const getColumnStyle = (col: string) => {
    const width = columnWidths[col] || 120
    const pinnedSide = getPinnedSide(col)
    const isFrozen = frozenColumns.includes(col)

    const style: React.CSSProperties = {
      width: `${width}px`,
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
    }

    if (pinnedSide || isFrozen) {
      style.position = 'sticky'
      style.zIndex = 20
      style.backgroundColor = 'var(--background)'
    }

    if (pinnedSide === 'left') style.left = 0
    else if (pinnedSide === 'right') style.right = 0

    return style
  }

  const renderFilter = (col: keyof User) => {
    switch (col) {
      case 'name':
      case 'email':
        return (
          <td key={col} className="p-2 min-w-[140px] bg-background text-foreground">
            <input
              className="w-full px-2 py-1 border rounded text-sm h-10 bg-background text-foreground"
              placeholder={`Search ${col}`}
              value={filters[col]}
              onChange={(e) => onFilterChange(col, e.target.value)}
            />
          </td>
        )
      case 'role':
      case 'status':
        return (
          <td key={col} className="p-2 min-w-[140px] bg-background text-foreground">
            <select
              className="w-full px-2 py-1 border rounded text-sm h-10 bg-background text-foreground"
              value={filters[col]}
              onChange={(e) => onFilterChange(col, e.target.value)}
            >
              <option value="">All</option>
              {col === 'role' &&
                ['Engineer', 'Manager', 'Designer', 'QA', 'DevOps'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              {col === 'status' &&
                ['active', 'inactive'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
            </select>
          </td>
        )
      case 'salary':
        return (
          <td key={col} className="p-2 min-w-[140px] bg-background text-foreground">
            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.salaryMin}
                onChange={(e) => onFilterChange('salaryMin', e.target.value)}
                className="w-1/2 px-1 py-1 border rounded text-sm h-10 bg-background text-foreground"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.salaryMax}
                onChange={(e) => onFilterChange('salaryMax', e.target.value)}
                className="w-1/2 px-1 py-1 border rounded text-sm h-10 bg-background text-foreground"
              />
            </div>
          </td>
        )
      default:
        return <td key={col} className="p-2 min-w-[140px] bg-background text-foreground"></td>
    }
  }

  return (
    <>
      <Reorder.Group
        as="tr"
        axis="x"
        values={visibleColumns}
        onReorder={onReorder}
        className="bg-background text-foreground text-left transition-all duration-300"
        ref={headerRef}
      >
        {enableBulkActions && (
          <th className="p-3 w-[50px] border-r border-gray-300 bg-background text-foreground">
            <input
              type="checkbox"
              checked={selectedIds.length > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
        )}

        {visibleColumns.map((col) => {
          const isSortable = ['name', 'role', 'salary'].includes(col)
          const pinnedSide = getPinnedSide(col)
          const isFrozen = frozenColumns.includes(col)

          return (
            <Reorder.Item
              as="th"
              key={col}
              value={col}
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={getColumnStyle(col)}
              className={`relative p-3 border-r border-gray-300 text-foreground ${
                pinnedSide ? 'bg-background' : ''
              } ${isFrozen ? 'bg-background' : ''}`}
              onMouseDown={(e) => handleMouseDown(e, col)}
              onContextMenu={(e) => handleContextMenu(e, col)}
            >
              <motion.div
                layout
                className={`flex items-center justify-between w-full transition-all duration-300 ${
                  isSortable ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => isSortable && onSort(col as keyof User)}
              >
                <div className="flex items-center gap-1">
                  {pinnedSide && <span className="text-blue-500 text-xs">{pinnedSide === 'left' ? '📌' : '📍'}</span>}
                  {isFrozen && <span className="text-yellow-500 text-xs">❄️</span>}
                  <span className="truncate">{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                </div>
                <span>{getIcon(col as keyof User)}</span>
              </motion.div>

              <div className="resize-handle absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 opacity-0 hover:opacity-100 transition-opacity" />

              {showContextMenu === col && (
                <div
                  className="absolute top-full left-0 mt-1 bg-background text-foreground border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      onPinColumn(col, pinnedSide === 'left' ? null : 'left')
                      setShowContextMenu(null)
                    }}
                  >
                    📌 {pinnedSide === 'left' ? 'Unpin' : 'Pin Left'}
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      onPinColumn(col, pinnedSide === 'right' ? null : 'right')
                      setShowContextMenu(null)
                    }}
                  >
                    📍 {pinnedSide === 'right' ? 'Unpin' : 'Pin Right'}
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      onToggleFrozen(col)
                      setShowContextMenu(null)
                    }}
                  >
                    ❄️ {isFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </div>
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>

      {showContextMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowContextMenu(null)} />
      )}

      <tr className="bg-background text-foreground">
        {enableBulkActions && <td className="p-2 w-[50px] bg-background text-foreground" />}
        {visibleColumns.map((col) => renderFilter(col as keyof User))}
      </tr>
    </>
  )
}
