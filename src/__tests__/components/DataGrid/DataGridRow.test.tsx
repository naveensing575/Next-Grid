import { render, screen, fireEvent } from '@testing-library/react'
import DataGridRow from '@/components/DataGrid/DataGridRow'
import '@testing-library/jest-dom'

const mockUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'Engineer',
  department: 'Engineering',
  salary: 100000,
  joinDate: '2023-01-01',
  status: 'active',
}

describe('DataGridRow', () => {
  const props = {
    user: mockUser,
    visibleColumns: ['id', 'name', 'email', 'role', 'department', 'salary', 'joinDate', 'status', 'actions'],
    handleDelete: jest.fn(),
    onView: jest.fn(),
    onEdit: jest.fn(),
    onUpdate: jest.fn(),
    isSelected: false,
    onSelect: jest.fn(),
    enableInlineEdit: false,
    customRenderers: {},
  }

  it('renders all visible columns', () => {
    render(<table><tbody><DataGridRow {...props} /></tbody></table>)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('$100,000')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls handleDelete when Delete button is clicked', () => {
    render(<table><tbody><DataGridRow {...props} /></tbody></table>)
    fireEvent.click(screen.getByText('Delete'))
    expect(props.handleDelete).toHaveBeenCalledWith(mockUser.id)
  })

  it('calls onView when View button is clicked', () => {
    render(<table><tbody><DataGridRow {...props} /></tbody></table>)
    fireEvent.click(screen.getByText('View'))
    expect(props.onView).toHaveBeenCalled()
  })

  it('calls onEdit when Edit button is clicked', () => {
    render(<table><tbody><DataGridRow {...props} /></tbody></table>)
    fireEvent.click(screen.getByText('Edit'))
    expect(props.onEdit).toHaveBeenCalled()
  })

  it('toggles checkbox if onSelect is passed', () => {
    render(<table><tbody><DataGridRow {...props} /></tbody></table>)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(props.onSelect).toHaveBeenCalledWith(mockUser.id, true)
  })
})
