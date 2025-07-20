interface Props {
  onSort: (col: keyof User) => void
  sortColumn: keyof User | null
  sortOrder: 'asc' | 'desc' | null
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  visibleColumns: string[]
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
}: Props) {
  const getIcon = (col: keyof User) => {
    if (sortColumn !== col) return ''
    return sortOrder === 'asc' ? ' ▲' : sortOrder === 'desc' ? ' ▼' : ''
  }

  const renderHeader = (col: keyof User) => {
    const isSortable = ['name', 'role', 'salary'].includes(col)
    return (
      <th
        key={col}
        className={`p-3 font-semibold ${
          isSortable ? 'cursor-pointer select-none' : ''
        }`}
        onClick={() => isSortable && onSort(col)}
      >
        {col.charAt(0).toUpperCase() + col.slice(1)}
        {getIcon(col)}
      </th>
    )
  }

  const renderFilter = (col: keyof User) => {
    switch (col) {
      case 'name':
      case 'email':
        return (
          <td key={col} className="p-2">
            <input
              className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
              placeholder={`Search ${col}`}
              value={filters[col]}
              onChange={(e) => onFilterChange(col, e.target.value)}
            />
          </td>
        )
      case 'role':
      case 'status':
        return (
          <td key={col} className="p-2">
            <select
              className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
              value={filters[col]}
              onChange={(e) => onFilterChange(col, e.target.value)}
            >
              <option value="">All</option>
              {col === 'role' && ['Engineer', 'Manager', 'Designer', 'QA', 'DevOps'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              {col === 'status' && ['active', 'inactive'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </td>
        )
      case 'salary':
        return (
          <td key={col} className="p-2 flex gap-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryMin}
              onChange={(e) => onFilterChange('salaryMin', e.target.value)}
              className="w-1/2 px-1 py-1 border rounded text-sm dark:bg-gray-800"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryMax}
              onChange={(e) => onFilterChange('salaryMax', e.target.value)}
              className="w-1/2 px-1 py-1 border rounded text-sm dark:bg-gray-800"
            />
          </td>
        )
      default:
        return <td key={col}></td>
    }
  }

  return (
    <>
      <tr className="bg-gray-200 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-100">
        {visibleColumns.map((col) => renderHeader(col as keyof User))}
      </tr>
      <tr className="bg-gray-50 dark:bg-gray-900">
        {visibleColumns.map((col) => renderFilter(col as keyof User))}
      </tr>
    </>
  )
}
