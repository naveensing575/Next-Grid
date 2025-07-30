import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import '@testing-library/jest-dom'

// Helper component for testing hook access
function ThemeToggleTester() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Resolved: {resolvedTheme}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to system and applies system theme', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })

    render(
      <ThemeProvider>
        <ThemeToggleTester />
      </ThemeProvider>
    )

    expect(screen.getByText(/Theme: system/i)).toBeInTheDocument()
    expect(screen.getByText(/Resolved: dark/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
  })

  it('sets theme to light and updates DOM + localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggleTester />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText('Light'))

    expect(screen.getByText(/Theme: light/i)).toBeInTheDocument()
    expect(screen.getByText(/Resolved: light/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('sets theme to dark and updates DOM + localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggleTester />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText('Dark'))

    expect(screen.getByText(/Theme: dark/i)).toBeInTheDocument()
    expect(screen.getByText(/Resolved: dark/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('reacts to system preference change when theme is system', () => {
    let match = false
    const mediaListeners: Record<string, () => void> = {}

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: match,
      addEventListener: (_event: string, cb: () => void) => {
        mediaListeners[query] = cb
      },
      removeEventListener: jest.fn(),
    }))

    render(
      <ThemeProvider>
        <ThemeToggleTester />
      </ThemeProvider>
    )

    // Simulate system theme change
    act(() => {
      match = true
      mediaListeners['(prefers-color-scheme: dark)']()
    })

    expect(screen.getByText(/Resolved: dark/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')

    act(() => {
      match = false
      mediaListeners['(prefers-color-scheme: dark)']()
    })

    expect(screen.getByText(/Resolved: light/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('light')
  })
})
