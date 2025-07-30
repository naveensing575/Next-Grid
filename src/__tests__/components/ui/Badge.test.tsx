import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'
import '@testing-library/jest-dom'

describe('Badge', () => {
  it('renders active badge with correct styles and text', () => {
    render(<Badge status="active" />)
    const badge = screen.getByText('active')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100')
    expect(badge).toHaveClass('text-green-800')
  })

  it('renders inactive badge with correct styles and text', () => {
    render(<Badge status="inactive" />)
    const badge = screen.getByText('inactive')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-red-100')
    expect(badge).toHaveClass('text-red-800')
  })
})
