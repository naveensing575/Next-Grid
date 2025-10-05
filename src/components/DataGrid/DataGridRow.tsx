'use client'

import { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import { Eye, Edit, Trash2, Mail, Briefcase, Building2, DollarSign, Calendar, CheckCircle2, XCircle } from 'lucide-react'

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
      case 'email':
        return renderEditableCell(field, value, (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[var(--foreground-secondary)] flex-shrink-0" />
            <a href={`mailto:${value}`} className="text-[var(--primary)] hover:underline truncate">
              {value}
            </a>
          </div>
        ))
      case 'role':
        return renderEditableCell(field, value, (
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[var(--foreground-secondary)] flex-shrink-0" />
            <span className="truncate">{value}</span>
          </div>
        ))
      case 'department':
        return renderEditableCell(field, value, (
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[var(--foreground-secondary)] flex-shrink-0" />
            <span className="truncate">{value}</span>
          </div>
        ))
      case 'salary':
        return renderEditableCell(field, value, (
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0" />
            <span className="font-semibold text-[var(--foreground)]">
              ${Number(value).toLocaleString()}
            </span>
          </div>
        ))
      case 'joinDate':
        return renderEditableCell(field, value, (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--foreground-secondary)] flex-shrink-0" />
            <span className="text-[var(--foreground-secondary)]">
              {new Date(value).toLocaleDateString()}
            </span>
          </div>
        ))
      case 'status':
        const isActive = value === 'active'
        const statusDisplay = (
          <div className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            ) : (
              <XCircle className="w-4 h-4 text-[var(--foreground-secondary)]" />
            )}
            <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${isActive
                ? 'bg-[var(--success-glow)] text-[var(--success)]'
                : 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]'}
            `}>
              {value}
            </span>
          </div>
        )
        return renderEditableCell(field, value, statusDisplay)
      default:
        return renderEditableCell(field, value, value)
    }
  }

  return (
    <tr
      className={`
        border-b border-[var(--divider)]
        transition-all duration-200
        hover:bg-[var(--primary-glow)]
        ${isSelected ? 'bg-[var(--primary-glow)] shadow-sm' : ''}
      `}
      style={{ height: '64px' }}
    >
      {onSelect && (
        <td className="px-4 py-3 w-[60px] text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(user.id, e.target.checked)}
            className="
              w-4 h-4 rounded
              border-2 border-[var(--border)]
              text-[var(--primary)]
              focus:ring-2 focus:ring-[var(--primary-glow)]
              transition-all duration-200
              cursor-pointer
            "
          />
        </td>
      )}

      {visibleColumns.includes('id') && (
        <td className="px-4 py-3 w-[80px] font-semibold text-[var(--foreground-secondary)] text-sm">
          #{user.id}
        </td>
      )}

      {visibleColumns.includes('name') && (
        <td className="px-4 py-3 min-w-[200px] max-w-[250px]">
          <div className="font-medium text-[var(--foreground)]">
            {renderCell('name', user.name)}
          </div>
        </td>
      )}

      {visibleColumns.includes('email') && (
        <td className="px-4 py-3 min-w-[220px] max-w-[280px]">
          {renderCell('email', user.email)}
        </td>
      )}

      {visibleColumns.includes('role') && (
        <td className="px-4 py-3 min-w-[140px] max-w-[180px]">
          {renderCell('role', user.role)}
        </td>
      )}

      {visibleColumns.includes('department') && (
        <td className="px-4 py-3 min-w-[150px] max-w-[180px]">
          {renderCell('department', user.department)}
        </td>
      )}

      {visibleColumns.includes('salary') && (
        <td className="px-4 py-3 min-w-[140px] max-w-[160px]">
          {renderCell('salary', user.salary)}
        </td>
      )}

      {visibleColumns.includes('joinDate') && (
        <td className="px-4 py-3 min-w-[150px] max-w-[170px]">
          {renderCell('joinDate', user.joinDate)}
        </td>
      )}

      {visibleColumns.includes('status') && (
        <td className="px-4 py-3 min-w-[130px] max-w-[150px]">
          {renderCell('status', user.status)}
        </td>
      )}

      {visibleColumns.includes('actions') && (
        <td className="px-4 py-3 min-w-[200px] sticky right-0 bg-[var(--background-secondary)]">
          <div className="flex gap-2">
            <Button
              label="View"
              onClick={onView}
              color="secondary"
              size="sm"
              variant="ghost"
              icon={Eye}
            />
            <Button
              label="Edit"
              onClick={onEdit}
              color="primary"
              size="sm"
              variant="ghost"
              icon={Edit}
            />
            <Button
              label="Delete"
              onClick={() => handleDelete(user.id)}
              color="error"
              size="sm"
              variant="ghost"
              icon={Trash2}
            />
          </div>
        </td>
      )}
    </tr>
  )
}
