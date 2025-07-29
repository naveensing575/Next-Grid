import VirtualizedDataGrid from '@/components/DataGrid/VirtualizedDataGrid'
import ThemeToggle from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <main className="p-6 bg-background min-h-screen text-foreground transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Zuperscore Data Grid
        </h1>
        <ThemeToggle />
      </div>
      <VirtualizedDataGrid />
    </main>
  )
}
