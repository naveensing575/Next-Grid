'use client'

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'w-full border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    
    const variantClasses = {
      default: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white',
      filled: 'border-gray-300 bg-gray-50 border-b-2 border-b-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
      outlined: 'border-2 border-gray-300 bg-transparent dark:border-gray-600 dark:text-white',
    }
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    }
    
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            className
          )}
          {...props}
        >
          {children}
        </select>
        {(error || helperText) && (
          <p className={clsx(
            'mt-1 text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
