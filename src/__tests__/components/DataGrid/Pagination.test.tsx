import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '@/components/DataGrid/Pagination'
import '@testing-library/jest-dom'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  it('renders with current and total pages', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })

  it('calls onPageChange with previous page when Prev is clicked', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    fireEvent.click(screen.getByText('Prev'))
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when Next is clicked', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    fireEvent.click(screen.getByText('Next'))
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('disables Prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('Prev')).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('Next')).toBeDisabled()
  })
})
