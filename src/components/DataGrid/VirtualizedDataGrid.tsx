'use client'

import { useEffect, useState, useRef } from 'react'
import { useVirtualScroll } from '@/hooks/useVirtualScroll'
import DataGridHeader from './DataGridHeader'
import DataGridRow from './DataGridRow'
import Pagination from './Pagination'
import ColumnManager from './ColumnManager'
import Modal from '../ui/Modal'
import BulkActions from './BulkActions'
import { exportFilteredData } from '@/utils/exportUtils'
import { Search, Zap, Edit2, CheckSquare, Columns, Database } from 'lucide-react'

// Premium Toggle Switch Component
function ToggleSwitch({
  label,
  checked,
  onChange,
  icon
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  icon?: React.ReactNode
}) {
  return (
    <label className="
      inline-flex items-center gap-2.5
      px-4 py-2.5
      bg-[var(--background)]
      border border-[var(--border)]
      rounded-xl
      cursor-pointer
      transition-all duration-300
      hover:shadow-md hover:scale-105
      active:scale-95
    ">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--foreground-secondary)]">{icon}</span>}
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="
          w-11 h-6
          bg-[var(--border)]
          rounded-full
          peer-checked:bg-[var(--primary)]
          transition-all duration-300
          peer-focus:ring-2 peer-focus:ring-[var(--primary-glow)]
        " />
        <div className="
          absolute top-0.5 left-0.5
          w-5 h-5
          bg-white
          rounded-full
          shadow-md
          transition-all duration-300
          peer-checked:translate-x-5
        " />
      </div>
    </label>
  )
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

type SortOrder = 'asc' | 'desc' | null

interface Filters {
  name: string
  email: string
  role: string
  status: string
  salaryMin: string
  salaryMax: string
}

const ITEM_HEIGHT = 60
const CONTAINER_HEIGHT = 600

