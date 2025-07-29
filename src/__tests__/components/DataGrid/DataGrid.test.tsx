import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import DataGrid from '@/components/DataGrid/DataGrid'
import '@testing-library/jest-dom'

// Mock fetch to return dummy users
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
          department: 'Engineering',
          salary: 60000,
          joinDate: '2022-01-01',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'User',
          department: 'Marketing',
          salary: 45000,
          joinDate: '2021-03-15',
          status: 'inactive'
        }
      ]
    })
  })
) as jest.Mock

describe('DataGrid', () => {
  it('renders loading state initially', () => {
    render(<DataGrid />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it('renders table after data loads', async () => {
    render(<DataGrid />)
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('filters data using search', async () => {
    render(<DataGrid />)
    await waitFor(() => screen.getByText('John Doe'))

    const searchInput = screen.getByPlaceholderText(/Global search/i)
    fireEvent.change(searchInput, { target: { value: 'Jane' } })

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('opens and closes the modal on view', async () => {
    render(<DataGrid />)
    await waitFor(() => screen.getByText('John Doe'))

    const viewButtons = screen.getAllByRole('button', { name: /view/i })
    fireEvent.click(viewButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/View User/i)).toBeInTheDocument()
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByText(/View User/i)).not.toBeInTheDocument()
    })
  })

  it('shows and hides column manager', async () => {
    render(<DataGrid />)
    await waitFor(() => screen.getByText('John Doe'))

    const toggleButton = screen.getByRole('button', { name: /Manage Columns/i })
    fireEvent.click(toggleButton)
    expect(screen.getByText('Manage Columns')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Hide Columns/i }))
    expect(screen.queryByText('Manage Columns')).not.toBeInTheDocument()
  })
})
