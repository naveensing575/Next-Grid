'use client'

interface ColumnManagerProps {
  allColumns: string[]
  visibleColumns: string[]
  onToggle: (col: string) => void
}

export default function ColumnManager({
  allColumns,
  visibleColumns,
  onToggle,
}: ColumnManagerProps) {
  return (
    <div className="p-4 rounded border bg-white dark:bg-gray-800 shadow-md mb-4 max-h-72 overflow-y-auto">
      <h3 className="font-semibold mb-3 text-base">Manage Columns</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {allColumns.map((col) => (
          <label
            key={col}
            className="flex items-center gap-2 text-sm cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => onToggle(col)}
              className="accent-blue-500 w-4 h-4"
            />
            <span className="capitalize">{col}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
