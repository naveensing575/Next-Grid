import { renderHook, act } from '@testing-library/react'
import { useGridPreferences } from '@/hooks/useLocalStorage'

describe('useGridPreferences', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGridPreferences())

    expect(result.current.columnOrder).toEqual([])
    expect(result.current.visibleColumns).toEqual([])
    expect(result.current.columnWidths).toEqual({})
    expect(result.current.pinnedColumns).toEqual({ left: [], right: [] })
    expect(result.current.frozenColumns).toEqual([])
    expect(result.current.density).toBe('standard')
    expect(result.current.enableInlineEdit).toBe(false)
    expect(result.current.enableBulkActions).toBe(true)
    expect(result.current.useVirtualization).toBe(true)
  })

  it('should allow updating preferences', () => {
    const { result } = renderHook(() => useGridPreferences())

    act(() => {
      result.current.setDensity('compact')
      result.current.setEnableInlineEdit(true)
      result.current.setVisibleColumns(['id', 'name'])
    })

    expect(result.current.density).toBe('compact')
    expect(result.current.enableInlineEdit).toBe(true)
    expect(result.current.visibleColumns).toEqual(['id', 'name'])
  })
})
