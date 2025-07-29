import { render, screen, fireEvent } from '@testing-library/react'
import ColumnManager from '@/components/DataGrid/ColumnManager'

describe('ColumnManager', () => {
  const defaultProps = {
    allColumns: ['id', 'name', 'email'],
    visibleColumns: ['id', 'name', 'email'],
    onToggle: jest.fn(),
    onPinColumn: jest.fn(),
    pinnedColumns: { left: ['id'], right: [] },
    onToggleFrozen: jest.fn(),
    frozenColumns: ['email']
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default Visibility tab active', () => {
    render(<ColumnManager {...defaultProps} />)
    expect(screen.getByText('Manage Columns')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toHaveClass('bg-blue-500 text-white')
    expect(screen.getByText('id')).toBeInTheDocument()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('disables visibility toggle for `id` column', () => {
    render(<ColumnManager {...defaultProps} />)
    const checkbox = screen.getByLabelText('id') as HTMLInputElement
    expect(checkbox.disabled).toBe(true)
  })

  it('calls onToggle when other column checkboxes are toggled', () => {
    render(<ColumnManager {...defaultProps} />)
    const nameCheckbox = screen.getByLabelText('name') as HTMLInputElement
    fireEvent.click(nameCheckbox)
    expect(defaultProps.onToggle).toHaveBeenCalledWith('name')
  })

  it('switches to Pinning tab and handles pin actions', () => {
    render(<ColumnManager {...defaultProps} />)
    fireEvent.click(screen.getByText('Pinning'))

    expect(screen.getByText('Pin Left')).toBeInTheDocument()
    fireEvent.click(screen.getAllByText('Pin Left')[1]) // index 1 = for 'name'
    expect(defaultProps.onPinColumn).toHaveBeenCalledWith('name', 'left')
  })

  it('switches to Freezing tab and toggles freeze', () => {
    render(<ColumnManager {...defaultProps} />)
    fireEvent.click(screen.getByText('Freezing'))

    expect(screen.getByText('Unfreeze')).toBeInTheDocument() // 'email' is frozen
    fireEvent.click(screen.getByText('Unfreeze'))
    expect(defaultProps.onToggleFrozen).toHaveBeenCalledWith('email')
  })

  it('freezes a column if not frozen yet', () => {
    const modifiedProps = {
      ...defaultProps,
      frozenColumns: [] // email not frozen initially
    }

    render(<ColumnManager {...modifiedProps} />)
    fireEvent.click(screen.getByText('Freezing'))

    const freezeBtn = screen.getByText('Freeze')
    expect(freezeBtn).toBeInTheDocument()

    fireEvent.click(freezeBtn)
    expect(modifiedProps.onToggleFrozen).toHaveBeenCalledWith('email')
  })
})
