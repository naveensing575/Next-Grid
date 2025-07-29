import { render, screen, fireEvent } from '@testing-library/react'
import BulkActions from '@/components/DataGrid/BulkActions'

describe('BulkActions', () => {
  const baseProps = {
    selectedIds: [1, 2, 3],
    totalCount: 10,
    onClearSelection: jest.fn(),
    onBulkDelete: jest.fn(),
    onBulkStatusChange: jest.fn(),
    onBulkExport: jest.fn(),
  }

  it('renders if selectedIds exist', () => {
    render(<BulkActions {...baseProps} />)
    expect(screen.getByText('3 of 10 items selected')).toBeInTheDocument()
  })

  it('calls onClearSelection when clicked', () => {
    render(<BulkActions {...baseProps} />)
    fireEvent.click(screen.getByText(/Clear selection/i))
    expect(baseProps.onClearSelection).toHaveBeenCalled()
  })
})
