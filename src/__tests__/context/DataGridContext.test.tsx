import { render, screen } from '@testing-library/react'
import { DataGridProvider, useDataGridContext } from '@/context/DataGridContext'
import '@testing-library/jest-dom'

// Dummy consumer component to test context
const ConsumerComponent = () => {
  const { state, actions } = useDataGridContext()
  return (
    <div>
      <span>Loading: {state.loading ? 'true' : 'false'}</span>
      <button onClick={() => actions.setLoading(true)}>Set Loading</button>
    </div>
  )
}

describe('DataGridProvider', () => {
  it('provides context to children', () => {
    render(
      <DataGridProvider>
        <ConsumerComponent />
      </DataGridProvider>
    )
    expect(screen.getByText(/Loading: false/i)).toBeInTheDocument()
  })

  it('throws error if useDataGridContext used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {}) // silence error log

    const BrokenComponent = () => {
      useDataGridContext()
      return <div />
    }

    expect(() => render(<BrokenComponent />)).toThrow(
      'useDataGridContext must be used within a DataGridProvider'
    )

    consoleError.mockRestore()
  })
})
