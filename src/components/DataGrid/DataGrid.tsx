'use client'

import { useEffect, useState } from 'react'
import DataGridHeader from './DataGridHeader'
import DataGridRow from './DataGridRow'

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/mock-data.json')
      const json = await res.json()
      setData(json.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <p className="text-center">Loading...</p>

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead>
          <DataGridHeader />
        </thead>
        <tbody>
          {data.map((user) => (
            <DataGridRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