export default function VirtualizedDataGrid() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [showColumnManager, setShowColumnManager] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null)
  const [useVirtualization, setUseVirtualization] = useState(true)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState<Filters>({
    name: '',
    email: '',
    role: '',
    status: '',
    salaryMin: '',
    salaryMax: '',
  })

  const allColumns = [
    'id',
    'name',
    'email',
    'role',
    'department',
    'salary',
    'joinDate',
    'status',
    'actions',
  ]

  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns])
  const [pinnedColumns, setPinnedColumns] = useState<{ left: string[], right: string[] }>({
    left: [],
    right: []
  })
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 60,
    name: 150,
    email: 200,
    role: 120,
    department: 150,
    salary: 120,
    joinDate: 120,
    status: 100,
    actions: 180,
  })
  const [frozenColumns, setFrozenColumns] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [enableInlineEdit, setEnableInlineEdit] = useState(false)
  const [enableBulkActions, setEnableBulkActions] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/mock-data.json')
      const json = await res.json()
      const useLargeDataset = useVirtualization
      
      if (useLargeDataset) {
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Jessica', 'William', 'Ashley', 'Richard', 'Amanda', 'Joseph', 'Stephanie', 'Christopher', 'Jennifer', 'Daniel', 'Nicole']
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']

        const expandedData = []
        for (let i = 0; i < 500; i++) {
          const baseUser = json.data[i % json.data.length]
          const firstNameIndex = (i * 7) % firstNames.length
          const lastNameIndex = (i * 11) % lastNames.length
          const firstName = firstNames[firstNameIndex]
          const lastName = lastNames[lastNameIndex]

          expandedData.push({
            ...baseUser,
            id: i + 1,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
          })
        }
        setData(expandedData)
      } else {
        setData(json.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [useVirtualization])

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      if (sortOrder === 'asc') setSortOrder('desc')
      else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortColumn(null)
      } else setSortOrder('asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleToggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  const handleColumnReorder = (newOrder: string[]) => {
    setVisibleColumns(newOrder)
  }

  const handlePinColumn = (col: string, side: 'left' | 'right' | null) => {
    setPinnedColumns((prev) => {
      const newPinned = { ...prev }
      // Remove from both sides first
      newPinned.left = prev.left.filter(c => c !== col)
      newPinned.right = prev.right.filter(c => c !== col)
      
      // Add to specified side if not null
      if (side === 'left') {
        newPinned.left = [...newPinned.left, col]
      } else if (side === 'right') {
        newPinned.right = [...newPinned.right, col]
      }
      
      return newPinned
    })
  }

  const handleColumnResize = (col: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [col]: width
    }))
  }

  const handleToggleFrozen = (col: string) => {
    setFrozenColumns((prev) => 
      prev.includes(col) 
        ? prev.filter(c => c !== col)
        : [...prev, col]
    )
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((user) => user.id !== id))
    setSelectedIds((prev) => prev.filter(selectedId => selectedId !== id))
  }
  const handleUserUpdate = (id: number, updatedFields: Partial<User>) => {
    setData((prev) => prev.map(user => 
      user.id === id ? { ...user, ...updatedFields } : user
    ))
  }

  const handleRowSelect = (id: number, selected: boolean) => {
    setSelectedIds((prev) => 
      selected 
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? sortedData.map(user => user.id) : [])
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleBulkDelete = (ids: number[]) => {
    setData((prev) => prev.filter(user => !ids.includes(user.id)))
    setSelectedIds([])
  }

  const handleBulkStatusChange = (ids: number[], status: 'active' | 'inactive') => {
    setData((prev) => prev.map(user => 
      ids.includes(user.id) ? { ...user, status } : user
    ))
  }

  const handleBulkExport = (ids: number[], format: 'csv' | 'excel' | 'pdf') => {
    exportFilteredData(sortedData, ids, format)
  }

  const openModal = (type: 'view' | 'edit', user: User) => {
    setSelectedUser(user)
    setModalType(type)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalType(null)
  }

  const customRenderers: Record<string, (value: string | number, user: User) => React.ReactNode> = {
  name: (value) => {
    const stringValue = String(value)
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
          {stringValue.split(' ').map(n => n[0]).join('')}
        </div>
        <span>{stringValue}</span>
      </div>
    )
  },
  email: (value) => (
    <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
      {value}
    </a>
  )
}



  const filteredData = data.filter((user) => {
    const matchText = (field: keyof User, value: string) =>
      user[field]?.toString().toLowerCase().includes(value.toLowerCase())

    const matchSelect = (field: keyof User, value: string) =>
      !value || user[field] === value

    const matchRange = (value: number, min: string, max: string) => {
      const minVal = min ? parseInt(min) : Number.MIN_SAFE_INTEGER
      const maxVal = max ? parseInt(max) : Number.MAX_SAFE_INTEGER
      return value >= minVal && value <= maxVal
    }

    return (
      matchText('name', filters.name) &&
      matchText('email', filters.email) &&
      matchSelect('role', filters.role) &&
      matchSelect('status', filters.status) &&
      matchRange(user.salary, filters.salaryMin, filters.salaryMax) &&
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const valA = a[sortColumn]
        const valB = b[sortColumn]
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA
        } else {
          return sortOrder === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA))
        }
      })
    : filteredData

  const virtualScroll = useVirtualScroll(sortedData, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 10,
  })

  const paginatedData = useVirtualization 
    ? sortedData.slice(virtualScroll.startIndex, virtualScroll.endIndex)
    : sortedData.slice(
        (currentPage - 1) * 20,
        currentPage * 20
      )

  const totalPages = useVirtualization ? 1 : Math.ceil(sortedData.length / 20)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--foreground-secondary)] font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--background-secondary)] to-[var(--background-tertiary)] p-5 border-b border-[var(--border)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--foreground-secondary)]" />
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="
                w-full pl-11 pr-4 py-3
                bg-[var(--background)]
                border border-[var(--border)]
                rounded-2xl
                text-[var(--foreground)]
                placeholder:text-[var(--foreground-muted)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                transition-all duration-300
                text-sm
              "
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ToggleSwitch
              label="Virtualization"
              checked={useVirtualization}
              onChange={setUseVirtualization}
              icon={<Zap className="w-3.5 h-3.5" />}
            />

            <ToggleSwitch
              label="Inline Edit"
              checked={enableInlineEdit}
              onChange={setEnableInlineEdit}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            />

            <ToggleSwitch
              label="Bulk Actions"
              checked={enableBulkActions}
              onChange={setEnableBulkActions}
              icon={<CheckSquare className="w-3.5 h-3.5" />}
            />

            <button
              className="
                inline-flex items-center gap-2
                px-4 py-2.5
                bg-[var(--primary)]
                text-white
                rounded-xl
                text-sm font-medium
                shadow-md hover:shadow-lg
                transition-all duration-300
                hover:scale-105 active:scale-95
              "
              onClick={() => setShowColumnManager((prev) => !prev)}
            >
              <Columns className="w-4 h-4" />
              <span>{showColumnManager ? 'Hide' : 'Manage'} Columns</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-glow)] text-[var(--primary)] rounded-xl">
            <Database className="w-4 h-4" />
            <span className="font-medium">{paginatedData.length} of {sortedData.length} rows</span>
          </div>
          {useVirtualization && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--success-glow)] text-[var(--success)] rounded-xl">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Virtualized: {virtualScroll.startIndex + 1}-{virtualScroll.endIndex}</span>
            </div>
          )}
        </div>
      </div>

      {showColumnManager && (
        <ColumnManager
          allColumns={allColumns}
          visibleColumns={visibleColumns}
          onToggle={handleToggleColumn}
        />
      )}

      {enableBulkActions && (
        <BulkActions
          selectedIds={selectedIds}
          onClearSelection={handleClearSelection}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkExport={handleBulkExport}
          totalCount={sortedData.length}
        />
      )}

      {useVirtualization ? (
        <div
          ref={scrollContainerRef}
          className="overflow-auto border-t border-[var(--border)] rounded-b-3xl custom-scrollbar"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={virtualScroll.handleScroll}
        >
          <div style={{ height: virtualScroll.totalHeight, position: 'relative' }}>
            <table className="min-w-full table-fixed text-sm">
              <thead className="sticky top-0 z-20 bg-[var(--background-secondary)] backdrop-blur-sm">
                <DataGridHeader
                  sortColumn={sortColumn}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  visibleColumns={visibleColumns}
                  onReorder={handleColumnReorder}
                  pinnedColumns={pinnedColumns}
                  onPinColumn={handlePinColumn}
                  columnWidths={columnWidths}
                  onColumnResize={handleColumnResize}
                  frozenColumns={frozenColumns}
                  onToggleFrozen={handleToggleFrozen}
                  enableBulkActions={enableBulkActions}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                />
              </thead>
              <tbody>
                <tr style={{ height: virtualScroll.offsetY }}>
                  <td colSpan={enableBulkActions ? visibleColumns.length + 1 : visibleColumns.length}></td>
                </tr>
                {paginatedData.map((user, index) => (
                  <DataGridRow
                    key={`${user.id}-${virtualScroll.startIndex + index}`}
                    user={user}
                    visibleColumns={visibleColumns}
                    handleDelete={handleDelete}
                    onView={() => openModal('view', user)}
                    onEdit={() => openModal('edit', user)}
                    onUpdate={handleUserUpdate}
                    isSelected={selectedIds.includes(user.id)}
                    onSelect={enableBulkActions ? handleRowSelect : undefined}
                    enableInlineEdit={enableInlineEdit}
                    customRenderers={customRenderers}
                  />
                ))}
                <tr style={{ height: virtualScroll.totalHeight - virtualScroll.offsetY - (paginatedData.length * ITEM_HEIGHT) }}>
                  <td colSpan={enableBulkActions ? visibleColumns.length + 1 : visibleColumns.length}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-auto border-t border-[var(--border)] rounded-b-3xl custom-scrollbar">
          <table className="min-w-full table-fixed text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--background-secondary)] backdrop-blur-sm">
              <DataGridHeader
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={handleSort}
                filters={filters}
                onFilterChange={handleFilterChange}
                visibleColumns={visibleColumns}
                onReorder={handleColumnReorder}
              />
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <DataGridRow
                    key={user.id}
                    user={user}
                    visibleColumns={visibleColumns}
                    handleDelete={handleDelete}
                    onView={() => openModal('view', user)}
                    onEdit={() => openModal('edit', user)}
                    onUpdate={handleUserUpdate}
                    isSelected={selectedIds.includes(user.id)}
                    onSelect={enableBulkActions ? handleRowSelect : undefined}
                    enableInlineEdit={enableInlineEdit}
                    customRenderers={customRenderers}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length} className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!useVirtualization && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={!!modalType}
        onClose={closeModal}
        title={modalType === 'view' ? 'View User' : 'Edit User'}
      >
        {selectedUser ? (
          <div className="text-sm space-y-2">
            <div><strong>ID:</strong> {selectedUser.id}</div>
            <div><strong>Name:</strong> {selectedUser.name}</div>
            <div><strong>Email:</strong> {selectedUser.email}</div>
            <div><strong>Role:</strong> {selectedUser.role}</div>
            <div><strong>Department:</strong> {selectedUser.department}</div>
            <div><strong>Salary:</strong> ${selectedUser.salary}</div>
            <div><strong>Status:</strong> {selectedUser.status}</div>
            <div><strong>Join Date:</strong> {new Date(selectedUser.joinDate).toLocaleDateString()}</div>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </Modal>
    </div>
  )
}
