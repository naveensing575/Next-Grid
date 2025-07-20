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

export default function DataGridRow({
  user,
  visibleColumns,
}: {
  user: User
  visibleColumns: string[]
}) {
  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors odd:bg-gray-50 dark:odd:bg-gray-950">
      {visibleColumns.includes('id') && (
        <td className="p-3 sticky left-0 z-10 bg-white dark:bg-gray-900">{user.id}</td>
      )}
      {visibleColumns.includes('name') && <td className="p-3">{user.name}</td>}
      {visibleColumns.includes('email') && <td className="p-3">{user.email}</td>}
      {visibleColumns.includes('role') && <td className="p-3">{user.role}</td>}
      {visibleColumns.includes('department') && <td className="p-3">{user.department}</td>}
      {visibleColumns.includes('salary') && (
        <td className="p-3">${user.salary.toLocaleString()}</td>
      )}
      {visibleColumns.includes('joinDate') && (
        <td className="p-3">{new Date(user.joinDate).toLocaleDateString()}</td>
      )}
      {visibleColumns.includes('status') && (
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.status}
          </span>
        </td>
      )}
    </tr>
  )
}
