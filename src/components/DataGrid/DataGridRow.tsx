import Button from '../ui/Button'

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

interface Props {
  user: User
  visibleColumns: string[]
  handleDelete: (id: number) => void
}

export default function DataGridRow({ user, visibleColumns, handleDelete }: Props) {
  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors odd:bg-gray-50 dark:odd:bg-gray-950">
      {visibleColumns.includes('id') && (
        <td className="p-3 w-12 sticky left-0 z-10 bg-white dark:bg-gray-900">{user.id}</td>
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
      {visibleColumns.includes('actions') && (
        <td className="p-3 flex gap-3">
          <Button label="View" onClick={() => alert(`Viewing ${user.name}`)} color="blue" />
          <Button label="Edit" onClick={() => alert(`Editing ${user.name}`)} color="yellow" />
          <Button label="Delete" onClick={() => handleDelete(user.id)} color="red" />
        </td>
      )}
    </tr>
  )
}
