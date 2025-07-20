'use client'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm mt-1 font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
