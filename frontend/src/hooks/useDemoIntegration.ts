import { useState, useCallback } from 'react'
import { demoService, type IDemoService } from '../services/demoService'
import type { DemoProbeResponse } from '../types/demo'
import { ApiError } from '../types/api'

export interface UseDemoIntegrationState {
  query: string
  validationError: string | null
  isLoading: boolean
  result: DemoProbeResponse | null
  isMockResult: boolean
  error: { message: string; code?: string } | null
  lastSubmittedQuery: string | null
}

export function useDemoIntegration(service: IDemoService = demoService) {
  const [query, setQuery] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DemoProbeResponse | null>(null)
  const [isMockResult, setIsMockResult] = useState(false)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState<string | null>(null)

  const validateInput = useCallback((value: string): string | null => {
    const trimmed = value.trim()
    if (!trimmed) {
      return 'Query cannot be empty. Please enter a valid probe string.'
    }
    if (trimmed.length < 2) {
      return 'Query must contain at least 2 characters.'
    }
    if (trimmed.length > 100) {
      return 'Query cannot exceed 100 characters.'
    }
    return null
  }, [])

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (validationError) {
        setValidationError(validateInput(value))
      }
    },
    [validateInput, validationError]
  )

  const executeProbe = useCallback(
    async (overrideQuery?: string) => {
      const targetQuery = overrideQuery ?? query
      const validation = validateInput(targetQuery)

      if (validation) {
        setValidationError(validation)
        return
      }

      setValidationError(null)
      setIsLoading(true)
      setError(null)
      setLastSubmittedQuery(targetQuery)

      try {
        const response = await service.sendProbe(targetQuery)
        setResult(response.data)
        setIsMockResult(response.isMock)
      } catch (err: unknown) {
        setResult(null)
        if (err instanceof ApiError) {
          setError({ message: err.message, code: err.code })
        } else {
          setError({ message: (err as Error)?.message || 'An unexpected failure occurred.' })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [query, service, validateInput]
  )

  const handleRetry = useCallback(() => {
    if (lastSubmittedQuery) {
      executeProbe(lastSubmittedQuery)
    }
  }, [executeProbe, lastSubmittedQuery])

  const handleReset = useCallback(() => {
    setQuery('')
    setValidationError(null)
    setResult(null)
    setError(null)
    setLastSubmittedQuery(null)
  }, [])

  return {
    query,
    validationError,
    isLoading,
    result,
    isMockResult,
    error,
    isMockMode: service.isMockMode(),
    setQuery: handleQueryChange,
    executeProbe,
    handleRetry,
    handleReset,
  }
}
