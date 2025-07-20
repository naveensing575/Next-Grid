'use client'

import { useEffect, useState } from 'react'
import DataGridHeader from './DataGridHeader'
import DataGridRow from './DataGridRow'
import Pagination from './Pagination'
import ColumnManager from './ColumnManager'

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

export default function DataGrid() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [showColumnManager, setShowColumnManager] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    name: '',
    email: '',
    role: '',
    status: '',
    salaryMin: '',
    salaryMax: '',
  })

  const allColumns = ['id', 'name', 'email', 'role', 'department', 'salary', 'joinDate', 'status']
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns)

  const rowsPerPage = 20

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/mock-data.json')
      const json = await res.json()
      setData(json.data)
      setLoading(false)
    }
    fetchData()
  }, [])

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

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (loading) return <p className="text-center">Loading...</p>

  return (
    <div className="overflow-auto border rounded-xl bg-white dark:bg-gray-900 p-4">
     <div className="flex justify-between items-start mb-4">
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

          <button
            className="ml-4 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer rounded text-sm transition-all"
            onClick={() => setShowColumnManager((prev) => !prev)}
          >
            {showColumnManager ? 'Hide' : 'Manage'} Columns
          </button>
        </div>



      {showColumnManager && (
        <ColumnManager
          allColumns={allColumns}
          visibleColumns={visibleColumns}
          onToggle={handleToggleColumn}
        />
      )}

      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10">
          <DataGridHeader
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            filters={filters}
            onFilterChange={handleFilterChange}
            visibleColumns={visibleColumns}
          />
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => (
              <DataGridRow key={user.id} user={user} visibleColumns={visibleColumns} />
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
