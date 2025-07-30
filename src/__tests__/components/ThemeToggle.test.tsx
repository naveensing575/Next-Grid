import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '@/components/ThemeToggle'
import '@testing-library/jest-dom'

// Mock useTheme from next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

describe('ThemeToggle', () => {
  it('renders theme select with correct options', () => {
    render(<ThemeToggle />)
    expect(screen.getByDisplayValue('Light')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Light')
    expect(screen.getByRole('combobox')).toHaveTextContent('Light')
    expect(screen.getByRole('combobox')).toHaveTextContent('Dark')
    expect(screen.getByRole('combobox')).toHaveTextContent('System')
  })

  it('calls setTheme on select change', () => {
    const setThemeMock = jest.fn()

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('next-themes')).useTheme = () => ({
      theme: 'light',
      setTheme: setThemeMock,
    })

    render(<ThemeToggle />)

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'dark' },
    })

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })
})
