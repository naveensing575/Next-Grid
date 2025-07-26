import { ReactNode } from 'react'

interface IconButtonProps {
  label: string
  onClick: () => void
  color?: 'blue' | 'yellow' | 'red'
  children?: ReactNode
}

const colorMap = {
  blue: 'text-blue-600 hover:text-blue-800',
  yellow: 'text-yellow-600 hover:text-yellow-800',
  red: 'text-red-600 hover:text-red-800',
}

export default function IconButton({ label, onClick, color = 'blue', children }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium underline transition ${colorMap[color]}`}
      title={label}
    >
      {children ?? label}
    </button>
  )
}
