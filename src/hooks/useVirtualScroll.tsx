'use client'

import { useState, useMemo, useCallback } from 'react'

interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualScrollResult {
  startIndex: number
  endIndex: number
  visibleItems: number
  offsetY: number
  totalHeight: number
  scrollToIndex: (index: number) => void
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
): VirtualScrollResult {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = Math.ceil(containerHeight / itemHeight)
  const totalHeight = items.length * itemHeight

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + visibleItems + overscan,
      items.length - 1
    )

    return {
      startIndex: Math.max(0, start - overscan),
      endIndex: Math.max(0, end),
    }
  }, [scrollTop, itemHeight, visibleItems, overscan, items.length])

  const offsetY = startIndex * itemHeight

  const scrollToIndex = useCallback(
    (index: number) => {
      const targetScrollTop = index * itemHeight
      setScrollTop(targetScrollTop)
    },
    [itemHeight]
  )

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  return {
    startIndex,
    endIndex,
    visibleItems,
    offsetY,
    totalHeight,
    scrollToIndex,
    handleScroll,
  } as VirtualScrollResult & { handleScroll: (event: React.UIEvent<HTMLDivElement>) => void }
}
