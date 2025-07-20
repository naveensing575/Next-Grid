interface Props {
  onSort: (col: keyof User) => void
  sortColumn: keyof User | null
  sortOrder: 'asc' | 'desc' | null
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
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
}: Props) {
  const getIcon = (col: keyof User) => {
    if (sortColumn !== col) return ''
    return sortOrder === 'asc' ? ' ▲' : sortOrder === 'desc' ? ' ▼' : ''
  }

  return (
    <>
      <tr className="bg-gray-200 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-100">
        <th className="p-3 font-semibold">ID</th>
        <th
          className="p-3 font-semibold cursor-pointer select-none"
          onClick={() => onSort('name')}
        >
          Name{getIcon('name')}
        </th>
        <th className="p-3 font-semibold">Email</th>
        <th
          className="p-3 font-semibold cursor-pointer select-none"
          onClick={() => onSort('role')}
        >
          Role{getIcon('role')}
        </th>
        <th className="p-3 font-semibold">Department</th>
        <th
          className="p-3 font-semibold cursor-pointer select-none"
          onClick={() => onSort('salary')}
        >
          Salary{getIcon('salary')}
        </th>
        <th className="p-3 font-semibold">Join Date</th>
        <th className="p-3 font-semibold">Status</th>
      </tr>

      {/* Filter Row */}
      <tr className="bg-gray-50 dark:bg-gray-900">
        <td></td>
        <td className="p-2">
          <input
            className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
            placeholder="Search name"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
          />
        </td>
        <td className="p-2">
          <input
            className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
            placeholder="Search email"
            value={filters.email}
            onChange={(e) => onFilterChange('email', e.target.value)}
          />
        </td>
        <td className="p-2">
          <select
            className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
          >
            <option value="">All</option>
            <option value="Engineer">Engineer</option>
            <option value="Manager">Manager</option>
            <option value="Designer">Designer</option>
            <option value="QA">QA</option>
            <option value="DevOps">DevOps</option>
          </select>
        </td>
        <td></td>
        <td className="p-2 flex gap-1">
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
        <td></td>
        <td className="p-2">
          <select
            className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </td>
      </tr>
    </>
  )
}
