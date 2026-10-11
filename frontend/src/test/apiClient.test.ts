import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiClient } from '../lib/api/client'
import { ApiError } from '../types/api'

describe('ApiClient', () => {
  let client: ApiClient

  beforeEach(() => {
    client = new ApiClient('http://localhost:5000', 1000)
    vi.restoreAllMocks()
  })

  it('initializes with normalized base URL', () => {
    expect(client.getBaseUrl()).toBe('http://localhost:5000')
    const trailingClient = new ApiClient('http://localhost:5000///')
    expect(trailingClient.getBaseUrl()).toBe('http://localhost:5000')
  })

  it('handles successful JSON response', async () => {
    const mockData = { status: 'ok', data: 123 }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: (h: string) => (h.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockData,
    }) as unknown as typeof fetch

    const res = await client.get('/api/test')
    expect(res).toEqual(mockData)
  })

  it('throws normalized ApiError on HTTP 400 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: {
        get: (h: string) => (h.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: async () => ({
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid payload provided.',
        },
      }),
    }) as unknown as typeof fetch

    await expect(client.post('/api/test', {})).rejects.toThrow(ApiError)
  })

  it('throws network failure error when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch')) as unknown as typeof fetch

    await expect(client.get('/api/unreachable')).rejects.toThrow(/Backend connection failed/i)
  })
})
