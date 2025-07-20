'use client'

interface ColumnManagerProps {
  allColumns: string[]
  visibleColumns: string[]
  onToggle: (col: string) => void
}

export default function ColumnManager({ allColumns, visibleColumns, onToggle }: ColumnManagerProps) {
  return (
    <div className="p-4 rounded border bg-white dark:bg-gray-800 shadow-md mb-4">
      <h3 className="font-semibold mb-2">Toggle Columns</h3>
      <div className="grid grid-cols-2 gap-2">
        {allColumns.map((col) => (
          <label key={col} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => onToggle(col)}
              className="accent-blue-500"
            />
            <span className="capitalize">{col}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
