import DataGrid from '@/components/DataGrid/DataGrid'

export default function HomePage() {
  return (
    <main className="p-6 bg-white min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Zuperscore Data Grid
      </h1>
      <DataGrid />
    </main>
  )
}
