import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  label: string
  onClick: () => void
  color?: 'primary' | 'success' | 'error' | 'warning' | 'secondary'
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'ghost'
}

const colorMap = {
  solid: {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm hover:shadow-md',
    success: 'bg-[var(--success)] text-white hover:bg-[var(--success-light)] shadow-sm hover:shadow-md',
    error: 'bg-[var(--error)] text-white hover:bg-[var(--error-light)] shadow-sm hover:shadow-md',
    warning: 'bg-[var(--warning)] text-white hover:bg-[var(--warning-light)] shadow-sm hover:shadow-md',
    secondary: 'bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)] border border-[var(--border)] shadow-sm hover:shadow',
  },
  outline: {
    primary: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-glow)]',
    success: 'border-2 border-[var(--success)] text-[var(--success)] hover:bg-[var(--success-glow)]',
    error: 'border-2 border-[var(--error)] text-[var(--error)] hover:bg-[var(--error-glow)]',
    warning: 'border-2 border-[var(--warning)] text-[var(--warning)] hover:bg-[var(--warning-glow)]',
    secondary: 'border-2 border-[var(--border)] text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)]',
  },
  ghost: {
    primary: 'text-[var(--primary)] hover:bg-[var(--primary-glow)]',
    success: 'text-[var(--success)] hover:bg-[var(--success-glow)]',
    error: 'text-[var(--error)] hover:bg-[var(--error-glow)]',
    warning: 'text-[var(--warning)] hover:bg-[var(--warning-glow)]',
    secondary: 'text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)]',
  },
}

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export default function Button({
  label,
  onClick,
  color = 'secondary',
  icon: Icon,
  size = 'md',
  variant = 'solid'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        btn-premium
        inline-flex items-center justify-center
        font-medium rounded-xl
        transition-all duration-300 ease-out
        active:scale-95
        ${sizeMap[size]}
        ${colorMap[variant][color]}
      `}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{label}</span>
    </button>
  )
}
