'use client'

import { useEffect, useState, useRef } from 'react'
import { useVirtualScroll } from '@/hooks/useVirtualScroll'
import DataGridHeader from './DataGridHeader'
import DataGridRow from './DataGridRow'
import Pagination from './Pagination'
import ColumnManager from './ColumnManager'
import Modal from '../ui/Modal'

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

const ITEM_HEIGHT = 60 // Height of each row in pixels
const CONTAINER_HEIGHT = 600 // Height of the scrollable container

export default function VirtualizedDataGrid() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/mock-data.json')
      const json = await res.json()
      
      // For demonstration, we can either use original data or expand it
      // Toggle this flag to test with large dataset vs normal dataset
      const useLargeDataset = useVirtualization
      
      if (useLargeDataset) {
        // Create a larger dataset for testing virtualization without "Copy" labels
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Jessica', 'William', 'Ashley', 'Richard', 'Amanda', 'Joseph', 'Stephanie', 'Christopher', 'Jennifer', 'Daniel', 'Nicole']
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
        
        const expandedData = []
        for (let i = 0; i < 500; i++) {
          const baseUser = json.data[i % json.data.length]
          // Use deterministic selection based on index to avoid hydration issues
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

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((user) => user.id !== id))
  }

  const openModal = (type: 'view' | 'edit', user: User) => {
    setSelectedUser(user)
    setModalType(type)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalType(null)
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

  // Virtual scrolling logic
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

  if (loading) return <p className="text-center">Loading...</p>

  return (
    <div className="overflow-auto border rounded-xl bg-white dark:bg-gray-900 p-4">
      <div className="flex justify-between items-start mb-4 gap-4">
        <input
          type="text"
          placeholder="Global search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full max-w-xs px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
              className="accent-blue-500"
            />
            Enable Virtualization
          </label>
          
          <button
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer rounded text-sm transition-all"
            onClick={() => setShowColumnManager((prev) => !prev)}
          >
            {showColumnManager ? 'Hide' : 'Manage'} Columns
          </button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedData.length} of {sortedData.length} rows
        {useVirtualization && ` (Virtualized: ${virtualScroll.startIndex + 1}-${virtualScroll.endIndex})`}
      </div>

      {showColumnManager && (
        <ColumnManager
          allColumns={allColumns}
          visibleColumns={visibleColumns}
          onToggle={handleToggleColumn}
        />
      )}

      {useVirtualization ? (
        <div
          ref={scrollContainerRef}
          className="overflow-auto border rounded"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={virtualScroll.handleScroll}
        >
          <div style={{ height: virtualScroll.totalHeight, position: 'relative' }}>
            <table className="min-w-full table-fixed text-sm">
              <thead className="sticky top-0 z-20 bg-white dark:bg-gray-900">
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
                <tr style={{ height: virtualScroll.offsetY }}>
                  <td colSpan={visibleColumns.length}></td>
                </tr>
                {paginatedData.map((user, index) => (
                  <DataGridRow
                    key={`${user.id}-${virtualScroll.startIndex + index}`}
                    user={user}
                    visibleColumns={visibleColumns}
                    handleDelete={handleDelete}
                    onView={() => openModal('view', user)}
                    onEdit={() => openModal('edit', user)}
                  />
                ))}
                <tr style={{ height: virtualScroll.totalHeight - virtualScroll.offsetY - (paginatedData.length * ITEM_HEIGHT) }}>
                  <td colSpan={visibleColumns.length}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full table-fixed text-sm">
            <thead className="sticky top-0 z-10">
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
