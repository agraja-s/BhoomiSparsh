import { describe, it, expect } from 'vitest'
import { DemoService } from '../services/demoService'
import { ApiClient } from '../lib/api/client'
import { DemoMockAdapter } from '../mocks/demoMock'
import { ApiError } from '../types/api'

describe('DemoService', () => {
  it('processes probe in mock mode with structured output', async () => {
    const service = new DemoService(new ApiClient(), new DemoMockAdapter(5), true)
    expect(service.isMockMode()).toBe(true)

    const result = await service.sendProbe('Integration test query')
    expect(result.isMock).toBe(true)
    expect(result.data.status).toBe('processed')
    expect(result.data.receivedQuery).toBe('Integration test query')
    expect(result.data.transformedMetrics.wordsCount).toBe(3)
  })

  it('handles simulated error in mock mode deterministically', async () => {
    const service = new DemoService(new ApiClient(), new DemoMockAdapter(5), true)

    await expect(service.sendProbe('trigger-error')).rejects.toThrow(ApiError)
  })

  it('rejects empty query in mock mode', async () => {
    const service = new DemoService(new ApiClient(), new DemoMockAdapter(5), true)

    await expect(service.sendProbe('   ')).rejects.toThrow('Input query cannot be empty.')
  })
})
