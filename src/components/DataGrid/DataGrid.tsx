'use client'

import { useEffect, useState } from 'react'
import DataGridHeader from './DataGridHeader'
import DataGridRow from './DataGridRow'
import Pagination from './Pagination'

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

export default function DataGrid() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
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

  const filteredData = data.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (loading) return <p className="text-center">Loading...</p>

  return (
    <div className="overflow-auto border rounded-xl bg-white dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full max-w-xs px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <DataGridHeader />
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => (
              <DataGridRow key={user.id} user={user} />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
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
