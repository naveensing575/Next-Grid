'use client'

import { useState, useRef, useEffect } from 'react'
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
  onView: () => void
  onEdit: () => void
  onUpdate?: (id: number, updatedUser: Partial<User>) => void
  isSelected?: boolean
  onSelect?: (id: number, selected: boolean) => void
  enableInlineEdit?: boolean
  customRenderers?: Record<string, (value: any, user: User) => React.ReactNode>
}

export default function DataGridRow({
  user,
  visibleColumns,
  handleDelete,
  onView,
  onEdit,
  onUpdate,
  isSelected = false,
  onSelect,
  enableInlineEdit = false,
  customRenderers = {},
}: Props) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<any>('')
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  const handleDoubleClick = (field: string, value: any) => {
    if (!enableInlineEdit || !onUpdate) return
    setEditingField(field)
    setEditValue(value)
  }

  const handleSave = () => {
    if (editingField && onUpdate) {
      onUpdate(user.id, { [editingField]: editValue })
    }
    setEditingField(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const renderEditableCell = (field: string, value: any, displayValue: React.ReactNode) => {
    if (editingField === field) {
      if (field === 'role' || field === 'status') {
        const options = field === 'role' 
          ? ['Engineer', 'Manager', 'Designer', 'QA', 'DevOps']
          : ['active', 'inactive']
        
        return (
          <div className="flex gap-1">
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border text-sm rounded w-full dark:bg-gray-800"
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )
      } else if (field === 'salary') {
        return (
          <div className="flex gap-1">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border text-sm rounded w-full dark:bg-gray-800"
            />
          </div>
        )
      } else if (field === 'joinDate') {
        return (
          <div className="flex gap-1">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border text-sm rounded w-full dark:bg-gray-800"
            />
          </div>
        )
      } else {
        return (
          <div className="flex gap-1">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border text-sm rounded w-full dark:bg-gray-800"
            />
          </div>
        )
      }
    }

    return (
      <div
        onDoubleClick={() => handleDoubleClick(field, value)}
        className={enableInlineEdit ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1' : ''}
        title={enableInlineEdit ? 'Double-click to edit' : ''}
      >
        {displayValue}
      </div>
    )
  }

  const renderCell = (field: string, value: any) => {
    // Check for custom renderer first
    if (customRenderers[field]) {
      return customRenderers[field](value, user)
    }

    // Default renderers
    switch (field) {
      case 'salary':
        return renderEditableCell(field, value, `$${value.toLocaleString()}`)
      case 'joinDate':
        return renderEditableCell(field, value, new Date(value).toLocaleDateString())
      case 'status':
        const statusDisplay = (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {value}
          </span>
        )
        return renderEditableCell(field, value, statusDisplay)
      default:
        return renderEditableCell(field, value, value)
    }
  }

  return (
    <tr 
      className={`border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'odd:bg-gray-50 dark:odd:bg-gray-950'
      }`} 
      style={{ height: '60px' }}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <td className="p-3 w-[50px]">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(user.id, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
      )}
      
      {visibleColumns.includes('id') && (
        <td className="p-3 w-[60px] sticky left-0 z-10 bg-white dark:bg-gray-900">
          {user.id}
        </td>
      )}
      
      {visibleColumns.includes('name') && (
        <td className="p-3">{renderCell('name', user.name)}</td>
      )}
      
      {visibleColumns.includes('email') && (
        <td className="p-3">{renderCell('email', user.email)}</td>
      )}
      
      {visibleColumns.includes('role') && (
        <td className="p-3">{renderCell('role', user.role)}</td>
      )}
      
      {visibleColumns.includes('department') && (
        <td className="p-3">{renderCell('department', user.department)}</td>
      )}
      
      {visibleColumns.includes('salary') && (
        <td className="p-3">{renderCell('salary', user.salary)}</td>
      )}
      
      {visibleColumns.includes('joinDate') && (
        <td className="p-3">{renderCell('joinDate', user.joinDate)}</td>
      )}
      
      {visibleColumns.includes('status') && (
        <td className="p-3">{renderCell('status', user.status)}</td>
      )}
      
      {visibleColumns.includes('actions') && (
        <td className="p-3">
          <div className="flex flex-wrap gap-2">
            <Button label="View" onClick={onView} color="blue" />
            <Button 
              label={enableInlineEdit ? "Modal Edit" : "Edit"} 
              onClick={onEdit} 
              color="yellow" 
            />
            <Button label="Delete" onClick={() => handleDelete(user.id)} color="red" />
          </div>
        </td>
      )}
    </tr>
  )
}
