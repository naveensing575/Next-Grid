'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'

interface ColumnManagerProps {
  allColumns: string[]
  visibleColumns: string[]
  onToggle: (col: string) => void
  onReorder?: (newOrder: string[]) => void
  pinnedColumns?: { left: string[], right: string[] }
  onPinColumn?: (col: string, side: 'left' | 'right' | null) => void
  frozenColumns?: string[]
  onToggleFrozen?: (col: string) => void
}

export default function ColumnManager({
  allColumns,
  visibleColumns,
  onToggle,
  onReorder,
  pinnedColumns = { left: [], right: [] },
  onPinColumn = () => {},
  frozenColumns = [],
  onToggleFrozen = () => {},
}: ColumnManagerProps) {
  const [activeTab, setActiveTab] = useState<'visibility' | 'pinning' | 'freezing'>('visibility')

  const getPinnedSide = (col: string) => {
    if (pinnedColumns.left.includes(col)) return 'left'
    if (pinnedColumns.right.includes(col)) return 'right'
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded border bg-white dark:bg-gray-800 shadow-md mb-4 max-h-96 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base">Manage Columns</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('visibility')}
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'visibility'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Visibility
          </button>
          <button
            onClick={() => setActiveTab('pinning')}
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'pinning'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Pinning
          </button>
          <button
            onClick={() => setActiveTab('freezing')}
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'freezing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Freezing
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'visibility' && (
          <motion.div
            key="visibility"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
          >
            {allColumns.map((col) => (
              <motion.label
                key={col}
                className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col)}
                  onChange={() => col !== 'id' && onToggle(col)}
                  disabled={col === 'id'}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="capitalize">{col}</span>
                {col === 'id' && (
                  <span className="text-xs text-gray-500">(Required)</span>
                )}
              </motion.label>
            ))}
          </motion.div>
        )}

        {activeTab === 'pinning' && (
          <motion.div
            key="pinning"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleColumns.map((col) => {
                const pinnedSide = getPinnedSide(col)
                return (
                  <motion.div
                    key={col}
                    className="flex items-center justify-between p-2 rounded border bg-gray-50 dark:bg-gray-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="capitalize text-sm">{col}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onPinColumn(col, pinnedSide === 'left' ? null : 'left')}
                        className={`px-2 py-1 text-xs rounded ${
                          pinnedSide === 'left'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Pin Left
                      </button>
                      <button
                        onClick={() => onPinColumn(col, pinnedSide === 'right' ? null : 'right')}
                        className={`px-2 py-1 text-xs rounded ${
                          pinnedSide === 'right'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Pin Right
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'freezing' && (
          <motion.div
            key="freezing"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleColumns.map((col) => {
                const isFrozen = frozenColumns.includes(col)
                return (
                  <motion.div
                    key={col}
                    className="flex items-center justify-between p-2 rounded border bg-gray-50 dark:bg-gray-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="capitalize text-sm">{col}</span>
                    <button
                      onClick={() => onToggleFrozen(col)}
                      className={`px-3 py-1 text-xs rounded ${
                        isFrozen
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
