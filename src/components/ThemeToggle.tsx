'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, color: 'text-[var(--warning)]' },
    { value: 'dark', label: 'Dark', icon: Moon, color: 'text-[var(--primary)]' },
    { value: 'system', label: 'System', icon: Monitor, color: 'text-[var(--foreground-secondary)]' },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const Icon = currentTheme.icon

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="
          relative inline-flex items-center gap-2.5
          px-5 py-2.5 rounded-2xl
          bg-[var(--background-secondary)]
          border border-[var(--border)]
          text-[var(--foreground)]
          font-medium text-sm
          transition-all duration-300 ease-out
          hover:shadow-lg hover:scale-105
          active:scale-95
          overflow-hidden
        "
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--primary-glow)] to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon with rotation animation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={currentTheme.color}
        >
          <Icon className="w-4 h-4" />
        </motion.div>

        <span className="relative z-10">{currentTheme.label}</span>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent hover:translate-x-full transition-transform duration-1000" />
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-2 w-40
              bg-[var(--background-secondary)]
              border border-[var(--border)]
              rounded-2xl
              shadow-lg
              overflow-hidden
              z-50
            "
          >
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon
              return (
                <motion.button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${theme === themeOption.value
                      ? 'bg-[var(--primary-glow)] text-[var(--primary)]'
                      : 'text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ThemeIcon className={`w-4 h-4 ${themeOption.color}`} />
                  <span>{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <motion.div
                      layoutId="activeTheme"
                      className="ml-auto w-2 h-2 rounded-full bg-[var(--primary)]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
