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
  customRenderers?: Record<string, (value: string | number, user: User) => React.ReactNode>
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
  const [editValue, setEditValue] = useState<string | number>('')
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  const handleDoubleClick = (field: string, value: string | number) => {
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
    if (e.key === 'Enter') handleSave()
    else if (e.key === 'Escape') handleCancel()
  }

  const renderEditableCell = (field: string, value: string | number, displayValue: React.ReactNode) => {
    const commonInputClass = 'px-2 py-1 border text-sm rounded w-full bg-[var(--background)] text-[var(--foreground)]'

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
              className={commonInputClass}
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )
      } else if (field === 'salary' || field === 'joinDate' || typeof value === 'number') {
        return (
          <div className="flex gap-1">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={field === 'joinDate' ? 'date' : 'number'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className={commonInputClass}
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
              className={commonInputClass}
            />
          </div>
        )
      }
    }

    return (
      <div
        onDoubleClick={() => handleDoubleClick(field, value)}
        className={enableInlineEdit ? 'cursor-pointer hover:bg-[var(--foreground)/5] rounded p-1' : ''}
        title={enableInlineEdit ? 'Double-click to edit' : ''}
      >
        {displayValue}
      </div>
    )
  }

  const renderCell = (field: string, value: string | number) => {
    if (customRenderers[field]) return customRenderers[field](value, user)

    switch (field) {
      case 'salary':
        return renderEditableCell(field, value, `$${Number(value).toLocaleString()}`)
      case 'joinDate':
        return renderEditableCell(field, value, new Date(value).toLocaleDateString())
      case 'status':
        const statusDisplay = (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--foreground)/10] text-[var(--foreground)]">
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
      className={`border-b transition-colors hover:bg-[var(--foreground)/5] ${
        isSelected ? 'bg-[var(--foreground)/10]' : 'odd:bg-[var(--background)]'
      }`}
      style={{ height: '60px' }}
    >
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
        <td className="p-3 w-[60px] sticky left-0 z-10 bg-[var(--background)] text-[var(--foreground)]">
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
              label={enableInlineEdit ? 'Modal Edit' : 'Edit'}
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
