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

export default function DataGridRow({ user }: { user: User }) {
  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors odd:bg-gray-50 dark:odd:bg-gray-950">
      <td className="p-3">{user.id}</td>
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">{user.department}</td>
      <td className="p-3">${user.salary.toLocaleString()}</td>
      <td className="p-3">{new Date(user.joinDate).toLocaleDateString()}</td>
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
    </tr>
  )
}
