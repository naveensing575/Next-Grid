interface Props {
  onSort: (col: keyof User) => void
  sortColumn: keyof User | null
  sortOrder: 'asc' | 'desc' | null
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

export default function DataGridHeader({ onSort, sortColumn, sortOrder }: Props) {
  const getIcon = (col: keyof User) => {
    if (sortColumn !== col) return ''
    return sortOrder === 'asc' ? ' ▲' : sortOrder === 'desc' ? ' ▼' : ''
  }

  return (
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
  )
}
