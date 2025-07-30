import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/ui/Button'
import '@testing-library/jest-dom'

describe('Button', () => {
  it('renders the button with label and default color', () => {
    render(<Button label="Click Me" onClick={() => {}} />)
    const btn = screen.getByText('Click Me')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('text-gray-600 border-gray-600')
  })

  it('calls onClick when clicked', () => {
    const mockFn = jest.fn()
    render(<Button label="Submit" onClick={mockFn} />)
    fireEvent.click(screen.getByText('Submit'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('applies the correct color styles', () => {
    const colors = {
      blue: 'text-blue-600 border-blue-600',
      red: 'text-red-600 border-red-600',
      yellow: 'text-yellow-600 border-yellow-600',
      green: 'text-green-600 border-green-600',
    }

    Object.entries(colors).forEach(([color, className]) => {
      render(<Button label={color} onClick={() => {}} color={color as unknown} />)
      expect(screen.getByText(color)).toHaveClass(className)
    })
  })
})
