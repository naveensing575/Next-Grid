import { renderHook, act } from '@testing-library/react'
import { useVirtualScroll } from '@/hooks/useVirtualScroll'

describe('useVirtualScroll', () => {
  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

  it('should calculate visible range correctly on initial render', () => {
    const { result } = renderHook(() =>
      useVirtualScroll(items, {
        itemHeight: 20,
        containerHeight: 100,
        overscan: 2,
      })
    )

    expect(result.current.visibleItems).toBe(5) // 100 / 20
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(5 + 2) // visible + overscan
    expect(result.current.offsetY).toBe(0)
    expect(result.current.totalHeight).toBe(2000) // 100 * 20
  })

  it('should update scroll position and indices when scrollToIndex is called', () => {
    const { result } = renderHook(() =>
      useVirtualScroll(items, {
        itemHeight: 20,
        containerHeight: 100,
        overscan: 2,
      })
    )

    act(() => {
      result.current.scrollToIndex(10) // scrollTop = 10 * 20 = 200
    })

    expect(result.current.startIndex).toBe(8) // 10 - overscan
    expect(result.current.offsetY).toBe(160)  // 8 * 20
  })

  it('should update scroll position on handleScroll', () => {
    const { result } = renderHook(() =>
      useVirtualScroll(items, {
        itemHeight: 20,
        containerHeight: 100,
        overscan: 2,
      })
    )

    act(() => {
      result.current.handleScroll({
        currentTarget: { scrollTop: 400 },
      } as unknown as React.UIEvent<HTMLDivElement>)
    })

    expect(result.current.startIndex).toBe(18)
    expect(result.current.offsetY).toBe(360) // 18 * 20
  })
})
