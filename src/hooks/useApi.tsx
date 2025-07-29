'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, ApiResponse } from '@/types/api.types'

interface UseApiOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  cacheTime?: number
  enabled?: boolean
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
  mutate: (data: T) => void
}

// Simple cache implementation
const cache = new Map<string, { data: unknown; timestamp: number }>()

export function useApi<T = User[]>(options: UseApiOptions): UseApiResult<T> {
  const { url, method = 'GET', body, headers = {}, cacheTime = 5 * 60 * 1000, enabled = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    // Check cache first
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() })
      
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [url, method, body, headers, cacheTime, enabled])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  const mutate = useCallback((newData: T) => {
    setData(newData)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch, mutate }
}

// Specific hook for user data
export function useUsers(page: number = 1, pageSize: number = 20) {
  return useApi<ApiResponse<User>>({
    url: `/mock-data.json`,
    method: 'GET',
  })
}

// Hook for user operations
export function useUserOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, data: { ...userData, id: Date.now() } }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create user' }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: number, updates: Partial<User>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, data: { id, ...updates } }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update user' }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  }
}
