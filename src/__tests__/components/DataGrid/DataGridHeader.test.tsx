import { render, screen, fireEvent } from '@testing-library/react'
import DataGridHeader from '@/components/DataGrid/DataGridHeader'
import '@testing-library/jest-dom'

describe('DataGridHeader', () => {
  const baseProps = {
    onSort: jest.fn(),
    sortColumn: null,
    sortOrder: null,
    filters: {
      name: '',
      email: '',
      role: '',
      status: '',
      salaryMin: '',
      salaryMax: '',
    },
    onFilterChange: jest.fn(),
    visibleColumns: ['name', 'email', 'role', 'salary'],
    onReorder: jest.fn(),
    pinnedColumns: { left: [], right: [] },
    onPinColumn: jest.fn(),
    columnWidths: {},
    onColumnResize: jest.fn(),
    frozenColumns: [],
    onToggleFrozen: jest.fn(),
    enableBulkActions: false,
    selectedIds: [],
    onSelectAll: jest.fn(),
  }

  it('renders all visible column headers', () => {
    render(<table><thead><DataGridHeader {...baseProps} /></thead></table>)

    baseProps.visibleColumns.forEach((col) => {
      expect(screen.getByText(new RegExp(col, 'i'))).toBeInTheDocument()
    })
  })

  it('calls onSort when a sortable header is clicked', () => {
    render(<table><thead><DataGridHeader {...baseProps} /></thead></table>)

    const sortableCol = screen.getByText('Name')
    fireEvent.click(sortableCol)

    expect(baseProps.onSort).toHaveBeenCalledWith('name')
  })

  it('renders input filters for name and email', () => {
    render(<table><thead><DataGridHeader {...baseProps} /></thead></table>)

    expect(screen.getByPlaceholderText('Search name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search email')).toBeInTheDocument()
  })

  it('renders role and status select filters', () => {
    render(<table><thead><DataGridHeader {...baseProps} /></thead></table>)

    expect(screen.getByDisplayValue('All')).toBeInTheDocument()
  })
})
