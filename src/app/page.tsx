import VirtualizedDataGrid from '@/components/DataGrid/VirtualizedDataGrid'
import ThemeToggle from '@/components/ThemeToggle'
import { LayoutGrid } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border)] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-3.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-md">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
                  Next Grid
                </h1>
                <p className="text-[10px] text-[var(--foreground-secondary)]">
                  Advanced data table
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <VirtualizedDataGrid />
      </div>
    </main>
  )
}
